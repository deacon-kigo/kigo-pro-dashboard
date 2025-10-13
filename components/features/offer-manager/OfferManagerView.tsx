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

interface OfferManagerState {
  messages?: any[];
  business_objective?: string;
  program_type?: string;
  offer_config?: any;
  campaign_setup?: any;
  workflow_step?: string;
  validation_results?: any[];
  progress_percentage?: number;
  current_phase?: string;
  pending_action?: any;
  approval_status?: string;
  requires_approval?: boolean;
}

export default function OfferManagerView() {
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

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
        {/* Header with gradient background */}
        <div
          className="relative overflow-hidden rounded-lg mb-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(226, 240, 253, 0.9), rgba(226, 232, 255, 0.85))",
            borderRadius: "0.75rem",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.03)",
          }}
        >
          <div className="relative p-6 z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-50 border border-blue-200">
                  <GiftIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-blue-600 mb-1">
                    Offer Manager
                  </h1>
                  <p className="text-sm text-blue-500">
                    Create AI-powered promotional offers with intelligent
                    recommendations
                  </p>
                </div>
              </div>
              {!isCreatingOffer && (
                <Button
                  onClick={handleStartCreation}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm flex items-center gap-2"
                >
                  <SparklesIcon className="h-4 w-4" />
                  Create New Offer
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        {!isCreatingOffer ? (
          // Dashboard view - show recent offers and quick stats
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">
                  Active Offers
                </h3>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-50">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">0</p>
              <p className="text-xs text-gray-500">Currently running</p>
            </Card>

            <Card className="p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">
                  Draft Offers
                </h3>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-50">
                  <ClockIcon className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">0</p>
              <p className="text-xs text-gray-500">Pending approval</p>
            </Card>

            <Card className="p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">
                  Total Reach
                </h3>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50">
                  <SparklesIcon className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">0</p>
              <p className="text-xs text-gray-500">Users engaged</p>
            </Card>
          </div>
        ) : (
          // Offer creation workflow
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Tracker */}
              <OfferProgressTracker
                currentStep={state?.workflow_step || "goal_setting"}
                progress={state?.progress_percentage || 0}
              />

              {/* Creation Form */}
              <OfferCreationForm
                currentStep={state?.workflow_step || "goal_setting"}
                businessObjective={state?.business_objective || ""}
                programType={state?.program_type || "general"}
                offerConfig={state?.offer_config || {}}
                campaignSetup={state?.campaign_setup || {}}
                onUpdate={(updates) => {
                  setState((prevState: OfferManagerState) => ({
                    ...prevState,
                    ...updates,
                  }));
                }}
              />
            </div>

            {/* AI Recommendations - 1 column */}
            <div className="lg:col-span-1">
              <OfferRecommendations
                businessObjective={state?.business_objective || ""}
                programType={state?.program_type || "general"}
                currentStep={state?.workflow_step || "goal_setting"}
              />
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
