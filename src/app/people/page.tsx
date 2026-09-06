import type { Metadata } from "next";

import { PageContainer, PageHeader } from "@/components/page-header";
import {
  PeopleDirectory,
  type EmployeeSummary,
} from "@/components/people/people-directory";
import { readData } from "@/lib/store";
import { DEPARTMENTS, ROLES, SITES } from "@/lib/types";
import { buildEmployeeDetail, sortEmployees } from "@/lib/workforce";

export const metadata: Metadata = { title: "People" };

// The JSON store is read per request, so this page must not be prerendered.
export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  const data = await readData();
  const employees = sortEmployees(data.employees);

  const summaries: Record<string, EmployeeSummary> = {};
  for (const employee of employees) {
    const detail = buildEmployeeDetail(data, employee.id);
    if (!detail) continue;
    summaries[employee.id] = {
      weekHours: detail.weekHours,
      weekCost: detail.weekCost,
      hoursLast30Days: detail.hoursLast30Days,
      pendingEntries: detail.pendingEntries,
      upcomingShifts: detail.upcomingShifts,
    };
  }

  const roles = Array.from(
    new Set<string>([...ROLES, ...data.employees.map((employee) => employee.role)]),
  ).sort();
  const sites = Array.from(
    new Set<string>([...SITES, ...data.employees.map((employee) => employee.homeSite)]),
  ).sort();

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Roster"
        title="People"
        description="Everyone on the BlueRise payroll, with the hours they are carrying this week. Select a row to see contact details, certifications, and what is coming up."
      />
      <PeopleDirectory
        employees={employees}
        summaries={summaries}
        roles={roles}
        sites={sites}
        departments={[...DEPARTMENTS]}
      />
    </PageContainer>
  );
}
