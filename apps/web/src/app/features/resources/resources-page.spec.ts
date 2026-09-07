import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import {
  RESOURCES_AVAILABILITY,
  RESOURCES_CATEGORIES,
  RESOURCES_HEADLINE,
} from './resources-content';
import { ResourcesPage } from './resources-page';

describe('ResourcesPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResourcesPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'contact', children: [] },
          { path: 'our-solutions', children: [] },
        ]),
      ],
    });
  });

  function render() {
    const fixture = TestBed.createComponent(ResourcesPage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('presents resource areas without inventing published content', () => {
    const root = render();
    const text = root.textContent ?? '';

    expect(root.querySelector('h1')?.textContent).toContain(RESOURCES_HEADLINE);
    expect(text).toContain(RESOURCES_AVAILABILITY);
    for (const item of RESOURCES_CATEGORIES) {
      expect(text).toContain(item.title);
    }
    expect(text).not.toMatch(/\bby [A-Z][a-z]+ [A-Z][a-z]+\b/);
    expect(text).not.toMatch(/download the guide|white paper|press release/i);
    expect(text).not.toMatch(
      /\b(January|February|March|April|June|July|August|September)\b/,
    );
  });

  it('keeps a single h1 and a contact CTA', () => {
    const root = render();

    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelector('a[href="/contact"]')?.textContent?.trim()).toBe(
      'Contact Us',
    );
    expect(root.querySelector('a[href="/our-solutions"]')?.textContent?.trim()).toBe(
      'Explore Our Solutions',
    );
  });
});
