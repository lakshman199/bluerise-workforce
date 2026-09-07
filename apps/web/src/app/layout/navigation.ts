export interface NavItem {
  label: string;
  /** A router path, or a fragment on the current page. */
  path?: string;
  fragment?: string;
}

/**
 * The header's navigation, driven by data so that Phase 2 extends this array rather than
 * editing the header's template.
 *
 * Only routes that exist appear here. The full public information architecture — About,
 * Employers, Employees, Benefits, Workforce Solutions, Inclusion, Resources, Contact — is
 * specified in docs/architecture/sitemap.md and lands with those pages in Phase 2. Listing
 * them before they resolve would ship dead links.
 */
export const PRIMARY_NAV: readonly NavItem[] = [
  { label: 'Platform', path: '/', fragment: 'platform' },
  { label: 'Architecture', path: '/', fragment: 'architecture' },
  { label: 'Roadmap', path: '/', fragment: 'roadmap' },
  { label: 'Design system', path: '/design-system' },
] as const;
