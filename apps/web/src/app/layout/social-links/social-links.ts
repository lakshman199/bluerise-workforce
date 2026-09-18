import { ChangeDetectionStrategy, Component } from '@angular/core';

import { VERIFIED_SOCIAL_PROFILES } from '../navigation';

@Component({
  selector: 'br-social-links',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './social-links.html',
  styleUrl: './social-links.scss',
})
export class SocialLinks {
  protected readonly links = VERIFIED_SOCIAL_PROFILES;
}
