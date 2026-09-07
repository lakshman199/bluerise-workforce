/**
 * Benefits page copy. BlueRise is a coordination layer, not a carrier. Categories are
 * platform concepts, not active plans.
 */

export const BENEFITS_EYEBROW = 'Benefits';

export const BENEFITS_HEADLINE = 'Benefits information, coordinated in one place.';

export const BENEFITS_INTRO =
  'Access to benefits information is part of dignity, financial security, and workforce stability. BlueRise Workforce is designed to coordinate that experience—not to underwrite coverage or sell insurance.';

export const BENEFITS_WHY_TITLE = 'Why benefits matter';
export const BENEFITS_WHY_BODY =
  'Benefits support people, families, and long-term career stability. When coverage information is scattered across carriers and portals, the workforce experience breaks down. BlueRise is designed to keep benefits information with employment, pay, and support.';

export const BENEFITS_EXPERIENCE_TITLE =
  'The benefits experience BlueRise is designed to provide';
export const BENEFITS_EXPERIENCE: readonly { title: string; body: string }[] = [
  {
    title: 'One place to look',
    body: 'Employees should be able to see benefits information alongside employment, pay, and hours—not only inside a carrier portal.',
  },
  {
    title: 'Coordinated, not issued here',
    body: 'BlueRise coordinates workforce benefits information. It is not an insurance carrier and does not publish plan pricing or coverage guarantees on this site.',
  },
  {
    title: 'Family and household context',
    body: 'Benefits often cover more than the employee. The platform is designed to keep that household context with the rest of the workforce record.',
  },
] as const;

export const BENEFITS_SUPPORT_TITLE = 'Employee and family support';
export const BENEFITS_SUPPORT_BODY =
  'Workforce stability depends on more than a job title. Coordinated benefits information, employee support, and career stability belong in the same experience.';

export const BENEFITS_CONNECT_TITLE = 'How benefits connect with BlueRise';
export const BENEFITS_CONNECT_BODY =
  'BlueRise is the coordination layer between employers, employees, and the specialist providers that may administer benefits. Specific carriers, brokers, and plans are not listed here because those connections are not presented as live on this site.';

export const BENEFITS_CATEGORIES_TITLE =
  'Benefit categories the platform is designed to coordinate';
export const BENEFITS_CATEGORIES_NOTE =
  'These categories are platform concepts—not active plans, enrollments, or guaranteed coverage.';
export const BENEFITS_CATEGORIES: readonly string[] = [
  'Medical',
  'Dental',
  'Vision',
  'Life',
  'Disability',
  'Retirement',
  'Other workforce benefits',
] as const;

export const BENEFITS_CTA_TITLE = 'Ask about coordinated benefits information';
export const BENEFITS_CTA_BODY =
  'If you want to talk about how benefits information can sit with the rest of the workforce experience, reach BlueRise Workforce.';
export const BENEFITS_PRIMARY_CTA = 'Contact Us';
export const BENEFITS_PRIMARY_HREF = '/contact';
export const BENEFITS_SECONDARY_CTA = 'Explore Our Solutions';
export const BENEFITS_SECONDARY_HREF = '/our-solutions';

export const BENEFITS_SEO_TITLE = 'Benefits';
export const BENEFITS_SEO_DESCRIPTION =
  'BlueRise Workforce coordinates employee benefits information as part of a unified workforce experience. It is not an insurance carrier and does not list live plans on this site.';
