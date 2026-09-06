# Benefits Integration

Category owner: `BenefitsModule`. Interface: `BenefitsProvider`. Status: not started —
blocked on broker/carrier selection and API specifications.

## Candidate providers

| Key | Provider | Notes |
| --- | --- | --- |
| `broker` | `BrokerBenefitsProvider` | A broker platform aggregating multiple carriers |
| `carrier` | `CarrierBenefitsProvider` | Direct carrier connection |
| `mock` | `MockBenefitsProvider` | Deterministic fixtures |

Benefits is the category most likely to involve file-based exchange rather than a REST API.
Many carriers still transact via EDI 834 enrollment files on SFTP. The interface is
therefore designed so a batch adapter can satisfy it: methods return the last known state
with a `fetchedAt` timestamp rather than pretending to be real time, and enrollment
submission returns a *pending* status rather than a confirmation.

## Interface

```ts
export interface BenefitsProvider {
  readonly key: string;
  readonly mode: 'realtime' | 'batch';

  listPlans(ctx: ProviderContext, planYear: number): Promise<ProviderResult<BenefitPlanDto[]>>;
  getEnrollmentPeriods(ctx: ProviderContext): Promise<ProviderResult<EnrollmentPeriodDto[]>>;

  listEnrollments(ctx: ProviderContext, employeeRef: string): Promise<ProviderResult<BenefitEnrollmentDto[]>>;
  submitEnrollment(ctx: ProviderContext, input: EnrollmentSubmissionInput): Promise<ProviderResult<EnrollmentReceiptDto>>;
  cancelEnrollment(ctx: ProviderContext, enrollmentRef: string, effectiveOn: string): Promise<ProviderResult<EnrollmentReceiptDto>>;

  listDependents(ctx: ProviderContext, employeeRef: string): Promise<ProviderResult<DependentDto[]>>;
  upsertDependent(ctx: ProviderContext, employeeRef: string, input: DependentInput): Promise<ProviderResult<DependentDto>>;

  getPlanDocument(ctx: ProviderContext, planRef: string, kind: 'summary' | 'certificate'): Promise<ProviderResult<SignedUrlDto>>;
  getConnectionStatus(ctx: ProviderContext): Promise<ProviderResult<ConnectionStatusDto>>;
}
```

`EnrollmentReceiptDto` carries `status: 'pending' | 'accepted' | 'rejected'` and a
`confirmedAt` that is null while pending. The UI must show pending as pending. Telling
someone their family's medical coverage is active when a batch file has not yet been
acknowledged is the kind of error that ends up in a hospital billing department.

## Categories

Seeded global catalogue: medical, dental, vision, life, disability, retirement, other. The
`other` category exists because employer benefit offerings are genuinely open-ended
(commuter, wellness, tuition, pet) and inventing a fixed taxonomy would be wrong.

## Health information

Enrollment data is adjacent to health information. BlueRise does not claim HIPAA compliance
and must not imply it. Concretely, until a compliance position is established: no diagnosis,
treatment, or claims-detail data is stored; only enrollment facts (who is enrolled in which
plan at which tier, effective when). Dependent records hold name, relationship, and date of
birth — the minimum an enrollment requires.

## Open questions

- Broker versus direct carrier, which drives whether the first adapter is REST or EDI.
- Qualifying life events: which are supported, what evidence is required, and who
  adjudicates.
- Whether BlueRise ever needs to display cost projections, which would require rate tables
  and pull the domain model considerably wider.
