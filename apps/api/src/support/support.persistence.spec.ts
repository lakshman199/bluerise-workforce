import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DataSource } from 'typeorm';

import { SupportTicket } from './support-ticket.entity';
import { SupportService } from './support.service';

function findEnvironmentFile(): string | undefined {
  const starts = [process.cwd(), __dirname];

  for (const start of starts) {
    let directory = start;
    for (let depth = 0; depth < 8; depth += 1) {
      const candidate = resolve(directory, '.env');
      if (existsSync(candidate)) {
        return candidate;
      }
      directory = resolve(directory, '..');
    }
  }

  return undefined;
}

function applyEnvironmentFile(path: string): void {
  const lines = readFileSync(path, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const separator = trimmed.indexOf('=');
    if (separator <= 0) {
      continue;
    }
    const key = trimmed.slice(0, separator);
    const raw = trimmed.slice(separator + 1);
    const value = raw.replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const environmentFile = findEnvironmentFile();
if (environmentFile) {
  applyEnvironmentFile(environmentFile);
}

describe('SupportService persistence', () => {
  let dataSource: DataSource;
  let service: SupportService;

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        `DATABASE_URL is not set (cwd=${process.cwd()} dirname=${__dirname} envFile=${environmentFile ?? 'none'})`,
      );
    }

    dataSource = new DataSource({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
      entities: [SupportTicket],
      synchronize: false,
      logging: false,
    });
    await dataSource.initialize();
    service = new SupportService(dataSource.getRepository(SupportTicket));
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('writes a valid ticket to PostgreSQL with status open', async () => {
    const receipt = await service.create({
      name: 'Persistence Check',
      email: 'support.persistence@example.com',
      message: 'Stored only. No email should be sent for this ticket.',
      consent: true,
    });

    expect(receipt.stored).toBe(true);
    expect(receipt.emailed).toBe(false);
    expect(receipt.status).toBe('open');

    const row = await dataSource.getRepository(SupportTicket).findOneByOrFail({
      id: receipt.id,
    });

    expect(row.email).toBe('support.persistence@example.com');
    expect(row.status).toBe('open');
    expect(row.source).toBe('support_assistant');
    expect(row.phone).toBeNull();
    expect(row.message).toContain('Stored only');

    await dataSource.getRepository(SupportTicket).delete({ id: receipt.id });
  });
});
