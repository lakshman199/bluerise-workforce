/**
 * Industries We Serve copy. Categories are general workforce contexts for small and
 * growing businesses—not customers, market share, certifications, or live integrations.
 */

export const INDUSTRIES_EYEBROW = 'Industries we serve';

export const INDUSTRIES_HEADLINE = 'Workforce support for small and growing businesses.';

export const INDUSTRIES_INTRO =
  'BlueRise Workforce is designed for organizations that need a coordinated place to run workforce operations after someone is hired. The work looks different from one business to another. The need is the same: employment records, pay, benefits, hours, and support should stay in one experience.';

export const INDUSTRIES_CONTEXTS_TITLE = 'Kinds of work BlueRise can support';

export const INDUSTRIES_CONTEXTS_LEAD =
  'These categories are examples of workforce settings, not a customer list and not a claim that BlueRise already operates specialized products in each area.';

export interface IndustryContext {
  title: string;
  body: string;
}

export const INDUSTRIES_CONTEXTS: readonly IndustryContext[] = [
  {
    title: 'Professional Services',
    body: 'Office, client-site, and mixed teams still need employment records, pay, hours, and support to stay coordinated after hiring.',
  },
  {
    title: 'Retail',
    body: 'Store and operations teams keep daily work moving. BlueRise is designed to support the workforce operations that follow hiring.',
  },
  {
    title: 'Hospitality',
    body: 'Guest-facing and operations teams often work in shifts. Coordinated workforce records can help keep people, hours, and support together.',
  },
  {
    title: 'Healthcare & Care Services',
    body: 'Care work depends on people being supported after they are hired. BlueRise is designed as a workforce platform, not a clinical system.',
  },
  {
    title: 'Field Services',
    body: 'Teams who work on sites, routes, or at client locations still need one place for employment, hours, and support.',
  },
  {
    title: 'Small Business Operations',
    body: 'Owners and managers who run day-to-day operations need workforce administration that stays in one experience as the business grows.',
  },
] as const;

export const INDUSTRIES_EXAMPLES_TITLE = 'Workforce examples';

export const INDUSTRIES_EXAMPLES_LEAD =
  'These photographs are examples of small-business work. They are not a ranking of industries, and no pictured workplace is presented as a customer or as BlueRise’s primary focus.';

export const INDUSTRIES_EXAMPLE_INDUSTRIAL = 'Industrial & frontline teams';
export const INDUSTRIES_EXAMPLE_AUTOMOTIVE = 'Automotive & skilled services';
export const INDUSTRIES_EXAMPLE_TRADES = 'Skilled trades & small business';
export const INDUSTRIES_EXAMPLE_FRONTLINE = 'Frontline retail work';

export const INDUSTRIES_NOTE_TITLE = 'What this page is—and is not';

export const INDUSTRIES_NOTE_BODY =
  'BlueRise can serve different types of small and growing businesses. This page does not present customers, integrations, market share, certifications, or industry-specific capabilities that have not been confirmed. If you are exploring workforce operations, we can talk about whether the platform is a fit.';

export const INDUSTRIES_CTA_TITLE = 'Talk about workforce operations';

export const INDUSTRIES_CTA_BODY =
  'Ask how BlueRise is designed to support your team, or review the coordinated solution areas.';

export const INDUSTRIES_PRIMARY_CTA = 'Contact Us';
export const INDUSTRIES_PRIMARY_HREF = '/contact';
export const INDUSTRIES_SECONDARY_CTA = 'Explore Our Solutions';
export const INDUSTRIES_SECONDARY_HREF = '/our-solutions';

export const INDUSTRIES_SEO_TITLE = 'Industries We Serve';
export const INDUSTRIES_SEO_DESCRIPTION =
  'BlueRise Workforce is designed for small and growing businesses across different kinds of work, coordinating employment, payroll, benefits, hours, and employee support in one experience.';
