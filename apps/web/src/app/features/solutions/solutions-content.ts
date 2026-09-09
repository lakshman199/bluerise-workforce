/**
 * Our Solutions copy. Describes the coordinated platform without naming live vendors,
 * internal adapters, or delivery phases.
 */

export const SOLUTIONS_EYEBROW = 'Our Solutions';

export const SOLUTIONS_HEADLINE = 'One coordinated workforce experience.';

export const SOLUTIONS_INTRO =
  'BlueRise Workforce sits between the organizations that employ people and the specialist providers that handle payroll, benefits, HR and compliance, timekeeping, and workers’ compensation. The platform is designed to give each audience one place to work.';

export const SOLUTIONS_OVERVIEW_TITLE = 'A unified platform, not five vendor portals';
export const SOLUTIONS_OVERVIEW_BODY =
  'BlueRise provides one coordinated workforce experience. Specialist providers may still perform the underlying services. The point is that employers and workers should not have to log into a different system for every part of employment.';

export const SOLUTIONS_FLOW_LABEL = 'How the workforce experience is organized';
export const SOLUTIONS_FLOW: readonly string[] = [
  'Employers and the people they employ',
  'BlueRise Workforce',
  'Payroll · Benefits · HR & Compliance · Timekeeping · Workers’ Compensation',
  'Specialist provider integrations',
] as const;

export interface SolutionModule {
  title: string;
  body: string;
}

export const SOLUTIONS_MODULES_TITLE = 'Solution areas';
export const SOLUTIONS_MODULES_LEAD =
  'Each area is part of the coordinated experience. Underlying services may be performed by specialist providers.';

export const SOLUTIONS_MODULES: readonly SolutionModule[] = [
  {
    title: 'Payroll',
    body: 'Designed to coordinate pay information as part of the workforce record, connected to specialist payroll services.',
  },
  {
    title: 'Benefits',
    body: 'Coordinates benefits information and the employee experience around coverage—not as an insurance carrier.',
  },
  {
    title: 'HR & Compliance',
    body: 'Supports HR and compliance workflows, documents, and acknowledgements alongside employment records.',
  },
  {
    title: 'Timekeeping',
    body: 'Coordinates hours and time information with payroll and the rest of the workforce experience.',
  },
  {
    title: 'Workers’ Compensation',
    body: 'Coordinates workers’ compensation information as part of workforce operations.',
  },
  {
    title: 'Employee Support',
    body: 'Gives people one place to see employment, pay, benefits, hours, documents, and requests for help.',
  },
  {
    title: 'Workforce Management',
    body: 'Supports employers running day-to-day workforce operations from onboarding onward.',
  },
] as const;

export const SOLUTIONS_WORKPLACE_TITLE = 'Workforce administration, in context';
export const SOLUTIONS_WORKPLACE_LEAD =
  'Payroll and workforce administration are part of the work BlueRise is designed to support. Equipment shown is not a BlueRise product, and no pictured workplace is presented as a customer or live system.';
export const SOLUTIONS_WORKPLACE_OPERATIONS = 'Workforce operations';
export const SOLUTIONS_WORKPLACE_PAYROLL = 'Payroll administration';

export const SOLUTIONS_CONNECT_TITLE = 'How BlueRise connects services';
export const SOLUTIONS_CONNECT_BODY =
  'BlueRise is designed to connect workforce services into one experience. Specialist providers may remain responsible for the work they already do. No specific provider is presented here as a live connection.';

export const SOLUTIONS_AUDIENCE_TITLE =
  'Built for employers and for the people they employ';
export const SOLUTIONS_EMPLOYER_TITLE = 'Employer experience';
export const SOLUTIONS_EMPLOYER_BODY =
  'One place to run workforce operations: onboarding, records, payroll connectivity, benefits coordination, HR workflows, time, and workers’ compensation.';
export const SOLUTIONS_WORKER_TITLE = 'Employee experience';
export const SOLUTIONS_WORKER_BODY =
  'One place to see employment status, pay, benefits information, hours, documents, and support—without a separate login for every specialist system.';

export const SOLUTIONS_CTA_TITLE = 'Talk about the coordinated experience';
export const SOLUTIONS_CTA_BODY =
  'Ask how BlueRise can support your workforce, or read how benefits information is coordinated.';
export const SOLUTIONS_PRIMARY_CTA = 'Contact Us';
export const SOLUTIONS_PRIMARY_HREF = '/contact';
export const SOLUTIONS_SECONDARY_CTA = 'Explore Benefits';
export const SOLUTIONS_SECONDARY_HREF = '/benefits';

export const SOLUTIONS_SEO_TITLE = 'Our Solutions';
export const SOLUTIONS_SEO_DESCRIPTION =
  'BlueRise Workforce coordinates payroll, benefits, HR and compliance, timekeeping, workers’ compensation, employee support, and workforce management in one experience.';
