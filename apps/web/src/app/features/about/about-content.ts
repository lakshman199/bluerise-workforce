/**
 * About Us copy for the public marketing site.
 *
 * Homepage-only exports (`ABOUT_HOME_*`) stay stable so the home page is not
 * affected by this refresh. Nothing here invents history, people, offices,
 * awards, or counts. The team visual is AI-generated artwork, not a photo of
 * BlueRise employees.
 */

export const ABOUT_EYEBROW = 'About BlueRise Workforce';

export const ABOUT_HEADLINE_LEAD = 'Workforce Solutions';
export const ABOUT_HEADLINE_ACCENT = 'Built Around People.';
export const ABOUT_HEADLINE = `${ABOUT_HEADLINE_LEAD} ${ABOUT_HEADLINE_ACCENT}`;

export const ABOUT_INTRO =
  'BlueRise helps businesses manage and support their workforce while creating better experiences for the people who make business possible.';

/** Shorter homepage supporting line; same meaning as the previous About intro. */
export const ABOUT_HOME_INTRO =
  'BlueRise Workforce believes work is more than employment — it is a pathway to dignity, stability, growth, and opportunity.';

export const ABOUT_PRIMARY_CTA = 'Our Purpose';
export const ABOUT_PRIMARY_HREF = '#why';
export const ABOUT_SECONDARY_CTA = 'Talk to Our Team';
export const ABOUT_SECONDARY_HREF = '/contact';

export const ABOUT_HERO_IMAGE = {
  src: '/images/about/bluerise-team-collaboration.webp',
  width: 1672,
  height: 941,
  alt: 'Illustration of a professional team collaborating in a BlueRise-branded workspace.',
} as const;

export const ABOUT_WHY_HEADLINE_LEAD = 'Why BlueRise';
export const ABOUT_WHY_HEADLINE_ACCENT = 'Exists';

export const ABOUT_MISSION_LABEL = 'Our Mission';

export const ABOUT_MISSION =
  'Help businesses build stronger workforces through practical support, better employee experiences, and meaningful opportunities.';

export const ABOUT_VISION_LABEL = 'Our Vision';

export const ABOUT_VISION =
  'A future where growing businesses and their people have the tools and support they need to succeed together.';

export const TALENT_HEADLINE_LEAD = 'Where Talent';
export const TALENT_HEADLINE_ACCENT = 'Meets Purpose.';
export const TALENT_HEADING = `${TALENT_HEADLINE_LEAD} ${TALENT_HEADLINE_ACCENT}`;

export const TALENT_INTRO =
  'We connect business needs with workforce opportunity—helping employers grow while supporting the people behind that growth.';

export type TalentIdeaIcon = 'opportunity' | 'support' | 'partnership';

export interface TalentIdea {
  readonly id: TalentIdeaIcon;
  readonly title: string;
  readonly body: string;
  readonly icon: TalentIdeaIcon;
}

export const TALENT_IDEAS: readonly TalentIdea[] = [
  {
    id: 'opportunity',
    title: 'Opportunity',
    body: 'Create meaningful paths to work and growth.',
    icon: 'opportunity',
  },
  {
    id: 'support',
    title: 'Support',
    body: 'Help employees succeed beyond the first day.',
    icon: 'support',
  },
  {
    id: 'partnership',
    title: 'Partnership',
    body: 'Work alongside businesses as their workforce needs evolve.',
    icon: 'partnership',
  },
] as const;

/** Titles only; kept for the unused talent-card checklist fallback. */
export const TALENT_THEMES: readonly string[] = TALENT_IDEAS.map((item) => item.title);

export const ABOUT_HOME_CTA = 'Learn More About BlueRise';
export const ABOUT_HOME_CTA_HREF = '/about';

export const ABOUT_VALUES_HEADLINE = 'The Values Behind BlueRise';

export type AboutValueIcon =
  | 'empowerment'
  | 'integrity'
  | 'inclusion'
  | 'compassion'
  | 'excellence'
  | 'impact';

export interface AboutValue {
  readonly id: AboutValueIcon;
  readonly title: string;
  readonly body: string;
  readonly icon: AboutValueIcon;
}

export const ABOUT_VALUES: readonly AboutValue[] = [
  {
    id: 'empowerment',
    title: 'Empowerment',
    body: 'Give people the tools and confidence to move forward.',
    icon: 'empowerment',
  },
  {
    id: 'integrity',
    title: 'Integrity',
    body: 'Build trust through responsible and transparent action.',
    icon: 'integrity',
  },
  {
    id: 'inclusion',
    title: 'Inclusion',
    body: 'Create opportunities where more people can participate and succeed.',
    icon: 'inclusion',
  },
  {
    id: 'compassion',
    title: 'Compassion',
    body: 'Keep people at the center of how we work.',
    icon: 'compassion',
  },
  {
    id: 'excellence',
    title: 'Excellence',
    body: 'Deliver thoughtful, reliable workforce experiences.',
    icon: 'excellence',
  },
  {
    id: 'impact',
    title: 'Impact',
    body: 'Create outcomes that strengthen businesses and communities.',
    icon: 'impact',
  },
] as const;

export const ABOUT_CLOSE_HEADLINE_LEAD = 'Stronger Workforces Start';
export const ABOUT_CLOSE_HEADLINE_ACCENT = 'with Stronger Partnerships.';
export const ABOUT_CLOSE_LEAD =
  'See how BlueRise can support your business and your workforce.';
export const ABOUT_CLOSE_CTA = 'Talk to Our Team';
export const ABOUT_CLOSE_HREF = '/contact';

export const ABOUT_SEO_TITLE = 'About Us';
export const ABOUT_SEO_DESCRIPTION =
  'BlueRise helps businesses manage and support their workforce while creating better experiences for the people who make business possible.';
