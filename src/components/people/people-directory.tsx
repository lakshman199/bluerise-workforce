"use client";

import { useMemo, useState, useTransition } from "react";
import {
  CalendarDays,
  Mail,
  MoreHorizontal,
  Phone,
  Search,
  UserRoundX,
} from "lucide-react";
import { toast } from "sonner";

import { AddEmployeeDialog } from "@/components/people/employee-dialog";
import { PersonAvatar } from "@/components/person-avatar";
import { EmployeeStatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { setEmployeeStatus } from "@/app/actions";
import { formatHours, formatShortDate, formatTime } from "@/lib/date";
import type { Employee, EmployeeStatus, Shift } from "@/lib/types";
import { formatCurrency, fullName } from "@/lib/workforce";

const ALL = "all";

const EMPLOYMENT_LABELS: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
};

export interface EmployeeSummary {
  weekHours: number;
  weekCost: number;
  hoursLast30Days: number;
  pendingEntries: number;
  upcomingShifts: Shift[];
}

export function PeopleDirectory({
  employees,
  summaries,
  roles,
  sites,
  departments,
}: {
  employees: Employee[];
  summaries: Record<string, EmployeeSummary>;
  roles: string[];
  sites: string[];
  departments: string[];
}) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return employees.filter((employee) => {
      if (department !== ALL && employee.department !== department) return false;
      if (status !== ALL && employee.status !== status) return false;
      if (!needle) return true;
      return [
        fullName(employee),
        employee.email,
        employee.role,
        employee.homeSite,
        ...employee.certifications,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [employees, query, department, status]);

  const selected = employees.find((employee) => employee.id === selectedId) ?? null;
  const filtersActive = query.trim() !== "" || department !== ALL || status !== ALL;

  function changeStatus(employee: Employee, next: EmployeeStatus) {
    startTransition(async () => {
      const result = await setEmployeeStatus(employee.id, next);
      if (result.ok) {
        toast.success(`${fullName(employee)} marked ${next.replace("-", " ")}`);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, role, site, or certification"
            className="pl-9"
            aria-label="Search the roster"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[190px]" aria-label="Filter by department">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All departments</SelectItem>
              {departments.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[150px]" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Any status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-leave">On leave</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <AddEmployeeDialog roles={roles} sites={sites} departments={departments} />
        </div>
      </div>

      <div className="bg-card ring-foreground/10 overflow-hidden rounded-xl ring-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <span className="bg-muted text-muted-foreground flex size-11 items-center justify-center rounded-full">
              <UserRoundX className="size-5" />
            </span>
            <p className="text-sm font-medium">
              {filtersActive ? "No teammates match your filters" : "The roster is empty"}
            </p>
            <p className="text-muted-foreground max-w-sm text-sm">
              {filtersActive
                ? "Try a different search term, or reset the filters to see everyone."
                : "Add your first teammate to start building the schedule."}
            </p>
            {filtersActive ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setDepartment(ALL);
                  setStatus(ALL);
                }}
              >
                Reset filters
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="scrollbar-thin overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teammate</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden lg:table-cell">Home site</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="text-right">This week</TableHead>
                  <TableHead className="hidden text-right xl:table-cell">Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((employee) => {
                  const summary = summaries[employee.id];
                  return (
                    <TableRow
                      key={employee.id}
                      onClick={() => setSelectedId(employee.id)}
                      className="cursor-pointer"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <PersonAvatar employee={employee} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {fullName(employee)}
                            </p>
                            <p className="text-muted-foreground truncate text-xs">
                              {employee.role}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">
                        {employee.department}
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden lg:table-cell">
                        {employee.homeSite}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">
                          {EMPLOYMENT_LABELS[employee.employmentType]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        <span className="font-medium">
                          {formatHours(summary?.weekHours ?? 0)}
                        </span>
                        <span className="text-muted-foreground">
                          {" "}
                          / {employee.weeklyTargetHours}h
                        </span>
                      </TableCell>
                      <TableCell className="hidden text-right tabular-nums xl:table-cell">
                        ${employee.hourlyRate.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <EmployeeStatusBadge status={employee.status} />
                      </TableCell>
                      <TableCell onClick={(event) => event.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Actions for ${fullName(employee)}`}
                            >
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Change status</DropdownMenuLabel>
                            <DropdownMenuItem
                              disabled={pending || employee.status === "active"}
                              onSelect={() => changeStatus(employee, "active")}
                            >
                              Active
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={pending || employee.status === "on-leave"}
                              onSelect={() => changeStatus(employee, "on-leave")}
                            >
                              On leave
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={pending || employee.status === "inactive"}
                              onSelect={() => changeStatus(employee, "inactive")}
                            >
                              Inactive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onSelect={() => setSelectedId(employee.id)}
                            >
                              View details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <p className="text-muted-foreground text-xs">
        Showing {filtered.length} of {employees.length} teammates.
      </p>

      <Sheet
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected ? (
            <EmployeeDetailPanel
              employee={selected}
              summary={summaries[selected.id]}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function EmployeeDetailPanel({
  employee,
  summary,
}: {
  employee: Employee;
  summary?: EmployeeSummary;
}) {
  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <PersonAvatar employee={employee} className="size-11" />
          <div className="min-w-0">
            <SheetTitle className="truncate">{fullName(employee)}</SheetTitle>
            <SheetDescription className="truncate">
              {employee.role} · {employee.department}
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="flex flex-col gap-5 px-4 pb-6">
        <div className="flex flex-wrap gap-2">
          <EmployeeStatusBadge status={employee.status} />
          <Badge variant="outline">{EMPLOYMENT_LABELS[employee.employmentType]}</Badge>
          <Badge variant="outline">{employee.homeSite}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MiniStat
            label="Scheduled this week"
            value={formatHours(summary?.weekHours ?? 0)}
            hint={`${employee.weeklyTargetHours}h target`}
          />
          <MiniStat
            label="Projected pay"
            value={formatCurrency(summary?.weekCost ?? 0)}
            hint={`$${employee.hourlyRate.toFixed(2)}/hr`}
          />
          <MiniStat
            label="Worked, last 30 days"
            value={formatHours(summary?.hoursLast30Days ?? 0)}
            hint="Approved and pending"
          />
          <MiniStat
            label="Awaiting approval"
            value={`${summary?.pendingEntries ?? 0}`}
            hint="Timesheet entries"
          />
        </div>

        <Separator />

        <div className="grid gap-2 text-sm">
          <a
            href={`mailto:${employee.email}`}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
          >
            <Mail className="size-4 shrink-0" />
            <span className="truncate">{employee.email}</span>
          </a>
          {employee.phone ? (
            <a
              href={`tel:${employee.phone.replace(/[^\d+]/g, "")}`}
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <Phone className="size-4 shrink-0" />
              <span>{employee.phone}</span>
            </a>
          ) : null}
          <p className="text-muted-foreground flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0" />
            <span>Started {formatShortDate(employee.startDate)}</span>
          </p>
        </div>

        {employee.certifications.length > 0 ? (
          <div>
            <p className="mb-2 text-sm font-medium">Certifications</p>
            <div className="flex flex-wrap gap-1.5">
              {employee.certifications.map((certification) => (
                <Badge key={certification} variant="secondary">
                  {certification}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <p className="mb-2 text-sm font-medium">Upcoming shifts</p>
          {summary && summary.upcomingShifts.length > 0 ? (
            <ul className="flex flex-col gap-1.5">
              {summary.upcomingShifts.map((shift) => (
                <li
                  key={shift.id}
                  className="bg-muted/50 flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{formatShortDate(shift.date)}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {shift.site}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums">
                    {formatTime(shift.start)} – {formatTime(shift.end)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground bg-muted/50 rounded-lg px-3 py-4 text-sm">
              Nothing scheduled yet. Add a shift from the schedule board.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

function MiniStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="bg-muted/50 rounded-lg px-3 py-2.5">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
      <p className="text-muted-foreground/80 text-xs">{hint}</p>
    </div>
  );
}
