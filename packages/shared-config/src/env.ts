/**
 * Small, dependency-free helpers for reading environment variables.
 *
 * The API validates its whole environment through a schema at boot; these exist for the
 * places that run before or outside Nest's DI container, such as the TypeORM CLI data
 * source and container entrypoints.
 */

export class MissingEnvironmentVariableError extends Error {
  constructor(public readonly variableName: string) {
    super(
      `Required environment variable ${variableName} is not set. Copy .env.example to .env and fill it in.`,
    );
    this.name = 'MissingEnvironmentVariableError';
  }
}

export function requireEnv(
  name: string,
  source: NodeJS.ProcessEnv = process.env,
): string {
  const value = source[name];
  if (value === undefined || value.trim() === '') {
    throw new MissingEnvironmentVariableError(name);
  }
  return value;
}

export function optionalEnv(
  name: string,
  fallback: string,
  source: NodeJS.ProcessEnv = process.env,
): string {
  const value = source[name];
  return value === undefined || value.trim() === '' ? fallback : value;
}

export function envToBoolean(value: string | undefined, fallback = false): boolean {
  if (value === undefined) return fallback;
  const normalised = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalised)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalised)) return false;
  return fallback;
}

export function envToInteger(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = Number.parseInt(value.trim(), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/** Splits a comma-separated variable, such as an origin allowlist, into trimmed entries. */
export function envToList(value: string | undefined): string[] {
  if (value === undefined) return [];
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}
