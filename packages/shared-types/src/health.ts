export const HEALTH_STATUSES = ['ok', 'degraded', 'down'] as const;

export type HealthStatus = (typeof HEALTH_STATUSES)[number];

export interface DependencyHealth {
  /** Stable identifier, for example `postgres` or `migrations`. */
  name: string;
  status: HealthStatus;
  /** How long the probe took, in milliseconds. */
  durationMs: number;
  /** Safe to display. Never contains a connection string, credential, or stack trace. */
  detail?: string;
}

export interface HealthResponse {
  status: HealthStatus;
  service: string;
  version: string;
  environment: string;
  /** Process uptime in seconds. */
  uptimeSeconds: number;
  timestamp: string;
  dependencies: DependencyHealth[];
}

export interface LivenessResponse {
  status: 'ok';
  timestamp: string;
}

export interface ReadinessResponse {
  status: HealthStatus;
  timestamp: string;
  dependencies: DependencyHealth[];
  /** Non-zero means the running schema is behind the code. */
  pendingMigrations: number;
}
