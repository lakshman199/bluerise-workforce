import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  INCLUSION_CAREERS_BODY,
  INCLUSION_CAREERS_EYEBROW,
  INCLUSION_CAREERS_TITLE,
  INCLUSION_CLOSING,
  INCLUSION_CTA_TITLE,
  INCLUSION_EMPLOYERS_BODY,
  INCLUSION_EMPLOYERS_EYEBROW,
  INCLUSION_EMPLOYERS_TITLE,
  INCLUSION_EYEBROW,
  INCLUSION_HEADLINE,
  INCLUSION_PAGE_LEDE,
  INCLUSION_PATHWAYS_BODY,
  INCLUSION_PATHWAYS_EYEBROW,
  INCLUSION_PATHWAYS_ITEMS,
  INCLUSION_PATHWAYS_TITLE,
  INCLUSION_PRIMARY_CTA,
  INCLUSION_PRIMARY_CTA_HREF,
  INCLUSION_SECONDARY_CTA,
  INCLUSION_SECONDARY_CTA_HREF,
  INCLUSION_TRAINING_BODY,
  INCLUSION_TRAINING_EYEBROW,
  INCLUSION_TRAINING_TITLE,
} from './inclusion-content';
import { InclusionCommitment } from './inclusion-commitment';

@Component({
  selector: 'br-inclusion-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, InclusionCommitment],
  templateUrl: './inclusion-page.html',
  styleUrl: './inclusion-page.scss',
})
export class InclusionPage {
  protected readonly eyebrow = INCLUSION_EYEBROW;
  protected readonly headline = INCLUSION_HEADLINE;
  protected readonly lede = INCLUSION_PAGE_LEDE;
  protected readonly pathwaysEyebrow = INCLUSION_PATHWAYS_EYEBROW;
  protected readonly pathwaysTitle = INCLUSION_PATHWAYS_TITLE;
  protected readonly pathwaysBody = INCLUSION_PATHWAYS_BODY;
  protected readonly pathwaysItems = INCLUSION_PATHWAYS_ITEMS;
  protected readonly trainingEyebrow = INCLUSION_TRAINING_EYEBROW;
  protected readonly trainingTitle = INCLUSION_TRAINING_TITLE;
  protected readonly trainingBody = INCLUSION_TRAINING_BODY;
  protected readonly employersEyebrow = INCLUSION_EMPLOYERS_EYEBROW;
  protected readonly employersTitle = INCLUSION_EMPLOYERS_TITLE;
  protected readonly employersBody = INCLUSION_EMPLOYERS_BODY;
  protected readonly careersEyebrow = INCLUSION_CAREERS_EYEBROW;
  protected readonly careersTitle = INCLUSION_CAREERS_TITLE;
  protected readonly careersBody = INCLUSION_CAREERS_BODY;
  protected readonly ctaTitle = INCLUSION_CTA_TITLE;
  protected readonly closing = INCLUSION_CLOSING;
  protected readonly primaryCta = INCLUSION_PRIMARY_CTA;
  protected readonly primaryCtaHref = INCLUSION_PRIMARY_CTA_HREF;
  protected readonly secondaryCta = INCLUSION_SECONDARY_CTA;
  protected readonly secondaryCtaHref = INCLUSION_SECONDARY_CTA_HREF;
}
