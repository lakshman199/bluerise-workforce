import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import {
  ABOUT_HEADLINE,
  ABOUT_INTRO,
  ABOUT_MISSION,
  ABOUT_VISION,
  TALENT_HEADING,
  TALENT_THEMES,
} from './about-content';
import { AboutPage } from './about-page';

describe('AboutPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AboutPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'inclusion', children: [] },
          { path: 'contact', children: [] },
        ]),
      ],
    });
  });

  function render() {
    const fixture = TestBed.createComponent(AboutPage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('uses the approved About, Mission, Vision, and Talent Meets Purpose copy', () => {
    const root = render();

    expect(root.querySelector('h1')?.textContent).toContain(ABOUT_HEADLINE);
    expect(root.textContent).toContain(ABOUT_INTRO);
    expect(root.textContent).toContain(ABOUT_MISSION);
    expect(root.textContent).toContain(ABOUT_VISION);
    expect(root.textContent).toContain(TALENT_HEADING);
    for (const theme of TALENT_THEMES) {
      expect(root.textContent).toContain(theme);
    }
  });

  it('does not invent history, people, offices, awards, or counts', () => {
    const text = render().textContent ?? '';

    expect(text).not.toMatch(/founded|founder|CEO|headquarters|offices/i);
    expect(text).not.toMatch(/award|certif|ISO |employees worldwide/i);
    expect(text).not.toContain('customers');
  });

  it('keeps a single h1 and links to inclusion and contact', () => {
    const root = render();

    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelector('a[href="/inclusion"]')?.textContent).toContain(
      'inclusion commitment',
    );
    expect(root.querySelector('a[href="/contact"]')?.textContent).toContain(
      'Contact BlueRise Workforce',
    );
  });
});
