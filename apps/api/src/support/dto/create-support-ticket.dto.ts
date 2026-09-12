import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { SupportTicketRequest } from '@bluerise/shared-types';
import { Transform } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const SUPPORT_PHONE_PATTERN = /^[+\d().\-\s]{7,32}$/;

function trimString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

function trimOptionalString(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

export class CreateSupportTicketDto implements SupportTicketRequest {
  @ApiProperty({ example: 'Alex Rivera', maxLength: 120 })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'alex.rivera@example.com', maxLength: 254 })
  @Transform(({ value }) => trimString(value))
  @IsEmail()
  @MaxLength(254)
  email: string;

  @ApiPropertyOptional({ example: '+1 202 555 0147', maxLength: 32 })
  @Transform(({ value }) => trimOptionalString(value))
  @IsOptional()
  @IsString()
  @MaxLength(32)
  @Matches(SUPPORT_PHONE_PATTERN, {
    message: 'phone must use digits, spaces, or + ( ) - .',
  })
  phone?: string;

  @ApiProperty({ minLength: 10, maxLength: 4000 })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @MinLength(10)
  @MaxLength(4000)
  message: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @Equals(true, { message: 'consent must be accepted' })
  consent: boolean;
}
