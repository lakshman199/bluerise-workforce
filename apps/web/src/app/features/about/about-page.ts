import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  ABOUT_EYEBROW,
  ABOUT_HEADLINE,
  ABOUT_INTRO,
  ABOUT_MISSION,
  ABOUT_MISSION_LABEL,
  ABOUT_VISION,
  ABOUT_VISION_LABEL,
  TALENT_HEADING,
  TALENT_INTRO,
} from './about-content';
import { PrincipleCard } from './principle-card';
import { TalentCard } from './talent-card';

@Component({
  selector: 'br-about-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PrincipleCard, TalentCard],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
})
export class AboutPage {
  protected readonly eyebrow = ABOUT_EYEBROW;
  protected readonly headline = ABOUT_HEADLINE;
  protected readonly intro = ABOUT_INTRO;
  protected readonly missionLabel = ABOUT_MISSION_LABEL;
  protected readonly mission = ABOUT_MISSION;
  protected readonly visionLabel = ABOUT_VISION_LABEL;
  protected readonly vision = ABOUT_VISION;
  protected readonly talentHeading = TALENT_HEADING;
  protected readonly talentIntro = TALENT_INTRO;
}
