import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type {
  ApiResponse,
  ContactSubmissionReceipt,
  CreateContactRequest,
} from '@bluerise/shared-types';
import { type Observable, map } from 'rxjs';

import { API_BASE_URL } from './api.tokens';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  submit(payload: CreateContactRequest): Observable<ContactSubmissionReceipt> {
    return this.http
      .post<ApiResponse<ContactSubmissionReceipt>>(`${this.baseUrl}/contact`, payload)
      .pipe(map((response) => response.data));
  }
}
