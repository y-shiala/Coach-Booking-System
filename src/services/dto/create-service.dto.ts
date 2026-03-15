import { IsString, IsNumber, IsOptional, IsMongoId, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(1) 
  duration: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsMongoId() 
  staffId: string;
}