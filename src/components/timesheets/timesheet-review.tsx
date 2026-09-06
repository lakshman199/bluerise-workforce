"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Undo2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { PersonAvatar } from "@/components/person-avatar";
import { TimeEntryStatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { approveWeek, setTimeEntryStatus } from "@/app/actions";
import {
  addDays,
  formatHours,
  formatShortDate,
  formatTime,
  formatWeekRange,
  parseISODate,
  startOfWeek,
  todayISO,
} from "@/lib/date";
import { cn } from "@/lib/utils";
import type { Employee, TimeEntry, TimeEntryStatus } from "@/lib/types";
import { fullName } from "@/lib/workforce";

export interface TimesheetRowData {
  entry: TimeEntry;
  employee: Employee;
  hours: number;
  varianceMinutes: number;
  hasSchedule: boolean;
}

export function TimesheetReview({
  weekStart,
  rows,
  pendingCount,
}: {
  weekStart: string;
  rows: TimesheetRowData[];
  pendingCount: number;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"pending" | "all">(
    pendingCount > 0 ? "pending" : "all",
  );
  const [pending, startTransition] = useTransition();
  const today = todayISO();

  const visible = useMemo(
    () =>
      tab === "pending"
        ? rows.filter((row) => row.entry.status === "pending")
        : rows,
    [rows, tab],
  );

  function goToWeek(week: string) {
    router.push(
      week === startOfWeek(today) ? "/timesheets" : `/timesheets?week=${week}`,
    );
  }

  function decide(row: TimesheetRowData, status: TimeEntryStatus) {
    startTransition(async () => {
      const result = await setTimeEntryStatus(row.entry.id, status);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      const verb =
        status === "approved"
          ? "Approved"
          : status === "rejected"
            ? "Rejected"
            : "Reopened";
      toast.success(`${verb} ${fullName(row.employee)}'s ${formatShortDate(row.entry.date)} entry`);
    });
  }

  function approveAll() {
    startTransition(async () => {
      const result = await approveWeek(weekStart);
      if (result.ok) toast.success("All pending entries approved for this week");
      else toast.error(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous week"
              onClick={() => goToWeek(addDays(weekStart, -7))}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next week"
              onClick={() => goToWeek(addDays(weekStart, 7))}
            >
              <ChevronRight />
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => goToWeek(startOfWeek(today))}
            disabled={weekStart === startOfWeek(today)}
          >
            This week
          </Button>
          <span className="text-sm font-medium tabular-nums">
            {formatWeekRange(weekStart)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={tab} onValueChange={(value) => setTab(value as typeof tab)}>
            <TabsList>
              <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
              <TabsTrigger value="all">All ({rows.length})</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={approveAll} disabled={pending || pendingCount === 0}>
            <CheckCheck data-icon="inline-start" />
            Approve all pending
          </Button>
        </div>
      </div>

      <div className="bg-card ring-foreground/10 overflow-hidden rounded-xl ring-1">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              <CheckCheck className="size-5" />
            </span>
            <p className="text-sm font-medium">
              {tab === "pending"
                ? "Nothing left to approve"
                : "No hours logged this week"}
            </p>
            <p className="text-muted-foreground max-w-sm text-sm">
              {tab === "pending"
                ? "Every entry for this week has been reviewed. Switch to All to see the full record."
                : "Once the crew works a scheduled shift, their hours land here for review."}
            </p>
          </div>
        ) : (
          <div className="scrollbar-thin overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teammate</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="hidden sm:table-cell">Clocked</TableHead>
                  <TableHead className="hidden md:table-cell text-right">
                    Break
                  </TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead className="hidden lg:table-cell text-right">
                    vs. scheduled
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Decision</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((row) => (
                  <TableRow key={row.entry.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <PersonAvatar employee={row.employee} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {fullName(row.employee)}
                          </p>
                          <p className="text-muted-foreground truncate text-xs">
                            {row.employee.role}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="text-sm">{formatShortDate(row.entry.date)}</span>
                      <span className="text-muted-foreground block text-xs">
                        {parseISODate(row.entry.date).toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden text-sm whitespace-nowrap tabular-nums sm:table-cell">
                      {formatTime(row.entry.clockIn)} – {formatTime(row.entry.clockOut)}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden text-right text-sm tabular-nums md:table-cell">
                      {row.entry.breakMinutes}m
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatHours(row.hours)}
                    </TableCell>
                    <TableCell className="hidden text-right text-sm tabular-nums lg:table-cell">
                      <VarianceCell
                        minutes={row.varianceMinutes}
                        hasSchedule={row.hasSchedule}
                      />
                    </TableCell>
                    <TableCell>
                      <TimeEntryStatusBadge status={row.entry.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {row.entry.status === "pending" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={pending}
                              onClick={() => decide(row, "rejected")}
                            >
                              <X data-icon="inline-start" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              disabled={pending}
                              onClick={() => decide(row, "approved")}
                            >
                              <Check data-icon="inline-start" />
                              Approve
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={pending}
                            onClick={() => decide(row, "pending")}
                          >
                            <Undo2 data-icon="inline-start" />
                            Reopen
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

function VarianceCell({
  minutes,
  hasSchedule,
}: {
  minutes: number;
  hasSchedule: boolean;
}) {
  if (!hasSchedule) {
    return <span className="text-muted-foreground/70">Unscheduled</span>;
  }
  if (Math.abs(minutes) < 5) {
    return <span className="text-muted-foreground">On time</span>;
  }
  return (
    <span
      className={cn(
        minutes > 0
          ? "text-amber-600 dark:text-amber-400"
          : "text-muted-foreground",
      )}
    >
      {minutes > 0 ? "+" : "−"}
      {Math.abs(minutes)}m
    </span>
  );
}
