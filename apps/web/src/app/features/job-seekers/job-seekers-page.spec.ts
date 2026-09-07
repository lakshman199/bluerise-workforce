import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SEEKERS_AREAS, SEEKERS_HEADLINE } from './job-seekers-content';
import { JobSeekersPage } from './job-seekers-page';

describe('JobSeekersPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JobSeekersPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'contact', children: [] },
          { path: 'inclusion', children: [] },
        ]),
      ],
    });
  });

  function render() {
    const fixture = TestBed.createComponent(JobSeekersPage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('uses approved employment themes and does not pretend job search is live', () => {
    const root = render();
    const text = root.textContent ?? '';

    expect(root.querySelector('h1')?.textContent).toContain(SEEKERS_HEADLINE);
    expect(text).toContain('dignity');
    expect(text).toContain('career development');
    expect(text).toContain('Inclusive employment pathways');
    for (const area of SEEKERS_AREAS) {
      expect(text).toContain(area);
    }
    expect(text).toContain('not available on this site yet');
    expect(text).not.toMatch(/apply now|view opening|now hiring/i);
    expect(text).not.toMatch(/Gusto|ADP/);
  });

  it('keeps a single h1 and a contact CTA', () => {
    const root = render();

    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelector('a[href="/contact"]')?.textContent?.trim()).toBe(
      'Contact Us',
    );
    expect(root.querySelector('a[href="/inclusion"]')?.textContent).toContain(
      'inclusion commitment',
    );
  });
});
