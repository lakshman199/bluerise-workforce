"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CalendarPlus, ChevronLeft, ChevronRight, Plus, Send } from "lucide-react";
import { toast } from "sonner";

import { PersonAvatar } from "@/components/person-avatar";
import {
  ShiftDialog,
  type ShiftDraft,
} from "@/components/schedule/shift-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { publishWeek } from "@/app/actions";
import {
  addDays,
  formatDayNumber,
  formatHours,
  formatTime,
  formatWeekRange,
  isWeekend,
  parseISODate,
  startOfWeek,
  todayISO,
} from "@/lib/date";
import { cn } from "@/lib/utils";
import type { Employee, Shift } from "@/lib/types";
import { fullName } from "@/lib/workforce";

const ALL = "all";

const SITE_ACCENTS: Record<string, string> = {
  "Harbor Point Tower":
    "border-sky-300/70 bg-sky-50 text-sky-900 dark:border-sky-400/30 dark:bg-sky-500/15 dark:text-sky-100",
  "Riverside Logistics Hub":
    "border-teal-300/70 bg-teal-50 text-teal-900 dark:border-teal-400/30 dark:bg-teal-500/15 dark:text-teal-100",
  "Northgate Campus":
    "border-violet-300/70 bg-violet-50 text-violet-900 dark:border-violet-400/30 dark:bg-violet-500/15 dark:text-violet-100",
  "Westline Depot":
    "border-indigo-300/70 bg-indigo-50 text-indigo-900 dark:border-indigo-400/30 dark:bg-indigo-500/15 dark:text-indigo-100",
};

const FALLBACK_ACCENT =
  "border-slate-300/70 bg-slate-50 text-slate-900 dark:border-slate-400/30 dark:bg-slate-500/15 dark:text-slate-100";

export interface ScheduleRowData {
  employee: Employee;
  shiftsByDate: Record<string, Shift[]>;
  totalHours: number;
}

export function ScheduleView({
  weekStart,
  dates,
  rows,
  openShiftsByDate,
  assignableEmployees,
  roles,
  sites,
  departments,
  activeSite,
  activeDepartment,
  scheduledHours,
  openShiftCount,
  unpublishedCount,
}: {
  weekStart: string;
  dates: string[];
  rows: ScheduleRowData[];
  openShiftsByDate: Record<string, Shift[]>;
  assignableEmployees: Employee[];
  roles: string[];
  sites: string[];
  departments: string[];
  activeSite: string;
  activeDepartment: string;
  scheduledHours: number;
  openShiftCount: number;
  unpublishedCount: number;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<ShiftDraft | null>(null);
  const [publishing, startPublish] = useTransition();
  const today = todayISO();

  function navigate(next: {
    week?: string;
    site?: string;
    department?: string;
  }) {
    const params = new URLSearchParams();
    const week = next.week ?? weekStart;
    const site = next.site ?? activeSite;
    const department = next.department ?? activeDepartment;
    if (week !== startOfWeek(today)) params.set("week", week);
    if (site !== ALL) params.set("site", site);
    if (department !== ALL) params.set("department", department);
    const query = params.toString();
    router.push(query ? `/schedule?${query}` : "/schedule");
  }

  function handlePublish() {
    startPublish(async () => {
      const result = await publishWeek(weekStart);
      if (result.ok) toast.success("Schedule published to the crew");
      else toast.error(result.error);
    });
  }

  const gridTemplate = {
    gridTemplateColumns: "minmax(208px, 1.2fr) repeat(7, minmax(148px, 1fr))",
  } as const;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous week"
              onClick={() => navigate({ week: addDays(weekStart, -7) })}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next week"
              onClick={() => navigate({ week: addDays(weekStart, 7) })}
            >
              <ChevronRight />
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate({ week: startOfWeek(today) })}
            disabled={weekStart === startOfWeek(today)}
          >
            This week
          </Button>
          <span className="text-sm font-medium tabular-nums">
            {formatWeekRange(weekStart)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={activeSite}
            onValueChange={(value) => navigate({ site: value })}
          >
            <SelectTrigger className="w-[190px]" aria-label="Filter by site">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All sites</SelectItem>
              {sites.map((site) => (
                <SelectItem key={site} value={site}>
                  {site}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={activeDepartment}
            onValueChange={(value) => navigate({ department: value })}
          >
            <SelectTrigger className="w-[190px]" aria-label="Filter by department">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All departments</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handlePublish}
            disabled={publishing || unpublishedCount === 0}
          >
            <Send data-icon="inline-start" />
            {unpublishedCount === 0
              ? "All published"
              : `Publish ${unpublishedCount}`}
          </Button>

          <Button
            onClick={() =>
              setDraft({ shift: null, date: dates[0], employeeId: null })
            }
          >
            <Plus data-icon="inline-start" />
            New shift
          </Button>
        </div>
      </div>

      <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className="tabular-nums">
          {formatHours(scheduledHours)} scheduled
        </span>
        <span className="tabular-nums">{rows.length} people on the board</span>
        <span className="tabular-nums">{openShiftCount} open shifts</span>
        <span className="tabular-nums">{unpublishedCount} unpublished</span>
      </div>

      <div className="bg-card ring-foreground/10 overflow-hidden rounded-xl ring-1">
        <div className="scrollbar-thin overflow-x-auto">
          <div className="min-w-[1040px]">
            <div
              className="bg-muted/60 border-border grid border-b"
              style={gridTemplate}
            >
              <div className="bg-muted/60 sticky left-0 z-20 px-4 py-2.5 text-xs font-medium tracking-wide uppercase">
                Teammate
              </div>
              {dates.map((date) => (
                <div
                  key={date}
                  className={cn(
                    "border-border border-l px-3 py-2.5 text-xs",
                    isWeekend(date) && "bg-muted",
                    date === today && "text-primary",
                  )}
                >
                  <span className="font-medium">
                    {parseISODate(date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </span>{" "}
                  <span className="text-muted-foreground tabular-nums">
                    {formatDayNumber(date)}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="border-border grid border-b"
              style={gridTemplate}
            >
              <div className="bg-card sticky left-0 z-20 flex flex-col justify-center gap-1 px-4 py-3">
                <span className="text-sm font-medium">Open shifts</span>
                <span className="text-muted-foreground text-xs">
                  {openShiftCount === 0
                    ? "Fully covered"
                    : `${openShiftCount} waiting for a name`}
                </span>
              </div>
              {dates.map((date) => (
                <DayCell
                  key={date}
                  date={date}
                  today={today}
                  shifts={openShiftsByDate[date] ?? []}
                  onAdd={() => setDraft({ shift: null, date, employeeId: null })}
                  onEdit={(shift) => setDraft({ shift, date, employeeId: null })}
                  open
                />
              ))}
            </div>

            {rows.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
                <CalendarPlus className="text-muted-foreground size-6" />
                <p className="text-sm font-medium">No teammates match these filters</p>
                <p className="text-muted-foreground max-w-sm text-sm">
                  Clear the site or department filter to see the rest of the roster.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate({ site: ALL, department: ALL })}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              rows.map((row) => (
                <div
                  key={row.employee.id}
                  className="border-border grid border-b last:border-b-0"
                  style={gridTemplate}
                >
                  <div className="bg-card sticky left-0 z-20 flex items-center gap-2.5 px-4 py-3">
                    <PersonAvatar employee={row.employee} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {fullName(row.employee)}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {row.employee.role}
                      </p>
                    </div>
                    <HoursPill
                      hours={row.totalHours}
                      target={row.employee.weeklyTargetHours}
                    />
                  </div>
                  {dates.map((date) => (
                    <DayCell
                      key={date}
                      date={date}
                      today={today}
                      shifts={row.shiftsByDate[date] ?? []}
                      onAdd={() =>
                        setDraft({
                          shift: null,
                          date,
                          employeeId: row.employee.id,
                        })
                      }
                      onEdit={(shift) =>
                        setDraft({ shift, date, employeeId: row.employee.id })
                      }
                    />
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ShiftDialog
        draft={draft}
        onOpenChange={(open) => {
          if (!open) setDraft(null);
        }}
        employees={assignableEmployees}
        roles={roles}
        sites={sites}
      />
    </div>
  );
}

function HoursPill({ hours, target }: { hours: number; target: number }) {
  if (hours === 0) {
    return <span className="text-muted-foreground/70 text-xs tabular-nums">—</span>;
  }
  const over = hours > 40;
  const under = hours < target * 0.75;
  return (
    <Badge
      variant="secondary"
      className={cn(
        "tabular-nums",
        over && "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200",
        !over &&
          under &&
          "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200",
      )}
      title={`${formatHours(hours)} scheduled against a ${target}h target`}
    >
      {formatHours(hours)}
    </Badge>
  );
}

function DayCell({
  date,
  today,
  shifts,
  onAdd,
  onEdit,
  open = false,
}: {
  date: string;
  today: string;
  shifts: Shift[];
  onAdd: () => void;
  onEdit: (shift: Shift) => void;
  open?: boolean;
}) {
  return (
    <div
      className={cn(
        "border-border group/cell relative flex min-h-[74px] flex-col gap-1.5 border-l p-1.5",
        isWeekend(date) && "bg-muted/40",
        date === today && "bg-primary/[0.04]",
      )}
    >
      {shifts.map((shift) => (
        <button
          key={shift.id}
          type="button"
          onClick={() => onEdit(shift)}
          className={cn(
            "w-full cursor-pointer rounded-md border px-2 py-1.5 text-left transition-shadow hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
            open
              ? "border-dashed border-amber-400 bg-amber-50 text-amber-900 dark:border-amber-400/50 dark:bg-amber-500/15 dark:text-amber-100"
              : (SITE_ACCENTS[shift.site] ?? FALLBACK_ACCENT),
            !shift.published && "border-dashed opacity-90",
          )}
        >
          <span className="block text-xs font-medium tabular-nums">
            {formatTime(shift.start)}–{formatTime(shift.end)}
          </span>
          <span className="block truncate text-[11px] opacity-80">
            {open ? shift.role : shift.site}
          </span>
          {!shift.published ? (
            <span className="mt-0.5 block text-[10px] font-medium tracking-wide uppercase opacity-70">
              Draft
            </span>
          ) : null}
        </button>
      ))}

      <button
        type="button"
        onClick={onAdd}
        aria-label={`Add a shift on ${date}`}
        className={cn(
          "text-muted-foreground/60 hover:border-primary/50 hover:text-primary flex cursor-pointer items-center justify-center rounded-md border border-dashed border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
          shifts.length === 0
            ? "flex-1 opacity-0 group-hover/cell:opacity-100 focus-visible:opacity-100"
            : "h-6 opacity-0 group-hover/cell:opacity-100 focus-visible:opacity-100",
        )}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

export { ALL as ALL_FILTER };
