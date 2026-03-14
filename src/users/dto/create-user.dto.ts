import { IsString, IsEmail, IsEnum, IsOptional, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum UserRole {
  COACH = 'coach',
  CUSTOMER = 'customer',
}

class AvailabilityDto {
  @IsOptional()
  @IsString({ each: true })
  monday?: string[];

  @IsOptional()
  @IsString({ each: true })
  tuesday?: string[];

  @IsOptional()
  @IsString({ each: true })
  wednesday?: string[];

  @IsOptional()
  @IsString({ each: true })
  thursday?: string[];

  @IsOptional()
  @IsString({ each: true })
  friday?: string[];

  @IsOptional()
  @IsString({ each: true })
  saturday?: string[];

  @IsOptional()
  @IsString({ each: true })
  sunday?: string[];
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  price_per_hour?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => AvailabilityDto)
  availability?: AvailabilityDto;
}