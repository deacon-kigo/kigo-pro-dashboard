# Kigo Pro Dashboard — Design Guide

## Design Context

### Users

**Primary**: Internal Kigo operators (admins, support, PMs) managing merchants, offers, ads, campaigns, and publishers in the Kigo Pro platform. Power users in heavy-data tools — they spend hours per day in tables, forms, and detail views.

**Secondary**: Designers and engineers using this codebase as a prototype sandbox and design-system reference. Stakeholders viewing client-themed demos (CVS, merchant businesses).

**Context of use**: Desktop-first, multi-tasking across many records. Users are scanning long lists, drilling into detail, editing complex configurations. They value speed, scannability, and consistency more than visual novelty.

**Job to be done**: "Help me manage hundreds of merchants/offers/ads without drowning in detail — surface what matters, get me to the next action fast, and don't make me re-learn patterns on every screen."

### Brand Personality

**Three words**: confident, polished, practical.

**Voice**: professional but not stiff. Direct labels ("Create Merchant", "Save Changes"), helper text written like a colleague explaining, not a tooltip dump. Avoid marketing language inside the product UI.

**Emotional goals**:

- **Confidence** that the data is correct and actions will work
- **Calm** in dense screens — no decorative noise, no surprise modals
- **Familiarity** — consistent patterns across Offer Manager, Ad Manager, Campaign Manager, Merchant Manager so muscle memory carries across modules

**Brand**: Augeo is the current default brand (Midnight Blue + Neon Green). CVS, Kigo coral, and other client themes remain as theming layers — never let one client's palette leak into a different demo.

### Aesthetic Direction

**Visual tone**: dense admin tooling, closer to Linear / Vercel / Stripe Dashboard than to a marketing site. Inter, 14px base. Subtle shadows (`shadow-sm`/`shadow-md`), 1px borders in `border-gray-200`. Sparse use of color — color earns attention, it doesn't compete for it.

**Layout system**:

- **Aurora PageHeader** (gradient) — only for list/dashboard pages
- **Inline header bar** inside a Card (`bg-muted/20 h-[61px] p-3 border-b` + icon + h3 + subtitle + right-side actions) — for editor/create/edit/detail pages. Mirror this across Offer Manager, Ad Manager, TMT Campaign Editor, Merchant Detail.
- **Vertical sidebar** (`w-16` with `w-12 h-12` icon buttons, `bg-pastel-blue` active state, hover tooltips) — for multi-mode views (Ad Group wizard, Merchant Detail with Profile/Offers/Edit tabs)
- **Fixed viewport height pattern** — `overflow-hidden style={{ height: "calc(100vh - 140px)" }}` so the editor scrolls inside the Card, not the page

**Form patterns** (mirrors kigo-admin-tools production):

- Field structure: `<Label className="text-sm">` + `<Input className="mt-1">` + helper `<p className="mt-1.5 text-sm font-medium text-gray-600">`
- Required fields visible by default; optional fields tucked into a single Collapsible labelled "Optional Fields (Banner, Corp Name, URL, Highlights)"
- Reuse existing assets — offer-type illustrations from `/illustration/*.png` and `OFFER_TYPE_CONFIG`, not custom badges

**Density**: compact by default. `space-y-4` not `space-y-6`, `gap-2` not `gap-3`, `px-3 py-2` not `p-4`. Profile and detail views should feel scannable in one screen, not a tall scroll.

**Anti-references**: avoid Material Design density, marketing-page hero blocks inside the product, decorative gradients beyond the aurora header, and "delight" animations on functional actions. Don't reinvent patterns the production app (kigo-admin-tools) already established.

### Design Principles

1. **Match production patterns first.** Before designing anything, look at the equivalent screen in Offer Manager, Ad Manager, or kigo-admin-tools and mirror the structure. The user has built muscle memory across modules — break it only when there's a clear reason.

2. **Compact + scannable beats spacious.** Default to `text-sm`, `gap-2`, `px-3 py-2`. Tighter density lets users see more without scrolling. Reserve generous spacing for true breathing-room moments (callouts, empty states).

3. **A11y is non-negotiable for body text.** Helper text is `text-sm font-medium text-gray-600` minimum — never `text-xs text-muted-foreground` (12px low-contrast fails WCAG AA). Decorative icons get `aria-hidden="true"`. Icon-only buttons get `aria-label`.

4. **Reuse before inventing.** Use the design system's components (`Accordion`, `Collapsible`, `ReactSelectMulti`, `DataTable` with `enableColumnDrag`), illustration library (`/illustration/*.png` via `OFFER_TYPE_CONFIG`), and established layout patterns. New components only when nothing in the system fits.

5. **Less text, more visual hierarchy.** Replace text-heavy field rows with stat tiles, illustration cards, and focused callouts. A user scanning a Merchant Profile shouldn't have to read 10 label-value rows to find what they need.
