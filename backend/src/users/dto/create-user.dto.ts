import { IsString, IsEmail, IsEnum, IsOptional, IsNumber, IsObject, ValidateNested, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../../common/enums/user-role.enums';
import { IsStrongPassword } from 'class-validator';

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

  @IsString()
  @MinLength(6)
  password: string;


  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  price_per_hour?: number;

  @IsOptional()
  @IsObject()
  availability?: Record<string, string[]>;
}