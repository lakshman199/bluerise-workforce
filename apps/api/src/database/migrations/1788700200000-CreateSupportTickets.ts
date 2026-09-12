import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Public support tickets collected from the BlueRise Support Assistant.
 *
 * There is no public read path. Tickets stay in PostgreSQL until a later
 * administrative surface exists. Email delivery is intentionally out of scope.
 */
export class CreateSupportTickets1788700200000 implements MigrationInterface {
  name = 'CreateSupportTickets1788700200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "support_tickets" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" character varying(120) NOT NULL,
        "email" character varying(254) NOT NULL,
        "phone" character varying(32),
        "message" text NOT NULL,
        "status" character varying(32) NOT NULL DEFAULT 'open',
        "source" character varying(64) NOT NULL DEFAULT 'support_assistant',
        "consented_at" TIMESTAMPTZ NOT NULL,
        "source_ip_hash" character varying(64),
        "user_agent" character varying(512),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "support_tickets_status_check"
          CHECK ("status" IN ('open', 'in_progress', 'resolved', 'closed')),
        CONSTRAINT "support_tickets_source_check"
          CHECK ("source" IN ('support_assistant'))
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "support_tickets_created_at_idx"
        ON "support_tickets" ("created_at" DESC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "support_tickets"');
  }
}
