import { afterNextRender, ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  HERO_EYEBROW,
  HERO_HEADLINE_ACCENT,
  HERO_HEADLINE_PRIMARY,
  HERO_LEAD,
  PURPOSE_EYEBROW,
  PURPOSE_HEADLINE,
  PURPOSE_ITEMS,
  PURPOSE_LEAD,
} from './home-content';

@Component({
  selector: 'br-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly eyebrow = HERO_EYEBROW;
  protected readonly headlinePrimary = HERO_HEADLINE_PRIMARY;
  protected readonly headlineAccent = HERO_HEADLINE_ACCENT;
  protected readonly lead = HERO_LEAD;
  protected readonly purposeEyebrow = PURPOSE_EYEBROW;
  protected readonly purposeHeadline = PURPOSE_HEADLINE;
  protected readonly purposeLead = PURPOSE_LEAD;
  protected readonly purposeItems = PURPOSE_ITEMS;

  constructor() {
    afterNextRender(() => {
      if (window.location.hash === '#purpose') {
        this.scrollPurposeIntoView(false);
      }
    });
  }

  /**
   * Angular's in-memory anchor scrolling does not honour CSS `scroll-margin`, so the
   * sticky header would cover the Core Purpose heading. Native `scrollIntoView` does.
   */
  protected onExplorePurpose(event: Event): void {
    event.preventDefault();
    this.scrollPurposeIntoView(true);
  }

  private scrollPurposeIntoView(smooth: boolean): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('purpose')?.scrollIntoView({
      behavior: reduceMotion || !smooth ? 'auto' : 'smooth',
      block: 'start',
    });
  }
}
