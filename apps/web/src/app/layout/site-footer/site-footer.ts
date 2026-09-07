import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BrandLogo } from '../brand-logo/brand-logo';
import { FOOTER_COLUMNS, PUBLIC_CONTACT_EMAIL, PUBLIC_MOTTO } from '../navigation';

@Component({
  selector: 'br-site-footer',
  imports: [RouterLink, BrandLogo],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooter {
  protected readonly year = new Date().getFullYear();
  protected readonly columns = FOOTER_COLUMNS;
  protected readonly motto = PUBLIC_MOTTO;
  protected readonly contactEmail = PUBLIC_CONTACT_EMAIL;
}
