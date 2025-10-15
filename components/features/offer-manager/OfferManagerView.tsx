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
  DocumentTextIcon,
  CreditCardIcon,
  CalendarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import OfferApprovalDialog from "@/components/features/offer-manager/OfferApprovalDialog";
import GoalSettingStep from "@/components/features/offer-manager/steps/GoalSettingStep";
import OfferDetailsStep from "@/components/features/offer-manager/steps/OfferDetailsStep";
import RedemptionMethodStep from "@/components/features/offer-manager/steps/RedemptionMethodStep";
import OfferManagerDashboard from "@/components/features/offer-manager/OfferManagerDashboard";
import { OfferManagerState } from "@/components/features/offer-manager/types";

export default function OfferManagerView() {
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState<
    "goal" | "details" | "redemption" | "campaign" | "review"
  >("goal");
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
                {status === "inProgress" ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-brand"></div>
                ) : status === "complete" ? (
                  <CheckCircleIcon className="h-5 w-5 text-status-success" />
                ) : (
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {phase === "goal_setting" && "Setting up your offer goals..."}
                  {phase === "offer_creation" && "Configuring offer details..."}
                  {phase === "campaign_setup" && "Setting up campaign..."}
                  {phase === "validation" && "Validating configuration..."}
                  {phase === "approval" && "Awaiting approval..."}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-primary-brand h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {progress}% complete
                </p>
              </div>
            </div>
          </Card>
        </div>
      );
    },
  });

  // Copilot actions
  useCopilotAction({
    name: "request_approval",
    description: "Request approval for the created offer configuration",
    parameters: [
      {
        name: "offer_config",
        type: "object",
        description: "The offer configuration to approve",
        required: true,
      },
      {
        name: "campaign_setup",
        type: "object",
        description: "The campaign setup details",
        required: true,
      },
    ],
    handler: async ({ offer_config, campaign_setup }) => {
      setState((prevState) => ({
        ...prevState,
        offer_config,
        campaign_setup,
        requires_approval: true,
        pending_action: "create_offer",
        steps: prevState?.steps || [],
      }));
      setShowApprovalDialog(true);
      return "Approval dialog opened";
    },
  });

  useEffect(() => {
    if (state?.requires_approval) {
      setShowApprovalDialog(true);
    }
  }, [state?.requires_approval]);

  const handleStartCreation = () => {
    setIsCreatingOffer(true);
    setCurrentTab("goal");
  };

  const handleApprove = () => {
    setState((prevState) => ({
      ...prevState,
      approval_status: "approved",
      requires_approval: false,
      pending_action: null,
      steps: prevState?.steps || [],
    }));
    setShowApprovalDialog(false);
  };

  const handleReject = () => {
    setState((prevState) => ({
      ...prevState,
      approval_status: "rejected",
      requires_approval: false,
      pending_action: null,
      steps: prevState?.steps || [],
    }));
    setShowApprovalDialog(false);
  };

  const handleFormUpdate = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTabChange = (
    tab: "goal" | "details" | "redemption" | "campaign" | "review"
  ) => {
    setCurrentTab(tab);
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

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Main Content */}
        {!isCreatingOffer ? (
          // Dashboard view - polished list with stats
          <OfferManagerDashboard onCreateOffer={handleStartCreation} />
        ) : (
          // Offer creation workflow - Standardized layout
          <div
            className="overflow-hidden"
            style={{ height: "calc(100vh - 140px)" }}
          >
            <div className="h-full flex">
              {/* Compact Vertical Stepper */}
              <div className="w-24 flex-shrink-0">
                <div className="h-full bg-white rounded-l-lg border border-r-0 border-gray-200 shadow-sm">
                  <div className="p-4 pt-6">
                    <nav className="relative">
                      {/* Vertical connecting line */}
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

                      <div className="relative space-y-6">
                        {/* Step 1: Goal */}
                        <button
                          onClick={() => handleTabChange("goal")}
                          className="group relative flex flex-col items-center gap-1 w-full"
                        >
                          <div
                            className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                              completedSteps.includes("goal")
                                ? "bg-green-500 border-green-500"
                                : currentTab === "goal"
                                  ? "bg-blue-600 border-blue-600"
                                  : "bg-white border-gray-300"
                            }`}
                          >
                            {completedSteps.includes("goal") ? (
                              <CheckCircleIcon className="h-5 w-5 text-white" />
                            ) : (
                              <span
                                className={`text-xs font-bold ${
                                  currentTab === "goal"
                                    ? "text-white"
                                    : "text-gray-500"
                                }`}
                              >
                                1
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-xs font-medium text-center transition-colors ${
                              currentTab === "goal"
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`}
                          >
                            Goal
                          </span>
                        </button>

                        {/* Step 2: Details */}
                        <button
                          onClick={() => handleTabChange("details")}
                          className="group relative flex flex-col items-center gap-1 w-full"
                        >
                          <div
                            className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                              completedSteps.includes("details")
                                ? "bg-green-500 border-green-500"
                                : currentTab === "details"
                                  ? "bg-blue-600 border-blue-600"
                                  : "bg-white border-gray-300"
                            }`}
                          >
                            {completedSteps.includes("details") ? (
                              <CheckCircleIcon className="h-5 w-5 text-white" />
                            ) : (
                              <span
                                className={`text-xs font-bold ${
                                  currentTab === "details"
                                    ? "text-white"
                                    : "text-gray-500"
                                }`}
                              >
                                2
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-xs font-medium text-center transition-colors ${
                              currentTab === "details"
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`}
                          >
                            Details
                          </span>
                        </button>

                        {/* Step 3: Redemption */}
                        <button
                          onClick={() => handleTabChange("redemption")}
                          className="group relative flex flex-col items-center gap-1 w-full"
                        >
                          <div
                            className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                              completedSteps.includes("redemption")
                                ? "bg-green-500 border-green-500"
                                : currentTab === "redemption"
                                  ? "bg-blue-600 border-blue-600"
                                  : "bg-white border-gray-300"
                            }`}
                          >
                            {completedSteps.includes("redemption") ? (
                              <CheckCircleIcon className="h-5 w-5 text-white" />
                            ) : (
                              <span
                                className={`text-xs font-bold ${
                                  currentTab === "redemption"
                                    ? "text-white"
                                    : "text-gray-500"
                                }`}
                              >
                                3
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-xs font-medium text-center transition-colors ${
                              currentTab === "redemption"
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`}
                          >
                            Redeem
                          </span>
                        </button>

                        {/* Step 4: Campaign */}
                        <button
                          onClick={() => handleTabChange("campaign")}
                          className="group relative flex flex-col items-center gap-1 w-full"
                        >
                          <div
                            className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                              completedSteps.includes("campaign")
                                ? "bg-green-500 border-green-500"
                                : currentTab === "campaign"
                                  ? "bg-blue-600 border-blue-600"
                                  : "bg-white border-gray-300"
                            }`}
                          >
                            {completedSteps.includes("campaign") ? (
                              <CheckCircleIcon className="h-5 w-5 text-white" />
                            ) : (
                              <span
                                className={`text-xs font-bold ${
                                  currentTab === "campaign"
                                    ? "text-white"
                                    : "text-gray-500"
                                }`}
                              >
                                4
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-xs font-medium text-center transition-colors ${
                              currentTab === "campaign"
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`}
                          >
                            Campaign
                          </span>
                        </button>

                        {/* Step 5: Review */}
                        <button
                          onClick={() => handleTabChange("review")}
                          className="group relative flex flex-col items-center gap-1 w-full"
                        >
                          <div
                            className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                              completedSteps.includes("review")
                                ? "bg-green-500 border-green-500"
                                : currentTab === "review"
                                  ? "bg-blue-600 border-blue-600"
                                  : "bg-white border-gray-300"
                            }`}
                          >
                            {completedSteps.includes("review") ? (
                              <CheckCircleIcon className="h-5 w-5 text-white" />
                            ) : (
                              <span
                                className={`text-xs font-bold ${
                                  currentTab === "review"
                                    ? "text-white"
                                    : "text-gray-500"
                                }`}
                              >
                                5
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-xs font-medium text-center transition-colors ${
                              currentTab === "review"
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`}
                          >
                            Review
                          </span>
                        </button>
                      </div>
                    </nav>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1">
                <div className="flex gap-3 h-full">
                  {/* Full Width - Form */}
                  <div className="w-full h-full flex flex-col">
                    <Card className="p-0 flex flex-col h-full overflow-hidden shadow-md">
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
                              {currentTab === "redemption" &&
                                "Redemption Method"}
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

                        {/* Action Button */}
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
