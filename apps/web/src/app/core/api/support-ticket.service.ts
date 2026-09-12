import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type {
  ApiResponse,
  SupportTicketReceipt,
  SupportTicketRequest,
} from '@bluerise/shared-types';
import { type Observable, map } from 'rxjs';

import { API_BASE_URL } from './api.tokens';

@Injectable({ providedIn: 'root' })
export class SupportTicketService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  submit(payload: SupportTicketRequest): Observable<SupportTicketReceipt> {
    return this.http
      .post<ApiResponse<SupportTicketReceipt>>(`${this.baseUrl}/support/tickets`, payload)
      .pipe(map((response) => response.data));
  }
}
