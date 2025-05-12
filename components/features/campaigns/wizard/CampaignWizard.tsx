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

// Import step components (to be created later)
// import BasicInfoStep from "./steps/BasicInfoStep";
// import TargetingStep from "./steps/TargetingStep";
// import DistributionStep from "./steps/DistributionStep";
// import BudgetStep from "./steps/BudgetStep";
// import ReviewStep from "./steps/ReviewStep";

// Step content placeholder
const StepContent = ({ step }: { step: string }) => (
  <div className="p-6 bg-white rounded-md border">
    <h3 className="text-lg font-semibold">{step} Step Content</h3>
    <p className="mt-2 text-gray-500">
      This is a placeholder for the {step} step content. Implement the actual
      step component.
    </p>
  </div>
);

const CampaignWizard: React.FC = () => {
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
      console.log("Create campaign with data:", formData);
      // TODO: Implement actual campaign creation API call
      setTimeout(() => {
        // Simulate success
        alert("Campaign created successfully!");
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
    console.log("Saving draft:", formData);
    alert("Campaign saved as draft");
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
        // return <BasicInfoStep />;
        return <StepContent step="Basic Info" />;
      case "targeting":
        // return <TargetingStep />;
        return <StepContent step="Targeting" />;
      case "distribution":
        // return <DistributionStep />;
        return <StepContent step="Distribution" />;
      case "budget":
        // return <BudgetStep />;
        return <StepContent step="Budget" />;
      case "review":
        // return <ReviewStep />;
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
          <div className="w-1/3 max-w-[400px] flex-shrink-0 h-full">
            <Card className="p-0 h-full flex flex-col overflow-hidden">
              <AIAssistantPanel
                title="AI Campaign Assistant"
                description="I'll help you create an effective campaign"
                onOptionSelected={handleOptionSelected}
                className="h-full overflow-auto"
              />
            </Card>
          </div>

          {/* Middle Column - Campaign Form with Steps */}
          <div className="w-1/3 min-w-0 flex-1 flex flex-col h-full overflow-hidden">
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
          <div className="w-1/3 max-w-[400px] flex-shrink-0 h-full">
            <Card className="h-full p-4">
              <h3 className="text-lg font-semibold mb-4">Campaign Preview</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Campaign Name
                  </p>
                  <p className="text-sm">
                    {formData.basicInfo.name || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Campaign Type
                  </p>
                  <p className="text-sm">
                    {formData.basicInfo.campaignType || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="text-sm">
                    {formData.targeting.startDate && formData.targeting.endDate
                      ? `${new Date(formData.targeting.startDate).toLocaleDateString()} - ${new Date(formData.targeting.endDate).toLocaleDateString()}`
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Locations</p>
                  <p className="text-sm">
                    {formData.targeting.locations.length > 0
                      ? `${formData.targeting.locations.length} locations selected`
                      : "None selected"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Budget</p>
                  <p className="text-sm">
                    $
                    {formData.budget.maxBudget > 0
                      ? formData.budget.maxBudget.toLocaleString()
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Weight</p>
                  <p className="text-sm capitalize">
                    {formData.targeting.campaignWeight}
                  </p>
                </div>

                {/* Placeholder for campaign visualization */}
                <div className="mt-6 h-48 bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-gray-500 text-sm">
                    Campaign Visualization
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignWizard;
