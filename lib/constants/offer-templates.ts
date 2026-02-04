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

// ============================================================================
// BACKEND API MAPPING
// ============================================================================
// These mappers translate frontend wizard values to backend API values.
// See: BACKEND_API_MAPPING.md for full documentation.
// ============================================================================

/**
 * Backend Offer Types (from types/offers.ts)
 * Must match kigo-core-server OfferType enum
 */
export type BackendOfferType =
  | "bogo"
  | "percentage_savings"
  | "dollars_off"
  | "cashback"
  | "free_with_purchase"
  | "price_point"
  | "clickthrough"
  | "loyalty_points"
  | "spend_and_get";

/**
 * Map frontend wizard offer types to backend API offer types
 * IMPORTANT: Frontend and backend type names differ!
 */
export const WIZARD_TO_API_OFFER_TYPE: Record<OfferTypeKey, BackendOfferType> =
  {
    dollar_off: "dollars_off", // Note: "dollar" → "dollars"
    percent_off: "percentage_savings", // Note: Complete rename
    bogo: "bogo", // Match
    fixed_price: "price_point", // Note: Complete rename
  };

/**
 * Convert wizard offer type to backend API type
 */
export function toBackendOfferType(wizardType: OfferTypeKey): BackendOfferType {
  return WIZARD_TO_API_OFFER_TYPE[wizardType];
}

/**
 * Backend Redemption Methods
 */
export type BackendRedemptionMethod =
  | "in_store"
  | "print"
  | "online"
  | "promo_code"
  | "show_and_save"
  | "barcode_scan"
  | "online_link";

/**
 * Map frontend redemption types to backend API types
 */
export const WIZARD_TO_API_REDEMPTION: Record<string, BackendRedemptionMethod> =
  {
    external_url: "online_link",
    mobile: "in_store",
    print: "print",
    promo_code: "promo_code",
    show_and_save: "show_and_save",
    barcode_scan: "barcode_scan",
  };

/**
 * Convert wizard redemption type to backend API type
 */
export function toBackendRedemptionMethod(
  wizardType: string
): BackendRedemptionMethod {
  return (
    WIZARD_TO_API_REDEMPTION[wizardType] ||
    (wizardType as BackendRedemptionMethod)
  );
}

/**
 * Get savings type for backend based on offer type
 */
export function getSavingsType(
  offerType: OfferTypeKey
): "percentage" | "fixed" {
  return offerType === "percent_off" ? "percentage" : "fixed";
}

/**
 * Get code type for backend (must be single character)
 * @param promoCodeType - "single" | "multiple" | "universal" | "unique"
 * @returns "S" for single code, "M" for multiple codes
 */
export function getCodeType(promoCodeType: string): "S" | "M" {
  switch (promoCodeType) {
    case "multiple":
    case "unique":
      return "M";
    case "single":
    case "universal":
    default:
      return "S";
  }
}

// ============================================================================
// SMART PRE-POPULATION MAPPINGS
// ============================================================================
// These mappings enable intelligent auto-fill in the wizard based on
// merchant categories and offer types.
// ============================================================================

/**
 * Map merchant categories to suggested offer category IDs
 * When a merchant is selected, these categories are pre-filled in Step 3
 */
export const MERCHANT_TO_OFFER_CATEGORIES: Record<string, string[]> = {
  dining: ["1", "2", "3", "4", "5", "6"], // Food & Dining + subcategories
  shopping: ["7", "8", "9", "10"], // Retail + subcategories
  entertainment: ["11", "12", "13"], // Entertainment + subcategories
  services: ["14", "15", "16"], // Services + subcategories
  health: ["17"], // Health & Wellness
  travel: ["19"], // Travel
  grocery: ["1", "7"], // Food & Dining + Retail (hybrid)
  gas: ["18"], // Automotive
  electronics: ["7", "9"], // Retail + Electronics
  fashion: ["7", "8"], // Retail + Clothing
  beauty: ["17", "14"], // Health & Wellness + Services
  home: ["7", "10", "16"], // Retail + Home Goods + Home Services
  sports: ["7", "13"], // Retail + Sports Events
  pets: ["7", "14", "17"], // Retail + Services + Health
  other: ["1"], // Default to Food & Dining
};

/**
 * Map merchant categories to suggested commodity IDs
 * When a merchant is selected, these commodities are pre-filled in Step 3
 */
export const MERCHANT_TO_COMMODITIES: Record<string, string[]> = {
  dining: ["1", "2", "3", "4"], // Entrees, Appetizers, Desserts, Beverages
  shopping: ["6", "7"], // Gift Cards, Merchandise
  entertainment: ["6", "8"], // Gift Cards, Services
  services: ["8"], // Services
  health: ["8"], // Services
  travel: ["6", "8"], // Gift Cards, Services
  grocery: ["7"], // Merchandise
  gas: ["8"], // Services
  electronics: ["7"], // Merchandise
  fashion: ["6", "7"], // Gift Cards, Merchandise
  beauty: ["8"], // Services
  home: ["7", "8"], // Merchandise, Services
  sports: ["7"], // Merchandise
  pets: ["7", "8"], // Merchandise, Services
  other: ["6", "8"], // Gift Cards, Services (generic fallback)
};

/**
 * Get suggested offer category IDs for a merchant's categories
 * Combines suggestions from all merchant categories, removing duplicates
 */
export function getOfferCategoriesForMerchant(
  merchantCategories: string[]
): string[] {
  if (!merchantCategories || merchantCategories.length === 0) {
    return MERCHANT_TO_OFFER_CATEGORIES.other;
  }

  const categories = new Set<string>();
  merchantCategories.forEach((cat) => {
    const suggested = MERCHANT_TO_OFFER_CATEGORIES[cat.toLowerCase()];
    if (suggested) {
      suggested.forEach((id) => categories.add(id));
    }
  });

  return categories.size > 0
    ? Array.from(categories)
    : MERCHANT_TO_OFFER_CATEGORIES.other;
}

/**
 * Get suggested commodity IDs for a merchant's categories
 * Combines suggestions from all merchant categories, removing duplicates
 */
export function getCommoditiesForMerchant(
  merchantCategories: string[]
): string[] {
  if (!merchantCategories || merchantCategories.length === 0) {
    return MERCHANT_TO_COMMODITIES.other;
  }

  const commodities = new Set<string>();
  merchantCategories.forEach((cat) => {
    const suggested = MERCHANT_TO_COMMODITIES[cat.toLowerCase()];
    if (suggested) {
      suggested.forEach((id) => commodities.add(id));
    }
  });

  return commodities.size > 0
    ? Array.from(commodities)
    : MERCHANT_TO_COMMODITIES.other;
}

// ============================================================================
// SMART HEADLINE & DESCRIPTION TEMPLATES
// ============================================================================
// Pre-populated examples that demonstrate proper formatting and truncation
// ============================================================================

/**
 * Headline templates by offer type
 * These show users the expected format and demonstrate character limits
 */
export const HEADLINE_TEMPLATES: Record<
  OfferTypeKey,
  { template: string; withMerchant: (merchantName: string) => string }
> = {
  dollar_off: {
    template: "$10 Off Your Purchase",
    withMerchant: (name) => `$10 Off at ${name}`,
  },
  percent_off: {
    template: "20% Off Your Entire Order",
    withMerchant: (name) => `20% Off at ${name}`,
  },
  bogo: {
    template: "Buy One Get One Free",
    withMerchant: (name) => `BOGO at ${name}`,
  },
  fixed_price: {
    template: "Special: Any Item for $9.99",
    withMerchant: (name) => `${name} Special: $9.99`,
  },
};

/**
 * Description templates by offer type + merchant category
 */
export const DESCRIPTION_TEMPLATES: Record<
  OfferTypeKey,
  Record<string, string>
> = {
  dollar_off: {
    dining:
      "Save on your next meal! Present this offer at checkout to receive your discount. Valid on dine-in and takeout orders.",
    shopping:
      "Get instant savings on your purchase. This offer applies to regular-priced merchandise. Exclusions may apply.",
    services:
      "Book your appointment and save! This offer applies to standard services. Premium services may have additional charges.",
    default:
      "Present this offer at checkout to receive your discount. One per customer per visit.",
  },
  percent_off: {
    dining:
      "Enjoy savings on your entire order! Valid for dine-in, takeout, and delivery. Cannot be combined with other offers.",
    shopping:
      "Save on your entire purchase! Applies to regular-priced items. Excludes gift cards and clearance.",
    services:
      "Get a percentage off your service! Valid for all standard services. Book your appointment today.",
    default:
      "Save on your entire purchase! Present this offer at checkout. Exclusions may apply.",
  },
  bogo: {
    dining:
      "Buy one entrée and get a second one free! Equal or lesser value. Valid for dine-in and takeout.",
    shopping:
      "Buy one item and get a second free! Equal or lesser value. Mix and match eligible items.",
    default:
      "Buy one and get one free! Second item must be of equal or lesser value.",
  },
  fixed_price: {
    dining:
      "Special pricing on select menu items! Limited time offer. While supplies last.",
    shopping:
      "Exclusive price on featured items! Limited time special. While supplies last.",
    default:
      "Special promotional pricing! Limited time offer while supplies last.",
  },
};

/**
 * Get a pre-populated headline based on offer type and merchant
 */
export function getSmartHeadline(
  offerType: OfferTypeKey,
  merchantName?: string,
  discountValue?: string
): string {
  const template = HEADLINE_TEMPLATES[offerType];
  if (!template) return "";

  let headline = merchantName
    ? template.withMerchant(merchantName)
    : template.template;

  // Insert actual discount value if provided
  if (discountValue) {
    const value = parseFloat(discountValue);
    if (!isNaN(value) && value > 0) {
      if (offerType === "dollar_off") {
        headline = headline.replace("$10", `$${value}`);
      } else if (offerType === "percent_off") {
        headline = headline.replace("20%", `${value}%`);
      } else if (offerType === "fixed_price") {
        headline = headline.replace("$9.99", `$${value.toFixed(2)}`);
      }
    }
  }

  return headline;
}

/**
 * Get a pre-populated description based on offer type and merchant category
 */
export function getSmartDescription(
  offerType: OfferTypeKey,
  merchantCategory?: string
): string {
  const templates = DESCRIPTION_TEMPLATES[offerType];
  if (!templates) return "";

  if (merchantCategory) {
    const lowerCat = merchantCategory.toLowerCase();
    if (templates[lowerCat]) return templates[lowerCat];

    // Try to match partial category names
    if (
      lowerCat.includes("dining") ||
      lowerCat.includes("food") ||
      lowerCat.includes("restaurant")
    ) {
      return templates.dining || templates.default;
    }
    if (
      lowerCat.includes("shop") ||
      lowerCat.includes("retail") ||
      lowerCat.includes("store")
    ) {
      return templates.shopping || templates.default;
    }
    if (lowerCat.includes("service")) {
      return templates.services || templates.default;
    }
  }

  return templates.default || "";
}
