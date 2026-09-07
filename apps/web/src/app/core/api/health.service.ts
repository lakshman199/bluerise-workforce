import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { ApiResponse, HealthResponse } from '@bluerise/shared-types';
import { type Observable, map } from 'rxjs';

import { API_BASE_URL } from './api.tokens';

/**
 * All HTTP for the health resource lives here.
 *
 * Components never call `HttpClient` directly; they depend on a service that owns the URL,
 * the response shape, and the unwrapping of the API envelope.
 */
@Injectable({ providedIn: 'root' })
export class HealthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getHealth(): Observable<HealthResponse> {
    return this.http
      .get<ApiResponse<HealthResponse>>(`${this.baseUrl}/health`)
      .pipe(map((response) => response.data));
  }
}
