import { Logger } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { SupportTicket } from './support-ticket.entity';
import { SupportService } from './support.service';

function makeRepository(
  overrides: Partial<Repository<SupportTicket>> = {},
): Repository<SupportTicket> {
  return {
    create: jest.fn((value: Partial<SupportTicket>) => value as SupportTicket),
    save: jest.fn(async (value: SupportTicket) => ({
      ...value,
      id: '33333333-3333-4333-8333-333333333333',
      createdAt: new Date('2026-09-12T02:39:00.000Z'),
      updatedAt: new Date('2026-09-12T02:39:00.000Z'),
    })),
    ...overrides,
  } as Repository<SupportTicket>;
}

describe('SupportService', () => {
  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('persists an open ticket and never claims email delivery', async () => {
    const repository = makeRepository();
    const service = new SupportService(repository);

    const receipt = await service.create(
      {
        name: 'Alex Rivera',
        email: 'Alex.Rivera@Example.com',
        phone: '+1 202 555 0147',
        message: 'Please tell me how employer services work.',
        consent: true,
      },
      { ip: '203.0.113.10', userAgent: 'BlueRiseSupportTest/1.0' },
    );

    expect(receipt.stored).toBe(true);
    expect(receipt.emailed).toBe(false);
    expect(receipt.status).toBe('open');
    expect(receipt.id).toBe('33333333-3333-4333-8333-333333333333');
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'alex.rivera@example.com',
        status: 'open',
        source: 'support_assistant',
        phone: '+1 202 555 0147',
        sourceIpHash: expect.stringMatching(/^[a-f0-9]{64}$/),
        userAgent: 'BlueRiseSupportTest/1.0',
      }),
    );
    expect(repository.save).toHaveBeenCalled();
  });

  it('does not log the message body or personal details', async () => {
    const log = jest.spyOn(Logger.prototype, 'log');
    const service = new SupportService(makeRepository());

    await service.create({
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      phone: '+1 202 555 0147',
      message: 'This private support message must not appear in logs.',
      consent: true,
    });

    const serialised = JSON.stringify(log.mock.calls);
    expect(serialised).not.toContain('This private support message');
    expect(serialised).not.toContain('alex.rivera@example.com');
    expect(serialised).not.toContain('Alex Rivera');
    expect(serialised).not.toContain('+1 202 555 0147');
    expect(serialised).toContain('33333333-3333-4333-8333-333333333333');
    expect(serialised).toContain('open');
    expect(serialised).toContain('support_assistant');
  });

  it('stores a null phone and hashed IP only when those values exist', async () => {
    const repository = makeRepository();
    const service = new SupportService(repository);

    await service.create({
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
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
