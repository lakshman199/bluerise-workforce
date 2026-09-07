import { ApiProperty } from '@nestjs/swagger';
import type { ContactSubmissionReceipt } from '@bluerise/shared-types';

export class ContactSubmissionReceiptDto implements ContactSubmissionReceipt {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: '2026-09-07T04:43:00.000Z' })
  receivedAt: string;

  @ApiProperty({
    example: true,
    description: 'The inquiry was stored. This is not a delivery confirmation.',
  })
  stored: true;

  @ApiProperty({
    example: false,
    description: 'Email is not sent until a mail provider is configured.',
  })
  emailed: false;
}
