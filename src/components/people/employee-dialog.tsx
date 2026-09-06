"use client";

import { useState, useTransition } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEmployee } from "@/app/actions";
import { EMPLOYMENT_TYPES } from "@/lib/types";

const EMPLOYMENT_LABELS: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
};

export function AddEmployeeDialog({
  roles,
  sites,
  departments,
}: {
  roles: string[];
  sites: string[];
  departments: string[];
}) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(roles[0] ?? "");
  const [department, setDepartment] = useState(departments[0] ?? "");
  const [homeSite, setHomeSite] = useState(sites[0] ?? "");
  const [employmentType, setEmploymentType] = useState<string>("full-time");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("role", role);
    formData.set("department", department);
    formData.set("homeSite", homeSite);
    formData.set("employmentType", employmentType);

    startTransition(async () => {
      const result = await createEmployee(formData);
      if (result.ok) {
        toast.success("Teammate added to the roster");
        form.reset();
        setError(null);
        setOpen(false);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setError(null);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <UserPlus data-icon="inline-start" />
          Add teammate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a teammate</DialogTitle>
          <DialogDescription>
            New hires start as active and become schedulable right away.
          </DialogDescription>
        </DialogHeader>

        <form id="employee-form" onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" required autoComplete="off" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" required autoComplete="off" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="name@bluerise.co"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" placeholder="(206) 555-0100" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="employee-role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="employee-role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="employee-department">Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger id="employee-department" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="employee-site">Home site</Label>
              <Select value={homeSite} onValueChange={setHomeSite}>
                <SelectTrigger id="employee-site" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="employee-type">Employment type</Label>
              <Select value={employmentType} onValueChange={setEmploymentType}>
                <SelectTrigger id="employee-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {EMPLOYMENT_LABELS[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="hourlyRate">Hourly rate (USD)</Label>
              <Input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                min={1}
                step={0.25}
                defaultValue={30}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weeklyTargetHours">Weekly target hours</Label>
              <Input
                id="weeklyTargetHours"
                name="weeklyTargetHours"
                type="number"
                min={1}
                max={60}
                defaultValue={40}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="certifications">Certifications</Label>
            <Input
              id="certifications"
              name="certifications"
              placeholder="OSHA 30, Forklift Class II"
            />
            <p className="text-muted-foreground text-xs">
              Separate multiple certifications with commas.
            </p>
          </div>

          {error ? (
            <p
              role="alert"
              className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm"
            >
              {error}
            </p>
          ) : null}
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button type="submit" form="employee-form" disabled={pending}>
            {pending ? "Adding…" : "Add teammate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
