import type { Metadata } from "next";
import { BadgeDollarSign, CircleCheck, Clock3, TriangleAlert } from "lucide-react";

import { PageContainer, PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import {
  TimesheetReview,
  type TimesheetRowData,
} from "@/components/timesheets/timesheet-review";
import {
  formatHours,
  isValidISODate,
  startOfWeek,
  todayISO,
} from "@/lib/date";
import { readData } from "@/lib/store";
import { OVERTIME_THRESHOLD_HOURS } from "@/lib/types";
import { buildTimesheetWeek, formatCurrency, fullName } from "@/lib/workforce";

export const metadata: Metadata = { title: "Timesheets" };

export default async function TimesheetsPage({
  searchParams,
}: PageProps<"/timesheets">) {
  const params = await searchParams;
  const weekParam = typeof params.week === "string" ? params.week : "";
  const weekStart = startOfWeek(
    isValidISODate(weekParam) ? weekParam : todayISO(),
  );

  const data = await readData();
  const week = buildTimesheetWeek(data, weekStart);

  const rows: TimesheetRowData[] = week.rows.map((row) => ({
    entry: row.entry,
    employee: row.employee,
    hours: row.hours,
    varianceMinutes: row.varianceMinutes,
    hasSchedule: row.scheduled !== null,
  }));

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Payroll"
        title="Timesheets"
        description="Compare clocked hours against what was scheduled, then approve the week so payroll can close it out."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pending review"
          value={`${week.pendingCount}`}
          hint={
            week.pendingCount === 0
              ? "This week is fully reviewed"
              : `${formatHours(week.pendingHours)} not yet approved`
          }
          icon={Clock3}
          tone={week.pendingCount > 0 ? "warning" : "positive"}
        />
        <StatCard
          label="Approved hours"
          value={formatHours(week.approvedHours)}
          hint="Cleared for payroll"
          icon={CircleCheck}
          tone="positive"
        />
        <StatCard
          label="Week labor cost"
          value={formatCurrency(week.totalCost)}
          hint="Approved plus pending, at base rate"
          icon={BadgeDollarSign}
        />
        <StatCard
          label="Over 40 hours"
          value={`${week.overtimeEmployees.length}`}
          hint={
            week.overtimeEmployees.length === 0
              ? `Nobody crossed ${OVERTIME_THRESHOLD_HOURS} hours`
              : week.overtimeEmployees
                  .slice(0, 2)
                  .map((risk) => `${fullName(risk.employee)} ${formatHours(risk.hours)}`)
                  .join(", ")
          }
          icon={TriangleAlert}
          tone={week.overtimeEmployees.length > 0 ? "critical" : "positive"}
        />
      </div>

      <TimesheetReview
        weekStart={weekStart}
        rows={rows}
        pendingCount={week.pendingCount}
      />
    </PageContainer>
  );
}
