import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Establishes the extensions every later migration depends on.
 *
 * No domain tables are created here. Each table is created by the migration belonging to
 * the phase that first reads or writes it, so the schema never contains something no code
 * touches. See ADR-0004 in docs/architecture/decisions.md.
 *
 * `pgcrypto` supplies `gen_random_uuid()`, which is the default for every primary key in
 * the entity map.
 */
export class InitialExtensions1788700000000 implements MigrationInterface {
  name = 'InitialExtensions1788700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Dropping the extension would break any later migration that has already run against
    // this database, so reverting the baseline is intentionally a no-op beyond a guard.
    const [{ count }] = (await queryRunner.query(
      `SELECT count(*)::int AS count
         FROM information_schema.columns
        WHERE column_default LIKE '%gen_random_uuid%'`,
    )) as [{ count: number }];

    if (count === 0) {
      await queryRunner.query('DROP EXTENSION IF EXISTS "pgcrypto"');
    }
  }
}
