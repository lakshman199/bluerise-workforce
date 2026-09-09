import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import {
  SOLUTIONS_FLOW,
  SOLUTIONS_HEADLINE,
  SOLUTIONS_MODULES,
} from './solutions-content';
import { SolutionsPage } from './solutions-page';

describe('SolutionsPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SolutionsPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'contact', children: [] },
          { path: 'benefits', children: [] },
          { path: 'employers', children: [] },
          { path: 'job-seekers', children: [] },
        ]),
      ],
    });
  });

  function render() {
    const fixture = TestBed.createComponent(SolutionsPage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('explains the coordinated platform without internal or vendor claims', () => {
    const root = render();
    const text = root.textContent ?? '';

    expect(root.querySelector('h1')?.textContent).toContain(SOLUTIONS_HEADLINE);
    for (const step of SOLUTIONS_FLOW) {
      expect(text).toContain(step);
    }
    for (const item of SOLUTIONS_MODULES) {
      expect(text).toContain(item.title);
    }
    expect(text).toContain('specialist providers');
    expect(text).not.toMatch(/adapter|vendor lock-in|provider hostage|Phase 6/i);
    expect(text).not.toMatch(/Gusto|ADP/);
    expect(text).not.toContain('awaiting credentials');
    expect(text).toContain('not a BlueRise product');
    expect(
      root.querySelector('img[src="/images/workforce/restaurant-operations.jpg"]'),
    ).not.toBeNull();
    expect(
      root.querySelector('img[src="/images/workforce/grocery-checkout.jpg"]'),
    ).not.toBeNull();
    expect(root.querySelector('img[src="/images/workforce/payroll.jpg"]')).not.toBeNull();
  });

  it('keeps a single h1 and CTAs to contact and benefits', () => {
    const root = render();

    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelector('a[href="/contact"]')?.textContent?.trim()).toBe(
      'Contact Us',
    );
    expect(root.querySelector('a[href="/benefits"]')?.textContent?.trim()).toBe(
      'Explore Benefits',
    );
  });
});
