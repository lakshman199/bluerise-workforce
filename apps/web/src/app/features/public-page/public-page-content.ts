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
