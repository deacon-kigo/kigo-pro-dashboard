"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
import {
  saveDraft,
  loadDraft,
  deleteDraft,
  generateDraftId,
  createSnapshot,
  hasChanges,
} from "./draftUtils";
import { UnsavedChangesDialog } from "./UnsavedChangesDialog";
import { MerchantData } from "./MerchantHybridSearch";
import {
  OfferTypeKey,
  SMART_DEFAULTS,
  getDefaultDates,
  getTermsTemplate,
  getOfferCategoriesForMerchant,
  getCommoditiesForMerchant,
  getSmartHeadline,
  getSmartDescription,
} from "@/lib/constants/offer-templates";

// Reverse mapping: backend API offer types → frontend wizard keys
// Explicit mapping since multiple wizard types can share one backend type
const API_TO_WIZARD_OFFER_TYPE: Record<string, OfferTypeKey> = {
  dollars_off: "dollar_off",
  percentage_savings: "percent_off",
  bogo: "bogo",
  price_point: "fixed_price",
  cashback: "cashback",
  // Backend-only types that don't have exact wizard matches — map to closest
  free_with_purchase: "bogo",
  clickthrough: "dollar_off",
  loyalty_points: "cashback",
  spend_and_get: "dollar_off",
};

/**
 * P1.1 Offer Manager - Enhanced Wizard Flow
 *
 * Supports all 7 offer types with type-specific fields:
 * - Dollar Off, Percent Off, BOGO, Fixed Price (inherited from P0.5)
 * - Dollar Off with Minimum (threshold + discount)
 * - Cash Back (percentage + optional cap)
 * - Tiered Discount (spend-more-save-more tiers)
 *
 * 4-step wizard: Type → Merchant → Offer Content → Review
 * Includes live preview panel, edit/clone modes, and smart auto-fill.
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

interface WizardProps {
  mode?: "create" | "edit" | "clone";
}

export default function OfferManagerViewP1Wizard({
  mode = "create",
}: WizardProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<WizardStep>("type");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedStep, setDisplayedStep] = useState<WizardStep>("type");

  // Draft save state
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isDraftMode, setIsDraftMode] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [draftSaveIndicator, setDraftSaveIndicator] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const snapshotRef = useRef<string | null>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      minimumSpend: "",
      cashbackCap: "",
      tiers: [{ minSpend: "", discount: "" }],
      externalUrl: "",
      promoCode: "",
      termsConditions: "",
      category_ids: [],
      commodity_ids: [],
      // Image upload - Offer Image (defaults to merchant logo)
      offerImageFile: null as File | null,
      offerImagePreview: "",
      offerImageAlt: "",
      offerImageSource: "none" as "none" | "merchant" | "custom",
      offerImageDimensions: null as { width: number; height: number } | null,
      // Image upload - Offer Banner (defaults to merchant banner)
      offerBannerFile: null as File | null,
      offerBannerPreview: "",
      offerBannerAlt: "",
      offerBannerSource: "none" as "none" | "merchant" | "custom",
      offerBannerDimensions: null as { width: number; height: number } | null,
    };
  });

  // Load initial offer data for edit/clone modes (with draft resume support)
  useEffect(() => {
    if (mode === "create") return;

    try {
      const stored = localStorage.getItem("editOffer");
      if (!stored) return;

      const offer = JSON.parse(stored);
      localStorage.removeItem("editOffer");

      // Check for an existing draft for this offer
      if (mode === "edit" && offer.id) {
        const draft = loadDraft(offer.id);
        if (draft && offer.offerStatus === "draft") {
          // Resume from saved draft — restore formData, step, and completedSteps
          setFormData((prev: any) => ({
            ...prev,
            ...draft.formData,
            _editOfferId: offer.id,
          }));
          setCurrentStep(draft.currentStep as WizardStep);
          setDisplayedStep(draft.currentStep as WizardStep);
          setCompletedSteps(draft.completedSteps);
          setDraftId(offer.id);
          setIsDraftMode(true);
          // Take initial snapshot so auto-save knows the baseline
          snapshotRef.current = createSnapshot(draft.formData);
          return; // Skip normal edit flow
        }
      }

      // Map OfferListItem fields to wizard formData
      const offerName =
        mode === "clone" ? `${offer.offerName} (Copy)` : offer.offerName;

      // Convert backend offer type to wizard type key
      const rawType = offer.offerType || null;
      const wizardType = rawType
        ? API_TO_WIZARD_OFFER_TYPE[rawType] || rawType
        : null;

      setFormData((prev: any) => ({
        ...prev,
        offerType: wizardType,
        offerName,
        shortText: offerName,
        description: offer.description || "",
        longText: offer.description || "",
        discountValue: offer.estimatedSavings || "10",
        externalUrl: offer.externalUrl || "",
        promoCode: offer.promoCode || "",
        termsConditions: offer.termsAndConditions || "",
        endDate: offer.endDate || prev.endDate,
        // Store merchant info for display
        merchant: offer.merchantId || "",
        merchantData: {
          id: offer.merchantId,
          dbaName: offer.merchantName,
          source: "existing" as const,
        },
        // Store original ID for edit mode
        _editOfferId: mode === "edit" ? offer.id : undefined,
      }));

      // Track draftId for edit mode so we can save/clean drafts
      if (mode === "edit" && offer.id) {
        setDraftId(offer.id);
      }

      // Mark all steps as completed and go to review
      setCompletedSteps(["type", "merchant", "offer"]);
      setCurrentStep("review");
      setDisplayedStep("review");
    } catch {
      // Silently fail if localStorage data is invalid
    }
  }, [mode]);

  // Take initial snapshot when formData first has a meaningful offerType
  useEffect(() => {
    if (formData.offerType && !snapshotRef.current) {
      snapshotRef.current = createSnapshot(formData);
    }
  }, [formData.offerType]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save draft every 30s when there are unsaved changes
  useEffect(() => {
    // Don't auto-save on step 1 or before an offer type is selected
    if (currentStep === "type" || !formData.offerType) return;

    // Clear any existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      if (!hasChanges(formData, snapshotRef.current)) return;

      const id = draftId || generateDraftId();
      if (!draftId) setDraftId(id);

      setDraftSaveIndicator("saving");
      saveDraft(id, formData, currentStep, completedSteps);
      snapshotRef.current = createSnapshot(formData);

      // Flash "saved" for 2 seconds
      setDraftSaveIndicator("saved");
      setTimeout(() => setDraftSaveIndicator("idle"), 2000);
    }, 30_000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formData, currentStep, completedSteps, draftId]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentStepConfig = STEP_CONFIG.find((s) => s.id === currentStep);
  const currentStepNumber = currentStepConfig?.number || 1;

  // Handle form field updates
  const handleUpdate = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));

    // Auto-fill when merchant is selected
    if (field === "merchantData" && value) {
      const merchantData = value as MerchantData;
      const categories = merchantData.categories || [];
      const category = categories[0] || merchantData.category;

      // Auto-fill terms from merchant category
      if (category && !formData.termsConditions) {
        const terms = getTermsTemplate(category);
        setFormData((prev: any) => ({ ...prev, termsConditions: terms }));
      }

      // Auto-fill categories from merchant categories (if not already set)
      if (
        categories.length > 0 &&
        (!formData.category_ids || formData.category_ids.length === 0)
      ) {
        const suggestedCategories = getOfferCategoriesForMerchant(categories);
        setFormData((prev: any) => ({
          ...prev,
          category_ids: suggestedCategories,
          categoriesAutoFilled: true, // Track that this was auto-filled
        }));
      }

      // Auto-fill commodities from merchant categories (if not already set)
      if (
        categories.length > 0 &&
        (!formData.commodity_ids || formData.commodity_ids.length === 0)
      ) {
        const suggestedCommodities = getCommoditiesForMerchant(categories);
        setFormData((prev: any) => ({
          ...prev,
          commodity_ids: suggestedCommodities,
          commoditiesAutoFilled: true, // Track that this was auto-filled
        }));
      }

      // Auto-generate smart headline if not already set
      if (!formData.offerName && formData.offerType) {
        const smartHeadline = getSmartHeadline(
          formData.offerType,
          merchantData.dbaName
        );
        if (smartHeadline) {
          setFormData((prev: any) => ({
            ...prev,
            offerName: smartHeadline,
            shortText: smartHeadline,
            headlineAutoFilled: true,
          }));
        }
      }

      // Auto-generate smart description if not already set
      if (!formData.description && formData.offerType && category) {
        const smartDescription = getSmartDescription(
          formData.offerType,
          category
        );
        if (smartDescription) {
          setFormData((prev: any) => ({
            ...prev,
            description: smartDescription,
            longText: smartDescription,
            descriptionAutoFilled: true,
          }));
        }
      }

      // Auto-populate Offer Image from merchant logo (if no custom upload)
      if (merchantData.logoPreview && formData.offerImageSource !== "custom") {
        setFormData((prev: any) => ({
          ...prev,
          offerImagePreview: merchantData.logoPreview,
          offerImageSource: "merchant",
          offerImageFile: null, // No file since it's from merchant
        }));
      }

      // Auto-populate Offer Banner from merchant banner (if no custom upload)
      if (
        merchantData.bannerPreview &&
        formData.offerBannerSource !== "custom"
      ) {
        setFormData((prev: any) => ({
          ...prev,
          offerBannerPreview: merchantData.bannerPreview,
          offerBannerSource: "merchant",
          offerBannerFile: null, // No file since it's from merchant
        }));
      }
    }
  };

  // Handle offer type selection
  const handleOfferTypeSelect = (type: OfferTypeKey) => {
    handleUpdate("offerType", type);
    handleUpdate("offerTypeInternal", "clk");

    // If merchant is already selected, generate smart defaults
    if (formData.merchantData) {
      const merchantName = formData.merchantData.dbaName;
      const category =
        formData.merchantData.categories?.[0] || formData.merchantData.category;

      // Auto-generate smart headline if not already set by user
      if (!formData.offerName || formData.headlineAutoFilled) {
        const smartHeadline = getSmartHeadline(type, merchantName);
        if (smartHeadline) {
          setFormData((prev: any) => ({
            ...prev,
            offerName: smartHeadline,
            shortText: smartHeadline,
            headlineAutoFilled: true,
          }));
        }
      }

      // Auto-generate smart description if not already set by user
      if (!formData.description || formData.descriptionAutoFilled) {
        const smartDescription = getSmartDescription(type, category);
        if (smartDescription) {
          setFormData((prev: any) => ({
            ...prev,
            description: smartDescription,
            longText: smartDescription,
            descriptionAutoFilled: true,
          }));
        }
      }
    }
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
      case "offer": {
        const baseValid =
          formData.offerName?.trim() &&
          formData.description?.trim() &&
          formData.startDate &&
          formData.externalUrl?.trim() &&
          formData.promoCode?.trim();

        if (!baseValid) return false;

        // Type-specific validation
        if (formData.offerType === "tiered_discount") {
          const tiers = formData.tiers || [];
          return (
            tiers.length >= 1 &&
            tiers.some(
              (t: { minSpend: string; discount: string }) =>
                parseFloat(t.minSpend) > 0 && parseFloat(t.discount) > 0
            )
          );
        }
        if (formData.offerType === "dollar_off_with_min") {
          return !!(
            formData.discountValue &&
            formData.minimumSpend &&
            parseFloat(formData.minimumSpend) >
              parseFloat(formData.discountValue)
          );
        }
        // All other types just need discountValue
        return !!formData.discountValue;
      }
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
      // In edit mode, keep all steps accessible (don't remove from completed)
      if (mode !== "edit") {
        const stepsToRemove = STEP_CONFIG.slice(currentIndex).map((s) => s.id);
        setCompletedSteps((prev) =>
          prev.filter((stepId) => !stepsToRemove.includes(stepId))
        );
      }
      transitionToStep(previousStep);
    }
  };

  const handleStepClick = (stepId: string) => {
    if (isTransitioning) return;

    // In edit mode, all steps are always accessible
    if (mode === "edit") {
      transitionToStep(stepId as WizardStep);
      return;
    }

    // In create mode, only allow completed steps or current step
    if (completedSteps.includes(stepId) || stepId === currentStep) {
      transitionToStep(stepId as WizardStep);
    }
  };

  const handleSaveDraft = () => {
    setIsSavingDraft(true);
    const id = draftId || generateDraftId();
    if (!draftId) setDraftId(id);

    saveDraft(id, formData, currentStep, completedSteps);
    snapshotRef.current = createSnapshot(formData);

    toast({
      title: "Draft Saved",
      description: `"${formData.offerName || "Untitled offer"}" saved as draft.`,
    });

    setIsSavingDraft(false);

    // Navigate back to offer list after a brief delay
    setTimeout(() => {
      router.push("/offer-manager?version=p1.1");
    }, 500);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // TODO: Replace with actual API call
      console.log(
        mode === "edit"
          ? "Saving offer:"
          : mode === "clone"
            ? "Cloning offer:"
            : "Publishing offer:",
        formData
      );

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const titles: Record<string, string> = {
        create: "Offer Published!",
        edit: "Offer Updated!",
        clone: "Offer Cloned!",
      };
      const descriptions: Record<string, string> = {
        create: `"${formData.offerName}" is now live in the marketplace.`,
        edit: `"${formData.offerName}" has been updated successfully.`,
        clone: `"${formData.offerName}" has been created as a new draft.`,
      };

      toast({
        title: titles[mode],
        description: descriptions[mode],
        variant: "success",
      });

      // Clean up draft from localStorage on successful publish
      if (draftId) {
        deleteDraft(draftId);
      }

      // Navigate back to P1.1 list
      setTimeout(() => {
        router.push("/offer-manager?version=p1.1");
      }, 1000);
    } catch (error) {
      console.error("Failed to save offer:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCancel = () => {
    // On step 2+ with unsaved changes, show confirmation dialog
    if (
      currentStep !== "type" &&
      formData.offerType &&
      hasChanges(formData, snapshotRef.current)
    ) {
      setShowUnsavedDialog(true);
      return;
    }
    router.push("/offer-manager?version=p1.1");
  };

  // Unsaved changes dialog handlers
  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false);
    router.push("/offer-manager?version=p1.1");
  };

  const handleSaveDraftAndLeave = () => {
    setShowUnsavedDialog(false);
    handleSaveDraft();
  };

  const handleCancelDialog = () => {
    setShowUnsavedDialog(false);
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
                      {(isDraftMode || draftId) && currentStep !== "type" && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs transition-colors duration-300",
                            draftSaveIndicator === "saving"
                              ? "border-amber-400 text-amber-600 bg-amber-50"
                              : draftSaveIndicator === "saved"
                                ? "border-green-400 text-green-600 bg-green-50"
                                : "border-orange-400 text-orange-600 bg-orange-50"
                          )}
                        >
                          {draftSaveIndicator === "saving"
                            ? "Saving..."
                            : draftSaveIndicator === "saved"
                              ? "Draft saved"
                              : "Draft"}
                        </Badge>
                      )}
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
                      Back to Offers
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

                  {currentStep !== "type" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveDraft}
                      disabled={isSavingDraft || isTransitioning}
                      className="border-dashed"
                    >
                      {isSavingDraft ? "Saving..." : "Save as Draft"}
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
                      {isPublishing
                        ? mode === "edit"
                          ? "Saving..."
                          : mode === "clone"
                            ? "Cloning..."
                            : "Publishing..."
                        : mode === "edit"
                          ? "Save Changes"
                          : mode === "clone"
                            ? "Clone as Draft"
                            : "Publish Offer"}
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

      {/* Unsaved changes confirmation */}
      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onClose={handleCancelDialog}
        onSaveDraft={handleSaveDraftAndLeave}
        onDiscard={handleDiscardChanges}
        isSaving={isSavingDraft}
      />
    </div>
  );
}

export { OfferManagerViewP1Wizard };
