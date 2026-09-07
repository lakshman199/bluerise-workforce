/**
 * Development configuration.
 *
 * Replaced at build time by `environment.production.ts` for the production configuration;
 * see the `fileReplacements` entry in angular.json.
 */
export const environment = {
  production: false,
  /** The API runs on its own port locally, so this is absolute and CORS-allowlisted. */
  apiBaseUrl: 'http://localhost:4300/api/v1',
} as const;
