import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  ABOUT_HOME_CTA,
  ABOUT_HOME_CTA_HREF,
} from '../about/about-content';
import { InclusionCommitment } from '../inclusion/inclusion-commitment';
import { HeroGlance } from './hero-glance';
import {
  CLOSE_EYEBROW,
  CLOSE_HEADLINE_ACCENT,
  CLOSE_HEADLINE_LEAD,
  CLOSE_LEAD,
  CLOSE_PRIMARY_CTA,
  CLOSE_PRIMARY_HREF,
  COMMUNITY_CLOSING,
  COMMUNITY_EYEBROW,
  COMMUNITY_HEADLINE,
  COMMUNITY_ITEMS,
  COMMUNITY_LEAD,
  HERO_EYEBROW,
  HERO_HEADLINE_ACCENT,
  HERO_HEADLINE_PRIMARY,
  HERO_LEAD,
  HERO_PRIMARY_CTA,
  HERO_PRIMARY_HREF,
  HERO_SECONDARY_CTA,
  HERO_SECONDARY_HREF,
  HERO_SCENE_ALT,
  HERO_SCENE_FRAMES,
  HERO_SERVICE_CARDS,
  HOW_IT_WORKS_EYEBROW,
  HOW_IT_WORKS_HEADLINE_ACCENT,
  HOW_IT_WORKS_HEADLINE_LEAD,
  HOW_IT_WORKS_LEAD,
  HOW_IT_WORKS_STEPS,
  PURPOSE_EYEBROW,
  PURPOSE_HEADLINE_ACCENT,
  PURPOSE_HEADLINE_LEAD,
  PURPOSE_ITEMS,
  PURPOSE_LEAD,
  TOGETHER_CTA,
  TOGETHER_CTA_HREF,
  TOGETHER_HEADLINE_ACCENT,
  TOGETHER_HEADLINE_LEAD,
  TOGETHER_LEAD,
  TRUST_EYEBROW,
  TRUST_HEADLINE_ACCENT,
  TRUST_HEADLINE_LEAD,
  TRUST_LEAD,
} from './home-content';

@Component({
  selector: 'br-home',
  imports: [RouterLink, HeroGlance, InclusionCommitment],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly eyebrow = HERO_EYEBROW;
  protected readonly headlinePrimary = HERO_HEADLINE_PRIMARY;
  protected readonly headlineAccent = HERO_HEADLINE_ACCENT;
  protected readonly lead = HERO_LEAD;
  protected readonly primaryCta = HERO_PRIMARY_CTA;
  protected readonly primaryHref = HERO_PRIMARY_HREF;
  protected readonly secondaryCta = HERO_SECONDARY_CTA;
  protected readonly secondaryHref = HERO_SECONDARY_HREF;
  protected readonly sceneAlt = HERO_SCENE_ALT;
  protected readonly sceneFrames = HERO_SCENE_FRAMES;
  protected readonly serviceCards = HERO_SERVICE_CARDS;
  protected readonly frameLoaded = signal<readonly boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  protected readonly frameFailed = signal<readonly boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  protected allFramesReady(): boolean {
    return this.frameLoaded().every(Boolean);
  }

  protected lastReadyIndex(): number {
    return this.frameLoaded().lastIndexOf(true);
  }

  protected onFrameLoad(index: number): void {
    this.frameLoaded.update((current) =>
      current.map((value, i) => (i === index ? true : value)),
    );
  }

  protected onFrameError(index: number, event: Event): void {
    this.frameFailed.update((current) =>
      current.map((value, i) => (i === index ? true : value)),
    );
    const image = event.target;
    if (image instanceof HTMLImageElement) {
      image.removeAttribute('src');
    }
  }
  protected readonly purposeEyebrow = PURPOSE_EYEBROW;
  protected readonly purposeHeadlineLead = PURPOSE_HEADLINE_LEAD;
  protected readonly purposeHeadlineAccent = PURPOSE_HEADLINE_ACCENT;
  protected readonly purposeLead = PURPOSE_LEAD;
  protected readonly purposeItems = PURPOSE_ITEMS;
  protected readonly trustEyebrow = TRUST_EYEBROW;
  protected readonly trustHeadlineLead = TRUST_HEADLINE_LEAD;
  protected readonly trustHeadlineAccent = TRUST_HEADLINE_ACCENT;
  protected readonly trustLead = TRUST_LEAD;
  protected readonly aboutCta = ABOUT_HOME_CTA;
  protected readonly aboutCtaHref = ABOUT_HOME_CTA_HREF;
  protected readonly communityEyebrow = COMMUNITY_EYEBROW;
  protected readonly communityHeadline = COMMUNITY_HEADLINE;
  protected readonly communityLead = COMMUNITY_LEAD;
  protected readonly communityItems = COMMUNITY_ITEMS;
  protected readonly communityClosing = COMMUNITY_CLOSING;
  protected readonly togetherHeadlineLead = TOGETHER_HEADLINE_LEAD;
  protected readonly togetherHeadlineAccent = TOGETHER_HEADLINE_ACCENT;
  protected readonly togetherLead = TOGETHER_LEAD;
  protected readonly togetherCta = TOGETHER_CTA;
  protected readonly togetherCtaHref = TOGETHER_CTA_HREF;
  protected readonly howItWorksEyebrow = HOW_IT_WORKS_EYEBROW;
  protected readonly howItWorksHeadlineLead = HOW_IT_WORKS_HEADLINE_LEAD;
  protected readonly howItWorksHeadlineAccent = HOW_IT_WORKS_HEADLINE_ACCENT;
  protected readonly howItWorksLead = HOW_IT_WORKS_LEAD;
  protected readonly howItWorksSteps = HOW_IT_WORKS_STEPS;
  protected readonly closeEyebrow = CLOSE_EYEBROW;
  protected readonly closeHeadlineLead = CLOSE_HEADLINE_LEAD;
  protected readonly closeHeadlineAccent = CLOSE_HEADLINE_ACCENT;
  protected readonly closeLead = CLOSE_LEAD;
  protected readonly closePrimaryCta = CLOSE_PRIMARY_CTA;
  protected readonly closePrimaryHref = CLOSE_PRIMARY_HREF;

  constructor() {
    afterNextRender(() => {
      const hash = window.location.hash;
      if (hash === '#glance' || hash === '#purpose') {
        this.scrollIdIntoView(hash.slice(1), false);
      }
    });
  }

  /**
   * Angular's in-memory anchor scrolling does not honour CSS `scroll-margin`, so the
   * sticky header would cover the target heading. Native `scrollIntoView` does.
   */
  protected onHeroPrimaryCta(event: Event): void {
    event.preventDefault();
    this.scrollIdIntoView('glance', true);
  }

  private scrollIdIntoView(id: string, smooth: boolean): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion || !smooth ? 'auto' : 'smooth',
      block: 'start',
    });
  }
}
