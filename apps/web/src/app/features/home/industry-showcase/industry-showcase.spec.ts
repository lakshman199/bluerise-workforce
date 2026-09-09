import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { INDUSTRY_SLIDES } from '../home-content';
import { IndustryShowcase } from './industry-showcase';

describe('IndustryShowcase', () => {
  function setup() {
    TestBed.configureTestingModule({
      imports: [IndustryShowcase],
      providers: [provideZonelessChangeDetection()],
    });

    const fixture = TestBed.createComponent(IndustryShowcase);
    fixture.detectChanges();
    return fixture;
  }

  it('renders four industry slides with previous and next controls', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelectorAll('.showcase__slide').length).toBe(INDUSTRY_SLIDES.length);
    expect(root.querySelector('button[aria-label="Previous industry"]')).not.toBeNull();
    expect(root.querySelector('button[aria-label="Next industry"]')).not.toBeNull();
    expect(root.querySelectorAll('.showcase__dot').length).toBe(INDUSTRY_SLIDES.length);
    expect(root.textContent).toContain(INDUSTRY_SLIDES[0].heading);
    expect(root.textContent).not.toMatch(
      /customer|partnered|live integration|cost savings/i,
    );
  });

  it('advances and wraps slides from the next and previous buttons', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const next = root.querySelector<HTMLButtonElement>(
      'button[aria-label="Next industry"]',
    );
    const previous = root.querySelector<HTMLButtonElement>(
      'button[aria-label="Previous industry"]',
    );

    next?.click();
    fixture.detectChanges();
    expect(root.querySelector('.showcase__text.is-active')?.textContent).toContain(
      INDUSTRY_SLIDES[1].heading,
    );

    previous?.click();
    fixture.detectChanges();
    expect(root.querySelector('.showcase__text.is-active')?.textContent).toContain(
      INDUSTRY_SLIDES[0].heading,
    );

    previous?.click();
    fixture.detectChanges();
    expect(root.querySelector('.showcase__text.is-active')?.textContent).toContain(
      INDUSTRY_SLIDES[INDUSTRY_SLIDES.length - 1].heading,
    );
  });
});
