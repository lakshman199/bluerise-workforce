import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { emphasize } from '../../shared/emphasize';
import {
  BENEFITS_CATEGORIES,
  BENEFITS_CATEGORIES_NOTE,
  BENEFITS_CATEGORIES_TITLE,
  BENEFITS_CONNECT_BODY,
  BENEFITS_CONNECT_TITLE,
  BENEFITS_CTA_BODY,
  BENEFITS_CTA_TITLE,
  BENEFITS_EXPERIENCE,
  BENEFITS_EXPERIENCE_TITLE,
  BENEFITS_EYEBROW,
  BENEFITS_HEADLINE,
  BENEFITS_INTRO,
  BENEFITS_PRIMARY_CTA,
  BENEFITS_PRIMARY_HREF,
  BENEFITS_SECONDARY_CTA,
  BENEFITS_SECONDARY_HREF,
  BENEFITS_SUPPORT_BODY,
  BENEFITS_SUPPORT_TITLE,
  BENEFITS_WHY_BODY,
  BENEFITS_WHY_TITLE,
} from './benefits-content';

@Component({
  selector: 'br-benefits-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './benefits-page.html',
  styleUrl: './benefits-page.scss',
})
export class BenefitsPage {
  protected readonly eyebrow = BENEFITS_EYEBROW;
  protected readonly headlineHtml = emphasize(BENEFITS_HEADLINE, 'coordinated');
  protected readonly intro = BENEFITS_INTRO;
  protected readonly whyTitle = BENEFITS_WHY_TITLE;
  protected readonly whyBody = BENEFITS_WHY_BODY;
  protected readonly experienceTitle = BENEFITS_EXPERIENCE_TITLE;
  protected readonly experience = BENEFITS_EXPERIENCE;
  protected readonly supportTitle = BENEFITS_SUPPORT_TITLE;
  protected readonly supportBody = BENEFITS_SUPPORT_BODY;
  protected readonly connectTitle = BENEFITS_CONNECT_TITLE;
  protected readonly connectBody = BENEFITS_CONNECT_BODY;
  protected readonly categoriesTitle = BENEFITS_CATEGORIES_TITLE;
  protected readonly categoriesNote = BENEFITS_CATEGORIES_NOTE;
  protected readonly categories = BENEFITS_CATEGORIES;
  protected readonly ctaTitle = BENEFITS_CTA_TITLE;
  protected readonly ctaBody = BENEFITS_CTA_BODY;
  protected readonly primaryCta = BENEFITS_PRIMARY_CTA;
  protected readonly primaryHref = BENEFITS_PRIMARY_HREF;
  protected readonly secondaryCta = BENEFITS_SECONDARY_CTA;
  protected readonly secondaryHref = BENEFITS_SECONDARY_HREF;
}
