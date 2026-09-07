export interface PublicPageSkeletonContent {
  path: string;
  heading: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
}

/**
 * Skeleton copy for public routes whose full pages have not been written yet.
 *
 * Headings use the approved public navigation labels. Intros describe the page's role
 * without inventing programmes, statistics, customers, or contact details beyond the
 * verified email.
 */
export const PUBLIC_PAGE_SKELETONS: readonly PublicPageSkeletonContent[] = [
  {
    path: 'about',
    heading: 'About Us',
    intro:
      'This page will cover who BlueRise Workforce is, our mission, and the values that guide the work. The full story is being written next.',
    seoTitle: 'About Us',
    seoDescription:
      'Learn who BlueRise Workforce is and the mission behind Building Stronger Workforces. Creating Brighter Futures.',
  },
  {
    path: 'employers',
    heading: 'Employers',
    intro:
      'This page will explain how BlueRise Workforce supports employers. The full content is being written next.',
    seoTitle: 'Employers',
    seoDescription:
      'How BlueRise Workforce supports employers coordinating payroll, benefits, HR, timekeeping, and workers’ compensation.',
  },
  {
    path: 'job-seekers',
    heading: 'Job Seekers',
    intro:
      'This page will explain how BlueRise Workforce supports job seekers. The full content is being written next.',
    seoTitle: 'Job Seekers',
    seoDescription:
      'How BlueRise Workforce supports job seekers with employment, benefits, and a single place to see their work.',
  },
  {
    path: 'our-solutions',
    heading: 'Our Solutions',
    intro:
      'This page will describe the BlueRise Workforce solutions for employers and the people they employ. The full content is being written next.',
    seoTitle: 'Our Solutions',
    seoDescription:
      'BlueRise Workforce solutions covering onboarding, payroll, benefits, HR and compliance, timekeeping, and workers’ compensation.',
  },
  {
    path: 'benefits',
    heading: 'Benefits',
    intro:
      'This page will describe how BlueRise Workforce coordinates employee benefits. The full content is being written next.',
    seoTitle: 'Benefits',
    seoDescription:
      'How BlueRise Workforce coordinates employee benefits with brokers and carriers in one place.',
  },
  {
    path: 'resources',
    heading: 'Resources',
    intro:
      'Guides and reference material will appear here when they are ready. Nothing has been published on this page yet.',
    seoTitle: 'Resources',
    seoDescription: 'Guides and reference material from BlueRise Workforce.',
  },
  {
    path: 'contact',
    heading: 'Contact Us',
    intro:
      'The contact form will be added next. Until then, the best way to reach BlueRise Workforce is by email at info@blueriseworkforce.com.',
    seoTitle: 'Contact Us',
    seoDescription: 'Contact BlueRise Workforce at info@blueriseworkforce.com.',
  },
] as const;
