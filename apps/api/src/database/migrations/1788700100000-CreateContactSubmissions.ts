import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Public contact inquiries collected from /contact.
 *
 * There is no public read path. Submissions stay in PostgreSQL until a later
 * administrative surface exists. Email delivery is intentionally out of scope.
 */
export class CreateContactSubmissions1788700100000 implements MigrationInterface {
  name = 'CreateContactSubmissions1788700100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "contact_submissions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "first_name" character varying(80) NOT NULL,
        "last_name" character varying(80) NOT NULL,
        "email" character varying(254) NOT NULL,
        "phone" character varying(32),
        "subject" character varying(64) NOT NULL,
        "message" text NOT NULL,
        "consented_at" TIMESTAMPTZ NOT NULL,
        "source_ip_hash" character varying(64),
        "user_agent" character varying(512),
        "status" character varying(32) NOT NULL DEFAULT 'received',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "contact_submissions_status_check" CHECK ("status" IN ('received'))
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "contact_submissions_created_at_idx"
        ON "contact_submissions" ("created_at" DESC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "contact_submissions"');
  }
}
