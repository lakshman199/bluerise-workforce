import { HttpErrorResponse } from '@angular/common/http';
import type { ApiErrorResponse } from '@bluerise/shared-types';

import { toApiError } from './api-error';

function httpError(status: number, body: unknown): HttpErrorResponse {
  return new HttpErrorResponse({ status, error: body, url: '/api/v1/health' });
}

describe('toApiError', () => {
  it('reads the API error envelope when the server sent one', () => {
    const envelope: ApiErrorResponse = {
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: ['email must be an email', 'message is too short'],
      requestId: '01JB6Z8Q9K2M4N6P8R0T2V4X6Z',
      timestamp: '2026-09-06T21:14:03.221Z',
      path: '/api/v1/contact',
    };

    const result = toApiError(httpError(422, envelope));

    expect(result.status).toBe(422);
    expect(result.message).toContain('email must be an email');
    expect(result.requestId).toBe('01JB6Z8Q9K2M4N6P8R0T2V4X6Z');
    expect(result.retryable).toBe(false);
  });

  it('explains a status of zero as an unreachable API rather than a generic failure', () => {
    const result = toApiError(httpError(0, null));

    expect(result.message).toContain('Could not reach the BlueRise API');
    expect(result.retryable).toBe(true);
  });

  it('marks server errors and rate limiting as worth retrying', () => {
    expect(toApiError(httpError(503, null)).retryable).toBe(true);
    expect(toApiError(httpError(429, null)).retryable).toBe(false);
  });

  it('does not suggest retrying a client mistake', () => {
    expect(toApiError(httpError(404, null)).retryable).toBe(false);
    expect(toApiError(httpError(403, null)).retryable).toBe(false);
  });

  it('falls back to a readable message when the body is not an envelope', () => {
    const result = toApiError(httpError(500, '<html>Gateway error</html>'));

    expect(result.message).not.toContain('<html>');
    expect(result.message.length).toBeGreaterThan(0);
  });

  it('handles a thrown value that is not an HTTP error at all', () => {
    const result = toApiError(new Error('boom'));

    expect(result.status).toBe(0);
    expect(result.message).toBe('Something went wrong. Please try again.');
  });
});
