# P1 Offer List — Gap Closure Prompt

You are working on the P1.1 Offer List in `kigo-pro-dashboard/components/features/offer-manager/offer-list-p1/`.

## Context

The P1 offer list currently has: fuzzy search + semantic search, status/merchant/type filters, row-click edit navigation (via localStorage handoff to wizard at `?version=p1.1&edit={id}`), sessionStorage state persistence, loading/empty/error states, expired/archived row dimming (opacity-60), single + bulk delete dialogs, and toggle publish/draft.

The offer list routing lives at `app/offer-manager/page.tsx` with `?version=p1.1` for list view.

Shared types and config: `lib/constants/offer-templates.ts` (OfferType, OfferStatus, OFFER_TYPE_CONFIG, etc.)

## Gaps to Close (Priority Order)

### 1. Add Offer Type + Redemption Type Columns to List Grid

**File:** `offer-list-p1/offerListColumns.tsx`
**Why:** P0 Skateboard requirement — the list must show what type each offer is and how it's redeemed. Currently only shows: Status, Offer Name, Merchant Name, Redemptions, End Date, Actions.

- Add **Offer Type** column after Merchant Name — display the human-readable label from `OFFER_TYPE_CONFIG[offer.offerType]?.shortLabel` with a small icon. For types NOT in OFFER_TYPE_CONFIG (created outside wizard — e.g., CPG Spend & Get, DPO, Lightning, Frequency-Based, Celebrations, Multi-Catalog), display the raw type string in a neutral gray badge with "Other" fallback. Never show "unknown" or blank.
- Add **Redemption Type** column after Offer Type — the mock data needs a new `redemptionType` field. Production types are: `online_code`, `airdrop`, `gift_card`, `card_linked`, `stripe_checkout`, `augeo_fulfillment`, `sms_notification`. Display with human-readable labels. Same graceful fallback for unknown types.
- Update `OfferListItem` interface in mock data to include `redemptionType: string`
- Update `offerListMockData.ts` to populate redemptionType across all 110 mock offers with realistic distribution

### 2. Expand Status System to 5 States

**Files:** `offerListColumns.tsx`, `offerListMockData.ts`, `OfferListSearchBar.tsx`
**Why:** P0 Skateboard specifies Published, Draft, Expired, Paused, Pending Approval. Current implementation has Published, Draft, Expired, Archived.

- Replace `archived` with `paused` in the OfferStatus type (in offer-templates.ts or local type)
- Add `pending_approval` status
- Status badge colors: Published (green), Draft (amber), Expired (red/gray), Paused (blue), Pending Approval (purple)
- Update status filter in OfferListSearchBar to show all 5 statuses individually instead of grouping as "Published vs Inactive"
- Paused rows should show reduced opacity (like expired) — these offers are intentionally held
- Pending Approval rows should have a subtle highlight or left-border accent to draw attention
- Update mock data with realistic distribution including some paused and pending_approval offers
- Update the status toggle action: Published offers can be Paused (not toggled to Draft). Draft offers get "Submit for Review" action instead of direct publish.

### 3. Add Category + Performance + Date Range Filters

**File:** `OfferListSearchBar.tsx`
**Why:** PRD P1.1 specifies "Find offers by category, status, performance." Current filters cover merchant, type, and status only.

- **Category filter**: Add filter category for offer categories (Discounts, Bundles & Combos, Loyalty Rewards, Promotional). Map offer types to categories using `OFFER_TYPE_CONFIG[type].category`. Color: teal badge.
- **Performance filter**: Add filter category with three tiers: High (100+ redemptions), Medium (10-99), Low (0-9). Evaluate against `offer.redemptions`. Color: orange badge.
- **Date range filter**: Add filter for offer end dates — options: "Expiring This Week", "Expiring This Month", "Expiring in 30 Days", "No Expiration", plus custom date range. Color: indigo badge.
- **Redemption type filter**: Add filter for redemption methods matching the new column values. Color: pink badge.
- All new filter categories follow the existing pattern: colored badges, icons, AND across categories / OR within.

### 4. Unsupported Type Treatment on List Rows

**File:** `offerListColumns.tsx`, `OfferListView.tsx`
**Why:** Scooter P1 requirement — "Types created elsewhere still display cleanly. The list never shows 'unknown' or blank type fields."

- For offer types NOT in OFFER_TYPE_CONFIG, render a neutral gray badge with the raw type name (title-cased, underscores to spaces)
- For redemption types not in a known set, same treatment
- Add a small info tooltip: "This offer type was created outside the wizard" so users aren't confused
- Ensure new platform types don't break layout — use `max-w-[160px] truncate` on type badges

### 5. Draft Resume Entry Point

**File:** `offerListColumns.tsx` (actions dropdown), `OfferListView.tsx`
**Why:** PRD P1.1 — "Resume incomplete offers, review before publish."

- For offers with status `draft`, the row click and "Edit" action should navigate to wizard with `?version=p1.1&edit={id}` (already works)
- Add a visual indicator on draft rows: small "Resume" label or icon next to the offer name suggesting the user can pick up where they left off
- The actions dropdown for drafts should show "Resume Editing" instead of "Edit Offer"
- Drafts should show "Submit for Review" in actions (ties into approval workflow)

### 6. Remove Clone from Actions Dropdown

**File:** `offerListColumns.tsx`
**Why:** P0 Skateboard says "Remove Clone Offer from actions dropdown." Clone returns later at Car (P3) with performance context gating.

- If Clone is currently in the actions dropdown, remove it
- The clone navigation logic can remain in the codebase (dead code is fine) but the UI action should not be visible

### 7. Hide Bulk-Select Checkboxes

**File:** `OfferListTable.tsx`, `OfferListView.tsx`
**Why:** P0 Skateboard — "Hide bulk-select checkboxes until bulk actions ship (Bike P2) — avoid implying functionality that doesn't exist."

- If DataTable renders selection checkboxes, hide them
- OfferBulkActions component should not render
- Keep the code but gate it behind a feature flag or comment: `// P2: Bulk operations — hidden until Bike phase`

### 8. Expired Offer Treatment Enhancement

**Files:** `offerListColumns.tsx`, `OfferListView.tsx`
**Why:** Scooter P1 — expired offers need clear visual differentiation beyond opacity.

- Current: expired rows at 60% opacity (good)
- Add: a small "Expired" text badge in the status column with the end date ("Expired Jan 15")
- Expired offer actions should only show: "Clone" (when clone ships), "Delete", "View Details" — no edit, no publish toggle
- Consider: subtle strikethrough on the offer name for expired offers

## Constraints

- Do NOT modify files in `p1-wizard/` — that's Agent B's domain
- You CAN modify `lib/constants/offer-templates.ts` for shared types (OfferStatus, OfferType) but coordinate: Agent B may also need changes. Add types additively, don't remove existing ones.
- All changes must pass TypeScript compilation (`npx tsc --noEmit`)
- Maintain the existing OfferListSearchBar pattern (react-select AsyncCreatable, colored category badges)
- Mock data changes should be realistic — vary redemption types across offers, include all 5 statuses
