import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { emphasize } from '../../shared/emphasize';
import {
  RESOURCES_AUDIENCE_LEAD,
  RESOURCES_AUDIENCE_TITLE,
  RESOURCES_AUDIENCES,
  RESOURCES_AVAILABILITY,
  RESOURCES_CATEGORIES,
  RESOURCES_CATEGORIES_LEAD,
  RESOURCES_CATEGORIES_TITLE,
  RESOURCES_CTA_BODY,
  RESOURCES_CTA_TITLE,
  RESOURCES_EYEBROW,
  RESOURCES_HEADLINE,
  RESOURCES_INTRO,
  RESOURCES_PRIMARY_CTA,
  RESOURCES_PRIMARY_HREF,
  RESOURCES_SECONDARY_CTA,
  RESOURCES_SECONDARY_HREF,
  RESOURCES_THEMES,
  RESOURCES_THEMES_LEAD,
  RESOURCES_THEMES_TITLE,
} from './resources-content';

@Component({
  selector: 'br-resources-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './resources-page.html',
  styleUrl: './resources-page.scss',
})
export class ResourcesPage {
  protected readonly eyebrow = RESOURCES_EYEBROW;
  protected readonly headlineHtml = emphasize(RESOURCES_HEADLINE, 'when they are ready.');
  protected readonly intro = RESOURCES_INTRO;
  protected readonly availability = RESOURCES_AVAILABILITY;
  protected readonly categoriesTitle = RESOURCES_CATEGORIES_TITLE;
  protected readonly categoriesLead = RESOURCES_CATEGORIES_LEAD;
  protected readonly categories = RESOURCES_CATEGORIES;
  protected readonly audienceTitle = RESOURCES_AUDIENCE_TITLE;
  protected readonly audienceLead = RESOURCES_AUDIENCE_LEAD;
  protected readonly audiences = RESOURCES_AUDIENCES;
  protected readonly themesTitle = RESOURCES_THEMES_TITLE;
  protected readonly themesLead = RESOURCES_THEMES_LEAD;
  protected readonly themes = RESOURCES_THEMES;
  protected readonly ctaTitle = RESOURCES_CTA_TITLE;
  protected readonly ctaBody = RESOURCES_CTA_BODY;
  protected readonly primaryCta = RESOURCES_PRIMARY_CTA;
  protected readonly primaryHref = RESOURCES_PRIMARY_HREF;
  protected readonly secondaryCta = RESOURCES_SECONDARY_CTA;
  protected readonly secondaryHref = RESOURCES_SECONDARY_HREF;
}
