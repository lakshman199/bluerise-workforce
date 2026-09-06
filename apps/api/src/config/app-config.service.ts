import { Injectable } from '@nestjs/common';

import type {
  AppConfig,
  Configuration,
  DatabaseConfig,
  LoggingConfig,
  RateLimitConfig,
} from './configuration';

/**
 * Typed accessor over the validated configuration.
 *
 * Nest's `ConfigService.get<T>()` returns `T | undefined`, which invites a non-null
 * assertion at every call site. Resolving the whole configuration once and exposing it
 * through this service means consumers get fully typed values with no optionality to work
 * around, and the environment is read in exactly one place.
 */
@Injectable()
export class AppConfigService {
  constructor(private readonly configuration: Configuration) {}

  get app(): AppConfig {
    return this.configuration.app;
  }

  get database(): DatabaseConfig {
    return this.configuration.database;
  }

  get logging(): LoggingConfig {
    return this.configuration.logging;
  }

  get rateLimit(): RateLimitConfig {
    return this.configuration.rateLimit;
  }

  get isProductionLike(): boolean {
    const { environment } = this.configuration.app;
    return environment === 'production' || environment === 'staging';
  }
}
