/**
 * @file Publisher Manager (DES-876) — filter contract + parse helpers
 * @description Shared FilterTag model for the faceted filter bar (mirrors the
 * Offer/Merchant Manager convention). Both work-surface tabs parse the same
 * tag list into an offer-type set, a status set, and free-text search terms.
 */

/** Facet categories used across the Publisher Manager filter bar. */
export type FilterCategory = "offerType" | "status" | "search";

export interface FilterTag {
  label: string;
  /** `"offerType:cash-back"` | `"status:Live"` | `"search:free text"`. */
  value: string;
  category: FilterCategory;
}

export interface ParsedFilters {
  offerTypeIds: Set<string>;
  statuses: Set<string>;
  searchTerms: string[];
}

/** Split a FilterTag list into its facet buckets. */
export function parseFilters(filters: FilterTag[]): ParsedFilters {
  const offerTypeIds = new Set<string>();
  const statuses = new Set<string>();
  const searchTerms: string[] = [];

  for (const f of filters) {
    const val = f.value.split(":").slice(1).join(":");
    switch (f.category) {
      case "offerType":
        offerTypeIds.add(val);
        break;
      case "status":
        statuses.add(val);
        break;
      case "search":
        if (val.trim()) searchTerms.push(val.trim().toLowerCase());
        break;
    }
  }

  return { offerTypeIds, statuses, searchTerms };
}

/** Build a status FilterTag (used by the status pills to toggle the bar). */
export function statusTag(status: string): FilterTag {
  return { label: status, value: `status:${status}`, category: "status" };
}
