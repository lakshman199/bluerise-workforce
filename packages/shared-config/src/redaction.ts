/**
 * Field names that must never reach a log sink in cleartext.
 *
 * Kept here rather than in the logger so that any future sink — an error reporter, an
 * analytics client, an audit serialiser — redacts the same set. Adding a sensitive field
 * to the domain means adding it here, once.
 */
export const REDACTED_FIELD_NAMES = [
  'password',
  'passwordConfirmation',
  'currentPassword',
  'newPassword',
  'passwordHash',
  'token',
  'accessToken',
  'refreshToken',
  'apiKey',
  'clientSecret',
  'secret',
  'authorization',
  'cookie',
  'ssn',
  'socialSecurityNumber',
  'taxId',
  'ein',
  'accountNumber',
  'routingNumber',
  'bankAccount',
  'dateOfBirth',
  'dob',
  'message',
  'firstName',
  'lastName',
  'email',
  'phone',
  'first_name',
  'last_name',
] as const;

export type RedactedFieldName = (typeof REDACTED_FIELD_NAMES)[number];

export const REDACTION_PLACEHOLDER = '[redacted]';

/**
 * Pino redaction paths. Covers the top level plus the request and response shapes the HTTP
 * logger serialises, since a secret in a body is as damaging as one in a header.
 *
 * Header names are matched in lower case because Node normalises incoming header keys.
 */
export function buildRedactionPaths(): string[] {
  const objectContainers = ['', 'req.', 'req.body.', 'req.query.', 'body.', 'context.'];
  const headerContainers = ['req.headers.', 'res.headers.'];

  const paths = new Set<string>();

  for (const container of objectContainers) {
    for (const field of REDACTED_FIELD_NAMES) {
      paths.add(`${container}${field}`);
    }
  }

  for (const container of headerContainers) {
    for (const field of REDACTED_FIELD_NAMES) {
      paths.add(`${container}["${field.toLowerCase()}"]`);
    }
  }

  return [...paths];
}
