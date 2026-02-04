# P0.5 Wizard Template System

## Overview

The P0.5 Offer Creation Wizard uses a **template-based system** to guide users through offer creation. Templates provide:

- Pre-configured field labels and input types
- Smart defaults based on offer type
- Type-specific validation rules
- Consistent user experience

---

## Template Architecture

### Location

```
lib/constants/offer-templates.ts
```

### Template Types

| Template Key  | Display Label | Category    | Description                          |
| ------------- | ------------- | ----------- | ------------------------------------ |
| `dollar_off`  | Dollar Off    | discount    | Save a fixed dollar amount           |
| `percent_off` | Percent Off   | discount    | Save a percentage on your order      |
| `bogo`        | Buy 1 Get 1   | bundle      | Buy one item, get one free           |
| `fixed_price` | Fixed Price   | promotional | Special price for an item or service |

---

## Template Configuration Schema

```typescript
interface OfferTypeConfig {
  // Identity
  key: OfferTypeKey;
  label: string;
  shortLabel: string;
  description: string;

  // Categorization
  category: OfferCategory; // "discount" | "bundle" | "loyalty" | "promotional"
  tags: string[];

  // Visual
  icon: string;
  illustration: string;

  // Form Field Configuration
  discountLabel: string; // Label for discount input
  discountPrefix?: string; // Prefix (e.g., "$")
  discountSuffix?: string; // Suffix (e.g., "%")
  discountPlaceholder: string;

  // Guidance
  bestFor: string[];
  example: string;

  // Display Formatting
  badgeFormat: (value: number, min?: number) => string;
}
```

---

## Template Field Behavior

### How Templates Affect StepOfferContent

| Template      | Discount Label     | Prefix | Suffix | Input Type         | Placeholder  |
| ------------- | ------------------ | ------ | ------ | ------------------ | ------------ |
| `dollar_off`  | "How much off?"    | `$`    | —      | `number`           | "10"         |
| `percent_off` | "What percentage?" | —      | `%`    | `number`           | "20"         |
| `bogo`        | "What item?"       | —      | —      | `text`             | "Any entrée" |
| `fixed_price` | "What price?"      | `$`    | —      | `number` (decimal) | "19.99"      |

### Code Reference

**File**: `components/features/offer-manager/p0-merchant/wizard/StepOfferContent.tsx`
**Lines**: 157-196

```typescript
const typeConfig = OFFER_TYPE_CONFIG[offerType];

<Label>{typeConfig.discountLabel}*</Label>
<Input
  type={offerType === "bogo" ? "text" : "number"}
  placeholder={typeConfig.discountPlaceholder}
  className={cn(
    typeConfig.discountPrefix && "pl-7",
    typeConfig.discountSuffix && "pr-10"
  )}
/>
```

---

## Backend Type Mapping

### ⚠️ IMPORTANT: Frontend to Backend Type Translation

The frontend template types **DO NOT** match backend API types exactly. Translation is required.

| Frontend (offer-templates.ts) | Backend (types/offers.ts) | Status            |
| ----------------------------- | ------------------------- | ----------------- |
| `dollar_off`                  | `dollars_off`             | ⚠️ Mapping needed |
| `percent_off`                 | `percentage_savings`      | ⚠️ Mapping needed |
| `bogo`                        | `bogo`                    | ✅ Match          |
| `fixed_price`                 | `price_point`             | ⚠️ Mapping needed |

### Backend Types Not in Wizard

- `cashback` - Cash back rewards
- `free_with_purchase` - Free item with purchase
- `clickthrough` - Online redirect offers
- `loyalty_points` - Loyalty points (future)
- `spend_and_get` - Spend & Get (future)

### Required Mapper Function

```typescript
// TODO: Add to lib/constants/offer-templates.ts
export const FRONTEND_TO_BACKEND_TYPE: Record<OfferTypeKey, OfferType> = {
  dollar_off: "dollars_off",
  percent_off: "percentage_savings",
  bogo: "bogo",
  fixed_price: "price_point",
};
```

---

## Fields by Section

### Fields That ARE Template-Dependent

| Field           | Behavior                                                  |
| --------------- | --------------------------------------------------------- |
| `discountValue` | Label, prefix, suffix, input type, placeholder all change |

### Fields That Are NOT Template-Dependent

These fields appear for ALL templates:

| Section            | Field                     | Type         | Required |
| ------------------ | ------------------------- | ------------ | -------- |
| Offer Information  | `offerName` (Headline)    | text         | Yes      |
| Offer Information  | `description`             | textarea     | Yes      |
| Offer Information  | `offerImageFile`          | file         | No       |
| Classification     | `category_ids`            | multi-select | No       |
| Classification     | `commodity_ids`           | multi-select | No       |
| Dates & Redemption | `startDate`               | date         | Yes      |
| Dates & Redemption | `endDate`                 | date         | No       |
| Dates & Redemption | `externalUrl`             | url          | Yes      |
| Dates & Redemption | `promoCode`               | text         | Yes      |
| Terms & Settings   | `termsConditions`         | textarea     | No       |
| Terms & Settings   | `usageLimitPerCustomer`   | select       | No       |
| Terms & Settings   | `redemptionRollingPeriod` | select       | No       |

---

## Categories & Commodities

### Current State

Categories and commodities are **UI-only fields** that enhance offer classification in the wizard, but they are NOT yet persisted to the MCM backend.

### Available Categories

```typescript
const AVAILABLE_CATEGORIES = [
  { label: "Food & Dining", value: "1" },
  { label: "Pizza", value: "2" },
  { label: "Burgers", value: "3" },
  { label: "Fine Dining", value: "4" },
  { label: "Fast Food", value: "5" },
  { label: "Cafe & Bakery", value: "6" },
  { label: "Retail", value: "7" },
  { label: "Clothing", value: "8" },
  { label: "Electronics", value: "9" },
  { label: "Home Goods", value: "10" },
  { label: "Entertainment", value: "11" },
  { label: "Movies", value: "12" },
  { label: "Sports Events", value: "13" },
  { label: "Services", value: "14" },
  { label: "Auto Repair", value: "15" },
  { label: "Home Services", value: "16" },
  { label: "Health & Wellness", value: "17" },
  { label: "Automotive", value: "18" },
  { label: "Travel", value: "19" },
];
```

### Available Commodities

```typescript
const AVAILABLE_COMMODITIES = [
  { label: "Entrees", value: "1" },
  { label: "Appetizers", value: "2" },
  { label: "Desserts", value: "3" },
  { label: "Beverages", value: "4" },
  { label: "Alcohol", value: "5" },
  { label: "Gift Cards", value: "6" },
  { label: "Merchandise", value: "7" },
  { label: "Services", value: "8" },
];
```

### Backend Support Status

| Field            | API Field                | Status                      |
| ---------------- | ------------------------ | --------------------------- |
| `category_ids`   | Not in API               | ❌ Pending backend endpoint |
| `commodity_ids`  | Not in API               | ❌ Pending backend endpoint |
| `classification` | `classification: string` | ✅ Single string available  |

---

## Smart Defaults

### Auto-Fill Behavior

The wizard provides smart defaults via `lib/constants/offer-templates.ts`:

```typescript
export const SMART_DEFAULTS = {
  usageLimitPerCustomer: "1",
  redemptionRollingPeriod: "single",
  offerSource: "MCM",
  redemptionTypes: ["external_url"],
  promoCodeType: "single",
  locationScope: "all",
  geography: "US",
  channel: "online",
  durationDays: 90,
};
```

### Terms & Conditions Auto-Fill

When a merchant is selected, terms are auto-populated based on merchant category:

```typescript
// Triggers in OfferManagerViewP0_5Wizard.tsx
if (field === "merchantData" && value) {
  const category = value.categories?.[0] || value.category;
  if (category && !formData.termsConditions) {
    const terms = getTermsTemplate(category);
    setFormData((prev) => ({ ...prev, termsConditions: terms }));
  }
}
```

---

## Future Template Enhancements

### Planned Show/Hide Logic

To implement template-conditional field visibility:

```typescript
interface OfferTypeConfig {
  // ... existing fields ...

  // Future: Field visibility rules
  showFields?: {
    minimumSpend?: boolean;
    maxDiscount?: boolean;
    buyQuantity?: boolean;
    getQuantity?: boolean;
  };

  // Future: Validation rules
  validation?: {
    discountMin?: number;
    discountMax?: number;
    requireMinimumSpend?: boolean;
  };
}
```

### Example: BOGO-Specific Fields

```typescript
bogo: {
  // ... existing config ...
  showFields: {
    buyQuantity: true,    // "Buy X"
    getQuantity: true,    // "Get Y"
    minimumSpend: false,  // Not applicable for BOGO
  },
}
```

---

## File References

| Purpose                 | File                                                                           |
| ----------------------- | ------------------------------------------------------------------------------ |
| Template definitions    | `lib/constants/offer-templates.ts`                                             |
| Wizard main view        | `components/features/offer-manager/p0-merchant/OfferManagerViewP0_5Wizard.tsx` |
| Step 1 - Type selection | `components/features/offer-manager/p0-merchant/wizard/StepOfferType.tsx`       |
| Step 2 - Merchant       | `components/features/offer-manager/p0-merchant/wizard/StepMerchant.tsx`        |
| Step 3 - Offer content  | `components/features/offer-manager/p0-merchant/wizard/StepOfferContent.tsx`    |
| Step 4 - Review         | `components/features/offer-manager/p0-merchant/wizard/StepReview.tsx`          |
| Backend types           | `types/offers.ts`                                                              |
| API service             | `lib/services/offersService.ts`                                                |

---

## Related Documentation

- [Offer Manager BRD](../../../../documentation/brd/offer-manager.md)
- [Offer Manager UI Spec](../../../../documentation/offer-manager-ui-spec.md)
- [Offer Manager Data Flow](../../../../documentation/offer-manager-data-flow.md)
- [Design Summary](../../../../documentation/offer-manager-design-summary.md)

---

_Last Updated: 2026-02-03_
_Version: 1.0_
_Status: Active Development_
