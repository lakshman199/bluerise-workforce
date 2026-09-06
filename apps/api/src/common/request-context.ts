import { REQUEST_ID_HEADER } from '@bluerise/shared-config';
import type { Request } from 'express';

/**
 * Every request carries an identifier, honoured from the caller when supplied and generated
 * otherwise. It appears in every log line, in every error body, and on every response, so a
 * user-reported failure maps to exact log entries without guesswork.
 */
export function getRequestId(request: Request): string {
  const header = request.headers[REQUEST_ID_HEADER];
  if (typeof header === 'string' && header.length > 0) {
    return header;
  }
  const generated = (request as Request & { id?: unknown }).id;
  return typeof generated === 'string' ? generated : 'unknown';
}
