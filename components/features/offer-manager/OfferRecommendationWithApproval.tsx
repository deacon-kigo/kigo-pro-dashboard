"use client";

import React, { useState } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import {
  ThinkingSteps,
  Step,
} from "@/components/features/offer-manager/ThinkingSteps";
import { ApprovalCard } from "@/components/features/offer-manager/ApprovalCard";
import {
  OfferConfigurationCard,
  type OfferConfiguration,
} from "@/components/features/offer-manager/OfferConfigurationCard";
import { Card } from "@/components/ui/card";
import { CheckCircleIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  startAgentMode,
  setActiveField,
  markFieldComplete,
  updateAgentMessage,
  stopAgentMode,
} from "@/lib/redux/slices/agentModeSlice";
import { setFormData as setOfferFormData } from "@/lib/redux/slices/offerManagerSlice";

export interface OfferRecommendationProps {
  businessObjective: string;
  programType: string;
  status: "inProgress" | "complete";
  recommendedOfferType?: string;
  recommendedValue?: string;
  reasoning?: string;
}

/**
 * Complete offer recommendation display with thinking steps and human-in-the-loop approval
 * Rendered in chat UI as generative UI component
 */
export function OfferRecommendationWithApproval({
  businessObjective,
  programType,
  status,
  recommendedOfferType = "Discount Percentage (15% off)",
  recommendedValue = "15%",
  reasoning = "Based on historical data, a 15% discount drives optimal incremental revenue while maintaining healthy margins. This value converts 23% better than smaller discounts for this goal.",
}: OfferRecommendationProps) {
  const dispatch = useAppDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [showConfiguration, setShowConfiguration] = useState(false);

  // Generate dynamic thinking steps based on business objective
  const generateThinkingSteps = (): Step[] => {
    const objective_lower = businessObjective.toLowerCase();
    const isParts = objective_lower.includes("part");
    const isEngagement = objective_lower.includes("engagement");
    const isTraffic = objective_lower.includes("traffic");
    const hasTarget = /(\d+)%/.test(businessObjective);

    const steps: Step[] = [
      {
        id: "step-1",
        title: "Understanding Business Context",
        status: status === "complete" ? "completed" : "in_progress",
        reasoning: `Analyzing "${businessObjective}" for ${programType === "closed_loop" ? "dealer network" : "marketplace"} program`,
      },
    ];

    // Add context-specific analysis steps
    if (hasTarget) {
      steps.push({
        id: "step-2",
        title: "Analyzing Target Metrics",
        status: status === "complete" ? "completed" : "pending",
        reasoning:
          "Calculating offer value to align with your specific growth target",
      });
    } else if (isParts) {
      steps.push({
        id: "step-2",
        title: "Reviewing Parts Sales Data",
        status: status === "complete" ? "completed" : "pending",
        reasoning:
          "Analyzing historical parts campaign performance in dealer networks",
      });
    } else if (isEngagement) {
      steps.push({
        id: "step-2",
        title: "Evaluating Engagement Strategies",
        status: status === "complete" ? "completed" : "pending",
        reasoning:
          "Comparing discount vs loyalty point approaches for retention",
      });
    } else if (isTraffic) {
      steps.push({
        id: "step-2",
        title: "Analyzing Traffic Patterns",
        status: status === "complete" ? "completed" : "pending",
        reasoning:
          "Identifying time-sensitive offer strategies for foot traffic",
      });
    } else {
      steps.push({
        id: "step-2",
        title: "Researching Historical Performance",
        status: status === "complete" ? "completed" : "pending",
        reasoning: "Reviewing similar campaigns to identify success patterns",
      });
    }

    steps.push({
      id: "step-3",
      title: "Determining Optimal Configuration",
      status: status === "complete" ? "completed" : "pending",
      reasoning:
        programType === "closed_loop"
          ? "Optimizing for dealer network performance and POS integration"
          : "Balancing tenant value with merchant catalog coordination",
    });

    return steps;
  };

  const thinking_steps = generateThinkingSteps();

  const handleApprove = async () => {
    setIsProcessing(true);
    setIsApproved(true);

    // Show configuration UI instead of immediately messaging AI
    setTimeout(() => {
      setShowConfiguration(true);
      setIsProcessing(false);
    }, 500);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    // TODO: Implement rejection flow - could show adjustment UI or reset to earlier state
    alert("Adjustment flow not yet implemented. Please start over.");
    setIsProcessing(false);
  };

  const handleConfigurationComplete = async (config: OfferConfiguration) => {
    setIsProcessing(true);

    // Directly trigger agent mode and fill the form
    try {
      // Calculate total fields to fill
      const fieldsToFill = [
        "businessObjective",
        "programType",
        "offerType",
        "offerValue",
        config.title && "offerTitle",
        config.description && "offerDescription",
        config.termsAndConditions && "termsConditions",
        config.redemptionMethod && "redemptionMethod",
      ].filter(Boolean);

      // Start agent mode
      dispatch(
        startAgentMode({
          total: fieldsToFill.length,
          message: "Configuring your offer with AI...",
        })
      );

      // Fill fields one by one with delays for visual effect
      const fillField = async (
        fieldId: string,
        value: string,
        label: string
      ) => {
        dispatch(setActiveField(fieldId));
        dispatch(updateAgentMessage(`Filling ${label}...`));

        // Wait for animation
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Update form data
        dispatch(setOfferFormData({ [fieldId]: value }));

        // Mark as complete
        dispatch(markFieldComplete(fieldId));

        // Brief pause before next field
        await new Promise((resolve) => setTimeout(resolve, 400));
      };

      // Fill each field sequentially
      await fillField(
        "businessObjective",
        businessObjective,
        "Business Objective"
      );
      await fillField("programType", programType, "Program Type");
      await fillField("offerType", config.offerType, "Offer Type");
      await fillField("offerValue", config.value, "Offer Value");

      if (config.title) {
        await fillField("offerTitle", config.title, "Offer Title");
      }

      if (config.description) {
        await fillField(
          "offerDescription",
          config.description,
          "Offer Description"
        );
      }

      if (config.termsAndConditions) {
        await fillField(
          "termsConditions",
          config.termsAndConditions,
          "Terms & Conditions"
        );
      }

      if (config.redemptionMethod) {
        await fillField(
          "redemptionMethod",
          config.redemptionMethod,
          "Redemption Method"
        );
      }

      // Complete agent mode
      dispatch(updateAgentMessage("Configuration complete! ✓"));
      await new Promise((resolve) => setTimeout(resolve, 1500));
      dispatch(stopAgentMode());
    } catch (error) {
      console.error("Error filling configuration:", error);
      dispatch(stopAgentMode());
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfigurationCancel = () => {
    setShowConfiguration(false);
    setIsApproved(false);
  };

  return (
    <div className="space-y-4 my-4">
      {/* Thinking Steps - Only show if configuration is not open */}
      {!showConfiguration && (
        <ThinkingSteps
          steps={thinking_steps}
          currentPhase="Analyzing your objective"
        />
      )}

      {/* Recommendation Card - Only show when complete and not showing configuration */}
      {status === "complete" && !showConfiguration && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 2.1 }}
          >
            <Card
              className="p-4 border border-emerald-200 shadow-sm"
              style={{ backgroundColor: "#ECFDF5" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-lg shadow-md flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(to bottom right, #059669, #10B981)",
                  }}
                >
                  <SparklesIcon
                    className="w-5 h-5"
                    style={{ color: "#FFFFFF" }}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    💡 AI Recommendation
                  </h4>
                  <div className="mb-2">
                    <span className="text-xs text-gray-600">Offer Type:</span>
                    <div className="text-sm font-semibold text-gray-900">
                      {recommendedOfferType}
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-white/80 rounded-lg border border-emerald-100">
                    <div className="text-xs text-gray-700">{reasoning}</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Human-in-the-Loop Approval */}
          {!isApproved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 3.1 }}
            >
              <ApprovalCard
                title="Sound good?"
                description="Does this recommendation work for you? Click continue to configure the offer details."
                onApprove={handleApprove}
                onReject={handleReject}
                isProcessing={isProcessing}
                approveText="Yes, continue"
                rejectText="Let me adjust"
              />
            </motion.div>
          )}

          {/* Approved State (brief confirmation before showing configuration) */}
          {isApproved && !showConfiguration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Card
                className="p-4 border border-green-300 shadow-sm"
                style={{ backgroundColor: "#F0FDF4" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg shadow-md flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(to bottom right, #059669, #10B981)",
                    }}
                  >
                    <CheckCircleIcon
                      className="w-5 h-5"
                      style={{ color: "#FFFFFF" }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    ✓ Great! Loading configuration...
                  </span>
                </div>
              </Card>
            </motion.div>
          )}
        </>
      )}

      {/* Offer Configuration UI */}
      <AnimatePresence mode="wait">
        {showConfiguration && (
          <OfferConfigurationCard
            offerType={recommendedOfferType}
            initialValue={recommendedValue.replace(/[^0-9.]/g, "")}
            programType={programType}
            businessObjective={businessObjective}
            onComplete={handleConfigurationComplete}
            onCancel={handleConfigurationCancel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
