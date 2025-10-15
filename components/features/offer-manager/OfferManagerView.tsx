"use client";

import React, { useState, useEffect } from "react";
import {
  useCoAgent,
  useCoAgentStateRender,
  useCopilotAction,
} from "@copilotkit/react-core";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  GiftIcon,
} from "@heroicons/react/24/outline";
import OfferCreationForm from "./OfferCreationForm";
import OfferProgressTracker from "./OfferProgressTracker";
import OfferApprovalDialog from "./OfferApprovalDialog";
import OfferRecommendations from "./OfferRecommendations";
import OfferProgressViewer from "./OfferProgressViewer";
import OfferConversationView from "./OfferConversationView";
import { OfferManagerState } from "./types";
import ReactMarkdown from "react-markdown";
import StepNavigator from "./StepNavigator";
import GoalSettingStep from "./steps/GoalSettingStep";
import OfferDetailsStep from "./steps/OfferDetailsStep";
import RedemptionMethodStep from "./steps/RedemptionMethodStep";
import OfferManagerDashboard from "./OfferManagerDashboard";

export default function OfferManagerView() {
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState("goal_setting");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Form data state
  const [formData, setFormData] = useState({
    // Goal Setting
    businessObjective: "",
    programType: "",
    targetAudience: [] as string[],
    maxDiscount: "",
    totalBudget: "",
    startDate: "",
    endDate: "",
    // Offer Details
    offerType: "",
    offerValue: "",
    offerTitle: "",
    offerDescription: "",
    termsConditions: "",
    // Redemption Method
    redemptionMethod: "",
    promoCodeType: "single",
    promoCode: "",
    usageLimitPerCustomer: "1",
    totalUsageLimit: "1000",
    locationScope: "all",
  });

  // Connect to supervisor agent (which routes to offer_manager_agent)
  const { state, setState } = useCoAgent<OfferManagerState>({
    name: "supervisor",
    initialState: {
      messages: [],
      business_objective: "",
      program_type: "general",
      offer_config: {},
      campaign_setup: {},
      workflow_step: "goal_setting",
      validation_results: [],
      progress_percentage: 0,
      current_phase: "initialization",
    },
  });

  // Real-time state rendering for offer manager progress
  useCoAgentStateRender({
    name: "supervisor",
    render: ({ state, nodeName, status }) => {
      // Only render when we're in the offer manager agent
      if (nodeName !== "offer_manager_agent") {
        return null;
      }

      const typedState = state as OfferManagerState;
      const phase = typedState.current_phase || "initialization";
      const progress = typedState.progress_percentage || 0;

      return (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
          <Card className="p-4 shadow-lg border-l-4 border-l-primary-brand">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {status === "streaming" ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-brand"></div>
                ) : status === "done" ? (
                  <CheckCircleIcon className="h-5 w-5 text-status-success" />
                ) : (
                  <ClockIcon className="h-5 w-5 text-primary-brand" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">
                  {phase === "goal_setting" && "Setting Goals..."}
                  {phase === "offer_creation" &&
                    "Creating Offer Recommendations..."}
                  {phase === "campaign_setup" && "Setting Up Campaign..."}
                  {phase === "validation" && "Validating Offer..."}
                  {phase === "approval" && "Ready for Approval"}
                </p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-primary-brand h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-xs text-text-muted">
                  {progress}% Complete
                </p>
              </div>
            </div>
          </Card>
        </div>
      );
    },
  });

  // Handle approval actions
  useCopilotAction({
    name: "launchOffer",
    description: "Launch the promotional offer and activate the campaign",
    parameters: [
      {
        name: "offer_config",
        type: "object",
        description: "The offer configuration",
      },
      {
        name: "campaign_setup",
        type: "object",
        description: "The campaign setup details",
      },
    ],
    handler: async ({ offer_config, campaign_setup }) => {
      console.log("Launching offer:", { offer_config, campaign_setup });
      setShowApprovalDialog(true);
      return "Offer launch initiated, awaiting final approval";
    },
  });

  // Monitor approval status
  useEffect(() => {
    if (state?.requires_approval && state?.pending_action) {
      setShowApprovalDialog(true);
    }
  }, [state?.requires_approval, state?.pending_action]);

  const handleStartCreation = () => {
    setIsCreatingOffer(true);
    setCurrentStep("goal_setting");
    setCompletedSteps([]);
  };

  const handleFormUpdate = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = (fromStep: string) => {
    // Mark current step as completed
    setCompletedSteps((prev) => [...prev, fromStep]);

    // Move to next step
    const stepOrder = [
      "goal_setting",
      "offer_details",
      "redemption_method",
      "campaign_setup",
      "review_launch",
    ];
    const currentIndex = stepOrder.indexOf(fromStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handlePreviousStep = (fromStep: string) => {
    const stepOrder = [
      "goal_setting",
      "offer_details",
      "redemption_method",
      "campaign_setup",
      "review_launch",
    ];
    const currentIndex = stepOrder.indexOf(fromStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleAskAI = (field: string) => {
    // Placeholder for AI integration
    console.log("Ask AI about:", field);
    // TODO: Send message to AI agent
  };

  const handleApprove = () => {
    setState((prevState: OfferManagerState) => ({
      ...prevState,
      approval_status: "approved",
      requires_approval: false,
    }));
    setShowApprovalDialog(false);
  };

  const handleReject = () => {
    setState((prevState: OfferManagerState) => ({
      ...prevState,
      approval_status: "rejected",
      requires_approval: false,
      pending_action: null,
    }));
    setShowApprovalDialog(false);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Main Content */}
        {!isCreatingOffer ? (
          // Dashboard view - polished list with stats
          <OfferManagerDashboard onCreateOffer={handleStartCreation} />
        ) : (
          // Offer creation workflow - Manual multi-step form
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar: Step Navigator (1 column) */}
            <div className="lg:col-span-1">
              <StepNavigator
                currentStep={currentStep}
                completedSteps={completedSteps}
              />
            </div>

            {/* Middle: Current Step Form (2 columns) */}
            <div className="lg:col-span-2">
              {currentStep === "goal_setting" && (
                <GoalSettingStep
                  formData={{
                    businessObjective: formData.businessObjective,
                    programType: formData.programType,
                    targetAudience: formData.targetAudience,
                    maxDiscount: formData.maxDiscount,
                    totalBudget: formData.totalBudget,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                  }}
                  onUpdate={handleFormUpdate}
                  onNext={() => handleNextStep("goal_setting")}
                  onAskAI={handleAskAI}
                />
              )}

              {currentStep === "offer_details" && (
                <OfferDetailsStep
                  formData={{
                    offerType: formData.offerType,
                    offerValue: formData.offerValue,
                    offerTitle: formData.offerTitle,
                    offerDescription: formData.offerDescription,
                    termsConditions: formData.termsConditions,
                  }}
                  onUpdate={handleFormUpdate}
                  onNext={() => handleNextStep("offer_details")}
                  onPrevious={() => handlePreviousStep("offer_details")}
                  onAskAI={handleAskAI}
                />
              )}

              {currentStep === "redemption_method" && (
                <RedemptionMethodStep
                  formData={{
                    redemptionMethod: formData.redemptionMethod,
                    promoCodeType: formData.promoCodeType,
                    promoCode: formData.promoCode,
                    usageLimitPerCustomer: formData.usageLimitPerCustomer,
                    totalUsageLimit: formData.totalUsageLimit,
                    locationScope: formData.locationScope,
                  }}
                  onUpdate={handleFormUpdate}
                  onNext={() => handleNextStep("redemption_method")}
                  onPrevious={() => handlePreviousStep("redemption_method")}
                  onAskAI={handleAskAI}
                />
              )}

              {(currentStep === "campaign_setup" ||
                currentStep === "review_launch") && (
                <Card className="p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {currentStep === "campaign_setup"
                      ? "Step 4: Campaign Setup"
                      : "Step 5: Review & Launch"}
                  </h2>
                  <p className="text-gray-600">Coming soon...</p>
                  <div className="flex justify-between gap-3 mt-8 pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => handlePreviousStep(currentStep)}
                      className="border-gray-300"
                    >
                      ← Previous
                    </Button>
                    {currentStep === "campaign_setup" && (
                      <Button
                        onClick={() => handleNextStep("campaign_setup")}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Next: Review & Launch →
                      </Button>
                    )}
                  </div>
                </Card>
              )}
            </div>

            {/* Right Sidebar: AI Co-Pilot (1 column) - Placeholder */}
            <div className="lg:col-span-1">
              <Card className="p-6 border border-gray-200 shadow-sm sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <SparklesIcon className="h-5 w-5 text-blue-600" />
                  AI Co-Pilot
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  AI assistant panel coming soon...
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs font-medium text-blue-900">
                      💡 Pro Tip
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Click "Ask AI" buttons on any field for intelligent
                      suggestions
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Approval Dialog */}
        {showApprovalDialog && state?.pending_action && (
          <OfferApprovalDialog
            isOpen={showApprovalDialog}
            offerConfig={state?.offer_config || {}}
            campaignSetup={state?.campaign_setup || {}}
            validationResults={state?.validation_results || []}
            onApprove={handleApprove}
            onReject={handleReject}
            onClose={() => setShowApprovalDialog(false)}
          />
        )}
      </div>
    </div>
  );
}
