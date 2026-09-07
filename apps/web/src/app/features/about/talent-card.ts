import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TALENT_HEADING, TALENT_THEMES } from './about-content';

@Component({
  selector: 'br-talent-card',
  templateUrl: './talent-card.html',
  styleUrl: './talent-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TalentCard {
  /** Hide the card title when a parent heading already names Talent Meets Purpose. */
  readonly showHeading = input(true);

  protected readonly heading = TALENT_HEADING;
  protected readonly themes = TALENT_THEMES;
}
