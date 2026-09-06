import {
  addDays,
  paidHours,
  startOfWeek,
  todayISO,
  weekDates,
} from "./date";
import {
  OVERTIME_THRESHOLD_HOURS,
  type Employee,
  type Shift,
  type TimeEntry,
  type WorkforceData,
} from "./types";

export function fullName(employee: Employee): string {
  return `${employee.firstName} ${employee.lastName}`;
}

export function initials(employee: Employee): string {
  return `${employee.firstName[0] ?? ""}${employee.lastName[0] ?? ""}`.toUpperCase();
}

export function shiftHours(shift: Shift): number {
  return paidHours(shift.start, shift.end, shift.breakMinutes);
}

export function entryHours(entry: TimeEntry): number {
  return paidHours(entry.clockIn, entry.clockOut, entry.breakMinutes);
}

export function employeeMap(employees: Employee[]): Map<string, Employee> {
  return new Map(employees.map((employee) => [employee.id, employee]));
}

export function sortEmployees(employees: Employee[]): Employee[] {
  const statusRank = { active: 0, "on-leave": 1, inactive: 2 } as const;
  return [...employees].sort(
    (a, b) =>
      statusRank[a.status] - statusRank[b.status] ||
      a.lastName.localeCompare(b.lastName),
  );
}

export function shiftsInWeek(shifts: Shift[], weekStart: string): Shift[] {
  const weekEnd = addDays(weekStart, 6);
  return shifts.filter((shift) => shift.date >= weekStart && shift.date <= weekEnd);
}

export function entriesInWeek(entries: TimeEntry[], weekStart: string): TimeEntry[] {
  const weekEnd = addDays(weekStart, 6);
  return entries.filter((entry) => entry.date >= weekStart && entry.date <= weekEnd);
}

export interface ScheduleRow {
  employee: Employee;
  shiftsByDate: Record<string, Shift[]>;
  totalHours: number;
}

export interface WeekSchedule {
  weekStart: string;
  dates: string[];
  rows: ScheduleRow[];
  openShiftsByDate: Record<string, Shift[]>;
  openShiftCount: number;
  scheduledHours: number;
  unpublishedCount: number;
}

export interface ScheduleFilters {
  site?: string;
  department?: string;
}

export function buildWeekSchedule(
  data: WorkforceData,
  weekStart: string,
  filters: ScheduleFilters = {},
): WeekSchedule {
  const dates = weekDates(weekStart);
  const weekShifts = shiftsInWeek(data.shifts, weekStart).filter((shift) => {
    if (filters.site && shift.site !== filters.site) return false;
    return true;
  });

  const staffed = sortEmployees(
    data.employees.filter((employee) => {
      if (employee.status === "inactive") return false;
      if (filters.department && employee.department !== filters.department) {
        return false;
      }
      if (filters.site) {
        const worksSite =
          employee.homeSite === filters.site ||
          weekShifts.some((shift) => shift.employeeId === employee.id);
        if (!worksSite) return false;
      }
      return true;
    }),
  );

  const rows: ScheduleRow[] = staffed.map((employee) => {
    const shiftsByDate: Record<string, Shift[]> = {};
    for (const date of dates) shiftsByDate[date] = [];

    let totalHours = 0;
    for (const shift of weekShifts) {
      if (shift.employeeId !== employee.id) continue;
      shiftsByDate[shift.date]?.push(shift);
      totalHours += shiftHours(shift);
    }
    for (const date of dates) {
      shiftsByDate[date].sort((a, b) => a.start.localeCompare(b.start));
    }

    return { employee, shiftsByDate, totalHours };
  });

  const openShiftsByDate: Record<string, Shift[]> = {};
  for (const date of dates) openShiftsByDate[date] = [];
  let openShiftCount = 0;
  for (const shift of weekShifts) {
    if (shift.employeeId !== null) continue;
    openShiftsByDate[shift.date]?.push(shift);
    openShiftCount += 1;
  }

  return {
    weekStart,
    dates,
    rows,
    openShiftsByDate,
    openShiftCount,
    scheduledHours: weekShifts.reduce((total, shift) => total + shiftHours(shift), 0),
    unpublishedCount: weekShifts.filter((shift) => !shift.published).length,
  };
}

export interface CoverageDay {
  date: string;
  hours: number;
  headcount: number;
  openShifts: number;
}

export interface OvertimeRisk {
  employee: Employee;
  hours: number;
}

export interface DashboardMetrics {
  weekStart: string;
  activeHeadcount: number;
  onLeaveCount: number;
  scheduledHours: number;
  previousScheduledHours: number;
  openShiftCount: number;
  openShiftHours: number;
  pendingCount: number;
  pendingHours: number;
  projectedLaborCost: number;
  coverage: CoverageDay[];
  overtimeRisks: OvertimeRisk[];
  todaysShifts: Array<{ shift: Shift; employee: Employee | null }>;
  unpublishedCount: number;
}

export function buildDashboardMetrics(
  data: WorkforceData,
  weekStart = startOfWeek(todayISO()),
): DashboardMetrics {
  const byId = employeeMap(data.employees);
  const dates = weekDates(weekStart);
  const weekShifts = shiftsInWeek(data.shifts, weekStart);
  const previousShifts = shiftsInWeek(data.shifts, addDays(weekStart, -7));
  const today = todayISO();

  const coverage: CoverageDay[] = dates.map((date) => {
    const dayShifts = weekShifts.filter((shift) => shift.date === date);
    return {
      date,
      hours: dayShifts.reduce((total, shift) => total + shiftHours(shift), 0),
      headcount: new Set(
        dayShifts.filter((shift) => shift.employeeId).map((shift) => shift.employeeId),
      ).size,
      openShifts: dayShifts.filter((shift) => shift.employeeId === null).length,
    };
  });

  const hoursByEmployee = new Map<string, number>();
  let projectedLaborCost = 0;
  for (const shift of weekShifts) {
    if (!shift.employeeId) continue;
    const hours = shiftHours(shift);
    hoursByEmployee.set(
      shift.employeeId,
      (hoursByEmployee.get(shift.employeeId) ?? 0) + hours,
    );
    projectedLaborCost += hours * (byId.get(shift.employeeId)?.hourlyRate ?? 0);
  }

  const overtimeRisks: OvertimeRisk[] = [...hoursByEmployee.entries()]
    .filter(([, hours]) => hours > OVERTIME_THRESHOLD_HOURS)
    .map(([employeeId, hours]) => ({ employee: byId.get(employeeId)!, hours }))
    .filter((risk) => Boolean(risk.employee))
    .sort((a, b) => b.hours - a.hours);

  const pending = data.timeEntries.filter((entry) => entry.status === "pending");
  const openShifts = weekShifts.filter((shift) => shift.employeeId === null);

  return {
    weekStart,
    activeHeadcount: data.employees.filter((e) => e.status === "active").length,
    onLeaveCount: data.employees.filter((e) => e.status === "on-leave").length,
    scheduledHours: weekShifts.reduce((total, shift) => total + shiftHours(shift), 0),
    previousScheduledHours: previousShifts.reduce(
      (total, shift) => total + shiftHours(shift),
      0,
    ),
    openShiftCount: openShifts.length,
    openShiftHours: openShifts.reduce((total, shift) => total + shiftHours(shift), 0),
    pendingCount: pending.length,
    pendingHours: pending.reduce((total, entry) => total + entryHours(entry), 0),
    projectedLaborCost,
    coverage,
    overtimeRisks,
    todaysShifts: data.shifts
      .filter((shift) => shift.date === today)
      .sort((a, b) => a.start.localeCompare(b.start))
      .map((shift) => ({
        shift,
        employee: shift.employeeId ? (byId.get(shift.employeeId) ?? null) : null,
      })),
    unpublishedCount: weekShifts.filter((shift) => !shift.published).length,
  };
}

export interface TimesheetRow {
  entry: TimeEntry;
  employee: Employee;
  hours: number;
  scheduled: Shift | null;
  varianceMinutes: number;
}

export interface TimesheetWeek {
  weekStart: string;
  rows: TimesheetRow[];
  pendingCount: number;
  approvedHours: number;
  pendingHours: number;
  totalCost: number;
  overtimeEmployees: OvertimeRisk[];
}

export function buildTimesheetWeek(
  data: WorkforceData,
  weekStart: string,
): TimesheetWeek {
  const byId = employeeMap(data.employees);
  const shiftById = new Map(data.shifts.map((shift) => [shift.id, shift]));
  const entries = entriesInWeek(data.timeEntries, weekStart).sort(
    (a, b) => b.date.localeCompare(a.date) || a.clockIn.localeCompare(b.clockIn),
  );

  const rows: TimesheetRow[] = entries.flatMap((entry) => {
    const employee = byId.get(entry.employeeId);
    if (!employee) return [];
    const scheduled = entry.shiftId ? (shiftById.get(entry.shiftId) ?? null) : null;
    const hours = entryHours(entry);
    const varianceMinutes = scheduled
      ? Math.round((hours - shiftHours(scheduled)) * 60)
      : 0;
    return [{ entry, employee, hours, scheduled, varianceMinutes }];
  });

  const hoursByEmployee = new Map<string, number>();
  let approvedHours = 0;
  let pendingHours = 0;
  let totalCost = 0;

  for (const row of rows) {
    if (row.entry.status === "rejected") continue;
    hoursByEmployee.set(
      row.employee.id,
      (hoursByEmployee.get(row.employee.id) ?? 0) + row.hours,
    );
    totalCost += row.hours * row.employee.hourlyRate;
    if (row.entry.status === "approved") approvedHours += row.hours;
    else pendingHours += row.hours;
  }

  return {
    weekStart,
    rows,
    pendingCount: rows.filter((row) => row.entry.status === "pending").length,
    approvedHours,
    pendingHours,
    totalCost,
    overtimeEmployees: [...hoursByEmployee.entries()]
      .filter(([, hours]) => hours > OVERTIME_THRESHOLD_HOURS)
      .map(([employeeId, hours]) => ({ employee: byId.get(employeeId)!, hours }))
      .filter((risk) => Boolean(risk.employee))
      .sort((a, b) => b.hours - a.hours),
  };
}

export interface EmployeeDetail {
  employee: Employee;
  upcomingShifts: Shift[];
  weekHours: number;
  weekCost: number;
  hoursLast30Days: number;
  pendingEntries: number;
}

export function buildEmployeeDetail(
  data: WorkforceData,
  employeeId: string,
): EmployeeDetail | null {
  const employee = data.employees.find((candidate) => candidate.id === employeeId);
  if (!employee) return null;

  const today = todayISO();
  const weekStart = startOfWeek(today);
  const weekEnd = addDays(weekStart, 6);
  const thirtyDaysAgo = addDays(today, -30);

  const employeeShifts = data.shifts.filter(
    (shift) => shift.employeeId === employeeId,
  );
  const weekShifts = employeeShifts.filter(
    (shift) => shift.date >= weekStart && shift.date <= weekEnd,
  );
  const weekHours = weekShifts.reduce((total, shift) => total + shiftHours(shift), 0);

  return {
    employee,
    upcomingShifts: employeeShifts
      .filter((shift) => shift.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start))
      .slice(0, 6),
    weekHours,
    weekCost: weekHours * employee.hourlyRate,
    hoursLast30Days: data.timeEntries
      .filter(
        (entry) =>
          entry.employeeId === employeeId &&
          entry.status !== "rejected" &&
          entry.date >= thirtyDaysAgo,
      )
      .reduce((total, entry) => total + entryHours(entry), 0),
    pendingEntries: data.timeEntries.filter(
      (entry) => entry.employeeId === employeeId && entry.status === "pending",
    ).length,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
