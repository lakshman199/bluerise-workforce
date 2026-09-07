import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { SiteHeader } from './site-header';

// Stubs rather than the real routes: `routerLinkActive` only needs the URLs to resolve,
// and pulling in the lazy-loaded pages would make this a test of those pages instead.
const STUB_ROUTES = [
  { path: '', children: [] },
  { path: 'design-system', children: [] },
];

async function renderAt(path: string) {
  TestBed.configureTestingModule({
    imports: [SiteHeader],
    providers: [provideZonelessChangeDetection(), provideRouter(STUB_ROUTES)],
  });

  await TestBed.inject(Router).navigateByUrl(path);

  const fixture = TestBed.createComponent(SiteHeader);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();

  return fixture;
}

describe('SiteHeader', () => {
  it('marks only the matching route link as the current page', async () => {
    const fixture = await renderAt('/design-system');
    const root = fixture.nativeElement as HTMLElement;

    const active = Array.from(root.querySelectorAll('.nav__link--active'));
    expect(active.length).toBe(1);
    expect(active[0]?.textContent?.trim()).toBe('Design system');
    expect(active[0]?.getAttribute('aria-current')).toBe('page');
  });

  /**
   * Every fragment link points at a section of the home page, so routing alone cannot tell
   * them apart. Left to `routerLinkActive` they all highlight at once, which is what the
   * header did before this was fixed.
   */
  it('never marks a same-page fragment link as active', async () => {
    for (const path of ['/', '/design-system']) {
      const fixture = await renderAt(path);
      const root = fixture.nativeElement as HTMLElement;

      const activeLabels = Array.from(root.querySelectorAll('.nav__link--active')).map(
        (el) => el.textContent?.trim(),
      );

      expect(activeLabels).not.toContain('Platform');
      expect(activeLabels).not.toContain('Architecture');
      expect(activeLabels).not.toContain('Roadmap');
      expect(activeLabels.length).toBeLessThanOrEqual(1);

      TestBed.resetTestingModule();
    }
  });

  it('keeps the mobile menu closed until it is asked for, and reports that state', async () => {
    const fixture = await renderAt('/');
    const root = fixture.nativeElement as HTMLElement;

    const toggle = root.querySelector<HTMLButtonElement>(
      'button[aria-controls="mobile-menu"]',
    );
    expect(toggle).not.toBeNull();
    expect(toggle?.getAttribute('aria-expanded')).toBe('false');
    expect(root.querySelector('#mobile-menu')).toBeNull();

    toggle?.click();
    fixture.detectChanges();

    expect(toggle?.getAttribute('aria-expanded')).toBe('true');
    expect(root.querySelector('#mobile-menu')).not.toBeNull();
  });
});
