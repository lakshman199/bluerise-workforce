import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BENEFITS_CATEGORIES, BENEFITS_HEADLINE } from './benefits-content';
import { BenefitsPage } from './benefits-page';

describe('BenefitsPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BenefitsPage],
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
    const fixture = TestBed.createComponent(BenefitsPage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('presents BlueRise as a coordination layer, not a carrier', () => {
    const root = render();
    const text = root.textContent ?? '';

    expect(root.querySelector('h1')?.textContent).toContain(BENEFITS_HEADLINE);
    expect(text).toContain('not an insurance carrier');
    expect(text).toContain('platform concepts');
    for (const item of BENEFITS_CATEGORIES) {
      expect(text).toContain(item);
    }
    expect(text).not.toMatch(/Gusto|ADP|Aetna|UnitedHealthcare/);
    expect(text).not.toMatch(/enroll today|from \$\d/i);
    expect(text).not.toMatch(/coverage guaranteed/i);
    expect(
      root.querySelector('img[src="/images/workforce/employee-support.jpg"]'),
    ).not.toBeNull();
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
