/**
 * Production configuration.
 *
 * The API base is same-origin and relative on purpose: a deployed environment puts a
 * reverse proxy in front of both the static bundle and the API, so no hostname is baked
 * into the JavaScript. See docs/deployment.md.
 */
export const environment = {
  production: true,
  apiBaseUrl: '/api/v1',
} as const;
