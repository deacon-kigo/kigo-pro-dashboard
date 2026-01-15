# Feature Flags Usage Guide

## Offer Creation Form - Skateboard to Car Approach

This document explains how to use feature flags to progressively enhance the offer creation form from a simple manual form (skateboard) to an AI-powered autonomous system (rocket).

---

## Quick Start

### 1. Set Environment Variables

Create or update `.env.local`:

```bash
# Choose version: v1, v2, v3, or v4
NEXT_PUBLIC_OFFER_CREATION_VERSION=v1

# OR enable specific features independently (for gradual rollout)
NEXT_PUBLIC_OFFER_FORM_SMART_DEFAULTS=true
NEXT_PUBLIC_OFFER_FORM_INLINE_VALIDATION=true
NEXT_PUBLIC_OFFER_FORM_AUTO_SAVE=false
NEXT_PUBLIC_OFFER_FORM_AI_ASSIST=false
```

### 2. Import in Your Component

```typescript
import {
  getOfferCreationVersion,
  isOfferFormFeatureEnabled,
  isOfferFormV2OrHigher,
} from "@/config/featureFlags";
```

### 3. Use in Component Logic

```typescript
export default function OfferCreationPage() {
  const version = getOfferCreationVersion();

  // Render different components based on version
  if (version === "v1") {
    return <OfferCreationFormV1 />;
  } else if (version === "v2") {
    return <OfferCreationFormV2 />;
  } else if (version === "v3") {
    return <OfferCreationFormV3 />;
  } else {
    return <OfferCreationFormV4 />;
  }
}
```

---

## Version Progression

### 🛹 V1: SKATEBOARD (Current - Production Ready)

**Goal:** Get users creating offers quickly with minimal friction

**Features:**

- Manual form with all required fields
- Multi-step wizard (Offer Details → Redemption Method → Review)
- Merchant/source selection with creatable dropdown
- Category & commodity multi-select
- Redemption method choice (promo code, receipt scan, affiliate)
- Review & submit

**Use Case:** Initial MVP, simple offer creation

**Status:** ✅ PRODUCTION

```typescript
// Implementation already exists at:
// components/features/offer-manager/v1/steps/OfferDetailsStep.tsx
```

---

### 🚲 V2: BIKE (Planned)

**Goal:** Make the form smarter and more helpful

**New Features:**

- ✨ Smart field defaults based on merchant/category selection
- ✅ Inline validation with helpful error messages
- 🔗 Field dependencies (auto-suggest categories based on merchant)
- 💾 Draft auto-save functionality
- 📊 Progress indicator with completion percentage

**Use Case:** Reduce user errors, speed up form completion

**Status:** 🚧 PLANNED

**Example Usage:**

```typescript
import { isOfferFormFeatureEnabled } from "@/config/featureFlags";

export default function OfferDetailsStep({ formData, onUpdate }) {
  // Check if smart defaults are enabled
  const hasSmartDefaults = isOfferFormFeatureEnabled("smartDefaults");
  const hasInlineValidation = isOfferFormFeatureEnabled("inlineValidation");
  const hasAutoSave = isOfferFormFeatureEnabled("autoSave");

  // Auto-suggest categories when merchant changes
  useEffect(() => {
    if (hasSmartDefaults && formData.merchant) {
      const suggestedCategories = getSuggestedCategories(formData.merchant);
      onUpdate("categories", suggestedCategories);
    }
  }, [formData.merchant, hasSmartDefaults]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (hasAutoSave) {
      const timer = setInterval(() => {
        saveDraft(formData);
      }, 30000);
      return () => clearInterval(timer);
    }
  }, [formData, hasAutoSave]);

  return (
    <div>
      <Input
        value={formData.offerName}
        onChange={(e) => onUpdate("offerName", e.target.value)}
        // Show inline validation if enabled
        error={
          hasInlineValidation ? validateOfferName(formData.offerName) : null
        }
      />
    </div>
  );
}
```

---

### 🚗 V3: CAR (Future)

**Goal:** Leverage AI to accelerate offer creation

**New Features:**

- 🤖 AI-powered offer suggestions from natural language input
- ✨ "Ask AI" buttons for each field with contextual help
- 📥 Bulk import from CSV/Excel
- 📋 Template library (common offer patterns)
- 🧪 A/B testing recommendations

**Use Case:** Power users, bulk operations, AI assistance

**Status:** 🔮 FUTURE

**Example Usage:**

```typescript
import { isOfferFormFeatureEnabled } from "@/config/featureFlags";

export default function OfferDetailsStep({ formData, onUpdate }) {
  const hasAIAssist = isOfferFormFeatureEnabled("aiAssist");
  const hasTemplates = isOfferFormFeatureEnabled("templates");
  const hasBulkImport = isOfferFormFeatureEnabled("bulkImport");

  return (
    <div>
      {/* Show AI assistant button */}
      {hasAIAssist && (
        <Button onClick={() => openAIAssistant()}>
          <SparklesIcon /> Ask AI for help
        </Button>
      )}

      {/* Show template selector */}
      {hasTemplates && (
        <TemplateSelector
          onSelect={(template) => applyTemplate(template, onUpdate)}
        />
      )}

      {/* Show bulk import option */}
      {hasBulkImport && (
        <Button onClick={() => openBulkImport()}>
          Import from CSV
        </Button>
      )}

      {/* Regular form fields */}
      <Input value={formData.offerName} />
    </div>
  );
}
```

---

### 🚀 V4: ROCKET (Vision)

**Goal:** Fully autonomous offer creation and optimization

**New Features:**

- 🧠 AI analyzes merchant data and auto-generates offers
- 📈 Performance predictions before launch
- ⚡ Auto-optimization based on real-time data
- 🎯 Integration with CRM for personalized offers
- 🔄 Self-learning system that improves over time

**Use Case:** Enterprise customers, automated marketing

**Status:** 🔮 VISION

---

## Gradual Feature Rollout

You can enable individual features without jumping to a full version:

```bash
# Stay on v1 but enable specific v2 features
NEXT_PUBLIC_OFFER_CREATION_VERSION=v1
NEXT_PUBLIC_OFFER_FORM_SMART_DEFAULTS=true
NEXT_PUBLIC_OFFER_FORM_INLINE_VALIDATION=true
```

This allows you to:

- Test features incrementally
- A/B test specific enhancements
- Roll back individual features if issues arise
- Progressive enhancement approach

---

## Helper Functions

### `getOfferCreationVersion()`

Returns the current version string.

```typescript
const version = getOfferCreationVersion(); // "v1" | "v2" | "v3" | "v4"
```

### `isOfferFormV2OrHigher()`

Check if using v2 or higher (useful for progressive enhancement).

```typescript
if (isOfferFormV2OrHigher()) {
  // Show advanced features
}
```

### `isOfferFormV3OrHigher()`

Check if using v3 or higher.

```typescript
if (isOfferFormV3OrHigher()) {
  // Show AI features
}
```

### `isOfferFormFeatureEnabled(feature)`

Check if a specific feature is enabled (respects both version and individual flags).

```typescript
if (isOfferFormFeatureEnabled("smartDefaults")) {
  // Use smart defaults
}

if (isOfferFormFeatureEnabled("aiAssist")) {
  // Show AI assistant
}
```

**Available features:**

- `"smartDefaults"`
- `"inlineValidation"`
- `"autoSave"`
- `"aiAssist"`
- `"bulkImport"`
- `"templates"`

### `getOfferCreationVersionDescription()`

Get a human-readable description of the current version.

```typescript
const desc = getOfferCreationVersionDescription();
// "Skateboard - Manual form with all required fields"
```

---

## Component Structure Recommendation

```
components/features/offer-manager/
├── OfferCreationForm.tsx          # Main router component
├── v1/
│   ├── OfferCreationFormV1.tsx    # Skateboard implementation
│   └── steps/
│       ├── OfferDetailsStep.tsx
│       ├── RedemptionMethodStep.tsx
│       └── ReviewStep.tsx
├── v2/
│   ├── OfferCreationFormV2.tsx    # Bike implementation
│   ├── components/
│   │   ├── SmartDefaults.tsx
│   │   ├── InlineValidation.tsx
│   │   └── AutoSaveIndicator.tsx
│   └── steps/
│       └── ... (enhanced versions)
├── v3/
│   ├── OfferCreationFormV3.tsx    # Car implementation
│   ├── components/
│   │   ├── AIAssistant.tsx
│   │   ├── TemplateLibrary.tsx
│   │   └── BulkImport.tsx
│   └── steps/
│       └── ... (AI-enhanced versions)
└── v4/
    ├── OfferCreationFormV4.tsx    # Rocket implementation
    └── ... (autonomous features)
```

---

## Testing Different Versions

### Local Development

```bash
# Test v1 (current)
NEXT_PUBLIC_OFFER_CREATION_VERSION=v1 npm run dev

# Test v2 (when ready)
NEXT_PUBLIC_OFFER_CREATION_VERSION=v2 npm run dev

# Test specific features
NEXT_PUBLIC_OFFER_CREATION_VERSION=v1
NEXT_PUBLIC_OFFER_FORM_SMART_DEFAULTS=true
npm run dev
```

### Staging/Production

Set environment variables in Vercel/deployment platform:

- Production: `NEXT_PUBLIC_OFFER_CREATION_VERSION=v1`
- Staging: `NEXT_PUBLIC_OFFER_CREATION_VERSION=v2`
- Canary: `NEXT_PUBLIC_OFFER_FORM_AI_ASSIST=true`

---

## Migration Path

### Phase 1: Skateboard (Current)

- Deploy v1 to production
- Gather user feedback
- Identify pain points

### Phase 2: Bike (Next 1-2 months)

- Build v2 with smart defaults and validation
- A/B test with 10% of users
- Roll out gradually based on success metrics

### Phase 3: Car (Next 3-6 months)

- Add AI assistance and templates
- Enable for power users first
- Full rollout after validation

### Phase 4: Rocket (Future - 6-12 months)

- Develop autonomous features
- Enterprise beta program
- Machine learning model training

---

## Best Practices

1. **Default to OFF**: New features should be disabled by default
2. **Version over Features**: Use version flag for major changes, individual flags for minor tweaks
3. **Progressive Enhancement**: Build on top of previous versions, don't replace
4. **Backward Compatibility**: Ensure v1 continues to work even when v2+ exists
5. **Metrics**: Track usage and performance of each version
6. **Documentation**: Update this guide as new features are added

---

## Questions?

Contact the team or refer to:

- `/config/featureFlags.ts` - Feature flag definitions
- `/components/features/offer-manager/` - Implementation
