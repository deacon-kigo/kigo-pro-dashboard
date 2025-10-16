# Offer Manager Design Summary

## Quick Reference Guide

## 📋 Document Set Overview

This design package consists of 4 documents:

1. **BRD** (`offer-manager.md`) - Business requirements and user stories
2. **UI Spec** (`offer-manager-ui-spec.md`) - Refined menu structure and navigation
3. **User Flows** (`offer-manager-user-flows.md`) - Visual flows and decision trees
4. **Implementation Roadmap** (`offer-manager-implementation-roadmap.md`) - Technical implementation plan

---

## 🎯 Key Design Decisions

### Two-Phase Workflow Structure

**Phase 1: Offer Creation** (Steps 1-5)

- Can be completed independently
- Saves as reusable offer in catalog
- Exit point after Step 5

**Phase 2: Campaign Management** (Steps 6-10)

- Can use newly created OR existing offers
- Handles distribution and scheduling
- Multiple campaign types supported

### Navigation Modes

1. **Linear Flow**: Create offer + campaign in one session (Steps 1-10)
2. **Offer-Only**: Create offer, exit, campaign later (Steps 1-5 only)
3. **Campaign-Only**: Use existing offer (Skip to Steps 6-10)

---

## 📊 Step-by-Step Mapping

### BRD → UI Implementation

| Step | Name                 | BRD Reference           | Status      | Conditional                  |
| ---- | -------------------- | ----------------------- | ----------- | ---------------------------- |
| 1    | Goal & Context       | Section 3.1, Step 1     | ✅ Refactor | No                           |
| 2    | Offer Type & Value   | Section 3.1, Step 2 & 5 | ✅ Refactor | No                           |
| 3    | Redemption Method    | Section 3.1, Step 3     | ✅ Enhance  | No                           |
| 4    | Promo Code Setup     | Section 3.1, Step 4     | ❌ New      | Yes (if promo code selected) |
| 5    | Brand & Compliance   | Section 3.1, Step 5     | ❌ New      | No                           |
| —    | **Phase Separator**  | —                       | ❌ New      | —                            |
| 6    | Offer Selection      | Section 3.2, Step 0     | ❌ New      | Yes (if not from creation)   |
| 7    | Targeting & Partners | Section 3.2, Step 1     | ❌ New      | No                           |
| 8    | Schedule & Timing    | Section 3.2, Step 2     | ❌ New      | No                           |
| 9    | Delivery Channels    | Section 3.2, Step 3     | ❌ New      | No                           |
| 10   | Review & Launch      | Section 3.2, Steps 4-5  | ❌ New      | No                           |

---

## 🔑 Critical Features

### Program-Aware Logic

**Closed Loop (John Deere)**:

- Dealer network targeting
- Corporate vs dealer codes
- Activation campaigns + Hub airdrops only
- No marketplace distribution

**Open Loop (Yardi)**:

- Property portfolio targeting
- Yardi-generated + merchant codes
- All campaign types available
- Marketplace integration

### Conditional Navigation

**Step 4 Visibility**:

```
IF Step 3 redemption_method === 'promo_code'
  THEN show Step 4 (Promo Code Setup)
  ELSE skip to Step 5
```

**Step 6 Visibility**:

```
IF starting from Step 5 (offer creation flow)
  THEN skip Step 6 (auto-select new offer)
  ELSE show Step 6 (select existing offer)
```

### Save Points

- **After Step 5**: Save offer, optional continue to campaign
- **After Step 10**: Save campaign, launch or schedule
- **Any step**: Auto-save draft every 30s

---

## 🤖 AI Agent Integration

### Agent Capabilities by Phase

**Offer Creation (Steps 1-5)**:

- Recommend target audience
- Suggest offer type and value
- Validate redemption methods
- Check brand compliance
- Predict performance

**Campaign Management (Steps 6-10)**:

- Recommend targeting strategies
- Optimize scheduling
- Suggest delivery channels
- Validate final configuration
- Project performance metrics

### Agent UI Patterns

**Proactive Guidance**:

- Step entry: "Here's what I recommend..."
- Field-level: Sparkle icon (✨) for AI assist

**Reactive Assistance**:

- User asks questions
- Validation errors
- Conflict detection

---

## 💾 State Management

### Form Data Structure

```typescript
interface OfferManagerFormData {
  // Navigation
  currentStep: 1-10
  currentPhase: 'offer_creation' | 'campaign_management'
  flowType: 'linear' | 'offer_only' | 'campaign_only'
  completedSteps: number[]

  // Offer (Steps 1-5)
  offer: {
    goal: GoalData
    type: OfferTypeData
    redemption: RedemptionData
    promo?: PromoCodeData // Conditional
    brand: BrandComplianceData
    offerId?: string // Set after save
  }

  // Campaign (Steps 6-10)
  campaign: {
    selectedOfferId?: string // From Step 6 or auto-filled
    targeting: TargetingData
    schedule: ScheduleData
    channels: DeliveryChannelsData
  }

  // Program context
  programType: 'closed_loop' | 'open_loop' | 'general'

  // AI agent state
  agent: OfferManagerState
}
```

---

## 🎨 UI Components Hierarchy

### Main View (`OfferManagerView.tsx`)

```
└── Dashboard (when not creating)
    └── OfferManagerDashboard

└── Creation Flow (when creating)
    ├── Vertical Stepper (left sidebar, 80px)
    │   ├── Phase 1 Steps (1-5)
    │   ├── Phase Separator (═══)
    │   └── Phase 2 Steps (6-10)
    │
    ├── Main Content Area (center, flexible)
    │   ├── Header (step title, description, actions)
    │   ├── Step Component (dynamic)
    │   │   ├── GoalSettingStep
    │   │   ├── OfferTypeValueStep
    │   │   ├── RedemptionMethodStep
    │   │   ├── PromoCodeStep (conditional)
    │   │   ├── BrandComplianceStep
    │   │   ├── OfferSelectionStep (conditional)
    │   │   ├── TargetingStep
    │   │   ├── ScheduleStep
    │   │   ├── DeliveryChannelsStep
    │   │   └── ReviewLaunchStep
    │   └── Footer (previous, save, next buttons)
    │
    └── AI Agent Panel (right sidebar, 320px)
        └── CopilotKit Chat Interface
```

### New Components Needed

**Step Components**:

- `PromoCodeStep.tsx` (Step 4) ❌
- `BrandComplianceStep.tsx` (Step 5) ❌
- `OfferSelectionStep.tsx` (Step 6) ❌
- `TargetingStep.tsx` (Step 7) ❌
- `ScheduleStep.tsx` (Step 8) ❌
- `DeliveryChannelsStep.tsx` (Step 9) ❌
- `ReviewLaunchStep.tsx` (Step 10) ❌

**Supporting Components**:

- `PhaseIndicator.tsx` - Shows current phase
- `OfferCatalogPicker.tsx` - Select existing offer
- `ProgramTypeIndicator.tsx` - Closed/open loop badge
- `AudienceSizeEstimate.tsx` - Target audience size
- `PerformanceProjections.tsx` - Expected metrics
- `BudgetImpactSummary.tsx` - Cost breakdown
- `ComplianceChecklist.tsx` - Validation checklist

---

## 🚀 Implementation Timeline

### 8-Week Plan

**Weeks 1-2**: Phase 1 Steps

- Refactor Steps 1-3
- Build Steps 4-5
- Feature flag: `offer_creation_v2`

**Weeks 3-4**: Phase 2 Steps

- Build Steps 6-10
- Feature flag: `campaign_management_v2`

**Week 5**: Navigation

- Dynamic stepper
- Phase transitions
- Save points
- Feature flag: `offer_manager_navigation_v2`

**Week 6**: AI Integration

- Agent actions for all steps
- Recommendations UI
- Validation logic
- Feature flag: `offer_manager_ai_v2`

**Week 7**: Testing

- Unit tests
- Integration tests
- E2E tests
- Bug fixes

**Week 8**: Pilot Launch

- John Deere pilot
- Yardi pilot
- Kigo team rollout
- Feedback collection

---

## ✅ Acceptance Criteria

### Offer Creation Flow

- [ ] User can complete Steps 1-5
- [ ] Step 4 conditionally shown based on redemption method
- [ ] User can save offer and exit after Step 5
- [ ] User can continue to campaign after Step 5
- [ ] Saved offers appear in catalog
- [ ] AI provides recommendations at each step
- [ ] Brand compliance validation works

### Campaign Management Flow

- [ ] User can select existing offer to create campaign
- [ ] User can skip Step 6 when coming from offer creation
- [ ] Targeting supports both list upload and segmentation
- [ ] Schedule includes AI timing optimization
- [ ] Delivery channels respect program type (closed/open loop)
- [ ] Review step shows complete summary
- [ ] Launch creates active campaign
- [ ] Schedule creates scheduled campaign

### Navigation & UX

- [ ] Stepper shows/hides steps dynamically
- [ ] Phase separator visible between Steps 5 and 6
- [ ] User can navigate back to edit completed steps
- [ ] Auto-save preserves draft state
- [ ] Resume draft returns to correct step
- [ ] Program type badge visible
- [ ] AI agent panel integrated

### Program-Specific

- [ ] John Deere (closed loop) restrictions enforced
- [ ] Yardi (open loop) full features available
- [ ] Dealer network vs property portfolio targeting
- [ ] Corporate vs merchant partner code management
- [ ] Channel availability based on program type

---

## 📱 Responsive Breakpoints

| Breakpoint          | Layout                                               |
| ------------------- | ---------------------------------------------------- |
| Desktop (1440px+)   | Stepper (80px) + Content (flex) + Agent (320px)      |
| Tablet (768-1439px) | Stepper (60px) + Content (flex), Agent overlay       |
| Mobile (<768px)     | Horizontal dots + Content (full), Agent bottom sheet |

---

## 🔐 Role-Based Access

| User Role            | Access Level | Features                           |
| -------------------- | ------------ | ---------------------------------- |
| Kigo Team            | Full         | All programs, all features         |
| John Deere Corporate | Closed Loop  | Dealer network, corporate codes    |
| John Deere Dealer    | Closed Loop  | Local only, dealer codes           |
| Yardi Team           | Open Loop    | Properties, merchants, marketplace |

---

## 📈 Success Metrics

### Pilot (December 2025)

- Successful deployment for both programs ✓
- > 80% user adoption rate
- > 85% positive feedback
- > 99% uptime

### Long-term (Post-Pilot)

- 3x offers created per merchant per month
- 25% improvement in redemption rates
- 25% improvement in revenue per campaign
- Time savings validated

---

## 🔗 Related Documents

### External References

- [BRD: Offer Manager](./brd/offer-manager.md) - Full business requirements
- [Perplexity Architecture](./offer-manager-perplexity-architecture.md) - Technical architecture

### Internal Design Docs

- [UI Spec](./offer-manager-ui-spec.md) - Detailed step specifications
- [User Flows](./offer-manager-user-flows.md) - Flow diagrams and scenarios
- [Implementation Roadmap](./offer-manager-implementation-roadmap.md) - Technical tasks

### Code References

- `components/features/offer-manager/OfferManagerView.tsx` - Main view
- `components/features/offer-manager/steps/` - Step components
- `components/features/offer-manager/types.ts` - TypeScript interfaces

---

## 🤝 Stakeholders

### Product

- **Ben Straley** (ben@kigo.io) - Product Manager, Document Owner

### Pilot Partners

- **John Deere** - Closed loop program, dealer network
- **Yardi** - Open loop program, property management

### Development Team

- Design: UX/UI design for offer manager
- Frontend: React/Next.js implementation
- AI: CopilotKit agent integration
- Backend: API and data management

---

## 📝 Next Steps

1. **Review** - Stakeholder review of all design documents
2. **Approve** - Sign-off on design approach
3. **Design** - UI/UX mockups for all steps
4. **Develop** - Follow implementation roadmap
5. **Test** - Comprehensive testing per test plan
6. **Deploy** - Phased rollout with feature flags
7. **Pilot** - Launch with John Deere and Yardi
8. **Iterate** - Collect feedback, refine, expand

---

## 🎓 Key Learnings & Design Principles

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

_Last Updated: 2025-10-16_
_Version: 1.0_
_Status: Ready for Development_
