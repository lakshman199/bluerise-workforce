import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import type { Response } from 'express';

import {
  HealthResponseDto,
  LivenessResponseDto,
  ReadinessResponseDto,
} from './dto/health-response.dto';
import { type HealthService } from './health.service';

@ApiTags('Health')
@Controller({ path: 'health', version: '1' })
// Orchestrator probes run on a fixed interval and would otherwise consume the rate-limit
// budget that protects the rest of the API.
@SkipThrottle()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Service health',
    description:
      'Full health report including dependency detail. Intended for humans and dashboards rather than container probes.',
  })
  @ApiOkResponse({ type: HealthResponseDto })
  async getHealth(): Promise<HealthResponseDto> {
    return this.healthService.getHealth();
  }

  @Get('live')
  @ApiOperation({
    summary: 'Liveness probe',
    description:
      'Reports only that the process is running. Never touches a dependency, so a database outage cannot cause a healthy container to be restarted.',
  })
  @ApiOkResponse({ type: LivenessResponseDto })
  getLiveness(): LivenessResponseDto {
    return this.healthService.getLiveness();
  }

  @Get('ready')
  @ApiOperation({
    summary: 'Readiness probe',
    description:
      'Reports whether this instance can serve traffic. Returns 503 when the database is unreachable or migrations are pending, so an orchestrator will not route to an instance whose schema is behind the code.',
  })
  @ApiOkResponse({ type: ReadinessResponseDto })
  @ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, type: ReadinessResponseDto })
  async getReadiness(
    @Res({ passthrough: true }) response: Response,
  ): Promise<ReadinessResponseDto> {
    const readiness = await this.healthService.getReadiness();

    if (readiness.status !== 'ok') {
      response.status(HttpStatus.SERVICE_UNAVAILABLE);
    }

    return readiness;
  }
}
