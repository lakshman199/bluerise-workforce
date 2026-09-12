import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from './api.tokens';
import { SupportTicketService } from './support-ticket.service';

describe('SupportTicketService', () => {
  it('posts to /support/tickets and unwraps the envelope', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://api.test/api/v1' },
        SupportTicketService,
      ],
    });

    const service = TestBed.inject(SupportTicketService);
    const http = TestBed.inject(HttpTestingController);

    let receiptId = '';
    service
      .submit({
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        message: 'How can BlueRise Workforce help an employer?',
        consent: true,
      })
      .subscribe((receipt) => {
        receiptId = receipt.id;
      });

    const request = http.expectOne('http://api.test/api/v1/support/tickets');
    expect(request.request.method).toBe('POST');
    request.flush({
      data: {
        id: '44444444-4444-4444-8444-444444444444',
        receivedAt: '2026-09-12T02:39:00.000Z',
        stored: true,
        emailed: false,
        status: 'open',
      },
    });

    expect(receiptId).toBe('44444444-4444-4444-8444-444444444444');
    http.verify();
  });
});
