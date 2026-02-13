# P1 Wizard (Creation & Edit) — Gap Closure Prompt

You are working on the P1.1 Offer Wizard in `kigo-pro-dashboard/components/features/offer-manager/p1-wizard/`.

## Context

The P1 wizard currently has: 4-step flow (Type → Merchant → Offer Content → Review), 7 offer types (dollar_off, percent_off, bogo, fixed_price, dollar_off_with_min, cashback, tiered_discount), smart auto-fill from merchant selection, create/edit/clone modes, type-specific form fields (minimum spend, cashback cap, tier builder), two image uploads (offer image + banner), character-limited text fields with live counters, and a polished review step with 3D tilt + gradient mesh.

Edit/clone loads from localStorage (`editOffer` key), marks all steps complete, jumps to review. Cancel returns to `?version=p1.1` (offer list).

Shared types and config: `lib/constants/offer-templates.ts` (OfferType, OfferStatus, OFFER_TYPE_CONFIG, smart templates, backend mappings).

## Gaps to Close (Priority Order)

### 1. Draft Save Mechanism (CRITICAL — #1 P1.1 Gap)

**Files:** `OfferManagerViewP1Wizard.tsx`, new UI in step footer
**Why:** PRD P1.1 core capability — "Save as unpublished draft. Resume incomplete offers, review before publish." Currently, closing the wizard loses ALL progress. Draft status exists in the list but has no creation path.

Implement:

- **"Save as Draft" button** in the wizard footer (alongside Back/Next/Publish) — visible on every step except Step 1 (type selection)
- **Draft save behavior**: Serialize current `formData` + `currentStep` + `completedSteps` to a draft object. Store in localStorage under `draftOffer-{id}` (generate UUID for new drafts, use existing ID for edits). Update the offer's status to `draft` in the mock data.
- **Auto-save**: Debounced auto-save (every 30 seconds of inactivity) that silently persists current state to localStorage. Show a subtle "Draft saved" toast/indicator.
- **Draft resume**: When navigating to `?version=p1.1&edit={id}` and the offer has status `draft`, load the draft data and navigate to the step where the user left off (using saved `currentStep`), NOT to review.
- **Unsaved changes warning**: When user clicks Cancel/"Back to Offers" with unsaved changes, show a confirmation dialog: "You have unsaved changes. Save as draft or discard?"
- **Draft indicator**: Show a small "Draft — Auto-saving" badge in the wizard header when working on an unpublished offer

### 2. Editable vs Locked Fields Post-Publish

**Files:** `OfferManagerViewP1Wizard.tsx`, `StepOfferType.tsx`, `StepMerchant.tsx`, `StepOfferContent.tsx`
**Why:** Scooter P1 — "Editable and locked fields are visually distinct with clear rationale."

When editing a PUBLISHED offer (mode === "edit" && original status was "published"):

- **Locked fields** (cannot change after publish):
  - Offer Type (Step 1) — show the selected type with a lock icon and message "Offer type cannot be changed after publishing. Create a new offer to use a different type."
  - Merchant (Step 2) — show selected merchant with lock icon and "Merchant cannot be changed after publishing."
  - Redemption Method — locked to original
- **Editable fields** (can change after publish):
  - Headline, Description, Terms
  - Discount value / tiers (with warning: "Changing discount on a live offer will affect all future redemptions")
  - Dates (can extend end date, cannot change start date if in the past)
  - Images
  - Promo code (with warning)
  - Categories, Commodities
  - Usage limits
- **Visual treatment**: Locked fields get `opacity-60`, `pointer-events-none`, and a small lock icon with tooltip explaining why
- **Step navigation**: In edit mode for published offers, Steps 1 and 2 should show a "Locked" indicator in the stepper instead of allowing click-through
- For DRAFT offers being edited, all fields remain editable (no locks)

### 3. Redemption Method Selector (NEW WIZARD SECTION)

**Files:** `StepOfferContent.tsx`, `OfferManagerViewP1Wizard.tsx` (formData), `offer-templates.ts` (types)
**Why:** PRD P1.3 — "All redemption methods." Currently hardcoded to Online only.

Add a **Redemption Method** section to StepOfferContent (in the "Dates & Redemption" area):

- **Available methods** (P1 scope):
  - `online_code` — "Online (Promo Code)" — default, current behavior
  - `in_store` — "In-Store (Show & Save)" — member shows offer on phone
  - `phone` — "Phone / Call-In" — member references promo over phone
  - `card_linked` — "Card-Linked (Show & Save)" — automatic discount on linked card
- **UI**: Radio group or segmented control. Default to `online_code`.
- **Conditional fields by method**:
  - `online_code`: Show Redemption URL + Promo Code fields (existing)
  - `in_store`: Show "Redemption Instructions" textarea (e.g., "Show this offer at checkout") + optional barcode field (text input for now, generation is P2)
  - `phone`: Show "Phone Number" input + "Redemption Instructions" textarea
  - `card_linked`: Show "Linked Card Network" dropdown (Visa, Mastercard, Amex, Discover) + "Activation Instructions" textarea
- **Form data**: Add `redemptionMethod: string` to formData. Update validation — each method has its own required fields.
- **Review step**: Show selected redemption method with method-specific details in the "How Customers Claim" section.
- **Smart default**: Auto-select `online_code` for new offers. For edits, load from offer data.
- **Treatment**: The selector should feel like guidance ("How will members claim this offer?"), not a technical dropdown.

### 4. Expanded Offer Types — Scooter Batch

**Files:** `offer-templates.ts`, `StepOfferType.tsx`, `StepOfferContent.tsx`, `StepReview.tsx`
**Why:** Scooter P1 — 5 additional types needed in wizard.

Add these to `OFFER_TYPE_CONFIG`:

1. **free_with_purchase** — "Free Item With Purchase"
   - Category: `bundle`
   - Fields: `freeItem` (text, "What do they get free?"), `purchaseRequirement` (text, "What must they buy?")
   - Example: "Free dessert with any entree"
   - Backend mapping: → `free_with_purchase`
   - Illustration: reuse bogo or create placeholder

2. **clickthrough** — "Clickthrough Offer"
   - Category: `promotional`
   - Fields: Standard discount value + `clickthroughUrl` (URL, "Where does the member go?")
   - Example: "Shop now and save — click to visit merchant site"
   - Backend mapping: → `clickthrough`
   - Minimal additional fields — this is a link-based offer

3. **cpg_spend_and_get** — "Spend & Get (CPG)"
   - Category: `loyalty`
   - Fields: `spendAmount` (dollar, "How much must they spend?"), `rewardValue` (dollar, "What do they get back?"), `qualifyingProducts` (text, "Which products qualify?")
   - Example: "Spend $25 on Tide products, get $5 back"
   - Backend mapping: → `spend_and_get`

4. **dpo** — "Discounted Product Offer"
   - Category: `discount`
   - Fields: `originalPrice` (dollar), `discountedPrice` (dollar), `productName` (text)
   - Example: "AirPods Pro — Was $249, Now $199"
   - Backend mapping: → `dpo`

5. **multi_catalog** — "Multi-Catalog Offer"
   - Category: `promotional`
   - Fields: `catalogSource` (dropdown: MCM, FMTC, EBG, RN, AUGEO), `externalOfferId` (text, "External offer ID")
   - Example: "Imported offer from FMTC catalog"
   - Backend mapping: → `multi_catalog`
   - Note: This is an awareness type — show in grid but mark as "Import Only" with badge. The wizard captures metadata but the offer content comes from the catalog source.

For each new type:

- Add to `OfferTypeKey` union type
- Add config to `OFFER_TYPE_CONFIG` with label, shortLabel, description, category, tags, icon, illustration, form metadata, bestFor, example, badgeFormat
- Add backend mapping to `WIZARD_TO_API_OFFER_TYPE` and `API_TO_WIZARD_OFFER_TYPE`
- Add headline templates to `HEADLINE_TEMPLATES`
- Add description templates to `DESCRIPTION_TEMPLATES`
- Add type-specific rendering in StepOfferContent
- Add type-specific review display in StepReview

### 5. Approval Workflow — Submit for Review

**Files:** `OfferManagerViewP1Wizard.tsx`, `StepReview.tsx`
**Why:** Scooter P1 — "Submit for review, pending status, approve/reject actions."

The wizard side of approval (list side is Agent A's domain):

- **Replace "Publish Offer"** button with context-aware action:
  - If user has publish permission → "Publish Offer" (direct publish, current behavior)
  - If user needs approval → "Submit for Review" (sets status to `pending_approval` instead of `published`)
- **For now, simulate**: Add a `requiresApproval` boolean flag (hardcoded to `true` for demo, future: comes from RBAC). When true, the publish button becomes "Submit for Review" with purple gradient (vs blue for publish).
- **Post-submit flow**: Show success toast "Offer submitted for review" and redirect to list. The list will show the offer with `pending_approval` status.
- **Review step indicator**: When `requiresApproval` is true, the status badge in StepReview should say "Ready for Review" (not "Ready to Publish") with a different icon (ClipboardDocumentCheckIcon instead of RocketLaunchIcon).

### 6. Multinational Market Selection

**Files:** `OfferManagerViewP1Wizard.tsx`, `StepOfferContent.tsx`
**Why:** PRD P1.2 — "Configurable market selection (USA, Canada)."

Add a **Market** section to StepOfferContent (above Dates & Redemption):

- **Market selector**: Checkbox group or multi-select — "USA", "Canada" (expandable later)
- **Default**: USA pre-selected
- **Currency display**: Show currency symbol based on selected market(s). If multiple markets, show primary market currency.
  - USA → $ (USD)
  - Canada → $ (CAD) — show "CAD" label to disambiguate
- **Form data**: Add `markets: string[]` to formData (default: `["usa"]`)
- **Review step**: Show selected markets in a "Where This Offer Is Available" section
- **Constraint**: At least one market must be selected. Validation on step advancement.

### 7. Codes & Redemption Mechanics Enhancement

**Files:** `StepOfferContent.tsx`
**Why:** Scooter P1 — "Unique promo codes, barcodes, QR codes."

Enhance the promo code section:

- **Code type selector** (when redemptionMethod is `online_code` or `in_store`):
  - "Single Code" — current behavior, one code for all (default)
  - "Unique Codes" — placeholder UI: text explaining "Unique codes will be generated per redemption. Enter a code prefix." + prefix input field. Show info badge: "Unique code generation will be connected to the CODES system."
  - "Barcode" — placeholder: text input for barcode value + small preview rectangle showing the value. Note: "Barcode image generation available in P2."
  - "QR Code" — placeholder: text input for QR data (URL or code) + small QR placeholder icon. Note: "QR code generation available in P2."
- These are **awareness** implementations — the UI exists and captures data, but actual generation is P2. Make this clear with subtle "Coming soon" or info tooltips.

### 8. Future Type Awareness Placeholders

**Files:** `StepOfferType.tsx`, `offer-templates.ts`
**Why:** Scooter P1 — "Subscription Offers awareness", "Merchant Direct / ampliFI awareness."

- Add two "Coming Soon" type cards at the end of the offer type grid:
  - **Subscription Offers** — "Recurring offers with subscription mechanics" — grayed out, not selectable, with "Coming Q2" badge
  - **Merchant Direct / ampliFI** — "Direct merchant-funded redemption" — grayed out, "Coming Q2" badge
- These should be in OFFER_TYPE_CONFIG with a `comingSoon: true` flag so they render in the grid but can't be selected
- StepOfferType should filter these from the `canProceed` check but display them to set expectations

## Constraints

- Do NOT modify files in `offer-list-p1/` — that's Agent A's domain
- You CAN modify `lib/constants/offer-templates.ts` for shared types but add additively (Agent A may also be adding types/statuses)
- All changes must pass TypeScript compilation (`npx tsc --noEmit`)
- Maintain existing patterns: auto-fill badges, character counters, type-specific conditional rendering
- New offer types follow the established card grid pattern in StepOfferType
- Review step additions follow the existing ReviewSection/ReviewField/RulePill component patterns
- For placeholder/awareness features, make it clear in the UI that functionality is coming — never leave a dead-end
