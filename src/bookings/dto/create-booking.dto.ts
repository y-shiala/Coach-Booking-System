import { IsString, IsDateString } from 'class-validator';

export class CreateBookingDto {

  @IsString()
  serviceId: string;

  @IsDateString()
  startTime: string;
}