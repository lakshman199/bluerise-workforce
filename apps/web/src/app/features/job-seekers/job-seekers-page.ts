import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { emphasize } from '../../shared/emphasize';
import {
  SEEKERS_AREAS,
  SEEKERS_AREAS_BODY,
  SEEKERS_AREAS_TITLE,
  SEEKERS_CAREER_BODY,
  SEEKERS_CAREER_TITLE,
  SEEKERS_CTA_BODY,
  SEEKERS_CTA_TITLE,
  SEEKERS_EMPLOYMENT_BODY,
  SEEKERS_EMPLOYMENT_TITLE,
  SEEKERS_EYEBROW,
  SEEKERS_HEADLINE,
  SEEKERS_INCLUSION_BODY,
  SEEKERS_INCLUSION_TITLE,
  SEEKERS_INTRO,
  SEEKERS_PRIMARY_CTA,
  SEEKERS_PRIMARY_HREF,
  SEEKERS_SECONDARY_CTA,
  SEEKERS_SECONDARY_HREF,
  SEEKERS_SUPPORT_BODY,
  SEEKERS_SUPPORT_TITLE,
  SEEKERS_TRAINING_BODY,
  SEEKERS_TRAINING_TITLE,
} from './job-seekers-content';

@Component({
  selector: 'br-job-seekers-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './job-seekers-page.html',
  styleUrl: './job-seekers-page.scss',
})
export class JobSeekersPage {
  protected readonly eyebrow = SEEKERS_EYEBROW;
  protected readonly headlineHtml = emphasize(SEEKERS_HEADLINE, 'Meaningful employment');
  protected readonly intro = SEEKERS_INTRO;
  protected readonly employmentTitle = SEEKERS_EMPLOYMENT_TITLE;
  protected readonly employmentBody = SEEKERS_EMPLOYMENT_BODY;
  protected readonly careerTitle = SEEKERS_CAREER_TITLE;
  protected readonly careerBody = SEEKERS_CAREER_BODY;
  protected readonly trainingTitle = SEEKERS_TRAINING_TITLE;
  protected readonly trainingBody = SEEKERS_TRAINING_BODY;
  protected readonly inclusionTitle = SEEKERS_INCLUSION_TITLE;
  protected readonly inclusionBody = SEEKERS_INCLUSION_BODY;
  protected readonly supportTitle = SEEKERS_SUPPORT_TITLE;
  protected readonly supportBody = SEEKERS_SUPPORT_BODY;
  protected readonly areasTitle = SEEKERS_AREAS_TITLE;
  protected readonly areasBody = SEEKERS_AREAS_BODY;
  protected readonly areas = SEEKERS_AREAS;
  protected readonly ctaTitle = SEEKERS_CTA_TITLE;
  protected readonly ctaBody = SEEKERS_CTA_BODY;
  protected readonly primaryCta = SEEKERS_PRIMARY_CTA;
  protected readonly primaryHref = SEEKERS_PRIMARY_HREF;
  protected readonly secondaryCta = SEEKERS_SECONDARY_CTA;
  protected readonly secondaryHref = SEEKERS_SECONDARY_HREF;
}
