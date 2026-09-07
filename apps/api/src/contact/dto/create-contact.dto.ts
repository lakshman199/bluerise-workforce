import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CONTACT_SUBJECTS,
  type ContactSubject,
  type CreateContactRequest,
} from '@bluerise/shared-types';
import { Transform } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const CONTACT_PHONE_PATTERN = /^[+\d().\-\s]{7,32}$/;

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

export class CreateContactDto implements CreateContactRequest {
  @ApiProperty({ example: 'Alex', maxLength: 80 })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  firstName: string;

  @ApiProperty({ example: 'Rivera', maxLength: 80 })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  lastName: string;

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
  @Matches(CONTACT_PHONE_PATTERN, {
    message: 'phone must use digits, spaces, or + ( ) - .',
  })
  phone?: string;

  @ApiProperty({ enum: CONTACT_SUBJECTS, example: 'General Inquiry' })
  @IsIn([...CONTACT_SUBJECTS])
  subject: ContactSubject;

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
