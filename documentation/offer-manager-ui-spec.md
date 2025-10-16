# Offer Manager UI Specification

## Refined Menu & Navigation Structure

### Overview

The Offer Manager has **two distinct but connected workflows**:

1. **Offer Creation** (Steps 1-5): Create and configure promotional offers
2. **Campaign Management** (Steps 6-10): Distribute offers through campaigns

### Navigation Modes

#### Mode 1: Linear Flow (Default)

Users progress through all 10 steps sequentially to create both offer and campaign.

#### Mode 2: Offer-Only Flow

Users create and save an offer without creating a campaign (exit after Step 5).

#### Mode 3: Campaign-Only Flow

Users create a campaign using an existing offer (skip Steps 1-5, start at Step 6).

---

## Step Structure

### PHASE 1: OFFER CREATION

#### Step 1: Goal & Context

**BRD Reference**: Section 3.1, Step 1 - Business Goal Setting and Context

**Fields**:

- Business Objective (text input)
- Program Type (auto-detected: closed loop/open loop)
- Target Audience (multi-select)
- Budget Constraints (max discount, total budget)
- Timeline (start/end dates)

**AI Agent Guidance**:

- "What's your main goal for this offer?"
- Program-specific callouts (John Deere vs Yardi)

---

#### Step 2: Offer Type & Value

**BRD Reference**: Section 3.1, Step 2 - Offer Type and Value Recommendation

**Fields**:

- Offer Type (Discount %, Fixed $, BOGO, Cashback, Loyalty Points, Spend & Get, Lightning)
- Offer Value (dynamic based on type)
- AI Recommendations (suggested values, rationale, expected performance)

**AI Agent Features**:

- Analyze historical performance
- Recommend optimal offer type and value
- Show expected metrics (redemption rate, revenue impact)

---

#### Step 3: Redemption Method

**BRD Reference**: Section 3.1, Step 3 - Redemption Method Selection

**Fields**:

- Redemption Method (Promo Code, Show & Save, Barcode Scan, Online Link)
- Merchant Capabilities Validation

**AI Agent Features**:

- Validate merchant location compatibility
- Explain operational requirements
- Program-specific guidance

---

#### Step 4: Promo Code Setup (Conditional)

**BRD Reference**: Section 3.1, Step 4 - Promo Code Management

**Visibility**: Only shown if "Promo Code" selected in Step 3

**Fields**:

- Code Type (single universal vs multiple unique)
- Promo Codes (upload or enter)
- Location Scope (which locations accept codes)
- Usage Limits (per-customer, total)

**Program-Specific Requirements**:

- **John Deere (Closed Loop)**:
  - Corporate Network Codes (work at all participating dealers)
  - Individual Dealer Codes (location-specific)
- **Yardi (Open Loop)**:
  - Yardi-Generated Codes
  - Approved Merchant Codes

---

#### Step 5: Brand & Compliance

**BRD Reference**: Section 3.1, Step 5 - Offer Customization and Brand Compliance

**Fields**:

- Offer Title (customer-facing headline)
- Offer Description (detailed messaging)
- Brand Assets (logo, colors, imagery)
- Terms and Conditions
- Exclusions

**AI Agent Features**:

- Automatic brand compliance checking
- Program-specific brand guidelines
- Suggestions for improvements

**Action Options**:

- **Save & Exit**: Save offer without creating campaign
- **Continue to Campaign**: Proceed to Step 6

---

### PHASE 2: CAMPAIGN MANAGEMENT

#### Step 6: Offer Selection

**BRD Reference**: Section 3.2, Step 0 - Offer Selection and Confirmation

**Visibility**: Only shown when starting Campaign-Only flow

**Fields**:

- Offer Source Selection:
  - Use newly created offer (if coming from Steps 1-5)
  - Select from existing catalog
- Offer Type Filter (Affiliate, Card-Linked, Discounted Product, Previously Created)

**AI Agent Features**:

- Auto-select if coming from Offer Creation
- Validate offer compatibility with campaign

---

#### Step 7: Targeting & Partners

**BRD Reference**: Section 3.2, Step 1 - Campaign Targeting

**Fields**:

- Partner Selection (which programs)
- Geographic Scope (regional, national, location-specific)
- Audience Targeting Method:
  - Customer List Upload (CSV/Excel with account IDs and emails)
  - Basic Segmentation (engagement-based, redemption-based, combined)

**Program-Specific Fields**:

- **John Deere**: Dealer network participation, customer account lists
- **Yardi**: Property portfolio, tenant lists, merchant partner coordination

---

#### Step 8: Schedule & Timing

**BRD Reference**: Section 3.2, Step 2 - Campaign Schedule and Timing

**Fields**:

- Start Date
- End Date
- Time Zone (auto-detected)
- Seasonal Considerations

**AI Agent Features**:

- Analyze historical performance
- Identify optimal duration
- Program-specific timing (John Deere: inventory cycles; Yardi: tenant events)

---

#### Step 9: Delivery Channels

**BRD Reference**: Section 3.2, Step 3 - Delivery Channel Configuration

**Campaign Types** (multi-select):

1. **Activation Campaigns**: Partner-branded URLs for trackable acquisition
2. **Hub Airdrops**: Direct delivery to Kigo Hub digital wallets
3. **Promoted Marketplace**: Paid promotion on Kigo Marketplace
4. **Organic Marketplace**: Natural discovery without paid promotion

**Program-Specific Availability**:

- **John Deere (Closed Loop)**: Only Activation Campaigns and Hub Airdrops
- **Yardi (Open Loop)**: All four campaign types

---

#### Step 10: Review & Launch

**BRD Reference**: Section 3.2, Steps 4-5 - Campaign Review and Deployment

**Review Sections**:

- Offer Summary
- Campaign Configuration
- Performance Projections (reach, engagement, redemption rates)
- Budget Impact (discount liability, operational costs)
- Compliance Validation

**Actions**:

- Edit (go back to any step)
- Save as Draft
- Schedule Campaign (set future deployment)
- Launch Now

---

## Navigation Components

### Vertical Stepper (Left Sidebar)

```
┌─────────────┐
│  ● Goal     │ Step 1
│  │          │
│  ● Type     │ Step 2  } OFFER
│  │          │           CREATION
│  ● Redeem   │ Step 3
│  │          │
│ (●) Promo   │ Step 4 (conditional)
│  │          │
│  ● Brand    │ Step 5
│ ═══════════ │ ← Phase separator
│  ○ Select   │ Step 6 (conditional)
│  │          │
│  ○ Target   │ Step 7  } CAMPAIGN
│  │          │           MANAGEMENT
│  ○ Schedule │ Step 8
│  │          │
│  ○ Channels │ Step 9
│  │          │
│  ○ Launch   │ Step 10
└─────────────┘
```

**Legend**:

- ● Completed step (filled circle)
- ○ Upcoming step (empty circle)
- (●) Conditional step
- ═══ Phase separator

### Header Actions (Context-Sensitive)

**During Offer Creation (Steps 1-5)**:

- "Save & Exit" (primary)
- "Next Step" (secondary)

**After Step 5**:

- "Create Campaign" (primary)
- "Save Offer Only" (secondary)

**During Campaign Management (Steps 6-10)**:

- "Previous" (tertiary)
- "Save Draft" (secondary)
- "Next Step" / "Launch" (primary)

---

## AI Agent Integration Points

### Agent Panel Location

Fixed panel on right side (or as sidebar chat) with context-aware responses

### Agent Capabilities by Step

| Step | Agent Features                                                |
| ---- | ------------------------------------------------------------- |
| 1    | Ask about goals, suggest audience, recommend budget           |
| 2    | Recommend offer type/value, show performance predictions      |
| 3    | Validate redemption methods, explain operational requirements |
| 4    | Guide promo code setup, validate formats                      |
| 5    | Check brand compliance, suggest improvements                  |
| 6    | Confirm offer selection, validate compatibility               |
| 7    | Recommend targeting, analyze audience fit                     |
| 8    | Optimize timing, identify conflicts                           |
| 9    | Suggest channels, explain program restrictions                |
| 10   | Provide final validation, show projections                    |

---

## State Management

### Form State Structure

```typescript
interface OfferManagerState {
  // Current navigation
  currentStep: 1-10;
  currentPhase: 'offer_creation' | 'campaign_management';
  completedSteps: number[];

  // Offer data (Steps 1-5)
  offer: {
    goalContext: {...};
    offerConfig: {...};
    redemption: {...};
    promoCodes?: {...};
    branding: {...};
    offerId?: string; // Set after saving
  };

  // Campaign data (Steps 6-10)
  campaign: {
    selectedOfferId?: string;
    targeting: {...};
    schedule: {...};
    channels: {...};
  };

  // AI agent state
  agent: {
    workflow_step: string;
    current_phase: string;
    progress_percentage: number;
    recommendations: any[];
  };
}
```

### Save Points

- After Step 5: Save as "Offer" (can create campaign later)
- After Step 10: Save as "Campaign" (linked to Offer)
- Any step: "Save Draft" (resume later)

---

## Implementation Notes

### Current State

- Steps 1-3 implemented ✅
- Steps 4-5 need implementation 🚧
- Steps 6-10 placeholders only 🚧

### Priority Changes

1. Add Phase separator in stepper (visual distinction)
2. Implement conditional Step 4 (Promo Code Setup)
3. Refine Step 5 (Brand & Compliance) with AI validation
4. Add "Save & Exit" action after Step 5
5. Implement Campaign steps (6-10) with program-aware logic
6. Integrate AI agent guidance for all steps

### Program-Aware Features

- Detect program type (closed vs open loop) from user context
- Show/hide features based on program:
  - Marketplace options (Yardi only)
  - Dealer network options (John Deere only)
- Validate configurations per program rules
- AI agent provides program-specific guidance
