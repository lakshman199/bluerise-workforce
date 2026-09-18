import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BrandLogo } from '../brand-logo/brand-logo';
import {
  FOOTER_COLUMNS,
  PUBLIC_CONTACT_EMAIL,
  PUBLIC_MOTTO,
  SOCIAL_CONNECT_LABEL,
  VERIFIED_SOCIAL_PROFILES,
} from '../navigation';
import { SocialLinks } from '../social-links/social-links';

@Component({
  selector: 'br-site-footer',
  imports: [RouterLink, BrandLogo, SocialLinks],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooter {
  protected readonly year = new Date().getFullYear();
  protected readonly columns = FOOTER_COLUMNS;
  protected readonly motto = PUBLIC_MOTTO;
  protected readonly contactEmail = PUBLIC_CONTACT_EMAIL;
  protected readonly connectLabel = SOCIAL_CONNECT_LABEL;
  protected readonly hasSocial = VERIFIED_SOCIAL_PROFILES.length > 0;
}
