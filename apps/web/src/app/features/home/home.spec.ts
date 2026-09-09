import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Home } from './home';
import {
  CLOSE_HEADLINE,
  CLOSE_PRIMARY_CTA,
  CLOSE_SECONDARY_CTA,
  COMMUNITY_CLOSING,
  COMMUNITY_HEADLINE,
  COMMUNITY_ITEMS,
  HERO_HEADLINE_PRIMARY,
  HERO_PLATFORM_AREAS,
  INDUSTRIES_HEADLINE,
  INDUSTRY_SLIDES,
  PURPOSE_HEADLINE,
  PURPOSE_ITEMS,
  TOGETHER_CTA,
  TOGETHER_HEADLINE,
  TOGETHER_LEAD,
  VALUE_ITEMS,
  VALUES_HEADLINE,
} from './home-content';
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
        { path: 'contact', children: [] },
        { path: 'our-solutions', children: [] },
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

  it('places a restaurant and grocery industry section after the hero', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const industries = root.querySelector('#industries');

    expect(industries).not.toBeNull();
    expect(root.querySelector('.hero')?.nextElementSibling).toBe(industries);
    expect(industries?.nextElementSibling).toBe(root.querySelector('#purpose'));
    expect(industries?.querySelector('h2')?.textContent).toContain(INDUSTRIES_HEADLINE);
    expect(industries?.textContent).toContain('restaurants');
    expect(industries?.textContent).toContain('grocery stores');
    expect(industries?.querySelector('br-industry-showcase')).not.toBeNull();
    expect(industries?.querySelectorAll('.showcase__slide').length).toBe(
      INDUSTRY_SLIDES.length,
    );
    expect(industries?.textContent).not.toMatch(/customer|partnered|live integration/i);
    expect(industries?.textContent).not.toMatch(/cost savings|market share|proven/i);
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

  it('shows a platform overview in the hero, not live employee or payroll data', () => {
    const fixture = setup();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    for (const area of HERO_PLATFORM_AREAS) {
      expect(text).toContain(area);
    }
    expect(text).not.toContain('Employee portal');
    expect(text).not.toContain('Pay statement');
    expect(text).not.toContain('Coverage on file');
    expect(text).not.toContain('Direct deposit');
    expect(text).not.toContain('Enrolled');
    expect(text).not.toContain('3 of 5');
    expect(text).not.toContain('Live system status');
    expect(text).not.toContain('Phase 4');
    expect(text).not.toContain('Roadmap');
    expect(text).not.toContain('bluerise-api');
    expect(text).not.toMatch(/Priya|Marcus|Gusto|ADP/);
  });

  it('renders Community Impact after Inclusion as aspirational pathways, not results', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const community = root.querySelector('#community');

    expect(community).not.toBeNull();
    expect(root.querySelector('#inclusion')?.nextElementSibling).toBe(community);
    expect(community?.querySelector('h2')?.textContent).toContain(COMMUNITY_HEADLINE);
    expect(community?.textContent).toContain('We aspire to establish programs');
    expect(community?.textContent).toContain(COMMUNITY_CLOSING);
    expect(community?.querySelectorAll('.impact-card').length).toBe(
      COMMUNITY_ITEMS.length,
    );
    for (const item of COMMUNITY_ITEMS) {
      expect(community?.textContent).toContain(item.title);
    }
    expect(community?.textContent).not.toMatch(/\d+%/);
    expect(community?.textContent).not.toMatch(/\$\d/);
    expect(community?.textContent).not.toMatch(/partnered with|in partnership with/i);
  });

  it('renders A Future Built Together with Explore Benefits after Community Impact', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const together = root.querySelector('#together');

    expect(together).not.toBeNull();
    expect(root.querySelector('#community')?.nextElementSibling).toBe(together);
    expect(together?.querySelector('h2')?.textContent).toContain(TOGETHER_HEADLINE);
    expect(together?.textContent).toContain(TOGETHER_LEAD);
    expect(together?.textContent).toContain('meaningful employment');
    expect(together?.textContent).toContain('lasting impact');
    expect(together?.querySelector('a[href="/benefits"]')?.textContent?.trim()).toBe(
      TOGETHER_CTA,
    );
  });

  it('renders Values and a final CTA for employers, job seekers, and community partners', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const values = root.querySelector('#values');
    const close = root.querySelector('#connect');

    expect(values).not.toBeNull();
    expect(close).not.toBeNull();
    expect(root.querySelector('#together')?.nextElementSibling).toBe(values);
    expect(values?.nextElementSibling).toBe(close);
    expect(values?.querySelector('h2')?.textContent).toContain(VALUES_HEADLINE);
    expect(values?.querySelectorAll('.value-card').length).toBe(VALUE_ITEMS.length);
    for (const item of VALUE_ITEMS) {
      expect(values?.textContent).toContain(item.title);
      expect(values?.textContent).toContain(item.body);
    }
    expect(close?.querySelector('h2')?.textContent).toContain(CLOSE_HEADLINE);
    expect(close?.textContent).toContain(
      'Employers, job seekers, and community partners',
    );
    expect(close?.querySelector('a[href="/contact"]')?.textContent?.trim()).toBe(
      CLOSE_PRIMARY_CTA,
    );
    expect(close?.querySelector('a[href="/our-solutions"]')?.textContent?.trim()).toBe(
      CLOSE_SECONDARY_CTA,
    );
  });

  it('uses a single h1 and one h2 per homepage section', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelectorAll('h2').length).toBe(8);
    expect(root.querySelector('#industries')?.getAttribute('aria-labelledby')).toBe(
      'industries-heading',
    );
    expect(root.querySelector('#purpose')?.getAttribute('aria-labelledby')).toBe(
      'purpose-heading',
    );
    expect(root.querySelector('#about')?.getAttribute('aria-labelledby')).toBe(
      'about-heading',
    );
    expect(root.querySelector('#inclusion')?.getAttribute('aria-labelledby')).toBe(
      'inclusion-heading',
    );
    expect(root.querySelector('#community')?.getAttribute('aria-labelledby')).toBe(
      'community-heading',
    );
    expect(root.querySelector('#together')?.getAttribute('aria-labelledby')).toBe(
      'together-heading',
    );
    expect(root.querySelector('#values')?.getAttribute('aria-labelledby')).toBe(
      'values-heading',
    );
    expect(root.querySelector('#connect')?.getAttribute('aria-labelledby')).toBe(
      'close-heading',
    );
  });
});
