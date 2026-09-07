import { afterNextRender, ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  HERO_EYEBROW,
  HERO_HEADLINE_ACCENT,
  HERO_HEADLINE_PRIMARY,
  HERO_LEAD,
  PURPOSE_EYEBROW,
  PURPOSE_HEADLINE,
  PURPOSE_ITEMS,
  PURPOSE_LEAD,
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
  protected readonly headlineAccent = HERO_HEADLINE_ACCENT;
  protected readonly lead = HERO_LEAD;
  protected readonly purposeEyebrow = PURPOSE_EYEBROW;
  protected readonly purposeHeadline = PURPOSE_HEADLINE;
  protected readonly purposeLead = PURPOSE_LEAD;
  protected readonly purposeItems = PURPOSE_ITEMS;
  protected readonly aboutEyebrow = ABOUT_EYEBROW;
  protected readonly aboutHeadline = ABOUT_HEADLINE;
  protected readonly aboutIntro = ABOUT_HOME_INTRO;
  protected readonly missionLabel = ABOUT_MISSION_LABEL;
  protected readonly mission = ABOUT_MISSION;
  protected readonly visionLabel = ABOUT_VISION_LABEL;
  protected readonly vision = ABOUT_VISION;
  protected readonly aboutCta = ABOUT_HOME_CTA;
  protected readonly aboutCtaHref = ABOUT_HOME_CTA_HREF;

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
