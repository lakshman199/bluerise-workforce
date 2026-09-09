import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FOOTER_COLUMNS, PUBLIC_CONTACT_EMAIL } from '../navigation';
import { SiteFooter } from './site-footer';

const STUB_ROUTES = [
  { path: '', children: [] },
  { path: 'about', children: [] },
  { path: 'employers', children: [] },
  { path: 'job-seekers', children: [] },
  { path: 'our-solutions', children: [] },
  { path: 'benefits', children: [] },
  { path: 'industries', children: [] },
  { path: 'resources', children: [] },
  { path: 'contact', children: [] },
];

describe('SiteFooter', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteFooter],
      providers: [provideZonelessChangeDetection(), provideRouter(STUB_ROUTES)],
    }).compileComponents();
  });

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(SiteFooter);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('links only to public Phase 2 routes', () => {
    const root = render();
    const hrefs = Array.from(
      root.querySelectorAll<HTMLAnchorElement>('.footer__nav a'),
    ).map((anchor) => anchor.getAttribute('href'));

    const allowed = new Set(
      FOOTER_COLUMNS.flatMap((column) => column.items.map((item) => item.path)),
    );
    for (const href of hrefs) {
      expect(allowed.has(href ?? '')).toBe(true);
    }

    expect(hrefs).not.toContain('/design-system');
    expect(hrefs).not.toContain('/employees');
    expect(hrefs).not.toContain('/workforce-solutions');
  });

  it('publishes the verified email and omits unconfirmed legal names', () => {
    const text = render().textContent ?? '';

    expect(text).toContain(PUBLIC_CONTACT_EMAIL);
    expect(text).not.toContain('BlueRise Workforce LLC');
    expect(text).not.toContain('TMBS USA INC');
    expect(text).not.toContain('012 3456 789');
    expect(text).not.toContain('Dubai');
    expect(text).not.toContain('linkedin.com');
  });

  it('uses the approved logo on a light plate so the mark stays readable on the dark footer', () => {
    const logo = render().querySelector<HTMLImageElement>('.footer__logo img');
    expect(logo?.getAttribute('src')).toBe('/brand/logo-bluerise.png');
    expect(logo?.getAttribute('alt')).toBe('BlueRise Workforce');
  });
});
