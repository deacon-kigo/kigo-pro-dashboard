"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/redux/store";
import {
  addAd,
  updateAd,
  removeAd,
  addMediaToAd,
  removeMediaFromAd,
} from "@/lib/redux/slices/campaignSlice";
import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button";
import { PageHeader } from "@/components/molecules/PageHeader";
import AdCreationStep from "./steps/AdCreationStep";
import { CampaignAnalyticsPanelLite } from "../CampaignAnalyticsPanelLite";
import { AIAssistantPanel } from "@/components/features/ai";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/molecules/alert-dialog/AlertDialog";
import { motion, AnimatePresence } from "framer-motion";
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
} from "@/lib/redux/slices/campaignSlice";
import StepProgressHeader from "./StepProgressHeader";
import StepNavigationFooter from "./StepNavigationFooter";
import { setCampaignContext } from "@/lib/redux/slices/ai-assistantSlice";
import { CampaignAnalyticsPanel } from "../CampaignAnalyticsPanel";
import { v4 as uuidv4 } from "uuid";

// Import step components
import BasicInfoStep from "./steps/BasicInfoStep";
import TargetingBudgetStep from "./steps/TargetingBudgetStep";
import DistributionStep from "./steps/DistributionStep";
import ReviewStep from "./steps/ReviewStep";

const AdvertisementWizardAI: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get campaign state from Redux
  const { currentStep, formData, stepValidation, isGenerating } = useSelector(
    (state: RootState) => state.campaign
  );

  // State for confirmation dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Reset campaign form on initial load
  useEffect(() => {
    dispatch(resetCampaign());
  }, [dispatch]);

  // Update AI context when form data changes
  useEffect(() => {
    dispatch(setCampaignContext(formData));
  }, [dispatch, formData]);

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
      // This is the final step - show confirmation dialog
      setCreateDialogOpen(true);
    }
  }, [currentStep, dispatch]);

  const handleConfirmedCreateCampaign = useCallback(() => {
    // Close the dialog
    setCreateDialogOpen(false);

    // Handle campaign creation
    console.log("Create advertisement campaign with data:", formData);
    // TODO: Implement actual campaign creation API call
    setTimeout(() => {
      // Simulate success and redirect to ads manager
      alert("Advertisement campaign created successfully!");
      router.push("/campaigns");
    }, 1000);
  }, [formData, router]);

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

  // Get campaign analytics values for right panel
  const getCampaignAnalyticsValues = () => {
    const campaignBudget = formData.budget.maxBudget || 5000;
    let estimatedReach = 0;

    // Calculate estimated reach based on targeting weight
    switch (formData.targeting.campaignWeight) {
      case "small":
        estimatedReach = 50000;
        break;
      case "medium":
        estimatedReach = 100000;
        break;
      case "large":
        estimatedReach = 200000;
        break;
      default:
        estimatedReach = 100000;
    }

    // Adjust based on selected loyalty programs (more programs = more reach)
    if (formData.distribution.programs.length > 0) {
      estimatedReach = Math.round(
        estimatedReach * (1 + formData.distribution.programs.length * 0.1)
      );
    }

    // Adjust based on number of ads (more ads = more engagement)
    const adCount = formData.ads.length;
    if (adCount > 0) {
      const adMultiplier = 1 + adCount * 0.05;
      estimatedReach = Math.round(estimatedReach * adMultiplier);
    }

    return {
      campaignBudget,
      estimatedReach,
    };
  };

  // Create back button
  const backButton = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.push("/campaigns")}
      className="flex items-center gap-1"
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
      Back to Ads Manager
    </Button>
  );

  // Get analytics values
  const analyticsValues = getCampaignAnalyticsValues();

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex-shrink-0">
        <PageHeader
          title="Create Ad (AI)"
          description="Create promotional campaigns with AI assistance to drive customer engagement and sales."
          emoji="🤖"
          actions={backButton}
          variant="aurora"
        />
      </div>

      <div
        className="flex-1 flex flex-col"
        style={{ height: "calc(100vh - 160px)" }}
      >
        <div className="flex gap-3 ">
          {/* Left Column - AI Assistant Panel */}
          <div
            className="w-1/4 flex-shrink-0"
            style={{
              height: "calc(100vh - 180px)",
            }}
          >
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
          <div className="w-[37.5%] flex-1 h-full flex flex-col">
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
                    className="p-3"
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

          {/* Right Column - Campaign Visualization */}
          <div className="w-[37.5%] flex-shrink-0 h-full">
            <Card className="h-full p-0 flex flex-col overflow-hidden shadow-md">
              <div className="flex-1 overflow-hidden">
                <CampaignAnalyticsPanel
                  className="h-full flex-1"
                  campaignBudget={analyticsValues.campaignBudget}
                  estimatedReach={analyticsValues.estimatedReach}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Campaign Creation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to create this advertisement campaign? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmedCreateCampaign}>
              Create Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdvertisementWizardAI;
