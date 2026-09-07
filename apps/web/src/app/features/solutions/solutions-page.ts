import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { emphasize } from '../../shared/emphasize';
import {
  SOLUTIONS_AUDIENCE_TITLE,
  SOLUTIONS_CONNECT_BODY,
  SOLUTIONS_CONNECT_TITLE,
  SOLUTIONS_CTA_BODY,
  SOLUTIONS_CTA_TITLE,
  SOLUTIONS_EMPLOYER_BODY,
  SOLUTIONS_EMPLOYER_TITLE,
  SOLUTIONS_EYEBROW,
  SOLUTIONS_FLOW,
  SOLUTIONS_FLOW_LABEL,
  SOLUTIONS_HEADLINE,
  SOLUTIONS_INTRO,
  SOLUTIONS_MODULES,
  SOLUTIONS_MODULES_LEAD,
  SOLUTIONS_MODULES_TITLE,
  SOLUTIONS_OVERVIEW_BODY,
  SOLUTIONS_OVERVIEW_TITLE,
  SOLUTIONS_PRIMARY_CTA,
  SOLUTIONS_PRIMARY_HREF,
  SOLUTIONS_SECONDARY_CTA,
  SOLUTIONS_SECONDARY_HREF,
  SOLUTIONS_WORKER_BODY,
  SOLUTIONS_WORKER_TITLE,
} from './solutions-content';

@Component({
  selector: 'br-solutions-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './solutions-page.html',
  styleUrl: './solutions-page.scss',
})
export class SolutionsPage {
  protected readonly eyebrow = SOLUTIONS_EYEBROW;
  protected readonly headlineHtml = emphasize(SOLUTIONS_HEADLINE, 'coordinated');
  protected readonly intro = SOLUTIONS_INTRO;
  protected readonly overviewTitle = SOLUTIONS_OVERVIEW_TITLE;
  protected readonly overviewBody = SOLUTIONS_OVERVIEW_BODY;
  protected readonly flowLabel = SOLUTIONS_FLOW_LABEL;
  protected readonly flow = SOLUTIONS_FLOW;
  protected readonly modulesTitle = SOLUTIONS_MODULES_TITLE;
  protected readonly modulesLead = SOLUTIONS_MODULES_LEAD;
  protected readonly modules = SOLUTIONS_MODULES;
  protected readonly connectTitle = SOLUTIONS_CONNECT_TITLE;
  protected readonly connectBody = SOLUTIONS_CONNECT_BODY;
  protected readonly audienceTitle = SOLUTIONS_AUDIENCE_TITLE;
  protected readonly employerTitle = SOLUTIONS_EMPLOYER_TITLE;
  protected readonly employerBody = SOLUTIONS_EMPLOYER_BODY;
  protected readonly workerTitle = SOLUTIONS_WORKER_TITLE;
  protected readonly workerBody = SOLUTIONS_WORKER_BODY;
  protected readonly ctaTitle = SOLUTIONS_CTA_TITLE;
  protected readonly ctaBody = SOLUTIONS_CTA_BODY;
  protected readonly primaryCta = SOLUTIONS_PRIMARY_CTA;
  protected readonly primaryHref = SOLUTIONS_PRIMARY_HREF;
  protected readonly secondaryCta = SOLUTIONS_SECONDARY_CTA;
  protected readonly secondaryHref = SOLUTIONS_SECONDARY_HREF;
}
