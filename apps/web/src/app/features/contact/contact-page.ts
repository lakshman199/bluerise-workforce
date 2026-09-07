import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  type AbstractControl,
} from '@angular/forms';
import { finalize } from 'rxjs';

import { ContactService } from '../../core/api/contact.service';
import { toApiError, type ApiError } from '../../core/api/api-error';
import { PUBLIC_CONTACT_EMAIL } from '../../layout/navigation';
import { emphasize } from '../../shared/emphasize';
import {
  CONTACT_CONSENT_LABEL,
  CONTACT_EMAIL_LABEL,
  CONTACT_ERROR_TITLE,
  CONTACT_EYEBROW,
  CONTACT_HEADLINE,
  CONTACT_INFO_EYEBROW,
  CONTACT_INFO_LEAD,
  CONTACT_INFO_TITLE,
  CONTACT_INTRO,
  CONTACT_SUBJECTS_LABEL,
  CONTACT_SUBJECT_OPTIONS,
  CONTACT_SUBMITTING_LABEL,
  CONTACT_SUBMIT_LABEL,
  CONTACT_SUCCESS_AGAIN,
  CONTACT_SUCCESS_BODY,
  CONTACT_SUCCESS_TITLE,
} from './contact-content';

const phonePattern = /^[+\d().\-\s]{7,32}$/;

@Component({
  selector: 'br-contact-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.scss',
})
export class ContactPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly contactService = inject(ContactService);

  protected readonly eyebrow = CONTACT_EYEBROW;
  protected readonly headlineHtml = emphasize(CONTACT_HEADLINE, 'support you.');
  protected readonly intro = CONTACT_INTRO;
  protected readonly infoEyebrow = CONTACT_INFO_EYEBROW;
  protected readonly infoTitle = CONTACT_INFO_TITLE;
  protected readonly infoLead = CONTACT_INFO_LEAD;
  protected readonly emailLabel = CONTACT_EMAIL_LABEL;
  protected readonly contactEmail = PUBLIC_CONTACT_EMAIL;
  protected readonly subjectsLabel = CONTACT_SUBJECTS_LABEL;
  protected readonly subjects = CONTACT_SUBJECT_OPTIONS;
  protected readonly consentLabel = CONTACT_CONSENT_LABEL;
  protected readonly submitLabel = CONTACT_SUBMIT_LABEL;
  protected readonly submittingLabel = CONTACT_SUBMITTING_LABEL;
  protected readonly successTitle = CONTACT_SUCCESS_TITLE;
  protected readonly successBody = CONTACT_SUCCESS_BODY;
  protected readonly successAgain = CONTACT_SUCCESS_AGAIN;
  protected readonly errorTitle = CONTACT_ERROR_TITLE;

  protected readonly submitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly submitAttempted = signal(false);
  protected readonly apiError = signal<ApiError | null>(null);

  protected readonly form = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(80)]],
    lastName: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    phone: ['', [Validators.maxLength(32), optionalPhone]],
    subject: [this.subjects[0], Validators.required],
    message: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(4000)],
    ],
    consent: [false, Validators.requiredTrue],
  });

  protected get submitDisabled(): boolean {
    return this.submitting() || (this.submitAttempted() && this.form.invalid);
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
        ? 'Confirm that you want to submit this form.'
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

  protected onSubmit(): void {
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

    this.submitting.set(true);
    this.contactService
      .submit({
        firstName: value.firstName.trim(),
        lastName: value.lastName.trim(),
        email: value.email.trim(),
        ...(phone ? { phone } : {}),
        subject: value.subject,
        message: value.message.trim(),
        consent: value.consent,
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.submitted.set(true);
          this.form.reset({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            subject: this.subjects[0],
            message: '',
            consent: false,
          });
          this.submitAttempted.set(false);
        },
        error: (error: unknown) => {
          this.apiError.set(toApiError(error));
        },
      });
  }

  protected resetForm(): void {
    this.submitted.set(false);
    this.apiError.set(null);
    this.submitAttempted.set(false);
  }
}

function optionalPhone(control: AbstractControl): { phone: true } | null {
  const value = typeof control.value === 'string' ? control.value.trim() : '';
  if (!value) {
    return null;
  }
  return phonePattern.test(value) ? null : { phone: true };
}
