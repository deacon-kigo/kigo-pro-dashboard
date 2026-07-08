// Types for the John Deere Perks Pro dealer MVP (pre-made campaign activation).
// Kept intentionally small and self-contained so the feature can evolve
// independently of the rest of the prototype.

export type DiscountType = "percent" | "amount";

export type BuiltBy = "Kigo" | "John Deere";

export type CampaignCategory =
  | "Parts"
  | "Oil & Fluids"
  | "Service"
  | "Merchandise"
  | "Equipment";

export interface DealerLocation {
  id: string;
  name: string;
  city: string;
  state: string;
}

/**
 * Redemption constraints a dealer can program for a perk.
 * Mirrors the MVP scope: min spend, max discount cap, date range, locations.
 */
export interface PerkConstraints {
  /** Minimum basket spend required to redeem (null = none). */
  minSpend: number | null;
  /** Maximum discount dollars applied (cap), null = uncapped. */
  maxDiscount: number | null;
}

export interface MonthlyPerfPoint {
  month: string;
  sent: number;
  used: number;
  sales: number;
}

/**
 * Post-launch performance for an activated campaign. The five MVP metrics
 * plus a small monthly series for charting.
 */
export interface CampaignPerformance {
  sent: number;
  opened: number;
  used: number;
  discount: number; // total $ discount given
  sales: number; // total $ sales attributed
  monthly: MonthlyPerfPoint[];
}

/**
 * A pre-made campaign a dealer can opt into. The dealer does NOT edit the
 * mechanics — they choose dates + locations and activate. (We deliberately
 * avoid the word "template" in the UI per prior JD naming decisions.)
 */
export interface PremadeCampaign {
  id: string;
  name: string;
  tagline: string;
  description: string;
  builtBy: BuiltBy;
  category: CampaignCategory;
  discountType: DiscountType;
  discountValue: number; // 10 => 10% or $10 depending on type
  constraints: PerkConstraints;
  /** Suggested default window (ISO dates) the dealer can adjust. */
  suggestedStart: string;
  suggestedEnd: string;
  /** Brand accent used in the generated marketing creative. */
  accent: string;
  /** Baked performance used by the reporting dashboard once active. */
  performance: CampaignPerformance;
}

/**
 * An eligible part for a promotion. The eligible list is determined by John
 * Deere; the dealer can view it but not edit it.
 */
export interface PartRow {
  partNumber: string;
  size: string;
  product: string;
  description: string;
}

/**
 * A dealer's activation of a pre-made campaign. Created by the activation flow.
 */
export interface Activation {
  campaignId: string;
  startDate: string; // ISO
  endDate: string; // ISO
  locationIds: string[]; // empty => all locations
  activatedAt: string; // ISO timestamp
  /** Generated marketing deep link the dealer drops into their CMS. */
  cmsUrl: string;
}
