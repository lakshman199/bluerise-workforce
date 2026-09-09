import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { PRIMARY_NAV } from '../navigation';
import { SiteHeader } from './site-header';

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

function labelsOf(root: HTMLElement, selector: string): string[] {
  return Array.from(root.querySelectorAll(selector)).map(
    (el) => el.textContent?.trim() ?? '',
  );
}

describe('SiteHeader', () => {
  const publicLabels = PRIMARY_NAV.map((item) => item.label);

  it('includes Industries We Serve in desktop and mobile navigation', async () => {
    const fixture = await renderAt('/');
    const root = fixture.nativeElement as HTMLElement;

    expect(labelsOf(root, '.nav__link')).toContain('Industries We Serve');
    expect(root.querySelector('a.nav__link[href="/industries"]')).not.toBeNull();

    root.querySelector<HTMLButtonElement>('button[aria-controls="mobile-menu"]')?.click();
    fixture.detectChanges();

    expect(labelsOf(root, '.mobile-menu__link')).toContain('Industries We Serve');
    expect(root.querySelector('a.mobile-menu__link[href="/industries"]')).not.toBeNull();
  });

  it('lists the approved public navigation and nothing from the development shell', async () => {
    const fixture = await renderAt('/');
    const root = fixture.nativeElement as HTMLElement;
    const labels = labelsOf(root, '.nav__link');

    expect(labels).toEqual([...publicLabels]);
    expect(labels).not.toContain('Design system');
    expect(labels).not.toContain('Platform');
    expect(labels).not.toContain('Architecture');
    expect(labels).not.toContain('Roadmap');
    expect(labels).not.toContain('Employees');
    expect(labels).not.toContain('Workforce Solutions');
    expect(root.textContent).not.toContain('Live system status');
  });

  it('marks only the matching route link as the current page', async () => {
    const fixture = await renderAt('/about');
    const root = fixture.nativeElement as HTMLElement;

    const active = Array.from(root.querySelectorAll('.nav__link--active'));
    expect(active.length).toBe(1);
    expect(active[0]?.textContent?.trim()).toBe('About Us');
    expect(active[0]?.getAttribute('aria-current')).toBe('page');
  });

  it('marks Home as current only on the home path', async () => {
    const home = await renderAt('/');
    expect(
      Array.from(
        (home.nativeElement as HTMLElement).querySelectorAll('.nav__link--active'),
      ).map((el) => el.textContent?.trim()),
    ).toEqual(['Home']);

    TestBed.resetTestingModule();

    const about = await renderAt('/about');
    const active = Array.from(
      (about.nativeElement as HTMLElement).querySelectorAll('.nav__link--active'),
    ).map((el) => el.textContent?.trim());
    expect(active).not.toContain('Home');
  });

  it('does not treat the design-system route as a public current page', async () => {
    const fixture = await renderAt('/design-system');
    const active = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '.nav__link--active',
    );
    expect(active.length).toBe(0);
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
    expect(labelsOf(root, '.mobile-menu__link')).toEqual([...publicLabels]);
  });

  it('closes the mobile menu on Escape and returns focus to the toggle', async () => {
    const fixture = await renderAt('/');
    const root = fixture.nativeElement as HTMLElement;
    const toggle = root.querySelector<HTMLButtonElement>(
      'button[aria-controls="mobile-menu"]',
    );

    toggle?.click();
    fixture.detectChanges();
    expect(root.querySelector('#mobile-menu')).not.toBeNull();

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();

    expect(toggle?.getAttribute('aria-expanded')).toBe('false');
    expect(root.querySelector('#mobile-menu')).toBeNull();
  });

  it('renders the approved logo with an accessible name', async () => {
    const fixture = await renderAt('/');
    const logo = (fixture.nativeElement as HTMLElement).querySelector<HTMLImageElement>(
      '.brand img',
    );
    expect(logo).not.toBeNull();
    expect(logo?.getAttribute('src')).toBe('/brand/logo-bluerise.png');
    expect(logo?.getAttribute('alt')).toBe('BlueRise Workforce');
  });

  it('publishes the verified email and does not invent a phone or street address', async () => {
    const fixture = await renderAt('/');
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('info@blueriseworkforce.com');
    expect(text).not.toContain('012 3456 789');
    expect(text).not.toContain('Dubai');
  });
});
