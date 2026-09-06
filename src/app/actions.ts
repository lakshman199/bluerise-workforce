"use server";

import { revalidatePath } from "next/cache";

import { isValidISODate, isValidTime } from "@/lib/date";
import { createId, mutateData, resetData } from "@/lib/store";
import {
  EMPLOYEE_STATUSES,
  EMPLOYMENT_TYPES,
  type EmployeeStatus,
  type EmploymentType,
  type TimeEntryStatus,
} from "@/lib/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

function revalidateAll() {
  revalidatePath("/", "layout");
}

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(formData: FormData, key: string): number {
  return Number.parseFloat(readText(formData, key));
}

export async function createShift(formData: FormData): Promise<ActionResult> {
  const employeeId = readText(formData, "employeeId");
  const date = readText(formData, "date");
  const start = readText(formData, "start");
  const end = readText(formData, "end");
  const role = readText(formData, "role");
  const site = readText(formData, "site");
  const breakMinutes = readNumber(formData, "breakMinutes");

  if (!isValidISODate(date)) return { ok: false, error: "Pick a valid date." };
  if (!isValidTime(start) || !isValidTime(end)) {
    return { ok: false, error: "Start and end times must be valid." };
  }
  if (start === end) {
    return { ok: false, error: "A shift needs a start time different from its end." };
  }
  if (!role) return { ok: false, error: "Choose a role for this shift." };
  if (!site) return { ok: false, error: "Choose a site for this shift." };

  await mutateData((data) => {
    if (employeeId && employeeId !== "open") {
      const exists = data.employees.some((employee) => employee.id === employeeId);
      if (!exists) throw new Error("That teammate is no longer on the roster.");
    }
    data.shifts.push({
      id: createId("sft"),
      employeeId: employeeId && employeeId !== "open" ? employeeId : null,
      date,
      start,
      end,
      breakMinutes: Number.isFinite(breakMinutes) ? Math.max(0, breakMinutes) : 0,
      role,
      site,
      notes: readText(formData, "notes"),
      published: false,
    });
  });

  revalidateAll();
  return { ok: true };
}

export async function updateShift(formData: FormData): Promise<ActionResult> {
  const id = readText(formData, "id");
  const employeeId = readText(formData, "employeeId");
  const date = readText(formData, "date");
  const start = readText(formData, "start");
  const end = readText(formData, "end");
  const breakMinutes = readNumber(formData, "breakMinutes");

  if (!isValidISODate(date)) return { ok: false, error: "Pick a valid date." };
  if (!isValidTime(start) || !isValidTime(end)) {
    return { ok: false, error: "Start and end times must be valid." };
  }
  if (start === end) {
    return { ok: false, error: "A shift needs a start time different from its end." };
  }

  const found = await mutateData((data) => {
    const shift = data.shifts.find((candidate) => candidate.id === id);
    if (!shift) return false;
    shift.employeeId = employeeId && employeeId !== "open" ? employeeId : null;
    shift.date = date;
    shift.start = start;
    shift.end = end;
    shift.breakMinutes = Number.isFinite(breakMinutes) ? Math.max(0, breakMinutes) : 0;
    shift.role = readText(formData, "role") || shift.role;
    shift.site = readText(formData, "site") || shift.site;
    shift.notes = readText(formData, "notes");
    return true;
  });

  if (!found) return { ok: false, error: "That shift no longer exists." };
  revalidateAll();
  return { ok: true };
}

export async function deleteShift(id: string): Promise<ActionResult> {
  await mutateData((data) => {
    data.shifts = data.shifts.filter((shift) => shift.id !== id);
    data.timeEntries = data.timeEntries.map((entry) =>
      entry.shiftId === id ? { ...entry, shiftId: null } : entry,
    );
  });
  revalidateAll();
  return { ok: true };
}

export async function publishWeek(weekStart: string): Promise<ActionResult> {
  if (!isValidISODate(weekStart)) {
    return { ok: false, error: "That week is not valid." };
  }
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  await mutateData((data) => {
    for (const shift of data.shifts) {
      if (shift.date >= weekStart && shift.date <= weekEnd.toISOString().slice(0, 10)) {
        shift.published = true;
      }
    }
  });
  revalidateAll();
  return { ok: true };
}

export async function createEmployee(formData: FormData): Promise<ActionResult> {
  const firstName = readText(formData, "firstName");
  const lastName = readText(formData, "lastName");
  const email = readText(formData, "email");
  const role = readText(formData, "role");
  const department = readText(formData, "department");
  const homeSite = readText(formData, "homeSite");
  const employmentType = readText(formData, "employmentType") as EmploymentType;
  const hourlyRate = readNumber(formData, "hourlyRate");
  const weeklyTargetHours = readNumber(formData, "weeklyTargetHours");

  if (!firstName || !lastName) {
    return { ok: false, error: "First and last name are both required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid work email address." };
  }
  if (!role || !department || !homeSite) {
    return { ok: false, error: "Role, department, and home site are required." };
  }
  if (!EMPLOYMENT_TYPES.includes(employmentType)) {
    return { ok: false, error: "Pick an employment type." };
  }
  if (!Number.isFinite(hourlyRate) || hourlyRate <= 0) {
    return { ok: false, error: "Hourly rate must be greater than zero." };
  }
  if (!Number.isFinite(weeklyTargetHours) || weeklyTargetHours <= 0) {
    return { ok: false, error: "Weekly target hours must be greater than zero." };
  }

  const duplicate = await mutateData((data) => {
    if (
      data.employees.some(
        (employee) => employee.email.toLowerCase() === email.toLowerCase(),
      )
    ) {
      return true;
    }
    data.employees.push({
      id: createId("emp"),
      firstName,
      lastName,
      email,
      phone: readText(formData, "phone"),
      role,
      department,
      homeSite,
      employmentType,
      status: "active",
      hourlyRate,
      weeklyTargetHours,
      startDate: readText(formData, "startDate") || new Date().toISOString().slice(0, 10),
      certifications: readText(formData, "certifications")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    });
    return false;
  });

  if (duplicate) {
    return { ok: false, error: "Someone on the roster already uses that email." };
  }

  revalidateAll();
  return { ok: true };
}

export async function setEmployeeStatus(
  id: string,
  status: EmployeeStatus,
): Promise<ActionResult> {
  if (!EMPLOYEE_STATUSES.includes(status)) {
    return { ok: false, error: "Unknown status." };
  }
  await mutateData((data) => {
    const employee = data.employees.find((candidate) => candidate.id === id);
    if (employee) employee.status = status;
  });
  revalidateAll();
  return { ok: true };
}

export async function setTimeEntryStatus(
  id: string,
  status: TimeEntryStatus,
): Promise<ActionResult> {
  await mutateData((data) => {
    const entry = data.timeEntries.find((candidate) => candidate.id === id);
    if (entry) entry.status = status;
  });
  revalidateAll();
  return { ok: true };
}

export async function approveWeek(weekStart: string): Promise<ActionResult> {
  if (!isValidISODate(weekStart)) {
    return { ok: false, error: "That week is not valid." };
  }
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekEndISO = weekEnd.toISOString().slice(0, 10);

  await mutateData((data) => {
    for (const entry of data.timeEntries) {
      if (
        entry.status === "pending" &&
        entry.date >= weekStart &&
        entry.date <= weekEndISO
      ) {
        entry.status = "approved";
      }
    }
  });
  revalidateAll();
  return { ok: true };
}

export async function resetDemoData(): Promise<ActionResult> {
  await resetData();
  revalidateAll();
  return { ok: true };
}
