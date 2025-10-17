"use client";

import React, { useState } from "react";
import { ThinkingSteps } from "./ThinkingSteps";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface ThinkingStep {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed";
  reasoning?: string;
  result?: any;
}

interface AgentState {
  current_phase?: string;
  thinking_steps?: ThinkingStep[];
  recommendations?: {
    offerType?: string;
    offerValue?: number;
    reasoning?: string;
  };
  requires_approval?: boolean;
  pending_action?: string;
  validation_results?: Array<{
    field: string;
    status: "valid" | "invalid" | "warning";
    message: string;
  }>;
}

interface OfferAgentStateRendererProps {
  state?: AgentState;
}

export function OfferAgentStateRenderer({
  state,
}: OfferAgentStateRendererProps) {
  // If no state provided, don't render anything
  if (!state) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Thinking Steps */}
      {state.thinking_steps && state.thinking_steps.length > 0 && (
        <ThinkingSteps
          steps={state.thinking_steps}
          currentPhase={state.current_phase || "Analyzing..."}
        />
      )}

      {/* Recommendations */}
      {state.recommendations && (
        <RecommendationCard recommendations={state.recommendations} />
      )}

      {/* Validation Results */}
      {state.validation_results && state.validation_results.length > 0 && (
        <ValidationResultsCard validations={state.validation_results} />
      )}

      {/* Approval Required */}
      {state.requires_approval && (
        <ApprovalCard
          actionName={state.pending_action || "Action"}
          onApprove={() => console.log("Approved")}
          onReject={() => console.log("Rejected")}
        />
      )}
    </div>
  );
}

function RecommendationCard({ recommendations }: { recommendations: any }) {
  return (
    <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex-shrink-0">
          <CheckCircleIcon className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-bold text-gray-900 mb-2">
            AI Recommendation
          </h4>

          {recommendations.offerType && (
            <div className="mb-2">
              <span className="text-xs text-gray-600">
                Suggested Offer Type:
              </span>
              <div className="text-sm font-semibold text-gray-900">
                {recommendations.offerType}
              </div>
            </div>
          )}

          {recommendations.offerValue && (
            <div className="mb-2">
              <span className="text-xs text-gray-600">Recommended Value:</span>
              <div className="text-sm font-semibold text-gray-900">
                {recommendations.offerValue}%
              </div>
            </div>
          )}

          {recommendations.reasoning && (
            <div className="mt-3 p-3 bg-white/60 rounded-lg">
              <div className="text-xs font-semibold text-gray-700 mb-1">
                Why this works:
              </div>
              <div className="text-xs text-gray-700">
                {recommendations.reasoning}
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              Apply Recommendation
            </Button>
            <Button size="sm" variant="outline">
              Customize
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ValidationResultsCard({
  validations,
}: {
  validations: Array<{
    field: string;
    status: "valid" | "invalid" | "warning";
    message: string;
  }>;
}) {
  const hasErrors = validations.some((v) => v.status === "invalid");
  const hasWarnings = validations.some((v) => v.status === "warning");

  return (
    <Card
      className={`p-4 border-2 ${
        hasErrors
          ? "bg-red-50 border-red-200"
          : hasWarnings
            ? "bg-yellow-50 border-yellow-200"
            : "bg-green-50 border-green-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${
            hasErrors
              ? "bg-red-600"
              : hasWarnings
                ? "bg-yellow-600"
                : "bg-green-600"
          }`}
        >
          {hasErrors || hasWarnings ? (
            <ExclamationTriangleIcon className="w-5 h-5 text-white" />
          ) : (
            <CheckCircleIcon className="w-5 h-5 text-white" />
          )}
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-bold text-gray-900 mb-3">
            {hasErrors
              ? "Validation Issues"
              : hasWarnings
                ? "Warnings"
                : "Validation Passed"}
          </h4>

          <div className="space-y-2">
            {validations.map((validation, index) => (
              <div
                key={index}
                className="text-sm flex items-start gap-2 bg-white/60 rounded p-2"
              >
                <span
                  className={`flex-shrink-0 w-2 h-2 mt-1.5 rounded-full ${
                    validation.status === "invalid"
                      ? "bg-red-500"
                      : validation.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                />
                <div>
                  <span className="font-medium text-gray-900">
                    {validation.field}:
                  </span>{" "}
                  <span className="text-gray-700">{validation.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function ApprovalCard({
  actionName,
  onApprove,
  onReject,
}: {
  actionName: string;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex-shrink-0 animate-pulse">
          <SparklesIcon className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-bold text-gray-900 mb-2">
            🤚 Human Approval Required
          </h4>

          <p className="text-sm text-gray-700 mb-4">
            I'm ready to proceed with: <strong>{actionName}</strong>
          </p>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onApprove}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              Approve & Continue
            </Button>
            <Button size="sm" variant="outline" onClick={onReject}>
              <span className="text-red-600">Reject</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
