import { type Routes } from '@angular/router';

import { seoResolver } from './core/seo/seo';
import { PUBLIC_PAGE_SKELETONS } from './features/public-page/public-page-content';

/**
 * Every route is lazy-loaded, including the home page. The initial bundle then carries the
 * shell and the design system only, which is what keeps the entry payload small as the
 * Portal and Admin route groups arrive in later phases.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    resolve: { seo: seoResolver },
    data: {
      seo: {
        title: 'BlueRise Workforce — Building Stronger Workforces',
        description:
          'BlueRise Workforce is a unified workforce platform covering onboarding, payroll, benefits, HR and compliance, timekeeping, and workers’ compensation for employers and the people they employ.',
      },
    },
  },
  ...PUBLIC_PAGE_SKELETONS.map((page) => ({
    path: page.path,
    loadComponent: () =>
      import('./features/public-page/public-page-skeleton').then(
        (m) => m.PublicPageSkeleton,
      ),
    resolve: { seo: seoResolver },
    data: {
      seo: {
        title: page.seoTitle,
        description: page.seoDescription,
      },
    },
  })),
  {
    path: 'design-system',
    loadComponent: () =>
      import('./features/design-system/design-system').then((m) => m.DesignSystem),
    resolve: { seo: seoResolver },
    data: {
      seo: {
        title: 'Design system',
        description:
          'Tokens and component patterns shared by the BlueRise Workforce public website, Portal, and Admin surfaces.',
        // A developer reference rather than a page anyone should find in search results.
        noIndex: true,
      },
    },
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
    resolve: { seo: seoResolver },
    data: {
      seo: {
        title: 'Page not found',
        description: 'The page you were looking for could not be found.',
        noIndex: true,
      },
    },
  },
];
