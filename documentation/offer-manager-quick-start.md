# Offer Manager: Quick Start Implementation Guide

## Where to Start & What to Build First

## 🎯 Overview

You have a **5-step wizard** currently. We're expanding it to a **10-step, 2-phase workflow** that separates **Offer Creation** from **Campaign Management**.

---

## 📚 Documentation Package

You now have 5 documents:

1. **BRD** - `offer-manager.md` (already existed)
2. **UI Spec** - `offer-manager-ui-spec.md` (step-by-step specifications)
3. **User Flows** - `offer-manager-user-flows.md` (flow diagrams and scenarios)
4. **Implementation Roadmap** - `offer-manager-implementation-roadmap.md` (technical tasks)
5. **Stepper Component Spec** - `offer-manager-stepper-component-spec.md` (visual design)
6. **Design Summary** - `offer-manager-design-summary.md` (overview)
7. **This Guide** - Quick start instructions

---

## 🚀 Implementation Priority

### Phase 1: Core Foundation (Week 1)

#### Task 1.1: Create New Stepper Component

**Priority**: Critical - This changes the entire navigation

**What to build**:

```
components/features/offer-manager/stepper/
├── OfferManagerStepper.tsx         (main stepper)
├── StepperPhaseIndicator.tsx       (phase labels)
├── StepperPhaseSeparator.tsx       (separator line)
├── config.ts                        (step configuration)
└── types.ts                         (TypeScript types)
```

**Start here**: Copy the code from `offer-manager-stepper-component-spec.md`

**Key changes**:

- 10 steps instead of 5
- Phase separator between steps 5 and 6
- Conditional step visibility (Steps 4 and 6)
- Non-linear navigation (click completed steps)

---

#### Task 1.2: Update OfferManagerView.tsx

**Priority**: Critical - Main orchestrator

**What to change**:

1. Replace existing stepper with new `OfferManagerStepper`
2. Update state to track `currentStep` (1-10)
3. Add `flowType` to form data ('linear' | 'offer_only' | 'campaign_only')
4. Implement `getVisibleSteps()` logic
5. Add special handling after Step 5 (Save & Exit vs Continue)

**Existing code location**: Lines 283-363 in current `OfferManagerView.tsx`

**New code**: See `offer-manager-stepper-component-spec.md` section "Integration with OfferManagerView.tsx"

---

### Phase 2: Refactor Existing Steps (Week 1-2)

#### Task 2.1: Keep Step 1 (Goal Setting) - Minor Updates

**File**: `steps/GoalSettingStep.tsx`  
**Status**: ✅ Already implemented, needs minor enhancements

**What to add**:

- Program type detection (closed_loop vs open_loop)
- Enhanced target audience multi-select
- AI recommendation placeholder

**Changes needed**: ~10% refactor

---

#### Task 2.2: Refactor Step 2 (Offer Details → Offer Type & Value)

**File**: `steps/OfferDetailsStep.tsx` → Rename to `steps/OfferTypeValueStep.tsx`

**Status**: ✅ Exists, needs refactor

**What to change**:

1. Remove brand/compliance fields (those move to Step 5)
2. Add all offer types:
   - Discount Percentage ✅
   - Discount Fixed ✅
   - BOGO ❌ NEW
   - Cashback ❌ NEW
   - Loyalty Points ❌ NEW
   - Spend & Get ❌ NEW
   - Lightning Offers ❌ NEW
3. Add AI recommendation display
4. Add performance prediction UI

**Changes needed**: ~40% refactor

---

#### Task 2.3: Enhance Step 3 (Redemption Method)

**File**: `steps/RedemptionMethodStep.tsx`

**Status**: ✅ Exists, needs enhancements

**What to change**:

1. Add all redemption methods:
   - Promo Code ✅
   - Show and Save ❌ NEW
   - Barcode Scan ❌ NEW
   - Online Link ❌ NEW
2. Remove promo code form fields (those move to Step 4)
3. Add conditional navigation: if "Promo Code" selected, show Step 4
4. Add merchant capability validation UI

**Changes needed**: ~30% refactor

---

### Phase 3: Build New Steps 4-5 (Week 2)

#### Task 3.1: Build Step 4 (Promo Code Setup) - CONDITIONAL

**File**: `steps/PromoCodeStep.tsx` ❌ NEW

**Visibility**: Only shown if Step 3 redemption method is "Promo Code"

**What to build**:

- Code type selection (single vs multiple)
- Promo code upload/entry
- Location scope selection
- Usage limits configuration
- Program-specific sections:
  - John Deere: Corporate network codes vs dealer codes
  - Yardi: Yardi-generated vs merchant partner codes
- AI validation

**Component structure**: See `offer-manager-implementation-roadmap.md` Task 1.4

**Time estimate**: 2-3 days

---

#### Task 3.2: Build Step 5 (Brand & Compliance)

**File**: `steps/BrandComplianceStep.tsx` ❌ NEW

**What to build**:

- Offer title input (with AI assist)
- Offer description textarea (with AI assist)
- Brand assets upload
- Terms & conditions editor
- Exclusions manager
- AI brand compliance checker

**Critical feature**: Two action buttons at bottom:

- "Save & Exit" - Saves offer, returns to dashboard
- "Continue to Campaign →" - Proceeds to Step 7 (skips Step 6)

**Component structure**: See `offer-manager-implementation-roadmap.md` Task 1.5

**Time estimate**: 3-4 days

---

### Phase 4: Build Campaign Steps 6-10 (Week 3-4)

#### Task 4.1: Build Step 6 (Offer Selection) - CONDITIONAL

**File**: `steps/OfferSelectionStep.tsx` ❌ NEW

**Visibility**: Only shown when starting "Campaign-Only" flow (not from Offer Creation)

**What to build**:

- Offer catalog browser
- Filter by type (affiliate, card-linked, discounted product, created)
- Offer preview card
- Selection confirmation

**Auto-skip logic**: If coming from Step 5, skip this step and go directly to Step 7

**Time estimate**: 2 days

---

#### Task 4.2: Build Step 7 (Targeting & Partners)

**File**: `steps/TargetingStep.tsx` ❌ NEW

**What to build**:

- Partner selection (program-aware)
- Geographic scope selector
- Audience targeting methods:
  - Customer list upload (CSV/Excel)
  - Engagement-based segmentation
  - Redemption-based segmentation
  - Combined segmentation
- Program-specific sections:
  - John Deere: Dealer network selector
  - Yardi: Property portfolio + merchant partner selector
- Audience size estimate
- AI targeting recommendations

**Time estimate**: 4-5 days (complex)

---

#### Task 4.3: Build Step 8 (Schedule & Timing)

**File**: `steps/ScheduleStep.tsx` ❌ NEW

**What to build**:

- Date range picker
- Time zone selector (auto-detected)
- Seasonal considerations input
- AI timing optimization recommendations
- Program-specific insights:
  - John Deere: Inventory cycles, seasonal demand
  - Yardi: Property events, tenant payment cycles
- Campaign conflict detection
- Duration summary

**Time estimate**: 3 days

---

#### Task 4.4: Build Step 9 (Delivery Channels)

**File**: `steps/DeliveryChannelsStep.tsx` ❌ NEW

**What to build**:

- 4 campaign type cards (multi-select):
  1. Activation Campaigns
  2. Hub Airdrops
  3. Promoted Marketplace (Yardi only)
  4. Organic Marketplace (Yardi only)
- Program availability enforcement:
  - Closed loop (John Deere): Only cards 1-2 enabled
  - Open loop (Yardi): All 4 cards enabled
- Configuration forms for each selected channel
- AI channel recommendations
- Estimated reach calculator

**Time estimate**: 4 days

---

#### Task 4.5: Build Step 10 (Review & Launch)

**File**: `steps/ReviewLaunchStep.tsx` ❌ NEW

**What to build**:

- Offer summary (with edit links to earlier steps)
- Campaign configuration summary
- Performance projections
- Budget impact summary
- Compliance checklist
- AI final validation
- Action buttons:
  - "Save Draft"
  - "Schedule for Later"
  - "🚀 Launch Now"

**Time estimate**: 3-4 days

---

## 🎬 Development Sequence

### Week 1: Foundation

```
Day 1-2: Build new stepper component system
Day 3: Integrate stepper into OfferManagerView
Day 4-5: Refactor Steps 1-3 (minor changes)
```

### Week 2: Offer Creation Completion

```
Day 1-3: Build Step 4 (Promo Code Setup)
Day 4-5: Build Step 5 (Brand & Compliance)
```

### Week 3: Campaign Steps Part 1

```
Day 1-2: Build Step 6 (Offer Selection)
Day 3-5: Build Step 7 (Targeting & Partners)
```

### Week 4: Campaign Steps Part 2

```
Day 1-3: Build Step 8 (Schedule & Timing)
Day 4-5: Start Step 9 (Delivery Channels)
```

### Week 5: Campaign Steps Completion

```
Day 1-2: Complete Step 9 (Delivery Channels)
Day 3-5: Build Step 10 (Review & Launch)
```

### Week 6: Integration & Testing

```
Day 1-2: AI agent integration for all steps
Day 3-4: Full flow testing
Day 5: Bug fixes and polish
```

---

## 🔧 Technical Setup

### Install Dependencies (if needed)

```bash
# Date picker for Step 8
npm install react-day-picker date-fns

# File upload for Step 4 and 7
npm install react-dropzone

# CSV parsing for Step 7
npm install papaparse @types/papaparse

# Chart library for Step 10 projections
npm install recharts
```

### Feature Flags

Add to your feature flag system:

```typescript
// lib/feature-flags.ts
export const FEATURE_FLAGS = {
  OFFER_CREATION_V2: "offer_creation_v2",
  CAMPAIGN_MANAGEMENT_V2: "campaign_management_v2",
  OFFER_MANAGER_NAVIGATION_V2: "offer_manager_navigation_v2",
  OFFER_MANAGER_AI_V2: "offer_manager_ai_v2",
};
```

Enable progressively:

1. Week 1-2: Enable `OFFER_CREATION_V2`
2. Week 3-4: Enable `CAMPAIGN_MANAGEMENT_V2`
3. Week 5: Enable `OFFER_MANAGER_NAVIGATION_V2`
4. Week 6: Enable `OFFER_MANAGER_AI_V2`

---

## 🧪 Testing Strategy

### Unit Tests (Per Step)

Create test file for each step:

```
steps/__tests__/
├── GoalSettingStep.test.tsx
├── OfferTypeValueStep.test.tsx
├── RedemptionMethodStep.test.tsx
├── PromoCodeStep.test.tsx
├── BrandComplianceStep.test.tsx
├── OfferSelectionStep.test.tsx
├── TargetingStep.test.tsx
├── ScheduleStep.test.tsx
├── DeliveryChannelsStep.test.tsx
└── ReviewLaunchStep.test.tsx
```

### Integration Tests

```
__tests__/
├── offer-creation-flow.test.tsx
├── campaign-management-flow.test.tsx
├── combined-flow.test.tsx
├── conditional-navigation.test.tsx
└── save-resume.test.tsx
```

### Manual Testing Checklist

- [ ] Complete Steps 1-5 (offer only)
- [ ] Click "Save & Exit" after Step 5, verify dashboard
- [ ] Complete Steps 1-5, click "Continue to Campaign"
- [ ] Verify Step 6 is skipped when coming from Step 5
- [ ] Complete Steps 7-10 (campaign)
- [ ] Test Step 4 shows/hides based on redemption method
- [ ] Test Step 6 shows/hides based on flow type
- [ ] Test John Deere program (closed loop) restrictions
- [ ] Test Yardi program (open loop) full features
- [ ] Test save draft and resume
- [ ] Test navigation back to completed steps

---

## 📋 Current Code Checklist

### What You Already Have ✅

- [x] `OfferManagerView.tsx` - Main view (needs updates)
- [x] `OfferManagerDashboard.tsx` - Dashboard view
- [x] `steps/GoalSettingStep.tsx` - Step 1 (needs minor updates)
- [x] `steps/OfferDetailsStep.tsx` - Step 2 (needs refactor)
- [x] `steps/RedemptionMethodStep.tsx` - Step 3 (needs enhancements)
- [x] Basic stepper using Shadcn UI components
- [x] Form state management
- [x] CopilotKit integration

### What You Need to Build ❌

- [ ] New stepper component system
- [ ] `steps/PromoCodeStep.tsx` - Step 4
- [ ] `steps/BrandComplianceStep.tsx` - Step 5
- [ ] `steps/OfferSelectionStep.tsx` - Step 6
- [ ] `steps/TargetingStep.tsx` - Step 7
- [ ] `steps/ScheduleStep.tsx` - Step 8
- [ ] `steps/DeliveryChannelsStep.tsx` - Step 9
- [ ] `steps/ReviewLaunchStep.tsx` - Step 10
- [ ] Conditional step logic
- [ ] Phase transition logic
- [ ] Save & Exit functionality
- [ ] Program-aware restrictions

---

## 🎯 First 3 Tasks (Start Here)

### 1. Read All Documentation

**Time**: 2-3 hours

Read in this order:

1. `offer-manager-design-summary.md` - Get the big picture
2. `offer-manager-ui-spec.md` - Understand step requirements
3. `offer-manager-stepper-component-spec.md` - See the visual design
4. `offer-manager-user-flows.md` - Understand user journeys
5. `offer-manager-implementation-roadmap.md` - Technical details

### 2. Build New Stepper System

**Time**: 1-2 days

**Files to create**:

```
components/features/offer-manager/stepper/
├── OfferManagerStepper.tsx
├── StepperPhaseIndicator.tsx
├── StepperPhaseSeparator.tsx
├── config.ts
└── types.ts
```

**Copy code from**: `offer-manager-stepper-component-spec.md`

**Test**: Verify 10 steps render with phase separator

### 3. Integrate Stepper into OfferManagerView

**Time**: 1 day

**File to update**: `OfferManagerView.tsx`

**Changes**:

1. Import new `OfferManagerStepper`
2. Replace old stepper (lines 283-363)
3. Update state management for 10 steps
4. Implement `getVisibleSteps()` logic
5. Add conditional navigation

**Test**: Verify stepper shows/hides steps correctly

---

## 🤝 Getting Help

### When Stuck

1. Check the relevant documentation file
2. Look at the code examples in `offer-manager-implementation-roadmap.md`
3. Review the user flow diagrams in `offer-manager-user-flows.md`
4. Check the BRD for business logic: `brd/offer-manager.md`

### Key Design Decisions to Remember

1. **Two phases**: Offer (1-5) + Campaign (6-10)
2. **Three flows**: Linear, Offer-only, Campaign-only
3. **Two conditional steps**: Step 4 (promo codes), Step 6 (offer selection)
4. **Critical decision point**: Step 5 (Save & Exit vs Continue to Campaign)
5. **Program-aware**: Closed loop (John Deere) vs Open loop (Yardi)

---

## 🎓 Key Concepts

### Conditional Steps

```typescript
// Step 4 shows ONLY IF redemption method is promo code
if (formData.offer.redemption.redemptionMethod === "promo_code") {
  // Show Step 4
} else {
  // Skip Step 4, go from Step 3 → Step 5
}

// Step 6 shows ONLY IF starting campaign-only flow
if (formData.flowType === "campaign_only") {
  // Show Step 6 (select existing offer)
} else {
  // Skip Step 6 (already have offer from Steps 1-5)
}
```

### Phase Transition

```typescript
// After Step 5, user has two choices:

// Option 1: Save & Exit (Offer-Only Flow)
handleSaveOfferOnly() {
  saveOffer(formData.offer)
  return to dashboard
}

// Option 2: Continue to Campaign (Linear Flow)
handleContinueToCampaign() {
  saveOffer(formData.offer)
  setCurrentStep(7) // Skip Step 6
  continue to campaign phase
}
```

### Program-Aware Logic

```typescript
// Closed Loop (John Deere)
if (programType === "closed_loop") {
  // Only show: Activation Campaigns, Hub Airdrops
  // Hide: Marketplace options
  availableChannels = ["activation", "hub_airdrop"];
}

// Open Loop (Yardi)
if (programType === "open_loop") {
  // Show all channels
  availableChannels = [
    "activation",
    "hub_airdrop",
    "promoted_marketplace",
    "organic_marketplace",
  ];
}
```

---

## ✅ Definition of Done

### Feature Complete When:

- [ ] All 10 steps implemented
- [ ] Conditional steps show/hide correctly
- [ ] Phase separator visible
- [ ] Save & Exit works after Step 5
- [ ] Continue to Campaign works after Step 5
- [ ] Campaign-only flow starts at Step 6
- [ ] Program-aware restrictions enforced
- [ ] All form data persists correctly
- [ ] Save draft and resume works
- [ ] AI agent integrated for all steps
- [ ] All tests passing
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessible (keyboard nav, screen reader)

---

## 📞 Questions to Ask Before Starting

1. **Feature Flags**: Do we have a feature flag system set up?
2. **API Endpoints**: Are the backend endpoints ready for save/load?
3. **Design Assets**: Do we have Figma designs for the new steps?
4. **AI Agent**: Is the AI agent backend configured for offer manager?
5. **Program Data**: How do we determine closed_loop vs open_loop?
6. **Testing**: What's our testing setup (Jest, React Testing Library)?
7. **Pilot Timeline**: Is December 2025 launch still the target?

---

**Ready to start? Begin with Task 1: Read all documentation (2-3 hours)**

Then proceed to Task 2: Build the new stepper system (1-2 days)

Good luck! 🚀
