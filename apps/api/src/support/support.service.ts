import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { SupportTicketReceipt, SupportTicketRequest } from '@bluerise/shared-types';
import { createHash } from 'node:crypto';
import { Repository } from 'typeorm';

import { SupportTicket } from './support-ticket.entity';

const USER_AGENT_MAX_LENGTH = 512;

export interface SupportRequestMeta {
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class SupportService {
  private readonly logger = new Logger(SupportService.name);

  constructor(
    @InjectRepository(SupportTicket)
    private readonly tickets: Repository<SupportTicket>,
  ) {}

  async create(
    input: SupportTicketRequest,
    meta: SupportRequestMeta = {},
  ): Promise<SupportTicketReceipt> {
    const ticket = this.tickets.create({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim() ? input.phone.trim() : null,
      message: input.message.trim(),
      consentedAt: new Date(),
      sourceIpHash: hashIp(meta.ip),
      userAgent: truncateUserAgent(meta.userAgent),
      status: 'open',
      source: 'support_assistant',
    });

    const saved = await this.tickets.save(ticket);

    // Persist the ticket only. Do not log names, email, phone, or the message body.
    this.logger.log(
      `Support ticket stored (${saved.id}, ${saved.status}, ${saved.source})`,
    );

    return {
      id: saved.id,
      receivedAt: (saved.createdAt ?? new Date()).toISOString(),
      stored: true,
      emailed: false,
      status: 'open',
    };
  }
}

function hashIp(ip: string | undefined): string | null {
  if (!ip) {
    return null;
  }
  return createHash('sha256').update(ip).digest('hex');
}

function truncateUserAgent(userAgent: string | undefined): string | null {
  if (!userAgent) {
    return null;
  }
  return userAgent.slice(0, USER_AGENT_MAX_LENGTH);
}
