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
