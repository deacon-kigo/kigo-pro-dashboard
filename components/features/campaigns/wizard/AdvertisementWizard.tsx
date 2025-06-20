"use client";

import React, { useEffect, useCallback, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { RootState } from "@/lib/redux/store";
import { AIAssistantPanel } from "@/components/features/ai";
import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button";
import {
  CAMPAIGN_STEPS,
  setCurrentStep,
  setStepValidation,
  resetCampaign,
  updateBasicInfo,
  updateTargeting,
  updateBudget,
  updateDistribution,
  addLocation,
  removeLocation,
  setStartDate,
  setEndDate,
  addAd,
  updateAd,
  removeAd,
  addMediaToAd,
  removeMediaFromAd,
} from "@/lib/redux/slices/campaignSlice";
import StepProgressHeader from "./StepProgressHeader";
import StepNavigationFooter from "./StepNavigationFooter";
import { setCampaignContext } from "@/lib/redux/slices/ai-assistantSlice";
import { CampaignAnalyticsPanelLite } from "../CampaignAnalyticsPanelLite";
import PageHeader from "@/components/molecules/PageHeader/PageHeader";
import { v4 as uuidv4 } from "uuid";

// Import step components
import BasicInfoStep from "./steps/BasicInfoStep";
import AdCreationStep from "./steps/AdCreationStep";
import TargetingBudgetStep from "./steps/TargetingBudgetStep";
import DistributionStep from "./steps/DistributionStep";
import ReviewStep from "./steps/ReviewStep";

const AdvertisementWizard: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get campaign state from Redux
  const { currentStep, formData, stepValidation, isGenerating } = useSelector(
    (state: RootState) => state.campaign
  );

  // State to track current ad data for live preview
  const [currentAdData, setCurrentAdData] = useState<any>(null);

  // Refs to access asset management functions from AdCreationStep
  const assetUploadRef = useRef<
    ((mediaType: string, file: File) => void) | null
  >(null);
  const assetRemoveRef = useRef<
    ((mediaType: string, assetId: string) => void) | null
  >(null);

  // Reset campaign form on initial load
  useEffect(() => {
    dispatch(resetCampaign());
  }, [dispatch]);

  // Update AI context when form data changes
  useEffect(() => {
    dispatch(setCampaignContext(formData));
  }, [dispatch, formData]);

  // Handle current ad data change from AdCreationStep
  const handleCurrentAdChange = useCallback((adData: any) => {
    setCurrentAdData(adData);
  }, []);

  // Asset management callbacks for the preview modal
  const handleAssetUploadForCurrentAd = useCallback(
    (mediaType: string, file: File) => {
      if (assetUploadRef.current) {
        assetUploadRef.current(mediaType, file);
      }
    },
    []
  );

  const handleAssetRemoveForCurrentAd = useCallback(
    (mediaType: string, assetId: string) => {
      if (assetRemoveRef.current) {
        assetRemoveRef.current(mediaType, assetId);
      } else {
        console.warn("Asset remove function not available");
      }
    },
    []
  );

  // Navigation handlers
  const handleStepChange = useCallback(
    (step: number) => {
      dispatch(setCurrentStep(step));
    },
    [dispatch]
  );

  const handleNext = useCallback(() => {
    if (currentStep < CAMPAIGN_STEPS.length - 1) {
      dispatch(setCurrentStep(currentStep + 1));
    } else {
      // This is the final step - handle campaign creation
      console.log("Create advertisement campaign with data:", formData);
      // TODO: Implement actual campaign creation API call
      setTimeout(() => {
        // Simulate success
        alert("Advertisement campaign created successfully!");
        router.push("/campaign-manager");
      }, 1000);
    }
  }, [currentStep, dispatch, formData, router]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      dispatch(setCurrentStep(currentStep - 1));
    }
  }, [currentStep, dispatch]);

  const handleSaveDraft = useCallback(() => {
    // TODO: Implement actual save draft functionality
    console.log("Saving advertisement draft:", formData);
    alert("Advertisement campaign saved as draft");
  }, [formData]);

  // Handle AI assistant suggestions
  const handleOptionSelected = useCallback((optionId: string) => {
    console.log("AI option selected:", optionId);
    // TODO: Implement AI option handling
  }, []);

  // Always enable navigation in presentational mode
  const isNextDisabled = false; // Allow navigation without validation

  // Animation variants
  const contentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  // Handle ad-related actions
  const handleAddAd = useCallback(
    (ad) => {
      dispatch(addAd(ad));
    },
    [dispatch]
  );

  const handleUpdateAd = useCallback(
    (id, data) => {
      dispatch(updateAd({ id, data }));
    },
    [dispatch]
  );

  const handleRemoveAd = useCallback(
    (id) => {
      dispatch(removeAd(id));
    },
    [dispatch]
  );

  const handleAddMediaToAd = useCallback(
    (adId, media) => {
      dispatch(addMediaToAd({ adId, media }));
    },
    [dispatch]
  );

  const handleRemoveMediaFromAd = useCallback(
    (adId, mediaId) => {
      dispatch(removeMediaFromAd({ adId, mediaId }));
    },
    [dispatch]
  );

  // Render the appropriate step content
  const renderStepContent = () => {
    switch (CAMPAIGN_STEPS[currentStep].id) {
      case "basic-info":
        return (
          <BasicInfoStep
            formData={formData.basicInfo}
            updateBasicInfo={(basicInfo) =>
              dispatch(updateBasicInfo(basicInfo))
            }
            setStepValidation={(isValid) =>
              dispatch(setStepValidation({ step: "basic-info", isValid }))
            }
          />
        );
      case "ad-creation":
        return (
          <AdCreationStep
            ads={formData.ads}
            addAd={handleAddAd}
            updateAd={handleUpdateAd}
            removeAd={handleRemoveAd}
            addMediaToAd={handleAddMediaToAd}
            removeMediaFromAd={handleRemoveMediaFromAd}
            setStepValidation={(isValid) =>
              dispatch(setStepValidation({ step: "ad-creation", isValid }))
            }
            onCurrentAdChange={handleCurrentAdChange}
            onAssetUploadRef={assetUploadRef}
            onAssetRemoveRef={assetRemoveRef}
          />
        );
      case "targeting-budget":
        return (
          <TargetingBudgetStep
            targetingData={formData.targeting}
            budgetData={formData.budget}
            updateTargeting={(targeting) =>
              dispatch(updateTargeting(targeting))
            }
            updateBudget={(budget) => dispatch(updateBudget(budget))}
            addLocation={(location) => dispatch(addLocation(location))}
            removeLocation={(id) => dispatch(removeLocation(id))}
            setStepValidation={(isValid) =>
              dispatch(
                setStepValidation({
                  step: "targeting-budget",
                  isValid,
                })
              )
            }
          />
        );
      case "distribution":
        return (
          <DistributionStep
            formData={formData.distribution}
            updateDistribution={(distribution) =>
              dispatch(updateDistribution(distribution))
            }
            setStepValidation={(isValid) =>
              dispatch(
                setStepValidation({
                  step: "distribution",
                  isValid,
                })
              )
            }
            ads={formData.ads}
          />
        );
      case "review":
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  // Create back button
  const backButton = (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => router.push("/campaign-manager")}
      className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 12L6 8L10 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back to Campaign Manager
    </Button>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-shrink-0">
        <PageHeader
          title="Create Advertisement Campaign"
          description="Design and launch your advertisement campaign in a few steps."
          emoji="📊"
          actions={backButton}
          variant="aurora"
        />
      </div>

      <div
        className="overflow-hidden"
        style={{ height: "calc(100vh - 140px)" }}
      >
        <div className="flex gap-3 h-full">
          {/* Left Column - AI Assistant Panel */}
          <div className="w-1/4 h-full flex flex-col">
            <Card className="p-0 h-full flex flex-col overflow-hidden shadow-md">
              <div className="flex-1 flex flex-col overflow-hidden">
                <AIAssistantPanel
                  title="AI Campaign Assistant"
                  description="I'll help you create an effective campaign"
                  onOptionSelected={handleOptionSelected}
                  className="h-full flex-1"
                  initialMessage="Hello! I'm your AI Campaign Assistant. I can help you optimize your campaign for better performance. What would you like help with today?"
                />
              </div>
            </Card>
          </div>

          {/* Middle Column - Campaign Form with Steps */}
          <div className="w-[37.5%] h-full flex flex-col">
            <Card className="p-0 flex flex-col h-full overflow-hidden shadow-md">
              {/* Step indicator header */}
              <StepProgressHeader
                currentStep={currentStep}
                stepValidation={stepValidation}
                onStepClick={handleStepChange}
                className="flex-shrink-0"
              />

              {/* Step content with animation - Make sure it's scrollable */}
              <div className="flex-1 overflow-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={CAMPAIGN_STEPS[currentStep].id}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={contentVariants}
                    transition={{ duration: 0.3 }}
                    className="px-4 py-5"
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation footer */}
              <StepNavigationFooter
                currentStep={currentStep}
                isNextDisabled={isNextDisabled}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSaveDraft={handleSaveDraft}
                className="flex-shrink-0"
              />
            </Card>
          </div>

          {/* Right Column - Campaign Progress Checklist with Live Preview */}
          <div className="w-[37.5%] h-full flex flex-col">
            <Card className="h-full p-0 flex flex-col overflow-hidden shadow-md">
              <div className="flex-1 overflow-hidden">
                <CampaignAnalyticsPanelLite
                  className="h-full flex-1"
                  currentAdData={currentAdData}
                  allAdsData={formData.ads}
                  onAssetUpload={handleAssetUploadForCurrentAd}
                  onAssetRemove={handleAssetRemoveForCurrentAd}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementWizard;
