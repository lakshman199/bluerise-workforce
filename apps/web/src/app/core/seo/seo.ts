import { inject } from '@angular/core';
import { type ActivatedRouteSnapshot, type ResolveFn } from '@angular/router';

import { SeoService, type PageSeo } from './seo.service';

/**
 * Route metadata is declared as route data and applied by this resolver, so a route's SEO
 * lives next to its path rather than inside the component that happens to render it.
 */
export const seoResolver: ResolveFn<null> = (route: ActivatedRouteSnapshot) => {
  const seo = route.data['seo'] as PageSeo | undefined;
  if (seo) {
    inject(SeoService).apply(seo);
  }
  return null;
};
