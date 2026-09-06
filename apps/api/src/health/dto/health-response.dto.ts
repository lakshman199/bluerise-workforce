import { ApiProperty } from '@nestjs/swagger';
import {
  HEALTH_STATUSES,
  type DependencyHealth,
  type HealthResponse,
  type HealthStatus,
  type LivenessResponse,
  type ReadinessResponse,
} from '@bluerise/shared-types';

export class DependencyHealthDto implements DependencyHealth {
  @ApiProperty({ example: 'postgres' })
  name: string;

  @ApiProperty({ enum: HEALTH_STATUSES, example: 'ok' })
  status: HealthStatus;

  @ApiProperty({ example: 3, description: 'How long the probe took, in milliseconds.' })
  durationMs: number;

  @ApiProperty({
    required: false,
    example: 'Connected. 0 migrations pending.',
    description:
      'Safe to display. Never contains a connection string, credential, or stack trace.',
  })
  detail?: string;
}

export class HealthResponseDto implements HealthResponse {
  @ApiProperty({ enum: HEALTH_STATUSES, example: 'ok' })
  status: HealthStatus;

  @ApiProperty({ example: 'bluerise-api' })
  service: string;

  @ApiProperty({ example: '0.1.0' })
  version: string;

  @ApiProperty({ example: 'development' })
  environment: string;

  @ApiProperty({ example: 128.4 })
  uptimeSeconds: number;

  @ApiProperty({ example: '2026-09-06T21:14:03.221Z' })
  timestamp: string;

  @ApiProperty({ type: [DependencyHealthDto] })
  dependencies: DependencyHealthDto[];
}

export class LivenessResponseDto implements LivenessResponse {
  @ApiProperty({ example: 'ok' })
  status: 'ok';

  @ApiProperty({ example: '2026-09-06T21:14:03.221Z' })
  timestamp: string;
}

export class ReadinessResponseDto implements ReadinessResponse {
  @ApiProperty({ enum: HEALTH_STATUSES, example: 'ok' })
  status: HealthStatus;

  @ApiProperty({ example: '2026-09-06T21:14:03.221Z' })
  timestamp: string;

  @ApiProperty({ type: [DependencyHealthDto] })
  dependencies: DependencyHealthDto[];

  @ApiProperty({
    example: 0,
    description: 'Non-zero means the running schema is behind the deployed code.',
  })
  pendingMigrations: number;
}
