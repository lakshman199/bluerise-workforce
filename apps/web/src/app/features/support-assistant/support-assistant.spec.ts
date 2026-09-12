import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { SupportTicketService } from '../../core/api/support-ticket.service';
import { SupportAssistant } from './support-assistant';
import { SUPPORT_FALLBACK_ANSWER } from './support-knowledge';

describe('SupportAssistant', () => {
  const submit = vi.fn();

  beforeEach(() => {
    submit.mockReset();
    submit.mockReturnValue(
      of({
        id: '44444444-4444-4444-8444-444444444444',
        receivedAt: '2026-09-12T02:39:00.000Z',
        stored: true,
        emailed: false,
        status: 'open',
      }),
    );

    TestBed.configureTestingModule({
      imports: [SupportAssistant],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideRouter([]),
        { provide: SupportTicketService, useValue: { submit } },
      ],
    });
  });

  function render() {
    const fixture = TestBed.createComponent(SupportAssistant);
    fixture.detectChanges();
    return fixture;
  }

  function open(fixture: ReturnType<typeof render>) {
    const root = fixture.nativeElement as HTMLElement;
    root.querySelector<HTMLButtonElement>('.support__launcher')?.click();
    fixture.detectChanges();
    return root;
  }

  it('opens and closes the panel from the launcher and Escape', () => {
    const fixture = render();
    const root = fixture.nativeElement as HTMLElement;
    const panel = root.querySelector('#support-panel') as HTMLElement;

    expect(panel).not.toBeNull();
    expect(root.querySelector('.support--open')).toBeNull();
    expect(panel.getAttribute('aria-hidden')).toBe('true');
    expect(root.querySelector('.support__launcher')?.getAttribute('aria-label')).toBe(
      'BlueRise Support',
    );

    open(fixture);
    expect(root.querySelector('.support--open')).not.toBeNull();
    expect(root.querySelector('#support-panel')).toBe(panel);
    expect(panel.getAttribute('aria-hidden')).toBe('false');
    expect(root.textContent).toContain('BlueRise Support Assistant');

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    expect(root.querySelector('#support-panel')).toBe(panel);
    expect(root.querySelector('.support--open')).toBeNull();
    expect(panel.getAttribute('aria-hidden')).toBe('true');
  });

  it('answers a known question with approved copy', () => {
    const fixture = render();
    const root = open(fixture);

    root.querySelector<HTMLButtonElement>('.support__starter')?.click();
    fixture.detectChanges();

    expect(root.querySelector('#support-panel')).not.toBeNull();
    expect(root.textContent).toContain('What is BlueRise?');
    expect(root.textContent).toContain('coordinated workforce platform');
    expect(root.textContent).not.toContain(SUPPORT_FALLBACK_ANSWER);
    expect(root.querySelector('.support__bubble--user')?.textContent).toContain(
      'What is BlueRise?',
    );
    const assistantReplies = Array.from(
      root.querySelectorAll('.support__bubble--assistant'),
    );
    expect(assistantReplies.at(-1)?.textContent).toContain(
      'coordinated workforce platform',
    );
  });

  it('keeps a stable shell and scrolls only the conversation after a suggestion', () => {
    const fixture = render();
    const root = open(fixture);
    const panel = root.querySelector('#support-panel') as HTMLElement;
    const transcript = root.querySelector('.support__transcript') as HTMLElement;

    expect(root.querySelector('.support__header img')?.getAttribute('src')).toBe(
      '/brand/logo-bluerise.png',
    );
    expect(root.textContent).toContain('Ask a question or raise a support ticket');
    expect(root.querySelector('.support__launcher')?.textContent).toContain(
      'BlueRise Support',
    );
    expect(transcript.contains(root.querySelector('#support-starter-list'))).toBe(true);
    expect(root.querySelector('.support__dock #support-starter-list')).toBeNull();

    Object.defineProperty(transcript, 'scrollHeight', { configurable: true, value: 800 });
    Object.defineProperty(transcript, 'clientHeight', { configurable: true, value: 320 });
    transcript.scrollTop = 0;

    root.querySelector<HTMLButtonElement>('.support__starter')?.click();
    fixture.detectChanges();

    expect(root.querySelector('#support-panel')).toBe(panel);
    expect(root.querySelectorAll('.support__bubble').length).toBeGreaterThan(2);
    expect(getComputedStyle(panel).overflow).toBe('hidden');
    expect(getComputedStyle(transcript).overflowY).toBe('auto');
    expect(root.querySelector('#support-starter-list')).toBeNull();
    expect(root.querySelector('.support__dock .support__starters')).toBeNull();

    root.querySelector<HTMLButtonElement>('.support__starters-toggle')?.click();
    fixture.detectChanges();

    expect(root.querySelector('#support-panel')).toBe(panel);
    const starters = root.querySelector('#support-starter-list');
    expect(starters).not.toBeNull();
    expect(transcript.contains(starters)).toBe(true);
  });

  it('shows the fallback and Raise a Ticket for an unknown question', () => {
    const fixture = render();
    const root = open(fixture);
    const page = fixture.componentInstance;

    page['draft'].set('Do you have a live ADP integration?');
    fixture.detectChanges();
    root
      .querySelector<HTMLFormElement>('.support__composer')
      ?.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(root.textContent).toContain(SUPPORT_FALLBACK_ANSWER);
    expect(root.querySelectorAll('button').length).toBeGreaterThan(1);
    expect(root.textContent).toContain('Raise a Ticket');
  });

  it('opens the ticket form from Raise a Ticket', () => {
    const fixture = render();
    const root = open(fixture);

    root.querySelector<HTMLButtonElement>('.support__ticket-bar button')?.click();
    fixture.detectChanges();

    expect(root.querySelector('#support-ticket-name')).not.toBeNull();
    expect(root.textContent).toContain('Comment / Query');
    expect(root.textContent).toContain(
      'I confirm that I want to submit this support ticket.',
    );
  });

  it('shows validation errors and does not submit an empty ticket', () => {
    const fixture = render();
    const root = open(fixture);
    root.querySelector<HTMLButtonElement>('.support__ticket-bar button')?.click();
    fixture.detectChanges();

    root
      .querySelector<HTMLFormElement>('.support__ticket')
      ?.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(root.textContent).toContain('This field is required.');
    expect(root.textContent).toContain('Confirm that you want to submit this ticket.');
    expect(submit).not.toHaveBeenCalled();
  });

  it('submits a valid ticket without including the last question unless confirmed', () => {
    const fixture = render();
    const root = open(fixture);
    const page = fixture.componentInstance;

    page['lastUserQuery'].set('What is BlueRise?');
    page['openTicket']();
    fixture.detectChanges();

    page['form'].setValue({
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      phone: '',
      message: 'Please follow up about employer services.',
      includeLastQuestion: false,
      consent: true,
    });
    fixture.detectChanges();

    root
      .querySelector<HTMLFormElement>('.support__ticket')
      ?.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(submit).toHaveBeenCalledWith({
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      message: 'Please follow up about employer services.',
      consent: true,
    });
    expect(root.textContent).toContain('Your support ticket has been received.');
    expect(root.textContent).toContain('44444444-4444-4444-8444-444444444444');
    expect(root.textContent).toContain('does not send an email confirmation');
  });

  it('includes the last question only when the user confirms it', () => {
    const fixture = render();
    const root = open(fixture);
    const page = fixture.componentInstance;

    page['lastUserQuery'].set('What services does BlueRise support?');
    page['openTicket']();
    page['form'].setValue({
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      phone: '',
      message: 'Please follow up about employer services.',
      includeLastQuestion: true,
      consent: true,
    });
    fixture.detectChanges();

    root
      .querySelector<HTMLFormElement>('.support__ticket')
      ?.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(submit).toHaveBeenCalledWith({
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      message:
        'Please follow up about employer services.\n\nLast question: What services does BlueRise support?',
      consent: true,
    });
  });

  it('surfaces an API failure without leaving the ticket form', () => {
    submit.mockReturnValue(throwError(() => ({ status: 500 })));
    const fixture = render();
    const root = open(fixture);
    const page = fixture.componentInstance;

    page['openTicket']();
    page['form'].setValue({
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      phone: '',
      message: 'Please keep this ticket on the form after a failure.',
      includeLastQuestion: false,
      consent: true,
    });
    fixture.detectChanges();
    root
      .querySelector<HTMLFormElement>('.support__ticket')
      ?.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(root.textContent).toContain('Your ticket could not be sent.');
    expect(root.querySelector('#support-ticket-message')).not.toBeNull();
  });
});
