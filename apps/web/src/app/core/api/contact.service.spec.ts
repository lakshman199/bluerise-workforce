import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from './api.tokens';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  it('posts to /contact and unwraps the envelope', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://api.test/api/v1' },
        ContactService,
      ],
    });

    const service = TestBed.inject(ContactService);
    const http = TestBed.inject(HttpTestingController);

    let receiptId = '';
    service
      .submit({
        firstName: 'Alex',
        lastName: 'Rivera',
        email: 'alex.rivera@example.com',
        subject: 'General Inquiry',
        message: 'How can BlueRise Workforce help an employer?',
        consent: true,
      })
      .subscribe((receipt) => {
        receiptId = receipt.id;
      });

    const request = http.expectOne('http://api.test/api/v1/contact');
    expect(request.request.method).toBe('POST');
    request.flush({
      data: {
        id: '22222222-2222-4222-8222-222222222222',
        receivedAt: '2026-09-07T04:43:00.000Z',
        stored: true,
        emailed: false,
      },
    });

    expect(receiptId).toBe('22222222-2222-4222-8222-222222222222');
    http.verify();
  });
});
