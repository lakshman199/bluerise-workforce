import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { emphasize } from '../../shared/emphasize';
import { WorkforceFigure } from '../../shared/workforce-figure/workforce-figure';
import { WORKFORCE_IMAGES } from '../../shared/workforce-images';
import {
  INDUSTRIES_CONTEXTS,
  INDUSTRIES_CONTEXTS_LEAD,
  INDUSTRIES_CONTEXTS_TITLE,
  INDUSTRIES_CTA_BODY,
  INDUSTRIES_CTA_TITLE,
  INDUSTRIES_EXAMPLE_AUTOMOTIVE,
  INDUSTRIES_EXAMPLE_FRONTLINE,
  INDUSTRIES_EXAMPLE_INDUSTRIAL,
  INDUSTRIES_EXAMPLE_TRADES,
  INDUSTRIES_EXAMPLES_LEAD,
  INDUSTRIES_EXAMPLES_TITLE,
  INDUSTRIES_EYEBROW,
  INDUSTRIES_HEADLINE,
  INDUSTRIES_INTRO,
  INDUSTRIES_NOTE_BODY,
  INDUSTRIES_NOTE_TITLE,
  INDUSTRIES_PRIMARY_CTA,
  INDUSTRIES_PRIMARY_HREF,
  INDUSTRIES_SECONDARY_CTA,
  INDUSTRIES_SECONDARY_HREF,
} from './industries-content';

@Component({
  selector: 'br-industries-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, WorkforceFigure],
  templateUrl: './industries-page.html',
  styleUrl: './industries-page.scss',
})
export class IndustriesPage {
  protected readonly eyebrow = INDUSTRIES_EYEBROW;
  protected readonly headlineHtml = emphasize(
    INDUSTRIES_HEADLINE,
    'small and growing businesses.',
  );
  protected readonly intro = INDUSTRIES_INTRO;
  protected readonly visualImage = WORKFORCE_IMAGES.woodworker;
  protected readonly contextsTitle = INDUSTRIES_CONTEXTS_TITLE;
  protected readonly contextsLead = INDUSTRIES_CONTEXTS_LEAD;
  protected readonly contexts = INDUSTRIES_CONTEXTS;
  protected readonly examplesTitle = INDUSTRIES_EXAMPLES_TITLE;
  protected readonly examplesLead = INDUSTRIES_EXAMPLES_LEAD;
  protected readonly examples = [
    {
      image: WORKFORCE_IMAGES.industrialTeam,
      caption: INDUSTRIES_EXAMPLE_INDUSTRIAL,
    },
    {
      image: WORKFORCE_IMAGES.bodyShopWorker,
      caption: INDUSTRIES_EXAMPLE_AUTOMOTIVE,
    },
    {
      image: WORKFORCE_IMAGES.woodworker,
      caption: INDUSTRIES_EXAMPLE_TRADES,
    },
    {
      image: WORKFORCE_IMAGES.convenienceStoreWorker,
      caption: INDUSTRIES_EXAMPLE_FRONTLINE,
    },
  ] as const;
  protected readonly noteTitle = INDUSTRIES_NOTE_TITLE;
  protected readonly noteBody = INDUSTRIES_NOTE_BODY;
  protected readonly ctaTitle = INDUSTRIES_CTA_TITLE;
  protected readonly ctaBody = INDUSTRIES_CTA_BODY;
  protected readonly primaryCta = INDUSTRIES_PRIMARY_CTA;
  protected readonly primaryHref = INDUSTRIES_PRIMARY_HREF;
  protected readonly secondaryCta = INDUSTRIES_SECONDARY_CTA;
  protected readonly secondaryHref = INDUSTRIES_SECONDARY_HREF;
}
