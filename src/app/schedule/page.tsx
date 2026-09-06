import type { Metadata } from "next";

import { PageContainer, PageHeader } from "@/components/page-header";
import { ScheduleView } from "@/components/schedule/schedule-view";
import { isValidISODate, startOfWeek, todayISO } from "@/lib/date";
import { readData } from "@/lib/store";
import { DEPARTMENTS, ROLES, SITES } from "@/lib/types";
import { buildWeekSchedule, sortEmployees } from "@/lib/workforce";

export const metadata: Metadata = { title: "Schedule" };

const ALL = "all";

export default async function SchedulePage({
  searchParams,
}: PageProps<"/schedule">) {
  const params = await searchParams;
  const weekParam = typeof params.week === "string" ? params.week : "";
  const siteParam = typeof params.site === "string" ? params.site : ALL;
  const departmentParam =
    typeof params.department === "string" ? params.department : ALL;

  const weekStart = startOfWeek(
    isValidISODate(weekParam) ? weekParam : todayISO(),
  );

  const data = await readData();
  const site = (SITES as readonly string[]).includes(siteParam) ? siteParam : ALL;
  const department = (DEPARTMENTS as readonly string[]).includes(departmentParam)
    ? departmentParam
    : ALL;

  const schedule = buildWeekSchedule(data, weekStart, {
    site: site === ALL ? undefined : site,
    department: department === ALL ? undefined : department,
  });

  const assignableEmployees = sortEmployees(
    data.employees.filter((employee) => employee.status === "active"),
  );

  const knownRoles = Array.from(
    new Set<string>([...ROLES, ...data.employees.map((employee) => employee.role)]),
  ).sort();
  const knownSites = Array.from(
    new Set<string>([...SITES, ...data.employees.map((employee) => employee.homeSite)]),
  ).sort();

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Scheduling"
        title="Weekly schedule"
        description="Drop shifts onto the board, keep an eye on weekly hours, and publish once the week looks right. Click any shift to edit it."
      />
      <ScheduleView
        weekStart={weekStart}
        dates={schedule.dates}
        rows={schedule.rows}
        openShiftsByDate={schedule.openShiftsByDate}
        assignableEmployees={assignableEmployees}
        roles={knownRoles}
        sites={knownSites}
        departments={[...DEPARTMENTS]}
        activeSite={site}
        activeDepartment={department}
        scheduledHours={schedule.scheduledHours}
        openShiftCount={schedule.openShiftCount}
        unpublishedCount={schedule.unpublishedCount}
      />
    </PageContainer>
  );
}
