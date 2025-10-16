# Offer Manager Design Package - Complete Documentation Set

## Created: 2025-10-16

## 📦 What's In This Package

I've created a complete design specification for refining the Offer Manager from the current 5-step wizard to a comprehensive 10-step, 2-phase workflow. Here's what you have:

### 1. **Quick Start Guide** (START HERE 👈)

**File**: `offer-manager-quick-start.md`

The fastest way to get started. Includes:

- What to build first
- Development sequence
- First 3 tasks
- Current vs target state
- Definition of done

**Read this first!** It tells you exactly where to start.

---

### 2. **Design Summary**

**File**: `offer-manager-design-summary.md`

Executive overview with:

- Key design decisions
- Step-by-step mapping (BRD → UI)
- Critical features
- State management
- Success metrics
- Quick reference tables

**Use this for**: High-level understanding and stakeholder presentations

---

### 3. **UI Specification**

**File**: `offer-manager-ui-spec.md`

Detailed specifications for all 10 steps:

- Step 1: Goal & Context
- Step 2: Offer Type & Value
- Step 3: Redemption Method
- Step 4: Promo Code Setup (conditional)
- Step 5: Brand & Compliance
- Step 6: Offer Selection (conditional)
- Step 7: Targeting & Partners
- Step 8: Schedule & Timing
- Step 9: Delivery Channels
- Step 10: Review & Launch

**Use this for**: Understanding what each step does and what fields it needs

---

### 4. **User Flows**

**File**: `offer-manager-user-flows.md`

Visual flow diagrams and scenarios:

- Flow diagrams (ASCII art)
- User journey scenarios
- Decision points & conditional logic
- State transitions
- Navigation controls
- AI agent interaction patterns
- Responsive behavior
- Error & edge cases

**Use this for**: Understanding user journeys and decision trees

---

### 5. **Implementation Roadmap**

**File**: `offer-manager-implementation-roadmap.md`

Technical implementation guide:

- Current vs target state
- Phase 1: Refactor existing steps (Week 1-2)
- Phase 2: Build campaign steps (Week 3-4)
- Phase 3: Navigation refactor (Week 5)
- Phase 4: AI agent integration (Week 6)
- Testing plan
- Deployment plan

**Use this for**: Detailed technical implementation tasks

---

### 6. **Stepper Component Spec**

**File**: `offer-manager-stepper-component-spec.md`

Visual design and component code:

- Visual stepper design (ASCII mockups)
- Component structure
- TypeScript interfaces
- Full component code (copy-paste ready)
- Integration guide
- Animations & transitions
- Responsive behavior
- Testing checklist

**Use this for**: Building the new stepper component

---

### 7. **Business Requirements Document** (Already Existed)

**File**: `brd/offer-manager.md`

Original BRD with:

- User stories
- Workflows (Sections 3.1 and 3.2)
- Functional requirements
- Program-specific details (John Deere vs Yardi)

**Use this for**: Business context and requirements validation

---

## 🎯 Key Design Decisions Explained

### Two-Phase Workflow

**PHASE 1: Offer Creation** (Steps 1-5)

- Users create and configure promotional offers
- Can be completed independently
- Saves as reusable offer in catalog
- Exit point after Step 5: "Save & Exit"

**PHASE 2: Campaign Management** (Steps 6-10)

- Users distribute offers through campaigns
- Can use newly created OR existing offers
- Multiple campaign types supported
- Handles targeting, scheduling, channels

### Three Navigation Modes

1. **Linear Flow**: Create offer + campaign in one session (Steps 1-10)
2. **Offer-Only**: Create offer, save, campaign later (Steps 1-5 only)
3. **Campaign-Only**: Use existing offer, skip offer creation (Steps 6-10)

### Conditional Steps

**Step 4 (Promo Code Setup)**:

- Shows ONLY if Step 3 redemption method is "Promo Code"
- Otherwise skipped (go from Step 3 → Step 5)

**Step 6 (Offer Selection)**:

- Shows ONLY when starting "Campaign-Only" flow
- Skipped when coming from Offer Creation (auto-select new offer)

### Critical Decision Point: Step 5

After completing Step 5 (Brand & Compliance), user has two choices:

1. **"Save & Exit"** → Saves offer to catalog, returns to dashboard
2. **"Continue to Campaign →"** → Proceeds to Step 7 (skips Step 6)

### Program-Aware Features

**Closed Loop (John Deere)**:

- Dealer network targeting
- Corporate vs dealer promo codes
- Only Activation Campaigns + Hub Airdrops
- No marketplace distribution

**Open Loop (Yardi)**:

- Property portfolio targeting
- Yardi-generated + merchant partner codes
- All 4 campaign types available
- Full marketplace integration

---

## 🚀 How to Use This Package

### For Product Managers

1. Read: **Design Summary** (big picture)
2. Review: **User Flows** (scenarios and journeys)
3. Validate: **BRD** (requirements alignment)

### For Designers

1. Read: **Design Summary** (overview)
2. Study: **UI Specification** (step details)
3. Review: **Stepper Component Spec** (visual design)
4. Reference: **User Flows** (interactions)

### For Developers

1. **START HERE**: **Quick Start Guide**
2. Then read: **Design Summary**
3. Build using: **Stepper Component Spec** (has code!)
4. Reference: **Implementation Roadmap** (detailed tasks)
5. Understand: **UI Specification** (what each step does)
6. Validate: **User Flows** (edge cases)
7. Check: **BRD** (business logic)

### For QA/Testing

1. Read: **Design Summary** (overview)
2. Study: **User Flows** (test scenarios)
3. Reference: **Implementation Roadmap** (test plan)
4. Validate: **BRD** (acceptance criteria)

---

## 🔑 Quick Reference

### Current State (As of 2025-10-16)

```
✅ Step 1: Goal Setting (implemented)
✅ Step 2: Offer Details (implemented)
✅ Step 3: Redemption Method (implemented)
🚧 Step 4: Campaign Setup (placeholder)
🚧 Step 5: Review & Launch (placeholder)
```

### Target State (After Implementation)

```
PHASE 1: OFFER CREATION
✅ Step 1: Goal & Context (refactor)
✅ Step 2: Offer Type & Value (refactor)
✅ Step 3: Redemption Method (enhance)
❌ Step 4: Promo Code Setup (NEW, conditional)
❌ Step 5: Brand & Compliance (NEW)

PHASE SEPARATOR

PHASE 2: CAMPAIGN MANAGEMENT
❌ Step 6: Offer Selection (NEW, conditional)
❌ Step 7: Targeting & Partners (NEW)
❌ Step 8: Schedule & Timing (NEW)
❌ Step 9: Delivery Channels (NEW)
❌ Step 10: Review & Launch (NEW)
```

### File Locations

**Current Implementation**:

```
components/features/offer-manager/
├── OfferManagerView.tsx          (needs updates)
├── OfferManagerDashboard.tsx     (existing)
├── OfferApprovalDialog.tsx       (existing)
├── steps/
│   ├── GoalSettingStep.tsx       (refactor)
│   ├── OfferDetailsStep.tsx      (refactor)
│   └── RedemptionMethodStep.tsx  (enhance)
└── types.ts                       (update)
```

**New Files Needed**:

```
components/features/offer-manager/
├── stepper/                       (NEW folder)
│   ├── OfferManagerStepper.tsx
│   ├── StepperPhaseIndicator.tsx
│   ├── StepperPhaseSeparator.tsx
│   ├── config.ts
│   └── types.ts
└── steps/
    ├── PromoCodeStep.tsx          (NEW)
    ├── BrandComplianceStep.tsx    (NEW)
    ├── OfferSelectionStep.tsx     (NEW)
    ├── TargetingStep.tsx          (NEW)
    ├── ScheduleStep.tsx           (NEW)
    ├── DeliveryChannelsStep.tsx   (NEW)
    └── ReviewLaunchStep.tsx       (NEW)
```

---

## 📊 Implementation Timeline

### 8-Week Plan

**Weeks 1-2**: Phase 1 Steps

- Build new stepper system
- Refactor Steps 1-3
- Build Steps 4-5

**Weeks 3-4**: Phase 2 Steps

- Build Steps 6-10

**Week 5**: Navigation

- Dynamic stepper logic
- Phase transitions
- Save points

**Week 6**: AI Integration

- Agent actions
- Recommendations UI
- Validation logic

**Week 7**: Testing

- Unit tests
- Integration tests
- E2E tests

**Week 8**: Pilot Launch

- John Deere pilot
- Yardi pilot
- Feedback collection

---

## ✅ Definition of Done

Feature is complete when:

- [ ] All 10 steps implemented
- [ ] Conditional steps show/hide correctly
- [ ] Phase separator visible between steps 5 and 6
- [ ] "Save & Exit" works after Step 5
- [ ] "Continue to Campaign" works after Step 5
- [ ] Campaign-only flow starts at Step 6
- [ ] Offer-only flow exits after Step 5
- [ ] Program-aware restrictions enforced (John Deere vs Yardi)
- [ ] All form data persists correctly
- [ ] Save draft and resume works
- [ ] AI agent integrated for all steps
- [ ] All tests passing (unit, integration, E2E)
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessible (keyboard nav, screen reader)
- [ ] December 2025 pilot ready

---

## 🎓 Key Concepts to Remember

### Modularity

- Offer creation and campaign management are separate but connected
- Users can save and resume at any point
- Offers are reusable across multiple campaigns

### Program Awareness

- UI adapts to closed loop vs open loop context
- Features enabled/disabled based on program type
- AI guidance tailored to program structure

### Progressive Disclosure

- Conditional steps shown only when relevant
- Complex features broken into manageable steps
- AI provides guidance without overwhelming

### Flexibility

- Multiple entry points (new offer, existing offer, resume draft)
- Non-linear navigation (edit any completed step)
- Save points allow workflow interruption

---

## 📞 Next Steps

### Immediate Actions

1. ✅ Review this package overview
2. ✅ Read **Quick Start Guide** (`offer-manager-quick-start.md`)
3. ✅ Read **Design Summary** (`offer-manager-design-summary.md`)
4. ✅ Share with stakeholders for approval
5. ⏳ Begin implementation (follow Quick Start Guide)

### Questions to Answer Before Starting

1. Feature flag system ready?
2. Backend API endpoints ready?
3. Figma designs available for new steps?
4. AI agent backend configured?
5. Program type detection logic in place?
6. Testing infrastructure set up?
7. December 2025 pilot timeline confirmed?

---

## 📚 Document Index

| File                                      | Purpose                     | Primary Audience      |
| ----------------------------------------- | --------------------------- | --------------------- |
| `offer-manager-quick-start.md`            | Where to start, first tasks | Developers            |
| `offer-manager-design-summary.md`         | Executive overview          | Everyone              |
| `offer-manager-ui-spec.md`                | Step-by-step specifications | Designers, Developers |
| `offer-manager-user-flows.md`             | Flow diagrams, scenarios    | Designers, QA         |
| `offer-manager-implementation-roadmap.md` | Technical tasks             | Developers            |
| `offer-manager-stepper-component-spec.md` | Visual design, code         | Developers            |
| `brd/offer-manager.md`                    | Business requirements       | Product, Everyone     |
| `OFFER_MANAGER_DESIGN_PACKAGE.md`         | This file                   | Everyone              |

---

## 🎯 Success Metrics

### Pilot (December 2025)

- Successful deployment for both programs (John Deere + Yardi)
- > 80% user adoption rate
- > 85% positive feedback
- > 99% uptime

### Long-term (Post-Pilot)

- 3x offers created per merchant per month
- 25% improvement in redemption rates
- 25% improvement in revenue per campaign
- Time savings validated

---

## 📝 Version History

| Version | Date       | Changes                        | Author       |
| ------- | ---------- | ------------------------------ | ------------ |
| 1.0     | 2025-10-16 | Initial design package created | AI Assistant |

---

## 🤝 Feedback & Questions

If you have questions or need clarification:

1. Check the relevant documentation file first
2. Review the code examples in Implementation Roadmap
3. Look at user flow diagrams for scenarios
4. Consult the BRD for business logic

---

**Ready to build!** 🚀

Start with the **Quick Start Guide** and follow the development sequence. You have everything you need to implement this refined Offer Manager.

Good luck!
