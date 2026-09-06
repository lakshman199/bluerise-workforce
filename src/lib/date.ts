export const WEEKDAY_LABELS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

/** Dates are handled as plain `yyyy-mm-dd` strings so the schedule never shifts across time zones. */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(iso: string, days: number): string {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function todayISO(): string {
  return toISODate(new Date());
}

/** Weeks run Monday through Sunday. */
export function startOfWeek(iso: string): string {
  const date = parseISODate(iso);
  const offset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - offset);
  return toISODate(date);
}

export function weekDates(weekStart: string): string[] {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

export function isWeekend(iso: string): boolean {
  const day = parseISODate(iso).getDay();
  return day === 0 || day === 6;
}

export function formatDayNumber(iso: string): string {
  return `${parseISODate(iso).getDate()}`;
}

export function formatShortDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatLongDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatWeekRange(weekStart: string): string {
  const start = parseISODate(weekStart);
  const end = parseISODate(addDays(weekStart, 6));
  const sameMonth = start.getMonth() === end.getMonth();
  const startLabel = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endLabel = end.toLocaleDateString("en-US", {
    month: sameMonth ? undefined : "short",
    day: "numeric",
    year: "numeric",
  });
  return `${startLabel} – ${endLabel}`;
}

export function minutesFromTime(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/** Shifts that end earlier than they start are treated as running past midnight. */
export function durationMinutes(start: string, end: string): number {
  const startMinutes = minutesFromTime(start);
  const endMinutes = minutesFromTime(end);
  return endMinutes > startMinutes
    ? endMinutes - startMinutes
    : endMinutes + 24 * 60 - startMinutes;
}

export function paidHours(
  start: string,
  end: string,
  breakMinutes: number,
): number {
  return Math.max(0, durationMinutes(start, end) - breakMinutes) / 60;
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return minutes === 0
    ? `${displayHour}${suffix.toLowerCase()}`
    : `${displayHour}:${`${minutes}`.padStart(2, "0")}${suffix.toLowerCase()}`;
}

export function formatHours(hours: number): string {
  const rounded = Math.round(hours * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}h` : `${rounded.toFixed(1)}h`;
}

export function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return toISODate(parseISODate(value)) === value;
}

export function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}
