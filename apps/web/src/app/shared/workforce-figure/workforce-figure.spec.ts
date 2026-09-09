import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { WORKFORCE_IMAGES } from '../workforce-images';
import { WorkforceFigure } from './workforce-figure';

describe('WorkforceFigure', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WorkforceFigure],
      providers: [provideZonelessChangeDetection()],
    });
  });

  function render(src = WORKFORCE_IMAGES.industrialTeam) {
    const fixture = TestBed.createComponent(WorkforceFigure);
    fixture.componentRef.setInput('image', src);
    fixture.componentRef.setInput('caption', 'Example');
    fixture.detectChanges();
    return fixture;
  }

  it('keeps the img in the DOM after a load error so the same src can be retried', () => {
    const fixture = render();
    const root = fixture.nativeElement as HTMLElement;
    const img = root.querySelector('img');

    expect(img).not.toBeNull();
    img?.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    const afterError = root.querySelector('img');
    expect(afterError).not.toBeNull();
    expect(afterError?.classList.contains('figure__img--failed')).toBe(true);
  });

  it('remounts a previously failed img when the tab becomes visible again', () => {
    const fixture = render();
    const root = fixture.nativeElement as HTMLElement;
    const first = root.querySelector('img');
    first?.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });
    document.dispatchEvent(new Event('visibilitychange'));
    fixture.detectChanges();

    const retried = root.querySelector('img');
    expect(retried).not.toBeNull();
    expect(retried?.classList.contains('figure__img--failed')).toBe(false);
    expect(retried).not.toBe(first);
  });

  it('clears the failed state when the image src changes', () => {
    const fixture = render();
    const root = fixture.nativeElement as HTMLElement;
    root.querySelector('img')?.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    fixture.componentRef.setInput('image', WORKFORCE_IMAGES.bodyShopWorker);
    fixture.detectChanges();

    const img = root.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/images/workforce/body-shop-worker.png');
    expect(img?.classList.contains('figure__img--failed')).toBe(false);
  });
});
