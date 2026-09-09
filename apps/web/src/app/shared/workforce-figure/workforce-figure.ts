import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';

import { type WorkforceImage } from '../workforce-images';

@Component({
  selector: 'br-workforce-figure',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './workforce-figure.html',
  styleUrl: './workforce-figure.scss',
  host: {
    '(window:focus)': 'retryIfFailed()',
    '(document:visibilitychange)': 'onVisibilityChange()',
  },
})
export class WorkforceFigure {
  readonly image = input.required<WorkforceImage>();
  readonly caption = input<string | undefined>(undefined);
  readonly eager = input(false);
  readonly ratio = input('3 / 2');

  /**
   * A 404 must not destroy the <img>. Removing it latches the empty frame even
   * after the file is added at the same src (HMR / long-lived tab).
   */
  protected readonly failed = signal(false);

  /** Incremented to remount <img> so the browser retries the same src. */
  protected readonly loadEpoch = signal(0);

  constructor() {
    effect(() => {
      const src = this.image().src;
      void src;
      this.failed.set(false);
      this.loadEpoch.update((epoch) => epoch + 1);
    });
  }

  protected onImageError(): void {
    this.failed.set(true);
  }

  protected onImageLoad(): void {
    this.failed.set(false);
  }

  protected retryIfFailed(): void {
    if (!this.failed()) {
      return;
    }
    this.failed.set(false);
    this.loadEpoch.update((epoch) => epoch + 1);
  }

  protected onVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      this.retryIfFailed();
    }
  }
}
