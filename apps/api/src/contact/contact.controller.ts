import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';

import { ContactService } from './contact.service';
import { ContactSubmissionReceiptDto } from './dto/contact-submission-receipt.dto';
import { CreateContactDto } from './dto/create-contact.dto';

@ApiTags('Contact')
@Controller({ path: 'contact', version: '1' })
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Store a public contact inquiry',
    description:
      'Persists a valid submission. No email is sent until a mail provider is configured, and the receipt never claims delivery.',
  })
  @ApiCreatedResponse({ type: ContactSubmissionReceiptDto })
  create(
    @Body() body: CreateContactDto,
    @Req() request: Request,
  ): Promise<ContactSubmissionReceiptDto> {
    return this.contactService.create(body, {
      ip: request.ip,
      userAgent:
        typeof request.headers['user-agent'] === 'string'
          ? request.headers['user-agent']
          : undefined,
    });
  }
}
