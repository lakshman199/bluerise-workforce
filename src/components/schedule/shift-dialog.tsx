"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { createShift, deleteShift, updateShift } from "@/app/actions";
import { durationMinutes, formatHours } from "@/lib/date";
import type { Employee, Shift } from "@/lib/types";
import { fullName } from "@/lib/workforce";

export interface ShiftDraft {
  shift: Shift | null;
  date: string;
  employeeId: string | null;
}

/** Remounting the form per draft keeps every field seeded from the clicked cell. */
function draftKey(draft: ShiftDraft): string {
  return draft.shift
    ? `edit-${draft.shift.id}`
    : `new-${draft.date}-${draft.employeeId ?? "open"}`;
}

export function ShiftDialog({
  draft,
  onOpenChange,
  employees,
  roles,
  sites,
}: {
  draft: ShiftDraft | null;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  roles: string[];
  sites: string[];
}) {
  return (
    <Dialog open={Boolean(draft)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        {draft ? (
          <ShiftForm
            key={draftKey(draft)}
            draft={draft}
            employees={employees}
            roles={roles}
            sites={sites}
            onDone={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function ShiftForm({
  draft,
  employees,
  roles,
  sites,
  onDone,
}: {
  draft: ShiftDraft;
  employees: Employee[];
  roles: string[];
  sites: string[];
  onDone: () => void;
}) {
  const editing = draft.shift;
  const preselected = editing?.employeeId ?? draft.employeeId ?? null;
  const match = employees.find((employee) => employee.id === preselected) ?? null;

  const [employeeId, setEmployeeId] = useState(match ? match.id : "open");
  const [role, setRole] = useState(editing?.role ?? match?.role ?? roles[0] ?? "");
  const [site, setSite] = useState(
    editing?.site ?? match?.homeSite ?? sites[0] ?? "",
  );
  const [start, setStart] = useState(editing?.start ?? "08:00");
  const [end, setEnd] = useState(editing?.end ?? "16:00");
  const [breakMinutes, setBreakMinutes] = useState(`${editing?.breakMinutes ?? 30}`);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const paidMinutes = Math.max(
    0,
    durationMinutes(start, end) - (Number.parseInt(breakMinutes, 10) || 0),
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("employeeId", employeeId);
    formData.set("role", role);
    formData.set("site", site);

    startTransition(async () => {
      const result = editing
        ? await updateShift(formData)
        : await createShift(formData);
      if (result.ok) {
        toast.success(editing ? "Shift updated" : "Shift added to the schedule");
        onDone();
      } else {
        setError(result.error);
      }
    });
  }

  function handleDelete() {
    if (!editing) return;
    startTransition(async () => {
      await deleteShift(editing.id);
      toast.success("Shift removed");
      onDone();
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{editing ? "Edit shift" : "Add a shift"}</DialogTitle>
        <DialogDescription>
          Leave the teammate unassigned to post this as an open shift the crew can pick
          up.
        </DialogDescription>
      </DialogHeader>

      <form id="shift-form" onSubmit={handleSubmit} className="grid gap-4">
        {editing ? <input type="hidden" name="id" value={editing.id} /> : null}

        <div className="grid gap-2">
          <Label htmlFor="shift-employee">Teammate</Label>
          <Select value={employeeId} onValueChange={setEmployeeId}>
            <SelectTrigger id="shift-employee" className="w-full">
              <SelectValue placeholder="Select a teammate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open shift — unassigned</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {fullName(employee)} · {employee.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="shift-date">Date</Label>
            <Input
              id="shift-date"
              name="date"
              type="date"
              required
              defaultValue={editing?.date ?? draft.date}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="shift-break">Unpaid break (minutes)</Label>
            <Input
              id="shift-break"
              name="breakMinutes"
              type="number"
              min={0}
              max={240}
              step={5}
              value={breakMinutes}
              onChange={(event) => setBreakMinutes(event.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="shift-start">Starts</Label>
            <Input
              id="shift-start"
              name="start"
              type="time"
              required
              value={start}
              onChange={(event) => setStart(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="shift-end">Ends</Label>
            <Input
              id="shift-end"
              name="end"
              type="time"
              required
              value={end}
              onChange={(event) => setEnd(event.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="shift-role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="shift-role" className="w-full">
                <SelectValue placeholder="Select a role" />
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
            <Label htmlFor="shift-site">Site</Label>
            <Select value={site} onValueChange={setSite}>
              <SelectTrigger id="shift-site" className="w-full">
                <SelectValue placeholder="Select a site" />
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
        </div>

        <div className="grid gap-2">
          <Label htmlFor="shift-notes">Notes</Label>
          <Textarea
            id="shift-notes"
            name="notes"
            rows={2}
            placeholder="Certifications, gate codes, or anything the crew needs before arriving."
            defaultValue={editing?.notes ?? ""}
          />
        </div>

        <p className="text-muted-foreground text-xs">
          Paid time on this shift: {formatHours(paidMinutes / 60)}.
          {durationMinutes(start, end) < 60
            ? " That is unusually short — double-check the times."
            : ""}
        </p>

        {error ? (
          <p
            role="alert"
            className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm"
          >
            {error}
          </p>
        ) : null}
      </form>

      <DialogFooter className="sm:justify-between">
        {editing ? (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={pending}
          >
            <Trash2 data-icon="inline-start" />
            Remove
          </Button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onDone} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" form="shift-form" disabled={pending}>
            {pending ? "Saving…" : editing ? "Save changes" : "Add shift"}
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
