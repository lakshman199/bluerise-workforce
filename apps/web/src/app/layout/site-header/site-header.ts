import {
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { BrandLogo } from '../brand-logo/brand-logo';
import { PRIMARY_NAV, PUBLIC_CONTACT_EMAIL, PUBLIC_MOTTO } from '../navigation';

@Component({
  selector: 'br-site-header',
  imports: [RouterLink, RouterLinkActive, BrandLogo],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class SiteHeader {
  protected readonly navItems = PRIMARY_NAV;
  protected readonly motto = PUBLIC_MOTTO;
  protected readonly contactEmail = PUBLIC_CONTACT_EMAIL;
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
