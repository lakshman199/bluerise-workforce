# BlueRise Workforce — Design System

The design system lives in `packages/ui` as SCSS and CSS custom properties, with no
framework dependency, so the public site, the Portal, and the Admin app all consume the
same tokens. Angular components that wrap these styles live in
`apps/web/src/app/shared/ui` until a second Angular application exists to share them
with.

## Direction

BlueRise Workforce should read as modern enterprise workforce technology with a human
centre. The visual grammar is large confident typography, controlled whitespace, rounded
surfaces, hairline borders, restrained motion, and a small palette used deliberately.

The reference site `bluerise.io` informs the _quality bar_ — the spacing rhythm, the way
sections breathe, the weight of headings against body copy, the restraint in colour, the
card treatment, the sticky header behaviour. None of its content, imagery, iconography,
or markup is reproduced.

Explicitly avoided: cheap gradients, glassmorphism, animation for its own sake, default
Bootstrap shapes, arbitrary one-off colours, dense dashboards, small type, and unbroken
walls of text.

## Tokens

All tokens are CSS custom properties on `:root`, which makes them inspectable in
devtools, overridable per surface, and available to both SCSS and inline styles. SCSS
variables are used only where a value must exist at compile time, such as media query
breakpoints.

### Colour

The palette is a single blue ramp plus neutrals plus four semantic hues. "BlueRise"
makes a blue primary the obvious choice; the ramp is tuned so `--br-blue-600` on white
and white on `--br-blue-600` both clear WCAG AA for body text.

```
--br-blue-50 … --br-blue-900     Primary ramp
--br-neutral-0 … --br-neutral-950 Surfaces, borders, text
--br-success / --br-warning / --br-danger / --br-info  (each with -surface and -border)
```

Semantic aliases sit on top of the ramp, and components reference only the aliases:
`--br-color-text`, `--br-color-text-muted`, `--br-color-text-inverse`,
`--br-color-surface`, `--br-color-surface-raised`, `--br-color-surface-sunken`,
`--br-color-border`, `--br-color-border-strong`, `--br-color-primary`,
`--br-color-primary-hover`, `--br-color-focus`.

A component that references `--br-blue-600` directly is a bug: it defeats theming and
makes a dark surface impossible. Components reference aliases; aliases reference the
ramp.

### Typography

One family — Inter, with a system fallback stack — at two roles. A fluid type scale
using `clamp()` so headings shrink on small screens without a cascade of breakpoint
overrides.

```
--br-font-sans
--br-text-xs … --br-text-6xl
--br-leading-tight / -snug / -normal / -relaxed
--br-weight-regular / -medium / -semibold / -bold
--br-tracking-tight / -normal / -wide
```

Body copy is 16px minimum everywhere, including footers and captions. Line length is
capped around 68 characters via `--br-measure`.

### Spacing, radius, shadow, motion

A 4px base scale (`--br-space-1` = 4px through `--br-space-32` = 128px) plus section
rhythm tokens (`--br-section-y`, `--br-container-max`, `--br-gutter`). Radii from
`--br-radius-sm` to `--br-radius-full`. Four shadow levels, all low-contrast — heavy
drop shadows read as dated. Motion tokens (`--br-duration-fast|base|slow`,
`--br-ease-out`, `--br-ease-spring`) with every transition wrapped so that
`@media (prefers-reduced-motion: reduce)` collapses durations to near zero.

### Breakpoints

375, 390, 430, 768, 1024, 1280, 1440, and 1920 are the verification widths from the
specification. The layout system uses four actual breakpoints — 480, 768, 1024, 1280 —
and fluid sizing between them, which is what makes the eight verification widths work
without eight sets of overrides.

## Components

Phase 1 delivers the base layer, rendered live at `/design-system`:

Buttons (primary, secondary, ghost, danger; sm/md/lg; icon; loading; disabled), form
controls (text, email, tel, textarea, select, checkbox, radio, with label, hint, error,
and required marker), cards, badges, alerts, tables, tabs, tooltips, breadcrumbs,
pagination, modal, dropdown, skeletons, spinners, and the empty / loading / error state
patterns.

Later phases add composed application components — data table with sort and pagination,
stat tile, timeline, file upload, stepper — built from the same tokens.

## Accessibility

WCAG 2.1 AA is the target, treated as a build requirement rather than an audit item.

- Every interactive element has a visible focus ring: a 2px `--br-color-focus` outline
  with a 2px offset, never removed without an equivalent replacement.
- Body text meets 4.5:1 contrast; large text and UI boundaries meet 3:1. The blue ramp
  was chosen against these thresholds rather than adjusted afterwards.
- Touch targets are at least 44×44 CSS pixels.
- Form errors are associated with their input via `aria-describedby` and announced
  through a polite live region. Colour is never the only error signal — an icon and text
  accompany it.
- Headings follow document order with no skipped levels. One `h1` per page.
- The mobile menu traps focus while open, closes on `Escape`, and returns focus to the
  trigger.
- A skip link precedes the header.
- `prefers-reduced-motion` is honoured globally.
