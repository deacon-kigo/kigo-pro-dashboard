// Define types locally instead of importing from @/types/filters
interface FilterCriterion {
  type: string;
  value: string;
  rule: string;
  and_or: string;
}

interface FilterDefinition {
  name: string;
  queryViewName: string;
  description: string;
  criteria: FilterCriterion[];
}

// Mock data for filter coverage statistics
export interface FilterCoverageStats {
  totalOffers: number;
  totalMerchants: number;
  coveragePercentage: number;
  geographicCoverage: {
    type: "DMA" | "State" | "City";
    regions: Array<{
      name: string;
      count: number;
      percentage: number;
    }>;
  };
  topCategories: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
}

/**
 * A service to handle direct filter creation without requiring AI assistance
 */
export class FilterDirectCreator {
  /**
   * Creates a complete filter based on predefined templates
   * @param filterType The type of filter to create
   * @returns A complete filter configuration
   */
  static createPresetFilter(filterType: string) {
    const presetFilters: Record<string, any> = {
      skincare: {
        name: "Skin Care Filter",
        queryViewName: "SkinCareFilter",
        description: "Filter for skin care products",
        criteria: [
          {
            type: "OfferCategory",
            value: "Health & Beauty",
            rule: "equals",
            and_or: "AND",
          },
          {
            type: "OfferKeyword",
            value: "skin care",
            rule: "contains",
            and_or: "OR",
          },
          {
            type: "OfferCommodity",
            value: "Skin Care",
            rule: "contains",
            and_or: "OR",
          },
        ],
      },
      restaurant: {
        name: "Restaurant Deals Filter",
        queryViewName: "RestaurantDeals",
        description: "Filter for restaurant and dining offers",
        criteria: [
          {
            type: "OfferCategory",
            value: "Food & Dining",
            rule: "equals",
            and_or: "AND",
          },
          {
            type: "MerchantKeyword",
            value: "restaurant",
            rule: "contains",
            and_or: "OR",
          },
          {
            type: "MerchantKeyword",
            value: "dining",
            rule: "contains",
            and_or: "OR",
          },
        ],
      },
      discount: {
        name: "Discount Offers Filter",
        queryViewName: "DiscountOffers",
        description: "Filter for offers with discounts, sales or promotions",
        criteria: [
          {
            type: "OfferKeyword",
            value: "discount",
            rule: "contains",
            and_or: "OR",
          },
          {
            type: "OfferKeyword",
            value: "sale",
            rule: "contains",
            and_or: "OR",
          },
          {
            type: "OfferKeyword",
            value: "% off",
            rule: "contains",
            and_or: "OR",
          },
        ],
      },
    };

    return presetFilters[filterType] || null;
  }

  /**
   * Creates a filter from a specific category
   * @param category The category to filter by
   * @returns A filter configuration based on the category
   */
  static createCategoryFilter(category: string) {
    return {
      name: `${category} Filter`,
      queryViewName: `${category.replace(/\s+/g, "")}Filter`,
      description: `Filter for ${category} offers`,
      criteria: [
        {
          type: "OfferCategory",
          value: category,
          rule: "equals",
          and_or: "AND",
        },
      ],
    };
  }

  /**
   * Creates a filter from a specific keyword
   * @param keyword The keyword to filter by
   * @returns A filter configuration based on the keyword
   */
  static createKeywordFilter(keyword: string) {
    return {
      name: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Offers`,
      queryViewName: `${keyword.replace(/\s+/g, "")}Offers`,
      description: `Filter for offers with "${keyword}"`,
      criteria: [
        {
          type: "OfferKeyword",
          value: keyword,
          rule: "contains",
          and_or: "OR",
        },
      ],
    };
  }

  /**
   * Creates a filter based on merchant criteria
   * @param merchantKeyword Merchant keywords to filter by
   * @returns A filter configuration targeting specific merchants
   */
  static createMerchantFilter(merchantKeyword: string) {
    return {
      name: `${merchantKeyword.charAt(0).toUpperCase() + merchantKeyword.slice(1)} Merchants`,
      queryViewName: `${merchantKeyword.replace(/\s+/g, "")}Merchants`,
      description: `Filter for offers from ${merchantKeyword} merchants`,
      criteria: [
        {
          type: "MerchantKeyword",
          value: merchantKeyword,
          rule: "contains",
          and_or: "AND",
        },
      ],
    };
  }

  /**
   * Creates a magic filter based on a user query
   * @param query The user query to generate a filter from
   * @returns A magic filter based on the query content
   */
  static createMagicFilter(query: string) {
    // Simple matching logic to create appropriate filters based on the query
    if (query.includes("shopping") || query.includes("retail")) {
      return {
        name: "Premium Shopping Deals",
        queryViewName: "PremiumShoppingDeals",
        description: "Filter for premium shopping and retail offers",
        criteria: [
          {
            type: "OfferCategory",
            value: "Retail",
            rule: "equals",
            and_or: "AND",
          },
          {
            type: "OfferKeyword",
            value: "premium",
            rule: "contains",
            and_or: "OR",
          },
          {
            type: "OfferKeyword",
            value: "luxury",
            rule: "contains",
            and_or: "OR",
          },
        ],
      };
    }

    if (query.includes("restaurant") || query.includes("dining")) {
      return {
        name: "Local Restaurant Offers",
        queryViewName: "LocalRestaurants",
        description: "Filter for local restaurant and dining offers",
        criteria: [
          {
            type: "OfferCategory",
            value: "Food & Dining",
            rule: "equals",
            and_or: "AND",
          },
          {
            type: "MerchantKeyword",
            value: "local",
            rule: "contains",
            and_or: "OR",
          },
          {
            type: "MerchantKeyword",
            value: "restaurant",
            rule: "contains",
            and_or: "OR",
          },
        ],
      };
    }

    if (query.includes("entertainment") || query.includes("family")) {
      return {
        name: "Family Entertainment",
        queryViewName: "FamilyEntertainment",
        description: "Filter for family-friendly entertainment offers",
        criteria: [
          {
            type: "OfferCategory",
            value: "Entertainment",
            rule: "equals",
            and_or: "AND",
          },
          {
            type: "OfferKeyword",
            value: "family",
            rule: "contains",
            and_or: "OR",
          },
          {
            type: "OfferKeyword",
            value: "children",
            rule: "contains",
            and_or: "OR",
          },
          {
            type: "OfferKeyword",
            value: "kids",
            rule: "contains",
            and_or: "OR",
          },
        ],
      };
    }

    if (query.includes("beauty") || query.includes("spa")) {
      return {
        name: "Beauty & Spa Services",
        queryViewName: "BeautyAndSpa",
        description: "Filter for beauty treatments and spa services",
        criteria: [
          {
            type: "OfferCategory",
            value: "Health & Beauty",
            rule: "equals",
            and_or: "AND",
          },
          {
            type: "OfferKeyword",
            value: "spa",
            rule: "contains",
            and_or: "OR",
          },
          {
            type: "OfferKeyword",
            value: "salon",
            rule: "contains",
            and_or: "OR",
          },
          {
            type: "OfferKeyword",
            value: "treatment",
            rule: "contains",
            and_or: "OR",
          },
        ],
      };
    }

    // Default for unknown queries
    return {
      name: `${query.charAt(0).toUpperCase() + query.slice(1)} Filter`,
      queryViewName: `${query.replace(/\s+/g, "")}Filter`,
      description: `Smart filter for ${query}`,
      criteria: [
        { type: "OfferKeyword", value: query, rule: "contains", and_or: "OR" },
      ],
    };
  }

  /**
   * Gets the available product categories
   * @returns A list of product categories
   */
  static getProductCategories() {
    return [
      "Health & Beauty",
      "Food & Dining",
      "Retail",
      "Travel",
      "Entertainment",
      "Services",
      "Other",
    ];
  }

  /**
   * Gets the popular keywords for filters
   * @returns A list of popular filter keywords
   */
  static getPopularKeywords() {
    return [
      "discount",
      "sale",
      "free shipping",
      "limited time",
      "new arrival",
      "clearance",
      "exclusive",
    ];
  }

  /**
   * Gets merchant types for filtering
   * @returns A list of merchant types
   */
  static getMerchantTypes() {
    return [
      "local",
      "online",
      "premium",
      "small business",
      "national",
      "international",
    ];
  }
}

/**
 * Generate mock coverage statistics for a filter based on provided criteria
 * @param criteria The filter criteria to analyze
 * @returns FilterCoverageStats object with mock coverage data
 */
export const generateFilterCoverageStats = (
  criteria: any[]
): FilterCoverageStats => {
  // Base number of offers in the system
  const totalSystemOffers = 12500;

  // The more criteria, the more restrictive the filter
  const restrictiveness = Math.min(0.9, criteria.length * 0.15);

  // Calculate coverage
  const coveragePercentage = Math.max(
    5,
    Math.round((1 - restrictiveness) * 100)
  );
  const totalOffers = Math.round(
    (coveragePercentage / 100) * totalSystemOffers
  );
  const totalMerchants = Math.round(totalOffers / 3.5); // Average 3.5 offers per merchant

  // Generate mock DMA (Designated Market Area) coverage
  const dmas = [
    { name: "New York", base: 1500 },
    { name: "Los Angeles", base: 1200 },
    { name: "Chicago", base: 800 },
    { name: "Philadelphia", base: 600 },
    { name: "Dallas-Ft. Worth", base: 700 },
    { name: "San Francisco", base: 900 },
    { name: "Boston", base: 500 },
    { name: "Atlanta", base: 600 },
    { name: "Washington, DC", base: 750 },
    { name: "Houston", base: 650 },
  ];

  // Get random 5 DMAs
  const randomDMAs = [...dmas]
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)
    .map((dma) => {
      const count = Math.round(dma.base * (coveragePercentage / 100));
      return {
        name: dma.name,
        count,
        percentage: Math.round((count / totalOffers) * 100),
      };
    })
    .sort((a, b) => b.count - a.count);

  // Generate mock categories
  const categories = [
    { name: "Dining", base: 3500 },
    { name: "Retail", base: 2800 },
    { name: "Entertainment", base: 1800 },
    { name: "Travel", base: 2100 },
    { name: "Services", base: 1500 },
  ];

  // Check if any criteria specify categories
  let selectedCategories = [...categories];
  criteria.forEach((criterion) => {
    if (criterion.type === "OfferCommodity" && criterion.value) {
      const matchingCategory = categories.find(
        (cat) => cat.name.toLowerCase() === criterion.value.toLowerCase()
      );
      if (matchingCategory) {
        selectedCategories = [matchingCategory];
      }
    }
  });

  const topCategories = selectedCategories
    .slice(0, 3)
    .map((category) => {
      const count = Math.round(category.base * (coveragePercentage / 100));
      return {
        name: category.name,
        count,
        percentage: Math.round((count / totalOffers) * 100),
      };
    })
    .sort((a, b) => b.count - a.count);

  return {
    totalOffers,
    totalMerchants,
    coveragePercentage,
    geographicCoverage: {
      type: "DMA",
      regions: randomDMAs,
    },
    topCategories,
  };
};
