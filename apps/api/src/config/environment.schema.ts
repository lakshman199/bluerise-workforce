import { APP_ENVIRONMENTS } from '@bluerise/shared-config';
import { z } from 'zod';

const port = z.coerce.number().int().min(1).max(65535);

/**
 * The complete contract between this process and its environment.
 *
 * Every variable the API reads is declared here. Validation runs once at boot and the
 * process refuses to start on a bad value, which turns a class of runtime failures into a
 * startup failure with a readable message.
 */
export const environmentSchema = z
  .object({
    APP_ENV: z.enum(APP_ENVIRONMENTS).default('development'),
    APP_NAME: z.string().min(1).default('bluerise-api'),
    APP_VERSION: z.string().min(1).default('0.1.0'),

    API_PORT: port.default(4300),
    API_HOST: z.string().min(1).default('0.0.0.0'),

    FRONTEND_URL: z.string().url().default('http://localhost:4200'),
    CORS_ALLOWED_ORIGINS: z.string().default('http://localhost:4200'),

    DATABASE_URL: z.string().min(1),
    DATABASE_SSL: z.enum(['true', 'false']).default('false'),
    DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(100).default(10),
    DATABASE_LOG_QUERIES: z.enum(['true', 'false']).default('false'),

    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
    LOG_PRETTY: z.enum(['true', 'false']).default('false'),

    RATE_LIMIT_TTL_SECONDS: z.coerce.number().int().min(1).default(60),
    RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(120),

    SWAGGER_ENABLED: z.enum(['true', 'false']).default('true'),
  })
  .superRefine((value, ctx) => {
    // A wildcard origin on a credentialed API defeats the point of CORS. Blocking it in
    // the schema means it cannot be reached by a hurried environment edit.
    const isProductionLike =
      value.APP_ENV === 'production' || value.APP_ENV === 'staging';
    if (isProductionLike && value.CORS_ALLOWED_ORIGINS.trim() === '*') {
      ctx.addIssue({
        code: 'custom',
        path: ['CORS_ALLOWED_ORIGINS'],
        message: 'A wildcard CORS origin is not permitted outside development.',
      });
    }
  });

export type ValidatedEnvironment = z.infer<typeof environmentSchema>;

export function validateEnvironment(raw: Record<string, unknown>): ValidatedEnvironment {
  const result = environmentSchema.safeParse(raw);

  if (!result.success) {
    // Sorted by variable name so the same misconfiguration always produces the same
    // message, which makes it searchable and diffable across deployments.
    const details = result.error.issues
      .map((issue) => ({
        variable: issue.path.join('.') || '(root)',
        message: issue.message,
      }))
      .sort((a, b) => a.variable.localeCompare(b.variable))
      .map((issue) => `  - ${issue.variable}: ${issue.message}`)
      .join('\n');
    throw new Error(
      `Invalid environment configuration:\n${details}\n\nCopy .env.example to .env and fill in the missing values.`,
    );
  }

  return result.data;
}
