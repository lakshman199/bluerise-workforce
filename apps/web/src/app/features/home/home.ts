import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { emphasize } from '../../shared/emphasize';
import {
  ABOUT_EYEBROW,
  ABOUT_HEADLINE,
  ABOUT_HOME_CTA,
  ABOUT_HOME_CTA_HREF,
  ABOUT_HOME_INTRO,
  ABOUT_MISSION,
  ABOUT_MISSION_LABEL,
  ABOUT_VISION,
  ABOUT_VISION_LABEL,
} from '../about/about-content';
import { PrincipleCard } from '../about/principle-card';
import { TalentCard } from '../about/talent-card';
import { InclusionCommitment } from '../inclusion/inclusion-commitment';
import {
  CLOSE_EYEBROW,
  CLOSE_HEADLINE,
  CLOSE_LEAD,
  CLOSE_PRIMARY_CTA,
  CLOSE_PRIMARY_HREF,
  CLOSE_SECONDARY_CTA,
  CLOSE_SECONDARY_HREF,
  COMMUNITY_CLOSING,
  COMMUNITY_EYEBROW,
  COMMUNITY_HEADLINE,
  COMMUNITY_ITEMS,
  COMMUNITY_LEAD,
  HERO_EYEBROW,
  HERO_HEADLINE_ACCENT,
  HERO_HEADLINE_PRIMARY,
  HERO_LEAD,
  HERO_SCENE_ALT,
  HERO_SCENE_FRAMES,
  PURPOSE_EYEBROW,
  PURPOSE_HEADLINE,
  PURPOSE_ITEMS,
  PURPOSE_LEAD,
  TOGETHER_BODY,
  TOGETHER_CTA,
  TOGETHER_CTA_HREF,
  TOGETHER_HEADLINE,
  TOGETHER_LEAD,
  VALUE_ITEMS,
  VALUES_EYEBROW,
  VALUES_HEADLINE,
  VALUES_LEAD,
} from './home-content';

@Component({
  selector: 'br-home',
  imports: [RouterLink, PrincipleCard, TalentCard, InclusionCommitment],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly eyebrow = HERO_EYEBROW;
  protected readonly headlinePrimary = HERO_HEADLINE_PRIMARY;
  protected readonly headlineAccentHtml = emphasize(HERO_HEADLINE_ACCENT, 'Futures.');
  protected readonly lead = HERO_LEAD;
  protected readonly sceneAlt = HERO_SCENE_ALT;
  protected readonly sceneFrames = HERO_SCENE_FRAMES;
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
  protected readonly purposeHeadlineHtml = emphasize(
    PURPOSE_HEADLINE,
    'talent meets purpose.',
  );
  protected readonly purposeLead = PURPOSE_LEAD;
  protected readonly purposeItems = PURPOSE_ITEMS;
  protected readonly aboutEyebrow = ABOUT_EYEBROW;
  protected readonly aboutHeadlineHtml = emphasize(
    ABOUT_HEADLINE,
    'workforce opportunity.',
  );
  protected readonly aboutIntro = ABOUT_HOME_INTRO;
  protected readonly missionLabel = ABOUT_MISSION_LABEL;
  protected readonly mission = ABOUT_MISSION;
  protected readonly visionLabel = ABOUT_VISION_LABEL;
  protected readonly vision = ABOUT_VISION;
  protected readonly aboutCta = ABOUT_HOME_CTA;
  protected readonly aboutCtaHref = ABOUT_HOME_CTA_HREF;
  protected readonly communityEyebrow = COMMUNITY_EYEBROW;
  protected readonly communityHeadline = COMMUNITY_HEADLINE;
  protected readonly communityLead = COMMUNITY_LEAD;
  protected readonly communityItems = COMMUNITY_ITEMS;
  protected readonly communityClosing = COMMUNITY_CLOSING;
  protected readonly togetherHeadlineHtml = emphasize(TOGETHER_HEADLINE, 'Together');
  protected readonly togetherLead = TOGETHER_LEAD;
  protected readonly togetherBody = TOGETHER_BODY;
  protected readonly togetherCta = TOGETHER_CTA;
  protected readonly togetherCtaHref = TOGETHER_CTA_HREF;
  protected readonly valuesEyebrow = VALUES_EYEBROW;
  protected readonly valuesHeadlineHtml = emphasize(VALUES_HEADLINE, 'Values');
  protected readonly valuesLead = VALUES_LEAD;
  protected readonly valueItems = VALUE_ITEMS;
  protected readonly closeEyebrow = CLOSE_EYEBROW;
  protected readonly closeHeadlineHtml = emphasize(CLOSE_HEADLINE, 'future of work');
  protected readonly closeLead = CLOSE_LEAD;
  protected readonly closePrimaryCta = CLOSE_PRIMARY_CTA;
  protected readonly closePrimaryHref = CLOSE_PRIMARY_HREF;
  protected readonly closeSecondaryCta = CLOSE_SECONDARY_CTA;
  protected readonly closeSecondaryHref = CLOSE_SECONDARY_HREF;

  constructor() {
    afterNextRender(() => {
      if (window.location.hash === '#purpose') {
        this.scrollPurposeIntoView(false);
      }
    });
  }

  /**
   * Angular's in-memory anchor scrolling does not honour CSS `scroll-margin`, so the
   * sticky header would cover the Core Purpose heading. Native `scrollIntoView` does.
   */
  protected onExplorePurpose(event: Event): void {
    event.preventDefault();
    this.scrollPurposeIntoView(true);
  }

  private scrollPurposeIntoView(smooth: boolean): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('purpose')?.scrollIntoView({
      behavior: reduceMotion || !smooth ? 'auto' : 'smooth',
      block: 'start',
    });
  }
}
