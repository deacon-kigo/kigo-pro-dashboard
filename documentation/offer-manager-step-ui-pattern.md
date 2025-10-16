# Offer Manager Step UI Pattern

## Standard Template for All Step Components

## 📐 Standard Structure

All step components MUST follow this exact structure for consistency:

### 1. Card Wrapper

```tsx
<Card className="p-6 border border-gray-200 shadow-sm">
```

### 2. Header Section

```tsx
<div className="mb-6">
  <h2 className="text-xl font-bold text-gray-900 mb-2">Step X: [Step Name]</h2>
  <p className="text-sm text-gray-600">
    [Brief description of what this step does]
  </p>
</div>
```

### 3. Content Area

```tsx
<div className="space-y-6">{/* Form fields go here */}</div>
```

### 4. Navigation Footer

```tsx
<div className="flex justify-between gap-3 mt-8 pt-6 border-t border-gray-200">
  <Button
    variant="outline"
    onClick={onPrevious}
    className="border-gray-300"
    disabled={isFirstStep} // Optional: disable if first step
  >
    ← Previous
  </Button>
  <Button
    onClick={handleNext}
    className="bg-blue-600 hover:bg-blue-700 text-white"
  >
    Next: [Next Step Name] →
  </Button>
</div>
```

---

## 📋 Complete Template

```tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/atoms/Label";
import { SparklesIcon } from "@heroicons/react/24/outline";

interface StepNameStepProps {
  formData: {
    // Define form fields here
  };
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onAskAI: (field: string) => void;
}

export default function StepNameStep({
  formData,
  onUpdate,
  onNext,
  onPrevious,
  onAskAI,
}: StepNameStepProps) {
  const handleNext = () => {
    // Validation logic here
    if (!formData.requiredField) {
      alert("Please fill in required fields");
      return;
    }
    onNext();
  };

  return (
    <Card className="p-6 border border-gray-200 shadow-sm">
      {/* HEADER SECTION */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Step X: [Step Name]
        </h2>
        <p className="text-sm text-gray-600">
          [Brief description of what this step does]
        </p>
      </div>

      {/* CONTENT AREA */}
      <div className="space-y-6">
        {/* Example Field with AI Assist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="fieldName" className="text-sm font-medium">
              Field Name <span className="text-red-500">*</span>
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAskAI("fieldName")}
              className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50"
            >
              <SparklesIcon className="h-3 w-3 mr-1" />
              Ask AI
            </Button>
          </div>
          <Input
            id="fieldName"
            placeholder="Enter value..."
            value={formData.fieldName}
            onChange={(e) => onUpdate("fieldName", e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            Helper text explaining the field
          </p>
        </div>

        {/* Add more fields here */}
      </div>

      {/* NAVIGATION FOOTER */}
      <div className="flex justify-between gap-3 mt-8 pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="border-gray-300"
        >
          ← Previous
        </Button>
        <Button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Next: [Next Step Name] →
        </Button>
      </div>
    </Card>
  );
}
```

---

## ✅ Consistency Checklist

When creating a new step component, verify:

- [ ] Imports `Card` from `@/components/ui/card`
- [ ] Card wrapper with `className="p-6 border border-gray-200 shadow-sm"`
- [ ] Header section with `mb-6` margin
- [ ] Step number and name in h2 (e.g., "Step 4: Promo Code Setup")
- [ ] Description text with `text-sm text-gray-600`
- [ ] Content area with `space-y-6` spacing
- [ ] Navigation footer with `mt-8 pt-6 border-t border-gray-200`
- [ ] Previous button (left) with outline variant
- [ ] Next button (right) with blue bg
- [ ] Proper validation in `handleNext()`
- [ ] TypeScript interface for props
- [ ] Consistent field structure with AI assist buttons

---

## 🎨 Field Pattern with AI Assist

Standard pattern for form fields:

```tsx
<div>
  {/* Label with AI Assist Button */}
  <div className="flex items-center justify-between mb-2">
    <Label htmlFor="fieldId" className="text-sm font-medium">
      Field Label <span className="text-red-500">*</span>
    </Label>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onAskAI("fieldId")}
      className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50"
    >
      <SparklesIcon className="h-3 w-3 mr-1" />
      Ask AI
    </Button>
  </div>

  {/* Input Field */}
  <Input
    id="fieldId"
    placeholder="Placeholder text..."
    value={formData.fieldId}
    onChange={(e) => onUpdate("fieldId", e.target.value)}
    className="w-full"
  />

  {/* Helper Text */}
  <p className="text-xs text-gray-500 mt-1.5">
    Helper text explaining what this field is for
  </p>
</div>
```

---

## 📊 Current Implementation Status

| Step | Component                | Pattern Applied | Status        |
| ---- | ------------------------ | --------------- | ------------- |
| 1    | GoalSettingStep.tsx      | ✅ Yes          | Complete      |
| 2    | OfferDetailsStep.tsx     | ✅ Yes          | Complete      |
| 3    | RedemptionMethodStep.tsx | ✅ Yes          | Complete      |
| 4    | PromoCodeStep.tsx        | ⏳ Pending      | Not built yet |
| 5    | BrandComplianceStep.tsx  | ⏳ Pending      | Not built yet |
| 6    | OfferSelectionStep.tsx   | ⏳ Pending      | Not built yet |
| 7    | TargetingStep.tsx        | ⏳ Pending      | Not built yet |
| 8    | ScheduleStep.tsx         | ⏳ Pending      | Not built yet |
| 9    | DeliveryChannelsStep.tsx | ⏳ Pending      | Not built yet |
| 10   | ReviewLaunchStep.tsx     | ⏳ Pending      | Not built yet |

---

## 🔧 Special Cases

### Step 1 (First Step)

- Previous button should be disabled
- Use `disabled` prop and add opacity-50

```tsx
<Button
  variant="outline"
  disabled
  className="border-gray-300 opacity-50 cursor-not-allowed"
>
  ← Previous
</Button>
```

### Step 5 (Offer-Only Exit Point)

- Two buttons on right side: "Save & Exit" and "Continue to Campaign"

```tsx
<div className="flex justify-between gap-3 mt-8 pt-6 border-t border-gray-200">
  <Button variant="outline" onClick={onPrevious} className="border-gray-300">
    ← Previous
  </Button>

  <div className="flex gap-2">
    <Button variant="secondary" onClick={onSaveAndExit}>
      Save & Exit
    </Button>
    <Button
      onClick={onContinueToCampaign}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      Continue to Campaign →
    </Button>
  </div>
</div>
```

### Step 10 (Last Step)

- Replace "Next" with "Launch" button
- Add optional "Save Draft" and "Schedule" buttons

```tsx
<div className="flex justify-between gap-3 mt-8 pt-6 border-t border-gray-200">
  <Button variant="outline" onClick={onPrevious} className="border-gray-300">
    ← Previous
  </Button>

  <div className="flex gap-2">
    <Button variant="secondary" onClick={onSaveDraft}>
      Save Draft
    </Button>
    <Button variant="outline" onClick={onSchedule}>
      Schedule for Later
    </Button>
    <Button
      onClick={onLaunch}
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      🚀 Launch Now
    </Button>
  </div>
</div>
```

---

## 🚫 Avoid Nested Containers

**DO NOT** use nested Cards inside the main Card. The main Card wrapper is sufficient.

**❌ Don't do this:**

```tsx
<Card className="p-6 border border-gray-200 shadow-sm">
  <div className="mb-6">
    <h2>Step Title</h2>
  </div>

  <div className="space-y-6">
    {/* Nested Card - BAD */}
    <Card className="p-4 bg-gray-50">
      <h3>Section Title</h3>
      <div>Fields...</div>
    </Card>
  </div>
</Card>
```

**✅ Do this instead:**

```tsx
<Card className="p-6 border border-gray-200 shadow-sm">
  <div className="mb-6">
    <h2>Step Title</h2>
  </div>

  <div className="space-y-6">
    {/* First section - no container */}
    <div>
      <Label>Field 1</Label>
      <Input />
    </div>

    {/* Conditional section - use border separator */}
    {showConditional && (
      <div className="pt-6 border-t border-gray-200">
        <Label className="text-sm font-medium text-gray-900 mb-4 block">
          Section Title
        </Label>
        <div>Fields...</div>
      </div>
    )}
  </div>
</Card>
```

**Key principle**: The step title is already in the main Card header, so don't add redundant containers or titles inside the content area. Use border separators (`border-t`) for visual grouping.

---

## 💡 Best Practices

### Spacing

- Use `space-y-6` for main content sections
- Use `space-y-3` for tightly related fields
- Use `gap-3` for button groups
- Use `mb-6` for header section
- Use `mt-8 pt-6` for navigation footer
- Use `pt-6 border-t border-gray-200` for conditional/grouped sections

### Typography

- Step title: `text-xl font-bold text-gray-900`
- Step description: `text-sm text-gray-600`
- Field labels: `text-sm font-medium`
- Helper text: `text-xs text-gray-500`
- Required indicator: `<span className="text-red-500">*</span>`

### Colors

- Primary action button: `bg-blue-600 hover:bg-blue-700 text-white`
- Secondary button: `variant="secondary"`
- Outline button: `variant="outline"` with `border-gray-300`
- AI assist button: `text-blue-600 hover:bg-blue-50`
- Success action (launch): `bg-green-600 hover:bg-green-700`

### Validation

- Always validate required fields in `handleNext()`
- Use browser `alert()` for now (will be replaced with toast notifications)
- Check for empty strings, undefined values, and invalid formats

---

## 🎯 Quick Reference

**Step Titles** (from design spec):

1. Step 1: Goal & Context
2. Step 2: Offer Type & Value
3. Step 3: Redemption Method
4. Step 4: Promo Code Setup
5. Step 5: Brand & Compliance
6. Step 6: Offer Selection
7. Step 7: Targeting & Partners
8. Step 8: Schedule & Timing
9. Step 9: Delivery Channels
10. Step 10: Review & Launch

**Step Descriptions** (suggested):

1. Define your business objective and key parameters
2. Configure your promotional offer settings
3. Select how customers will redeem your offer
4. Configure promo codes and usage limits
5. Customize offer messaging and ensure brand compliance
6. Select an offer for your campaign
7. Define targeting and partner programs
8. Set campaign schedule and timing
9. Choose delivery channels for your campaign
10. Review and launch your offer campaign

---

_Last Updated: 2025-10-16_
_Status: Active - Use this pattern for all step components_
