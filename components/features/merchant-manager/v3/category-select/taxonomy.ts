// Hierarchical merchant category taxonomy.
//
// Shape mirrors kigo-admin-tools `Category` (categoryId / categoryName /
// parentCategoryId) so the prototype's tree picker stays drop-in compatible
// with the production API contract. The dataset is representative — enough
// nodes to demonstrate the tree UX, including same-named leaves under
// different parents (e.g. "Non-Alcoholic" under Beer/Ale/Cider AND under
// Pre-Mixed Cocktails) which is the whole reason hierarchy is needed.

export interface Category {
  categoryId: number;
  categoryName: string;
  parentCategoryId: null | number;
}

export const MERCHANT_CATEGORIES: Category[] = [
  // ---- Shopping ------------------------------------------------------------
  { categoryId: 1, categoryName: "Shopping", parentCategoryId: null },
  { categoryId: 10, categoryName: "CPG & Manufacturers", parentCategoryId: 1 },
  { categoryId: 100, categoryName: "Alcohol Beverages", parentCategoryId: 10 },
  { categoryId: 1000, categoryName: "Beer/Ale/Cider", parentCategoryId: 100 },
  { categoryId: 10001, categoryName: "Non-Alcoholic", parentCategoryId: 1000 },
  {
    categoryId: 1001,
    categoryName: "Pre-Mixed Cocktails",
    parentCategoryId: 100,
  },
  {
    categoryId: 10010,
    categoryName: "Cocktails/Coolers/Hard Seltzers",
    parentCategoryId: 1001,
  },
  { categoryId: 10011, categoryName: "Non-Alcoholic", parentCategoryId: 1001 },
  { categoryId: 1002, categoryName: "Spirits", parentCategoryId: 100 },
  { categoryId: 1003, categoryName: "Wine", parentCategoryId: 100 },
  { categoryId: 101, categoryName: "Snacks & Pantry", parentCategoryId: 10 },
  { categoryId: 1010, categoryName: "Chips & Crackers", parentCategoryId: 101 },
  { categoryId: 1011, categoryName: "Cookies & Sweets", parentCategoryId: 101 },
  { categoryId: 11, categoryName: "Apparel", parentCategoryId: 1 },
  { categoryId: 110, categoryName: "Women's", parentCategoryId: 11 },
  { categoryId: 111, categoryName: "Men's", parentCategoryId: 11 },
  { categoryId: 112, categoryName: "Kids & Baby", parentCategoryId: 11 },
  { categoryId: 12, categoryName: "Home & Garden", parentCategoryId: 1 },
  { categoryId: 120, categoryName: "Furniture", parentCategoryId: 12 },
  { categoryId: 121, categoryName: "Garden & Outdoor", parentCategoryId: 12 },
  {
    categoryId: 122,
    categoryName: "Tools & Improvement",
    parentCategoryId: 12,
  },
  { categoryId: 13, categoryName: "Electronics", parentCategoryId: 1 },
  { categoryId: 14, categoryName: "Retail (General)", parentCategoryId: 1 },

  // ---- Food & Dining -------------------------------------------------------
  { categoryId: 2, categoryName: "Food & Dining", parentCategoryId: null },
  { categoryId: 20, categoryName: "Restaurants", parentCategoryId: 2 },
  { categoryId: 200, categoryName: "Fast Food", parentCategoryId: 20 },
  { categoryId: 201, categoryName: "Casual Dining", parentCategoryId: 20 },
  { categoryId: 202, categoryName: "Fine Dining", parentCategoryId: 20 },
  { categoryId: 21, categoryName: "Cafés & Bakeries", parentCategoryId: 2 },
  { categoryId: 22, categoryName: "Grocery", parentCategoryId: 2 },

  // ---- Travel --------------------------------------------------------------
  { categoryId: 3, categoryName: "Travel", parentCategoryId: null },
  { categoryId: 30, categoryName: "Hotels & Lodging", parentCategoryId: 3 },
  { categoryId: 31, categoryName: "Air Travel", parentCategoryId: 3 },
  { categoryId: 32, categoryName: "Car Rental", parentCategoryId: 3 },
  { categoryId: 33, categoryName: "Cruises", parentCategoryId: 3 },

  // ---- Health & Wellness ---------------------------------------------------
  { categoryId: 4, categoryName: "Health & Wellness", parentCategoryId: null },
  { categoryId: 40, categoryName: "Pharmacy", parentCategoryId: 4 },
  { categoryId: 41, categoryName: "Fitness", parentCategoryId: 4 },
  {
    categoryId: 42,
    categoryName: "Beauty & Personal Care",
    parentCategoryId: 4,
  },

  // ---- Entertainment -------------------------------------------------------
  { categoryId: 5, categoryName: "Entertainment", parentCategoryId: null },
  { categoryId: 50, categoryName: "Movies & Theaters", parentCategoryId: 5 },
  { categoryId: 51, categoryName: "Live Events", parentCategoryId: 5 },
  { categoryId: 52, categoryName: "Streaming & Gaming", parentCategoryId: 5 },

  // ---- Sports --------------------------------------------------------------
  { categoryId: 6, categoryName: "Sports", parentCategoryId: null },
  { categoryId: 60, categoryName: "Athletic Apparel", parentCategoryId: 6 },
  { categoryId: 61, categoryName: "Sporting Goods", parentCategoryId: 6 },

  // ---- Pets ----------------------------------------------------------------
  { categoryId: 7, categoryName: "Pets", parentCategoryId: null },
  { categoryId: 70, categoryName: "Pet Food & Supplies", parentCategoryId: 7 },
  { categoryId: 71, categoryName: "Veterinary", parentCategoryId: 7 },

  // ---- Auto & Fuel ---------------------------------------------------------
  { categoryId: 8, categoryName: "Auto & Fuel", parentCategoryId: null },
  { categoryId: 80, categoryName: "Gas & Convenience", parentCategoryId: 8 },
  { categoryId: 81, categoryName: "Auto Service", parentCategoryId: 8 },

  // ---- Services ------------------------------------------------------------
  { categoryId: 9, categoryName: "Services", parentCategoryId: null },
  { categoryId: 90, categoryName: "Telecom", parentCategoryId: 9 },
  { categoryId: 91, categoryName: "Financial Services", parentCategoryId: 9 },
];

// Maps the legacy single-string `category` field on prototype mock merchants
// onto categoryIds in the new taxonomy. Used to seed `Merchant.categoryIds`
// when only the legacy field is populated. Kept narrow on purpose — only
// the strings currently present in mockData.
export const LEGACY_CATEGORY_TO_IDS: Record<string, number[]> = {
  Apparel: [11],
  Beauty: [42],
  Electronics: [13],
  Entertainment: [5],
  "Food & Dining": [2],
  "Gas & Convenience": [80],
  "Health & Wellness": [4],
  "Home Improvement": [122],
  Retail: [14],
  Telecom: [90],
  Travel: [3],
};

// Lookups built once at module load for cheap per-render access.
export const CATEGORY_BY_ID = new Map<number, Category>(
  MERCHANT_CATEGORIES.map((c) => [c.categoryId, c])
);

// Walk up to the root, returning the chain leaf-first (e.g. for
// "Non-Alcoholic" under Beer/Ale/Cider → [Non-Alcoholic, Beer/Ale/Cider,
// Alcohol Beverages, CPG & Manufacturers, Shopping]).
export function getCategoryAncestry(categoryId: number): Category[] {
  const chain: Category[] = [];
  let cursor: Category | undefined = CATEGORY_BY_ID.get(categoryId);
  while (cursor) {
    chain.push(cursor);
    cursor =
      cursor.parentCategoryId === null
        ? undefined
        : CATEGORY_BY_ID.get(cursor.parentCategoryId);
  }
  return chain;
}

// Returns the set of categoryIds that include the given id AND all descendants.
// Used by the list filter so selecting a parent (e.g. "Alcohol Beverages")
// matches merchants tagged with any leaf under it.
export function getCategoryDescendants(rootId: number): Set<number> {
  const out = new Set<number>([rootId]);
  let added = true;
  while (added) {
    added = false;
    for (const c of MERCHANT_CATEGORIES) {
      if (
        c.parentCategoryId !== null &&
        out.has(c.parentCategoryId) &&
        !out.has(c.categoryId)
      ) {
        out.add(c.categoryId);
        added = true;
      }
    }
  }
  return out;
}
