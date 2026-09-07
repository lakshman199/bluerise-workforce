export interface PlatformModule {
  name: string;
  summary: string;
  capabilities: readonly string[];
  phase: string;
}

/**
 * The six workforce services BlueRise coordinates.
 *
 * Each card states the phase it lands in, so nothing here reads as available when it is
 * not. Descriptions cover platform responsibilities only — no provider is named as
 * connected, because none is.
 */
export const PLATFORM_MODULES: readonly PlatformModule[] = [
  {
    name: 'Payroll',
    summary:
      'Pay statements, tax documents, and direct deposit brought together from whichever payroll system an employer already uses.',
    capabilities: ['Pay history', 'Tax documents', 'Direct deposit', 'Provider sync'],
    phase: 'Phase 4',
  },
  {
    name: 'Benefits',
    summary:
      'Available and enrolled coverage, dependents, and enrollment periods, coordinated with brokers and carriers.',
    capabilities: ['Plan catalogue', 'Enrollment', 'Dependents', 'Coverage'],
    phase: 'Phase 4',
  },
  {
    name: 'HR & Compliance',
    summary:
      'Employee records, policies and acknowledgements, required documents, and expiry tracking in one auditable place.',
    capabilities: ['Policies', 'Acknowledgements', 'Requirements', 'HR cases'],
    phase: 'Phase 4',
  },
  {
    name: 'Timekeeping',
    summary:
      'Hours received from point-of-sale systems, time clocks, and scheduling tools, normalised into one set of records.',
    capabilities: ['Time entries', 'Shifts', 'Timesheets', 'Approvals'],
    phase: 'Phase 4',
  },
  {
    name: "Workers' Compensation",
    summary:
      'Policy information, incident reporting, and claim references, routed to the carrier that adjudicates them.',
    capabilities: ['Policy details', 'Incident reports', 'Claim status', 'Documents'],
    phase: 'Phase 4',
  },
  {
    name: 'Employee Support',
    summary:
      'One place for a worker to see their employment, ask a question, and find the document they were asked for.',
    capabilities: ['Profile', 'Onboarding', 'Documents', 'Support requests'],
    phase: 'Phase 4',
  },
] as const;

export interface DeliveryPhase {
  id: string;
  name: string;
  scope: string;
  status: 'complete' | 'current' | 'planned' | 'blocked';
  statusLabel: string;
}

export const DELIVERY_PHASES: readonly DeliveryPhase[] = [
  {
    id: '0',
    name: 'Analysis',
    scope:
      'Architecture, sitemaps, database entity map, API plan, integration plan, and recorded assumptions.',
    status: 'complete',
    statusLabel: 'Complete',
  },
  {
    id: '1',
    name: 'Foundation',
    scope:
      'Monorepo, Angular and NestJS applications, PostgreSQL with migrations, Docker, tooling, health endpoint, and this design system.',
    status: 'complete',
    statusLabel: 'Complete',
  },
  {
    id: '2',
    name: 'Public website',
    scope:
      'Home, about, employers, employees, benefits, workforce solutions, inclusion, resources, contact, and the legal pages.',
    status: 'current',
    statusLabel: 'Next',
  },
  {
    id: '3',
    name: 'Authentication',
    scope:
      'Users, roles and permissions, login, refresh-token rotation, guards, and password reset.',
    status: 'planned',
    statusLabel: 'Planned',
  },
  {
    id: '4',
    name: 'Employee portal',
    scope:
      'Portal shell and dashboard, then profile, onboarding, documents, payroll, benefits, timekeeping, HR, and workers’ compensation.',
    status: 'planned',
    statusLabel: 'Planned',
  },
  {
    id: '5',
    name: 'Admin',
    scope:
      'Administrator shell, organizations, employees, onboarding, integrations, support, compliance, audit logs, and roles.',
    status: 'planned',
    statusLabel: 'Planned',
  },
  {
    id: '6',
    name: 'Integrations',
    scope:
      'Provider interfaces and mock adapters first, then real adapters once API specifications and credentials exist.',
    status: 'blocked',
    statusLabel: 'Awaiting credentials',
  },
  {
    id: '7',
    name: 'Hardening',
    scope:
      'Security review, accessibility and responsive testing, performance, end-to-end coverage, observability, and deployment.',
    status: 'planned',
    statusLabel: 'Planned',
  },
] as const;
