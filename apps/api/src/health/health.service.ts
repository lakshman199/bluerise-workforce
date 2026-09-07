import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type {
  DependencyHealth,
  HealthResponse,
  HealthStatus,
  LivenessResponse,
  ReadinessResponse,
} from '@bluerise/shared-types';
import { type DataSource } from 'typeorm';

import { type AppConfigService } from '../config/app-config.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private readonly config: AppConfigService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  /** Process liveness only. Never touches a dependency, so a database outage cannot cause
   * an orchestrator to restart an otherwise healthy container. */
  getLiveness(): LivenessResponse {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  async getReadiness(): Promise<ReadinessResponse> {
    const database = await this.checkDatabase();
    const migrations = await this.checkMigrations();

    return {
      status: worstStatus([database.health.status, migrations.health.status]),
      timestamp: new Date().toISOString(),
      dependencies: [database.health, migrations.health],
      pendingMigrations: migrations.pending,
    };
  }

  async getHealth(): Promise<HealthResponse> {
    const database = await this.checkDatabase();
    const migrations = await this.checkMigrations();

    return {
      status: worstStatus([database.health.status, migrations.health.status]),
      service: this.config.app.name,
      version: this.config.app.version,
      environment: this.config.app.environment,
      uptimeSeconds: Math.round(process.uptime() * 10) / 10,
      timestamp: new Date().toISOString(),
      dependencies: [database.health, migrations.health],
    };
  }

  private async checkDatabase(): Promise<{ health: DependencyHealth }> {
    const startedAt = performance.now();

    try {
      if (!this.dataSource.isInitialized) {
        return {
          health: {
            name: 'postgres',
            status: 'down',
            durationMs: elapsed(startedAt),
            detail: 'The data source is not initialised.',
          },
        };
      }

      await this.dataSource.query('SELECT 1');

      return {
        health: {
          name: 'postgres',
          status: 'ok',
          durationMs: elapsed(startedAt),
          detail: 'Connected.',
        },
      };
    } catch (error) {
      // The message can contain a host, port, and user name, so it is logged rather than
      // returned. A health endpoint is frequently exposed more widely than the API itself.
      this.logger.error({ err: error }, 'Database health probe failed');
      return {
        health: {
          name: 'postgres',
          status: 'down',
          durationMs: elapsed(startedAt),
          detail: 'The database did not respond to a connectivity probe.',
        },
      };
    }
  }

  private async checkMigrations(): Promise<{
    health: DependencyHealth;
    pending: number;
  }> {
    const startedAt = performance.now();

    try {
      if (!this.dataSource.isInitialized) {
        return {
          health: {
            name: 'migrations',
            status: 'down',
            durationMs: elapsed(startedAt),
            detail: 'Cannot be determined while the database is unreachable.',
          },
          pending: -1,
        };
      }

      // `showMigrations` returns true when at least one migration has not been applied.
      const hasPending = await this.dataSource.showMigrations();
      const applied = await this.dataSource.query<{ count: number }[]>(
        `SELECT count(*)::int AS count FROM "${this.dataSource.options.migrationsTableName ?? 'migrations'}"`,
      );
      const appliedCount = applied[0]?.count ?? 0;
      const pending = Math.max(0, this.dataSource.migrations.length - appliedCount);

      return {
        health: {
          name: 'migrations',
          status: hasPending ? 'degraded' : 'ok',
          durationMs: elapsed(startedAt),
          detail: hasPending
            ? `${pending} migration(s) pending. The running schema is behind the deployed code.`
            : `${appliedCount} migration(s) applied. Schema is up to date.`,
        },
        pending,
      };
    } catch (error) {
      this.logger.error({ err: error }, 'Migration health probe failed');
      return {
        health: {
          name: 'migrations',
          status: 'down',
          durationMs: elapsed(startedAt),
          detail: 'Migration state could not be read.',
        },
        pending: -1,
      };
    }
  }
}

function elapsed(startedAt: number): number {
  return Math.round((performance.now() - startedAt) * 10) / 10;
}

function worstStatus(statuses: HealthStatus[]): HealthStatus {
  if (statuses.includes('down')) return 'down';
  if (statuses.includes('degraded')) return 'degraded';
  return 'ok';
}
