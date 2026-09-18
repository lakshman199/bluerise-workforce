import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Home } from './home';
import {
  CLOSE_PRIMARY_CTA,
  COMMUNITY_CLOSING,
  COMMUNITY_HEADLINE,
  COMMUNITY_ITEMS,
  GLANCE_CARDS,
  GLANCE_HEADLINE_ACCENT,
  GLANCE_HEADLINE_LEAD,
  HERO_HEADLINE_ACCENT,
  HERO_HEADLINE_PRIMARY,
  HERO_LEAD,
  HERO_PRIMARY_CTA,
  HERO_SCENE_ALT,
  HERO_SCENE_FRAMES,
  HERO_SECONDARY_CTA,
  HERO_SERVICE_CARDS,
  HOW_IT_WORKS_HEADLINE,
  HOW_IT_WORKS_STEPS,
  PURPOSE_ITEMS,
  PURPOSE_LEAD,
  TOGETHER_CTA,
  TOGETHER_HEADLINE,
  TOGETHER_LEAD,
  TRUST_LEAD,
} from './home-content';
import { ABOUT_HOME_CTA } from '../about/about-content';
import { INCLUSION_HEADLINE, INCLUSION_HOME_CTA } from '../inclusion/inclusion-content';

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
        { path: 'employers', children: [] },
      ]),
    ],
  });

  const fixture = TestBed.createComponent(Home);
  fixture.detectChanges();
  return fixture;
}

describe('Home', () => {
  it('uses the short small-business hero message', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const heading = root.querySelector('h1')?.textContent ?? '';

    expect(heading).toContain(HERO_HEADLINE_PRIMARY);
    expect(heading).toContain(HERO_HEADLINE_ACCENT);
    expect(root.textContent).toContain(HERO_LEAD);
    expect(root.textContent).not.toContain('work is more than employment');
    expect(root.querySelectorAll('.hero__support').length).toBe(1);
  });

  it('sends the primary CTA to the glance section and the secondary CTA to Contact', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const glanceCta = root.querySelector<HTMLAnchorElement>('a[href="#glance"]');
    const contact = root.querySelector<HTMLAnchorElement>('.hero__actions a[href="/contact"]');

    expect(glanceCta?.textContent?.trim()).toBe(HERO_PRIMARY_CTA);
    expect(contact?.textContent?.trim()).toBe(HERO_SECONDARY_CTA);
    expect(root.querySelector('#glance')).not.toBeNull();
    expect(root.querySelector('#purpose h2')?.textContent).toContain('Built for');
    expect(root.querySelector('#purpose h2')?.textContent).toContain('Growing Businesses.');
  });

  it('keeps the homepage industry-neutral after the hero', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const text = root.textContent ?? '';

    expect(root.querySelector('#industries')).toBeNull();
    expect(root.querySelector('br-industry-showcase')).toBeNull();
    expect(root.querySelector('.hero')?.nextElementSibling).toBe(
      root.querySelector('#purpose'),
    );
    expect(text).not.toMatch(/restaurants? and grocery/i);
    expect(text).not.toMatch(/grocery stores/i);
    expect(text).not.toMatch(/current industry focus/i);
  });

  it('positions BlueRise for growing businesses after the hero', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const cards = root.querySelectorAll('.purpose-card');

    expect(root.querySelector('#purpose h2')?.textContent).toContain('Built for');
    expect(root.querySelector('#purpose h2')?.textContent).toContain('Growing Businesses.');
    expect(root.textContent).toContain(PURPOSE_LEAD);
    expect(cards.length).toBe(PURPOSE_ITEMS.length);
    for (const item of PURPOSE_ITEMS) {
      expect(root.textContent).toContain(item.title);
    }
  });

  it('summarizes purpose after Core Purpose without repeating About-page mission copy', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const about = root.querySelector('#about');
    const purpose = root.querySelector('#purpose');

    expect(about).not.toBeNull();
    expect(purpose?.nextElementSibling).toBe(about);
    expect(about?.querySelector('h2')?.textContent).toContain('Better for Business.');
    expect(about?.querySelector('h2')?.textContent).toContain('Better for People.');
    expect(about?.textContent).toContain(TRUST_LEAD);
    expect(about?.querySelector('a[href="/about"]')?.textContent?.trim()).toBe(
      ABOUT_HOME_CTA,
    );
    expect(about?.querySelector('br-principle-card')).toBeNull();
    expect(about?.querySelector('br-talent-card')).toBeNull();
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

  it('plays the four-frame hero scene as one accessible visual', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const frames = Array.from(
      root.querySelectorAll<HTMLImageElement>('.hero-scene__frame'),
    );
    const text = root.textContent ?? '';

    expect(root.querySelector('.hero-scene')).not.toBeNull();
    expect(frames.map((frame) => frame.getAttribute('src'))).toEqual([
      ...HERO_SCENE_FRAMES,
    ]);
    expect(frames.every((frame) => frame.getAttribute('alt') === '')).toBe(true);
    expect(root.querySelector('.hero__visual figcaption')?.textContent?.trim()).toBe(
      HERO_SCENE_ALT,
    );
    expect(root.querySelector('.hero-scene--live')).toBeNull();

    frames[0]?.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(frames[0]?.hasAttribute('src')).toBe(false);
    expect(frames[0]?.classList.contains('hero-scene__frame--failed')).toBe(true);
    const cards = Array.from(
      root.querySelectorAll('.hero-float-card .hero-float-card__label'),
      (node) => node.textContent?.trim(),
    );
    expect(cards).toEqual(HERO_SERVICE_CARDS.map((card) => card.label));
    expect(new Set(cards).size).toBe(5);
    expect(root.querySelectorAll('.hero-float-card').length).toBe(5);
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

  it('renders glance value cards under the hero visual without duplicating overlay cards', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const glance = root.querySelector('.hero .hero-glance');
    const heading = root.querySelector('#glance-heading');
    const cards = Array.from(root.querySelectorAll<HTMLAnchorElement>('.hero-glance .glance-card'));

    expect(glance).not.toBeNull();
    expect(root.querySelector('.hero')?.contains(glance)).toBe(true);
    expect(heading?.textContent).toContain(GLANCE_HEADLINE_LEAD);
    expect(heading?.textContent).toContain(GLANCE_HEADLINE_ACCENT);
    expect(cards.map((card) => card.getAttribute('href'))).toEqual(
      GLANCE_CARDS.map((card) => card.href),
    );
    for (const card of GLANCE_CARDS) {
      expect(glance?.textContent).toContain(card.title);
      expect(glance?.textContent).toContain(card.body);
    }
    expect(root.querySelectorAll('.hero-float-card').length).toBe(5);
    expect(root.querySelectorAll('.hero-glance .glance-card').length).toBe(3);
  });

  it('renders Community Impact after Inclusion as aspirational pathways, not results', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const community = root.querySelector('#community');

    expect(community).not.toBeNull();
    expect(root.querySelector('#inclusion')?.nextElementSibling).toBe(community);
    expect(community?.querySelector('h2')?.textContent).toContain(COMMUNITY_HEADLINE);
    expect(community?.textContent).toContain('We aspire to programs');
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

  it('teases Benefits after Community Impact', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const together = root.querySelector('#together');

    expect(together).not.toBeNull();
    expect(root.querySelector('#community')?.nextElementSibling).toBe(together);
    expect(together?.querySelector('h2')?.textContent).toContain(TOGETHER_HEADLINE);
    expect(together?.textContent).toContain(TOGETHER_LEAD);
    expect(together?.querySelector('a[href="/benefits"]')?.textContent?.trim()).toBe(
      TOGETHER_CTA,
    );
  });

  it('explains how BlueRise works in three steps and closes with a contact CTA', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const how = root.querySelector('#how-it-works');
    const close = root.querySelector('#connect');

    expect(how).not.toBeNull();
    expect(close).not.toBeNull();
    expect(root.querySelector('#together')?.nextElementSibling).toBe(how);
    expect(how?.nextElementSibling).toBe(close);
    expect(how?.querySelector('h2')?.textContent).toContain(HOW_IT_WORKS_HEADLINE);
    expect(how?.querySelectorAll('.how-it-works__step').length).toBe(
      HOW_IT_WORKS_STEPS.length,
    );
    for (const step of HOW_IT_WORKS_STEPS) {
      expect(how?.textContent).toContain(step.title);
      expect(how?.textContent).toContain(step.body);
    }
    expect(close?.querySelector('h2')?.textContent).toContain('Ready to Simplify');
    expect(close?.querySelector('h2')?.textContent).toContain('Workforce Management?');
    expect(close?.textContent).toContain(
      'Spend less time managing workforce administration',
    );
    expect(close?.querySelector('a[href="/contact"]')?.textContent?.trim()).toBe(
      CLOSE_PRIMARY_CTA,
    );
  });

  it('uses a single h1 and one h2 per homepage section', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelectorAll('h2').length).toBe(8);
    expect(root.querySelector('#glance-heading')?.textContent).toContain(GLANCE_HEADLINE_LEAD);
    expect(root.querySelector('.hero-glance')?.getAttribute('aria-labelledby')).toBe(
      'glance-heading',
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
    expect(root.querySelector('#how-it-works')?.getAttribute('aria-labelledby')).toBe(
      'how-it-works-heading',
    );
    expect(root.querySelector('#connect')?.getAttribute('aria-labelledby')).toBe(
      'close-heading',
    );
  });
});
