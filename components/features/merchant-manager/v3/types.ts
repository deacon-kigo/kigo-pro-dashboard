// Mirrors the OfferStatus union in `/types/offers.ts` (kigo-core-server API).
// Display labels are derived in the view layer — never hardcode capitalized
// "Active"/"Planned" etc. as offer status values.
export type OfferStatus =
  | "draft"
  | "published"
  | "archived"
  | "expired"
  | "paused"
  | "pending_approval";

// Mirrors kigo-admin-tools/.../merchants/constants.ts MERCHANT_STATUS_PARAMS.
// Per the Slack thread w/ Diane/Koua/José: merchants are created `published`
// by default; ops can `unpublish` (offers hidden from marketplace) or `close`
// (terminal — out of business / no plan to revive).
export type MerchantStatus = "published" | "unpublished" | "closed";

export interface Offer {
  id: string;
  name: string;
  status: OfferStatus;
  channel: string;
  publisher?: string;
  start: string;
  end: string;
  type: string;
  offerType: string;
  /** Optional cross-link key into a separate offer-detail fixture. */
  offerKey?: string;
}

export interface Campaign {
  id: string;
  name: string;
  publisher: string;
  status:
    | "Active"
    | "Review"
    | "Paused"
    | "Live"
    | "Draft"
    | "Planned"
    | "Completed";
}

export interface MerchantPerformance {
  offer: string;
  channel: string;
  clicks: number;
  saves: number;
  redemptions: number;
  /** Pre-formatted currency string e.g. "$5,780" (matches prototype fixture). */
  revenue: string;
}

export interface SubGroup {
  name: string;
  id: string;
  contact: string;
  status: "Active" | "Review" | "Paused";
  activeOffers: number;
  locations?: number;
}

export interface MerchantRestriction {
  name: string;
  id: string;
}

export interface Merchant {
  key: string;
  name: string;
  id: string;
  /**
   * Legacy display string. New picker writes to `categoryIds` (taxonomy refs);
   * `category` is kept for the list-column label fallback until everything
   * downstream consumes the IDs.
   */
  category: string;
  /** Tree-taxonomy category ids — see `category-select/taxonomy.ts`. */
  categoryIds?: number[];
  emoji: string;
  color: string;
  source: string;
  commissionOffers: boolean;
  offers: Offer[];
  campaigns: Campaign[];

  /**
   * Catalog Filter memberships — the named bundles a merchant participates
   * in (mirrors `catalog-filters` in kigo-admin-tools, where merchants can
   * be matched into several filters via include/exclude criteria).
   * Multi-value: sort-disabled in the list view.
   */
  catalogs?: string[];

  // ---- Optional detail-view fields (used by MerchantDetailDialog) ----
  status?: MerchantStatus;
  contact?: string;
  website?: string;
  /** Internal-only — gated behind role check in detail view. */
  revShare?: string;
  supportedOfferTypes?: string[];
  merchantDetail?: string;
  restrictions?: MerchantRestriction[];
  perf?: MerchantPerformance[];
  isParent?: boolean;
  subGroups?: SubGroup[];
}
