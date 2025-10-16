# Offer Manager Implementation Roadmap

## From Current State to BRD-Aligned Design

## Current vs. Target State

### Current Implementation (5 Steps)

```
1. Goal Setting         ✅ Implemented
2. Offer Details        ✅ Implemented
3. Redemption Method    ✅ Implemented
4. Campaign Setup       🚧 Placeholder
5. Review & Launch      🚧 Placeholder
```

### Target Implementation (10 Steps, 2 Phases)

**Phase 1: Offer Creation**

```
1. Goal & Context           ✅ Refactor existing "Goal Setting"
2. Offer Type & Value       ✅ Refactor existing "Offer Details"
3. Redemption Method        ✅ Enhance existing
4. Promo Code Setup         ❌ New (conditional)
5. Brand & Compliance       ❌ New
```

**Phase 2: Campaign Management**

```
6. Offer Selection          ❌ New (conditional, skip if from Step 5)
7. Targeting & Partners     ❌ New (expand current "Campaign Setup")
8. Schedule & Timing        ❌ New (expand current "Campaign Setup")
9. Delivery Channels        ❌ New (expand current "Campaign Setup")
10. Review & Launch         ❌ New (expand current "Review & Launch")
```

---

## Phase 1: Refactor Existing Steps (Week 1-2)

### Task 1.1: Refactor Step 1 (Goal & Context)

**Current**: `GoalSettingStep.tsx`

**Changes Needed**:

- [x] Add program type detection (closed/open loop)
- [ ] Enhance target audience selection
- [ ] Add AI recommendation hooks
- [ ] Improve budget constraints UI
- [ ] Add timeline validation

**File Updates**:

```
components/features/offer-manager/steps/GoalSettingStep.tsx
```

**New Fields**:

```typescript
// Add to form data
programType: 'closed_loop' | 'open_loop' | 'general'
targetAudience: string[] // multi-select
maxDiscountUnit: '%' | '$'
```

---

### Task 1.2: Refactor Step 2 (Offer Type & Value)

**Current**: `OfferDetailsStep.tsx`

**Changes Needed**:

- [ ] Split into two concerns: (1) Type/Value, (2) Branding
- [ ] Add all offer types from BRD:
  - Discount Percentage ✅
  - Discount Fixed ✅
  - BOGO
  - Cashback
  - Loyalty Points
  - Spend & Get
  - Lightning Offers
- [ ] Add AI recommendation display
- [ ] Add performance prediction UI
- [ ] Remove brand/compliance fields (move to Step 5)

**File Updates**:

```
components/features/offer-manager/steps/OfferTypeValueStep.tsx (rename)
```

**New Components**:

```typescript
// Add offer type selector with icons
<OfferTypeSelector
  types={['discount_percent', 'discount_fixed', 'bogo', 'cashback', 'loyalty_points', 'spend_get', 'lightning']}
  onSelect={handleTypeSelect}
  aiRecommendation={agentState.recommended_type}
/>

// Add AI-powered value recommendation
<ValueRecommendation
  offerType={formData.offerType}
  businessObjective={formData.businessObjective}
  historicalData={agentState.historical_performance}
/>
```

---

### Task 1.3: Enhance Step 3 (Redemption Method)

**Current**: `RedemptionMethodStep.tsx`

**Changes Needed**:

- [ ] Add merchant capability validation
- [ ] Add all redemption methods:
  - Promo Code ✅
  - Show and Save
  - Barcode Scan
  - Online Link
- [ ] Add operational requirement explanations
- [ ] Add program-specific guidance (John Deere vs Yardi)
- [ ] Add conditional navigation to Step 4 if "Promo Code" selected
- [ ] Move promo code fields to separate Step 4

**File Updates**:

```
components/features/offer-manager/steps/RedemptionMethodStep.tsx
```

**New Logic**:

```typescript
const handleMethodSelect = (method: RedemptionMethod) => {
  setFormData({ redemptionMethod: method });

  // Update stepper to show/hide Step 4
  if (method === "promo_code") {
    setStepVisibility(4, true); // Show Promo Code step
  } else {
    setStepVisibility(4, false); // Skip Promo Code step
  }
};
```

---

### Task 1.4: Create Step 4 (Promo Code Setup) - NEW

**File**: `components/features/offer-manager/steps/PromoCodeStep.tsx`

**Visibility**: Only shown if Step 3 redemption method is "Promo Code"

**Fields**:

```typescript
interface PromoCodeStepData {
  codeType: 'single' | 'multiple'
  promoCodes: string[] // Upload or enter
  locationScope: 'all' | 'selected' | 'individual'
  selectedLocations?: string[]
  usageLimitPerCustomer: number
  totalUsageLimit: number

  // Program-specific
  programType: 'closed_loop' | 'open_loop'

  // John Deere specific
  isC corporateNetworkCode?: boolean
  participatingDealers?: string[]

  // Yardi specific
  isYardiGenerated?: boolean
  merchantPartnerCodes?: { merchantId: string, codes: string[] }[]
}
```

**UI Components**:

```tsx
<Card>
  <CardHeader>
    <h3>Promo Code Setup</h3>
    <p>
      Configure codes for{" "}
      {programType === "closed_loop" ? "dealer network" : "merchant partners"}
    </p>
  </CardHeader>

  <CardContent>
    {/* Code Type Selection */}
    <RadioGroup value={codeType} onValueChange={setCodeType}>
      <Radio value="single">Single universal code</Radio>
      <Radio value="multiple">Multiple unique codes</Radio>
    </RadioGroup>

    {/* Program-Specific Sections */}
    {programType === "closed_loop" && (
      <JohnDeereCodeSection
        onNetworkCodeToggle={handleNetworkCodeToggle}
        onDealerSelect={handleDealerSelect}
      />
    )}

    {programType === "open_loop" && (
      <YardiCodeSection
        onYardiCodeToggle={handleYardiCodeToggle}
        onMerchantCodeAdd={handleMerchantCodeAdd}
      />
    )}

    {/* Code Upload/Entry */}
    <PromoCodeInput
      type={codeType}
      onCodesAdd={handleCodesAdd}
      format="CSV or line-separated"
    />

    {/* Usage Limits */}
    <UsageLimitsSection
      perCustomer={usageLimitPerCustomer}
      total={totalUsageLimit}
      onUpdate={handleLimitsUpdate}
    />

    {/* AI Validation */}
    {agentState.validation_results && (
      <ValidationAlert results={agentState.validation_results} />
    )}
  </CardContent>

  <CardFooter>
    <Button variant="outline" onClick={handlePrevious}>
      ← Previous
    </Button>
    <Button onClick={handleNext}>Next: Brand & Compliance →</Button>
  </CardFooter>
</Card>
```

---

### Task 1.5: Create Step 5 (Brand & Compliance) - NEW

**File**: `components/features/offer-manager/steps/BrandComplianceStep.tsx`

**Purpose**: Final offer customization and brand validation

**Fields**:

```typescript
interface BrandComplianceData {
  offerTitle: string; // Customer-facing headline
  offerDescription: string; // Detailed messaging
  brandAssets: {
    logo?: File | string;
    colors?: { primary: string; secondary: string };
    images?: File[];
  };
  termsConditions: string;
  exclusions: string[];

  // Program-specific brand guidelines
  programType: "closed_loop" | "open_loop";
  brandCompliance: {
    validated: boolean;
    issues: string[];
    suggestions: string[];
  };
}
```

**UI Components**:

```tsx
<Card>
  <CardHeader>
    <h3>Brand & Compliance</h3>
    <p>Customize your offer messaging and ensure brand compliance</p>
  </CardHeader>

  <CardContent>
    {/* Offer Title & Description */}
    <FormField label="Offer Title" required>
      <Input
        value={offerTitle}
        onChange={handleTitleChange}
        placeholder="e.g., 20% Off All Parts This Weekend"
        maxLength={100}
      />
      <AIAssistButton onClick={() => askAI("offer_title")} />
    </FormField>

    <FormField label="Offer Description">
      <Textarea
        value={offerDescription}
        onChange={handleDescriptionChange}
        placeholder="Detailed description of the offer..."
        rows={5}
      />
      <AIAssistButton onClick={() => askAI("offer_description")} />
    </FormField>

    {/* Brand Assets */}
    <BrandAssetsUpload
      programType={programType}
      onAssetsChange={handleAssetsChange}
      guidelines={brandGuidelines}
    />

    {/* Terms & Conditions */}
    <TermsConditionsEditor
      value={termsConditions}
      onChange={handleTermsChange}
      template={defaultTermsTemplate}
    />

    {/* Exclusions */}
    <ExclusionsManager
      exclusions={exclusions}
      onAdd={handleExclusionAdd}
      onRemove={handleExclusionRemove}
    />

    {/* AI Brand Compliance Check */}
    <BrandComplianceValidation
      programType={programType}
      offerData={formData}
      validationResults={agentState.brand_compliance}
    />
  </CardContent>

  <CardFooter className="flex justify-between">
    <Button variant="outline" onClick={handlePrevious}>
      ← Previous
    </Button>

    <div className="flex gap-2">
      <Button variant="secondary" onClick={handleSaveOnly}>
        Save & Exit
      </Button>
      <Button onClick={handleContinueToCampaign}>Continue to Campaign →</Button>
    </div>
  </CardFooter>
</Card>
```

**Critical Logic**:

```typescript
// After Step 5, user has two paths:
const handleSaveOnly = async () => {
  // Save offer to catalog
  const savedOffer = await saveOffer(formData);

  // Return to dashboard
  setIsCreatingOffer(false);
  showSuccessToast("Offer saved! You can create a campaign anytime.");
};

const handleContinueToCampaign = () => {
  // Save offer first
  const savedOffer = await saveOffer(formData);

  // Continue to campaign flow
  setCurrentStep(7); // Skip Step 6 (offer selection)
  setSelectedOfferId(savedOffer.id);
};
```

---

## Phase 2: Implement Campaign Steps (Week 3-4)

### Task 2.1: Create Step 6 (Offer Selection) - CONDITIONAL

**File**: `components/features/offer-manager/steps/OfferSelectionStep.tsx`

**Visibility**: Only shown when starting Campaign-Only flow (not from Offer Creation)

**Logic**:

```typescript
// In OfferManagerView.tsx
const handleCampaignOnlyFlow = () => {
  setCurrentStep(6); // Start at offer selection
  setShowOfferPicker(true);
};

// Auto-skip if coming from Step 5
const handleContinueToCampaign = (offerId: string) => {
  setCurrentStep(7); // Skip Step 6
  setSelectedOfferId(offerId);
  setShowOfferPicker(false);
};
```

**UI**:

```tsx
<Card>
  <CardHeader>
    <h3>Select Offer</h3>
    <p>Choose an offer for your campaign</p>
  </CardHeader>

  <CardContent>
    {/* Offer Catalog Browser */}
    <OfferCatalogPicker
      filters={{
        type: ["affiliate", "card_linked", "discounted_product", "created"],
        program: programType,
        status: "active",
      }}
      onSelect={handleOfferSelect}
    />

    {/* Selected Offer Preview */}
    {selectedOffer && <OfferPreviewCard offer={selectedOffer} />}
  </CardContent>

  <CardFooter>
    <Button onClick={handleCancelCampaign}>Cancel</Button>
    <Button onClick={() => setCurrentStep(7)} disabled={!selectedOffer}>
      Next: Targeting →
    </Button>
  </CardFooter>
</Card>
```

---

### Task 2.2: Create Step 7 (Targeting & Partners)

**File**: `components/features/offer-manager/steps/TargetingStep.tsx`

**BRD Reference**: Section 3.2, Step 1

**Fields**:

```typescript
interface TargetingData {
  // Partner Selection
  partnerPrograms: string[];
  geographicScope: "national" | "regional" | "local";
  regions?: string[];
  locations?: string[];

  // Audience Targeting
  targetingMethod: "customer_list" | "engagement" | "redemption" | "combined";

  // Customer List Upload
  customerList?: {
    file: File;
    accountIds: string[];
    emails: string[];
  };

  // Segmentation
  segments?: {
    engagement: EngagementSegment[];
    redemption: RedemptionSegment[];
  };

  // Program-specific
  programType: "closed_loop" | "open_loop";

  // John Deere specific
  dealerNetwork?: {
    dealerIds: string[];
    locationIds: string[];
  };

  // Yardi specific
  properties?: {
    propertyIds: string[];
    locationIds: string[];
  };
  merchantPartners?: string[];
}
```

**UI Components**:

```tsx
<Card>
  <CardHeader>
    <h3>Campaign Targeting</h3>
    <p>Define who will receive this offer</p>
  </CardHeader>

  <CardContent className="space-y-6">
    {/* Program-Specific Partner Selection */}
    {programType === "closed_loop" && (
      <JohnDeereDealerSelector
        onDealersSelect={handleDealerSelect}
        onLocationsSelect={handleLocationSelect}
      />
    )}

    {programType === "open_loop" && (
      <YardiPropertySelector
        onPropertiesSelect={handlePropertySelect}
        onMerchantsSelect={handleMerchantSelect}
      />
    )}

    {/* Geographic Scope */}
    <GeographicScopeSelector
      scope={geographicScope}
      onScopeChange={handleScopeChange}
      regions={availableRegions}
    />

    {/* Audience Targeting Method */}
    <TargetingMethodTabs value={targetingMethod} onChange={handleMethodChange}>
      <Tab value="customer_list">
        <CustomerListUpload
          onFileUpload={handleFileUpload}
          format="CSV with account IDs and emails"
        />
      </Tab>

      <Tab value="engagement">
        <EngagementSegmentation
          onSegmentSelect={handleEngagementSegment}
          metrics={["app_usage", "loyalty_activity", "transaction_frequency"]}
        />
      </Tab>

      <Tab value="redemption">
        <RedemptionSegmentation
          onSegmentSelect={handleRedemptionSegment}
          data={["past_redemptions", "category_preferences"]}
        />
      </Tab>

      <Tab value="combined">
        <CombinedSegmentation
          engagementSegments={engagementSegments}
          redemptionSegments={redemptionSegments}
          onCombine={handleCombinedSegment}
        />
      </Tab>
    </TargetingMethodTabs>

    {/* AI Recommendations */}
    <AITargetingRecommendations
      businessObjective={businessObjective}
      offerType={offerType}
      historicalData={agentState.targeting_insights}
    />

    {/* Audience Size Estimate */}
    <AudienceSizeEstimate targeting={formData} programType={programType} />
  </CardContent>

  <CardFooter>
    <Button variant="outline" onClick={handlePrevious}>
      ← Previous
    </Button>
    <Button onClick={handleNext}>Next: Schedule →</Button>
  </CardFooter>
</Card>
```

---

### Task 2.3: Create Step 8 (Schedule & Timing)

**File**: `components/features/offer-manager/steps/ScheduleStep.tsx`

**BRD Reference**: Section 3.2, Step 2

**Fields**:

```typescript
interface ScheduleData {
  startDate: Date;
  endDate: Date;
  timeZone: string;
  seasonalConsiderations?: string[];

  // AI insights
  optimalTiming?: {
    recommended_start: Date;
    recommended_duration: number;
    reasoning: string;
  };

  // Program-specific
  programType: "closed_loop" | "open_loop";

  // John Deere specific
  inventoryCycle?: string;
  seasonalDemand?: string;

  // Yardi specific
  propertyEvents?: Event[];
  tenantPaymentCycle?: string;
}
```

**UI**:

```tsx
<Card>
  <CardHeader>
    <h3>Campaign Schedule</h3>
    <p>Set the timing for your campaign</p>
  </CardHeader>

  <CardContent className="space-y-6">
    {/* Date Range Picker */}
    <DateRangePicker
      startDate={startDate}
      endDate={endDate}
      onRangeChange={handleRangeChange}
      minDate={new Date()}
    />

    {/* Time Zone */}
    <TimeZoneSelector
      value={timeZone}
      onChange={handleTimeZoneChange}
      autoDetected={detectedTimeZone}
    />

    {/* AI Timing Optimization */}
    <AITimingRecommendations
      businessObjective={businessObjective}
      offerType={offerType}
      targetAudience={targetAudience}
      programType={programType}
      onAcceptRecommendation={handleAcceptTiming}
    />

    {/* Program-Specific Considerations */}
    {programType === "closed_loop" && (
      <JohnDeereSeasonalInsights
        inventoryCycles={inventoryCycles}
        seasonalDemand={seasonalDemand}
        onConsiderationAdd={handleConsiderationAdd}
      />
    )}

    {programType === "open_loop" && (
      <YardiPropertyEvents
        properties={selectedProperties}
        events={propertyEvents}
        paymentCycles={tenantPaymentCycles}
        onEventSelect={handleEventSelect}
      />
    )}

    {/* Conflict Detection */}
    <CampaignConflictAlert
      campaigns={activeCampaigns}
      proposedDates={{ startDate, endDate }}
      onResolve={handleConflictResolve}
    />

    {/* Duration Summary */}
    <DurationSummary
      start={startDate}
      end={endDate}
      totalDays={calculateDays(startDate, endDate)}
      expectedReach={estimatedReach}
    />
  </CardContent>

  <CardFooter>
    <Button variant="outline" onClick={handlePrevious}>
      ← Previous
    </Button>
    <Button onClick={handleNext}>Next: Delivery →</Button>
  </CardFooter>
</Card>
```

---

### Task 2.4: Create Step 9 (Delivery Channels)

**File**: `components/features/offer-manager/steps/DeliveryChannelsStep.tsx`

**BRD Reference**: Section 3.2, Step 3

**Fields**:

```typescript
interface DeliveryChannelsData {
  selectedChannels: CampaignType[];

  // Campaign types
  activationCampaign?: {
    enabled: boolean;
    campaignUrl: string;
    landingPageContent: string;
    trackingParams: Record<string, string>;
    distributionMethods: ("qr_code" | "print" | "email" | "social")[];
  };

  hubAirdrop?: {
    enabled: boolean;
    deliveryTiming: Date;
    personalization: boolean;
    notificationMessage: string;
  };

  promotedMarketplace?: {
    enabled: boolean;
    budget: number;
    biddingStrategy: "automatic" | "manual";
    targetingCriteria: Record<string, any>;
  };

  organicMarketplace?: {
    enabled: boolean;
    categoryPlacement: string[];
    searchKeywords: string[];
    visibilityPreferences: string;
  };

  // Program-specific availability
  programType: "closed_loop" | "open_loop";
}

type CampaignType =
  | "activation"
  | "hub_airdrop"
  | "promoted_marketplace"
  | "organic_marketplace";

// Program availability rules
const CHANNEL_AVAILABILITY: Record<string, CampaignType[]> = {
  closed_loop: ["activation", "hub_airdrop"], // John Deere
  open_loop: [
    "activation",
    "hub_airdrop",
    "promoted_marketplace",
    "organic_marketplace",
  ], // Yardi
};
```

**UI**:

```tsx
<Card>
  <CardHeader>
    <h3>Delivery Channels</h3>
    <p>Choose how customers will discover this offer</p>
  </CardHeader>

  <CardContent className="space-y-6">
    {/* Program Availability Notice */}
    <Alert variant="info">
      {programType === "closed_loop" ? (
        <>Closed loop programs use dealer network distribution only</>
      ) : (
        <>Open loop programs can leverage all distribution channels</>
      )}
    </Alert>

    {/* Channel Selection Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Activation Campaigns */}
      <ChannelCard
        title="Activation Campaigns"
        description="Partner-branded URLs for trackable acquisition"
        icon={<LinkIcon />}
        available={true}
        selected={selectedChannels.includes("activation")}
        onToggle={() => handleChannelToggle("activation")}
      >
        {selectedChannels.includes("activation") && (
          <ActivationCampaignConfig
            campaignUrl={activationCampaign.campaignUrl}
            onConfigChange={handleActivationConfig}
          />
        )}
      </ChannelCard>

      {/* Hub Airdrops */}
      <ChannelCard
        title="Hub Airdrops"
        description="Direct delivery to Kigo Hub wallets"
        icon={<InboxIcon />}
        available={true}
        selected={selectedChannels.includes("hub_airdrop")}
        onToggle={() => handleChannelToggle("hub_airdrop")}
      >
        {selectedChannels.includes("hub_airdrop") && (
          <HubAirdropConfig
            deliveryTiming={hubAirdrop.deliveryTiming}
            onConfigChange={handleHubAirdropConfig}
          />
        )}
      </ChannelCard>

      {/* Promoted Marketplace */}
      <ChannelCard
        title="Promoted Marketplace"
        description="Paid promotion on Kigo Marketplace"
        icon={<MegaphoneIcon />}
        available={programType === "open_loop"}
        selected={selectedChannels.includes("promoted_marketplace")}
        onToggle={() => handleChannelToggle("promoted_marketplace")}
      >
        {selectedChannels.includes("promoted_marketplace") && (
          <PromotedMarketplaceConfig
            budget={promotedMarketplace.budget}
            onConfigChange={handlePromotedConfig}
          />
        )}
      </ChannelCard>

      {/* Organic Marketplace */}
      <ChannelCard
        title="Organic Marketplace"
        description="Natural discovery without paid promotion"
        icon={<SearchIcon />}
        available={programType === "open_loop"}
        selected={selectedChannels.includes("organic_marketplace")}
        onToggle={() => handleChannelToggle("organic_marketplace")}
      >
        {selectedChannels.includes("organic_marketplace") && (
          <OrganicMarketplaceConfig
            categoryPlacement={organicMarketplace.categoryPlacement}
            onConfigChange={handleOrganicConfig}
          />
        )}
      </ChannelCard>
    </div>

    {/* AI Channel Recommendations */}
    <AIChannelRecommendations
      businessObjective={businessObjective}
      targetAudience={targetAudience}
      programType={programType}
      budget={budget}
      onAcceptRecommendation={handleAcceptChannels}
    />

    {/* Estimated Reach */}
    <ChannelReachEstimate
      channels={selectedChannels}
      targetingData={targetingData}
      scheduleData={scheduleData}
    />
  </CardContent>

  <CardFooter>
    <Button variant="outline" onClick={handlePrevious}>
      ← Previous
    </Button>
    <Button onClick={handleNext}>Next: Review →</Button>
  </CardFooter>
</Card>
```

---

### Task 2.5: Create Step 10 (Review & Launch)

**File**: `components/features/offer-manager/steps/ReviewLaunchStep.tsx`

**BRD Reference**: Section 3.2, Steps 4-5

**UI**:

```tsx
<Card>
  <CardHeader>
    <h3>Review & Launch</h3>
    <p>Final review before launching your campaign</p>
  </CardHeader>

  <CardContent className="space-y-6">
    {/* Offer Summary */}
    <ReviewSection title="Offer Details" onEdit={() => navigateToStep(1)}>
      <OfferSummaryCard offer={offerData} />
    </ReviewSection>

    {/* Campaign Configuration */}
    <ReviewSection
      title="Campaign Configuration"
      onEdit={() => navigateToStep(7)}
    >
      <CampaignSummaryCard campaign={campaignData} />
    </ReviewSection>

    {/* Performance Projections */}
    <ReviewSection title="Performance Projections">
      <PerformanceProjections
        expectedReach={projections.reach}
        expectedEngagement={projections.engagement}
        expectedRedemptions={projections.redemptions}
        confidence={projections.confidence}
      />
    </ReviewSection>

    {/* Budget Impact */}
    <ReviewSection title="Budget Impact">
      <BudgetImpactSummary
        discountLiability={budgetImpact.discountLiability}
        operationalCosts={budgetImpact.operationalCosts}
        totalCost={budgetImpact.totalCost}
      />
    </ReviewSection>

    {/* Compliance Validation */}
    <ReviewSection title="Compliance Validation">
      <ComplianceChecklist
        brandStandards={complianceValidation.brandStandards}
        legalRequirements={complianceValidation.legalRequirements}
        operationalCapability={complianceValidation.operationalCapability}
        programSpecific={complianceValidation.programSpecific}
      />
    </ReviewSection>

    {/* AI Final Validation */}
    <AIFinalValidation
      offerData={offerData}
      campaignData={campaignData}
      validationResults={agentState.validation_results}
    />
  </CardContent>

  <CardFooter className="flex justify-between">
    <Button variant="outline" onClick={handlePrevious}>
      ← Previous
    </Button>

    <div className="flex gap-2">
      <Button variant="secondary" onClick={handleSaveDraft}>
        Save Draft
      </Button>
      <Button variant="secondary" onClick={handleSchedule}>
        Schedule for Later
      </Button>
      <Button onClick={handleLaunchNow} disabled={!allValidationsPassed}>
        🚀 Launch Now
      </Button>
    </div>
  </CardFooter>
</Card>
```

---

## Phase 3: Navigation & State Refactor (Week 5)

### Task 3.1: Implement Dynamic Stepper

**File**: `OfferManagerView.tsx`

**Changes**:

```typescript
// Update step configuration
const STEP_CONFIG: StepConfig[] = [
  // Phase 1: Offer Creation
  { id: 1, key: "goal", label: "Goal", phase: "offer", required: true },
  { id: 2, key: "type", label: "Type", phase: "offer", required: true },
  { id: 3, key: "redemption", label: "Redeem", phase: "offer", required: true },
  {
    id: 4,
    key: "promo",
    label: "Promo",
    phase: "offer",
    required: false,
    conditional: (data) => data.redemptionMethod === "promo_code",
  },
  { id: 5, key: "brand", label: "Brand", phase: "offer", required: true },

  // Phase separator (not a real step)
  { id: "separator", phase: "separator" },

  // Phase 2: Campaign Management
  {
    id: 6,
    key: "select",
    label: "Select",
    phase: "campaign",
    required: false,
    conditional: (data) => !data.offerFromCreation,
  },
  { id: 7, key: "target", label: "Target", phase: "campaign", required: true },
  {
    id: 8,
    key: "schedule",
    label: "Schedule",
    phase: "campaign",
    required: true,
  },
  {
    id: 9,
    key: "channels",
    label: "Channels",
    phase: "campaign",
    required: true,
  },
  { id: 10, key: "launch", label: "Launch", phase: "campaign", required: true },
];

// Calculate visible steps dynamically
const getVisibleSteps = (formData: FormData, flow: FlowType) => {
  return STEP_CONFIG.filter((step) => {
    if (step.id === "separator") return true;
    if (!step.conditional) return true;
    return step.conditional(formData);
  });
};
```

### Task 3.2: Implement Phase-Aware Navigation

**New Component**: `components/features/offer-manager/PhaseIndicator.tsx`

```tsx
export function PhaseIndicator({
  currentPhase,
}: {
  currentPhase: "offer" | "campaign";
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Badge variant={currentPhase === "offer" ? "default" : "outline"}>
        Phase 1: Offer Creation
      </Badge>
      <ArrowRightIcon className="h-4 w-4 text-gray-400" />
      <Badge variant={currentPhase === "campaign" ? "default" : "outline"}>
        Phase 2: Campaign Management
      </Badge>
    </div>
  );
}
```

### Task 3.3: Implement Save Points

```typescript
// Save offer after Step 5
const handleSaveOffer = async () => {
  const offerData = {
    goal: formData.goal,
    type: formData.type,
    redemption: formData.redemption,
    promo: formData.promo,
    brand: formData.brand,
  };

  const savedOffer = await api.saveOffer(offerData);

  return savedOffer.id;
};

// Save campaign after Step 10
const handleSaveCampaign = async () => {
  const campaignData = {
    offerId: selectedOfferId,
    targeting: formData.targeting,
    schedule: formData.schedule,
    channels: formData.channels,
  };

  const savedCampaign = await api.saveCampaign(campaignData);

  return savedCampaign.id;
};

// Auto-save draft (debounced)
const handleAutoSave = useDebounce(async (data: Partial<FormData>) => {
  await api.saveDraft(data);
  setLastSaved(new Date());
}, 30000); // 30 seconds
```

---

## Phase 4: AI Agent Integration (Week 6)

### Task 4.1: Update Agent State Types

**File**: `components/features/offer-manager/types.ts`

```typescript
export interface OfferManagerState {
  // Navigation
  workflow_step: string; // Maps to step key
  current_phase: "initialization" | "offer_creation" | "campaign_management";
  progress_percentage: number;

  // Offer data
  business_objective: string;
  program_type: "closed_loop" | "open_loop" | "general";
  offer_config: {
    type: string;
    value: number;
    redemption_method: string;
    promo_codes?: string[];
    title: string;
    description: string;
    // ... all offer fields
  };

  // Campaign data
  campaign_setup: {
    targeting: TargetingData;
    schedule: ScheduleData;
    channels: DeliveryChannelsData;
  };

  // AI recommendations
  recommendations: {
    offer_type?: string;
    offer_value?: number;
    targeting?: string[];
    timing?: { start: Date; duration: number };
    channels?: CampaignType[];
  };

  // Validation
  validation_results: ValidationResult[];
  brand_compliance: {
    validated: boolean;
    issues: string[];
    suggestions: string[];
  };

  // Approval flow
  requires_approval: boolean;
  approval_status?: "pending" | "approved" | "rejected";
  pending_action?: string;
}
```

### Task 4.2: Create Agent Actions for Each Step

**File**: `components/features/offer-manager/hooks/useOfferManagerActions.ts`

```typescript
export function useOfferManagerActions() {
  // Step 1: Goal setting
  useCopilotAction({
    name: 'suggest_target_audience',
    description: 'Suggest target audience based on business objective',
    parameters: [
      { name: 'business_objective', type: 'string', required: true },
      { name: 'program_type', type: 'string', required: true },
    ],
    handler: async ({ business_objective, program_type }) => {
      // AI suggests audience
      return { suggested_audiences: [...] }
    }
  })

  // Step 2: Offer type recommendation
  useCopilotAction({
    name: 'recommend_offer_type',
    description: 'Recommend optimal offer type and value',
    parameters: [
      { name: 'business_objective', type: 'string', required: true },
      { name: 'target_audience', type: 'object', required: true },
    ],
    handler: async ({ business_objective, target_audience }) => {
      // AI recommends offer type/value
      return {
        recommended_type: 'discount_percent',
        recommended_value: 15,
        reasoning: '...',
        expected_performance: {...}
      }
    }
  })

  // ... actions for all steps
}
```

---

## Testing Plan

### Unit Tests

```
components/features/offer-manager/steps/__tests__/
  - GoalSettingStep.test.tsx
  - OfferTypeValueStep.test.tsx
  - RedemptionMethodStep.test.tsx
  - PromoCodeStep.test.tsx
  - BrandComplianceStep.test.tsx
  - OfferSelectionStep.test.tsx
  - TargetingStep.test.tsx
  - ScheduleStep.test.tsx
  - DeliveryChannelsStep.test.tsx
  - ReviewLaunchStep.test.tsx
```

### Integration Tests

```
components/features/offer-manager/__tests__/
  - offer-creation-flow.test.tsx (Steps 1-5)
  - campaign-management-flow.test.tsx (Steps 6-10)
  - combined-flow.test.tsx (Steps 1-10)
  - conditional-navigation.test.tsx
  - save-resume.test.tsx
```

### E2E Tests

```
e2e/offer-manager/
  - linear-flow.spec.ts
  - save-exit-offer.spec.ts
  - campaign-with-existing-offer.spec.ts
  - program-specific-flows.spec.ts
```

---

## Deployment Plan

### Week 1-2: Phase 1 (Offer Steps 1-5)

- Deploy Steps 1-3 refactors
- Deploy new Step 4 (Promo Code)
- Deploy new Step 5 (Brand & Compliance)
- Feature flag: `offer_creation_v2`

### Week 3-4: Phase 2 (Campaign Steps 6-10)

- Deploy Step 6 (Offer Selection)
- Deploy Steps 7-9 (Targeting, Schedule, Channels)
- Deploy Step 10 (Review & Launch)
- Feature flag: `campaign_management_v2`

### Week 5: Phase 3 (Navigation)

- Deploy dynamic stepper
- Deploy phase indicator
- Deploy save points
- Feature flag: `offer_manager_navigation_v2`

### Week 6: Phase 4 (AI Agent)

- Deploy updated agent state
- Deploy agent actions for all steps
- Deploy AI recommendations UI
- Feature flag: `offer_manager_ai_v2`

### Week 7: Testing & Refinement

- Run full test suite
- User acceptance testing
- Bug fixes and polish

### Week 8: Pilot Launch

- Enable for John Deere pilot users
- Enable for Yardi pilot users
- Enable for Kigo team
- Monitor and collect feedback
