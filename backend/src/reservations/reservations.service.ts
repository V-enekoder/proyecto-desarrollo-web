import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Reservation } from "./entities/reservation.entity.js";
import {
  CreateReservationDto,
  UpdateReservationDto,
} from "./reservation.dto.js";

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
  ) {}

  async create(dto: CreateReservationDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Creamos e insertamos la Reserva
      const reservation = this.reservationRepo.create({
        ...dto,
        user: { id: dto.userId } as any,
        laboratory: { id: dto.laboratoryId } as any,
        type: { id: dto.typeId } as any,
        state: { id: dto.stateId } as any,
      });
      const savedReservation = await queryRunner.manager.save(reservation);

      // 2. Generar las fechas de las ocupaciones
      const dates = this.generateOcupationDates(
        dto.startDate,
        dto.endDate,
        dto.rrule,
      );

      // 3. Crear los objetos de Ocupación
      const ocupations = dates.map((date) => {
        return queryRunner.manager.create(Ocupation, {
          date: date,
          startHour: dto.defaultStartTime,
          endHour: dto.defaultEndTime,
          reservation: savedReservation,
          active: true,
        });
      });

      // 4. Guardar todas las ocupaciones
      await queryRunner.manager.save(Ocupation, ocupations);

      // Si todo salió bien, confirmamos los cambios
      await queryRunner.commitTransaction();

      // Retornamos la reserva con sus ocupaciones
      return savedReservation;
    } catch (error) {
      // Si algo falla (ej: choque de horario por el índice UNIQUE), deshacemos todo
      await queryRunner.rollbackTransaction();

      if (error.code === "23505") {
        throw new ConflictException(
          "El laboratorio ya está ocupado en una de las fechas seleccionadas.",
        );
      }
      throw new InternalServerErrorException(
        "Error al crear la reserva y sus ocupaciones",
      );
    } finally {
      await queryRunner.release();
    }
  }

  // Función auxiliar para calcular las fechas
  private generateOcupationDates(
    start: string,
    end?: string,
    rruleStr?: string,
  ): Date[] {
    const startDate = new Date(start);

    // Si no hay rrule, solo es una ocupación el día de inicio
    if (!rruleStr) {
      return [startDate];
    }

    try {
      const ruleOptions = RRule.parseString(rruleStr);
      ruleOptions.dtstart = startDate;

      // Si hay fecha de fin, la añadimos a la regla
      if (end) {
        ruleOptions.until = new Date(end);
      } else {
        // Si no hay fin, limitamos por seguridad (ej: máximo 15 ocurrencias o 3 meses)
        ruleOptions.count = 12;
      }

      const rule = new RRule(ruleOptions);
      return rule.all();
    } catch (e) {
      // Si el rrule es inválido, devolvemos al menos la fecha de inicio
      return [startDate];
    }
  }

  async findAll() {
    return await this.reservationRepo.find({
      relations: [
        "user",
        "laboratory",
        "type",
        "state",
        "classInstance",
        "event",
      ],
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: number) {
    const reservation = await this.reservationRepo.findOne({
      where: { id },
      relations: [
        "user",
        "laboratory",
        "type",
        "state",
        "ocupations",
        "classInstance",
        "event",
      ],
    });

    if (!reservation)
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    return reservation;
  }

  async update(id: number, dto: UpdateReservationDto) {
    const reservation = await this.findOne(id);

    if (dto.userId) reservation.user = { id: dto.userId } as any;
    if (dto.laboratoryId)
      reservation.laboratory = { id: dto.laboratoryId } as any;
    if (dto.typeId) reservation.type = { id: dto.typeId } as any;
    if (dto.stateId) reservation.state = { id: dto.stateId } as any;

    this.reservationRepo.merge(reservation, dto);
    return await this.reservationRepo.save(reservation);
  }

  async remove(id: number) {
    const reservation = await this.findOne(id);
    return await this.reservationRepo.remove(reservation);
  }
}
