import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EMPLOYERS_CAPABILITIES, EMPLOYERS_HEADLINE } from './employers-content';
import { EmployersPage } from './employers-page';

describe('EmployersPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmployersPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'our-solutions', children: [] },
          { path: 'contact', children: [] },
          { path: 'inclusion', children: [] },
          { path: 'industries', children: [] },
        ]),
      ],
    });
  });

  function render() {
    const fixture = TestBed.createComponent(EmployersPage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('explains coordinated workforce operations without claiming live vendors', () => {
    const root = render();

    expect(root.querySelector('h1')?.textContent).toContain(EMPLOYERS_HEADLINE);
    expect(root.textContent).toContain('designed to support');
    expect(root.textContent).toContain('payroll');
    expect(root.textContent).toContain('workers’ compensation');
    expect(root.textContent).toContain('Workforce inclusion');
    expect(root.querySelectorAll('h3').length).toBeGreaterThanOrEqual(
      EMPLOYERS_CAPABILITIES.length,
    );
    for (const item of EMPLOYERS_CAPABILITIES) {
      expect(root.textContent).toContain(item.title);
    }
    expect(root.textContent).not.toMatch(/Gusto|ADP/);
    expect(root.textContent).not.toMatch(/guaranteed compliance|guaranteed savings/i);
    expect(root.textContent).not.toMatch(/\d+%/);
    expect(root.textContent).toContain('small and growing businesses');
    expect(root.textContent).not.toContain('Current industry focus');
    expect(root.textContent).not.toMatch(/currently focuses on restaurants/i);
    expect(root.textContent).not.toMatch(/grocery stores/i);
    expect(
      root.querySelector('img[src="/images/workforce/industrial-team.png"]'),
    ).not.toBeNull();
    expect(
      root.querySelector('img[src="/images/workforce/industrial-team.png"]')?.getAttribute(
        'alt',
      ),
    ).toBe('A group of industrial and frontline workers showing teamwork.');
    expect(
      root.querySelector('img[src="/images/workforce/small-business-team.jpg"]'),
    ).toBeNull();
    expect(
      root.querySelector('img[src="/images/workforce/restaurant-workforce.jpg"]'),
    ).toBeNull();
    expect(root.textContent).not.toMatch(/partnered|live integration/i);
  });

  it('keeps a single h1 and links to solutions, contact, and inclusion', () => {
    const root = render();

    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelector('a[href="/our-solutions"]')?.textContent?.trim()).toBe(
      'Explore Our Solutions',
    );
    expect(root.querySelector('a[href="/contact"]')?.textContent?.trim()).toBe(
      'Contact Us',
    );
    expect(root.querySelector('a[href="/inclusion"]')?.textContent).toContain(
      'inclusion commitment',
    );
    expect(root.querySelector('a[href="/industries"]')?.textContent?.trim()).toBe(
      'Industries We Serve',
    );
  });
});
