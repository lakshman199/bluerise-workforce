import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DataSource } from 'typeorm';

import { ContactSubmission } from './contact.entity';
import { ContactService } from './contact.service';

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

describe('ContactService persistence', () => {
  let dataSource: DataSource;
  let service: ContactService;

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
      entities: [ContactSubmission],
      synchronize: false,
      logging: false,
    });
    await dataSource.initialize();
    service = new ContactService(dataSource.getRepository(ContactSubmission));
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('writes a valid submission to PostgreSQL without claiming email delivery', async () => {
    const receipt = await service.create({
      firstName: 'Persistence',
      lastName: 'Check',
      email: 'persistence.check@example.com',
      subject: 'Partnership',
      message: 'Stored only. No email should be sent for this inquiry.',
      consent: true,
    });

    expect(receipt.stored).toBe(true);
    expect(receipt.emailed).toBe(false);

    const row = await dataSource.getRepository(ContactSubmission).findOneByOrFail({
      id: receipt.id,
    });

    expect(row.email).toBe('persistence.check@example.com');
    expect(row.subject).toBe('Partnership');
    expect(row.status).toBe('received');
    expect(row.phone).toBeNull();
    expect(row.message).toContain('Stored only');

    await dataSource.getRepository(ContactSubmission).delete({ id: receipt.id });
  });
});
