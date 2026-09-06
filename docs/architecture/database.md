# BlueRise Workforce — Database Model

PostgreSQL 16, accessed through TypeORM. Every schema change ships as an explicit
migration. `synchronize` is `false` in every environment including tests, and there is no
configuration path that can turn it on.

## Conventions

- **Identifiers.** `uuid` primary keys, generated with `gen_random_uuid()` from `pgcrypto`.
  UUIDs keep identifiers non-enumerable across tenant boundaries, which matters for a
  multi-tenant system where an integer key leaks row counts and ordering.
- **Timestamps.** Every table carries `created_at timestamptz not null default now()` and
  `updated_at timestamptz not null default now()`. Tables whose rows must survive deletion
  for audit or statutory reasons also carry `deleted_at timestamptz null` and are queried
  through a soft-delete-aware repository.
- **Tenant scoping.** Every table holding customer data carries
  `organization_id uuid not null references organizations(id)`, indexed, and included as
  the leading column of composite indexes used by list queries. Tables that are genuinely
  global — `users`, `roles`, `permissions`, `integrations` (the catalogue, not the
  connections) — do not.
- **Naming.** `snake_case` tables and columns, plural table names, singular entity class
  names. Foreign keys are `<referenced_singular>_id`.
- **Money.** `numeric(12, 2)` with an explicit ISO-4217 `currency char(3)`. Never floating
  point.
- **Enumerations.** Postgres native enums for values that are part of the domain contract
  and change rarely (`employment_status`, `time_entry_source`); lookup tables for anything a
  customer can configure.
- **Sensitive fields.** Bank account numbers, routing numbers, and tax identifiers are
  never stored in plaintext columns. Where BlueRise must hold them, they are stored as a
  last-four display fragment plus an opaque provider token or an encrypted payload; the
  full value is not returned by any API. Where the provider can hold them instead,
  BlueRise stores only the provider's reference.

## Entity map

Grouped by owning module. Phase indicates when the table is created.

### Identity and access — Phase 3

| Entity | Key fields | Notes |
| --- | --- | --- |
| `User` | `email` (citext, unique), `password_hash`, `email_verified_at`, `status`, `last_login_at` | Global; a user may hold roles in more than one organization |
| `Role` | `key` (unique), `name`, `description`, `is_system` | Seeded set, see authentication.md |
| `Permission` | `key` (unique, `resource:action`), `description` | Seeded |
| `RolePermission` | `role_id`, `permission_id` | Composite primary key |
| `UserRole` | `user_id`, `role_id`, `organization_id` (nullable) | Null organization means a platform-wide role |
| `RefreshToken` | `user_id`, `token_hash`, `family_id`, `expires_at`, `revoked_at`, `replaced_by_id`, `user_agent`, `ip_hash` | Rotation and reuse detection |
| `PasswordResetToken` | `user_id`, `token_hash`, `expires_at`, `used_at` | Single use |
| `EmailVerificationToken` | `user_id`, `token_hash`, `expires_at`, `used_at` | Single use |

### Tenancy — Phase 3

| Entity | Key fields | Notes |
| --- | --- | --- |
| `Organization` | `name`, `legal_name`, `slug` (unique), `status`, `timezone` | The tenant root |
| `OrganizationLocation` | `organization_id`, `name`, `address_*`, `timezone`, `is_primary` | Worksites |

### Workforce — Phase 4

| Entity | Key fields | Notes |
| --- | --- | --- |
| `Employee` | `organization_id`, `user_id` (nullable), `employee_number`, `status` | Nullable user: a person can exist as an employee record before claiming a login |
| `EmployeeProfile` | `employee_id`, `first_name`, `last_name`, `preferred_name`, `pronouns`, `phone`, `address_*`, `date_of_birth` | PII-heavy; not returned in list endpoints |
| `Employment` | `employee_id`, `organization_location_id`, `job_title`, `employment_type`, `started_on`, `ended_on`, `is_primary` | One row per employment period |
| `EmergencyContact` | `employee_id`, `name`, `relationship`, `phone`, `email` | |
| `EmployeeDocument` | `organization_id`, `employee_id`, `category`, `storage_key`, `content_type`, `byte_size`, `checksum`, `expires_at`, `uploaded_by_user_id` | Object storage holds the file; the row holds the reference |
| `OnboardingTask` | `organization_id`, `employee_id`, `key`, `title`, `status`, `due_on`, `completed_at`, `sequence` | |

### Payroll — Phase 4, integration Phase 6

| Entity | Key fields | Notes |
| --- | --- | --- |
| `PayrollProfile` | `organization_id`, `employee_id`, `provider_employee_ref`, `pay_type`, `base_rate`, `currency` | The link to the provider's employee |
| `PaySchedule` | `organization_id`, `frequency`, `anchor_date`, `name` | |
| `PayPeriod` | `pay_schedule_id`, `starts_on`, `ends_on`, `pay_date`, `status` | |
| `PayStatement` | `organization_id`, `employee_id`, `pay_period_id`, `gross`, `net`, `currency`, `provider_ref`, `issued_at` | Totals only; line detail below |
| `Deduction` | `pay_statement_id`, `code`, `label`, `amount`, `is_pre_tax` | |
| `TaxWithholding` | `pay_statement_id`, `jurisdiction`, `code`, `label`, `amount` | |
| `TaxDocument` | `organization_id`, `employee_id`, `tax_year`, `form_type`, `storage_key`, `provider_ref`, `available_at` | W-2 and equivalents |
| `DirectDepositAccount` | `organization_id`, `employee_id`, `account_type`, `last_four`, `provider_token`, `allocation_type`, `allocation_value`, `priority`, `verified_at` | Full account and routing numbers are never stored |
| `PayrollProviderConnection` | `organization_id`, `provider_key`, `status`, `credential_ref`, `connected_at`, `last_sync_at` | |

### Benefits — Phase 4, integration Phase 6

| Entity | Key fields |
| --- | --- |
| `BenefitCategory` | `key`, `label`, `sequence` (global catalogue: medical, dental, vision, life, disability, retirement, other) |
| `BenefitPlan` | `organization_id`, `benefit_category_id`, `name`, `carrier_name`, `plan_year`, `provider_ref`, `summary_document_key` |
| `EnrollmentPeriod` | `organization_id`, `name`, `type`, `opens_on`, `closes_on`, `plan_year` |
| `BenefitEnrollment` | `organization_id`, `employee_id`, `benefit_plan_id`, `enrollment_period_id`, `status`, `coverage_tier`, `effective_on`, `ended_on`, `employee_cost`, `employer_cost` |
| `Dependent` | `organization_id`, `employee_id`, `first_name`, `last_name`, `relationship`, `date_of_birth` |
| `Coverage` | `benefit_enrollment_id`, `dependent_id` (nullable), `covers_employee`, `effective_on`, `ended_on` |

### Timekeeping — Phase 4, integration Phase 6

| Entity | Key fields | Notes |
| --- | --- | --- |
| `Shift` | `organization_id`, `organization_location_id`, `employee_id` (nullable), `starts_at`, `ends_at`, `role_label`, `status` | Nullable employee = open shift |
| `TimeEntry` | `organization_id`, `employee_id`, `shift_id` (nullable), `clock_in_at`, `clock_out_at`, `source`, `provider_ref`, `location_ref` | `source` distinguishes POS, clock, manual, import |
| `Break` | `time_entry_id`, `started_at`, `ended_at`, `is_paid` | |
| `Timesheet` | `organization_id`, `employee_id`, `pay_period_id`, `status`, `total_minutes`, `overtime_minutes` | |
| `TimesheetApproval` | `timesheet_id`, `approver_user_id`, `decision`, `decided_at`, `note` | Append-only decision history |

All timekeeping instants are stored as `timestamptz`. The location's IANA timezone
determines what "a day" means for overtime and daily totals; wall-clock arithmetic is done
in the location's zone, never the server's.

### HR and compliance — Phase 4

| Entity | Key fields |
| --- | --- |
| `Policy` | `organization_id`, `key`, `title`, `version`, `document_key`, `effective_on`, `requires_acknowledgement` |
| `PolicyAcknowledgement` | `organization_id`, `employee_id`, `policy_id`, `policy_version`, `acknowledged_at`, `ip_hash` |
| `ComplianceRequirement` | `organization_id`, `key`, `title`, `applies_to`, `cadence`, `grace_days` |
| `ComplianceRecord` | `organization_id`, `employee_id`, `compliance_requirement_id`, `status`, `satisfied_at`, `expires_at`, `document_id` |
| `HRCase` | `organization_id`, `employee_id`, `category`, `subject`, `status`, `priority`, `assigned_user_id`, `opened_at`, `closed_at` |
| `HRCaseMessage` | `hr_case_id`, `author_user_id`, `body`, `is_internal`, `created_at` |

### Workers' compensation — Phase 4

| Entity | Key fields |
| --- | --- |
| `WorkersCompPolicy` | `organization_id`, `carrier_name`, `policy_number_last_four`, `provider_ref`, `effective_on`, `expires_on`, `status` |
| `WorkersCompIncident` | `organization_id`, `employee_id`, `occurred_at`, `reported_at`, `location_ref`, `description`, `status`, `claim_ref`, `reported_by_user_id` |

Claim adjudication, benefit determination, and any other insurance decision happen at the
carrier. BlueRise stores references and status supplied by the carrier and never computes
them.

### Integrations — Phase 6

| Entity | Key fields | Notes |
| --- | --- | --- |
| `Integration` | `key`, `category`, `display_name`, `is_available` | Global catalogue of supported providers |
| `IntegrationConnection` | `organization_id`, `integration_id`, `status`, `credential_ref`, `settings`, `connected_at` | One tenant's connection |
| `IntegrationCredentialReference` | `integration_connection_id`, `secret_manager_key`, `rotated_at` | Points at a secret manager; secret values are never in Postgres |
| `IntegrationSync` | `integration_connection_id`, `direction`, `started_at`, `finished_at`, `status`, `records_processed`, `error_summary` | |
| `WebhookEvent` | `integration_id`, `organization_id` (nullable), `provider_event_id`, `event_type`, `signature_verified`, `payload_hash`, `received_at`, `processed_at`, `status`, `attempts` | `(integration_id, provider_event_id)` unique — this is the idempotency key |

### Platform — Phases 2 and 5

| Entity | Key fields |
| --- | --- |
| `ContactSubmission` | `first_name`, `last_name`, `email`, `phone`, `subject`, `message`, `consented_at`, `source_ip_hash`, `user_agent`, `status` |
| `Notification` | `organization_id`, `user_id`, `type`, `title`, `body`, `link`, `read_at` |
| `AuditLog` | `organization_id` (nullable), `actor_user_id` (nullable), `action`, `resource_type`, `resource_id`, `before`, `after`, `request_id`, `ip_hash`, `created_at` |

`AuditLog` is append-only. No update or delete path exists in application code, and the
application database role is granted `INSERT` and `SELECT` on it but not `UPDATE` or
`DELETE`.

## Indexing

Baseline indexes created alongside each table:

- `organization_id` on every tenant-scoped table.
- Composite `(organization_id, <primary list sort column>)` for anything with a paginated
  list view — for example `(organization_id, created_at desc)` on `hr_cases`, and
  `(organization_id, employee_id, clock_in_at desc)` on `time_entries`.
- Unique constraints scoped by tenant, not globally: `unique (organization_id,
  employee_number)`, not `unique (employee_number)`.
- Partial indexes for soft-deleted tables: `where deleted_at is null`.
- `(integration_id, provider_event_id)` unique on `webhook_events`.

## Migrations

Migrations live in `apps/api/src/database/migrations` and are named
`<timestamp>-<description>.ts`. They are generated with TypeORM's CLI and then reviewed by
hand; generated output is never committed unreviewed, because TypeORM will happily emit a
destructive `DROP COLUMN` for a rename.

Every migration implements both `up` and `down`. A migration that cannot be reversed
safely — a data-destroying change — must say so in a comment and implement `down` as an
explicit throw rather than silently doing nothing.

Migrations run as a deliberate step (`npm run migration:run -w @bluerise/api`) and, in
containerised environments, from the API image's entrypoint before the server accepts
traffic. The health endpoint reports whether any migrations are pending, so a partially
deployed schema is visible rather than latent.

## Phase 1 state

The Phase 1 migration establishes the `pgcrypto` extension only. No domain tables are
created yet, because no Phase 1 feature stores domain data; the tables above arrive with
the phases that own them. This keeps the schema honest — every table in the database is a
table something actually reads. The migration pipeline itself is fully wired and verified,
which is what Phase 1 needs to prove.
