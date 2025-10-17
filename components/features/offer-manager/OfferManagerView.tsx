"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  SparklesIcon,
  DocumentTextIcon,
  CreditCardIcon,
  CalendarIcon,
  ChartBarIcon,
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
import { MessageSquare } from "lucide-react";
import GoalSettingStep from "@/components/features/offer-manager/steps/GoalSettingStep";
import OfferDetailsStep from "@/components/features/offer-manager/steps/OfferDetailsStep";
import RedemptionMethodStep from "@/components/features/offer-manager/steps/RedemptionMethodStep";
import OfferManagerDashboard from "@/components/features/offer-manager/OfferManagerDashboard";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { toggleChat } from "@/lib/redux/slices/uiSlice";
import {
  setOfferCreationState,
  setWorkflowPhase,
  setFormData,
} from "@/lib/redux/slices/offerManagerSlice";
import { OfferAgentStateRenderer } from "@/components/features/offer-manager/OfferAgentStateRenderer";
import { useCopilotReadable } from "@copilotkit/react-core";
import { useOfferManagerAgent } from "@/lib/hooks/useOfferManagerAgent";

export default function OfferManagerView() {
  const dispatch = useAppDispatch();
  const { chatOpen } = useAppSelector((state) => state.ui);

  // Initialize Offer Manager AI agent actions
  useOfferManagerAgent();

  const [isCreatingOffer, setIsCreatingOffer] = useState(false);
  const [currentTab, setCurrentTab] = useState<
    "goal" | "details" | "redemption" | "campaign" | "review"
  >("goal");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Local state for AI agent UI (lightweight)
  const [agentState, setAgentState] = useState<any>(null);

  // Form data state
  const [formData, setFormData] = useState({
    // Goal Setting
    businessObjective: "",
    programType: "",
    targetAudience: [] as string[],
    maxDiscount: "",
    maxDiscountUnit: "%",
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

  const handleStartCreation = () => {
    setIsCreatingOffer(true);
    setCurrentTab("goal");
  };

  const handleBackToDashboard = () => {
    setIsCreatingOffer(false);
    setCurrentTab("goal");
    // Optionally reset form data
    // setFormData({ ... reset to initial state ... });
  };

  const handleFormUpdate = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTabChange = (
    tab: "goal" | "details" | "redemption" | "campaign" | "review"
  ) => {
    setCurrentTab(tab);
  };

  // Map currentTab to step number for Stepper component
  const currentStepNumber = {
    goal: 1,
    details: 2,
    redemption: 3,
    campaign: 4,
    review: 5,
  }[currentTab];

  const stepNumberToTab = (
    step: number
  ): "goal" | "details" | "redemption" | "campaign" | "review" => {
    const mapping = {
      1: "goal",
      2: "details",
      3: "redemption",
      4: "campaign",
      5: "review",
    } as const;
    return mapping[step as keyof typeof mapping];
  };

  const handleNextTab = () => {
    const tabOrder: (
      | "goal"
      | "details"
      | "redemption"
      | "campaign"
      | "review"
    )[] = ["goal", "details", "redemption", "campaign", "review"];
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex < tabOrder.length - 1) {
      setCurrentTab(tabOrder[currentIndex + 1]);
    }
  };

  const handlePreviousTab = () => {
    const tabOrder: (
      | "goal"
      | "details"
      | "redemption"
      | "campaign"
      | "review"
    )[] = ["goal", "details", "redemption", "campaign", "review"];
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabOrder[currentIndex - 1]);
    }
  };

  const handleAskAI = (field: string) => {
    console.log("Ask AI about:", field);
    // TODO: Trigger AI assistant for specific field
  };

  // Sync state to Redux for context-aware AI assistant
  React.useEffect(() => {
    const workflowPhase = isCreatingOffer
      ? currentTab === "goal"
        ? "goal_setting"
        : currentTab === "details"
          ? "offer_configuration"
          : currentTab === "redemption"
            ? "redemption_setup"
            : currentTab === "campaign"
              ? "campaign_planning"
              : "review_launch"
      : "dashboard";

    dispatch(
      setOfferCreationState({
        isCreatingOffer,
        currentStep: currentTab,
        workflowPhase,
        formData: {
          businessObjective: formData.businessObjective,
          offerType: formData.offerType,
          offerTitle: formData.offerTitle,
          programType: formData.programType,
          targetAudience: formData.targetAudience,
        },
      })
    );
  }, [
    isCreatingOffer,
    currentTab,
    formData.businessObjective,
    formData.offerType,
    formData.offerTitle,
    formData.programType,
    formData.targetAudience,
    dispatch,
  ]);

  // Expose offer creation context to CopilotKit
  useCopilotReadable({
    description: "Current offer creation state and progress",
    value: {
      isCreatingOffer,
      currentStep: currentTab,
      completedSteps,
      formData,
      workflowPhase: isCreatingOffer
        ? currentTab === "goal"
          ? "goal_setting"
          : currentTab === "details"
            ? "offer_configuration"
            : currentTab === "redemption"
              ? "redemption_setup"
              : currentTab === "campaign"
                ? "campaign_planning"
                : "review_launch"
        : "dashboard",
    },
  });

  return (
    <div className="min-h-screen relative">
      {/* Main Content */}
      {!isCreatingOffer ? (
        // Dashboard view - polished list with stats
        <div className="max-w-7xl mx-auto">
          <OfferManagerDashboard onCreateOffer={handleStartCreation} />
        </div>
      ) : (
        // Offer creation workflow - Full width layout
        <div
          className="overflow-hidden"
          style={{ height: "calc(100vh - 140px)" }}
        >
          <div className="h-full flex">
            {/* OriginUI Vertical Stepper */}
            <div className="w-20 flex-shrink-0">
              <div className="h-full bg-white rounded-l-lg border border-r-0 border-gray-200 shadow-sm py-6 px-3">
                <Stepper
                  orientation="vertical"
                  value={currentStepNumber}
                  onValueChange={(step) =>
                    handleTabChange(stepNumberToTab(step))
                  }
                  className="gap-4"
                >
                  {/* Step 1: Goal Setting */}
                  <StepperItem
                    step={1}
                    completed={completedSteps.includes("goal")}
                  >
                    <StepperTrigger className="flex flex-col items-center gap-2 w-full">
                      <StepperIndicator />
                      <StepperTitle className="text-xs text-center">
                        Goal
                      </StepperTitle>
                    </StepperTrigger>
                    <StepperSeparator />
                  </StepperItem>

                  {/* Step 2: Offer Details */}
                  <StepperItem
                    step={2}
                    completed={completedSteps.includes("details")}
                  >
                    <StepperTrigger className="flex flex-col items-center gap-2 w-full">
                      <StepperIndicator />
                      <StepperTitle className="text-xs text-center">
                        Details
                      </StepperTitle>
                    </StepperTrigger>
                    <StepperSeparator />
                  </StepperItem>

                  {/* Step 3: Redemption */}
                  <StepperItem
                    step={3}
                    completed={completedSteps.includes("redemption")}
                  >
                    <StepperTrigger className="flex flex-col items-center gap-2 w-full">
                      <StepperIndicator />
                      <StepperTitle className="text-xs text-center">
                        Redeem
                      </StepperTitle>
                    </StepperTrigger>
                    <StepperSeparator />
                  </StepperItem>

                  {/* Step 4: Campaign Setup */}
                  <StepperItem
                    step={4}
                    completed={completedSteps.includes("campaign")}
                  >
                    <StepperTrigger className="flex flex-col items-center gap-2 w-full">
                      <StepperIndicator />
                      <StepperTitle className="text-xs text-center">
                        Campaign
                      </StepperTitle>
                    </StepperTrigger>
                    <StepperSeparator />
                  </StepperItem>

                  {/* Step 5: Review & Launch */}
                  <StepperItem
                    step={5}
                    completed={completedSteps.includes("review")}
                  >
                    <StepperTrigger className="flex flex-col items-center gap-2 w-full">
                      <StepperIndicator />
                      <StepperTitle className="text-xs text-center">
                        Review
                      </StepperTitle>
                    </StepperTrigger>
                  </StepperItem>
                </Stepper>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              <div className="h-full">
                {/* Full Width - Form */}
                <div className="w-full h-full flex flex-col">
                  <Card className="p-0 flex flex-col h-full overflow-hidden shadow-md rounded-l-none">
                    {/* Header Section */}
                    <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
                      <div className="flex items-center">
                        {currentTab === "goal" && (
                          <DocumentTextIcon className="h-5 w-5 mr-2 text-primary" />
                        )}
                        {currentTab === "details" && (
                          <GiftIcon className="h-5 w-5 mr-2 text-primary" />
                        )}
                        {currentTab === "redemption" && (
                          <CreditCardIcon className="h-5 w-5 mr-2 text-primary" />
                        )}
                        {currentTab === "campaign" && (
                          <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                        )}
                        {currentTab === "review" && (
                          <ChartBarIcon className="h-5 w-5 mr-2 text-primary" />
                        )}
                        <div>
                          <h3 className="font-medium">
                            {currentTab === "goal" && "Goal Setting"}
                            {currentTab === "details" && "Offer Details"}
                            {currentTab === "redemption" && "Redemption Method"}
                            {currentTab === "campaign" && "Campaign Setup"}
                            {currentTab === "review" && "Review & Launch"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {currentTab === "goal" &&
                              "Define your business objective and key parameters"}
                            {currentTab === "details" &&
                              "Configure your promotional offer settings"}
                            {currentTab === "redemption" &&
                              "Select how customers will redeem your offer"}
                            {currentTab === "campaign" &&
                              "Set up campaign targeting and distribution"}
                            {currentTab === "review" &&
                              "Review and launch your offer campaign"}
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
                          Back to Dashboard
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => dispatch(toggleChat())}
                          className="flex items-center gap-1"
                        >
                          <MessageSquare className="h-4 w-4" />
                          {chatOpen ? "Hide" : "Show"} AI Assistant
                        </Button>
                        {currentTab === "review" ? (
                          <Button className="flex items-center gap-1" size="sm">
                            <SparklesIcon className="h-4 w-4" />
                            Launch Offer
                          </Button>
                        ) : (
                          <Button
                            onClick={handleNextTab}
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
                        {currentTab === "goal" && (
                          <GoalSettingStep
                            formData={{
                              businessObjective: formData.businessObjective,
                              programType: formData.programType,
                              targetAudience: formData.targetAudience,
                              maxDiscount: formData.maxDiscount,
                              maxDiscountUnit: formData.maxDiscountUnit,
                              totalBudget: formData.totalBudget,
                              startDate: formData.startDate,
                              endDate: formData.endDate,
                            }}
                            onUpdate={handleFormUpdate}
                            onNext={handleNextTab}
                            onAskAI={handleAskAI}
                          />
                        )}

                        {currentTab === "details" && (
                          <OfferDetailsStep
                            formData={{
                              offerType: formData.offerType,
                              offerValue: formData.offerValue,
                              offerTitle: formData.offerTitle,
                              offerDescription: formData.offerDescription,
                              termsConditions: formData.termsConditions,
                            }}
                            onUpdate={handleFormUpdate}
                            onNext={handleNextTab}
                            onPrevious={handlePreviousTab}
                            onAskAI={handleAskAI}
                          />
                        )}

                        {currentTab === "redemption" && (
                          <RedemptionMethodStep
                            formData={{
                              redemptionMethod: formData.redemptionMethod,
                              promoCodeType: formData.promoCodeType,
                              promoCode: formData.promoCode,
                              usageLimitPerCustomer:
                                formData.usageLimitPerCustomer,
                              totalUsageLimit: formData.totalUsageLimit,
                              locationScope: formData.locationScope,
                            }}
                            onUpdate={handleFormUpdate}
                            onNext={handleNextTab}
                            onPrevious={handlePreviousTab}
                            onAskAI={handleAskAI}
                          />
                        )}

                        {currentTab === "campaign" && (
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                              Campaign setup coming soon...
                            </p>
                            <div className="flex gap-3">
                              <Button
                                variant="outline"
                                onClick={handlePreviousTab}
                              >
                                ← Previous
                              </Button>
                              <Button onClick={handleNextTab}>
                                Next: Review & Launch →
                              </Button>
                            </div>
                          </div>
                        )}

                        {currentTab === "review" && (
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                              Review & launch coming soon...
                            </p>
                            <Button
                              variant="outline"
                              onClick={handlePreviousTab}
                            >
                              ← Previous
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
