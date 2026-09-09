import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';

import { WORKFORCE_IMAGES, type WorkforceImage } from '../../../shared/workforce-images';
import { INDUSTRY_SLIDES, type IndustrySlideCopy } from '../home-content';

export interface IndustrySlide extends IndustrySlideCopy {
  readonly image: WorkforceImage;
}

const SLIDE_IMAGES = [
  WORKFORCE_IMAGES.restaurantWorkforce,
  WORKFORCE_IMAGES.groceryWorkforce,
  WORKFORCE_IMAGES.restaurantOperations,
  WORKFORCE_IMAGES.groceryCheckout,
] as const;

const AUTO_ADVANCE_MS = 6000;

@Component({
  selector: 'br-industry-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './industry-showcase.html',
  styleUrl: './industry-showcase.scss',
})
export class IndustryShowcase {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly slides: readonly IndustrySlide[] = INDUSTRY_SLIDES.map(
    (slide, index) => {
      const image = SLIDE_IMAGES[index];
      if (!image) {
        throw new Error(`Missing industry image for ${slide.heading}`);
      }
      return { ...slide, image };
    },
  );

  protected readonly index = signal(0);

  private timer: ReturnType<typeof setInterval> | undefined;
  private hoverPaused = false;
  private focusPaused = false;
  private manualPaused = false;
  private reduceMotion = false;

  constructor() {
    afterNextRender(() => {
      this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!this.reduceMotion) {
        this.startTimer();
      }
    });

    this.destroyRef.onDestroy(() => this.clearTimer());
  }

  protected onPointerEnter(): void {
    this.hoverPaused = true;
  }

  protected onPointerLeave(): void {
    this.hoverPaused = false;
  }

  protected onFocusIn(): void {
    this.focusPaused = true;
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget;
    if (next instanceof Node && (event.currentTarget as Node).contains(next)) {
      return;
    }
    this.focusPaused = false;
  }

  protected previous(): void {
    this.goTo(this.index() - 1, true);
  }

  protected next(): void {
    this.goTo(this.index() + 1, true);
  }

  protected goTo(nextIndex: number, manual = false): void {
    const total = this.slides.length;
    this.index.set(((nextIndex % total) + total) % total);
    if (manual) {
      this.manualPaused = true;
    }
  }

  private startTimer(): void {
    this.clearTimer();
    this.timer = setInterval(() => {
      if (
        this.hoverPaused ||
        this.focusPaused ||
        this.manualPaused ||
        this.reduceMotion
      ) {
        return;
      }
      this.goTo(this.index() + 1);
    }, AUTO_ADVANCE_MS);
  }

  private clearTimer(): void {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}
