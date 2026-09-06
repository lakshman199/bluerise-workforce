import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { DataSource } from 'typeorm';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

/**
 * The TypeORM CLI data source.
 *
 * The CLI runs outside Nest's DI container, so it loads the environment itself. Node's
 * built-in `loadEnvFile` covers this without adding a dotenv dependency that only the CLI
 * would use.
 */
function loadEnvironmentFile(): void {
  const candidates = [
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), '../../.env'),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      process.loadEnvFile(candidate);
      return;
    }
  }
}

loadEnvironmentFile();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not set. Copy .env.example to .env and fill it in before running migrations.',
  );
}

// Typed as the Postgres options rather than the `DataSourceOptions` union so that spreading
// it into the Nest factory keeps every property narrowed to its Postgres form.
export const dataSourceOptions: PostgresConnectionOptions = {
  type: 'postgres',
  url: databaseUrl,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,

  // Never enabled, in any environment. Schema changes ship as reviewed migrations; see
  // docs/database/migrations.md. This is a literal rather than a configurable value so
  // there is no environment variable that can switch it on.
  synchronize: false,

  // Migrations are run as a deliberate step (or from the container entrypoint before the
  // server accepts traffic), never implicitly on connect.
  migrationsRun: false,

  entities: [`${__dirname}/../**/*.entity.{ts,js}`],
  migrations: [`${__dirname}/migrations/*.{ts,js}`],
  migrationsTableName: 'bluerise_migrations',
  logging: process.env.DATABASE_LOG_QUERIES === 'true' ? ['query', 'error'] : ['error'],
};

export default new DataSource(dataSourceOptions);
