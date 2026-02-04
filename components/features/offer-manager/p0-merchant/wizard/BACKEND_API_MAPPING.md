# P0.5 Wizard - Backend API Mapping

## Overview

This document maps the P0.5 Wizard frontend fields to the MCM (Merchant Campaign Management) backend API. It identifies gaps and required translations.

---

## API Endpoint

```
POST /dashboard/offers
PUT  /dashboard/offers/{offer_id}
```

**Backend Handler**: `kigo-core-server/src/handlers/dashboard/offers/`

---

## Field Mapping: Frontend → Backend

### Required Fields

| Frontend Field    | Backend Field              | Type           | Translation Needed               |
| ----------------- | -------------------------- | -------------- | -------------------------------- |
| `merchantData.id` | `merchant_owner`           | `number`       | ✅ Direct                        |
| `startDate`       | `version_active_from`      | `string (ISO)` | ✅ Direct                        |
| `offerType`       | `offer_type`               | `OfferType`    | ⚠️ **Translation Required**      |
| `redemptionTypes` | `offer_redemption_methods` | `string[]`     | ✅ Direct                        |
| —                 | `code_type`                | `"S" \| "M"`   | ⚠️ **Derive from promoCodeType** |

### Optional Fields

| Frontend Field | Backend Field         | Type           | Translation Needed         |
| -------------- | --------------------- | -------------- | -------------------------- |
| `endDate`      | `offer_expiry_date`   | `string (ISO)` | ✅ Direct                  |
| `externalUrl`  | `clickthru_url`       | `string`       | ✅ Direct                  |
| —              | `default_language`    | `string`       | Default to `"en"`          |
| —              | `external_reference`  | `string`       | Generate or leave empty    |
| —              | `offer_status`        | `OfferStatus`  | Default to `"draft"`       |
| —              | `classification`      | `string`       | See Classification section |
| —              | `edition_exclusivity` | `string[]`     | Not used in wizard         |

### Descriptive Fields (Separate Table)

| Frontend Field             | Backend Field      | Notes                           |
| -------------------------- | ------------------ | ------------------------------- |
| `offerName` / `shortText`  | `short_text`       | Via `offer_descriptives` table  |
| `description` / `longText` | `long_text`        | Via `offer_descriptives` table  |
| `termsConditions`          | `terms_conditions` | Via `offer_descriptives` table  |
| `offerImagePreview`        | `image_url`        | Via `offer_descriptives` table  |
| `discountValue`            | `savings_amount`   | Via `offer_descriptives` table  |
| `offerType`                | `savings_type`     | Derive: "percentage" or "fixed" |

---

## Offer Type Translation

### ⚠️ CRITICAL: Type Names Don't Match

```typescript
// Frontend Types (lib/constants/offer-templates.ts)
type OfferTypeKey = "dollar_off" | "percent_off" | "bogo" | "fixed_price";

// Backend Types (types/offers.ts)
type OfferType =
  | "bogo"
  | "percentage_savings"
  | "dollars_off"
  | "cashback"
  | "free_with_purchase"
  | "price_point"
  | "clickthrough"
  | "loyalty_points"
  | "spend_and_get";
```

### Required Mapping

```typescript
const WIZARD_TO_API_OFFER_TYPE: Record<OfferTypeKey, OfferType> = {
  dollar_off: "dollars_off", // ⚠️ Note: "dollar" → "dollars"
  percent_off: "percentage_savings", // ⚠️ Note: Complete rename
  bogo: "bogo", // ✅ Match
  fixed_price: "price_point", // ⚠️ Note: Complete rename
};
```

### Implementation Location

**Suggested**: Add to `lib/constants/offer-templates.ts` or create `lib/mappers/offerTypeMapper.ts`

---

## Code Type Derivation

The backend `code_type` field must be a **single character**.

### Mapping Logic

```typescript
function getCodeType(promoCodeType: string): "S" | "M" {
  switch (promoCodeType) {
    case "single":
    case "universal":
      return "S"; // Single code for all users
    case "multiple":
    case "unique":
      return "M"; // Multiple unique codes
    default:
      return "S";
  }
}
```

### Backend Validation

```rust
// kigo-core-server validation
if input.code_type.len() != 1 {
    return error!("Code type must be single character");  // 400 error
}
```

---

## Classification Field

### Current Backend Support

The API has a single `classification?: string` field (optional).

### Frontend Fields Without Backend Support

| Frontend Field | Form State Key            | Backend Support |
| -------------- | ------------------------- | --------------- |
| Categories     | `category_ids: string[]`  | ❌ Not in API   |
| Commodities    | `commodity_ids: string[]` | ❌ Not in API   |

### Options for Categories/Commodities

**Option A: Don't send (current state)**

- Categories/commodities stay in UI only
- No persistence to backend

**Option B: Serialize into classification**

```typescript
// Workaround using classification field
const classification = JSON.stringify({
  categories: formData.category_ids,
  commodities: formData.commodity_ids,
});
```

**Option C: Request backend enhancement**

- Add `category_ids` and `commodity_ids` to API
- Requires kigo-core-server changes

---

## Redemption Method Mapping

### Frontend Values

```typescript
const redemptionTypes = ["external_url"]; // Default from SMART_DEFAULTS
```

### Backend Values

```typescript
type OfferRedemptionMethod =
  | "in_store"
  | "print"
  | "online"
  | "promo_code"
  | "show_and_save"
  | "barcode_scan"
  | "online_link"; // Maps to "external_url"
```

### Mapping

```typescript
const WIZARD_TO_API_REDEMPTION: Record<string, OfferRedemptionMethod> = {
  external_url: "online_link",
  mobile: "in_store",
  print: "print",
  promo_code: "promo_code",
};
```

---

## Complete Payload Builder

```typescript
interface WizardFormData {
  merchantData: { id: number /* ... */ };
  offerType: OfferTypeKey;
  discountValue: string;
  offerName: string;
  description: string;
  startDate: string;
  endDate?: string;
  externalUrl: string;
  promoCode: string;
  termsConditions?: string;
  redemptionTypes: string[];
  // ... other fields
}

function buildCreateOfferPayload(formData: WizardFormData): CreateOfferInput {
  return {
    // Required fields
    merchant_owner: formData.merchantData.id,
    version_active_from: formData.startDate,
    offer_type: WIZARD_TO_API_OFFER_TYPE[formData.offerType],
    offer_redemption_methods: formData.redemptionTypes.map(
      (type) => WIZARD_TO_API_REDEMPTION[type] || type
    ),
    code_type: "S", // Or derive from promoCodeType

    // Optional fields
    offer_expiry_date: formData.endDate || undefined,
    clickthru_url: formData.externalUrl || undefined,
    default_language: "en",
    offer_status: "draft",

    // Classification (optional workaround)
    classification: formData.category_ids?.length
      ? formData.category_ids.join(",")
      : undefined,
  };
}
```

---

## Validation Rules

### Backend Validation (400 errors)

| Field                 | Rule                                | Error                                |
| --------------------- | ----------------------------------- | ------------------------------------ |
| `code_type`           | Must be exactly 1 character         | "Code type must be single character" |
| `merchant_owner`      | Must be valid merchant ID           | "Invalid merchant"                   |
| `offer_type`          | Must be valid enum value            | "Invalid offer type"                 |
| `version_active_from` | Must be valid ISO date              | "Invalid date format"                |
| `offer_expiry_date`   | Must be after `version_active_from` | "Expiry before start"                |

### Frontend Validation (pre-submit)

```typescript
// OfferManagerViewP0_5Wizard.tsx canProceed()
case "offer":
  return !!(
    formData.discountValue &&
    formData.offerName?.trim() &&
    formData.description?.trim() &&
    formData.startDate &&
    formData.externalUrl?.trim() &&
    formData.promoCode?.trim()
  );
```

---

## API Gaps

### Missing Endpoints

| Feature                   | Endpoint Needed                              | Status             |
| ------------------------- | -------------------------------------------- | ------------------ |
| Categories                | `GET /dashboard/categories`                  | ❌ Not implemented |
| Commodities               | `GET /dashboard/commodities`                 | ❌ Not implemented |
| Offer descriptives update | `PUT /dashboard/offers/{id}/descriptives`    | ❌ Not implemented |
| Customer list upload      | `POST /dashboard/offers/{id}/customer-lists` | ❌ Not implemented |

### Workarounds

| Gap                    | Workaround                              |
| ---------------------- | --------------------------------------- |
| Categories/Commodities | Store in `classification` field as JSON |
| Descriptives           | Created automatically on offer creation |
| Customer lists         | Document manually or external system    |

---

## Testing Checklist

Before integrating:

- [ ] Verify `offer_type` translation works
- [ ] Verify `code_type` is single character
- [ ] Verify dates are ISO 8601 format
- [ ] Verify redemption method mapping
- [ ] Test with all 4 template types
- [ ] Test with/without optional fields
- [ ] Test error handling for 400 responses

---

## File References

| Purpose            | File                                                                           |
| ------------------ | ------------------------------------------------------------------------------ |
| Backend types      | `types/offers.ts`                                                              |
| API service        | `lib/services/offersService.ts`                                                |
| Frontend templates | `lib/constants/offer-templates.ts`                                             |
| Wizard view        | `components/features/offer-manager/p0-merchant/OfferManagerViewP0_5Wizard.tsx` |
| Data flow docs     | `documentation/offer-manager-data-flow.md`                                     |

---

_Last Updated: 2026-02-03_
_Version: 1.0_
_Status: Pending Integration_
