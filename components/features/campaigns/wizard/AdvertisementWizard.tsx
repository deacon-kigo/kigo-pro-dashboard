"use client";

import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { RootState } from "@/lib/redux/store";
import { AIAssistantPanel } from "@/components/features/ai";
import Card from "@/components/atoms/Card/Card";
import {
  CAMPAIGN_STEPS,
  setCurrentStep,
  setStepValidation,
  resetCampaign,
} from "@/lib/redux/slices/campaignSlice";
import StepProgressHeader from "./StepProgressHeader";
import StepNavigationFooter from "./StepNavigationFooter";
import { setCampaignContext } from "@/lib/redux/slices/ai-assistantSlice";
import { CampaignAnalyticsPanel } from "../CampaignAnalyticsPanel";

// Step content placeholder - in this case, we'll use the original ad creation components later
const StepContent = ({ step }: { step: string }) => (
  <div className="p-6 bg-white rounded-md border">
    <h3 className="text-lg font-semibold">{step} Step Content</h3>
    <p className="mt-2 text-gray-500">
      This is a placeholder for the {step} step content. Implement the actual
      advertisement step component.
    </p>
  </div>
);

const AdvertisementWizard: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get campaign state from Redux
  const { currentStep, formData, stepValidation, isGenerating } = useSelector(
    (state: RootState) => state.campaign
  );

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

  // Check if next button should be disabled
  const isNextDisabled = !stepValidation[CAMPAIGN_STEPS[currentStep].id];

  // Animation variants
  const contentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  // Render the current step content
  const renderStepContent = () => {
    switch (CAMPAIGN_STEPS[currentStep].id) {
      case "basic-info":
        return <StepContent step="Basic Info" />;
      case "targeting":
        return <StepContent step="Targeting" />;
      case "distribution":
        return <StepContent step="Distribution" />;
      case "budget":
        return <StepContent step="Budget" />;
      case "review":
        return <StepContent step="Review" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Main content container */}
      <div className="flex-1 flex flex-col">
        <div className="flex gap-4 h-full">
          {/* Left Column - AI Assistant Panel */}
          <div className="w-[360px] flex-shrink-0 h-full">
            <Card className="p-0 h-full flex flex-col overflow-hidden">
              <AIAssistantPanel
                title="AI Advertisement Assistant"
                description="I'll help you create an effective ad campaign"
                onOptionSelected={handleOptionSelected}
                className="h-full overflow-auto"
              />
            </Card>
          </div>

          {/* Middle Column - Campaign Form with Steps */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <Card className="p-0 flex flex-col h-full overflow-hidden">
              {/* Step indicator header */}
              <StepProgressHeader
                currentStep={currentStep}
                stepValidation={stepValidation}
                onStepClick={handleStepChange}
                className="flex-shrink-0"
              />

              {/* Step content with animation */}
              <div className="flex-1 overflow-auto p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={CAMPAIGN_STEPS[currentStep].id}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={contentVariants}
                    transition={{ duration: 0.3 }}
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
          <div className="w-[360px] flex-shrink-0 h-full">
            <Card className="h-full p-0">
              <CampaignAnalyticsPanel
                className="h-full"
                campaignBudget={formData.budget.maxBudget || 5000}
                estimatedReach={100000}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementWizard;
