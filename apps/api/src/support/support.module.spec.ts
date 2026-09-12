import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { SupportTicket } from './support-ticket.entity';

describe('SupportModule wiring', () => {
  it('resolves the controller and its dependencies through the injector', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SupportController],
      providers: [
        SupportService,
        {
          provide: getRepositoryToken(SupportTicket),
          useValue: { create: jest.fn(), save: jest.fn() },
        },
      ],
    }).compile();

    expect(moduleRef.get(SupportController)).toBeInstanceOf(SupportController);
    expect(moduleRef.get(SupportService)).toBeInstanceOf(SupportService);
  });
});
