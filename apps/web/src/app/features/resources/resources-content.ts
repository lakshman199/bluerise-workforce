export const RESOURCES_EYEBROW = 'Resources';

export const RESOURCES_HEADLINE = 'Guides and reference material, when they are ready.';

export const RESOURCES_INTRO =
  'This page collects the resource areas BlueRise Workforce intends to support. Published articles, downloadable guides, and news stories are not listed here yet.';

export const RESOURCES_AVAILABILITY =
  'Resources will be added as programs and materials become available.';

export interface ResourceCategory {
  title: string;
  body: string;
}

export const RESOURCES_CATEGORIES_TITLE = 'Resource areas';
export const RESOURCES_CATEGORIES_LEAD =
  'These are informational categories, not a catalogue of published pieces.';

export const RESOURCES_CATEGORIES: readonly ResourceCategory[] = [
  {
    title: 'Career Resources',
    body: 'Intended material to help people understand career development, stability, and the path after hiring.',
  },
  {
    title: 'Training Programs',
    body: 'A place for job-readiness, skills development, and vocational training information when those materials exist.',
  },
  {
    title: 'Workforce Development',
    body: 'Reference for initiatives that connect people with meaningful employment and long-term opportunity.',
  },
  {
    title: 'Employer Resources',
    body: 'Guidance for organizations coordinating onboarding, pay, benefits, hours, and employee support.',
  },
  {
    title: 'News & Insights',
    body: 'A future home for updates from BlueRise Workforce. No news stories are published on this page yet.',
  },
] as const;

export const RESOURCES_AUDIENCE_TITLE = 'Who these resources are for';
export const RESOURCES_AUDIENCE_LEAD =
  'When materials are added, they will be written for the same people BlueRise already serves.';

export const RESOURCES_AUDIENCES: readonly ResourceCategory[] = [
  {
    title: 'Employers',
    body: 'Organizations looking for coordinated workforce operations and inclusive employment pathways.',
  },
  {
    title: 'Job seekers',
    body: 'People looking for meaningful work, career development, training, and ongoing support.',
  },
  {
    title: 'Community partners',
    body: 'Educators, families, and organizations that help expand accessible employment pathways.',
  },
] as const;

export const RESOURCES_THEMES_TITLE = 'Workforce development and training themes';
export const RESOURCES_THEMES_LEAD =
  'These themes already shape BlueRise Workforce. They are listed here so later materials have a clear home — not as proof that a library exists today.';

export const RESOURCES_THEMES: readonly string[] = [
  'Meaningful employment',
  'Career development and stability',
  'Training and job readiness',
  'Inclusive employment pathways',
  'Employer workforce operations',
  'Coordinated benefits information',
] as const;

export const RESOURCES_CTA_TITLE = 'Ask about a resource area';
export const RESOURCES_CTA_BODY =
  'If you want to talk about career resources, training, or employer materials, reach BlueRise Workforce.';
export const RESOURCES_PRIMARY_CTA = 'Contact Us';
export const RESOURCES_PRIMARY_HREF = '/contact';
export const RESOURCES_SECONDARY_CTA = 'Explore Our Solutions';
export const RESOURCES_SECONDARY_HREF = '/our-solutions';

export const RESOURCES_SEO_TITLE = 'Resources';
export const RESOURCES_SEO_DESCRIPTION =
  'BlueRise Workforce resource areas for career support, training, workforce development, employers, and future insights. Published materials will be added as they become available.';
