# Migration Policy

## Rules

1. **`synchronize` is never enabled.** Not in development, not in tests, not behind a
   flag. The data source sets it to `false` as a literal, so there is no environment
   variable that can turn it on by accident.
2. **Every schema change is a migration.** Including in development. A schema that only
   exists on one machine is a deployment failure waiting to happen.
3. **Generated migrations are reviewed by hand before committing.** TypeORM infers
   intent from a schema diff, and a column rename looks identical to a drop plus an add.
   Read every generated file.
4. **`up` and `down` are both implemented.** If a change genuinely cannot be reversed
   without data loss, `down` throws with an explanation rather than silently succeeding.
5. **Migrations are idempotent where the SQL allows it** —
   `CREATE EXTENSION IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS` — so a partially
   applied migration can be re-run.
6. **Data migrations are separate from schema migrations.** A large backfill in the same
   transaction as a DDL change holds locks for the duration of the backfill.
7. **Additive first for anything that runs against live data.** Add a nullable column,
   backfill, then add the constraint in a later migration. A single migration that adds
   a `NOT NULL` column to a populated table locks it and fails.

## Commands

Run from the repository root:

```bash
npm run migration:run    -w @bluerise/api   # apply pending migrations
npm run migration:revert -w @bluerise/api   # revert the most recent migration
npm run migration:show   -w @bluerise/api   # list applied and pending
npm run migration:create -w @bluerise/api -- src/database/migrations/AddEmployees
npm run migration:generate -w @bluerise/api -- src/database/migrations/AddEmployees
```

`migration:create` produces an empty migration for hand-written SQL.
`migration:generate` diffs entities against the live database — it requires the database
to be running and up to date.

## Naming

`<unix-millis>-<PascalCaseDescription>.ts`, which is what the TypeORM CLI produces. The
timestamp determines execution order, so never renumber a migration that has run
anywhere.

## Deployment

The API container's entrypoint runs pending migrations before starting the server, so an
instance never serves traffic against a schema it does not expect. With more than one
instance starting at once, Postgres advisory locking inside TypeORM's migration runner
serialises them; the losers wait and then find nothing pending.

`GET /api/v1/health/ready` reports the pending migration count and returns 503 while any
remain, so a rollout that failed to migrate is visible to the orchestrator rather than
silently serving errors.

## Testing

The test database is created and migrated by the same migration files, never by
`synchronize`. If a migration is wrong, the tests fail — which is the point.
