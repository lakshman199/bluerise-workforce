export interface NavItem {
  label: string;
  path: string;
  /** Home is the only item that must match the path exactly. */
  exact?: boolean;
}

export interface FooterColumn {
  heading: string;
  items: readonly NavItem[];
}

/**
 * Public header and footer navigation.
 *
 * Labels follow the approved content-site terminology. Paths are the Phase 2 public
 * routes. Development destinations (design system, live status, architecture, roadmap)
 * are deliberately absent: they are not public navigation.
 *
 * Only routes that exist in this phase appear here. Footer columns are the same set,
 * grouped the way the content-site footer groups them, minus staffing and job-board
 * links that have no corresponding page.
 */
export const PRIMARY_NAV: readonly NavItem[] = [
  { label: 'Home', path: '/', exact: true },
  { label: 'About Us', path: '/about' },
  { label: 'Employers', path: '/employers' },
  { label: 'Job Seekers', path: '/job-seekers' },
  { label: 'Our Solutions', path: '/our-solutions' },
  { label: 'Benefits', path: '/benefits' },
  { label: 'Resources', path: '/resources' },
  { label: 'Contact Us', path: '/contact' },
] as const;

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    heading: 'Company',
    items: [
      { label: 'About Us', path: '/about' },
      { label: 'Resources', path: '/resources' },
      { label: 'Contact Us', path: '/contact' },
    ],
  },
  {
    heading: 'Employers',
    items: [
      { label: 'Employers', path: '/employers' },
      { label: 'Our Solutions', path: '/our-solutions' },
      { label: 'Benefits', path: '/benefits' },
    ],
  },
  {
    heading: 'Job Seekers',
    items: [{ label: 'Job Seekers', path: '/job-seekers' }],
  },
] as const;

/** Verified public contact. The only address published until a phone and street address are confirmed. */
export const PUBLIC_CONTACT_EMAIL = 'info@blueriseworkforce.com';

/** Content-site utility-bar motto. Distinct from the brand line on the home hero. */
export const PUBLIC_MOTTO =
  'Empowering People. Enabling Opportunity. Transforming Futures.';
