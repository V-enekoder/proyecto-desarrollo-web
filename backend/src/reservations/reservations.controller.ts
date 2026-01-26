import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import {
  Paginate,
  PaginatedSwaggerDocs,
  type PaginateQuery,
} from "nestjs-paginate";
import { Auth } from "../auth/decorators/auth.decorator.js";
import { Reservation } from "./entities/reservation.entity.js";
import {
  CreateReservationDto,
  UpdateReservationDto,
} from "./reservation.dto.js";
import {
  RESERVATION_PAGINATION_CONFIG,
  ReservationsService,
} from "./reservations.service.js";

@Auth()
@Controller("reservations")
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Get()
  @PaginatedSwaggerDocs(Reservation, RESERVATION_PAGINATION_CONFIG)
  search(@Paginate() query: PaginateQuery) {
    return this.reservationsService.search(query);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.reservationsService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.reservationsService.remove(id);
  }
}
