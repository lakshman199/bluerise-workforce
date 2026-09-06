# BlueRise Workforce — Authentication and Authorization

Design document. Implementation lands in Phase 3; nothing described here exists in the
Phase 1 codebase.

## Password storage

Argon2id, via the `argon2` package, with parameters recorded in configuration so they can
be raised over time: memory cost 19 MiB, time cost 2, parallelism 1 as the starting point
(OWASP's current baseline). The hash string embeds its own parameters, so raising them
later is a rehash-on-next-login, not a migration.

Passwords are never logged, never returned by any endpoint, never included in an error
message, and never accepted through a query string. A minimum length of 12 characters is
enforced with no composition rules and no forced rotation, and candidate passwords are
checked against a breached-password list. Composition rules and rotation both measurably
worsen real-world password quality.

## Tokens

**Access token.** JWT, 15-minute lifetime, signed HS256 with `JWT_ACCESS_SECRET`. Claims:
`sub` (user id), `sid` (session id), `roles`, `orgs` (organization ids the user holds a role
in), `iat`, `exp`, `iss`, `aud`. Carried in the `Authorization: Bearer` header. Never
persisted server-side — the point of a short-lived access token is that validating it costs
no database round trip.

**Refresh token.** Opaque 256-bit random value, 30-day lifetime, stored as a SHA-256 hash
in `refresh_tokens`. Delivered in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie scoped
to the refresh path so it is never readable by JavaScript and never sent with ordinary API
calls.

**Rotation and reuse detection.** Every refresh issues a new refresh token and marks the
presented one as replaced. All tokens descending from one login share a `family_id`. If a
token that has already been replaced is presented again, the entire family is revoked
immediately and the event is audited — that pattern means a token was captured and replayed,
and the correct response is to end every session it could reach, not just reject the one
request.

## Sessions and devices

Each login creates a session row keyed by `family_id`, recording user agent, a hashed IP,
creation time, and last-seen time. `/portal/settings` lists active sessions and allows
revoking any of them, including the current one. An administrator can revoke a user's
sessions from `/admin/users`. Revocation invalidates the refresh family immediately;
outstanding access tokens expire on their own within 15 minutes, which is the deliberate
trade-off for stateless validation. Operations that must take effect instantly — disabling
an account, removing a role — additionally check a session-validity cache on each request.

## Email verification and password reset

Both use single-use, time-limited, hashed tokens in dedicated tables. Reset tokens live 60
minutes; verification tokens live 24 hours. Using a token consumes it. Requesting a reset
for an address that does not exist returns exactly the same response and takes
approximately the same time as one that does, so the endpoint cannot be used to enumerate
accounts. Completing a password reset revokes every refresh family for that user.

Neither flow can be completed until a mail provider is configured; until then the endpoints
exist and persist their tokens, and the delivery step is a no-op adapter that logs at debug
level. This is stated in the API description rather than hidden.

## Brute-force protection

Global rate limiting applies to every route. Authentication routes carry a tighter limit,
keyed on both source IP and submitted email so that distributing an attack across addresses
does not evade it. After a threshold of consecutive failures a per-account lockout window
applies with exponential backoff. Lockout state is stored on the user record so it survives
a restart. Successful authentication clears the counter.

## Roles

Nine roles, seeded as system roles that cannot be deleted.

| Role | Scope | Intent |
| --- | --- | --- |
| `SUPER_ADMIN` | Platform | Full access including role and permission management |
| `BLUERISE_ADMIN` | Platform | BlueRise operations across all tenants |
| `HR_ADMIN` | Platform | HR and compliance across tenants |
| `PAYROLL_ADMIN` | Platform | Payroll configuration and integration oversight |
| `BENEFITS_ADMIN` | Platform | Benefit catalogue and enrollment oversight |
| `SUPPORT_AGENT` | Platform | Support cases; deliberately limited PII visibility |
| `EMPLOYER_ADMIN` | Organization | Full administration of one organization |
| `EMPLOYER_MANAGER` | Organization | Day-to-day management within one organization |
| `EMPLOYEE` | Organization | Access to one's own records only |

A `UserRole` row binds a user to a role, optionally within an organization. Platform roles
carry a null `organization_id`; organization roles must carry one.

## Permissions

Roles are collections of permissions, and guards check permissions rather than role names.
Permission keys are `resource:action` — `employee:read`, `employee:write`,
`payroll:read`, `payroll:admin`, `benefits:enroll`, `timesheet:approve`, `audit:read`, and
so on. Checking `payroll:read` instead of `role === 'PAYROLL_ADMIN'` means introducing a
tenth role later is a seed change rather than an audit of every guard in the codebase.

## Enforcement

Authorization is enforced in the API. The UI hides what a user cannot use, but hiding is a
usability affordance and never the control.

Three layers compose on every protected route:

1. **`JwtAuthGuard`** — validates the access token's signature, expiry, issuer, and
   audience, and loads the session.
2. **`PermissionsGuard`** — reads the `@RequirePermissions('payroll:read')` decorator on the
   handler and checks the user's effective permission set.
3. **`TenantGuard`** — resolves the target organization from the route and verifies the user
   holds a role in it. Platform roles pass; organization roles must match.

Beyond the guards, tenant scoping is enforced at the data layer: repositories for
tenant-scoped entities require an `organizationId` argument and there is no method that
queries them without one. A guard that is accidentally omitted from a new controller
therefore fails closed at the query rather than leaking another tenant's rows. An
integration test asserts that every tenant-scoped repository method rejects a missing
organization id.

`@Public()` marks the handful of genuinely anonymous routes (health, contact, login,
password reset). The default is authenticated; a route becomes public only by explicit
opt-in, so forgetting a decorator locks a route down rather than opening it up.

## Frontend

Angular holds the access token in memory only — never `localStorage`, which is readable by
any injected script. The refresh cookie is `HttpOnly`, so a page reload recovers the
session by calling refresh rather than by reading a stored token.

An HTTP interceptor attaches the access token, and on a 401 attempts a single refresh,
queuing concurrent requests behind that one attempt so a burst of parallel calls produces
one refresh rather than a stampede. If refresh fails the auth state clears and the user
lands on `/login` with a return URL.

Route guards mirror the API's permission checks for navigation purposes. They are a
usability layer: a user who forges their way past them reaches an API that refuses.
