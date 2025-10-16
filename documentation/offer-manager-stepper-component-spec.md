# Offer Manager Stepper Component Specification

## Visual Design & Implementation Guide

## 🎨 Stepper Visual Design

### Current Implementation (5 Steps)

```
┌─────────┐
│  ● 1    │  Goal
│  │      │
│  ● 2    │  Details
│  │      │
│  ● 3    │  Redeem
│  │      │
│  ○ 4    │  Campaign
│  │      │
│  ○ 5    │  Review
└─────────┘
```

### Refined Implementation (10 Steps, 2 Phases)

```
┌──────────┐
│  ● 1     │  Goal          ┐
│  │       │                │
│  ● 2     │  Type          │ PHASE 1
│  │       │                │ Offer
│  ● 3     │  Redeem        │ Creation
│  │       │                │
│ (●) 4    │  Promo         │ (conditional)
│  │       │                │
│  ● 5     │  Brand         ┘
│          │
│ ═══════  │ ← Phase Separator
│          │
│  ○ 6     │  Select        ┐ (conditional)
│  │       │                │
│  ○ 7     │  Target        │ PHASE 2
│  │       │                │ Campaign
│  ○ 8     │  Schedule      │ Management
│  │       │                │
│  ○ 9     │  Channels      │
│  │       │                │
│  ○ 10    │  Launch        ┘
└──────────┘
```

**Legend**:

- `●` = Completed step (filled blue circle)
- `◉` = Current step (outlined blue circle, pulsing)
- `○` = Pending step (gray outlined circle)
- `(●)` = Conditional step (shown only when applicable)
- `│` = Connector line
- `═══` = Phase separator (horizontal line)

---

## 🔧 Component Implementation

### File Structure

```
components/features/offer-manager/
├── OfferManagerView.tsx
├── stepper/
│   ├── OfferManagerStepper.tsx         (NEW - wrapper component)
│   ├── StepperPhaseIndicator.tsx       (NEW - phase label)
│   ├── StepperPhaseSeparator.tsx       (NEW - separator line)
│   └── types.ts                         (NEW - stepper types)
├── steps/
│   ├── GoalSettingStep.tsx             (REFACTOR)
│   ├── OfferTypeValueStep.tsx          (REFACTOR from OfferDetailsStep)
│   ├── RedemptionMethodStep.tsx        (ENHANCE)
│   ├── PromoCodeStep.tsx               (NEW)
│   ├── BrandComplianceStep.tsx         (NEW)
│   ├── OfferSelectionStep.tsx          (NEW)
│   ├── TargetingStep.tsx               (NEW)
│   ├── ScheduleStep.tsx                (NEW)
│   ├── DeliveryChannelsStep.tsx        (NEW)
│   └── ReviewLaunchStep.tsx            (NEW)
└── types.ts
```

---

## 📋 Stepper Configuration

### Step Configuration Type

```typescript
// types.ts
export type StepPhase = "offer" | "campaign";
export type StepKey =
  | "goal"
  | "type"
  | "redemption"
  | "promo"
  | "brand"
  | "select"
  | "target"
  | "schedule"
  | "channels"
  | "launch";

export interface StepConfig {
  id: number;
  key: StepKey;
  label: string;
  fullLabel: string;
  phase: StepPhase;
  required: boolean;
  conditional?: boolean;
  conditionalLogic?: (data: OfferManagerFormData) => boolean;
  icon: React.ComponentType<{ className?: string }>;
}

export interface StepperState {
  currentStep: number;
  completedSteps: number[];
  visibleSteps: number[];
  currentPhase: StepPhase;
  flowType: "linear" | "offer_only" | "campaign_only";
}
```

### Step Configuration Array

```typescript
// stepper/config.ts
import {
  DocumentTextIcon,
  GiftIcon,
  CreditCardIcon,
  TagIcon,
  SparklesIcon,
  CheckCircleIcon,
  UsersIcon,
  CalendarIcon,
  MegaphoneIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

export const STEP_CONFIG: StepConfig[] = [
  // Phase 1: Offer Creation
  {
    id: 1,
    key: "goal",
    label: "Goal",
    fullLabel: "Goal & Context",
    phase: "offer",
    required: true,
    conditional: false,
    icon: DocumentTextIcon,
  },
  {
    id: 2,
    key: "type",
    label: "Type",
    fullLabel: "Offer Type & Value",
    phase: "offer",
    required: true,
    conditional: false,
    icon: GiftIcon,
  },
  {
    id: 3,
    key: "redemption",
    label: "Redeem",
    fullLabel: "Redemption Method",
    phase: "offer",
    required: true,
    conditional: false,
    icon: CreditCardIcon,
  },
  {
    id: 4,
    key: "promo",
    label: "Promo",
    fullLabel: "Promo Code Setup",
    phase: "offer",
    required: false,
    conditional: true,
    conditionalLogic: (data) =>
      data.offer.redemption?.redemptionMethod === "promo_code",
    icon: TagIcon,
  },
  {
    id: 5,
    key: "brand",
    label: "Brand",
    fullLabel: "Brand & Compliance",
    phase: "offer",
    required: true,
    conditional: false,
    icon: SparklesIcon,
  },

  // Phase 2: Campaign Management
  {
    id: 6,
    key: "select",
    label: "Select",
    fullLabel: "Offer Selection",
    phase: "campaign",
    required: false,
    conditional: true,
    conditionalLogic: (data) => data.flowType === "campaign_only",
    icon: CheckCircleIcon,
  },
  {
    id: 7,
    key: "target",
    label: "Target",
    fullLabel: "Targeting & Partners",
    phase: "campaign",
    required: true,
    conditional: false,
    icon: UsersIcon,
  },
  {
    id: 8,
    key: "schedule",
    label: "Schedule",
    fullLabel: "Schedule & Timing",
    phase: "campaign",
    required: true,
    conditional: false,
    icon: CalendarIcon,
  },
  {
    id: 9,
    key: "channels",
    label: "Channels",
    fullLabel: "Delivery Channels",
    phase: "campaign",
    required: true,
    conditional: false,
    icon: MegaphoneIcon,
  },
  {
    id: 10,
    key: "launch",
    label: "Launch",
    fullLabel: "Review & Launch",
    phase: "campaign",
    required: true,
    conditional: false,
    icon: RocketLaunchIcon,
  },
];

// Helper to get visible steps
export function getVisibleSteps(formData: OfferManagerFormData): StepConfig[] {
  return STEP_CONFIG.filter((step) => {
    if (!step.conditional) return true;
    if (!step.conditionalLogic) return true;
    return step.conditionalLogic(formData);
  });
}

// Helper to get current phase
export function getCurrentPhase(currentStep: number): StepPhase {
  const step = STEP_CONFIG.find((s) => s.id === currentStep);
  return step?.phase || "offer";
}
```

---

## 🎯 Stepper Component Implementation

### OfferManagerStepper.tsx

```tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { StepConfig, StepperState } from "./types";
import { STEP_CONFIG, getVisibleSteps, getCurrentPhase } from "./config";
import { StepperPhaseIndicator } from "./StepperPhaseIndicator";
import { StepperPhaseSeparator } from "./StepperPhaseSeparator";

interface OfferManagerStepperProps {
  currentStep: number;
  completedSteps: number[];
  formData: OfferManagerFormData;
  onStepClick: (step: number) => void;
}

export function OfferManagerStepper({
  currentStep,
  completedSteps,
  formData,
  onStepClick,
}: OfferManagerStepperProps) {
  const visibleSteps = getVisibleSteps(formData);
  const currentPhase = getCurrentPhase(currentStep);

  // Group steps by phase
  const offerSteps = visibleSteps.filter((s) => s.phase === "offer");
  const campaignSteps = visibleSteps.filter((s) => s.phase === "campaign");

  return (
    <div className="h-full bg-white rounded-l-lg border border-r-0 border-gray-200 shadow-sm py-6 px-3">
      <div className="flex flex-col gap-2">
        {/* Phase 1 Indicator */}
        <StepperPhaseIndicator
          phase="offer"
          active={currentPhase === "offer"}
          label="OFFER"
        />

        {/* Phase 1 Steps */}
        {offerSteps.map((step, index) => (
          <StepperItem
            key={step.id}
            step={step}
            isActive={currentStep === step.id}
            isCompleted={completedSteps.includes(step.id)}
            isClickable={
              completedSteps.includes(step.id) || currentStep === step.id
            }
            showConnector={index < offerSteps.length - 1}
            onClick={() => onStepClick(step.id)}
          />
        ))}

        {/* Phase Separator */}
        <StepperPhaseSeparator />

        {/* Phase 2 Indicator */}
        <StepperPhaseIndicator
          phase="campaign"
          active={currentPhase === "campaign"}
          label="CAMPAIGN"
        />

        {/* Phase 2 Steps */}
        {campaignSteps.map((step, index) => (
          <StepperItem
            key={step.id}
            step={step}
            isActive={currentStep === step.id}
            isCompleted={completedSteps.includes(step.id)}
            isClickable={
              completedSteps.includes(step.id) || currentStep === step.id
            }
            showConnector={index < campaignSteps.length - 1}
            onClick={() => onStepClick(step.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Individual Step Item
interface StepperItemProps {
  step: StepConfig;
  isActive: boolean;
  isCompleted: boolean;
  isClickable: boolean;
  showConnector: boolean;
  onClick: () => void;
}

function StepperItem({
  step,
  isActive,
  isCompleted,
  isClickable,
  showConnector,
  onClick,
}: StepperItemProps) {
  const Icon = step.icon;

  return (
    <div className="flex flex-col items-center">
      {/* Step Button */}
      <button
        onClick={onClick}
        disabled={!isClickable}
        className={cn(
          "group relative flex flex-col items-center gap-2 w-full py-2 px-1 rounded transition-colors",
          isClickable && "hover:bg-gray-50 cursor-pointer",
          !isClickable && "cursor-not-allowed opacity-50",
          isActive && "bg-primary/5"
        )}
      >
        {/* Step Indicator */}
        <div
          className={cn(
            "relative flex items-center justify-center w-8 h-8 rounded-full transition-all",
            isCompleted && "bg-primary text-white",
            isActive && !isCompleted && "bg-white border-2 border-primary",
            !isActive && !isCompleted && "bg-white border-2 border-gray-300",
            isActive && "animate-pulse-slow"
          )}
        >
          {isCompleted ? (
            <Icon className="w-4 h-4" />
          ) : (
            <span className="text-xs font-medium">{step.id}</span>
          )}

          {/* Conditional Indicator */}
          {step.conditional && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white" />
          )}
        </div>

        {/* Step Label */}
        <span
          className={cn(
            "text-xs text-center font-medium transition-colors",
            isActive && "text-primary",
            isCompleted && "text-gray-700",
            !isActive && !isCompleted && "text-gray-400"
          )}
        >
          {step.label}
        </span>

        {/* Tooltip on Hover */}
        <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          {step.fullLabel}
          {step.conditional && (
            <span className="block text-amber-300 text-[10px] mt-1">
              (Conditional)
            </span>
          )}
        </div>
      </button>

      {/* Connector Line */}
      {showConnector && (
        <div
          className={cn(
            "w-0.5 h-6 transition-colors",
            isCompleted ? "bg-primary" : "bg-gray-300"
          )}
        />
      )}
    </div>
  );
}
```

---

## 🎨 Phase Components

### StepperPhaseIndicator.tsx

```tsx
import React from "react";
import { cn } from "@/lib/utils";

interface StepperPhaseIndicatorProps {
  phase: "offer" | "campaign";
  active: boolean;
  label: string;
}

export function StepperPhaseIndicator({
  phase,
  active,
  label,
}: StepperPhaseIndicatorProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center py-2 transition-opacity",
        active ? "opacity-100" : "opacity-40"
      )}
    >
      <div
        className={cn(
          "text-[10px] font-bold tracking-wider",
          active ? "text-primary" : "text-gray-500"
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          "mt-1 w-6 h-0.5 rounded-full",
          active ? "bg-primary" : "bg-gray-300"
        )}
      />
    </div>
  );
}
```

### StepperPhaseSeparator.tsx

```tsx
import React from "react";

export function StepperPhaseSeparator() {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
    </div>
  );
}
```

---

## 🔄 Integration with OfferManagerView.tsx

### Changes to OfferManagerView.tsx

```tsx
'use client'

import React, { useState, useEffect } from 'react'
import { OfferManagerStepper } from '@/components/features/offer-manager/stepper/OfferManagerStepper'
import { STEP_CONFIG, getVisibleSteps, getCurrentPhase } from '@/components/features/offer-manager/stepper/config'
// ... other imports

export default function OfferManagerView() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const [formData, setFormData] = useState<OfferManagerFormData>({
    // ... existing form data
    flowType: 'linear', // 'linear' | 'offer_only' | 'campaign_only'
  })

  // Calculate visible steps dynamically
  const visibleSteps = getVisibleSteps(formData)
  const currentPhase = getCurrentPhase(currentStep)

  // Handle step navigation
  const handleStepClick = (step: number) => {
    // Only allow navigation to completed steps or current step
    if (completedSteps.includes(step) || step === currentStep) {
      setCurrentStep(step)
    }
  }

  const handleNextStep = () => {
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep])
    }

    // Find next visible step
    const currentIndex = visibleSteps.findIndex(s => s.id === currentStep)
    if (currentIndex < visibleSteps.length - 1) {
      const nextStep = visibleSteps[currentIndex + 1]
      setCurrentStep(nextStep.id)
    }
  }

  const handlePreviousStep = () => {
    // Find previous visible step
    const currentIndex = visibleSteps.findIndex(s => s.id === currentStep)
    if (currentIndex > 0) {
      const prevStep = visibleSteps[currentIndex - 1]
      setCurrentStep(prevStep.id)
    }
  }

  // Handle Save & Exit after Step 5
  const handleSaveOfferOnly = async () => {
    // Save offer to catalog
    const savedOffer = await saveOffer(formData.offer)

    // Return to dashboard
    setIsCreatingOffer(false)
    showSuccessToast('Offer saved! You can create a campaign anytime.')
  }

  // Handle Continue to Campaign after Step 5
  const handleContinueToCampaign = () => {
    // Mark Step 5 as completed
    setCompletedSteps([...completedSteps, 5])

    // Auto-skip Step 6 (Offer Selection) and go to Step 7
    setCurrentStep(7)

    // Update flow type
    setFormData({ ...formData, flowType: 'linear' })
  }

  // Get current step component
  const getCurrentStepComponent = () => {
    const stepConfig = STEP_CONFIG.find(s => s.id === currentStep)
    if (!stepConfig) return null

    switch (stepConfig.key) {
      case 'goal':
        return <GoalSettingStep {...} />
      case 'type':
        return <OfferTypeValueStep {...} />
      case 'redemption':
        return <RedemptionMethodStep {...} />
      case 'promo':
        return <PromoCodeStep {...} />
      case 'brand':
        return <BrandComplianceStep {...} />
      case 'select':
        return <OfferSelectionStep {...} />
      case 'target':
        return <TargetingStep {...} />
      case 'schedule':
        return <ScheduleStep {...} />
      case 'channels':
        return <DeliveryChannelsStep {...} />
      case 'launch':
        return <ReviewLaunchStep {...} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen">
      {!isCreatingOffer ? (
        <OfferManagerDashboard onCreateOffer={handleStartCreation} />
      ) : (
        <div className="overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
          <div className="h-full flex">
            {/* NEW: Custom Stepper */}
            <div className="w-20 flex-shrink-0">
              <OfferManagerStepper
                currentStep={currentStep}
                completedSteps={completedSteps}
                formData={formData}
                onStepClick={handleStepClick}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              <Card className="h-full overflow-hidden">
                {/* Header with phase indicator */}
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Phase Badge */}
                      <Badge variant={currentPhase === 'offer' ? 'default' : 'secondary'}>
                        Phase {currentPhase === 'offer' ? '1' : '2'}
                      </Badge>

                      {/* Step Title */}
                      <div>
                        <h3 className="font-medium">
                          {STEP_CONFIG.find(s => s.id === currentStep)?.fullLabel}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Step {currentStep} of {visibleSteps.length}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {currentStep === 5 && (
                        <>
                          <Button variant="outline" onClick={handleSaveOfferOnly}>
                            Save & Exit
                          </Button>
                          <Button onClick={handleContinueToCampaign}>
                            Continue to Campaign →
                          </Button>
                        </>
                      )}

                      {currentStep !== 5 && currentStep < visibleSteps.length && (
                        <Button onClick={handleNextStep}>
                          Next Step →
                        </Button>
                      )}

                      {currentStep === visibleSteps.length && (
                        <Button onClick={handleLaunch}>
                          🚀 Launch Campaign
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 overflow-auto p-4">
                  {getCurrentStepComponent()}
                </div>

                {/* Footer Navigation */}
                <div className="p-3 border-t flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1}
                  >
                    ← Previous
                  </Button>

                  <Button variant="outline" onClick={handleSaveDraft}>
                    💾 Save Draft
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## 🎬 Animations & Transitions

### CSS Animations

```css
/* Add to globals.css or component styles */

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Step transition animation */
@keyframes step-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-content-enter {
  animation: step-fade-in 0.3s ease-out;
}

/* Phase transition */
@keyframes phase-slide {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.phase-transition {
  animation: phase-slide 0.4s ease-out;
}
```

---

## 📱 Responsive Behavior

### Mobile Stepper (Horizontal Dots)

```tsx
// For screens < 768px, use horizontal stepper at top

function MobileOfferManagerStepper({
  currentStep,
  totalSteps,
  completedSteps,
}: MobileStepperProps) {
  return (
    <div className="flex justify-center items-center gap-2 py-4 bg-white border-b md:hidden">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={cn(
            "w-2 h-2 rounded-full transition-all",
            step === currentStep && "w-6 bg-primary",
            step < currentStep && "bg-primary",
            step > currentStep && "bg-gray-300"
          )}
        />
      ))}

      <span className="ml-2 text-xs text-gray-600">
        {currentStep} / {totalSteps}
      </span>
    </div>
  );
}
```

---

## ✅ Testing Checklist

### Visual Tests

- [ ] Stepper renders with 10 steps
- [ ] Phase separator visible between steps 5 and 6
- [ ] Phase indicators show "OFFER" and "CAMPAIGN"
- [ ] Current step has pulsing animation
- [ ] Completed steps show icon instead of number
- [ ] Conditional steps (4, 6) hide/show correctly
- [ ] Tooltip shows on hover with full step name
- [ ] Connector lines change color when completed

### Interaction Tests

- [ ] Click on completed step navigates back
- [ ] Click on future step is disabled
- [ ] Next button advances to next visible step
- [ ] Previous button goes to previous visible step
- [ ] Step 5 shows "Save & Exit" and "Continue" buttons
- [ ] Saving after Step 5 returns to dashboard
- [ ] Continuing after Step 5 skips Step 6 (if coming from offer creation)
- [ ] Starting campaign-only flow shows Step 6

### Responsive Tests

- [ ] Desktop (1440px+): Vertical stepper 80px wide
- [ ] Tablet (768-1439px): Vertical stepper 60px wide
- [ ] Mobile (<768px): Horizontal dots at top

### Accessibility Tests

- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Screen reader announces step changes
- [ ] Focus visible on interactive elements
- [ ] Color contrast meets WCAG AA
- [ ] Disabled steps have appropriate aria attributes

---

## 🎯 Key Implementation Points

1. **Dynamic Step Visibility**: Use `getVisibleSteps()` to calculate which steps show based on form data
2. **Phase Separation**: Clear visual distinction between Offer and Campaign phases
3. **Conditional Steps**: Steps 4 and 6 conditionally rendered based on user choices
4. **Progress Tracking**: Completed steps array tracks user progress
5. **Non-linear Navigation**: Users can edit completed steps by clicking
6. **Save Points**: Special handling at Step 5 for offer-only flow
7. **Responsive**: Different stepper layouts for different screen sizes
8. **Animations**: Smooth transitions between steps and phases
9. **Accessibility**: Full keyboard navigation and screen reader support
10. **Tooltips**: Hover shows full step name for abbreviated labels

---

_Ready for Implementation_ ✅
