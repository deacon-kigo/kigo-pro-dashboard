# Offer Manager Manual Form Specification

## Required Data Fields for Manual Input Flow

## 🎯 Scope

This document extracts the **required data input fields** from the BRD for the manual wizard flow.

- **Excludes**: AI prompts, guidance text, conversational elements (handled by CopilotKit agent)
- **Includes**: Actual data that must be collected to create an offer and campaign

---

## PHASE 1: OFFER CREATION

### Step 1: Goal & Context

#### Required Data Fields

| Field             | Type         | Required | Notes                                                   |
| ----------------- | ------------ | -------- | ------------------------------------------------------- |
| `programType`     | Select       | Yes      | Closed loop (John Deere), Open loop (Yardi), or General |
| `targetAudience`  | Multi-select | Yes      | Existing customers, new prospects, lapsed customers     |
| `maxDiscount`     | Number       | No       | Maximum discount value                                  |
| `maxDiscountUnit` | Select       | No       | % or $                                                  |
| `totalBudget`     | Number       | No       | Total campaign budget in $                              |
| `startDate`       | Date         | Yes      | Campaign start date                                     |
| `endDate`         | Date         | Yes      | Campaign end date                                       |

#### Removed from Manual Form

- ❌ `businessObjective` (Natural language) - This is for AI agent context, not required field
- User can describe goals in CopilotKit chat, but form doesn't need this field

#### Form Validation

```typescript
const validateGoalStep = (data) => {
  if (!data.programType) return "Program type is required";
  if (!data.targetAudience || data.targetAudience.length === 0) {
    return "Select at least one target audience";
  }
  if (!data.startDate || !data.endDate) return "Timeline is required";
  if (new Date(data.endDate) < new Date(data.startDate)) {
    return "End date must be after start date";
  }
  return null; // Valid
};
```

---

### Step 2: Offer Type & Value

#### Required Data Fields

| Field              | Type          | Required | Notes                                                                     |
| ------------------ | ------------- | -------- | ------------------------------------------------------------------------- |
| `offerType`        | Select        | Yes      | Percentage, Fixed, BOGO, Cashback, Loyalty Points, Spend & Get, Lightning |
| `offerValue`       | Number/String | Yes      | Value depends on offer type                                               |
| `offerTitle`       | Text          | Yes      | Customer-facing headline (max 100 chars)                                  |
| `offerDescription` | Textarea      | No       | Detailed description (max 500 chars)                                      |

#### Offer Type Value Fields (Dynamic)

```typescript
interface OfferValueByType {
  percentage_discount: { value: number }; // 1-100
  fixed_discount: { value: number }; // Dollar amount
  bogo: {
    buyQuantity: number;
    getQuantity: number;
    getDiscount: number; // 0-100% (0=free, 50=half off)
  };
  cashback: { value: number }; // Dollar amount
  loyalty_points: { points: number };
  spend_get: {
    spendAmount: number;
    getReward: string; // "Free item" or "$X off"
  };
  lightning: {
    baseOfferType: "percentage" | "fixed";
    value: number;
    timeLimit?: number; // hours
    quantityLimit?: number;
  };
}
```

#### Removed from Manual Form

- ❌ AI recommendations (shown in CopilotKit chat)
- ❌ Expected performance metrics (AI provides this)
- ❌ Historical performance data (AI context)

#### Form Validation

```typescript
const validateOfferTypeStep = (data) => {
  if (!data.offerType) return "Offer type is required";
  if (!data.offerValue) return "Offer value is required";
  if (!data.offerTitle) return "Offer title is required";
  if (data.offerTitle.length > 100) return "Title max 100 characters";
  return null;
};
```

---

### Step 3: Redemption Method

#### Required Data Fields

| Field              | Type   | Required | Notes                                            |
| ------------------ | ------ | -------- | ------------------------------------------------ |
| `redemptionMethod` | Select | Yes      | promo_code, show_save, barcode_scan, online_link |

#### Conditional: No Additional Fields for Non-Promo Methods

- `show_save`: No additional fields
- `barcode_scan`: No additional fields
- `online_link`: No additional fields

**These methods just need selection, promo code details go in Step 4**

#### Form Validation

```typescript
const validateRedemptionStep = (data) => {
  if (!data.redemptionMethod) return "Redemption method is required";
  return null;
};
```

---

### Step 4: Promo Code Setup (CONDITIONAL)

**Visibility**: Only if Step 3 `redemptionMethod === 'promo_code'`

#### Required Data Fields

| Field                   | Type         | Required    | Notes                              |
| ----------------------- | ------------ | ----------- | ---------------------------------- |
| `promoCodeType`         | Radio        | Yes         | single or multiple                 |
| `promoCodes`            | Text/File    | Yes         | Single code or CSV upload          |
| `usageLimitPerCustomer` | Number       | No          | Default: unlimited                 |
| `totalUsageLimit`       | Number       | No          | Default: unlimited                 |
| `locationScope`         | Radio        | Yes         | all, selected, individual          |
| `selectedLocations`     | Multi-select | Conditional | Required if locationScope=selected |

#### Program-Specific Fields

**John Deere (Closed Loop)**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `isNetworkCode` | Boolean | No | Corporate network vs dealer-specific |
| `participatingDealers` | Multi-select | Conditional | Required if isNetworkCode=true |
| `dealerLocations` | Multi-select | Conditional | Required if isNetworkCode=false |

**Yardi (Open Loop)**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `isYardiGenerated` | Boolean | No | Yardi code vs merchant partner code |
| `merchantPartners` | Multi-select | Conditional | Required if isYardiGenerated=false |
| `merchantLocations` | Multi-select | Conditional | Per merchant location selection |

#### Form Validation

```typescript
const validatePromoCodeStep = (data) => {
  if (!data.promoCodeType) return "Code type is required";

  if (data.promoCodeType === "single" && !data.promoCodes) {
    return "Promo code is required";
  }

  if (data.promoCodeType === "multiple" && !data.promoCodesFile) {
    return "Upload CSV file with promo codes";
  }

  if (!data.locationScope) return "Location scope is required";

  if (data.locationScope === "selected" && !data.selectedLocations?.length) {
    return "Select at least one location";
  }

  return null;
};
```

---

### Step 5: Brand & Compliance

#### Required Data Fields

| Field              | Type       | Required | Notes                                      |
| ------------------ | ---------- | -------- | ------------------------------------------ |
| `offerTitle`       | Text       | Yes      | Already collected in Step 2, can edit here |
| `offerDescription` | Textarea   | Yes      | Detailed customer messaging                |
| `termsConditions`  | Textarea   | Yes      | Legal terms (can use template)             |
| `exclusions`       | Text Array | No       | Products/services excluded                 |
| `brandLogo`        | File       | No       | Upload or use default                      |
| `brandColors`      | Object     | No       | Primary/secondary colors                   |

#### Removed from Manual Form

- ❌ Brand compliance validation (AI checks this in background)
- ❌ Brand guidelines (shown as helper text, not input field)
- ❌ Compliance suggestions (AI provides in chat)

#### Form Validation

```typescript
const validateBrandStep = (data) => {
  if (!data.offerDescription) return "Description is required";
  if (data.offerDescription.length > 500)
    return "Description max 500 characters";
  if (!data.termsConditions) return "Terms & conditions required";
  return null;
};
```

#### Special Actions

- **"Save & Exit"** - Saves offer to catalog, exits wizard
- **"Continue to Campaign →"** - Proceeds to Step 7 (skips Step 6)

---

## PHASE 2: CAMPAIGN MANAGEMENT

### Step 6: Offer Selection (CONDITIONAL)

**Visibility**: Only if starting "Campaign-Only" flow (not from offer creation)

#### Required Data Fields

| Field             | Type   | Required | Notes                     |
| ----------------- | ------ | -------- | ------------------------- |
| `selectedOfferId` | Select | Yes      | Choose from offer catalog |

#### Offer Catalog Filters

- Filter by type: Affiliate, Card-Linked, Discounted Product, Created
- Filter by program: Closed loop, Open loop, General
- Filter by status: Active, Scheduled, Draft

#### Auto-Skip Logic

```typescript
if (comingFromOfferCreation) {
  // Auto-populate selectedOfferId from Step 5
  // Skip Step 6 entirely
  goToStep(7);
}
```

---

### Step 7: Targeting & Partners

#### Required Data Fields

| Field             | Type         | Required    | Notes                                           |
| ----------------- | ------------ | ----------- | ----------------------------------------------- |
| `geographicScope` | Radio        | Yes         | national, regional, local                       |
| `regions`         | Multi-select | Conditional | Required if scope=regional                      |
| `targetingMethod` | Radio        | Yes         | customer_list, engagement, redemption, combined |

#### Targeting Method: Customer List Upload

| Field              | Type | Required | Notes                           |
| ------------------ | ---- | -------- | ------------------------------- |
| `customerListFile` | File | Yes      | CSV with account IDs and emails |

#### Targeting Method: Segmentation

| Field                | Type         | Required | Notes                                              |
| -------------------- | ------------ | -------- | -------------------------------------------------- |
| `engagementSegments` | Multi-select | No       | App usage, loyalty activity, transaction frequency |
| `redemptionSegments` | Multi-select | No       | Past redemptions, category preferences             |

#### Program-Specific Fields

**John Deere (Closed Loop)**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `dealerNetwork` | Multi-select | Yes | Select participating dealers (with their locations) |
| `customerAccountLists` | File | No | Optional targeted airdrop lists |

**Yardi (Open Loop)**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `propertyPortfolio` | Multi-select | Yes | Select properties (with their locations) |
| `tenantLists` | File | No | Optional targeted airdrop lists |
| `merchantPartners` | Multi-select | No | Merchant partners for this campaign |

#### Form Validation

```typescript
const validateTargetingStep = (data) => {
  if (!data.geographicScope) return "Geographic scope is required";

  if (data.geographicScope === "regional" && !data.regions?.length) {
    return "Select at least one region";
  }

  if (!data.targetingMethod) return "Targeting method is required";

  if (data.targetingMethod === "customer_list" && !data.customerListFile) {
    return "Upload customer list CSV";
  }

  // Program-specific validation
  if (data.programType === "closed_loop" && !data.dealerNetwork?.length) {
    return "Select at least one dealer";
  }

  if (data.programType === "open_loop" && !data.propertyPortfolio?.length) {
    return "Select at least one property";
  }

  return null;
};
```

---

### Step 8: Schedule & Timing

#### Required Data Fields

| Field       | Type     | Required | Notes                       |
| ----------- | -------- | -------- | --------------------------- |
| `startDate` | DateTime | Yes      | Campaign launch date/time   |
| `endDate`   | DateTime | Yes      | Campaign end date/time      |
| `timeZone`  | Select   | Yes      | Auto-detected, can override |

#### Optional Fields

| Field           | Type | Required | Notes                                  |
| --------------- | ---- | -------- | -------------------------------------- |
| `seasonalNotes` | Text | No       | User notes about timing considerations |

#### Removed from Manual Form

- ❌ AI timing recommendations (shown in chat)
- ❌ Optimal duration analysis (AI provides)
- ❌ Conflict detection (shown as warnings, not input field)
- ❌ Program-specific insights (AI context)

#### Form Validation

```typescript
const validateScheduleStep = (data) => {
  if (!data.startDate || !data.endDate) return "Timeline is required";

  const now = new Date();
  if (new Date(data.startDate) < now) {
    return "Start date must be in the future";
  }

  if (new Date(data.endDate) <= new Date(data.startDate)) {
    return "End date must be after start date";
  }

  if (!data.timeZone) return "Time zone is required";

  return null;
};
```

---

### Step 9: Delivery Channels

#### Required Data Fields

| Field              | Type         | Required | Notes                         |
| ------------------ | ------------ | -------- | ----------------------------- |
| `selectedChannels` | Multi-select | Yes      | At least one channel required |

#### Channel Options (Program-Aware)

**All Programs**:
| Channel | ID | Config Required |
|---------|-----|-----------------|
| Activation Campaigns | `activation` | Yes |
| Hub Airdrops | `hub_airdrop` | Yes |

**Open Loop Only**:
| Channel | ID | Config Required |
|---------|-----|-----------------|
| Promoted Marketplace | `promoted_marketplace` | Yes |
| Organic Marketplace | `organic_marketplace` | Yes |

#### Channel Configuration Fields

**Activation Campaign**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `landingPageContent` | Textarea | No | Custom campaign messaging |
| `distributionMethods` | Multi-select | Yes | qr_code, print, email, social |
| `trackingParams` | Key-Value | No | Custom UTM parameters |

**Hub Airdrop**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `deliveryTiming` | DateTime | Yes | When to deliver to wallets |
| `notificationMessage` | Text | No | Custom notification text |
| `personalization` | Boolean | No | Use personalized messaging |

**Promoted Marketplace**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `promotionBudget` | Number | Yes | Budget in $ |
| `biddingStrategy` | Radio | Yes | automatic or manual |
| `targetingCriteria` | Object | No | Advanced targeting options |

**Organic Marketplace**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `categoryPlacement` | Multi-select | Yes | Categories for listing |
| `searchKeywords` | Text Array | No | SEO keywords |

#### Program-Specific Availability

```typescript
const getAvailableChannels = (programType) => {
  const allChannels = ["activation", "hub_airdrop"];

  if (programType === "closed_loop") {
    return allChannels; // John Deere: Only these 2
  }

  if (programType === "open_loop") {
    return [...allChannels, "promoted_marketplace", "organic_marketplace"]; // Yardi: All 4
  }

  return allChannels; // General: Default 2
};
```

#### Form Validation

```typescript
const validateChannelsStep = (data) => {
  if (!data.selectedChannels?.length) {
    return "Select at least one delivery channel";
  }

  // Validate channel configs
  for (const channel of data.selectedChannels) {
    if (
      channel === "activation" &&
      !data.activationConfig.distributionMethods?.length
    ) {
      return "Select at least one distribution method for Activation Campaign";
    }

    if (channel === "hub_airdrop" && !data.hubAirdropConfig.deliveryTiming) {
      return "Set delivery timing for Hub Airdrop";
    }

    if (
      channel === "promoted_marketplace" &&
      !data.promotedConfig.promotionBudget
    ) {
      return "Set promotion budget for Promoted Marketplace";
    }

    if (
      channel === "organic_marketplace" &&
      !data.organicConfig.categoryPlacement?.length
    ) {
      return "Select at least one category for Organic Marketplace";
    }
  }

  return null;
};
```

---

### Step 10: Review & Launch

#### No New Data Fields

This step is **read-only review** of all collected data.

#### Review Sections

1. **Offer Summary** (from Steps 1-5)
2. **Campaign Configuration** (from Steps 6-9)
3. **Performance Projections** (AI-generated, shown only)
4. **Budget Impact** (AI-calculated, shown only)
5. **Compliance Status** (AI-validated, shown only)

#### Actions (No Form Fields)

- **Edit** - Navigate back to any step to modify
- **Save Draft** - Save campaign as draft status
- **Schedule** - Set status to scheduled (uses Step 8 dates)
- **Launch Now** - Set status to active immediately

#### Final Validation

```typescript
const validateReviewStep = (allData) => {
  // Re-run all previous validations
  const errors = [];

  // Offer validation
  if (!allData.offer.offerType) errors.push("Offer type missing");
  if (!allData.offer.redemptionMethod) errors.push("Redemption method missing");

  // Campaign validation
  if (!allData.campaign.targeting) errors.push("Targeting incomplete");
  if (!allData.campaign.schedule) errors.push("Schedule incomplete");
  if (!allData.campaign.channels?.length) errors.push("No delivery channels");

  return errors.length > 0 ? errors : null;
};
```

---

## 📊 Complete Data Structure

```typescript
interface OfferManagerFormData {
  // PHASE 1: OFFER CREATION
  offer: {
    // Step 1: Goal & Context
    programType: "closed_loop" | "open_loop" | "general";
    targetAudience: string[];
    maxDiscount?: number;
    maxDiscountUnit?: "%" | "$";
    totalBudget?: number;
    startDate: string; // ISO date
    endDate: string; // ISO date

    // Step 2: Offer Type & Value
    offerType:
      | "percentage_discount"
      | "fixed_discount"
      | "bogo"
      | "cashback"
      | "loyalty_points"
      | "spend_get"
      | "lightning";
    offerValue: any; // Type depends on offerType
    offerTitle: string;
    offerDescription?: string;

    // Step 3: Redemption Method
    redemptionMethod:
      | "promo_code"
      | "show_save"
      | "barcode_scan"
      | "online_link";

    // Step 4: Promo Code Setup (conditional)
    promoCodes?: {
      codeType: "single" | "multiple";
      codes: string[] | File;
      usageLimitPerCustomer?: number;
      totalUsageLimit?: number;
      locationScope: "all" | "selected" | "individual";
      selectedLocations?: string[];

      // Program-specific
      isNetworkCode?: boolean; // John Deere
      participatingDealers?: string[]; // John Deere
      isYardiGenerated?: boolean; // Yardi
      merchantPartners?: string[]; // Yardi
    };

    // Step 5: Brand & Compliance
    termsConditions: string;
    exclusions?: string[];
    brandLogo?: File;
    brandColors?: {
      primary: string;
      secondary: string;
    };

    // Saved offer ID (after Step 5 save)
    offerId?: string;
  };

  // PHASE 2: CAMPAIGN MANAGEMENT
  campaign: {
    // Step 6: Offer Selection (conditional)
    selectedOfferId?: string; // From catalog or auto-filled

    // Step 7: Targeting & Partners
    geographicScope: "national" | "regional" | "local";
    regions?: string[];
    targetingMethod: "customer_list" | "engagement" | "redemption" | "combined";
    customerListFile?: File;
    engagementSegments?: string[];
    redemptionSegments?: string[];

    // Program-specific
    dealerNetwork?: string[]; // John Deere (dealer IDs with locations)
    propertyPortfolio?: string[]; // Yardi (property IDs with locations)
    merchantPartners?: string[]; // Yardi

    // Step 8: Schedule & Timing
    startDate: string; // ISO datetime
    endDate: string; // ISO datetime
    timeZone: string;
    seasonalNotes?: string;

    // Step 9: Delivery Channels
    selectedChannels: (
      | "activation"
      | "hub_airdrop"
      | "promoted_marketplace"
      | "organic_marketplace"
    )[];

    channelConfigs: {
      activation?: {
        landingPageContent?: string;
        distributionMethods: ("qr_code" | "print" | "email" | "social")[];
        trackingParams?: Record<string, string>;
      };

      hub_airdrop?: {
        deliveryTiming: string;
        notificationMessage?: string;
        personalization?: boolean;
      };

      promoted_marketplace?: {
        promotionBudget: number;
        biddingStrategy: "automatic" | "manual";
        targetingCriteria?: Record<string, any>;
      };

      organic_marketplace?: {
        categoryPlacement: string[];
        searchKeywords?: string[];
      };
    };

    // Step 10: Review (no new fields, just final state)
    status?: "draft" | "scheduled" | "active";

    // Saved campaign ID (after launch)
    campaignId?: string;
  };

  // Navigation state
  currentStep: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  completedSteps: number[];
  flowType: "linear" | "offer_only" | "campaign_only";
}
```

---

## 🎯 Summary

### Required Fields Count by Step

1. **Step 1**: 4 required (programType, targetAudience, startDate, endDate)
2. **Step 2**: 3 required (offerType, offerValue, offerTitle)
3. **Step 3**: 1 required (redemptionMethod)
4. **Step 4**: 3+ required if promo_code (codeType, codes, locationScope)
5. **Step 5**: 2 required (offerDescription, termsConditions)
6. **Step 6**: 1 required if campaign-only (selectedOfferId)
7. **Step 7**: 2+ required (geographicScope, targetingMethod, + program-specific)
8. **Step 8**: 3 required (startDate, endDate, timeZone)
9. **Step 9**: 1+ required (selectedChannels, + channel configs)
10. **Step 10**: 0 required (review only)

**Total Core Fields**: ~20-25 required fields depending on selections

### What's Handled by AI Agent (Not Form Fields)

- ❌ Business objective prompts
- ❌ AI recommendations
- ❌ Performance predictions
- ❌ Historical data analysis
- ❌ Optimization suggestions
- ❌ Brand compliance checking (shown as status, not input)
- ❌ Conflict detection (shown as warnings, not input)

---

_This spec focuses purely on data collection for the manual wizard UI_
