import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { REQUEST_ID_HEADER } from '@bluerise/shared-config';
import type { ApiResponse } from '@bluerise/shared-types';
import type { Request, Response } from 'express';
import { Observable, map } from 'rxjs';

import { getRequestId } from '../request-context';

/**
 * Wraps every successful handler result in `{ data }` and echoes the request ID.
 *
 * Doing this once centrally means a controller returns its DTO and nothing else, and no
 * endpoint can accidentally ship an unwrapped payload that a client then has to special-case.
 * A handler that has already produced the envelope is passed through untouched.
 */
@Injectable()
export class ResponseEnvelopeInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T> | T>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T> | T> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    response.setHeader(REQUEST_ID_HEADER, getRequestId(request));

    return next.handle().pipe(
      map((payload) => {
        if (payload !== null && typeof payload === 'object' && 'data' in payload) {
          return payload;
        }
        return { data: payload } satisfies ApiResponse<T>;
      }),
    );
  }
}
