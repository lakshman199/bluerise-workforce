export const APP_ENVIRONMENTS = ['development', 'test', 'staging', 'production'] as const;

export type AppEnvironment = (typeof APP_ENVIRONMENTS)[number];

export function isAppEnvironment(value: unknown): value is AppEnvironment {
  return (
    typeof value === 'string' && (APP_ENVIRONMENTS as readonly string[]).includes(value)
  );
}

/**
 * Anything that must never be relaxed outside a developer machine keys off this rather
 * than off `NODE_ENV`, which build tooling rewrites for its own purposes.
 */
export function isProductionLike(environment: AppEnvironment): boolean {
  return environment === 'staging' || environment === 'production';
}
