import { HttpErrorResponse } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { HealthResponse } from '@bluerise/shared-types';
import { of, throwError } from 'rxjs';

import { HealthService } from '../../core/api/health.service';
import { Home } from './home';

const healthyResponse: HealthResponse = {
  status: 'ok',
  service: 'bluerise-api',
  version: '0.1.0',
  environment: 'development',
  uptimeSeconds: 42,
  timestamp: '2026-09-06T21:14:03.221Z',
  dependencies: [
    { name: 'postgres', status: 'ok', durationMs: 2.1, detail: 'Connected.' },
    {
      name: 'migrations',
      status: 'ok',
      durationMs: 1.4,
      detail: '1 migration(s) applied. Schema is up to date.',
    },
  ],
};

function setup(healthService: Pick<HealthService, 'getHealth'>) {
  TestBed.configureTestingModule({
    imports: [Home],
    providers: [
      provideZonelessChangeDetection(),
      provideRouter([]),
      { provide: HealthService, useValue: healthService },
    ],
  });

  const fixture = TestBed.createComponent(Home);
  fixture.detectChanges();
  return fixture;
}

describe('Home', () => {
  it('shows the live dependency detail once health resolves', () => {
    const fixture = setup({ getHealth: () => of(healthyResponse) });
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('bluerise-api');
    expect(text).toContain('postgres');
    expect(text).toContain('Schema is up to date');
  });

  it('offers a retry when the API cannot be reached', () => {
    const fixture = setup({
      getHealth: () => throwError(() => new HttpErrorResponse({ status: 0 })),
    });

    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Could not reach the BlueRise API');

    const retry = Array.from(root.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Try again'),
    );
    expect(retry).toBeDefined();
  });

  it('announces the failure to assistive technology', () => {
    const fixture = setup({
      getHealth: () => throwError(() => new HttpErrorResponse({ status: 500 })),
    });

    const alert = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');
    expect(alert).not.toBeNull();
  });

  it('states the phase for every platform module so nothing reads as already available', () => {
    const fixture = setup({ getHealth: () => of(healthyResponse) });
    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('.module');

    expect(cards.length).toBe(6);
    for (const card of Array.from(cards)) {
      expect(card.textContent).toMatch(/Phase \d/);
    }
  });
});
