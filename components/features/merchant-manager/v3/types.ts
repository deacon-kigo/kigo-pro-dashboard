export type OfferStatus = "Active" | "Planned" | "Expired" | "Review";

export type MerchantStatus = "Active" | "Attention" | "Review";

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
  category: string;
  emoji: string;
  color: string;
  source: string;
  commissionOffers: boolean;
  offers: Offer[];
  campaigns: Campaign[];

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
