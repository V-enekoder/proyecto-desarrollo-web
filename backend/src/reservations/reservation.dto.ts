import { OmitType, PartialType } from "@nestjs/mapped-types";
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  rrule?: string;
  
  @IsString()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)$/)
  defaultStartTime: string;
  
  @IsString()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)$/)
  defaultEndTime: string;
  
  @IsInt()
  laboratoryId: number;
  
  @IsInt()
  typeId: number;
  
  @IsInt()
  stateId: number;

  @IsString()
  @IsOptional()
  userId?: string;
}

export class UpdateReservationDto extends PartialType(
  OmitType(CreateReservationDto, ["stateId"]),
) {
  @IsString()
  @IsOptional()
  userId?: string;
}
