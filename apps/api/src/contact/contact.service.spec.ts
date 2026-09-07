import { Logger } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { ContactSubmission } from './contact.entity';
import { ContactService } from './contact.service';

function makeRepository(
  overrides: Partial<Repository<ContactSubmission>> = {},
): Repository<ContactSubmission> {
  return {
    create: jest.fn((value: Partial<ContactSubmission>) => value as ContactSubmission),
    save: jest.fn(async (value: ContactSubmission) => ({
      ...value,
      id: '11111111-1111-4111-8111-111111111111',
      createdAt: new Date('2026-09-07T04:43:00.000Z'),
      updatedAt: new Date('2026-09-07T04:43:00.000Z'),
    })),
    ...overrides,
  } as Repository<ContactSubmission>;
}

describe('ContactService', () => {
  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('persists a received submission and never claims email delivery', async () => {
    const repository = makeRepository();
    const service = new ContactService(repository);

    const receipt = await service.create(
      {
        firstName: 'Alex',
        lastName: 'Rivera',
        email: 'Alex.Rivera@Example.com',
        phone: '+1 202 555 0147',
        subject: 'General Inquiry',
        message: 'Please tell me how employer services work.',
        consent: true,
      },
      { ip: '203.0.113.10', userAgent: 'BlueRiseContactTest/1.0' },
    );

    expect(receipt.stored).toBe(true);
    expect(receipt.emailed).toBe(false);
    expect(receipt.id).toBe('11111111-1111-4111-8111-111111111111');
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'alex.rivera@example.com',
        status: 'received',
        phone: '+1 202 555 0147',
        sourceIpHash: expect.stringMatching(/^[a-f0-9]{64}$/),
        userAgent: 'BlueRiseContactTest/1.0',
      }),
    );
    expect(repository.save).toHaveBeenCalled();
  });

  it('does not log the message body or contact details', async () => {
    const log = jest.spyOn(Logger.prototype, 'log');
    const service = new ContactService(makeRepository());

    await service.create({
      firstName: 'Alex',
      lastName: 'Rivera',
      email: 'alex.rivera@example.com',
      subject: 'Benefits',
      message: 'This private message must not appear in logs.',
      consent: true,
    });

    const serialised = JSON.stringify(log.mock.calls);
    expect(serialised).not.toContain('This private message');
    expect(serialised).not.toContain('alex.rivera@example.com');
    expect(serialised).not.toContain('Alex');
    expect(serialised).toContain('11111111-1111-4111-8111-111111111111');
    expect(serialised).toContain('Benefits');
  });

  it('stores a null phone and hashed IP only when those values exist', async () => {
    const repository = makeRepository();
    const service = new ContactService(repository);

    await service.create({
      firstName: 'Alex',
      lastName: 'Rivera',
      email: 'alex.rivera@example.com',
      subject: 'Other',
      message: 'A message long enough to store.',
      consent: true,
    });

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        phone: null,
        sourceIpHash: null,
        userAgent: null,
      }),
    );
  });
});
