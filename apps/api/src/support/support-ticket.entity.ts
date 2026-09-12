import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { SupportTicketSource, SupportTicketStatus } from '@bluerise/shared-types';

@Entity({ name: 'support_tickets' })
export class SupportTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 254 })
  email: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  phone: string | null;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', length: 32, default: 'open' })
  status: SupportTicketStatus;

  @Column({ type: 'varchar', length: 64, default: 'support_assistant' })
  source: SupportTicketSource;

  @Column({ name: 'consented_at', type: 'timestamptz' })
  consentedAt: Date;

  @Column({ name: 'source_ip_hash', type: 'varchar', length: 64, nullable: true })
  sourceIpHash: string | null;

  @Column({ name: 'user_agent', type: 'varchar', length: 512, nullable: true })
  userAgent: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
