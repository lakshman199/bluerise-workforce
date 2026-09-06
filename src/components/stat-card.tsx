import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  tone?: "neutral" | "positive" | "warning" | "critical";
}) {
  const toneClass = {
    neutral: "bg-primary/10 text-primary",
    positive:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    critical: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
  }[tone];

  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {label}
          </p>
          <p className="font-heading mt-2 text-2xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
          <p className="text-muted-foreground mt-1 text-xs text-pretty">{hint}</p>
        </div>
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            toneClass,
          )}
        >
          <Icon className="size-4.5" />
        </span>
      </CardContent>
    </Card>
  );
}
