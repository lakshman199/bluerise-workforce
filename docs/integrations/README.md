# Integration Architecture

Every external provider is reached through the same four-layer shape. This document
describes the pattern; the sibling documents describe each category's specifics.

## The pattern

```
Controller  ─►  BlueRise domain service  ─►  Provider interface  ─►  Adapter  ─►  Vendor API
                (PayrollService)            (PayrollProvider)      (GustoPayrollProvider)
```

**Controllers** speak HTTP and BlueRise DTOs. They know nothing about any vendor.

**Domain services** own BlueRise business rules, persistence, tenant scoping, and audit.
They depend on the provider *interface*, injected by token.

**Provider interfaces** are BlueRise's vocabulary, not the vendor's. `PayrollProvider`
exposes `listPayStatements(ctx, employeeRef, range): Promise<PayStatementDto[]>` — it does
not expose Gusto's `GET /v1/employees/{id}/pay_stubs` shape, and it does not leak a vendor
type into the signature.

**Adapters** implement an interface for one vendor. An adapter is the only place that knows
a vendor's endpoints, authentication scheme, pagination style, rate limits, error codes,
field names, and quirks. It translates vendor payloads into BlueRise DTOs and vendor errors
into BlueRise's `ProviderError` hierarchy.

Adapters are selected at runtime from `IntegrationConnection.provider_key` for the tenant,
resolved through a provider registry. Nothing is compiled in.

## Why this matters more than usual here

Payroll and benefits vendors are sticky, expensive, and slow to change — which is exactly
why an architecture that assumes one of them is a liability. A customer arriving on ADP and
a customer arriving on Gusto must both work, and a customer migrating between them must not
require a BlueRise release. The interface boundary is what makes that a configuration
change.

## Rules

1. **No vendor SDK type crosses a service boundary.** If `@gusto/embedded-api` types appear
   outside `adapters/gusto/`, the boundary has leaked.
2. **No credentials in code, in Postgres, or in the repository.** `IntegrationConnection`
   stores a `credential_ref` that names a key in a secret manager. `.env.example` lists
   variable names with empty values.
3. **Mocks are labelled.** Every mock adapter's class name begins with `Mock`, it is
   registered only when configuration explicitly selects it, and it logs a warning at
   startup naming itself and the category it is standing in for. There is no code path
   where a mock is silently substituted for a real provider that failed to configure —
   that would let a demo be mistaken for a working integration.
4. **Interfaces come first.** Every category ships its interface, DTOs, error types, and
   mock adapter before any real adapter is attempted. That is Phase 6's entry condition and
   it is why Phase 6 can be prepared without credentials.
5. **Sync is recorded.** Every provider exchange writes an `IntegrationSync` row with
   direction, timing, record count, and outcome. Silent partial syncs are the failure mode
   that costs a payroll cycle.
6. **Provider failure is a normal state.** A vendor being down degrades a page to a stale-
   data notice with a timestamp; it does not produce a 500 and it does not show an empty
   table that reads as "you have no pay statements."

## Common types

```ts
interface ProviderContext {
  organizationId: string;
  connectionId: string;
  requestId: string;
}

type ProviderResult<T> =
  | { ok: true; data: T; fetchedAt: string }
  | { ok: false; error: ProviderError };

class ProviderError extends Error {
  kind: 'auth' | 'rate_limit' | 'not_found' | 'validation' | 'unavailable' | 'unknown';
  retryable: boolean;
  providerKey: string;
  providerCode?: string;
}
```

Adapters return `ProviderResult` rather than throwing vendor exceptions, so a domain
service handles a provider outage as a value rather than as control flow.

## Webhooks

Inbound provider events land at `/api/v1/webhooks/:provider`. Every handler, without
exception:

1. Verifies the signature against the provider's scheme before reading the body. An
   unverified payload is discarded and logged; it is never parsed into domain objects.
2. Writes a `WebhookEvent` row keyed `(integration_id, provider_event_id)` with a unique
   constraint. A duplicate delivery hits the constraint and returns 200 without
   reprocessing — providers retry aggressively and at-least-once delivery is the norm.
3. Acknowledges quickly and processes asynchronously. A slow handler causes the provider to
   retry, which causes duplicate work.
4. Treats every field as untrusted input, validated exactly as strictly as a public request
   body. A signed webhook proves origin, not correctness.
5. Records attempts and outcome so a stuck event is visible in `/admin/integrations`.

## Status

No provider credentials or API specifications have been supplied. Phase 6 has not started.
What exists today is this document set and the plan; interfaces and mock adapters are built
in Phase 4 alongside the modules that consume them.
