# Timekeeping Integration

Category owner: `TimekeepingModule`. Interface: `TimekeepingProvider`. Status: not started
— blocked on which POS and time-clock systems are in scope.

## Candidate providers

| Key | Provider | Notes |
| --- | --- | --- |
| `pos` | `PosTimekeepingProvider` | Restaurant point-of-sale systems used as the clock |
| `timeclock` | `TimeClockProvider` | Dedicated physical or kiosk time clocks |
| `mock` | `MockTimekeepingProvider` | Deterministic fixtures |

The restaurant POS case is the one that shapes the design. POS systems are the source of
truth for hours in much of the hospitality workforce, they expose wildly different APIs,
and several only offer scheduled exports rather than live queries. So the interface is
pull-and-reconcile rather than event-driven, with webhook support as an optimisation where
a vendor offers it.

## Interface

```ts
export interface TimekeepingProvider {
  readonly key: string;

  listTimeEntries(ctx: ProviderContext, range: DateRange, cursor?: string): Promise<ProviderResult<Paginated<ExternalTimeEntryDto>>>;
  listShifts(ctx: ProviderContext, range: DateRange, cursor?: string): Promise<ProviderResult<Paginated<ExternalShiftDto>>>;

  /** Map the provider's worker identifiers onto BlueRise employees. */
  listWorkers(ctx: ProviderContext): Promise<ProviderResult<ExternalWorkerDto[]>>;

  getConnectionStatus(ctx: ProviderContext): Promise<ProviderResult<ConnectionStatusDto>>;
}
```

Writing back to the POS is deliberately absent. Until a specific vendor requires it, this
is a read integration, which removes an entire class of failure where BlueRise and the POS
disagree about who owns a punch.

## Domain neutrality

BlueRise stores `TimeEntry`, `Shift`, `Break`, `Timesheet`, and `TimesheetApproval` in its
own vocabulary. An `ExternalTimeEntryDto` is translated on the way in and never persisted
raw. `TimeEntry.source` records where a punch came from (`pos`, `time_clock`, `manual`,
`import`) and `provider_ref` holds the vendor's identifier so re-import is idempotent.

## Reconciliation

Sync is idempotent on `(integration_connection_id, provider_ref)`. A re-run of an
overlapping window updates existing rows rather than duplicating them — providers routinely
amend punches after the fact, and a missed amendment is a payroll error.

Three cases need explicit handling, and all three are common enough that leaving them to
"whatever happens" is not acceptable:

- **An unmatched worker.** A punch arrives for a provider worker id with no BlueRise
  employee. It is stored against the connection in an unmatched state and surfaced in
  `/admin/timekeeping` for mapping. It is never silently dropped and never guessed at by
  name matching.
- **An open punch.** A clock-in with no clock-out, because someone forgot. Stored with a
  null `clock_out_at` and flagged, not auto-closed. Auto-closing invents hours.
- **A retroactive amendment.** A punch that changes after a timesheet was approved. The
  amendment is recorded and the timesheet is flagged as having changed post-approval rather
  than being silently recalculated.

## Time zones

Instants are `timestamptz`. Day boundaries, weekly totals, and overtime thresholds are
computed in the worksite location's IANA timezone, taken from `OrganizationLocation`. This
is not a detail: an overnight shift crossing a DST transition is a real occurrence in
hospitality, and computing it in UTC or in the server's zone produces a wrong paycheck.

## Overtime

Overtime rules are jurisdictional and BlueRise must not hard-code one. The intended shape
is a rule set per organization location — daily threshold, weekly threshold, seventh-day
rules, whether breaks are paid — evaluated by a pure, unit-testable function. No rule set
has been specified, so nothing is implemented; the schema reserves the relationship.

## Open questions

- Which POS vendors are in scope. This determines whether the first adapter is REST,
  scheduled export, or SFTP.
- Whether BlueRise approves timesheets or whether approval lives in the POS.
- Whether approved timesheets must flow to the payroll provider, which would make this the
  first place two integration categories have to talk to each other.
