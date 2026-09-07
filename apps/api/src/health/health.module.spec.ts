import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AppConfigService } from '../config/app-config.service';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

/**
 * Resolves the module through Nest's injector rather than constructing the classes by
 * hand, so it fails if a provider's constructor metadata is missing.
 *
 * That is not hypothetical: an ESLint autofix once rewrote injected dependencies to
 * type-only imports, which erases `design:paramtypes` and breaks the application at boot
 * while every hand-constructed unit test still passes.
 */
describe('HealthModule wiring', () => {
  it('resolves the controller and its dependencies through the injector', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthService,
        {
          provide: AppConfigService,
          useValue: { environment: 'test', version: '0.1.0' },
        },
        { provide: getDataSourceToken(), useValue: { isInitialized: true } },
        { provide: DataSource, useValue: { isInitialized: true } },
      ],
    }).compile();

    expect(moduleRef.get(HealthController)).toBeInstanceOf(HealthController);
    expect(moduleRef.get(HealthService)).toBeInstanceOf(HealthService);
  });
});
