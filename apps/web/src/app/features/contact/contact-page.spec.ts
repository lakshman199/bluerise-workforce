import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { ContactService } from '../../core/api/contact.service';
import { PUBLIC_CONTACT_EMAIL } from '../../layout/navigation';
import { CONTACT_HEADLINE, CONTACT_SUBJECT_OPTIONS } from './contact-content';
import { ContactPage } from './contact-page';

describe('ContactPage', () => {
  const submit = vi.fn();

  beforeEach(() => {
    submit.mockReset();
    submit.mockReturnValue(
      of({
        id: '11111111-1111-4111-8111-111111111111',
        receivedAt: '2026-09-07T04:43:00.000Z',
        stored: true,
        emailed: false,
      }),
    );

    TestBed.configureTestingModule({
      imports: [ContactPage],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        { provide: ContactService, useValue: { submit } },
      ],
    });
  });

  function render() {
    const fixture = TestBed.createComponent(ContactPage);
    fixture.detectChanges();
    return fixture;
  }

  it('uses approved copy and does not publish unverified contact details', () => {
    const root = render().nativeElement as HTMLElement;
    const text = root.textContent ?? '';

    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelector('h1')?.textContent).toContain(CONTACT_HEADLINE);
    expect(text).toContain(PUBLIC_CONTACT_EMAIL);
    expect(root.querySelector(`a[href="mailto:${PUBLIC_CONTACT_EMAIL}"]`)).not.toBeNull();
    expect(text).not.toContain('+1 012 3456 789');
    expect(text).not.toMatch(/Dubai|United Arab Emirates/);
    expect(text).not.toMatch(/LinkedIn|Facebook|Instagram|captcha|BR-24/i);
    for (const subject of CONTACT_SUBJECT_OPTIONS) {
      expect(text).toContain(subject);
    }
  });

  it('labels every field and shows inline errors after an empty submit', () => {
    const fixture = render();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('label[for="contact-first-name"]')?.textContent).toContain(
      'First name',
    );
    expect(root.querySelector('label[for="contact-message"]')?.textContent).toContain(
      'Message',
    );
    expect(
      root.querySelector('#contact-first-name')?.getAttribute('placeholder'),
    ).toBeNull();

    root.querySelector('form')?.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(root.textContent).toContain('This field is required.');
    expect(root.textContent).toContain('Confirm that you want to submit this form.');
    expect(submit).not.toHaveBeenCalled();
    expect(
      (root.querySelector('button[type="submit"]') as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it('submits a valid form and shows a stored-not-emailed success state', () => {
    const fixture = render();
    const root = fixture.nativeElement as HTMLElement;
    const page = fixture.componentInstance;

    page['form'].setValue({
      firstName: 'Alex',
      lastName: 'Rivera',
      email: 'alex.rivera@example.com',
      phone: '',
      subject: 'Employers',
      message: 'We would like to talk about workforce operations.',
      consent: true,
    });
    fixture.detectChanges();

    root.querySelector('form')?.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(submit).toHaveBeenCalledWith({
      firstName: 'Alex',
      lastName: 'Rivera',
      email: 'alex.rivera@example.com',
      subject: 'Employers',
      message: 'We would like to talk about workforce operations.',
      consent: true,
    });
    expect(root.textContent).toContain('Your message has been received.');
    expect(root.textContent).toContain('does not send an email confirmation');
  });

  it('surfaces an API error without leaving the form', () => {
    submit.mockReturnValue(throwError(() => ({ status: 500 })));
    const fixture = render();
    const root = fixture.nativeElement as HTMLElement;
    const page = fixture.componentInstance;

    page['form'].setValue({
      firstName: 'Alex',
      lastName: 'Rivera',
      email: 'alex.rivera@example.com',
      phone: '',
      subject: 'Other',
      message: 'Please keep this inquiry on the form after a failure.',
      consent: true,
    });
    fixture.detectChanges();
    root.querySelector('form')?.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(root.textContent).toContain('Your message could not be sent.');
    expect(root.querySelector('#contact-message')).not.toBeNull();
  });
});
