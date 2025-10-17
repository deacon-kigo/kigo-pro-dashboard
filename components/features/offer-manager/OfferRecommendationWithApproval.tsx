"use client";

import React, { useState } from "react";
import { useCopilotContext } from "@copilotkit/react-core";
import {
  ThinkingSteps,
  Step,
} from "@/components/features/offer-manager/ThinkingSteps";
import { ApprovalCard } from "@/components/features/offer-manager/ApprovalCard";
import { Card } from "@/components/ui/card";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

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
  const context = useCopilotContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const thinking_steps: Step[] = [
    {
      id: "step-1",
      title: "Understanding Business Context",
      status: status === "complete" ? "completed" : "in_progress",
      reasoning: `Analyzing objective: "${businessObjective}" for ${programType} program`,
    },
    {
      id: "step-2",
      title: "Researching Historical Performance",
      status: status === "complete" ? "completed" : "pending",
      reasoning: "Reviewing similar campaigns to identify success patterns",
    },
    {
      id: "step-3",
      title: "Calculating Optimal Offer Value",
      status: status === "complete" ? "completed" : "pending",
      reasoning: "Running predictive models to find the sweet spot for ROI",
    },
  ];

  const handleApprove = async () => {
    setIsProcessing(true);
    setIsApproved(true);

    // Send approval message to AI to continue workflow
    try {
      await context.appendMessage({
        role: "user",
        content: `Approved! I'd like to proceed with the ${recommendedOfferType} recommendation. Please continue with campaign creation.`,
      });
    } catch (error) {
      console.error("Error sending approval:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);

    // Send rejection message to AI for refinement
    try {
      await context.appendMessage({
        role: "user",
        content:
          "I'd like to make some changes to this recommendation. Can you help me adjust the offer parameters?",
      });
    } catch (error) {
      console.error("Error sending rejection:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-3 my-4">
      {/* Thinking Steps */}
      <ThinkingSteps
        steps={thinking_steps}
        currentPhase="Analyzing your objective"
      />

      {/* Recommendation Card - Only show when complete */}
      {status === "complete" && (
        <>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex-shrink-0">
                <CheckCircleIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-900 mb-2">
                  💡 AI Recommendation
                </h4>
                <div className="mb-2">
                  <span className="text-xs text-gray-600">Offer Type:</span>
                  <div className="text-sm font-semibold text-gray-900">
                    {recommendedOfferType}
                  </div>
                </div>
                <div className="mt-3 p-3 bg-white/60 rounded-lg">
                  <div className="text-xs text-gray-700">{reasoning}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Human-in-the-Loop Approval */}
          {!isApproved && (
            <ApprovalCard
              title="Approve Recommendation?"
              description="I see you just created this offer. Would you like to create a campaign for this offer?"
              onApprove={handleApprove}
              onReject={handleReject}
              isProcessing={isProcessing}
              approveText="Yes, Create Campaign"
              rejectText="Modify Offer"
            />
          )}

          {/* Approved State */}
          {isApproved && (
            <Card className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-900">
                  ✓ Approved - Proceeding with campaign creation
                </span>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
