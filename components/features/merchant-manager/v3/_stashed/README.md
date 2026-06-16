# Stashed — Offers Timeline (DES-747 v1)

The Offers Timeline view is **not in the next release**. Files here are
parked intact so the design + implementation can be re-introduced without
re-doing the work.

## What's here

- `MerchantOffersGantt.tsx` — kibo-ui Gantt wrapper. Renders the merchant's
  offers as a status-colored timeline with a "today" marker.
- `MerchantOffersTimelineContent.tsx` — page body that wraps the Gantt with
  the per-status count strip, the expired-offers warning bar, and the empty
  state. This is what used to render inside the detail page when the "Offers
  Timeline" tab was active.
- `offerEditPayload.ts` — payload shape the timeline used when clicking a
  bar handed off to the offer editor.

## How to re-introduce

1. Move these three files back up to `../`.
2. In `MerchantDetailView.tsx`, restore the vertical tab rail and the
   `activeTab === "offers"` branch (see git history for the prior shape).
3. Re-add the `?tab=offers` deep-link handling.

The components themselves are unchanged — they import `../types` via the
relative path, so nothing in them needs editing to revive.
