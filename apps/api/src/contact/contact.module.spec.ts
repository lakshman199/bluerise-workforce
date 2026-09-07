import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ContactController } from './contact.controller';
import { ContactSubmission } from './contact.entity';
import { ContactService } from './contact.service';

describe('ContactModule wiring', () => {
  it('resolves the controller and its dependencies through the injector', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [
        ContactService,
        {
          provide: getRepositoryToken(ContactSubmission),
          useValue: { create: jest.fn(), save: jest.fn() },
        },
      ],
    }).compile();

    expect(moduleRef.get(ContactController)).toBeInstanceOf(ContactController);
    expect(moduleRef.get(ContactService)).toBeInstanceOf(ContactService);
  });
});
