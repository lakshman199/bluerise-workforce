import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HealthResponse } from '@bluerise/shared-types';

import { toApiError, type ApiError } from '../../core/api/api-error';
import { HealthService } from '../../core/api/health.service';
import { DELIVERY_PHASES, PLATFORM_MODULES } from './platform-content';

type LoadState = 'loading' | 'loaded' | 'error';

@Component({
  selector: 'br-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly healthService = inject(HealthService);
  // Captured as a field so the retry path, which runs outside the injection context, can
  // still tie its subscription to this component's lifetime.
  private readonly destroyRef = inject(DestroyRef);

  protected readonly modules = PLATFORM_MODULES;
  protected readonly phases = DELIVERY_PHASES;

  protected readonly state = signal<LoadState>('loading');
  protected readonly health = signal<HealthResponse | null>(null);
  protected readonly error = signal<ApiError | null>(null);

  constructor() {
    this.loadHealth();
  }

  protected loadHealth(): void {
    this.state.set('loading');
    this.error.set(null);

    this.healthService
      .getHealth()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (health) => {
          this.health.set(health);
          this.state.set('loaded');
        },
        error: (cause: unknown) => {
          this.error.set(toApiError(cause));
          this.state.set('error');
        },
      });
  }

  protected badgeClassFor(status: string): string {
    if (status === 'ok') return 'br-badge br-badge--success';
    if (status === 'degraded') return 'br-badge br-badge--warning';
    return 'br-badge br-badge--danger';
  }
}
