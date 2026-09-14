import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  GLANCE_CARDS,
  GLANCE_HEADLINE_ACCENT,
  GLANCE_HEADLINE_LEAD,
} from './home-content';

@Component({
  selector: 'br-hero-glance',
  imports: [RouterLink],
  templateUrl: './hero-glance.html',
  styleUrl: './hero-glance.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroGlance {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly visible = signal(false);
  protected readonly headlineLead = GLANCE_HEADLINE_LEAD;
  protected readonly headlineAccent = GLANCE_HEADLINE_ACCENT;
  protected readonly cards = GLANCE_CARDS;

  constructor() {
    afterNextRender(() => this.observeEntrance());
  }

  private observeEntrance(): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      this.visible.set(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.visible.set(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(this.host.nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
