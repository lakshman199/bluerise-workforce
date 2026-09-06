import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EmployeeStatus, TimeEntryStatus } from "@/lib/types";

const EMPLOYEE_STATUS_STYLES: Record<EmployeeStatus, { label: string; className: string }> =
  {
    active: {
      label: "Active",
      className:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
    },
    "on-leave": {
      label: "On leave",
      className:
        "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200",
    },
    inactive: {
      label: "Inactive",
      className: "bg-muted text-muted-foreground",
    },
  };

const TIME_ENTRY_STATUS_STYLES: Record<
  TimeEntryStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200",
  },
  approved: {
    label: "Approved",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200",
  },
};

export function EmployeeStatusBadge({
  status,
  className,
}: {
  status: EmployeeStatus;
  className?: string;
}) {
  const style = EMPLOYEE_STATUS_STYLES[status];
  return (
    <Badge variant="secondary" className={cn(style.className, className)}>
      {style.label}
    </Badge>
  );
}

export function TimeEntryStatusBadge({
  status,
  className,
}: {
  status: TimeEntryStatus;
  className?: string;
}) {
  const style = TIME_ENTRY_STATUS_STYLES[status];
  return (
    <Badge variant="secondary" className={cn(style.className, className)}>
      {style.label}
    </Badge>
  );
}
