import { type Routes } from '@angular/router';

import { seoResolver } from './core/seo/seo';
import { ABOUT_SEO_DESCRIPTION, ABOUT_SEO_TITLE } from './features/about/about-content';
import {
  INCLUSION_SEO_DESCRIPTION,
  INCLUSION_SEO_TITLE,
} from './features/inclusion/inclusion-content';
import { PUBLIC_PAGE_SKELETONS } from './features/public-page/public-page-content';
import {
  CONTACT_SEO_DESCRIPTION,
  CONTACT_SEO_TITLE,
} from './features/contact/contact-content';
import {
  EMPLOYERS_SEO_DESCRIPTION,
  EMPLOYERS_SEO_TITLE,
} from './features/employers/employers-content';
import {
  RESOURCES_SEO_DESCRIPTION,
  RESOURCES_SEO_TITLE,
} from './features/resources/resources-content';
import {
  SEEKERS_SEO_DESCRIPTION,
  SEEKERS_SEO_TITLE,
} from './features/job-seekers/job-seekers-content';
import {
  SOLUTIONS_SEO_DESCRIPTION,
  SOLUTIONS_SEO_TITLE,
} from './features/solutions/solutions-content';
import {
  BENEFITS_SEO_DESCRIPTION,
  BENEFITS_SEO_TITLE,
} from './features/benefits/benefits-content';

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
  {
    path: 'about',
    loadComponent: () => import('./features/about/about-page').then((m) => m.AboutPage),
    resolve: { seo: seoResolver },
    data: {
      seo: {
        title: ABOUT_SEO_TITLE,
        description: ABOUT_SEO_DESCRIPTION,
      },
    },
  },
  {
    path: 'inclusion',
    loadComponent: () =>
      import('./features/inclusion/inclusion-page').then((m) => m.InclusionPage),
    resolve: { seo: seoResolver },
    data: {
      seo: {
        title: INCLUSION_SEO_TITLE,
        description: INCLUSION_SEO_DESCRIPTION,
      },
    },
  },
  {
    path: 'employers',
    loadComponent: () =>
      import('./features/employers/employers-page').then((m) => m.EmployersPage),
    resolve: { seo: seoResolver },
    data: {
      seo: {
        title: EMPLOYERS_SEO_TITLE,
        description: EMPLOYERS_SEO_DESCRIPTION,
      },
    },
  },
  {
    path: 'job-seekers',
    loadComponent: () =>
      import('./features/job-seekers/job-seekers-page').then((m) => m.JobSeekersPage),
    resolve: { seo: seoResolver },
    data: {
      seo: {
        title: SEEKERS_SEO_TITLE,
        description: SEEKERS_SEO_DESCRIPTION,
      },
    },
  },
  {
    path: 'our-solutions',
    loadComponent: () =>
      import('./features/solutions/solutions-page').then((m) => m.SolutionsPage),
    resolve: { seo: seoResolver },
    data: {
      seo: {
        title: SOLUTIONS_SEO_TITLE,
        description: SOLUTIONS_SEO_DESCRIPTION,
      },
    },
  },
  {
    path: 'benefits',
    loadComponent: () =>
      import('./features/benefits/benefits-page').then((m) => m.BenefitsPage),
    resolve: { seo: seoResolver },
    data: {
      seo: {
        title: BENEFITS_SEO_TITLE,
        description: BENEFITS_SEO_DESCRIPTION,
      },
    },
  },
  {
    path: 'resources',
    loadComponent: () =>
      import('./features/resources/resources-page').then((m) => m.ResourcesPage),
    resolve: { seo: seoResolver },
    data: {
      seo: {
        title: RESOURCES_SEO_TITLE,
        description: RESOURCES_SEO_DESCRIPTION,
      },
    },
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/contact-page').then((m) => m.ContactPage),
    resolve: { seo: seoResolver },
    data: {
      seo: {
        title: CONTACT_SEO_TITLE,
        description: CONTACT_SEO_DESCRIPTION,
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
