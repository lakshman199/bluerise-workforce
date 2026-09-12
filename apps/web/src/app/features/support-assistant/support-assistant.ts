import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
  viewChild,
  type ElementRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  type AbstractControl,
} from '@angular/forms';
import { finalize } from 'rxjs';

import { SupportTicketService } from '../../core/api/support-ticket.service';
import { toApiError, type ApiError } from '../../core/api/api-error';
import { BrandLogo } from '../../layout/brand-logo/brand-logo';
import { PUBLIC_CONTACT_EMAIL } from '../../layout/navigation';
import {
  SUPPORT_BACK_TO_CHAT_LABEL,
  SUPPORT_CLOSE_LABEL,
  SUPPORT_INPUT_LABEL,
  SUPPORT_INPUT_PLACEHOLDER,
  SUPPORT_LAUNCHER_LABEL,
  SUPPORT_PANEL_SUBTITLE,
  SUPPORT_PANEL_TITLE,
  SUPPORT_RAISE_TICKET_LABEL,
  SUPPORT_RELATED_LABEL,
  SUPPORT_SEND_LABEL,
  SUPPORT_STARTERS_LABEL,
  SUPPORT_TICKET_CONSENT_LABEL,
  SUPPORT_TICKET_EMAIL_LABEL,
  SUPPORT_TICKET_ERROR_TITLE,
  SUPPORT_TICKET_INCLUDE_QUERY_LABEL,
  SUPPORT_TICKET_INTRO,
  SUPPORT_TICKET_MESSAGE_LABEL,
  SUPPORT_TICKET_NAME_LABEL,
  SUPPORT_TICKET_PHONE_LABEL,
  SUPPORT_TICKET_PHONE_OPTIONAL,
  SUPPORT_TICKET_SUBMITTING_LABEL,
  SUPPORT_TICKET_SUBMIT_LABEL,
  SUPPORT_TICKET_SUCCESS_BODY,
  SUPPORT_TICKET_SUCCESS_TITLE,
  SUPPORT_TICKET_TITLE,
  SUPPORT_WELCOME,
} from './support-content';
import {
  SUPPORT_FALLBACK_ANSWER,
  SUPPORT_STARTER_QUESTIONS,
  matchSupportKnowledge,
  type SupportKnowledgeLink,
} from './support-knowledge';

const phonePattern = /^[+\d().\-\s]{7,32}$/;

export interface SupportChatMessage {
  readonly id: string;
  readonly role: 'assistant' | 'user';
  readonly text: string;
  readonly link?: SupportKnowledgeLink;
  readonly offerTicket?: boolean;
}

type SupportView = 'chat' | 'ticket' | 'success';

@Component({
  selector: 'br-support-assistant',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, BrandLogo],
  templateUrl: './support-assistant.html',
  styleUrl: './support-assistant.scss',
})
export class SupportAssistant {
  private readonly formBuilder = inject(FormBuilder);
  private readonly tickets = inject(SupportTicketService);
  private messageSeq = 0;
  private restoreFocusTo: HTMLElement | null = null;

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly transcript = viewChild<ElementRef<HTMLElement>>('transcript');

  protected readonly launcherLabel = SUPPORT_LAUNCHER_LABEL;
  protected readonly panelTitle = SUPPORT_PANEL_TITLE;
  protected readonly panelSubtitle = SUPPORT_PANEL_SUBTITLE;
  protected readonly inputLabel = SUPPORT_INPUT_LABEL;
  protected readonly inputPlaceholder = SUPPORT_INPUT_PLACEHOLDER;
  protected readonly sendLabel = SUPPORT_SEND_LABEL;
  protected readonly closeLabel = SUPPORT_CLOSE_LABEL;
  protected readonly startersLabel = SUPPORT_STARTERS_LABEL;
  protected readonly raiseTicketLabel = SUPPORT_RAISE_TICKET_LABEL;
  protected readonly backToChatLabel = SUPPORT_BACK_TO_CHAT_LABEL;
  protected readonly starters = SUPPORT_STARTER_QUESTIONS;
  protected readonly relatedLabel = SUPPORT_RELATED_LABEL;
  protected readonly ticketTitle = SUPPORT_TICKET_TITLE;
  protected readonly ticketIntro = SUPPORT_TICKET_INTRO;
  protected readonly ticketNameLabel = SUPPORT_TICKET_NAME_LABEL;
  protected readonly ticketEmailLabel = SUPPORT_TICKET_EMAIL_LABEL;
  protected readonly ticketPhoneLabel = SUPPORT_TICKET_PHONE_LABEL;
  protected readonly ticketPhoneOptional = SUPPORT_TICKET_PHONE_OPTIONAL;
  protected readonly ticketMessageLabel = SUPPORT_TICKET_MESSAGE_LABEL;
  protected readonly ticketConsentLabel = SUPPORT_TICKET_CONSENT_LABEL;
  protected readonly ticketIncludeQueryLabel = SUPPORT_TICKET_INCLUDE_QUERY_LABEL;
  protected readonly ticketSubmitLabel = SUPPORT_TICKET_SUBMIT_LABEL;
  protected readonly ticketSubmittingLabel = SUPPORT_TICKET_SUBMITTING_LABEL;
  protected readonly ticketSuccessTitle = SUPPORT_TICKET_SUCCESS_TITLE;
  protected readonly ticketSuccessBody = SUPPORT_TICKET_SUCCESS_BODY;
  protected readonly ticketErrorTitle = SUPPORT_TICKET_ERROR_TITLE;
  protected readonly contactEmail = PUBLIC_CONTACT_EMAIL;

  protected readonly open = signal(false);
  protected readonly view = signal<SupportView>('chat');
  protected readonly startersOpen = signal(true);
  protected readonly draft = signal('');
  protected readonly messages = signal<readonly SupportChatMessage[]>([
    this.assistantMessage(SUPPORT_WELCOME),
  ]);
  protected readonly lastUserQuery = signal('');
  protected readonly submitting = signal(false);
  protected readonly submitAttempted = signal(false);
  protected readonly apiError = signal<ApiError | null>(null);
  protected readonly receiptId = signal('');

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    phone: ['', [Validators.maxLength(32), optionalPhone]],
    message: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(4000)],
    ],
    includeLastQuestion: [false],
    consent: [false, Validators.requiredTrue],
  });

  protected get submitDisabled(): boolean {
    return this.submitting() || (this.submitAttempted() && this.form.invalid);
  }

  @HostListener('document:keydown', ['$event'])
  protected onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.open()) {
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }
    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  protected toggle(): void {
    if (this.open()) {
      this.close();
      return;
    }
    this.openPanel();
  }

  protected openPanel(): void {
    this.restoreFocusTo = document.activeElement as HTMLElement | null;
    this.open.set(true);
    queueMicrotask(() => this.focusPanel());
  }

  protected close(): void {
    this.open.set(false);
    const restore = this.restoreFocusTo;
    this.restoreFocusTo = null;
    queueMicrotask(() => restore?.focus());
  }

  protected askSuggested(question: string): void {
    this.draft.set(question);
    this.send(question);
  }

  protected onSend(event: Event): void {
    event.preventDefault();
    this.send(this.draft());
  }

  protected onDraftInput(event: Event): void {
    const target = event.target;
    this.draft.set(target instanceof HTMLInputElement ? target.value : '');
  }

  protected isStarterAsked(question: string): boolean {
    return this.messages().some(
      (message) => message.role === 'user' && message.text === question,
    );
  }

  protected hasConversation(): boolean {
    return this.messages().some((message) => message.role === 'user');
  }

  protected toggleStarters(): void {
    this.startersOpen.update((open) => !open);
    this.scheduleTranscriptScroll();
  }

  protected openTicket(): void {
    this.view.set('ticket');
    this.apiError.set(null);
    this.submitAttempted.set(false);
    queueMicrotask(() => this.focusPanel());
  }

  protected backToChat(): void {
    this.view.set('chat');
    this.apiError.set(null);
    queueMicrotask(() => this.focusPanel());
  }

  protected showError(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.submitAttempted());
  }

  protected errorFor(controlName: keyof typeof this.form.controls): string {
    const errors = this.form.controls[controlName].errors;
    if (!errors) {
      return '';
    }
    if (errors['required'] || errors['requiredTrue']) {
      return controlName === 'consent'
        ? 'Confirm that you want to submit this ticket.'
        : 'This field is required.';
    }
    if (errors['email']) {
      return 'Enter an email address in the form name@example.com.';
    }
    if (errors['minlength']) {
      const { requiredLength } = errors['minlength'] as { requiredLength: number };
      return `Use at least ${requiredLength} characters.`;
    }
    if (errors['maxlength']) {
      return 'This field is too long.';
    }
    if (errors['phone']) {
      return 'Enter a phone number using digits, spaces, or + ( ) - .';
    }
    return 'Check this field.';
  }

  protected onSubmitTicket(): void {
    if (this.submitting()) {
      return;
    }

    this.submitAttempted.set(true);
    this.apiError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const phone = value.phone.trim();
    const comment = value.message.trim();
    const lastQuestion = this.lastUserQuery().trim();
    const message =
      value.includeLastQuestion && lastQuestion
        ? `${comment}\n\nLast question: ${lastQuestion}`
        : comment;

    this.submitting.set(true);
    this.tickets
      .submit({
        name: value.name.trim(),
        email: value.email.trim(),
        ...(phone ? { phone } : {}),
        message,
        consent: value.consent,
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (receipt) => {
          this.receiptId.set(receipt.id);
          this.view.set('success');
          this.form.reset({
            name: '',
            email: '',
            phone: '',
            message: '',
            includeLastQuestion: false,
            consent: false,
          });
          this.submitAttempted.set(false);
          queueMicrotask(() => this.focusPanel());
        },
        error: (error: unknown) => {
          this.apiError.set(toApiError(error));
        },
      });
  }

  private send(raw: string): void {
    const question = raw.trim();
    if (!question || this.view() !== 'chat') {
      return;
    }

    this.lastUserQuery.set(question);
    this.draft.set('');
    this.startersOpen.set(false);
    this.messages.update((current) => [...current, this.userMessage(question)]);

    const match = matchSupportKnowledge(question);
    if (match.kind === 'known') {
      this.messages.update((current) => [
        ...current,
        this.assistantMessage(match.entry.answer, match.entry.link),
      ]);
    } else {
      this.messages.update((current) => [
        ...current,
        this.assistantMessage(SUPPORT_FALLBACK_ANSWER, undefined, true),
      ]);
    }

    this.scheduleTranscriptScroll();
  }

  private scheduleTranscriptScroll(): void {
    queueMicrotask(() => {
      requestAnimationFrame(() => this.scrollTranscript());
    });
  }

  private assistantMessage(
    text: string,
    link?: SupportKnowledgeLink,
    offerTicket = false,
  ): SupportChatMessage {
    return {
      id: `assistant-${++this.messageSeq}`,
      role: 'assistant',
      text,
      ...(link ? { link } : {}),
      ...(offerTicket ? { offerTicket: true } : {}),
    };
  }

  private userMessage(text: string): SupportChatMessage {
    return { id: `user-${++this.messageSeq}`, role: 'user', text };
  }

  private focusPanel(): void {
    this.panel()?.nativeElement.focus();
  }

  private scrollTranscript(): void {
    const node = this.transcript()?.nativeElement;
    if (!node) {
      return;
    }
    const bubbles = node.querySelectorAll('.support__bubble');
    const latest = bubbles.item(bubbles.length - 1);
    if (latest instanceof HTMLElement) {
      node.scrollTop = Math.max(0, latest.offsetTop - 8);
      return;
    }
    node.scrollTop = node.scrollHeight;
  }

  private trapFocus(event: KeyboardEvent): void {
    const root = this.panel()?.nativeElement;
    if (!root) {
      return;
    }
    const nodes = Array.from(
      root.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    const focusable = nodes.filter((node): node is HTMLElement => {
      return node instanceof HTMLElement && node.tabIndex !== -1;
    });

    if (focusable.length === 0) {
      event.preventDefault();
      root.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !root.contains(active))) {
      event.preventDefault();
      last.focus();
      return;
    }
    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }
}

function optionalPhone(control: AbstractControl): { phone: true } | null {
  const value = typeof control.value === 'string' ? control.value.trim() : '';
  if (!value) {
    return null;
  }
  return phonePattern.test(value) ? null : { phone: true };
}
