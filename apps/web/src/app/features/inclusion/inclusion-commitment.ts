import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  INCLUSION_CLOSING,
  INCLUSION_EYEBROW,
  INCLUSION_GOAL_INTRO,
  INCLUSION_GOALS,
  INCLUSION_HEADLINE,
  INCLUSION_HOME_CTA,
  INCLUSION_HOME_CTA_HREF,
  INCLUSION_BODY,
} from './inclusion-content';

@Component({
  selector: 'br-inclusion-commitment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './inclusion-commitment.html',
  styleUrl: './inclusion-commitment.scss',
})
export class InclusionCommitment {
  readonly compact = input(false);
  readonly showEyebrow = input(true);
  readonly showHeading = input(true);
  readonly showIntro = input(true);
  readonly showGoals = input(true);
  readonly showClosing = input(true);
  readonly showCta = input(false);

  protected readonly eyebrow = INCLUSION_EYEBROW;
  protected readonly headline = INCLUSION_HEADLINE;
  protected readonly intro = INCLUSION_BODY;
  protected readonly goalIntro = INCLUSION_GOAL_INTRO;
  protected readonly goals = INCLUSION_GOALS;
  protected readonly closing = INCLUSION_CLOSING;
  protected readonly ctaLabel = INCLUSION_HOME_CTA;
  protected readonly ctaHref = INCLUSION_HOME_CTA_HREF;
}
