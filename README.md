# BlueRise Workforce

A workforce operations console for a multi-site field services company. It covers the
loop a scheduling manager actually runs each week: look at coverage, fill the gaps,
publish the schedule, then approve the hours that come back.

## What's in it

**Dashboard** — Headcount, scheduled hours against last week, unfilled shifts, and
pending approvals, plus a coverage bar for each day of the week, a "needs attention"
panel, and today's shift list.

**Schedule** — A Monday-to-Sunday grid with one row per teammate and a dedicated row
for open shifts. Click an empty cell to add a shift or an existing shift to edit or
remove it. Filter by site or department, page between weeks, and publish drafts to the
crew. Weekly hour pills flag anyone under target or over 40 hours.

**People** — The roster with search across names, roles, sites, and certifications,
plus department and status filters. Selecting a row opens a detail panel with contact
info, certifications, projected pay, and upcoming shifts. Statuses can be moved between
active, on leave, and inactive.

**Timesheets** — Clocked hours for a week compared against what was scheduled, with the
variance called out. Approve or reject entries one at a time, reopen a decision, or
approve everything pending for the week at once.

## Running it locally

```bash
npm install
npm run dev
```

The app serves on [http://localhost:43127](http://localhost:43127).

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build on port 43127
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Data

There is no database and no external service to configure. On first read the app seeds
a realistic roster of fourteen people across four sites, along with three weeks of
shifts and the timesheet entries those shifts produced, and writes it to
`.data/workforce.json`. Every change you make in the UI is written back to that file, so
edits survive a restart.

The seed is anchored to the current week, so the schedule always opens on live-looking
data. To start over, delete `.data/workforce.json` and reload — it will be rebuilt on the
next request.

Because the store is a single JSON file behind a serialized read/write queue, it is
meant for a single-instance dev setup. Swapping `src/lib/store.ts` for a real database is
the natural next step; nothing outside that file reads or writes the data directly.

## Stack

Next.js 16 (App Router, React Server Components, Server Actions), React 19, TypeScript,
Tailwind CSS v4, and shadcn/ui.

Layout of the source:

```
src/app/            routes (dashboard, schedule, people, timesheets) and server actions
src/components/     app shell, shared UI, and one folder per feature area
src/components/ui/  shadcn/ui primitives
src/lib/            types, date and hour math, the JSON store, and derived metrics
```

Dates are handled as plain `yyyy-mm-dd` strings and times as `HH:mm` throughout, so the
schedule never shifts when a browser sits in a different time zone. Shifts whose end time
is earlier than their start are treated as running past midnight.
