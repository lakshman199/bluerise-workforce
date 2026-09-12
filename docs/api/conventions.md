# API Conventions

Base path `/api/v1`. OpenAPI document at `/api/docs` (JSON at `/api/docs-json`), served
outside production.

## Versioning

URI versioning via NestJS's `VersioningType.URI`. A breaking change to a resource
produces `/api/v2/<resource>` while v1 continues to serve. Additive changes — a new
optional field, a new endpoint — do not bump the version. Removing a field, renaming
one, changing a type, or tightening validation does.

## Responses

Single resource:

```json
{ "data": { "id": "…", "…": "…" } }
```

Collection:

```json
{
  "data": [ … ],
  "meta": { "page": 1, "pageSize": 25, "totalItems": 137, "totalPages": 6 }
}
```

Wrapping single resources costs one level of nesting and buys the ability to add `meta`
to any response later without breaking clients.

## Pagination, filtering, sorting

`?page=1&pageSize=25` with `pageSize` capped at 100. Cursor pagination is used instead
for endpoints over provider data, where offset paging is either unsupported or unstable.

Sorting: `?sort=createdAt:desc,lastName:asc`. Only fields on an endpoint's allowlist are
accepted; anything else is a 400 rather than a silently ignored parameter, because a
silently ignored sort produces wrong-looking data with no error.

Filtering: explicit named query parameters per endpoint (`?status=active&locationId=…`),
declared as a DTO and validated. No generic query language — a generic filter parameter
over a multi-tenant database is a data-leak surface.

## Errors

Every error response, from every layer:

```json
{
  "statusCode": 422,
  "error": "Unprocessable Entity",
  "message": ["email must be an email"],
  "requestId": "01JB6Z8Q9K2M4N6P8R0T2V4X6Z",
  "timestamp": "2026-09-06T21:14:03.221Z",
  "path": "/api/v1/contact"
}
```

`message` is always an array of strings. Callers can render it directly without type
checking.

Status codes: 400 malformed, 401 unauthenticated, 403 authenticated but not permitted,
404 absent _or_ not visible to this tenant, 409 conflict, 422 semantically invalid, 429
rate limited, 502 provider failure, 503 dependency unavailable.

404 rather than 403 for another tenant's resource is deliberate. A 403 confirms the
resource exists, which is a cross-tenant information leak.

In production, unexpected 500s carry a generic message and the request ID only. Stack
traces and internal messages are logged, never serialised to a client.

## Request identity

`x-request-id` is honoured if supplied and otherwise generated. It is echoed on every
response, included in every error body, and attached to every log line for that request.

## Validation

Global `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`,
`transform: true`. Unknown properties are rejected rather than stripped: silently
dropping a misspelled field means a client believes it set something it did not.

## Health

`GET /api/v1/health` — liveness and readiness with dependency detail.
`GET /api/v1/health/live` — process liveness only, for container probes.
`GET /api/v1/health/ready` — readiness, including database connectivity and pending
migration count. Returns 503 when not ready, so an orchestrator will not route traffic
to an instance whose schema is behind.

## Module endpoint plan

| Prefix                       | Phase |
| ---------------------------- | ----- |
| `/api/v1/health`             | 1     |
| `/api/v1/contact`            | 2     |
| `/api/v1/support/tickets`    | 2     |
| `/api/v1/auth`               | 3     |
| `/api/v1/users`              | 3     |
| `/api/v1/organizations`      | 3     |
| `/api/v1/employees`          | 4     |
| `/api/v1/onboarding`         | 4     |
| `/api/v1/documents`          | 4     |
| `/api/v1/payroll`            | 4     |
| `/api/v1/benefits`           | 4     |
| `/api/v1/timekeeping`        | 4     |
| `/api/v1/hr`                 | 4     |
| `/api/v1/compliance`         | 4     |
| `/api/v1/workers-comp`       | 4     |
| `/api/v1/notifications`      | 4     |
| `/api/v1/admin`              | 5     |
| `/api/v1/integrations`       | 6     |
| `/api/v1/webhooks/:provider` | 6     |
