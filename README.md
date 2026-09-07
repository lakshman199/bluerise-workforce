# BlueRise Workforce

**Building Stronger Workforces. Creating Brighter Futures.**

A modular workforce platform connecting employers, employees, administrators, and the
specialist providers that handle payroll, benefits, HR and compliance, timekeeping, and
workers' compensation.

> **Current state: Phase 1 of 7 (Foundation) is complete.** The monorepo, both
> applications, the database with its migration pipeline, the container setup, the
> tooling, the health endpoint, and the design system all work end to end. The public
> website is Phase 2, authentication Phase 3, the employee Portal Phase 4, Admin
> Phase 5. No external provider is connected, and nothing in the product presents
> fabricated data as live. The full plan is in
> [`docs/architecture/system-overview.md`](docs/architecture/system-overview.md).

## Requirements

| Tool       | Version   | Why                                                                         |
| ---------- | --------- | --------------------------------------------------------------------------- |
| Node.js    | ≥ 22.22.3 | Angular 22's floor                                                          |
| npm        | ≥ 12      | Below this, workspace peer resolution crashes on the Angular test toolchain |
| PostgreSQL | 16        | Or use Docker, below                                                        |
| Docker     | Optional  | Only needed for the container workflow                                      |

```bash
node --version   # v22.22.3 or newer
npm --version    # 12 or newer
```

If your Node is older, `nvm install 22 && nvm use 22` is enough. If your npm is older,
`npm install -g npm@latest`.

## Getting started from a clean machine

### With Docker

```bash
git clone <repository-url> bluerise-workforce
cd bluerise-workforce
cp .env.example .env
docker compose up --build
```

That brings up PostgreSQL, applies migrations, and starts both applications:

- Web — http://localhost:4310
- API — http://localhost:4300/api/v1/health
- OpenAPI — http://localhost:4300/api/docs

### Without Docker

```bash
git clone <repository-url> bluerise-workforce
cd bluerise-workforce
npm install
cp .env.example .env
```

Create the database and role, matching the `DATABASE_URL` in your `.env`:

```bash
createuser bluerise --createdb --pwprompt   # password: bluerise_dev_password
createdb bluerise_dev --owner bluerise
createdb bluerise_test --owner bluerise
```

Build the shared packages, apply migrations, then start both applications:

```bash
npm run build:packages
npm run migration:run
npm run dev
```

`npm run dev` runs the API and the web application together with prefixed output. To run
one at a time, use `npm run dev:api` or `npm run dev:web`.

Open http://localhost:4310. The home page fetches `/api/v1/health` and shows the real
response, so if the status card reads "Unreachable" the API is not running or the
database is not up — the card says which.

## What is in here

```
apps/
  api/          NestJS 12 API. Config, logging, security, versioning, OpenAPI, TypeORM, health.
  web/          Angular 22 application. Shell, routing, SEO, design system reference.
packages/
  shared-config/  Shared tsconfig base, runtime constants, log redaction list.
  shared-types/   API envelope, error shape, health contracts. Used by both applications.
  ui/             Design tokens and SCSS. No framework dependency.
infrastructure/
  docker/       Dockerfiles, entrypoint, nginx configuration.
docs/
  architecture/ System overview, sitemap, database model, authentication, design system, ADRs.
  api/          API conventions and the module plan.
  database/     Migration policy.
  integrations/ One document per provider category.
```

## Commands

Run from the repository root.

| Command                                   | What it does                                               |
| ----------------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                             | API and web together                                       |
| `npm run dev:api` / `npm run dev:web`     | One at a time                                              |
| `npm run build`                           | Build packages, API, and web                               |
| `npm run build:packages`                  | Build the shared packages only                             |
| `npm test`                                | Every workspace's tests                                    |
| `npm run lint` / `npm run lint:fix`       | ESLint across the monorepo                                 |
| `npm run format` / `npm run format:check` | Prettier                                                   |
| `npm run typecheck`                       | TypeScript across every workspace                          |
| `npm run verify`                          | Everything above, in the order a CI pipeline should run it |
| `npm run migration:run`                   | Apply pending migrations                                   |
| `npm run migration:show`                  | List applied and pending migrations                        |

Creating a migration:

```bash
npm run migration:create -w @bluerise/api -- src/database/migrations/AddEmployees
```

`synchronize` is off in every environment, including tests. Every schema change is a
reviewed migration — see [`docs/database/migrations.md`](docs/database/migrations.md).

## Routes today

| Route                  | What it is                                                                  |
| ---------------------- | --------------------------------------------------------------------------- |
| `/`                    | Platform overview, live API status, architecture, and the delivery roadmap  |
| `/design-system`       | Token and component reference, rendered from `packages/ui`                  |
| `/api/v1/health`       | Full health report with dependency and migration detail                     |
| `/api/v1/health/live`  | Liveness — never touches the database                                       |
| `/api/v1/health/ready` | Readiness — 503 while the database is unreachable or a migration is pending |
| `/api/docs`            | OpenAPI document, development and test only                                 |

## Architecture in one paragraph

Three surfaces — public website, Portal, Admin — share one design system and one API.
Nothing in the application talks to a vendor SDK: a controller calls a BlueRise domain
service, the service depends on a provider interface written in BlueRise's own
vocabulary, and an adapter translates that interface to one vendor. Moving a customer
from Gusto to ADP is a configuration change and one new adapter. Every row belonging to
a customer carries an organization identifier, and tenant scoping is enforced in the API
and again at the data layer, never in the browser. The reasoning, including the
decisions that were considered and rejected, is in
[`docs/architecture/`](docs/architecture/).

## Security and honesty notes

- Passwords, tokens, bank details, tax identifiers, and dates of birth are on a central
  redaction list that every log sink shares. See
  [`packages/shared-config/src/redaction.ts`](packages/shared-config/src/redaction.ts).
- BlueRise Workforce does not hold SOC 2, ISO 27001, HIPAA, PCI, or GDPR certification,
  and nothing in this product claims otherwise. The architecture is built so those
  audits are achievable; no badge or compliance statement appears anywhere.
- No provider credentials exist, so no integration exists. Mock adapters, when they
  arrive, are named `Mock*`, are selected only by explicit configuration, and log a
  warning at startup. There is no path where a real adapter that fails to configure is
  silently replaced by a mock.
- No company address, phone number, social account, statistic, or customer name has been
  invented. Where a real value is not available, the UI omits the section rather than
  filling it with a placeholder.
- The contact form (Phase 2) will persist submissions and will not send email until a
  mail provider is configured, and will not present a CAPTCHA until a real provider is
  configured. A decorative CAPTCHA is not security.

## Contributing

Before opening a change, run `npm run verify`. It runs formatting, linting, type
checking, and tests across every workspace — the same set a pipeline should run.
