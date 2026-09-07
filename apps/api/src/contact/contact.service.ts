import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type {
  ContactSubmissionReceipt,
  CreateContactRequest,
} from '@bluerise/shared-types';
import { createHash } from 'node:crypto';
import { Repository } from 'typeorm';

import { ContactSubmission } from './contact.entity';

const USER_AGENT_MAX_LENGTH = 512;

export interface ContactRequestMeta {
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectRepository(ContactSubmission)
    private readonly submissions: Repository<ContactSubmission>,
  ) {}

  async create(
    input: CreateContactRequest,
    meta: ContactRequestMeta = {},
  ): Promise<ContactSubmissionReceipt> {
    const submission = this.submissions.create({
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim() ? input.phone.trim() : null,
      subject: input.subject,
      message: input.message.trim(),
      consentedAt: new Date(),
      sourceIpHash: hashIp(meta.ip),
      userAgent: truncateUserAgent(meta.userAgent),
      status: 'received',
    });

    const saved = await this.submissions.save(submission);

    // Persist the inquiry only. Do not log names, email, phone, or the message body.
    this.logger.log(
      `Contact submission stored (${saved.id}, ${saved.subject}, ${saved.status})`,
    );

    return {
      id: saved.id,
      receivedAt: (saved.createdAt ?? new Date()).toISOString(),
      stored: true,
      emailed: false,
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
