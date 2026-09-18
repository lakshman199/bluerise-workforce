import {
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { BrandLogo } from '../brand-logo/brand-logo';
import {
  PRIMARY_NAV,
  PUBLIC_CONTACT_EMAIL,
  SOCIAL_CONNECT_LABEL,
  UTILITY_CONTACT_LABEL,
  VERIFIED_SOCIAL_PROFILES,
} from '../navigation';
import { SocialLinks } from '../social-links/social-links';

@Component({
  selector: 'br-site-header',
  imports: [RouterLink, RouterLinkActive, BrandLogo, SocialLinks],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class SiteHeader {
  protected readonly navItems = PRIMARY_NAV;
  protected readonly contactEmail = PUBLIC_CONTACT_EMAIL;
  protected readonly connectLabel = SOCIAL_CONNECT_LABEL;
  protected readonly utilityContactLabel = UTILITY_CONTACT_LABEL;
  protected readonly hasSocial = VERIFIED_SOCIAL_PROFILES.length > 0;
  protected readonly menuOpen = signal(false);

  private readonly menuToggle = viewChild<ElementRef<HTMLButtonElement>>('menuToggle');

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    if (!this.menuOpen()) {
      return;
    }
    this.menuOpen.set(false);
    // Returning focus to the trigger is what makes the menu usable by keyboard: without
    // it, closing the panel drops focus to the top of the document.
    this.menuToggle()?.nativeElement.focus();
  }
}
