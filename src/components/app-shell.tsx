"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CalendarRange,
  ClipboardCheck,
  LayoutDashboard,
  Menu,
  Users,
  Waves,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Dashboard",
    description: "Coverage at a glance",
    icon: LayoutDashboard,
  },
  {
    href: "/schedule",
    label: "Schedule",
    description: "Build the week",
    icon: CalendarRange,
  },
  {
    href: "/people",
    label: "People",
    description: "Roster and rates",
    icon: Users,
  },
  {
    href: "/timesheets",
    label: "Timesheets",
    description: "Review and approve",
    icon: ClipboardCheck,
  },
] as const;

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl shadow-sm">
        <Waves className="size-5" />
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-tight">
          BlueRise
        </span>
        <span className="text-muted-foreground block text-xs">
          Workforce Operations
        </span>
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="mt-0.5 size-4 shrink-0" />
            <span className="leading-tight">
              <span className="block">{item.label}</span>
              <span className="text-muted-foreground/80 hidden text-xs lg:block">
                {item.description}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="border-sidebar-border bg-card/60 rounded-xl border p-3">
      <p className="text-sm font-medium">Pacific Northwest region</p>
      <p className="text-muted-foreground mt-0.5 text-xs">
        4 sites · Signed in as Ops Manager
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-dvh">
      <aside className="bg-sidebar border-sidebar-border sticky top-0 hidden h-dvh w-64 shrink-0 flex-col justify-between border-r px-4 py-5 lg:flex">
        <div className="flex flex-col gap-7">
          <Brand />
          <NavLinks />
        </div>
        <SidebarFooter />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-background/85 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-4 backdrop-blur lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 px-4 py-5">
              <SheetHeader className="sr-only">
                <SheetTitle>BlueRise navigation</SheetTitle>
              </SheetHeader>
              <div className="flex h-full flex-col justify-between">
                <div className="flex flex-col gap-7">
                  <Brand />
                  <NavLinks onNavigate={() => setMobileOpen(false)} />
                </div>
                <SidebarFooter />
              </div>
            </SheetContent>
          </Sheet>
          <Brand />
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
