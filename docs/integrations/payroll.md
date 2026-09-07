# Payroll Integration

Category owner: `PayrollModule`. Interface: `PayrollProvider`. Status: not started —
blocked on credentials and API specifications.

## Candidate providers

| Key     | Provider              | Notes                                               |
| ------- | --------------------- | --------------------------------------------------- |
| `gusto` | Gusto Embedded        | Partner onboarding and API access required          |
| `adp`   | ADP                   | Marketplace registration and certification required |
| `mock`  | `MockPayrollProvider` | Deterministic fixtures for development and tests    |

## Interface

```ts
export interface PayrollProvider {
  readonly key: string;

  /** Link an existing BlueRise employee to the provider's employee record. */
  linkEmployee(
    ctx: ProviderContext,
    input: LinkEmployeeInput,
  ): Promise<ProviderResult<PayrollProfileRefDto>>;

  listPayStatements(
    ctx: ProviderContext,
    employeeRef: string,
    range: DateRange,
  ): Promise<ProviderResult<Paginated<PayStatementDto>>>;
  getPayStatement(
    ctx: ProviderContext,
    statementRef: string,
  ): Promise<ProviderResult<PayStatementDetailDto>>;

  listTaxDocuments(
    ctx: ProviderContext,
    employeeRef: string,
    taxYear?: number,
  ): Promise<ProviderResult<TaxDocumentDto[]>>;
  getTaxDocumentDownload(
    ctx: ProviderContext,
    documentRef: string,
  ): Promise<ProviderResult<SignedUrlDto>>;

  listDirectDepositAccounts(
    ctx: ProviderContext,
    employeeRef: string,
  ): Promise<ProviderResult<DirectDepositAccountDto[]>>;
  upsertDirectDepositAccount(
    ctx: ProviderContext,
    employeeRef: string,
    input: DirectDepositInput,
  ): Promise<ProviderResult<DirectDepositAccountDto>>;
  removeDirectDepositAccount(
    ctx: ProviderContext,
    accountRef: string,
  ): Promise<ProviderResult<void>>;

  getPaySchedule(ctx: ProviderContext): Promise<ProviderResult<PayScheduleDto>>;
  getConnectionStatus(
    ctx: ProviderContext,
  ): Promise<ProviderResult<ConnectionStatusDto>>;
}
```

`PayStatementDto` carries gross, net, currency, period start and end, pay date, and a
provider reference. Deduction and withholding detail is only on `PayStatementDetailDto`,
so a list view cannot accidentally ship a full tax breakdown to the browser.

## Sensitive data

Full bank account and routing numbers are collected by the client, submitted once,
passed straight to the provider, and never persisted by BlueRise. What BlueRise stores
is the account type, the last four digits for display, the provider's token, and the
allocation rule. The same applies to tax identifiers: BlueRise holds the provider's
reference, not the SSN.

If a future provider cannot tokenise, the fallback is envelope encryption with a key
held in a KMS and a column that is excluded from every serialiser by default. That
decision is not taken pre-emptively.

## Direction of authority

BlueRise is authoritative for employee identity and employment. The provider is
authoritative for pay calculation results: statements, withholdings, and tax documents
are read from the provider and cached locally for display, never computed by BlueRise.
This split is an assumption pending confirmation (see `system-overview.md` §9.8).

## Webhooks

Expected events, once specifications are available: payroll processed, pay statement
available, tax document available, direct deposit verified or rejected, employee
synchronisation changes. Each maps to a cache refresh plus a `Notification` row.

## Open questions

- Whether ADP and Gusto can both satisfy the same interface without a lowest-common-
  denominator that loses value from each. Reviewing both API specifications side by side
  is the first Phase 6 task, before any adapter is written.
- Off-cycle payments, retroactive corrections, and voided statements — how each provider
  represents them, and whether the domain model needs a supersede relationship on
  `PayStatement`.
- Multi-state withholding representation.
