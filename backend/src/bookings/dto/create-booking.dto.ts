import { IsString, IsDateString, IsMongoId } from 'class-validator';

export class CreateBookingDto {
  @IsMongoId()
  serviceId: string;


  @IsDateString()
  startTime: string;
}