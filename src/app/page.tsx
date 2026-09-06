import Link from "next/link";
import {
  AlarmClock,
  ArrowRight,
  CalendarClock,
  CircleAlert,
  Clock3,
  UserRound,
  Users,
} from "lucide-react";

import { CoverageChart } from "@/components/coverage-chart";
import { PageContainer, PageHeader } from "@/components/page-header";
import { PersonAvatar } from "@/components/person-avatar";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  formatHours,
  formatLongDate,
  formatShortDate,
  formatTime,
  formatWeekRange,
  startOfWeek,
  todayISO,
} from "@/lib/date";
import { readData } from "@/lib/store";
import { OVERTIME_THRESHOLD_HOURS } from "@/lib/types";
import {
  buildDashboardMetrics,
  formatCurrency,
  fullName,
  shiftHours,
} from "@/lib/workforce";

export default async function DashboardPage() {
  const data = await readData();
  const weekStart = startOfWeek(todayISO());
  const metrics = buildDashboardMetrics(data, weekStart);

  const hoursDelta = metrics.scheduledHours - metrics.previousScheduledHours;
  const deltaLabel =
    metrics.previousScheduledHours === 0
      ? "No comparison for last week"
      : `${hoursDelta >= 0 ? "+" : "−"}${formatHours(Math.abs(hoursDelta))} vs. last week`;

  return (
    <PageContainer>
      <PageHeader
        eyebrow={formatWeekRange(weekStart)}
        title="Operations dashboard"
        description={`Coverage, cost, and approvals for the week of ${formatShortDate(weekStart)} across all four BlueRise sites.`}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/timesheets">Review timesheets</Link>
            </Button>
            <Button asChild>
              <Link href="/schedule">
                Open schedule
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active crew"
          value={`${metrics.activeHeadcount}`}
          hint={
            metrics.onLeaveCount > 0
              ? `${metrics.onLeaveCount} teammate${metrics.onLeaveCount === 1 ? "" : "s"} on leave`
              : "Everyone is available this week"
          }
          icon={Users}
        />
        <StatCard
          label="Scheduled hours"
          value={formatHours(metrics.scheduledHours)}
          hint={deltaLabel}
          icon={Clock3}
        />
        <StatCard
          label="Open shifts"
          value={`${metrics.openShiftCount}`}
          hint={
            metrics.openShiftCount === 0
              ? "Every shift is covered"
              : `${formatHours(metrics.openShiftHours)} still unassigned`
          }
          icon={CircleAlert}
          tone={metrics.openShiftCount > 0 ? "warning" : "positive"}
        />
        <StatCard
          label="Pending approvals"
          value={`${metrics.pendingCount}`}
          hint={
            metrics.pendingCount === 0
              ? "Timesheets are fully reconciled"
              : `${formatHours(metrics.pendingHours)} awaiting a manager`
          }
          icon={AlarmClock}
          tone={metrics.pendingCount > 0 ? "warning" : "positive"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Coverage by day</CardTitle>
            <CardDescription>
              Scheduled hours across every site. Projected labor cost for the week is{" "}
              {formatCurrency(metrics.projectedLaborCost)}.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <CoverageChart coverage={metrics.coverage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Needs attention</CardTitle>
            <CardDescription>
              Everything blocking a clean week, in the order worth fixing.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <AttentionRow
              label="Unfilled shifts"
              value={`${metrics.openShiftCount}`}
              detail={
                metrics.openShiftCount === 0
                  ? "Nothing left to assign."
                  : `${formatHours(metrics.openShiftHours)} of work with no name attached.`
              }
              href="/schedule"
              tone={metrics.openShiftCount > 0 ? "warning" : "calm"}
            />
            <Separator />
            <AttentionRow
              label="Unpublished changes"
              value={`${metrics.unpublishedCount}`}
              detail={
                metrics.unpublishedCount === 0
                  ? "The crew is seeing the current schedule."
                  : "Draft shifts are not visible to the crew yet."
              }
              href="/schedule"
              tone={metrics.unpublishedCount > 0 ? "warning" : "calm"}
            />
            <Separator />
            <AttentionRow
              label="Overtime risk"
              value={`${metrics.overtimeRisks.length}`}
              detail={
                metrics.overtimeRisks.length === 0
                  ? `Nobody is scheduled past ${OVERTIME_THRESHOLD_HOURS} hours.`
                  : metrics.overtimeRisks
                      .slice(0, 2)
                      .map(
                        (risk) =>
                          `${fullName(risk.employee)} at ${formatHours(risk.hours)}`,
                      )
                      .join(", ")
              }
              href="/schedule"
              tone={metrics.overtimeRisks.length > 0 ? "critical" : "calm"}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Today · {formatLongDate(todayISO())}</CardTitle>
          <CardDescription>
            {metrics.todaysShifts.length === 0
              ? "No shifts are scheduled for today."
              : `${metrics.todaysShifts.length} shift${metrics.todaysShifts.length === 1 ? "" : "s"} on the board, sorted by start time.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.todaysShifts.length === 0 ? (
            <EmptyToday />
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {metrics.todaysShifts.map(({ shift, employee }) => (
                <li
                  key={shift.id}
                  className="bg-muted/40 flex items-center gap-3 rounded-lg px-3 py-2.5"
                >
                  {employee ? (
                    <PersonAvatar employee={employee} />
                  ) : (
                    <span className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 flex size-8 items-center justify-center rounded-full">
                      <UserRound className="size-4" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {employee ? fullName(employee) : "Open shift"}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {shift.role} · {shift.site}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium tabular-nums">
                      {formatTime(shift.start)} – {formatTime(shift.end)}
                    </p>
                    <p className="text-muted-foreground text-xs tabular-nums">
                      {formatHours(shiftHours(shift))}
                      {shift.published ? "" : " · draft"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}

function AttentionRow({
  label,
  value,
  detail,
  href,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  href: string;
  tone: "calm" | "warning" | "critical";
}) {
  const badgeClass = {
    calm: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
    warning: "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200",
    critical: "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200",
  }[tone];

  return (
    <Link href={href} className="group flex items-start gap-3">
      <Badge variant="secondary" className={`${badgeClass} mt-0.5 tabular-nums`}>
        {value}
      </Badge>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium group-hover:underline">{label}</span>
        <span className="text-muted-foreground block text-xs text-pretty">{detail}</span>
      </span>
      <ArrowRight className="text-muted-foreground/50 group-hover:text-foreground mt-1 size-4 shrink-0 transition-colors" />
    </Link>
  );
}

function EmptyToday() {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <span className="bg-muted text-muted-foreground flex size-11 items-center justify-center rounded-full">
        <CalendarClock className="size-5" />
      </span>
      <div>
        <p className="text-sm font-medium">Nothing on the board today</p>
        <p className="text-muted-foreground mt-1 text-sm">
          Add a shift from the schedule to put someone on site.
        </p>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href="/schedule">Go to schedule</Link>
      </Button>
    </div>
  );
}
