/**
 * Indexable public paths. `/design-system`, `/portal`, and `/admin` stay out.
 *
 * An absolute sitemap host is not published until a public origin is confirmed.
 */
export const PUBLIC_SITEMAP_PATHS = [
  '/',
  '/about',
  '/inclusion',
  '/employers',
  '/job-seekers',
  '/our-solutions',
  '/benefits',
  '/resources',
  '/contact',
] as const;
