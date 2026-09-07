import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Home } from './home';
import { HERO_HEADLINE_PRIMARY, PURPOSE_HEADLINE, PURPOSE_ITEMS } from './home-content';

function setup() {
  TestBed.configureTestingModule({
    imports: [Home],
    providers: [
      provideZonelessChangeDetection(),
      provideRouter([{ path: 'benefits', children: [] }]),
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

  it('renders all five Core Purpose items and not the inclusion section', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const cards = root.querySelectorAll('.purpose-card');

    expect(cards.length).toBe(PURPOSE_ITEMS.length);
    for (const item of PURPOSE_ITEMS) {
      expect(root.textContent).toContain(item.title);
    }
    expect(root.textContent).not.toContain('Inclusion & Special Needs');
    expect(root.textContent).not.toContain('autism');
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

  it('uses a single h1 and a Core Purpose h2', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelectorAll('h2').length).toBe(1);
    expect(root.querySelector('#purpose')?.getAttribute('aria-labelledby')).toBe(
      'purpose-heading',
    );
  });
});
