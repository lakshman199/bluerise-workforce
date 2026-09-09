import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { emphasize } from '../../shared/emphasize';
import { WorkforceFigure } from '../../shared/workforce-figure/workforce-figure';
import { WORKFORCE_IMAGES } from '../../shared/workforce-images';
import {
  EMPLOYERS_CAPABILITIES,
  EMPLOYERS_CAPABILITIES_LEAD,
  EMPLOYERS_CAPABILITIES_TITLE,
  EMPLOYERS_CTA_BODY,
  EMPLOYERS_CTA_TITLE,
  EMPLOYERS_CHALLENGES,
  EMPLOYERS_CHALLENGES_LEAD,
  EMPLOYERS_CHALLENGES_TITLE,
  EMPLOYERS_EYEBROW,
  EMPLOYERS_HEADLINE,
  EMPLOYERS_WHO_CAPTION,
  EMPLOYERS_WHO_CTA,
  EMPLOYERS_WHO_HREF,
  EMPLOYERS_WHO_LEAD,
  EMPLOYERS_WHO_TITLE,
  EMPLOYERS_INCLUSION_BODY,
  EMPLOYERS_INCLUSION_TITLE,
  EMPLOYERS_INTRO,
  EMPLOYERS_PRIMARY_CTA,
  EMPLOYERS_PRIMARY_HREF,
  EMPLOYERS_SECONDARY_CTA,
  EMPLOYERS_SECONDARY_HREF,
  EMPLOYERS_UNIFIED_EMPLOYER,
  EMPLOYERS_UNIFIED_TITLE,
  EMPLOYERS_UNIFIED_WORKER,
} from './employers-content';

@Component({
  selector: 'br-employers-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, WorkforceFigure],
  templateUrl: './employers-page.html',
  styleUrl: './employers-page.scss',
})
export class EmployersPage {
  protected readonly eyebrow = EMPLOYERS_EYEBROW;
  protected readonly headlineHtml = emphasize(
    EMPLOYERS_HEADLINE,
    'workforce operations.',
  );
  protected readonly intro = EMPLOYERS_INTRO;
  protected readonly whoTitle = EMPLOYERS_WHO_TITLE;
  protected readonly whoLead = EMPLOYERS_WHO_LEAD;
  protected readonly whoCta = EMPLOYERS_WHO_CTA;
  protected readonly whoHref = EMPLOYERS_WHO_HREF;
  protected readonly whoCaption = EMPLOYERS_WHO_CAPTION;
  protected readonly teamImage = WORKFORCE_IMAGES.industrialTeam;
  protected readonly challengesTitle = EMPLOYERS_CHALLENGES_TITLE;
  protected readonly challengesLead = EMPLOYERS_CHALLENGES_LEAD;
  protected readonly challenges = EMPLOYERS_CHALLENGES;
  protected readonly capabilitiesTitle = EMPLOYERS_CAPABILITIES_TITLE;
  protected readonly capabilitiesLead = EMPLOYERS_CAPABILITIES_LEAD;
  protected readonly capabilities = EMPLOYERS_CAPABILITIES;
  protected readonly unifiedTitle = EMPLOYERS_UNIFIED_TITLE;
  protected readonly unifiedEmployer = EMPLOYERS_UNIFIED_EMPLOYER;
  protected readonly unifiedWorker = EMPLOYERS_UNIFIED_WORKER;
  protected readonly inclusionTitle = EMPLOYERS_INCLUSION_TITLE;
  protected readonly inclusionBody = EMPLOYERS_INCLUSION_BODY;
  protected readonly ctaTitle = EMPLOYERS_CTA_TITLE;
  protected readonly ctaBody = EMPLOYERS_CTA_BODY;
  protected readonly primaryCta = EMPLOYERS_PRIMARY_CTA;
  protected readonly primaryHref = EMPLOYERS_PRIMARY_HREF;
  protected readonly secondaryCta = EMPLOYERS_SECONDARY_CTA;
  protected readonly secondaryHref = EMPLOYERS_SECONDARY_HREF;
}
