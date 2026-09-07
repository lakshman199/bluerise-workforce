import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { PUBLIC_CONTACT_EMAIL } from '../../layout/navigation';
import { PUBLIC_PAGE_SKELETONS } from './public-page-content';

@Component({
  selector: 'br-public-page-skeleton',
  imports: [RouterLink],
  templateUrl: './public-page-skeleton.html',
  styleUrl: './public-page-skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicPageSkeleton {
  private readonly route = inject(ActivatedRoute);

  private readonly path = toSignal(
    this.route.url.pipe(
      map((segments) => segments.map((segment) => segment.path).join('/')),
    ),
    { initialValue: this.route.snapshot.url.map((segment) => segment.path).join('/') },
  );

  protected readonly page = computed(() => {
    const path = this.path();
    return (
      PUBLIC_PAGE_SKELETONS.find((entry) => entry.path === path) ??
      PUBLIC_PAGE_SKELETONS[0]
    );
  });

  protected readonly contactEmail = PUBLIC_CONTACT_EMAIL;
}
