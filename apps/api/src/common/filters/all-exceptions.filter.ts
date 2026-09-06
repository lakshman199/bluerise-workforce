import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { ApiErrorResponse } from '@bluerise/shared-types';
import type { Request, Response } from 'express';

import { AppConfigService } from '../../config/app-config.service';
import { getRequestId } from '../request-context';

/**
 * The single place an error becomes an HTTP response.
 *
 * Every failure — thrown `HttpException`, validation rejection, or an unexpected error from
 * anywhere in the stack — leaves through here in one shape, so a client never has to handle
 * two error formats.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly config: AppConfigService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const status = this.resolveStatus(exception);
    const isServerError = status >= HttpStatus.INTERNAL_SERVER_ERROR;

    const body: ApiErrorResponse = {
      statusCode: status,
      error: this.resolveErrorName(status),
      message: this.resolveMessages(exception, isServerError),
      requestId: getRequestId(request),
      timestamp: new Date().toISOString(),
      path: request.originalUrl ?? request.url,
    };

    // A 5xx is a defect in this service and always gets a stack; a 4xx is the caller's
    // problem and only gets a debug line, so ordinary validation noise does not drown the
    // signal in production logs.
    if (isServerError) {
      this.logger.error(
        { requestId: body.requestId, path: body.path, statusCode: status },
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.debug(
        `${status} ${body.path} (${body.requestId}): ${body.message.join('; ')}`,
      );
    }

    response.status(status).json(body);
  }

  private resolveStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private resolveErrorName(status: number): string {
    const names: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'Bad Request',
      [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
      [HttpStatus.FORBIDDEN]: 'Forbidden',
      [HttpStatus.NOT_FOUND]: 'Not Found',
      [HttpStatus.CONFLICT]: 'Conflict',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
      [HttpStatus.TOO_MANY_REQUESTS]: 'Too Many Requests',
      [HttpStatus.BAD_GATEWAY]: 'Bad Gateway',
      [HttpStatus.SERVICE_UNAVAILABLE]: 'Service Unavailable',
    };
    return names[status] ?? (status >= 500 ? 'Internal Server Error' : 'Error');
  }

  private resolveMessages(exception: unknown, isServerError: boolean): string[] {
    // Outside development, an unexpected server error reveals nothing beyond the request
    // ID. Internal messages and stack traces belong in logs, not in a response body.
    if (isServerError && this.config.isProductionLike) {
      return ['An unexpected error occurred. Quote the request ID when reporting this.'];
    }

    if (exception instanceof HttpException) {
      const payload = exception.getResponse();

      if (typeof payload === 'string') {
        return [payload];
      }

      if (typeof payload === 'object' && payload !== null) {
        const { message } = payload as { message?: unknown };
        if (Array.isArray(message)) {
          return message.map(String);
        }
        if (typeof message === 'string') {
          return [message];
        }
      }

      return [exception.message];
    }

    if (exception instanceof Error) {
      return [exception.message];
    }

    return ['An unexpected error occurred.'];
  }
}
