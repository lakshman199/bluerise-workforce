import { envToList, type AppEnvironment } from '@bluerise/shared-config';

import type { ValidatedEnvironment } from './environment.schema';

export interface AppConfig {
  environment: AppEnvironment;
  name: string;
  version: string;
  port: number;
  host: string;
  frontendUrl: string;
  corsOrigins: string[];
  swaggerEnabled: boolean;
}

export interface DatabaseConfig {
  url: string;
  ssl: boolean;
  poolMax: number;
  logQueries: boolean;
}

export interface LoggingConfig {
  level: string;
  pretty: boolean;
}

export interface RateLimitConfig {
  ttlSeconds: number;
  limit: number;
}

export interface Configuration {
  app: AppConfig;
  database: DatabaseConfig;
  logging: LoggingConfig;
  rateLimit: RateLimitConfig;
}

/**
 * Turns the flat, string-typed environment into a typed, nested configuration object.
 *
 * Services depend on this shape rather than on `process.env`, so the environment is read
 * in exactly one place and a variable rename is a single-file change.
 */
export function buildConfiguration(env: ValidatedEnvironment): Configuration {
  const isProductionLike = env.APP_ENV === 'production' || env.APP_ENV === 'staging';

  return {
    app: {
      environment: env.APP_ENV,
      name: env.APP_NAME,
      version: env.APP_VERSION,
      port: env.API_PORT,
      host: env.API_HOST,
      frontendUrl: env.FRONTEND_URL,
      corsOrigins: envToList(env.CORS_ALLOWED_ORIGINS),
      // Publishing the API surface of a production deployment is an unnecessary
      // disclosure, so production overrides the flag rather than trusting it.
      swaggerEnabled: env.SWAGGER_ENABLED === 'true' && !isProductionLike,
    },
    database: {
      url: env.DATABASE_URL,
      ssl: env.DATABASE_SSL === 'true',
      poolMax: env.DATABASE_POOL_MAX,
      logQueries: env.DATABASE_LOG_QUERIES === 'true',
    },
    logging: {
      level: env.LOG_LEVEL,
      pretty: env.LOG_PRETTY === 'true' && !isProductionLike,
    },
    rateLimit: {
      ttlSeconds: env.RATE_LIMIT_TTL_SECONDS,
      limit: env.RATE_LIMIT_MAX,
    },
  };
}
