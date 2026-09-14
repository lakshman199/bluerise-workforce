/**
 * Homepage copy for Task 2: hero and Core Purpose.
 *
 * Headline uses the plural "Workforces". The content-site screenshot reads the singular
 * "Workforce"; the master specification and architecture notes standardize the plural,
 * and that remains the project standard until the owner decides otherwise.
 */

export const HERO_EYEBROW = 'BlueRise Workforce';

export const HERO_HEADLINE_PRIMARY = 'Building Stronger Workforces.';
export const HERO_HEADLINE_ACCENT = 'Creating Brighter Futures.';

export const HERO_LEAD = [
  'At BlueRise Workforce, we believe that work is more than employment—it is a pathway to dignity, stability, growth, and opportunity. Our purpose extends beyond connecting businesses with talent. We are committed to empowering individuals, supporting families, and creating sustainable career pathways that improve lives and strengthen communities.',
  'We partner with organizations to deliver workforce solutions while ensuring that every individual we serve is treated with respect, compassion, and the opportunity to reach their full potential.',
] as const;

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

export const PURPOSE_EYEBROW = 'Our core purpose';

export const PURPOSE_HEADLINE =
  'BlueRise Workforce exists to create opportunities where talent meets purpose.';

export const PURPOSE_LEAD =
  'By connecting people with opportunities and organizations with talent, we help build a stronger and more inclusive workforce for the future.';

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

/**
 * Community Impact copy from the approved content screenshot. The lead is aspirational
 * on purpose: these are intended pathways, not claimed programme results.
 */
export const COMMUNITY_EYEBROW = 'Community Impact & Giving Back';

export const COMMUNITY_HEADLINE =
  'BlueRise Workforce is committed to creating opportunities beyond traditional staffing and workforce services.';

export const COMMUNITY_LEAD =
  'We aspire to establish programs and partnerships that allow individuals, businesses, and communities to contribute toward:';

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
  'By working together, we can create sustainable pathways that empower people to build brighter futures.';

export const TOGETHER_HEADLINE = 'A Future Built Together';

export const TOGETHER_LEAD =
  'At BlueRise Workforce, we believe that when people are empowered, communities prosper.';

export const TOGETHER_BODY = [
  'Through meaningful employment, workforce development, inclusive opportunities, and a commitment to serving others, we strive to create a future where everyone has the chance to contribute, succeed, and thrive.',
  'Together, we are building stronger workforces, brighter futures, and lasting impact for generations to come.',
] as const;

export const TOGETHER_CTA = 'Explore Benefits';
export const TOGETHER_CTA_HREF = '/benefits';

export const VALUES_EYEBROW = 'How we work';
export const VALUES_HEADLINE = 'Our Values';
export const VALUES_LEAD =
  'The same commitments that shape employment, inclusion, and community impact.';

export interface ValueItem {
  title: string;
  body: string;
}

export const VALUE_ITEMS: readonly ValueItem[] = [
  {
    title: 'Empowerment',
    body: 'Meaningful work as a pathway to dignity, growth, and opportunity.',
  },
  {
    title: 'Integrity',
    body: 'Honest, respectful support for every person we serve.',
  },
  {
    title: 'Inclusion',
    body: 'A commitment to accessible employment pathways, including for neurodiverse talent.',
  },
  {
    title: 'Compassion',
    body: 'Care for people, families, and the communities around them.',
  },
  {
    title: 'Excellence',
    body: 'Thoughtful workforce support that helps safeguard people’s futures.',
  },
  {
    title: 'Impact',
    body: 'When people are empowered, communities prosper.',
  },
] as const;

export const CLOSE_EYEBROW = 'Get in touch';
export const CLOSE_HEADLINE = 'Build the future of work with BlueRise Workforce.';
export const CLOSE_LEAD =
  'Employers, job seekers, and community partners are invited to connect with BlueRise Workforce.';

export const CLOSE_PRIMARY_CTA = 'Contact Us';
export const CLOSE_PRIMARY_HREF = '/contact';
export const CLOSE_SECONDARY_CTA = 'Explore Our Solutions';
export const CLOSE_SECONDARY_HREF = '/our-solutions';
