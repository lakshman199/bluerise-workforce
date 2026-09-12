import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { App } from './app';
import { routes } from './app.routes';

describe('App shell', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideHttpClient(),
      ],
    }).compileComponents();
  });

  it('renders', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('puts a skip link before the header so keyboard users can bypass the navigation', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const skipLink = root.querySelector<HTMLAnchorElement>('.br-skip-link');

    expect(skipLink).not.toBeNull();
    expect(skipLink?.getAttribute('href')).toBe('#main-content');
    expect(root.querySelector('#main-content')).not.toBeNull();
  });

  it('exposes a single main landmark', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const mains = (fixture.nativeElement as HTMLElement).querySelectorAll('main');
    expect(mains.length).toBe(1);
  });

  it('includes the BlueRise Support launcher on every public page', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const launcher = (fixture.nativeElement as HTMLElement).querySelector(
      '.support__launcher',
    );
    expect(launcher).not.toBeNull();
    expect(launcher?.getAttribute('aria-label')).toBe('BlueRise Support');
  });
});
