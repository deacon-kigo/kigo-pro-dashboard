"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DocumentTextIcon,
  CreditCardIcon,
  CheckCircleIcon,
  GiftIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperSeparator,
} from "@/components/ui/stepper";
import OfferDetailsStepV1 from "./steps/OfferDetailsStep";
import RedemptionMethodStepV1 from "./steps/RedemptionMethodStep";
import ReviewStepV1 from "./steps/ReviewStep";
import OfferManagerDashboardV1 from "./OfferManagerDashboardV1";

/**
 * Offer Manager V1
 *
 * Simplified version for internal merchant onboarding
 * - No AI features
 * - No goal setting or campaign planning
 * - Focus on core offer creation: Details → Redemption → Review
 * - Based on offer-manager-v1.md PRD
 */

interface OfferManagerViewV1Props {
  onCreatingChange?: (isCreating: boolean) => void;
}

export default function OfferManagerViewV1({
  onCreatingChange,
}: OfferManagerViewV1Props = {}) {
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "details" | "redemption" | "review"
  >("details");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [redemptionErrors, setRedemptionErrors] = useState<
    Record<string, string>
  >({});

  // V1 Form data - simplified from PRD spec
  const [formData, setFormData] = useState({
    // Offer Details
    shortText: "", // Listing view
    longText: "", // Detail view
    startDate: "", // Offer start date
    endDate: "", // Offer end date (optional)
    maxDiscount: "", // Optional
    termsConditions: "", // Merchant-supplied

    // Classification
    offerType: "", // BOGO, % Off, Free
    discountValue: "", // Auto-calculated (optional)
    cuisineType: "", // For search
    keywords: "", // For search
    firstCategory: "", // Editable list
    secondCategory: "", // Editable list

    // Redemption Method
    redemptionTypes: [], // Multiple redemption types
    promoCodeType: "single", // Static or unique
    promoCode: "", // Single code or uploaded codes
    barcode: "", // Optional
    qrCode: "", // Optional
    externalUrl: "", // For External URL redemption

    // Usage limits
    usageLimitPerCustomer: "1",
    totalUsageLimit: "", // Total redemptions allowed
    locationScope: "all", // Which merchant locations
  });

  // Validation function for Offer Details step
  const validateDetailsStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.merchant) {
      newErrors.merchant = "Required";
    }
    if (!formData.offerSource) {
      newErrors.offerSource = "Required";
    }
    if (!formData.offerName && !formData.shortText) {
      newErrors.offerName = "Required";
    }
    if (!formData.description && !formData.longText) {
      newErrors.description = "Required";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Required";
    }
    if (!formData.termsConditions) {
      newErrors.termsConditions = "Required";
    }
    if (!formData.offerType) {
      newErrors.offerType = "Required";
    }

    // Date validation
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation function for Redemption Method step
  const validateRedemptionStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    // At least one redemption type required
    if (!formData.redemptionTypes || formData.redemptionTypes.length === 0) {
      newErrors.redemptionTypes = "Select at least one redemption method";
    }

    // If mobile or online_print is selected, promo code is required
    if (
      formData.redemptionTypes &&
      (formData.redemptionTypes.includes("mobile") ||
        formData.redemptionTypes.includes("online_print"))
    ) {
      if (formData.promoCodeType === "single" && !formData.promoCode) {
        newErrors.promoCode = "Promo code is required";
      }
    }

    // If external_url is selected, URL is required
    if (
      formData.redemptionTypes &&
      formData.redemptionTypes.includes("external_url") &&
      !formData.externalUrl
    ) {
      newErrors.externalUrl = "External URL is required";
    }

    // Usage limit per customer is required
    if (!formData.usageLimitPerCustomer) {
      newErrors.usageLimitPerCustomer = "Required";
    }

    setRedemptionErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartCreation = () => {
    setIsCreatingOffer(true);
    setCurrentStep("details");
    setErrors({});
    setRedemptionErrors({});
    onCreatingChange?.(true);
  };

  const handleBackToDashboard = () => {
    setIsCreatingOffer(false);
    setCurrentStep("details");
    setCompletedSteps([]);
    setErrors({});
    setRedemptionErrors({});
    onCreatingChange?.(false);
  };

  const handleFormUpdate = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user updates it
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    if (redemptionErrors[field]) {
      setRedemptionErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    // Validate current step before proceeding
    let isValid = true;

    if (currentStep === "details") {
      isValid = validateDetailsStep();
      if (!isValid) {
        // Scroll to first error
        const firstErrorElement = document.querySelector(".border-red-500");
        firstErrorElement?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        return;
      }
    } else if (currentStep === "redemption") {
      isValid = validateRedemptionStep();
      if (!isValid) {
        // Scroll to first error
        const firstErrorElement = document.querySelector(".border-red-500");
        firstErrorElement?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        return;
      }
    }

    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    // Navigate to next step
    if (currentStep === "details") {
      setCurrentStep("redemption");
    } else if (currentStep === "redemption") {
      setCurrentStep("review");
    }
  };

  const handlePrevious = () => {
    if (currentStep === "review") {
      setCurrentStep("redemption");
    } else if (currentStep === "redemption") {
      setCurrentStep("details");
    }
  };

  const handleSubmit = () => {
    console.log("V1 Offer Created:", formData);
    // TODO: API call to create offer
    // For now, just go back to dashboard
    alert("Offer created successfully! (V1)");
    handleBackToDashboard();
  };

  const stepConfig = [
    {
      id: "details",
      number: 1,
      label: "Details",
      icon: DocumentTextIcon,
      description: "Offer information",
    },
    {
      id: "redemption",
      number: 2,
      label: "Redemption",
      icon: CreditCardIcon,
      description: "How customers redeem",
    },
    {
      id: "review",
      number: 3,
      label: "Review",
      icon: CheckCircleIcon,
      description: "Review and publish",
    },
  ];

  const currentStepNumber =
    stepConfig.find((s) => s.id === currentStep)?.number || 1;

  if (!isCreatingOffer) {
    return <OfferManagerDashboardV1 onCreateOffer={handleStartCreation} />;
  }

  return (
    <div className="overflow-hidden" style={{ height: "calc(100vh - 140px)" }}>
      <div className="h-full flex">
        {/* Vertical Stepper */}
        <div className="w-20 flex-shrink-0">
          <div className="h-full bg-white rounded-l-lg border border-r-0 border-gray-200 shadow-sm py-6 px-3">
            <Stepper
              orientation="vertical"
              value={currentStepNumber}
              onValueChange={(step) => {
                const stepId = stepConfig.find((s) => s.number === step)?.id;
                if (stepId) setCurrentStep(stepId as any);
              }}
              className="gap-4"
            >
              {stepConfig.map((step) => (
                <StepperItem
                  key={step.id}
                  step={step.number}
                  completed={completedSteps.includes(step.id)}
                >
                  <StepperTrigger className="flex flex-col items-center gap-2 w-full">
                    <StepperIndicator />
                    <StepperTitle className="text-xs text-center">
                      {step.label}
                    </StepperTitle>
                  </StepperTrigger>
                  {step.number < stepConfig.length && <StepperSeparator />}
                </StepperItem>
              ))}
            </Stepper>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="h-full">
            <div className="w-full h-full flex flex-col">
              <Card className="p-0 flex flex-col h-full overflow-hidden shadow-md rounded-l-none">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
                  <div className="flex items-center">
                    <GiftIcon className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <h3 className="font-medium">
                        {currentStep === "details" && "Offer Details"}
                        {currentStep === "redemption" && "Redemption Method"}
                        {currentStep === "review" && "Review & Publish"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentStep === "details" && "Enter offer information"}
                        {currentStep === "redemption" && "Configure redemption"}
                        {currentStep === "review" && "Review and publish offer"}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBackToDashboard}
                      className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                      Cancel
                    </Button>
                    {currentStep === "review" ? (
                      <Button
                        className="flex items-center gap-1"
                        size="sm"
                        onClick={handleSubmit}
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        Publish Offer
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        className="flex items-center gap-1"
                        size="sm"
                      >
                        Next Step →
                      </Button>
                    )}
                  </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-auto">
                  <div className="p-4">
                    {currentStep === "details" && (
                      <OfferDetailsStepV1
                        formData={formData}
                        onUpdate={handleFormUpdate}
                        onNext={handleNext}
                        errors={errors}
                      />
                    )}

                    {currentStep === "redemption" && (
                      <RedemptionMethodStepV1
                        formData={formData}
                        onUpdate={handleFormUpdate}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        errors={redemptionErrors}
                      />
                    )}

                    {currentStep === "review" && (
                      <ReviewStepV1
                        formData={formData}
                        onPrevious={handlePrevious}
                        onSubmit={handleSubmit}
                      />
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
