import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { inject } from '@angular/core';

interface TokenSwatch {
  name: string;
  variable: string;
  note?: string;
}

@Component({
  selector: 'br-design-system',
  imports: [ReactiveFormsModule],
  templateUrl: './design-system.html',
  styleUrl: './design-system.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'modalOpen.set(false)',
  },
})
export class DesignSystem {
  private readonly formBuilder = inject(FormBuilder);

  protected readonly blueRamp: TokenSwatch[] = rampSwatches(
    'blue',
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  );

  protected readonly neutralRamp: TokenSwatch[] = rampSwatches(
    'neutral',
    [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  );

  protected readonly semanticSwatches: TokenSwatch[] = [
    { name: 'Success', variable: '--br-success', note: '4.9:1 on white' },
    { name: 'Warning', variable: '--br-warning', note: '4.9:1 on white' },
    { name: 'Danger', variable: '--br-danger', note: '5.9:1 on white' },
    { name: 'Info', variable: '--br-info', note: '6.2:1 on white' },
  ];

  protected readonly typeScale = [
    { label: 'Display', token: '--br-text-6xl' },
    { label: 'Heading 1', token: '--br-text-5xl' },
    { label: 'Heading 2', token: '--br-text-4xl' },
    { label: 'Heading 3', token: '--br-text-2xl' },
    { label: 'Heading 4', token: '--br-text-xl' },
    { label: 'Body large', token: '--br-text-lg' },
    { label: 'Body', token: '--br-text-base' },
    { label: 'Small', token: '--br-text-sm' },
  ];

  protected readonly spacingScale = [1, 2, 3, 4, 6, 8, 12, 16, 24];
  protected readonly radiusScale = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  protected readonly shadowScale = ['xs', 'sm', 'md', 'lg'];

  protected readonly activeTab = signal<'preview' | 'usage'>('preview');
  protected readonly modalOpen = signal(false);
  protected readonly submitting = signal(false);
  protected readonly submitted = signal(false);

  /**
   * A real reactive form rather than a static mock-up, so the validation, error, disabled,
   * and pending states below are the ones a page would actually produce.
   */
  protected readonly exampleForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(20)]],
    consent: [false, Validators.requiredTrue],
  });

  protected readonly subjects = [
    'General Inquiry',
    'Employers',
    'Employees / Job Seekers',
    'Benefits',
    'Partnership',
    'Other',
  ];

  protected showError(controlName: keyof typeof this.exampleForm.controls): boolean {
    const control = this.exampleForm.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  protected errorFor(controlName: keyof typeof this.exampleForm.controls): string {
    const control = this.exampleForm.controls[controlName];
    const errors = control.errors;
    if (!errors) return '';
    if (errors['required']) return 'This field is required.';
    if (errors['requiredTrue']) return 'Please confirm to continue.';
    if (errors['email']) return 'Enter an email address in the form name@example.com.';
    if (errors['minlength']) {
      const { requiredLength } = errors['minlength'] as { requiredLength: number };
      return `Use at least ${requiredLength} characters.`;
    }
    return 'Check this field.';
  }

  protected submitExample(): void {
    if (this.exampleForm.invalid) {
      this.exampleForm.markAllAsTouched();
      return;
    }

    // Nothing is sent anywhere. This demonstrates the pending and success states of the
    // form pattern; the contact endpoint arrives in Phase 2.
    this.submitting.set(true);
    this.submitted.set(false);

    setTimeout(() => {
      this.submitting.set(false);
      this.submitted.set(true);
    }, 900);
  }

  protected resetExample(): void {
    this.exampleForm.reset();
    this.submitted.set(false);
  }
}

function rampSwatches(ramp: string, steps: number[]): TokenSwatch[] {
  return steps.map((step) => ({
    name: `${ramp}-${step}`,
    variable: `--br-${ramp}-${step}`,
  }));
}
