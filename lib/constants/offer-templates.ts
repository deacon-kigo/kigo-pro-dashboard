/**
 * Offer Templates & Configuration for P0.5 Wizard
 *
 * Provides smart defaults for offer creation:
 * - Terms templates by merchant category
 * - Offer type configuration for the wizard
 */

// Terms & Conditions templates by category
export const TERMS_TEMPLATES: Record<string, string> = {
  dining: `Offer valid at participating locations. Cannot be combined with other offers or discounts. One per customer per visit. Not valid for alcohol purchases where prohibited. No cash value. Tax and gratuity not included. Present offer before ordering.`,

  retail: `Offer valid at participating locations. Cannot be combined with other offers, coupons, or discounts. Excludes gift cards, prior purchases, and clearance items. No cash value. One per customer. Other restrictions may apply.`,

  services: `Offer valid for new and existing customers at participating locations. Cannot be combined with other offers. Appointment may be required. Subject to availability. Additional charges may apply for premium services. One per customer.`,

  travel: `Offer subject to availability. Cannot be combined with other offers or promotions. Blackout dates may apply. Advance booking may be required. Changes and cancellations subject to provider policies.`,

  entertainment: `Offer valid at participating locations. Cannot be combined with other offers. Subject to availability. Blackout dates may apply. One per customer. No cash value.`,

  health: `Offer valid at participating locations. Cannot be combined with other offers or insurance benefits. Consultation may be required. Subject to availability. One per customer.`,

  default: `Offer valid at participating locations. Cannot be combined with other offers. One per customer. No cash value. Other restrictions may apply. See merchant for details.`,
};

// ============================================================================
// OFFER TYPE TAXONOMY
// ============================================================================
// This architecture supports future expansion with:
// - Categories for grouping related offer types
// - Tags for filtering and search
// - Use cases to guide merchant selection
// - Illustrations for visual identification
// ============================================================================

/**
 * Offer Type Categories
 * Used to group related offer types for filtering and organization
 */
export type OfferCategory = "discount" | "bundle" | "loyalty" | "promotional";

export const OFFER_CATEGORIES: Record<
  OfferCategory,
  { label: string; description: string }
> = {
  discount: {
    label: "Discounts",
    description: "Reduce the price of products or services",
  },
  bundle: {
    label: "Bundles & Combos",
    description: "Combine products for special pricing",
  },
  loyalty: {
    label: "Loyalty Rewards",
    description: "Reward repeat customers",
  },
  promotional: {
    label: "Promotional",
    description: "Limited-time special offers",
  },
};

/**
 * Offer Type Keys
 * Extensible list of all supported offer types
 */
export type OfferTypeKey =
  | "dollar_off"
  | "percent_off"
  | "bogo"
  | "fixed_price";
// Future types can be added here:
// | "tiered_discount"
// | "cashback"
// | "free_shipping"
// | "gift_with_purchase"

/**
 * Offer Type Configuration
 * Complete metadata for each offer type
 */
export interface OfferTypeConfig {
  // Identity
  key: OfferTypeKey;
  label: string;
  shortLabel: string;
  description: string;

  // Categorization (for future filtering/grouping)
  category: OfferCategory;
  tags: string[];

  // Visual
  icon: string;
  illustration: string;

  // Form configuration
  discountLabel: string;
  discountPrefix?: string;
  discountSuffix?: string;
  discountPlaceholder: string;

  // Use case guidance
  bestFor: string[];
  example: string;

  // Display formatting
  badgeFormat: (value: number, min?: number) => string;
}

export const OFFER_TYPE_CONFIG: Record<OfferTypeKey, OfferTypeConfig> = {
  dollar_off: {
    key: "dollar_off",
    label: "Dollar Off",
    shortLabel: "$X OFF",
    description: "Save a fixed dollar amount",
    category: "discount",
    tags: ["discount", "savings", "simple"],
    icon: "$10 OFF",
    illustration: "/illustration/dollar off.png",
    discountLabel: "How much off?",
    discountPrefix: "$",
    discountPlaceholder: "10",
    bestFor: ["High-value items", "Services", "First-time customers"],
    example: "$10 off your next oil change",
    badgeFormat: (value) => `$${value} OFF`,
  },
  percent_off: {
    key: "percent_off",
    label: "Percent Off",
    shortLabel: "X% OFF",
    description: "Save a percentage on your order",
    category: "discount",
    tags: ["discount", "percentage", "scalable"],
    icon: "20% OFF",
    illustration: "/illustration/percentage off.png",
    discountLabel: "What percentage?",
    discountSuffix: "%",
    discountPlaceholder: "20",
    bestFor: ["Entire orders", "Category-wide sales", "Seasonal promotions"],
    example: "20% off your entire purchase",
    badgeFormat: (value) => `${value}% OFF`,
  },
  bogo: {
    key: "bogo",
    label: "Buy 1 Get 1",
    shortLabel: "BOGO",
    description: "Buy one item, get one free",
    category: "bundle",
    tags: ["bundle", "free", "popular"],
    icon: "BOGO",
    illustration: "/illustration/BOGO.png",
    discountLabel: "What item?",
    discountPlaceholder: "Any entrée",
    bestFor: ["Restaurants", "Retail products", "Driving volume"],
    example: "Buy one pizza, get one free",
    badgeFormat: () => "BUY 1 GET 1",
  },
  fixed_price: {
    key: "fixed_price",
    label: "Fixed Price",
    shortLabel: "$X.XX",
    description: "Special price for an item or service",
    category: "promotional",
    tags: ["special", "limited", "value"],
    icon: "$19.99",
    illustration: "/illustration/fixed price.png",
    discountLabel: "What price?",
    discountPrefix: "$",
    discountPlaceholder: "19.99",
    bestFor: ["Featured items", "Bundle deals", "Limited-time specials"],
    example: "Large pizza for $9.99",
    badgeFormat: (value) => `$${value.toFixed(2)}`,
  },
};

/**
 * Get offer types by category
 * Useful for filtering/grouping in the UI
 */
export function getOfferTypesByCategory(
  category: OfferCategory
): OfferTypeConfig[] {
  return Object.values(OFFER_TYPE_CONFIG).filter(
    (type) => type.category === category
  );
}

/**
 * Get offer types by tag
 * Useful for search and filtering
 */
export function getOfferTypesByTag(tag: string): OfferTypeConfig[] {
  return Object.values(OFFER_TYPE_CONFIG).filter((type) =>
    type.tags.includes(tag)
  );
}

// Helper to get terms template based on merchant category
export function getTermsTemplate(category?: string): string {
  if (!category) return TERMS_TEMPLATES.default;

  const lowerCategory = category.toLowerCase();

  // Map common category names to template keys
  if (
    lowerCategory.includes("food") ||
    lowerCategory.includes("dining") ||
    lowerCategory.includes("restaurant") ||
    lowerCategory.includes("pizza") ||
    lowerCategory.includes("cafe")
  ) {
    return TERMS_TEMPLATES.dining;
  }

  if (
    lowerCategory.includes("retail") ||
    lowerCategory.includes("clothing") ||
    lowerCategory.includes("shop") ||
    lowerCategory.includes("store")
  ) {
    return TERMS_TEMPLATES.retail;
  }

  if (
    lowerCategory.includes("service") ||
    lowerCategory.includes("auto") ||
    lowerCategory.includes("repair") ||
    lowerCategory.includes("home")
  ) {
    return TERMS_TEMPLATES.services;
  }

  if (
    lowerCategory.includes("travel") ||
    lowerCategory.includes("hotel") ||
    lowerCategory.includes("flight")
  ) {
    return TERMS_TEMPLATES.travel;
  }

  if (
    lowerCategory.includes("entertainment") ||
    lowerCategory.includes("movie") ||
    lowerCategory.includes("event") ||
    lowerCategory.includes("sport")
  ) {
    return TERMS_TEMPLATES.entertainment;
  }

  if (
    lowerCategory.includes("health") ||
    lowerCategory.includes("wellness") ||
    lowerCategory.includes("medical") ||
    lowerCategory.includes("spa")
  ) {
    return TERMS_TEMPLATES.health;
  }

  return TERMS_TEMPLATES.default;
}

// Helper to format discount badge based on offer type
export function formatDiscountBadge(
  offerType: OfferTypeKey,
  discountValue: number,
  minimumSpend?: number
): string {
  const config = OFFER_TYPE_CONFIG[offerType];
  if (!config) return `$${discountValue} OFF`;

  return config.badgeFormat(discountValue, minimumSpend);
}

// Default values for smart form initialization
export const SMART_DEFAULTS = {
  usageLimitPerCustomer: "1",
  redemptionRollingPeriod: "single",
  offerSource: "MCM",
  redemptionTypes: ["external_url"],
  promoCodeType: "single",
  locationScope: "all",
  geography: "US",
  channel: "online",
  durationDays: 90, // Default offer duration
};

// Helper to get default dates
export function getDefaultDates(): { startDate: string; endDate: string } {
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + SMART_DEFAULTS.durationDays);

  return {
    startDate: today.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  };
}
