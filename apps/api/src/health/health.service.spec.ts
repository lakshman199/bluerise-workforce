import { Logger } from '@nestjs/common';
import type { DataSource } from 'typeorm';

import { AppConfigService } from '../config/app-config.service';
import { buildConfiguration } from '../config/configuration';
import { validateEnvironment } from '../config/environment.schema';
import { HealthService } from './health.service';

function makeConfig(): AppConfigService {
  return new AppConfigService(
    buildConfiguration(
      validateEnvironment({
        DATABASE_URL: 'postgresql://bluerise:secret@localhost:5432/bluerise_dev',
        APP_NAME: 'bluerise-api',
        APP_VERSION: '0.1.0',
      }),
    ),
  );
}

interface DataSourceStub {
  isInitialized: boolean;
  query: jest.Mock;
  showMigrations: jest.Mock;
  migrations: unknown[];
  options: { migrationsTableName: string };
}

function makeDataSource(overrides: Partial<DataSourceStub> = {}): DataSourceStub {
  return {
    isInitialized: true,
    query: jest.fn().mockResolvedValue([{ count: 1 }]),
    showMigrations: jest.fn().mockResolvedValue(false),
    migrations: [{}],
    options: { migrationsTableName: 'bluerise_migrations' },
    ...overrides,
  };
}

function makeService(dataSource: DataSourceStub): HealthService {
  return new HealthService(makeConfig(), dataSource as unknown as DataSource);
}

describe('HealthService', () => {
  beforeEach(() => {
    // The failure paths log at error level by design; keep the test output readable.
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('liveness', () => {
    it('reports ok without touching the database', () => {
      const dataSource = makeDataSource();
      const result = makeService(dataSource).getLiveness();

      expect(result.status).toBe('ok');
      expect(dataSource.query).not.toHaveBeenCalled();
    });
  });

  describe('readiness', () => {
    it('is ok when the database responds and no migrations are pending', async () => {
      const result = await makeService(makeDataSource()).getReadiness();

      expect(result.status).toBe('ok');
      expect(result.pendingMigrations).toBe(0);
      expect(result.dependencies.map((d) => d.name)).toEqual(['postgres', 'migrations']);
    });

    it('is degraded when a migration has not been applied', async () => {
      const dataSource = makeDataSource({
        showMigrations: jest.fn().mockResolvedValue(true),
        query: jest.fn().mockResolvedValue([{ count: 1 }]),
        migrations: [{}, {}, {}],
      });

      const result = await makeService(dataSource).getReadiness();

      expect(result.status).toBe('degraded');
      expect(result.pendingMigrations).toBe(2);
    });

    it('is down when the database rejects the probe', async () => {
      const dataSource = makeDataSource({
        query: jest.fn().mockRejectedValue(new Error('connection refused')),
        showMigrations: jest.fn().mockRejectedValue(new Error('connection refused')),
      });

      const result = await makeService(dataSource).getReadiness();

      expect(result.status).toBe('down');
    });

    it('is down when the data source was never initialised', async () => {
      const result = await makeService(
        makeDataSource({ isInitialized: false }),
      ).getReadiness();

      expect(result.status).toBe('down');
    });

    it('never leaks the underlying database error to the caller', async () => {
      const secret = 'postgresql://bluerise:hunter2@db-primary:5432/bluerise';
      const dataSource = makeDataSource({
        query: jest.fn().mockRejectedValue(new Error(`could not connect to ${secret}`)),
        showMigrations: jest.fn().mockRejectedValue(new Error(`could not connect`)),
      });

      const result = await makeService(dataSource).getReadiness();

      const serialised = JSON.stringify(result);
      expect(serialised).not.toContain('hunter2');
      expect(serialised).not.toContain('db-primary');
    });
  });

  describe('health', () => {
    it('reports service identity alongside dependency state', async () => {
      const result = await makeService(makeDataSource()).getHealth();

      expect(result.service).toBe('bluerise-api');
      expect(result.version).toBe('0.1.0');
      expect(result.environment).toBe('development');
      expect(result.uptimeSeconds).toBeGreaterThanOrEqual(0);
      expect(result.status).toBe('ok');
    });
  });
});
