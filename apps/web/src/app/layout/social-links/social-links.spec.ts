import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SOCIAL_PROFILES } from '../navigation';
import { SocialLinks } from './social-links';

describe('SocialLinks', () => {
  it('does not invent social profile URLs', () => {
    expect(SOCIAL_PROFILES.every((profile) => profile.href === null)).toBe(true);
  });

  it('renders no social anchors until a verified URL exists', () => {
    TestBed.configureTestingModule({
      imports: [SocialLinks],
      providers: [provideZonelessChangeDetection()],
    });

    const fixture = TestBed.createComponent(SocialLinks);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelectorAll('a').length).toBe(0);
    expect(root.innerHTML).not.toContain('linkedin.com');
    expect(root.innerHTML).not.toContain('facebook.com');
    expect(root.innerHTML).not.toContain('instagram.com');
  });
});
