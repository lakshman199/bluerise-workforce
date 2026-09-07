/**
 * Employers page copy. Capabilities are described as designed/coordinated support,
 * not as live vendor integrations or guaranteed outcomes.
 */

export const EMPLOYERS_EYEBROW = 'For employers';

export const EMPLOYERS_HEADLINE = 'One place to run workforce operations.';

export const EMPLOYERS_INTRO =
  'BlueRise Workforce is designed to support organizations with a coordinated workforce experience—from onboarding through pay, benefits, hours, and employee support—so employers and the people they employ are not sent across disconnected systems.';

export const EMPLOYERS_CHALLENGES_EYEBROW = 'Workforce needs';
export const EMPLOYERS_CHALLENGES_TITLE = 'What employers need after someone is hired';
export const EMPLOYERS_CHALLENGES_LEAD =
  'Workforce operations rarely live in one place. BlueRise is designed to coordinate the work that follows hiring.';

export const EMPLOYERS_CHALLENGES: readonly string[] = [
  'A single place to manage workforce operations rather than a stack of disconnected portals',
  'Onboarding, employment records, and employee support that stay together',
  'Payroll, benefits, timekeeping, and workers’ compensation coordinated without making those the only systems people can use',
] as const;

export interface EmployerCapability {
  title: string;
  body: string;
}

export const EMPLOYERS_CAPABILITIES_EYEBROW = 'Workforce capabilities';
export const EMPLOYERS_CAPABILITIES_TITLE = 'How BlueRise can support your workforce';
export const EMPLOYERS_CAPABILITIES_LEAD =
  'These capabilities describe the coordinated experience BlueRise is designed to provide. Specialist providers may still perform underlying services.';

export const EMPLOYERS_CAPABILITIES: readonly EmployerCapability[] = [
  {
    title: 'Workforce management',
    body: 'Designed to support day-to-day workforce operations in one coordinated experience.',
  },
  {
    title: 'Employee onboarding',
    body: 'Enables onboarding tasks, records, and progress to live with the rest of employment.',
  },
  {
    title: 'Talent and workforce coordination',
    body: 'Coordinates the people, roles, and records employers need after hiring—without treating BlueRise as a recruitment marketplace.',
  },
  {
    title: 'Payroll connectivity',
    body: 'Connects workforce services so pay information can be coordinated alongside specialist payroll providers.',
  },
  {
    title: 'Benefits coordination',
    body: 'Coordinates benefits information as part of the workforce experience, not as an insurance carrier.',
  },
  {
    title: 'HR and compliance workflows',
    body: 'Supports HR and compliance workflows so documents, requirements, and acknowledgements can sit with employment records.',
  },
  {
    title: 'Timekeeping',
    body: 'Coordinates hours and time information with the rest of the workforce record.',
  },
  {
    title: 'Workers’ compensation',
    body: 'Coordinates workers’ compensation information as part of workforce operations.',
  },
  {
    title: 'Workforce inclusion',
    body: 'Supports inclusive employment pathways as a commitment, including for neurodiverse talent and individuals with special needs.',
  },
  {
    title: 'Employee support',
    body: 'Provides a unified experience so people can see employment, pay, benefits, hours, and documents in one place.',
  },
] as const;

export const EMPLOYERS_UNIFIED_EYEBROW = 'Unified workforce experience';
export const EMPLOYERS_UNIFIED_TITLE =
  'One experience for the organization and the people it employs';
export const EMPLOYERS_UNIFIED_EMPLOYER =
  'Employers get one place to run workforce operations instead of sending teams through separate payroll, benefits, HR, time, and claims portals.';
export const EMPLOYERS_UNIFIED_WORKER =
  'The people you employ get one place to see their employment, pay, benefits, hours, and documents.';

export const EMPLOYERS_INCLUSION_EYEBROW = 'Inclusion and workforce support';
export const EMPLOYERS_INCLUSION_TITLE =
  'Inclusion is part of how the workforce is supported';
export const EMPLOYERS_INCLUSION_BODY =
  'BlueRise Workforce treats inclusion as a commitment, not a program. That includes accessible employment pathways and support for neurodiverse talent and individuals with special needs.';

export const EMPLOYERS_CTA_TITLE = 'See how the platform comes together';
export const EMPLOYERS_CTA_BODY =
  'Review the coordinated solution areas, or reach the team to talk about workforce operations.';
export const EMPLOYERS_PRIMARY_CTA = 'Explore Our Solutions';
export const EMPLOYERS_PRIMARY_HREF = '/our-solutions';
export const EMPLOYERS_SECONDARY_CTA = 'Contact Us';
export const EMPLOYERS_SECONDARY_HREF = '/contact';

export const EMPLOYERS_SEO_TITLE = 'Employers';
export const EMPLOYERS_SEO_DESCRIPTION =
  'BlueRise Workforce is designed to support employers with coordinated onboarding, payroll connectivity, benefits, HR and compliance, timekeeping, workers’ compensation, and employee support.';
