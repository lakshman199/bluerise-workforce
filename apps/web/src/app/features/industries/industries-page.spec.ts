import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { INDUSTRIES_CONTEXTS, INDUSTRIES_HEADLINE } from './industries-content';
import { IndustriesPage } from './industries-page';

describe('IndustriesPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IndustriesPage],
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
    const fixture = TestBed.createComponent(IndustriesPage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('presents industry contexts without claiming customers or specialized products', () => {
    const root = render();
    const text = root.textContent ?? '';

    expect(root.querySelector('h1')?.textContent).toContain(INDUSTRIES_HEADLINE);
    expect(text).toContain('small and growing businesses');
    expect(text).toContain('examples of workforce settings');
    for (const item of INDUSTRIES_CONTEXTS) {
      expect(text).toContain(item.title);
      expect(text).toContain(item.body);
    }
    expect(text).not.toMatch(/our customers|existing customers|current customers/i);
    expect(text).not.toMatch(/partnered with|live integration/i);
    expect(text).not.toMatch(/Gusto|ADP/);
    expect(text).not.toMatch(/currently focuses on restaurants/i);
    expect(text).not.toMatch(/grocery stores/i);
    expect(text).not.toMatch(/ISO |award-winning|proven results/i);
    expect(text).toContain('does not present customers');
    expect(text).toContain('Workforce examples');
    expect(text).toContain('not a ranking of industries');
    expect(text).toContain('Industrial & frontline teams');
    expect(text).toContain('Automotive & skilled services');
    expect(text).toContain('Skilled trades & small business');
    expect(text).toContain('Frontline retail work');
    expect(
      root.querySelector('.industries__visual img')?.getAttribute('src'),
    ).toBe('/images/workforce/woodworker.png');
    expect(
      root.querySelector('.industries__visual img')?.getAttribute('alt'),
    ).toBe('A woodworker working in a small business workshop.');
    expect(
      root.querySelector('img[src="/images/workforce/small-business-workforce.jpg"]'),
    ).toBeNull();
    const exampleImages = Array.from(
      root.querySelectorAll('.industries__examples img'),
    ) as HTMLImageElement[];
    expect(exampleImages.map((img) => img.getAttribute('src'))).toEqual([
      '/images/workforce/industrial-team.png',
      '/images/workforce/body-shop-worker.png',
      '/images/workforce/woodworker.png',
      '/images/workforce/convenience-store-worker.png',
    ]);
    expect(exampleImages.map((img) => img.getAttribute('alt'))).toEqual([
      'A group of industrial and frontline workers showing teamwork.',
      'A skilled automotive worker working in a body shop.',
      'A woodworker working in a small business workshop.',
      'A frontline retail worker at a small business checkout counter.',
    ]);
    expect(root.querySelector('img[src="/images/workforce/payroll.jpg"]')).toBeNull();
    expect(
      root.querySelector('img[src="/images/workforce/employee-support.jpg"]'),
    ).toBeNull();
    expect(
      root.querySelector('img[src="/images/workforce/convenience-store-worker.jpg"]'),
    ).toBeNull();
    expect(
      root.querySelector('img[src="/images/workforce/restaurant-workforce.jpg"]'),
    ).toBeNull();
    expect(
      root.querySelector('img[src="/images/workforce/grocery-workforce.jpg"]'),
    ).toBeNull();
  });

  it('keeps a single h1 and links to contact and solutions', () => {
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
