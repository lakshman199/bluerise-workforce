# BlueRise Workforce — System Overview

Status: Phase 1 (Foundation) implemented. Phases 2–7 planned.

## 1. What BlueRise Workforce is

BlueRise Workforce is a modular workforce platform. It sits between the organizations
that employ people and the specialist providers that handle payroll, benefits,
HR/compliance, timekeeping, and workers' compensation. Its job is to give an employer
one place to run workforce operations and to give a worker one place to see their
employment, pay, benefits, hours, and documents — without either party having to log
into five different vendor portals.

The product is not a staffing website and not a recruitment tool. Recruitment belongs to
a different company that shares the "BlueRise" name (see §9). The domain here is what
happens _after_ someone is hired: onboarding, employment records, pay, benefits,
compliance, hours, and support.

The brand position, taken from BlueRise Workforce's own content, is that employment
should deliver dignity, stability, opportunity, financial security, professional
development, inclusion, and long-term growth. That commitment includes an explicit
workforce inclusion initiative for individuals with special needs and neurodiverse
individuals. The product surface has to feel like enterprise workforce technology while
keeping that human-centred message intact.

## 2. Surfaces

Three applications share one design system and one API.

| Surface         | Audience                                                          | Auth                     | Indexed |
| --------------- | ----------------------------------------------------------------- | ------------------------ | ------- |
| Public website  | Prospective employers, workers, partners, community organizations | Anonymous                | Yes     |
| BlueRise Portal | Employees, later employer administrators                          | Required                 | No      |
| BlueRise Admin  | BlueRise internal operations                                      | Required, elevated roles | No      |

Phase 1 ships the shared foundation all three depend on. The public website is Phase 2,
authentication Phase 3, Portal Phase 4, Admin Phase 5.

## 3. System architecture

```
                          BLUERISE WORKFORCE
                                   |
              +--------------------+--------------------+
              |                    |                    |
      Public website        BlueRise Portal       BlueRise Admin
        (Angular)             (Angular)             (Angular)
              |                    |                    |
              +--------------------+--------------------+
                                   |
                        BLUERISE API  (NestJS, /api/v1)
                                   |
   +-------------+-----------------+-----------------+---------------+
   |             |                 |                 |               |
 Domain      Domain            Domain            Domain          Domain
 services    services          services          services        services
   |             |                 |                 |               |
PayrollService BenefitsService  HrComplianceSvc  TimekeepingSvc  WorkersCompSvc
   |             |                 |                 |               |
Provider     Provider           Provider          Provider        Provider
interface    interface          interface         interface       interface
   |             |                 |                 |               |
 +-+--+        +-+--+            +-+-+            +-+--+          +-+--+
 |    |        |    |            |   |            |    |          |    |
Gusto ADP   Broker Carrier     HR platform      POS  Clock     Carrier Broker

                          PostgreSQL (TypeORM, migrations)
```

Two rules hold this together.

**The rest of the application never talks to a vendor SDK.** A controller calls
`PayrollService`; `PayrollService` calls a `PayrollProvider` interface; a concrete
adapter (`GustoPayrollProvider`, `AdpPayrollProvider`, `MockPayrollProvider`) implements
it and translates between the vendor's shapes and BlueRise domain DTOs. Swapping Gusto
for ADP is a configuration change and one new adapter, not a refactor.

**Every persisted row that belongs to a customer carries `organizationId`, and tenant
scoping is enforced server-side.** Never in the UI, never by trusting a client-supplied
identifier.

## 4. Repository structure

```
bluerise-workforce/
  apps/
    web/                  Angular 22 application (public site, later portal + admin)
    api/                  NestJS 12 API
  packages/
    shared-types/         Domain enums, DTO contracts, API envelope shared by web + api
    shared-config/        Shared tsconfig/eslint/prettier bases and runtime constants
    ui/                   Design tokens and SCSS foundation consumed by the web app
  infrastructure/
    docker/               Dockerfiles and container entrypoints
    deployment/           Deployment notes and environment templates
  docs/
    architecture/         This document, sitemap, database, authentication, design system
    api/                  API conventions and module plan
    database/             Migration policy and conventions
    integrations/         One document per provider category
  .env.example
  docker-compose.yml
  README.md
```

`apps/web` will host all three Angular surfaces as lazy-loaded route groups (`/`,
`/portal`, `/admin`) rather than three separate applications. They share a design
system, an HTTP layer, an auth state, and a build; splitting them into separate
deployables buys isolation we do not need yet and triples the build surface. If Admin
later needs to deploy on its own cadence or behind a different network boundary, the
route group extracts into `apps/admin` without touching domain code, because nothing in
the route group owns business logic. This is recorded as ADR-0003.

## 5. Technology decisions

| Layer           | Choice                                                                                  | Note                                                           |
| --------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Frontend        | Angular 22, standalone components, signals, lazy routes                                 | Per specification                                              |
| Styling         | SCSS with CSS custom-property design tokens                                             | No utility framework; tokens in `packages/ui`                  |
| Backend         | NestJS 12, REST, OpenAPI via Swagger                                                    | Per specification                                              |
| Database        | PostgreSQL 16 with TypeORM and explicit migrations                                      | `synchronize` is never enabled, in any environment             |
| Validation      | `class-validator` / `class-transformer` on DTOs, global `ValidationPipe` with whitelist | Unknown properties are rejected, not silently dropped          |
| Logging         | `nestjs-pino` structured JSON with per-request IDs and PII redaction                    | See §7                                                         |
| Auth            | JWT access tokens plus rotating refresh tokens, Argon2id password hashing               | Phase 3; design in `authentication.md`                         |
| Package manager | npm workspaces                                                                          | Flat hoisting keeps Angular and Nest toolchains happy          |
| Containers      | Docker and Docker Compose                                                               | Compose brings up Postgres, API, and web for local development |

## 6. Backend module architecture

Each module owns its controllers, services, DTOs, entities, and (where relevant)
provider interfaces and adapters. Modules never import another module's repository
directly; they go through the owning module's exported service.

| Module                | Phase | Responsibility                                                      |
| --------------------- | ----- | ------------------------------------------------------------------- |
| `ConfigModule`        | 1     | Typed, validated environment configuration                          |
| `LoggerModule`        | 1     | Structured logging, request IDs, redaction                          |
| `DatabaseModule`      | 1     | TypeORM data source, migration runner wiring                        |
| `HealthModule`        | 1     | Liveness and readiness, database and migration status               |
| `ContactModule`       | 2     | Public contact submissions, persisted                               |
| `AuthModule`          | 3     | Login, logout, refresh rotation, password reset, email verification |
| `UsersModule`         | 3     | User records, credentials, sessions and devices                     |
| `RbacModule`          | 3     | Roles, permissions, guards, decorators                              |
| `OrganizationsModule` | 3     | Tenants, locations, tenant-scoping guard                            |
| `EmployeesModule`     | 4     | Employee, profile, employment, emergency contacts                   |
| `OnboardingModule`    | 4     | Onboarding tasks and progress                                       |
| `DocumentsModule`     | 4     | Employee documents, upload validation, retention                    |
| `PayrollModule`       | 4/6   | Pay statements, tax documents, direct deposit; `PayrollProvider`    |
| `BenefitsModule`      | 4/6   | Plans, enrollments, dependents; `BenefitsProvider`                  |
| `TimekeepingModule`   | 4/6   | Time entries, shifts, timesheets, approvals; `TimekeepingProvider`  |
| `HrComplianceModule`  | 4/6   | Policies, acknowledgements, requirements, HR cases                  |
| `WorkersCompModule`   | 4/6   | Policies, incidents, claim references; `WorkersCompProvider`        |
| `IntegrationsModule`  | 6     | Provider registry, credential references, sync records              |
| `WebhooksModule`      | 6     | Signature verification, idempotency, event log                      |
| `AdminModule`         | 5     | Administrative operations across tenants                            |
| `AuditModule`         | 5     | Append-only audit log                                               |
| `NotificationsModule` | 4     | In-app notifications                                                |

## 7. Cross-cutting concerns

**Request identity.** Every request receives an `x-request-id` (accepted from the caller
when present, generated otherwise). It appears in every log line and in every error
response body so a user-reported failure can be traced to exact log entries.

**Error envelope.** A single global exception filter emits:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["email must be an email"],
  "requestId": "01JB...",
  "timestamp": "2026-09-06T21:14:03.221Z",
  "path": "/api/v1/contact"
}
```

Internal messages and stack traces are never included when `APP_ENV` is `production`;
unexpected errors become a generic 500 with the request ID as the only correlation
handle.

**PII-safe logging.** The logger redacts `password`, `passwordConfirmation`,
`currentPassword`, `newPassword`, `token`, `accessToken`, `refreshToken`,
`authorization`, `cookie`, `ssn`, `taxId`, `accountNumber`, `routingNumber`,
`dateOfBirth`, and any header named `authorization` or `cookie`. Redaction is configured
centrally so a new route cannot accidentally opt out.

**Security defaults.** Helmet security headers, an explicit CORS allowlist read from
configuration (never `*` outside development), global rate limiting with tighter limits
on authentication routes, a body-size cap, and `ValidationPipe` with `whitelist` and
`forbidNonWhitelisted` enabled.

**Compliance claims.** BlueRise Workforce does not currently hold SOC 2, ISO 27001,
HIPAA, PCI, or GDPR certification, and nothing in this product claims otherwise. The
architecture is built so those audits are achievable — audit logging, tenant isolation,
data minimisation, encryption in transit — but no badge, seal, or compliance statement
appears anywhere in the UI or the marketing copy. The reference site `bluerise.io`
displays SOC 2 and ISO badges; those belong to a different company and were deliberately
not carried over.

## 8. Development phases

| Phase | Scope                                                                                          | Status                       |
| ----- | ---------------------------------------------------------------------------------------------- | ---------------------------- |
| 0     | Analysis, architecture, sitemaps, entity map, integration plan                                 | Complete — this document set |
| 1     | Monorepo, Angular app, NestJS app, PostgreSQL, Docker, tooling, health endpoint, design system | Complete                     |
| 2     | Public website: header, footer, all public pages, contact form, responsive system, SEO         | Next                         |
| 3     | Authentication: users, roles, login, refresh rotation, guards, password reset                  | Planned                      |
| 4     | Employee portal shell and modules                                                              | Planned                      |
| 5     | Admin application                                                                              | Planned                      |
| 6     | Provider integrations, starting from interfaces and mock adapters                              | Blocked on credentials       |
| 7     | Hardening: security, accessibility, performance, E2E, observability, deployment                | Planned                      |

## 9. Assumptions and unresolved dependencies

Recorded rather than silently decided. Items marked **needs a decision** should be
confirmed before the phase that depends on them.

1. **Two different BlueRise companies.** `bluerise.io` is an AI recruitment product;
   `bluerise.testdemo.tech` is BlueRise Workforce. Per the specification, the former
   supplies visual inspiration only and the latter supplies all content. No recruitment
   concepts, statistics, customer quotes, pricing, or compliance badges were carried
   over.
2. **Tagline wording.** The content site reads "Building Stronger Workforce. Creating
   Brighter Futures." (singular). The specification reads "Workforces" (plural) in two
   places. The plural form is used, since the specification is the controlling document
   for anything it states directly. **Needs a decision** if the singular is intentional.
3. **No real company facts exist yet.** No address, phone number, founding date,
   employee count, customer count, social media accounts, or leadership names were
   available from either reference. None have been invented, and no placeholder contact
   details appear in the UI. The footer will omit these groups until real values are
   supplied.
4. **No provider credentials.** Gusto, ADP, benefits carriers/brokers, HR platforms, POS
   and time-clock vendors, and workers' compensation carriers are all unavailable. Phase
   6 cannot begin. Phases 4–5 will run against mock adapters that are explicitly named
   `Mock*`, registered only when configuration selects them, and which log a warning at
   startup so mock behaviour can never be mistaken for a live integration.
5. **No mail provider.** The contact form (Phase 2) persists to the database and does
   not send email. Wiring a transactional mail provider is deferred until one is
   configured.
6. **No CAPTCHA provider.** The reference content site uses a trivial text CAPTCHA. That
   is not real protection and was not reproduced. The contact endpoint will rely on rate
   limiting and a honeypot field until a real provider (Turnstile, reCAPTCHA Enterprise,
   hCaptcha) and its keys are supplied.
7. **Tenant model granularity.** The hierarchy is assumed to be
   `Organization → OrganizationLocation → Employee`, with a worker belonging to exactly
   one organization at a time. Staffing arrangements where one person holds concurrent
   employments across two client organizations are **not** modelled yet. **Needs a
   decision** before Phase 4, because it changes the `Employment` entity's cardinality.
8. **Authoritative system for employee records.** Whether BlueRise or the payroll
   provider owns the canonical employee record determines sync direction and conflict
   resolution. The current design treats BlueRise as authoritative for identity and
   employment, and the provider as authoritative for pay calculation results. **Needs a
   decision** before Phase 6.
9. **Data residency and retention.** No jurisdiction, residency requirement, or
   retention schedule has been specified. Tax documents and workers' compensation
   records typically carry multi-year statutory retention. **Needs a decision** before
   Phase 4.
10. **Languages.** The header is built language-ready (the reference site offers a
    language switcher) but only English content exists. No translation infrastructure is
    installed in Phase 1; adding `@angular/localize` later does not require
    restructuring.
11. **The public site's hosting target.** Vercel is permitted for the frontend. The
    Angular app is built as a static bundle with no server-side rendering in Phase 1,
    which keeps that option open. If SEO requirements later demand SSR, Angular SSR can
    be added without changing component code. **Needs a decision** before Phase 2
    completes.
12. **A prior prototype was removed.** Before this specification arrived, the repository
    briefly contained an unrelated Next.js scheduling prototype built from the project
    name alone. It conflicted with the mandated stack and was removed in the same commit
    that established this monorepo. It remains in git history at `8f667e0` if any of its
    timekeeping domain modelling is worth revisiting during Phase 4. See ADR-0001.
