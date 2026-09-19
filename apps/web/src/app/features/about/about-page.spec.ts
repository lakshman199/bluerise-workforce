import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import {
  ABOUT_CLOSE_CTA,
  ABOUT_CLOSE_HEADLINE_ACCENT,
  ABOUT_CLOSE_HEADLINE_LEAD,
  ABOUT_CLOSE_LEAD,
  ABOUT_HEADLINE_ACCENT,
  ABOUT_HEADLINE_LEAD,
  ABOUT_HERO_IMAGE,
  ABOUT_INTRO,
  ABOUT_MISSION,
  ABOUT_PRIMARY_CTA,
  ABOUT_SECONDARY_CTA,
  ABOUT_VALUES,
  ABOUT_VISION,
  TALENT_HEADLINE_ACCENT,
  TALENT_HEADLINE_LEAD,
  TALENT_IDEAS,
  TALENT_INTRO,
} from './about-content';
import { AboutPage } from './about-page';

if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

describe('AboutPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AboutPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([{ path: 'contact', children: [] }]),
      ],
    });
  });

  function render() {
    const fixture = TestBed.createComponent(AboutPage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('uses the refreshed About, Mission, Vision, Talent, and Values copy', () => {
    const root = render();

    expect(root.querySelector('h1')?.textContent).toContain(ABOUT_HEADLINE_LEAD);
    expect(root.querySelector('h1')?.textContent).toContain(ABOUT_HEADLINE_ACCENT);
    expect(root.textContent).toContain(ABOUT_INTRO);
    expect(root.textContent).toContain(ABOUT_MISSION);
    expect(root.textContent).toContain(ABOUT_VISION);
    expect(root.querySelector('#about-talent')?.textContent).toContain(TALENT_HEADLINE_LEAD);
    expect(root.querySelector('#about-talent')?.textContent).toContain(TALENT_HEADLINE_ACCENT);
    expect(root.textContent).toContain(TALENT_INTRO);
    for (const idea of TALENT_IDEAS) {
      expect(root.textContent).toContain(idea.title);
      expect(root.textContent).toContain(idea.body);
    }
    expect(root.textContent).toContain('The Values Behind BlueRise');
    for (const value of ABOUT_VALUES) {
      expect(root.textContent).toContain(value.title);
      expect(root.textContent).toContain(value.body);
    }
  });

  it('renders the team collaboration artwork without describing people as employees', () => {
    const root = render();
    const image = root.querySelector<HTMLImageElement>('img.about__hero-image');

    expect(image?.getAttribute('src')).toBe(ABOUT_HERO_IMAGE.src);
    expect(image?.getAttribute('alt')).toBe(ABOUT_HERO_IMAGE.alt);
    expect(image?.getAttribute('alt')?.toLowerCase()).not.toContain('employee');
    expect(image?.getAttribute('width')).toBe(String(ABOUT_HERO_IMAGE.width));
    expect(image?.getAttribute('height')).toBe(String(ABOUT_HERO_IMAGE.height));
  });

  it('does not invent history, people, offices, awards, or counts', () => {
    const text = render().textContent ?? '';

    expect(text).not.toMatch(/founded|founder|CEO|headquarters|offices/i);
    expect(text).not.toMatch(/award|certif|ISO |employees worldwide/i);
    expect(text).not.toContain('customers');
  });

  it('keeps a single h1 and uses existing purpose and contact destinations', () => {
    const root = render();

    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelector('#why')).not.toBeNull();
    expect(root.querySelector('a[href="#why"]')?.textContent?.trim()).toBe(ABOUT_PRIMARY_CTA);
    expect(root.querySelectorAll('a[href="/contact"]').length).toBe(2);
    expect(root.querySelector('.about__hero-actions a[href="/contact"]')?.textContent?.trim()).toBe(
      ABOUT_SECONDARY_CTA,
    );
    expect(root.querySelector('.about__close a[href="/contact"]')?.textContent?.trim()).toBe(
      ABOUT_CLOSE_CTA,
    );
    expect(root.querySelector('#about-close-heading')?.textContent).toContain(
      ABOUT_CLOSE_HEADLINE_LEAD,
    );
    expect(root.querySelector('#about-close-heading')?.textContent).toContain(
      ABOUT_CLOSE_HEADLINE_ACCENT,
    );
    expect(root.textContent).toContain(ABOUT_CLOSE_LEAD);
    expect(root.querySelector('a[href="/inclusion"]')).toBeNull();
  });
});
