import { HttpErrorResponse } from '@angular/common/http';
import { isApiErrorResponse } from '@bluerise/shared-types';

/**
 * What a component needs to render a failure, and nothing more.
 *
 * Components never see an `HttpErrorResponse`: they get a message written for a person, a
 * flag for whether retrying is worthwhile, and the request ID to quote in a support
 * request.
 */
export interface ApiError {
  message: string;
  requestId?: string;
  status: number;
  retryable: boolean;
}

export function toApiError(error: unknown): ApiError {
  if (!(error instanceof HttpErrorResponse)) {
    return {
      message: 'Something went wrong. Please try again.',
      status: 0,
      retryable: true,
    };
  }

  // Status 0 means the request never reached the server: offline, DNS failure, a blocked
  // request, or the API not running. That is worth saying plainly rather than reporting as
  // a generic error, because the fix is usually on the user's side.
  if (error.status === 0) {
    return {
      message:
        'Could not reach the BlueRise API. Check that it is running and that you are online.',
      status: 0,
      retryable: true,
    };
  }

  if (isApiErrorResponse(error.error)) {
    return {
      message: error.error.message.join(' '),
      requestId: error.error.requestId,
      status: error.error.statusCode,
      retryable: error.error.statusCode >= 500 || error.error.statusCode === 429,
    };
  }

  return {
    message: messageForStatus(error.status),
    status: error.status,
    retryable: error.status >= 500,
  };
}

function messageForStatus(status: number): string {
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You do not have access to this.';
  if (status === 404) return 'That could not be found.';
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';
  if (status >= 500) return 'The service is temporarily unavailable. Please try again.';
  return 'Something went wrong. Please try again.';
}
