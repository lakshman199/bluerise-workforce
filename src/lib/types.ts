export type EmploymentType = "full-time" | "part-time" | "contract";

export type EmployeeStatus = "active" | "on-leave" | "inactive";

export type TimeEntryStatus = "pending" | "approved" | "rejected";

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  homeSite: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  hourlyRate: number;
  weeklyTargetHours: number;
  startDate: string;
  certifications: string[];
}

/** An unassigned shift has `employeeId: null` and shows up in the open-shift row. */
export interface Shift {
  id: string;
  employeeId: string | null;
  date: string;
  start: string;
  end: string;
  breakMinutes: number;
  role: string;
  site: string;
  notes: string;
  published: boolean;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  shiftId: string | null;
  date: string;
  clockIn: string;
  clockOut: string;
  breakMinutes: number;
  status: TimeEntryStatus;
  note: string;
}

export interface WorkforceData {
  employees: Employee[];
  shifts: Shift[];
  timeEntries: TimeEntry[];
}

export const DEPARTMENTS = [
  "Field Operations",
  "Facilities",
  "Logistics",
  "Dispatch",
  "Safety & Compliance",
] as const;

export const SITES = [
  "Harbor Point Tower",
  "Riverside Logistics Hub",
  "Northgate Campus",
  "Westline Depot",
] as const;

export const ROLES = [
  "Field Technician",
  "Crew Lead",
  "Site Supervisor",
  "Dispatcher",
  "Facilities Attendant",
  "Warehouse Associate",
  "Safety Inspector",
] as const;

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  "full-time",
  "part-time",
  "contract",
];

export const EMPLOYEE_STATUSES: EmployeeStatus[] = [
  "active",
  "on-leave",
  "inactive",
];

/** Hours past this in a single week count as overtime for reporting. */
export const OVERTIME_THRESHOLD_HOURS = 40;
