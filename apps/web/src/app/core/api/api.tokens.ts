import { InjectionToken } from '@angular/core';

import { environment } from '../../../environments/environment';

/**
 * The API base, injected rather than imported directly by services.
 *
 * A service that reaches for `environment` is untestable without a build-time replacement;
 * one that injects this token can be handed any base URL in a test.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.apiBaseUrl,
});
