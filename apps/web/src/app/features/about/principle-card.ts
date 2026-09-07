import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'br-principle-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './principle-card.html',
  styleUrl: './principle-card.scss',
})
export class PrincipleCard {
  readonly headingLevel = input<'h2' | 'h3'>('h2');
  readonly label = input.required<string>();
  readonly body = input.required<string>();
}
