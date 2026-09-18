/**
 * Homepage copy for the public marketing site.
 *
 * This page is written for small and growing businesses. Longer mission, vision, and
 * community detail lives on dedicated pages rather than in the hero.
 */

export const HERO_EYEBROW = 'BlueRise Workforce';

export const HERO_HEADLINE_PRIMARY = 'Workforce Management,';
export const HERO_HEADLINE_ACCENT = 'Made Simpler.';

export const HERO_LEAD =
  'Hire, pay, support, and retain your workforce with connected tools for payroll, benefits, timekeeping, and employee support.';

export const HERO_PRIMARY_CTA = 'See How BlueRise Works';
export const HERO_PRIMARY_HREF = '#glance';
export const HERO_SECONDARY_CTA = 'Talk to Our Team';
export const HERO_SECONDARY_HREF = '/contact';

/**
 * Homepage hero visual labels. These name platform areas, not live employee records,
 * payroll amounts, benefit enrollments, or connected providers.
 */
export const HERO_PLATFORM_TITLE = 'BlueRise Workforce';
export const HERO_PLATFORM_LEAD = 'A coordinated workforce platform';
export const HERO_PLATFORM_AREAS = [
  'Payroll',
  'Benefits',
  'HR & Compliance',
  'Timekeeping',
  'Workers’ Comp',
  'Employee Support',
] as const;

export const HERO_SCENE_ALT =
  'BlueRise helps small businesses simplify hiring, payroll, benefits, timekeeping and workforce support.';

export const HERO_SCENE_FRAMES = [
  '/images/hero/bluerise-chaos-start-clean.webp',
  '/images/hero/bluerise-float-motion-clean.webp',
  '/images/hero/bluerise-peak-action-clean.webp',
  '/images/hero/bluerise-calm-finish-clean.webp',
] as const;

export type HeroServiceCardId =
  | 'hiring'
  | 'payroll'
  | 'benefits'
  | 'timekeeping'
  | 'support';

export interface HeroServiceCard {
  id: HeroServiceCardId;
  label: string;
}

export const HERO_SERVICE_CARDS: readonly HeroServiceCard[] = [
  { id: 'hiring', label: 'Hiring' },
  { id: 'payroll', label: 'Payroll' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'timekeeping', label: 'Timekeeping' },
  { id: 'support', label: 'Support' },
] as const;

export const GLANCE_HEADLINE_LEAD = 'One Connected Experience';
export const GLANCE_HEADLINE_ACCENT = 'for Your Workforce.';

export type GlanceCardId = 'hire' | 'operations' | 'support';

export type GlanceCardIcon = 'people' | 'workforce' | 'headset';

export interface GlanceCard {
  id: GlanceCardId;
  icon: GlanceCardIcon;
  title: string;
  body: string;
  href: '/employers' | '/our-solutions' | '/benefits';
}

export const GLANCE_CARDS: readonly GlanceCard[] = [
  {
    id: 'hire',
    icon: 'people',
    title: 'Hire with Confidence',
    body: 'Attract and onboard the right people with a simpler process.',
    href: '/employers',
  },
  {
    id: 'operations',
    icon: 'workforce',
    title: 'Manage Payroll & Benefits',
    body: 'Keep payroll, time, and benefits organized in one place.',
    href: '/our-solutions',
  },
  {
    id: 'support',
    icon: 'headset',
    title: 'Support Your Workforce',
    body: 'Give employees access to the support they need to stay productive and engaged.',
    href: '/benefits',
  },
] as const;

export const PURPOSE_EYEBROW = 'For growing businesses';

export const PURPOSE_HEADLINE_LEAD = 'Built for';
export const PURPOSE_HEADLINE_ACCENT = 'Growing Businesses.';

export const PURPOSE_HEADLINE = `${PURPOSE_HEADLINE_LEAD} ${PURPOSE_HEADLINE_ACCENT}`;

export const PURPOSE_LEAD =
  'BlueRise helps small and growing businesses reduce administrative work and manage their workforce with greater clarity and confidence.';

export type PurposeIcon = 'employment' | 'growth' | 'workplace' | 'security' | 'respect';

export interface PurposeItem {
  icon: PurposeIcon;
  title: string;
}

export const PURPOSE_ITEMS: readonly PurposeItem[] = [
  { icon: 'employment', title: 'Access to meaningful employment' },
  { icon: 'growth', title: 'Opportunities for growth and advancement' },
  { icon: 'workplace', title: 'A supportive and inclusive workplace' },
  { icon: 'security', title: 'Financial security and career stability' },
  { icon: 'respect', title: 'Respect, dignity, and equal opportunity' },
] as const;

export const TRUST_EYEBROW = 'Our purpose';
export const TRUST_HEADLINE_LEAD = 'Better for Business.';
export const TRUST_HEADLINE_ACCENT = 'Better for People.';
export const TRUST_HEADLINE = `${TRUST_HEADLINE_LEAD} ${TRUST_HEADLINE_ACCENT}`;
export const TRUST_LEAD =
  'BlueRise helps businesses grow while creating stronger experiences for the people who make that growth possible.';

/**
 * Community Impact copy. The lead is aspirational on purpose: these are intended
 * pathways, not claimed programme results.
 */
export const COMMUNITY_EYEBROW = 'Community Impact & Giving Back';

export const COMMUNITY_HEADLINE = 'Opportunity that reaches beyond the workplace.';

export const COMMUNITY_LEAD =
  'We aspire to programs and partnerships that help people, businesses, and communities contribute toward:';

export type CommunityIcon =
  'development' | 'training' | 'scholarship' | 'workshops' | 'inclusion' | 'community';

export interface CommunityItem {
  icon: CommunityIcon;
  title: string;
}

export const COMMUNITY_ITEMS: readonly CommunityItem[] = [
  { icon: 'development', title: 'Workforce development initiatives' },
  { icon: 'training', title: 'Career training programs' },
  { icon: 'scholarship', title: 'Scholarship opportunities' },
  { icon: 'workshops', title: 'Skills development workshops' },
  { icon: 'inclusion', title: 'Autism and special-needs workforce programs' },
  { icon: 'community', title: 'Community employment and inclusion projects' },
] as const;

export const COMMUNITY_CLOSING =
  'Working together, we can create pathways that help people build brighter futures.';

export const TOGETHER_HEADLINE_LEAD = 'Benefits That';
export const TOGETHER_HEADLINE_ACCENT = 'Help You Compete.';
export const TOGETHER_HEADLINE = `${TOGETHER_HEADLINE_LEAD} ${TOGETHER_HEADLINE_ACCENT}`;

export const TOGETHER_LEAD =
  'Offer meaningful benefits and support that help you attract, retain, and care for your workforce.';

export const TOGETHER_CTA = 'Explore Benefits';
export const TOGETHER_CTA_HREF = '/benefits';

export const HOW_IT_WORKS_EYEBROW = 'How it works';
export const HOW_IT_WORKS_HEADLINE_LEAD = 'Simple to Start.';
export const HOW_IT_WORKS_HEADLINE_ACCENT = 'Easy to Manage.';
export const HOW_IT_WORKS_HEADLINE = `${HOW_IT_WORKS_HEADLINE_LEAD} ${HOW_IT_WORKS_HEADLINE_ACCENT}`;
export const HOW_IT_WORKS_LEAD = 'BlueRise follows a clear path from hiring to day-to-day support.';

export interface HowItWorksStep {
  title: string;
  body: string;
}

export const HOW_IT_WORKS_STEPS: readonly HowItWorksStep[] = [
  { title: 'Hire', body: 'Bring the right people onboard.' },
  { title: 'Manage', body: 'Coordinate payroll, time, and benefits.' },
  { title: 'Support', body: 'Help your workforce stay productive and supported.' },
] as const;

export const CLOSE_EYEBROW = 'Get in touch';
export const CLOSE_HEADLINE_LEAD = 'Ready to Simplify';
export const CLOSE_HEADLINE_ACCENT = 'Workforce Management?';
export const CLOSE_HEADLINE = `${CLOSE_HEADLINE_LEAD} ${CLOSE_HEADLINE_ACCENT}`;
export const CLOSE_LEAD =
  'Spend less time managing workforce administration and more time focused on your business.';

export const CLOSE_PRIMARY_CTA = 'Talk to BlueRise';
export const CLOSE_PRIMARY_HREF = '/contact';
