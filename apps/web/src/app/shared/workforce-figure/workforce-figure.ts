import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { type WorkforceImage } from '../workforce-images';

@Component({
  selector: 'br-workforce-figure',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './workforce-figure.html',
  styleUrl: './workforce-figure.scss',
})
export class WorkforceFigure {
  readonly image = input.required<WorkforceImage>();
  readonly caption = input<string | undefined>(undefined);
  readonly eager = input(false);
  readonly ratio = input('3 / 2');
}
