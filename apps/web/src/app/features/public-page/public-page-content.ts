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
export const PUBLIC_PAGE_SKELETONS: readonly PublicPageSkeletonContent[] = [];
