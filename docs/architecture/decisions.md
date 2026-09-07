# Architecture Decision Records

## ADR-0001 — Remove the pre-specification Next.js prototype

**Status:** Accepted. **Date:** 2026-09-06.

**Context.** Before the master specification was available, the repository was given
only a project name. A Next.js 16 scheduling and timesheet prototype was built from that
name alone. The specification then arrived and mandates Angular 22 on the frontend and
NestJS on the backend, in a monorepo, with PostgreSQL and TypeORM.

**Decision.** The prototype was removed rather than migrated or kept alongside the new
structure.

**Rationale.** It shared no runtime, build system, or dependency tree with the mandated
stack, so keeping it would have meant maintaining two toolchains for code that
implements none of the specified requirements. Section 44 of the specification makes it
the controlling document for architecture. Its domain modelling of shifts and timesheets
was reasonable and is reflected in the timekeeping entity design, but the code itself
had no path forward.

**Consequences.** The prototype remains in git history at commit `8f667e0` and can be
read if any of its timekeeping logic is worth revisiting in Phase 4. No production
functionality was lost, because none existed.

---

## ADR-0002 — npm workspaces rather than pnpm or Nx

**Status:** Accepted. **Date:** 2026-09-06.

**Context.** The monorepo hosts an Angular application, a NestJS application, and three
shared packages.

**Decision.** npm workspaces, with each package building through its own toolchain.

**Rationale.** npm workspaces hoist flat, which both the Angular CLI and the Nest CLI
expect without configuration; pnpm's strict, symlinked layout regularly needs
`shamefully-hoist` or per-tool workarounds for exactly these two toolchains. Nx would
add real value at a larger scale — affected-project graphs, distributed caching — but it
also adds a layer that has to be understood before anything can be built, and the
specification asks for a maintainable structure rather than a sophisticated one. Task
orchestration is currently four npm scripts.

**Consequences.** No build caching or affected-graph analysis. If CI times become a
problem as phases land, Nx or Turborepo can be adopted later; both sit on top of
workspaces without requiring the packages themselves to change.

---

## ADR-0003 — One Angular application hosting three surfaces

**Status:** Accepted. **Date:** 2026-09-06.

**Context.** The specification describes three surfaces: the public website, BlueRise
Portal, and BlueRise Admin.

**Decision.** One Angular application in `apps/web`, with `/`, `/portal`, and `/admin`
as separately lazy-loaded route groups.

**Rationale.** The three surfaces share a design system, an HTTP layer, an
authentication state, an error-handling strategy, and a build pipeline. Three
applications would triple the build and dependency surface to gain isolation that lazy
loading already provides — Portal and Admin code is not downloaded by an anonymous
visitor. Deployment isolation is a real argument for splitting, but it is not needed
yet.

**Consequences.** All three surfaces deploy together. If Admin later needs an
independent release cadence or a different network boundary, the route group extracts
into `apps/admin`; this stays cheap as long as route groups hold no business logic,
which is enforced by keeping domain logic in services and the shared packages.

---

## ADR-0004 — No domain tables in the Phase 1 migration

**Status:** Accepted. **Date:** 2026-09-06.

**Context.** Phase 1 requires PostgreSQL and a migration pipeline. The full entity map
spans roughly forty tables across Phases 3 to 6.

**Decision.** The Phase 1 migration enables the `pgcrypto` extension and creates no
domain tables. Each table is created by the migration belonging to the phase that first
reads or writes it.

**Rationale.** A schema full of tables no code touches cannot be validated, drifts from
the design as later phases refine it, and makes it impossible to tell which parts of the
system are real. Creating tables alongside the code that uses them keeps every migration
reviewable against working behaviour. What Phase 1 must prove is that the migration
pipeline works end to end, and a one-statement migration proves that as well as forty
tables would.

**Consequences.** The database is nearly empty after Phase 1. The health endpoint
reports migration state so the pipeline is observable regardless.

---

## ADR-0005 — Design tokens as CSS custom properties in a framework-free package

**Status:** Accepted. **Date:** 2026-09-06.

**Context.** The specification requires a reusable design system with tokens rather than
scattered values, shared across three surfaces.

**Decision.** `packages/ui` ships SCSS and CSS custom properties with no framework
dependency. Angular components that consume the tokens live in `apps/web` until a second
Angular application exists.

**Rationale.** Custom properties are inspectable at runtime, overridable per surface or
per component subtree, and usable from SCSS, inline styles, and eventually a non-Angular
consumer. Publishing an Angular component library from day one would mean an ngPackagr
build step, a second Angular version constraint to keep in sync, and a package to
release — all before there is a second consumer to justify it.

**Consequences.** Component markup is currently duplicated only within one application,
so there is nothing to diverge. When Admin is extracted, the components move to
`packages/ui` as an Angular entry point alongside the existing style entry point.

---

## ADR-0006 — Mock provider adapters are explicit and never automatic

**Status:** Accepted. **Date:** 2026-09-06.

**Context.** No external provider credentials exist, so Phases 4 and 5 must run against
something.

**Decision.** Mock adapters are selected only by explicit configuration, are named
`Mock*`, and log a warning at startup naming themselves and the category they stand in
for. There is no fallback path where a real adapter that fails to configure is silently
replaced by a mock.

**Rationale.** A fallback would make a misconfigured production deployment look healthy
while serving fabricated payroll data. The failure mode of refusing to start is loud and
recoverable; the failure mode of a silent mock is a worker reading a pay statement that
does not exist.

**Consequences.** A misconfigured environment fails at startup with a clear message
rather than degrading. This is intended.
