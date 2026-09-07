import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { PUBLIC_PAGE_SKELETONS } from './public-page-content';
import { PublicPageSkeleton } from './public-page-skeleton';

describe('PublicPageSkeleton', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(
          PUBLIC_PAGE_SKELETONS.map((page) => ({
            path: page.path,
            component: PublicPageSkeleton,
          })),
        ),
      ],
    });
  });

  it('renders the Resources skeleton for /resources', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/resources', PublicPageSkeleton);

    const text = harness.routeNativeElement?.textContent ?? '';
    expect(text).toContain('Resources');
    expect(text).toContain(PUBLIC_PAGE_SKELETONS[0].intro);
  });

  it('shows the verified email on Contact Us and does not invent a phone number', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/contact', PublicPageSkeleton);

    const text = harness.routeNativeElement?.textContent ?? '';
    expect(text).toContain('Contact Us');
    expect(text).toContain('info@blueriseworkforce.com');
    expect(text).not.toContain('012 3456 789');
    expect(text).not.toContain('Dubai');
  });
});
