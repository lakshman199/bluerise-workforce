import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Employee } from "@/lib/types";
import { initials } from "@/lib/workforce";

const PALETTE = [
  "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200",
  "bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-200",
  "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200",
  "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200",
  "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200",
  "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200",
];

function paletteFor(id: string): string {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) % 997;
  }
  return PALETTE[hash % PALETTE.length];
}

export function PersonAvatar({
  employee,
  className,
}: {
  employee: Employee;
  className?: string;
}) {
  return (
    <Avatar className={cn("size-8", className)}>
      <AvatarFallback
        className={cn("text-[11px] font-semibold", paletteFor(employee.id))}
      >
        {initials(employee)}
      </AvatarFallback>
    </Avatar>
  );
}
