# BlueRise Workforce — Sitemap

Three route groups live in `apps/web`, each lazy-loaded. Public navigation labels follow
the approved content-site terminology. Development destinations are not part of the
public header.

## Public website

Indexed, anonymous, server-cacheable.

Primary navigation: **Home · About Us · Employers · Job Seekers · Our Solutions ·
Benefits · Resources · Contact Us**. Desktop navigation is shown from 1280px; below that
the same items are in the mobile menu.

| Route                  | Nav label     | Phase | Purpose                                                                                                            |
| ---------------------- | ------------- | ----- | ------------------------------------------------------------------------------------------------------------------ |
| `/`                    | Home          | 2     | Hero, purpose, about / mission / vision, inclusion, community impact, a future built together, values, closing CTA |
| `/about`               | About Us      | 2     | Mission, vision, Talent Meets Purpose                                                                              |
| `/inclusion`           | —             | 2     | Inclusion commitment and supported workforce pathways. Not in the public header.                                   |
| `/employers`           | Employers     | 2     | Workforce operations for organizations: onboarding through pay, benefits, time, and support                        |
| `/job-seekers`         | Job Seekers   | 2     | Meaningful employment, development, training, inclusive pathways. No live job board yet.                           |
| `/our-solutions`       | Our Solutions | 2     | Coordinated platform: payroll, benefits, HR, timekeeping, workers’ compensation                                    |
| `/benefits`            | Benefits      | 2     | Benefits as a coordination layer, not a carrier                                                                    |
| `/resources`           | Resources     | 2     | Guides and reference material index                                                                                |
| `/contact`             | Contact Us    | 2     | Contact form, persisted server-side                                                                                |
| `/legal/privacy`       | —             | 2     | Placeholder pending legal copy. Not in the header until copy exists.                                               |
| `/legal/terms`         | —             | 2     | Placeholder pending legal copy. Not in the header until copy exists.                                               |
| `/legal/accessibility` | —             | 2     | Conformance target and contact route. Not in the header until copy exists.                                         |
| `/login`               | —             | 3     | Entry to Portal and Admin. Not in the public header.                                                               |
| `/design-system`       | —             | 1     | Token and component gallery, `noindex`. Not in the public header.                                                  |
| `/**`                  | —             | 1     | 404                                                                                                                |

Legal routes, `/inclusion`, and Login are not primary public navigation. `/inclusion` is
a full public page, linked from Home and About Us. Resources and Contact remain
skeletons until those pages are written.

## BlueRise Portal

Authenticated. `noindex`. Employee-facing first; employer-administrator views arrive
later in Phase 4 behind the `EMPLOYER_ADMIN` and `EMPLOYER_MANAGER` roles.

| Route                            | Page                                                                                                                     | Phase |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----- |
| `/portal`                        | Redirect to dashboard                                                                                                    | 4     |
| `/portal/dashboard`              | Employment status, onboarding progress, next payday, recent pay, hours, benefits status, actions required, notifications | 4     |
| `/portal/profile`                | Personal details, contact information, emergency contacts                                                                | 4     |
| `/portal/onboarding`             | Task checklist and progress                                                                                              | 4     |
| `/portal/payroll`                | Payroll overview and provider sync status                                                                                | 4     |
| `/portal/payroll/paystubs`       | Pay statement list and detail                                                                                            | 4     |
| `/portal/payroll/tax-documents`  | W-2 and other tax documents                                                                                              | 4     |
| `/portal/payroll/direct-deposit` | Direct deposit accounts and allocation                                                                                   | 4     |
| `/portal/benefits`               | Available plans, enrollments, coverage, dependents                                                                       | 4     |
| `/portal/time`                   | Time entries, timesheets, submissions                                                                                    | 4     |
| `/portal/documents`              | Employment documents and acknowledgements                                                                                | 4     |
| `/portal/hr-support`             | HR cases and support requests                                                                                            | 4     |
| `/portal/workers-comp`           | Policy information, incident reporting, claim references                                                                 | 4     |
| `/portal/settings`               | Security, sessions and devices, notification preferences                                                                 | 4     |

## BlueRise Admin

Authenticated, elevated roles only. `noindex`.

| Route                  | Page                                                   | Phase |
| ---------------------- | ------------------------------------------------------ | ----- |
| `/admin`               | Redirect to dashboard                                  | 5     |
| `/admin/dashboard`     | Operational overview across tenants                    | 5     |
| `/admin/organizations` | Tenants and locations                                  | 5     |
| `/admin/employees`     | Employee records across tenants                        | 5     |
| `/admin/employers`     | Employer administrator accounts                        | 5     |
| `/admin/onboarding`    | Onboarding pipelines and stalled tasks                 | 5     |
| `/admin/payroll`       | Payroll integration state                              | 5/6   |
| `/admin/benefits`      | Plan catalogue and enrollment oversight                | 5/6   |
| `/admin/hr-compliance` | Requirements, expirations, acknowledgement gaps        | 5     |
| `/admin/timekeeping`   | Timekeeping integration state and sync records         | 5/6   |
| `/admin/workers-comp`  | Policies and incidents                                 | 5     |
| `/admin/documents`     | Document oversight and retention                       | 5     |
| `/admin/support`       | HR and support case queue                              | 5     |
| `/admin/integrations`  | Provider registry, credential references, sync history | 6     |
| `/admin/audit-logs`    | Append-only audit trail                                | 5     |
| `/admin/users`         | User accounts and session revocation                   | 5     |
| `/admin/roles`         | Roles and permission assignment                        | 5     |
| `/admin/settings`      | Platform settings                                      | 5     |
| `/admin/system-status` | Health, migration state, provider reachability         | 5     |

## Indexing rules

`/portal/**` and `/admin/**` are excluded in `robots.txt`, carry
`<meta name="robots" content="noindex, nofollow">`, and are omitted from `sitemap.xml`.
`/design-system` is `noindex` but reachable, because it is a developer reference rather
than a private surface.
