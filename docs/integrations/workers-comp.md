# Workers' Compensation Integration

Category owner: `WorkersCompModule`. Interface: `WorkersCompProvider`. Status: not
started — blocked on carrier or broker selection.

## Candidate providers

| Key       | Provider                     | Notes                                         |
| --------- | ---------------------------- | --------------------------------------------- |
| `carrier` | `CarrierWorkersCompProvider` | Direct carrier connection                     |
| `broker`  | `BrokerWorkersCompProvider`  | Broker platform fronting one or more carriers |
| `mock`    | `MockWorkersCompProvider`    | Deterministic fixtures                        |

## Interface

```ts
export interface WorkersCompProvider {
  readonly key: string;

  getPolicy(ctx: ProviderContext): Promise<ProviderResult<WorkersCompPolicyDto>>;
  listIncidents(
    ctx: ProviderContext,
    range: DateRange,
  ): Promise<ProviderResult<IncidentDto[]>>;
  submitIncident(
    ctx: ProviderContext,
    input: IncidentSubmissionInput,
  ): Promise<ProviderResult<IncidentReceiptDto>>;
  getClaimStatus(
    ctx: ProviderContext,
    claimRef: string,
  ): Promise<ProviderResult<ClaimStatusDto>>;
  getPolicyDocument(
    ctx: ProviderContext,
    kind: 'certificate' | 'policy',
  ): Promise<ProviderResult<SignedUrlDto>>;
  getConnectionStatus(
    ctx: ProviderContext,
  ): Promise<ProviderResult<ConnectionStatusDto>>;
}
```

## The hard boundary

BlueRise records and routes. It does not decide.

No coverage determination, benefit calculation, compensability assessment, or claim
adjudication is implemented in application code — not as a helper, not as a "preview,"
not as an estimate. Those are legal and insurance functions performed by the carrier,
and a number produced by BlueRise would be relied upon whatever disclaimer sat next to
it.

What the product does: capture an incident report accurately and promptly, transmit it
to the carrier, store the carrier's claim reference, and display the status the carrier
reports. `ClaimStatusDto.status` is a passthrough of the carrier's own value plus a
human-readable label supplied by the carrier — BlueRise does not map carrier statuses
onto its own vocabulary, because that mapping would be an interpretation.

## Incident reporting

Incident reporting is time-sensitive and often done by someone in distress or in a
hurry, sometimes on a phone at a worksite. The form must therefore work
offline-tolerantly: a draft is retained locally so a dropped connection does not lose
the report, and submission is retried. Required fields are kept to what the carrier
genuinely needs.

An incident is recorded in BlueRise the moment it is submitted, with
`status = 'recorded'`, independently of whether transmission to the carrier succeeded.
Transmission is a separate, retried step with its own visible state. A carrier outage
must never mean an injury report was lost.

## Privacy

Incident descriptions can contain medical detail. They are treated as sensitive:
excluded from list endpoints, visible only to the reporting employee, the employer
administrators of that organization, and BlueRise roles with an explicit
`workers_comp:read` permission. Access is written to the audit log — for this category,
read access is audited, not just writes.

## Open questions

- Carrier or broker, and whether an API exists at all. Some workers' compensation
  carriers still transact by fax and PDF. If so, the honest implementation is a
  document-generation and tracking workflow rather than a claimed integration.
- Statutory reporting obligations and their deadlines, which vary by jurisdiction and
  may impose hard timing requirements on the transmission step.
- Retention requirements for incident records, typically multi-year.
