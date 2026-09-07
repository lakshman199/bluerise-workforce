import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { ContactSubject, ContactSubmissionStatus } from '@bluerise/shared-types';

@Entity({ name: 'contact_submissions' })
export class ContactSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', type: 'varchar', length: 80 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 80 })
  lastName: string;

  @Column({ type: 'varchar', length: 254 })
  email: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 64 })
  subject: ContactSubject;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'consented_at', type: 'timestamptz' })
  consentedAt: Date;

  @Column({ name: 'source_ip_hash', type: 'varchar', length: 64, nullable: true })
  sourceIpHash: string | null;

  @Column({ name: 'user_agent', type: 'varchar', length: 512, nullable: true })
  userAgent: string | null;

  @Column({ type: 'varchar', length: 32, default: 'received' })
  status: ContactSubmissionStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
