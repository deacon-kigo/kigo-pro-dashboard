"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { CAMPAIGN_STEPS } from "@/lib/redux/slices/campaignSlice";
import { Badge } from "@/components/atoms/Badge";

interface CampaignCompletionChecklistProps {
  className?: string;
}

export function CampaignCompletionChecklist({
  className = "",
}: CampaignCompletionChecklistProps) {
  // Get campaign state from Redux
  const { formData, stepValidation, currentStep } = useSelector(
    (state: RootState) => state.campaign
  );

  // Calculate completion status
  const completedSteps = Object.values(stepValidation).filter(
    (isValid) => isValid
  ).length;
  const totalSteps = CAMPAIGN_STEPS.length;

  // Helper to truncate long text
  const truncateText = (text: string, maxLength: number = 20) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Helper to render data tag based on data type
  const renderDataTag = (value: any, type: string) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return null;
      return (
        <Badge variant="outline" className="text-xs">
          {type}: {value.length} items
        </Badge>
      );
    }

    if (typeof value === "object") {
      return (
        <Badge variant="outline" className="text-xs">
          {type}: {Object.keys(value).length} fields
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="text-xs">
        {type}: {truncateText(String(value))}
      </Badge>
    );
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-3 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">Completion Checklist</h4>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
          {completedSteps} of {totalSteps} steps
        </span>
      </div>

      <div className="space-y-2">
        {/* Basic Info Step */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <div
              className={`h-5 w-5 rounded-full ${
                stepValidation["basic-info"]
                  ? "bg-green-100"
                  : currentStep === 0
                    ? "bg-blue-100"
                    : "bg-gray-100"
              } flex items-center justify-center mr-2`}
            >
              {stepValidation["basic-info"] ? (
                <svg
                  className="h-3 w-3 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12L10 17L19 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  className={`h-3 w-3 ${
                    currentStep === 0 ? "text-blue-600" : "text-gray-400"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </div>
            <span
              className={`text-xs ${
                currentStep === 0
                  ? "text-blue-700 font-medium"
                  : stepValidation["basic-info"]
                    ? ""
                    : "text-gray-500"
              }`}
            >
              Campaign information
            </span>
          </div>
          {/* Data tags for basic info */}
          {stepValidation["basic-info"] && (
            <div className="ml-7 mt-1 flex flex-wrap gap-1">
              {renderDataTag(formData.basicInfo.name, "Name")}
              {renderDataTag(formData.basicInfo.description, "Desc")}
            </div>
          )}
        </div>

        {/* Campaign Settings Step (combines targeting, distribution, budget) */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <div
              className={`h-5 w-5 rounded-full ${
                stepValidation["campaign-settings"]
                  ? "bg-green-100"
                  : currentStep === 1
                    ? "bg-blue-100"
                    : "bg-gray-100"
              } flex items-center justify-center mr-2`}
            >
              {stepValidation["campaign-settings"] ? (
                <svg
                  className="h-3 w-3 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12L10 17L19 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  className={`h-3 w-3 ${
                    currentStep === 1 ? "text-blue-600" : "text-gray-400"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </div>
            <span
              className={`text-xs ${
                currentStep === 1
                  ? "text-blue-700 font-medium"
                  : stepValidation["campaign-settings"]
                    ? ""
                    : "text-gray-500"
              }`}
            >
              Campaign settings
            </span>
          </div>
          {/* Data tags for campaign settings */}
          {stepValidation["campaign-settings"] && (
            <div className="ml-7 mt-1 flex flex-wrap gap-1">
              {/* Targeting data */}
              {renderDataTag(formData.targeting.startDate, "Start")}
              {renderDataTag(formData.targeting.endDate, "End")}
              {renderDataTag(formData.targeting.locations, "Locations")}
              {renderDataTag(formData.targeting.campaignWeight, "Weight")}

              {/* Distribution data */}
              {renderDataTag(formData.distribution.channels, "Channels")}
              {renderDataTag(formData.distribution.programs, "Programs")}

              {/* Budget data */}
              {renderDataTag(`$${formData.budget.maxBudget}`, "Budget")}
              {formData.budget.estimatedReach && (
                <Badge variant="outline" className="text-xs">
                  Reach: {formData.budget.estimatedReach.toLocaleString()}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Ad Creation Step */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <div
              className={`h-5 w-5 rounded-full ${
                stepValidation["ad-creation"] && formData.ads.length > 0
                  ? "bg-green-100"
                  : currentStep === 2
                    ? "bg-blue-100"
                    : "bg-gray-100"
              } flex items-center justify-center mr-2`}
            >
              {stepValidation["ad-creation"] && formData.ads.length > 0 ? (
                <svg
                  className="h-3 w-3 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12L10 17L19 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  className={`h-3 w-3 ${
                    currentStep === 2 ? "text-blue-600" : "text-gray-400"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </div>
            <span
              className={`text-xs ${
                currentStep === 2
                  ? "text-blue-700 font-medium"
                  : stepValidation["ad-creation"] && formData.ads.length > 0
                    ? ""
                    : "text-gray-500"
              }`}
            >
              Ad creation
            </span>
          </div>
          {/* Data tags for ads */}
          {formData.ads.length > 0 && (
            <div className="ml-7 mt-1 flex flex-wrap gap-1">
              {formData.ads.map((ad, index) => (
                <Badge key={ad.id} variant="outline" className="text-xs">
                  Ad #{index + 1}: {truncateText(ad.merchantName, 10)}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Review Step */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <div
              className={`h-5 w-5 rounded-full ${
                stepValidation["review"]
                  ? "bg-green-100"
                  : currentStep === 3
                    ? "bg-blue-100"
                    : "bg-gray-100"
              } flex items-center justify-center mr-2`}
            >
              {stepValidation["review"] ? (
                <svg
                  className="h-3 w-3 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12L10 17L19 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  className={`h-3 w-3 ${
                    currentStep === 3 ? "text-blue-600" : "text-gray-400"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </div>
            <span
              className={`text-xs ${
                currentStep === 3
                  ? "text-blue-700 font-medium"
                  : stepValidation["review"]
                    ? ""
                    : "text-gray-500"
              }`}
            >
              Final review
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
