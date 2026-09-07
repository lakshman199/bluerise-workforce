import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { DataSource } from 'typeorm';

import { ContactSubmission } from './contact.entity';
import { ContactService } from './contact.service';

function loadEnvironmentFile(): void {
  const candidates = [
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), '../../.env'),
    resolve(__dirname, '../../../../.env'),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      process.loadEnvFile(candidate);
      return;
    }
  }
}

loadEnvironmentFile();

const describePersistence = process.env.DATABASE_URL ? describe : describe.skip;

describePersistence('ContactService persistence', () => {
  let dataSource: DataSource;
  let service: ContactService;

  beforeAll(async () => {
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
    const table = (await dataSource.query(
      `SELECT to_regclass('public.contact_submissions') AS name`,
    )) as [{ name: string | null }];
    if (!table[0]?.name) {
      pending('contact_submissions has not been migrated yet');
      return;
    }

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
