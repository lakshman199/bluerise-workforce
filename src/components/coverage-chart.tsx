import { formatDayNumber, formatHours, parseISODate, todayISO } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { CoverageDay } from "@/lib/workforce";

export function CoverageChart({ coverage }: { coverage: CoverageDay[] }) {
  const peak = Math.max(1, ...coverage.map((day) => day.hours));
  const today = todayISO();

  return (
    <div className="flex items-end gap-2 sm:gap-3">
      {coverage.map((day) => {
        const isToday = day.date === today;
        const heightPercent = Math.max(4, Math.round((day.hours / peak) * 100));
        return (
          <div key={day.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <span className="text-muted-foreground text-[11px] tabular-nums">
              {day.hours > 0 ? formatHours(day.hours) : "—"}
            </span>
            <div className="bg-muted flex h-32 w-full items-end overflow-hidden rounded-md">
              <div
                className={cn(
                  "w-full rounded-md transition-all",
                  isToday ? "bg-primary" : "bg-primary/35",
                )}
                style={{ height: `${heightPercent}%` }}
              />
            </div>
            <div className="text-center leading-tight">
              <span
                className={cn(
                  "block text-[11px] font-medium",
                  isToday ? "text-primary" : "text-muted-foreground",
                )}
              >
                {parseISODate(day.date).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </span>
              <span className="text-muted-foreground/70 block text-[11px] tabular-nums">
                {formatDayNumber(day.date)}
              </span>
            </div>
            <span
              className={cn(
                "text-[11px] tabular-nums",
                day.openShifts > 0
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground/60",
              )}
            >
              {day.openShifts > 0 ? `${day.openShifts} open` : `${day.headcount} on`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
