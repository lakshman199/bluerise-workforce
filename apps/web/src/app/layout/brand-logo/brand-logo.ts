import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The approved BlueRise Workforce mark. The PNG already contains the wordmark and the
 * "Great Jobs. Better Benefits. Real Security." line, so surrounding chrome must not
 * repeat those words as text.
 */
@Component({
  selector: 'br-brand-logo',
  templateUrl: './brand-logo.html',
  styleUrl: './brand-logo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandLogo {
  readonly alt = input('BlueRise Workforce');
}
