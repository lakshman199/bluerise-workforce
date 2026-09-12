import { ApiProperty } from '@nestjs/swagger';
import type { SupportTicketReceipt } from '@bluerise/shared-types';

export class SupportTicketReceiptDto implements SupportTicketReceipt {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: '2026-09-12T02:39:00.000Z' })
  receivedAt: string;

  @ApiProperty({
    example: true,
    description: 'The ticket was stored. This is not a delivery confirmation.',
  })
  stored: true;

  @ApiProperty({
    example: false,
    description: 'Email is not sent until a mail provider is configured.',
  })
  emailed: false;

  @ApiProperty({ example: 'open', enum: ['open'] })
  status: 'open';
}
