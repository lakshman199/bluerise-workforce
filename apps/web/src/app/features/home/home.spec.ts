import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Home } from './home';
import { HERO_HEADLINE_PRIMARY, PURPOSE_HEADLINE, PURPOSE_ITEMS } from './home-content';
import {
  ABOUT_HEADLINE,
  ABOUT_HOME_CTA,
  ABOUT_HOME_INTRO,
  ABOUT_MISSION,
  ABOUT_VISION,
  TALENT_HEADING,
} from '../about/about-content';
import { INCLUSION_HEADLINE, INCLUSION_HOME_CTA } from '../inclusion/inclusion-content';

function setup() {
  TestBed.configureTestingModule({
    imports: [Home],
    providers: [
      provideZonelessChangeDetection(),
      provideRouter([
        { path: 'benefits', children: [] },
        { path: 'about', children: [] },
        { path: 'inclusion', children: [] },
      ]),
    ],
  });

  const fixture = TestBed.createComponent(Home);
  fixture.detectChanges();
  return fixture;
}

describe('Home', () => {
  it('uses the approved hero message with the plural Workforces standard', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const heading = root.querySelector('h1')?.textContent ?? '';

    expect(heading).toContain(HERO_HEADLINE_PRIMARY);
    expect(heading).toContain('Creating Brighter Futures.');
    expect(heading).not.toContain('Building Stronger Workforce.');
    expect(root.textContent).toContain('work is more than employment');
    expect(root.textContent).toContain('supporting families');
    expect(root.textContent).toContain('respect, compassion');
  });

  it('sends the primary CTA to Core Purpose and the secondary CTA to Benefits', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const purpose = root.querySelector<HTMLAnchorElement>('a[href="#purpose"]');
    const benefits = root.querySelector<HTMLAnchorElement>('a[href="/benefits"]');

    expect(purpose?.textContent?.trim()).toBe('Explore Our Purpose');
    expect(benefits?.textContent?.trim()).toBe('View Benefits');
    expect(root.querySelector('#purpose')).not.toBeNull();
    expect(root.querySelector('#purpose h2')?.textContent).toContain(PURPOSE_HEADLINE);
  });

  it('renders all five Core Purpose items', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const cards = root.querySelectorAll('.purpose-card');

    expect(cards.length).toBe(PURPOSE_ITEMS.length);
    for (const item of PURPOSE_ITEMS) {
      expect(root.textContent).toContain(item.title);
    }
  });

  it('summarizes About, Mission, Vision, and Talent Meets Purpose after Core Purpose', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const about = root.querySelector('#about');
    const purpose = root.querySelector('#purpose');

    expect(about).not.toBeNull();
    expect(purpose?.nextElementSibling).toBe(about);
    expect(about?.querySelector('h2')?.textContent).toContain(ABOUT_HEADLINE);
    expect(about?.textContent).toContain(ABOUT_HOME_INTRO);
    expect(about?.textContent).toContain(ABOUT_MISSION);
    expect(about?.textContent).toContain(ABOUT_VISION);
    expect(about?.textContent).toContain(TALENT_HEADING);
    expect(about?.querySelector('a[href="/about"]')?.textContent?.trim()).toBe(
      ABOUT_HOME_CTA,
    );
  });

  it('renders the Inclusion commitment after About and links to /inclusion', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const inclusion = root.querySelector('#inclusion');

    expect(inclusion).not.toBeNull();
    expect(root.querySelector('#about')?.nextElementSibling).toBe(inclusion);
    expect(inclusion?.textContent).toContain(INCLUSION_HEADLINE);
    expect(inclusion?.textContent).toContain('autism spectrum');
    expect(inclusion?.textContent).toContain('neurodiverse');
    expect(inclusion?.querySelector('a[href="/inclusion"]')?.textContent?.trim()).toBe(
      INCLUSION_HOME_CTA,
    );
  });

  it('keeps the hero visual generic and does not present developer status', () => {
    const fixture = setup();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Sample view');
    expect(text).toContain('Team member');
    expect(text).not.toContain('Live system status');
    expect(text).not.toContain('Phase 4');
    expect(text).not.toContain('Roadmap');
    expect(text).not.toContain('bluerise-api');
    expect(text).not.toMatch(/Priya|Marcus|Gusto|ADP/);
  });

  it('uses a single h1 and section h2s for Purpose, About, and Inclusion', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelectorAll('h2').length).toBe(3);
    expect(root.querySelector('#purpose')?.getAttribute('aria-labelledby')).toBe(
      'purpose-heading',
    );
    expect(root.querySelector('#about')?.getAttribute('aria-labelledby')).toBe(
      'about-heading',
    );
    expect(root.querySelector('#inclusion')?.getAttribute('aria-labelledby')).toBe(
      'inclusion-heading',
    );
  });
});
