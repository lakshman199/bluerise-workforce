import { afterNextRender, ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  ABOUT_CLOSE_CTA,
  ABOUT_CLOSE_HEADLINE_ACCENT,
  ABOUT_CLOSE_HEADLINE_LEAD,
  ABOUT_CLOSE_HREF,
  ABOUT_CLOSE_LEAD,
  ABOUT_EYEBROW,
  ABOUT_HEADLINE_ACCENT,
  ABOUT_HEADLINE_LEAD,
  ABOUT_HERO_IMAGE,
  ABOUT_INTRO,
  ABOUT_MISSION,
  ABOUT_MISSION_LABEL,
  ABOUT_PRIMARY_CTA,
  ABOUT_PRIMARY_HREF,
  ABOUT_SECONDARY_CTA,
  ABOUT_SECONDARY_HREF,
  ABOUT_VALUES,
  ABOUT_VALUES_HEADLINE,
  ABOUT_VISION,
  ABOUT_VISION_LABEL,
  ABOUT_WHY_HEADLINE_ACCENT,
  ABOUT_WHY_HEADLINE_LEAD,
  TALENT_HEADLINE_ACCENT,
  TALENT_HEADLINE_LEAD,
  TALENT_IDEAS,
  TALENT_INTRO,
} from './about-content';
import { PrincipleCard } from './principle-card';

@Component({
  selector: 'br-about-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PrincipleCard],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
})
export class AboutPage {
  protected readonly eyebrow = ABOUT_EYEBROW;
  protected readonly headlineLead = ABOUT_HEADLINE_LEAD;
  protected readonly headlineAccent = ABOUT_HEADLINE_ACCENT;
  protected readonly intro = ABOUT_INTRO;
  protected readonly primaryCta = ABOUT_PRIMARY_CTA;
  protected readonly primaryHref = ABOUT_PRIMARY_HREF;
  protected readonly secondaryCta = ABOUT_SECONDARY_CTA;
  protected readonly secondaryHref = ABOUT_SECONDARY_HREF;
  protected readonly heroImage = ABOUT_HERO_IMAGE;
  protected readonly whyHeadlineLead = ABOUT_WHY_HEADLINE_LEAD;
  protected readonly whyHeadlineAccent = ABOUT_WHY_HEADLINE_ACCENT;
  protected readonly missionLabel = ABOUT_MISSION_LABEL;
  protected readonly mission = ABOUT_MISSION;
  protected readonly visionLabel = ABOUT_VISION_LABEL;
  protected readonly vision = ABOUT_VISION;
  protected readonly talentHeadlineLead = TALENT_HEADLINE_LEAD;
  protected readonly talentHeadlineAccent = TALENT_HEADLINE_ACCENT;
  protected readonly talentIntro = TALENT_INTRO;
  protected readonly talentIdeas = TALENT_IDEAS;
  protected readonly valuesHeadline = ABOUT_VALUES_HEADLINE;
  protected readonly values = ABOUT_VALUES;
  protected readonly closeHeadlineLead = ABOUT_CLOSE_HEADLINE_LEAD;
  protected readonly closeHeadlineAccent = ABOUT_CLOSE_HEADLINE_ACCENT;
  protected readonly closeLead = ABOUT_CLOSE_LEAD;
  protected readonly closeCta = ABOUT_CLOSE_CTA;
  protected readonly closeHref = ABOUT_CLOSE_HREF;

  constructor() {
    afterNextRender(() => {
      if (window.location.hash === '#why') {
        this.scrollWhyIntoView(false);
      }
    });
  }

  /**
   * Angular's in-memory anchor scrolling does not honour CSS `scroll-margin`, so the
   * sticky header would cover the target heading. Native `scrollIntoView` does.
   */
  protected onPurposeCta(event: Event): void {
    event.preventDefault();
    this.scrollWhyIntoView(true);
  }

  private scrollWhyIntoView(smooth: boolean): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('why')?.scrollIntoView({
      behavior: reduceMotion || !smooth ? 'auto' : 'smooth',
      block: 'start',
    });
  }
}
