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
  { label: 'Industries We Serve', path: '/industries' },
  { label: 'Resources', path: '/resources' },
  { label: 'Contact Us', path: '/contact' },
] as const;

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    heading: 'Company',
    items: [
      { label: 'About Us', path: '/about' },
      { label: 'Inclusion', path: '/inclusion' },
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

export type SocialNetwork = 'linkedin' | 'facebook' | 'instagram';

export interface SocialProfile {
  id: SocialNetwork;
  label: string;
  /**
   * Official BlueRise profile URL. `null` until a verified account is confirmed.
   * Do not invent placeholders.
   */
  href: string | null;
}

export const SOCIAL_PROFILES: readonly SocialProfile[] = [
  { id: 'linkedin', label: 'LinkedIn', href: null },
  { id: 'facebook', label: 'Facebook', href: null },
  { id: 'instagram', label: 'Instagram', href: null },
] as const;

export const VERIFIED_SOCIAL_PROFILES = SOCIAL_PROFILES.filter(
  (profile): profile is SocialProfile & { href: string } => Boolean(profile.href),
);

export const SOCIAL_CONNECT_LABEL = 'Connect with us';
export const UTILITY_CONTACT_LABEL = 'Contact Us';

/** Verified public contact. The only address published until a phone and street address are confirmed. */
export const PUBLIC_CONTACT_EMAIL = 'info@blueriseworkforce.com';

/** Content-site utility-bar motto. Distinct from the brand line on the home hero. */
export const PUBLIC_MOTTO =
  'Empowering People. Enabling Opportunity. Transforming Futures.';
