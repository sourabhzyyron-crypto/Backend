import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  name!: string;

  @IsEmail()
  @MaxLength(100)
  @Transform(({ value }) => value?.toLowerCase().trim())
  email!: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  password!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\+?[1-9]\d{9,14}$/, {
    message: 'Phone must be a valid international number (e.g. +911234567890)',
  })
  phone!: string;
}
