"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DocumentTextIcon,
  CreditCardIcon,
  CheckCircleIcon,
  GiftIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
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
import OfferManagerDashboardV1 from "./OfferManagerDashboardV1";
import { ReviewPreviewPanel } from "@/components/ui/review-preview-panel";
import { useOfferContentAI } from "@/lib/hooks/useOfferContentAI";

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

// Validation functions for each step
const validateDetailsStep = (formData: any): boolean => {
  // Required fields: Offer Name, Description, Start Date, Terms & Conditions, Offer Type
  return !!(
    formData.offerName?.trim() &&
    formData.description?.trim() &&
    formData.startDate?.trim() &&
    formData.termsConditions?.trim() &&
    formData.offerType?.trim()
  );
};

const validateRedemptionStep = (formData: any): boolean => {
  // Required: At least one redemption type selected
  const hasRedemptionType =
    formData.redemptionTypes && formData.redemptionTypes.length > 0;

  if (!hasRedemptionType) return false;

  // Required: Usage limit per customer
  const hasUsageLimit = formData.usageLimitPerCustomer?.trim();
  if (!hasUsageLimit) return false;

  // Required: Location scope
  const hasLocationScope = formData.locationScope?.trim();
  if (!hasLocationScope) return false;

  // If specific locations selected, must have at least one location
  if (
    formData.locationScope === "specific" &&
    (!formData.location_ids || formData.location_ids.length === 0)
  ) {
    return false;
  }

  // If mobile or online_print, require promo code setup
  if (
    formData.redemptionTypes.includes("mobile") ||
    formData.redemptionTypes.includes("online_print")
  ) {
    if (!formData.promoCodeType) return false;
    if (formData.promoCodeType === "single" && !formData.promoCode?.trim())
      return false;
  }

  // If external_url, require URL
  if (
    formData.redemptionTypes.includes("external_url") &&
    !formData.externalUrl?.trim()
  ) {
    return false;
  }

  return true;
};

export default function OfferManagerViewV1({
  onCreatingChange,
}: OfferManagerViewV1Props = {}) {
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);
  const [currentStep, setCurrentStep] = useState<"details" | "redemption">(
    "details"
  );
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [stepValidation, setStepValidation] = useState<{
    details: boolean;
    redemption: boolean;
  }>({
    details: false,
    redemption: false,
  });

  // Publish modal state
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // V1 Form data - simplified from PRD spec
  const [formData, setFormData] = useState({
    // Offer Details
    offerSource: "", // Required - Source of offer (MCM, FMTC, etc.)
    offerName: "", // Required - also used as shortText
    shortText: "", // Listing view (backward compat)
    description: "", // Required - also used as longText
    longText: "", // Detail view (backward compat)
    startDate: "", // Required
    endDate: "", // Optional
    maxDiscount: "0", // Optional - default to 0 per feedback
    termsConditions: "", // Required
    discountValue: "0", // Optional - default to 0 per feedback
    exclusions: "", // Optional

    // Classification
    offerType: "", // Required - BOGO, % Off, Free
    cuisineType: "", // For search
    keywords: [] as string[], // For search - array of keyword tags
    firstCategory: "", // Editable list
    secondCategory: "", // Editable list
    category_ids: [], // Category IDs
    commodity_ids: [], // Commodity IDs

    // Redemption Method
    redemptionTypes: [] as string[], // Required - Mobile, Online Print, External URL (array)
    promoCodeType: "single", // Static or unique
    promoCode: "", // Single code or uploaded codes
    barcodeFile: null, // Optional
    barcodePreview: null, // Optional
    qrCodeFile: null, // Optional
    qrCodePreview: null, // Optional
    externalUrl: "", // For External URL redemption

    // Usage limits
    usageLimitPerCustomer: "1", // Required
    totalUsageLimit: "", // Optional
    locationScope: "all", // Required
    location_ids: [], // Required if locationScope === "specific"
  });

  // Initialize CopilotKit AI content generation
  useOfferContentAI({
    merchantName: formData.merchant?.label || formData.merchant,
    offerTitle: formData.offerName,
    offerType: formData.offerType,
    description: formData.description,
  });

  // Track validation state whenever formData changes
  useEffect(() => {
    setStepValidation({
      details: validateDetailsStep(formData),
      redemption: validateRedemptionStep(formData),
    });
  }, [formData]);

  const handleStartCreation = () => {
    setIsCreatingOffer(true);
    setCurrentStep("details");
    onCreatingChange?.(true);
  };

  const handleBackToDashboard = () => {
    setIsCreatingOffer(false);
    setCurrentStep("details");
    setCompletedSteps([]);
    onCreatingChange?.(false);
  };

  const handleFormUpdate = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Check if current step is valid before proceeding
    if (currentStep === "details" && !stepValidation.details) {
      return; // Block navigation
    }
    if (currentStep === "redemption" && !stepValidation.redemption) {
      return; // Block navigation
    }

    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    // Navigate to next step (only details -> redemption now)
    if (currentStep === "details") {
      setCurrentStep("redemption");
    }
  };

  const handlePrevious = () => {
    if (currentStep === "redemption") {
      setCurrentStep("details");
    }
  };

  // Handle stepper click - prevent skipping ahead
  const handleStepperClick = (stepNumber: number) => {
    const targetStepId = stepConfig.find((s) => s.number === stepNumber)?.id;
    if (!targetStepId) return;

    // Allow clicking on current or previous steps
    const currentStepNum =
      stepConfig.find((s) => s.id === currentStep)?.number || 1;

    if (stepNumber > currentStepNum) {
      // Trying to skip ahead - check if all prior steps are completed
      const canNavigate =
        (stepNumber === 2 && completedSteps.includes("details")) ||
        (stepNumber === 3 &&
          completedSteps.includes("details") &&
          completedSteps.includes("redemption"));

      if (!canNavigate) {
        // Show tooltip/message (handled by disabled state)
        return;
      }
    }

    // Allow navigation
    setCurrentStep(targetStepId as any);
  };

  // Open publish confirmation modal
  const handleSubmit = () => {
    setShowPublishModal(true);
  };

  // Actual publish handler with API call
  const handleConfirmPublish = async () => {
    setIsPublishing(true);
    setPublishError(null);

    try {
      console.log("Publishing offer:", formData);

      // TODO: Replace with actual API call
      // const response = await fetch("/api/offers", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      //
      // if (!response.ok) {
      //   throw new Error("Failed to publish offer");
      // }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success!
      setPublishSuccess(true);
      setIsPublishing(false);

      // Close modal and return to dashboard after short delay
      setTimeout(() => {
        setShowPublishModal(false);
        handleBackToDashboard();
      }, 1500);
    } catch (error) {
      setIsPublishing(false);
      setPublishError(
        error instanceof Error
          ? error.message
          : "Failed to publish offer. Please try again."
      );
    }
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
  ];

  const currentStepNumber =
    stepConfig.find((s) => s.id === currentStep)?.number || 1;

  if (!isCreatingOffer) {
    return <OfferManagerDashboardV1 onCreateOffer={handleStartCreation} />;
  }

  return (
    <div className="overflow-hidden" style={{ height: "calc(100vh - 140px)" }}>
      <div className="h-full flex gap-3">
        {/* Vertical Stepper + Main Content - Combined */}
        <div className="flex-1 flex">
          {/* Vertical Stepper */}
          <div className="w-20 flex-shrink-0 bg-white border-l border-t border-b border-gray-200 shadow-sm rounded-l-lg">
            <div className="py-6 px-3">
              <Stepper
                orientation="vertical"
                value={currentStepNumber}
                onValueChange={handleStepperClick}
                className="gap-4"
              >
                {stepConfig.map((step) => {
                  const isCompleted = completedSteps.includes(step.id);
                  const isCurrent = step.id === currentStep;
                  const isLocked =
                    step.number > currentStepNumber &&
                    !completedSteps.includes(
                      stepConfig[step.number - 2]?.id || ""
                    );

                  return (
                    <StepperItem
                      key={step.id}
                      step={step.number}
                      completed={isCompleted}
                      disabled={isLocked}
                    >
                      <StepperTrigger
                        className="flex flex-col items-center gap-2 w-full"
                        aria-current={isCurrent ? "step" : undefined}
                        aria-disabled={isLocked}
                        title={
                          isLocked
                            ? "Complete previous steps to continue"
                            : undefined
                        }
                      >
                        <StepperIndicator />
                        <StepperTitle className="text-xs text-center">
                          {step.label}
                        </StepperTitle>
                      </StepperTrigger>
                      {step.number < stepConfig.length && <StepperSeparator />}
                    </StepperItem>
                  );
                })}
              </Stepper>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="h-full">
              <div className="w-full h-full flex flex-col">
                <Card className="p-0 flex flex-col h-full overflow-hidden shadow-md rounded-l-none border-l-0">
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
                          {currentStep === "details" &&
                            "Enter offer information"}
                          {currentStep === "redemption" &&
                            "Configure redemption"}
                          {currentStep === "review" &&
                            "Review and publish offer"}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {currentStep !== "details" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handlePrevious}
                          className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                        >
                          <ArrowLeftIcon className="h-4 w-4" />
                          Back
                        </Button>
                      )}
                      {currentStep === "redemption" ? (
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
                          disabled={
                            (currentStep === "details" &&
                              !stepValidation.details) ||
                            (currentStep === "redemption" &&
                              !stepValidation.redemption)
                          }
                          title={
                            currentStep === "details" && !stepValidation.details
                              ? "Complete all required fields to continue"
                              : currentStep === "redemption" &&
                                  !stepValidation.redemption
                                ? "Complete all required fields to continue"
                                : undefined
                          }
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
                        />
                      )}

                      {currentStep === "redemption" && (
                        <RedemptionMethodStepV1
                          formData={formData}
                          onUpdate={handleFormUpdate}
                          onNext={handleNext}
                          onPrevious={handlePrevious}
                        />
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Review Preview Panel - Right Column */}
        <div className="w-[400px] flex-shrink-0">
          <Card className="h-full overflow-hidden shadow-md rounded-r-lg">
            <ReviewPreviewPanel formData={formData} currentStep={currentStep} />
          </Card>
        </div>
      </div>

      {/* Publish Confirmation Modal */}
      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {publishSuccess ? (
                <>
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  Offer Published Successfully!
                </>
              ) : publishError ? (
                <>
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  Publishing Failed
                </>
              ) : (
                <>
                  <GiftIcon className="h-6 w-6 text-blue-600" />
                  Publish Offer
                </>
              )}
            </DialogTitle>
            <DialogDescription className="pt-4">
              {publishSuccess ? (
                <div className="space-y-2">
                  <p className="text-green-700">
                    Your offer has been published and is now live!
                  </p>
                  <p className="text-sm text-gray-600">
                    Redirecting to dashboard...
                  </p>
                </div>
              ) : publishError ? (
                <div className="space-y-2">
                  <p className="text-red-700">{publishError}</p>
                  <p className="text-sm text-gray-600">
                    Please try again or contact support if the problem persists.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p>
                    You are about to publish{" "}
                    <strong>{formData.offerName || "this offer"}</strong>.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-sm text-blue-900">
                      <strong>What happens next:</strong>
                    </p>
                    <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
                      <li>Offer will be published immediately</li>
                      <li>
                        Users can start redeeming based on the redemption
                        methods you set
                      </li>
                      <li>
                        You can edit or deactivate the offer later from the
                        dashboard
                      </li>
                    </ul>
                  </div>
                  <p className="text-sm text-gray-600">
                    Are you sure you want to continue?
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            {publishSuccess ? null : publishError ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPublishModal(false);
                    setPublishError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmPublish}
                  disabled={isPublishing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isPublishing ? "Retrying..." : "Try Again"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowPublishModal(false)}
                  disabled={isPublishing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmPublish}
                  disabled={isPublishing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isPublishing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Confirm & Publish
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
