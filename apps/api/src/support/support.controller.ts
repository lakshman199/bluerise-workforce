import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';

import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { SupportTicketReceiptDto } from './dto/support-ticket-receipt.dto';
import { SupportService } from './support.service';

@ApiTags('Support')
@Controller({ path: 'support/tickets', version: '1' })
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Store a support ticket from the BlueRise Support Assistant',
    description:
      'Persists a valid ticket. No email is sent until a mail provider is configured, and the receipt never claims delivery. There is no public list or read path.',
  })
  @ApiCreatedResponse({ type: SupportTicketReceiptDto })
  create(
    @Body() body: CreateSupportTicketDto,
    @Req() request: Request,
  ): Promise<SupportTicketReceiptDto> {
    return this.supportService.create(body, {
      ip: request.ip,
      userAgent:
        typeof request.headers['user-agent'] === 'string'
          ? request.headers['user-agent']
          : undefined,
    });
  }
}
