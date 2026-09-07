import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import {
  INCLUSION_CLOSING,
  INCLUSION_GOAL_INTRO,
  INCLUSION_GOALS,
  INCLUSION_HEADLINE,
  INCLUSION_PATHWAYS_ITEMS,
} from './inclusion-content';
import { InclusionPage } from './inclusion-page';

describe('InclusionPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InclusionPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'contact', children: [] },
          { path: 'about', children: [] },
        ]),
      ],
    });
  });

  function render() {
    const fixture = TestBed.createComponent(InclusionPage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('uses the approved inclusion commitment and supported pathways', () => {
    const root = render();

    expect(root.querySelector('h1')?.textContent).toContain(INCLUSION_HEADLINE);
    expect(root.textContent).toContain('special needs');
    expect(root.textContent).toContain('autism spectrum');
    expect(root.textContent).toContain('neurodiverse');
    expect(root.textContent).toContain('job-readiness');
    expect(root.textContent).toContain('vocational training');
    expect(root.textContent).toContain(INCLUSION_CLOSING);
    for (const goal of INCLUSION_GOALS) {
      expect(root.textContent).toContain(goal);
    }
    for (const item of INCLUSION_PATHWAYS_ITEMS) {
      expect(root.textContent).toContain(item);
    }
  });

  it('does not invent partnerships, outcomes, or medical claims', () => {
    const text = render().textContent ?? '';

    expect(text).not.toMatch(/partnered with|in partnership with/i);
    expect(text).not.toMatch(/\d+%/);
    expect(text).not.toMatch(/diagnos|cure|patient|disorder/i);
    expect(text).not.toMatch(/success rate|placed \d+/i);
  });

  it('keeps a single h1 and meaningful final CTAs', () => {
    const root = render();

    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.textContent).toContain(INCLUSION_GOAL_INTRO);
    expect(root.querySelector('a[href="/contact"]')?.textContent?.trim()).toBe(
      'Contact BlueRise Workforce',
    );
    expect(root.querySelector('a[href="/about"]')?.textContent?.trim()).toBe(
      'Learn More About BlueRise',
    );
  });
});
