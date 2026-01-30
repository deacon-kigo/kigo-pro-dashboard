"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/lib/hooks/use-toast";
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperSeparator,
} from "@/components/ui/stepper";
import {
  GiftIcon,
  BuildingStorefrontIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import {
  StepOfferType,
  StepMerchant,
  StepOfferContent,
  StepReview,
} from "./wizard";
import { OfferPreviewPanel } from "../OfferPreviewPanel";
import { MerchantData } from "./MerchantHybridSearch";
import {
  OfferTypeKey,
  SMART_DEFAULTS,
  getDefaultDates,
  getTermsTemplate,
} from "@/lib/constants/offer-templates";

/**
 * P0.5 Offer Manager - Streamlined Wizard Flow
 *
 * Intuitive 4-step offer creation:
 * 1. Select offer type (template starter)
 * 2. Select/create merchant
 * 3. Offer content (details + image + dates + redemption)
 * 4. Review & publish
 *
 * Includes live preview panel on the right.
 */

type WizardStep = "type" | "merchant" | "offer" | "review";

const STEP_CONFIG = [
  {
    id: "type",
    number: 1,
    label: "Type",
    icon: GiftIcon,
    title: "Choose Offer Type",
    description: "Select the type of discount you want to offer",
  },
  {
    id: "merchant",
    number: 2,
    label: "Business",
    icon: BuildingStorefrontIcon,
    title: "Select Merchant",
    description: "Search for an existing merchant or create a new one",
  },
  {
    id: "offer",
    number: 3,
    label: "Offer",
    icon: DocumentTextIcon,
    title: "Offer Details",
    description: "Add your offer content, image, and redemption info",
  },
  {
    id: "review",
    number: 4,
    label: "Review",
    icon: CheckCircleIcon,
    title: "Review & Publish",
    description: "Review all details before publishing",
  },
];

export default function OfferManagerViewP0_5Wizard() {
  const router = useRouter();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<WizardStep>("type");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedStep, setDisplayedStep] = useState<WizardStep>("type");

  // Handle step transitions with dissolve effect
  const transitionToStep = useCallback(
    (newStep: WizardStep) => {
      if (newStep === currentStep) return;

      setIsTransitioning(true);

      // After fade out, change the step
      setTimeout(() => {
        setDisplayedStep(newStep);
        setCurrentStep(newStep);

        // After a brief moment, fade back in
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 150);
    },
    [currentStep]
  );

  // Form data
  const [formData, setFormData] = useState<any>(() => {
    const dates = getDefaultDates();
    return {
      // Smart defaults
      ...SMART_DEFAULTS,
      startDate: dates.startDate,
      endDate: dates.endDate,
      // User-entered data
      offerType: null as OfferTypeKey | null,
      merchantData: null as MerchantData | null,
      merchant: "",
      offerName: "",
      shortText: "",
      description: "",
      longText: "",
      discountValue: "",
      externalUrl: "",
      promoCode: "",
      termsConditions: "",
      category_ids: [],
      commodity_ids: [],
      // Image upload
      offerImageFile: null as File | null,
      offerImagePreview: "",
      offerImageAlt: "",
    };
  });

  const currentStepConfig = STEP_CONFIG.find((s) => s.id === currentStep);
  const currentStepNumber = currentStepConfig?.number || 1;

  // Handle form field updates
  const handleUpdate = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));

    // Auto-fill terms when merchant is selected
    if (field === "merchantData" && value) {
      const merchantData = value as MerchantData;
      const category = merchantData.categories?.[0] || merchantData.category;
      if (category && !formData.termsConditions) {
        const terms = getTermsTemplate(category);
        setFormData((prev: any) => ({ ...prev, termsConditions: terms }));
      }
    }
  };

  // Handle offer type selection
  const handleOfferTypeSelect = (type: OfferTypeKey) => {
    handleUpdate("offerType", type);
    handleUpdate("offerTypeInternal", "clk");
  };

  // Handle merchant selection
  const handleMerchantSelect = (merchant: MerchantData) => {
    handleUpdate("merchantData", merchant);
    if (merchant.source === "existing" && merchant.id) {
      handleUpdate("merchant", merchant.id);
    } else {
      handleUpdate("merchant", "");
    }
  };

  // Navigation validation
  const canProceed = (): boolean => {
    switch (currentStep) {
      case "type":
        return !!formData.offerType;
      case "merchant":
        return !!(formData.merchant || formData.merchantData);
      case "offer":
        return !!(
          formData.discountValue &&
          formData.offerName?.trim() &&
          formData.description?.trim() &&
          formData.startDate &&
          formData.externalUrl?.trim() &&
          formData.promoCode?.trim()
        );
      case "review":
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceed() || isTransitioning) return;

    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    // Navigate to next step with transition
    const currentIndex = STEP_CONFIG.findIndex((s) => s.id === currentStep);
    if (currentIndex < STEP_CONFIG.length - 1) {
      transitionToStep(STEP_CONFIG[currentIndex + 1].id as WizardStep);
    }
  };

  const handlePrevious = () => {
    if (isTransitioning) return;

    const currentIndex = STEP_CONFIG.findIndex((s) => s.id === currentStep);
    if (currentIndex > 0) {
      const previousStep = STEP_CONFIG[currentIndex - 1].id as WizardStep;
      // Remove current and future steps from completed when going back
      const stepsToRemove = STEP_CONFIG.slice(currentIndex).map((s) => s.id);
      setCompletedSteps((prev) =>
        prev.filter((stepId) => !stepsToRemove.includes(stepId))
      );
      transitionToStep(previousStep);
    }
  };

  const handleStepClick = (stepId: string) => {
    if (isTransitioning) return;

    // Only allow navigation to completed steps or current step
    if (completedSteps.includes(stepId) || stepId === currentStep) {
      transitionToStep(stepId as WizardStep);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // TODO: Replace with actual API call
      console.log("Publishing offer:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Offer Published!",
        description: `"${formData.offerName}" is now live in the marketplace.`,
        variant: "success",
      });

      // Navigate back to list
      setTimeout(() => {
        router.push("/offer-manager?success=created");
      }, 1000);
    } catch (error) {
      console.error("Failed to publish offer:", error);
      toast({
        title: "Publication Failed",
        description: "Failed to publish offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCancel = () => {
    router.push("/offer-manager");
  };

  // Render current step content (use displayedStep for smooth transitions)
  const renderStepContent = () => {
    switch (displayedStep) {
      case "type":
        return (
          <StepOfferType
            selectedType={formData.offerType}
            onSelect={handleOfferTypeSelect}
          />
        );
      case "merchant":
        return (
          <StepMerchant
            selectedMerchant={formData.merchantData}
            onSelect={handleMerchantSelect}
            onClear={() => {
              handleUpdate("merchantData", null);
              handleUpdate("merchant", "");
            }}
          />
        );
      case "offer":
        return (
          <StepOfferContent
            offerType={formData.offerType || "dollar_off"}
            formData={formData}
            onUpdate={handleUpdate}
          />
        );
      case "review":
        return <StepReview formData={formData} onUpdate={handleUpdate} />;
      default:
        return null;
    }
  };

  // Get step icon component
  const StepIcon = currentStepConfig?.icon || GiftIcon;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex min-h-0">
        {/* Vertical Stepper */}
        <div className="w-20 flex-shrink-0">
          <div className="h-full bg-white rounded-l-lg border border-r-0 border-gray-200 shadow-sm py-6 px-3">
            <Stepper
              orientation="vertical"
              value={currentStepNumber}
              onValueChange={(step) => {
                const stepConfig = STEP_CONFIG.find((s) => s.number === step);
                if (stepConfig) handleStepClick(stepConfig.id);
              }}
              className="gap-4"
            >
              {STEP_CONFIG.map((step) => (
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
                  {step.number < STEP_CONFIG.length && <StepperSeparator />}
                </StepperItem>
              ))}
            </Stepper>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex min-w-0">
          {/* Wizard Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            <Card className="h-full flex flex-col overflow-hidden shadow-md rounded-none border-y border-r-0">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
                <div className="flex items-center">
                  <StepIcon className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">
                        {currentStepConfig?.title}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        Step {currentStepNumber} of {STEP_CONFIG.length}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentStepConfig?.description}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {currentStep === "type" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                      Back to Dashboard
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevious}
                      disabled={isTransitioning}
                    >
                      ← Back
                    </Button>
                  )}

                  {currentStep === "review" ? (
                    <Button
                      onClick={handlePublish}
                      disabled={isPublishing || isTransitioning}
                      className="flex items-center gap-1"
                      size="sm"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      {isPublishing ? "Publishing..." : "Publish Offer"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      disabled={!canProceed() || isTransitioning}
                      size="sm"
                    >
                      Next Step →
                    </Button>
                  )}
                </div>
              </div>

              {/* Step Content - scrollable with dissolve transition */}
              <div
                className={cn(
                  "flex-1 overflow-auto p-6 transition-opacity duration-150 ease-in-out",
                  isTransitioning ? "opacity-0" : "opacity-100"
                )}
              >
                {renderStepContent()}
              </div>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="w-[420px] flex-shrink-0">
            <Card className="h-full overflow-hidden shadow-md rounded-l-none">
              <OfferPreviewPanel formData={formData} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export { OfferManagerViewP0_5Wizard };
