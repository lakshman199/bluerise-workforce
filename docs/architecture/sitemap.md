# BlueRise Workforce — Sitemap

Three route groups live in `apps/web`, each lazy-loaded. Only the Phase 1 routes exist
today; the rest are the planned information architecture and are listed here so routing,
navigation, and permissions can be designed against a stable target.

## Public website

Indexed, anonymous, server-cacheable.

| Route | Page | Phase | Purpose |
| --- | --- | --- | --- |
| `/` | Home | 2 | Brand, platform overview, purpose, employer and employee value, inclusion, community impact, values, closing CTA |
| `/about` | About | 2 | Mission, vision, purpose, values |
| `/employers` | For Employers | 2 | Workforce operations for businesses |
| `/employees` | For Employees | 2 | One place for pay, benefits, hours, documents |
| `/benefits` | Benefits | 2 | Benefit categories and how coordination works |
| `/workforce-solutions` | Workforce Solutions | 2 | The platform modules as a service offering |
| `/inclusion` | Inclusion | 2 | Special-needs and neurodiverse workforce initiative |
| `/resources` | Resources | 2 | Guides and reference material index |
| `/contact` | Contact | 2 | Contact form, persisted server-side |
| `/legal/privacy` | Privacy Policy | 2 | Placeholder pending legal copy |
| `/legal/terms` | Terms of Service | 2 | Placeholder pending legal copy |
| `/legal/accessibility` | Accessibility Statement | 2 | Conformance target and contact route |
| `/login` | Login | 3 | Entry to Portal and Admin |
| `/design-system` | Design system reference | 1 | Token and component gallery, `noindex` |
| `/**` | Not found | 1 | 404 |

Primary calls to action: **Get Started**, **Explore Benefits**, **Contact BlueRise**.
Secondary: **For Employers**, **For Employees**, **Learn More**.

Navigation carries nine items plus Login. That is at the upper limit of what a single
desktop bar holds comfortably, so Resources and Inclusion collapse into an "About" group on
tablet widths rather than wrapping to a second line.

## BlueRise Portal

Authenticated. `noindex`. Employee-facing first; employer-administrator views arrive later
in Phase 4 behind the `EMPLOYER_ADMIN` and `EMPLOYER_MANAGER` roles.

| Route | Page | Phase |
| --- | --- | --- |
| `/portal` | Redirect to dashboard | 4 |
| `/portal/dashboard` | Employment status, onboarding progress, next payday, recent pay, hours, benefits status, actions required, notifications | 4 |
| `/portal/profile` | Personal details, contact information, emergency contacts | 4 |
| `/portal/onboarding` | Task checklist and progress | 4 |
| `/portal/payroll` | Payroll overview and provider sync status | 4 |
| `/portal/payroll/paystubs` | Pay statement list and detail | 4 |
| `/portal/payroll/tax-documents` | W-2 and other tax documents | 4 |
| `/portal/payroll/direct-deposit` | Direct deposit accounts and allocation | 4 |
| `/portal/benefits` | Available plans, enrollments, coverage, dependents | 4 |
| `/portal/time` | Time entries, timesheets, submissions | 4 |
| `/portal/documents` | Employment documents and acknowledgements | 4 |
| `/portal/hr-support` | HR cases and support requests | 4 |
| `/portal/workers-comp` | Policy information, incident reporting, claim references | 4 |
| `/portal/settings` | Security, sessions and devices, notification preferences | 4 |

## BlueRise Admin

Authenticated, elevated roles only. `noindex`.

| Route | Page | Phase |
| --- | --- | --- |
| `/admin` | Redirect to dashboard | 5 |
| `/admin/dashboard` | Operational overview across tenants | 5 |
| `/admin/organizations` | Tenants and locations | 5 |
| `/admin/employees` | Employee records across tenants | 5 |
| `/admin/employers` | Employer administrator accounts | 5 |
| `/admin/onboarding` | Onboarding pipelines and stalled tasks | 5 |
| `/admin/payroll` | Payroll integration state | 5/6 |
| `/admin/benefits` | Plan catalogue and enrollment oversight | 5/6 |
| `/admin/hr-compliance` | Requirements, expirations, acknowledgement gaps | 5 |
| `/admin/timekeeping` | Timekeeping integration state and sync records | 5/6 |
| `/admin/workers-comp` | Policies and incidents | 5 |
| `/admin/documents` | Document oversight and retention | 5 |
| `/admin/support` | HR and support case queue | 5 |
| `/admin/integrations` | Provider registry, credential references, sync history | 6 |
| `/admin/audit-logs` | Append-only audit trail | 5 |
| `/admin/users` | User accounts and session revocation | 5 |
| `/admin/roles` | Roles and permission assignment | 5 |
| `/admin/settings` | Platform settings | 5 |
| `/admin/system-status` | Health, migration state, provider reachability | 5 |

## Indexing rules

`/portal/**` and `/admin/**` are excluded in `robots.txt`, carry `<meta name="robots"
content="noindex, nofollow">`, and are omitted from `sitemap.xml`. `/design-system` is
`noindex` but reachable, because it is a developer reference rather than a private surface.
