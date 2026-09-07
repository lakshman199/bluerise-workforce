# Deployment

## Shape

Three deployable units:

| Unit     | Artifact                                                | Notes                                                                              |
| -------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Web      | Static bundle from `apps/web/dist/bluerise-web/browser` | No server-side rendering in Phase 1, so it can be served by any static host or CDN |
| API      | Node process from `apps/api/dist/main.js`               | Long-running, needs the database                                                   |
| Database | Managed PostgreSQL 16                                   | Backups and point-in-time recovery are the provider's responsibility               |

The web bundle uses a relative `/api/v1` base in production, so it and the API must be
same-origin behind a reverse proxy. That keeps the API hostname out of the JavaScript
bundle and removes the need for CORS in production entirely.
`infrastructure/docker/nginx.conf` is the reference proxy configuration.

If the frontend is hosted separately — Vercel, for example — set an explicit API origin
at build time and add that origin to `CORS_ALLOWED_ORIGINS` on the API. The API rejects
a wildcard origin outside development, so the allowlist must name the frontend exactly.

## Environment

Every variable is documented in `.env.example`. The API validates its whole environment
at boot and refuses to start on a bad value, so a misconfigured deployment fails loudly
at startup rather than at the first request that needs the missing setting.

Secrets — `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and every provider
credential — come from the platform's secret store, never from a file in the image and
never from the repository.

Two settings are deliberately not trustable from the environment in staging and
production: the OpenAPI document is forced off, and a wildcard CORS origin is rejected
by the schema.

## Migrations

The API image's entrypoint runs pending migrations before starting the server. Set
`RUN_MIGRATIONS_ON_START=false` to take that over from a separate job in a deployment
pipeline that prefers migrations as an explicit step.

`GET /api/v1/health/ready` returns 503 while any migration is pending, so a rollout that
failed to migrate is visible to the orchestrator instead of quietly serving errors.
Point the readiness probe at it and the liveness probe at `/api/v1/health/live`, which
never touches the database.

## Local development with containers

```bash
cp .env.example .env
docker compose up --build
```

- Web: http://localhost:4310
- API: http://localhost:4300/api/v1/health
- OpenAPI: http://localhost:4300/api/docs
- PostgreSQL: localhost:5432

Compose waits for the database's health check before starting the API, so the first boot
does not race the database's own initialisation.

## Without Docker

See the README. In short: PostgreSQL 16 running locally, `.env` filled in,
`npm run migration:run -w @bluerise/api`, then `npm run dev`.

## Production checklist

- `APP_ENV` is `production`, so stack traces are withheld from responses, the OpenAPI
  document is not served, and pretty logging is off.
- HTTPS terminates at the load balancer, and `trust proxy` is on so rate limiting keys
  on the real client address rather than the proxy's.
- `CORS_ALLOWED_ORIGINS` names exact origins.
- Both JWT secrets are set to independent 48-byte random values (Phase 3).
- Database connections use TLS: `DATABASE_SSL=true`.
- Logs are shipped as JSON to a collector; the redaction list in
  `packages/shared-config/src/redaction.ts` is what keeps credentials and PII out of
  them.
- Readiness and liveness probes are wired to the endpoints above.
- Database backups and restore have both been tested, not just configured.

## Not yet addressed

Phase 7 covers observability beyond structured logs — traces, metrics, error reporting —
and the deployment pipeline itself. No CI configuration is committed yet; the
`npm run verify` script is what a pipeline should run, and it covers formatting,
linting, type checking, and tests across every workspace.
