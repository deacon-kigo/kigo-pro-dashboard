"use client";

import React from "react";

interface CampaignAnalyticsPanelProps {
  className?: string;
  campaignBudget?: number;
  estimatedReach?: number;
}

export function CampaignAnalyticsPanel({
  className,
  campaignBudget = 5000,
  estimatedReach = 100000,
}: CampaignAnalyticsPanelProps) {
  return (
    <div className={`flex flex-col w-full h-full ${className}`}>
      {/* Header - Fixed at exactly 61px to match AI Assistant header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 mr-2 text-primary"
          >
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6" y2="6"></line>
            <line x1="6" y1="18" x2="6" y2="18"></line>
          </svg>
          <div>
            <h3 className="font-medium">Campaign Summary</h3>
            <p className="text-xs text-muted-foreground">
              Projected metrics based on your campaign setup
            </p>
          </div>
        </div>
      </div>

      {/* Content - Scrollable area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Completion Checklist */}
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Completion Checklist</h4>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                2 of 6 steps
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
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
                </div>
                <span className="text-xs">Campaign information</span>
              </div>
              <div className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <svg
                    className="h-3 w-3 text-blue-600"
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
                </div>
                <span className="text-xs text-blue-700 font-medium">
                  Target audience (in progress)
                </span>
              </div>
              <div className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                  <svg
                    className="h-3 w-3 text-gray-400"
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
                </div>
                <span className="text-xs text-gray-500">
                  Distribution channels
                </span>
              </div>
              <div className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                  <svg
                    className="h-3 w-3 text-gray-400"
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
                </div>
                <span className="text-xs text-gray-500">Ad creation</span>
              </div>
              <div className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                  <svg
                    className="h-3 w-3 text-gray-400"
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
                </div>
                <span className="text-xs text-gray-500">Budget allocation</span>
              </div>
              <div className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                  <svg
                    className="h-3 w-3 text-gray-400"
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
                </div>
                <span className="text-xs text-gray-500">Final review</span>
              </div>
            </div>
          </div>

          {/* Current Step Impact */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-3">
            <h4 className="text-sm font-medium mb-2 text-blue-800">
              Targeting Recommendations
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 rounded-full bg-blue-200 flex-shrink-0 mt-0.5 flex items-center justify-center">
                  <svg
                    className="h-2.5 w-2.5 text-blue-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs text-blue-800">
                  Adding specific geographic targeting can increase relevance by
                  up to 40%
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 rounded-full bg-blue-200 flex-shrink-0 mt-0.5 flex items-center justify-center">
                  <svg
                    className="h-2.5 w-2.5 text-blue-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs text-blue-800">
                  Consider adding demographic targeting for 25-34 age group to
                  maximize engagement
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 rounded-full bg-blue-200 flex-shrink-0 mt-0.5 flex items-center justify-center">
                  <svg
                    className="h-2.5 w-2.5 text-blue-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs text-blue-800">
                  Combine geographic and demographic targeting to potentially
                  reduce cost per acquisition
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div>
            <h4 className="text-sm font-medium mb-2">Projected Metrics</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-gray-100 p-3">
                <div className="text-xs font-medium text-gray-600">Budget</div>
                <div className="mt-1 text-lg font-bold">
                  ${campaignBudget.toLocaleString()}
                </div>
              </div>
              <div className="rounded-lg bg-gray-100 p-3">
                <div className="text-xs font-medium text-gray-600">
                  Est. Reach
                </div>
                <div className="mt-1 text-lg font-bold">
                  {estimatedReach.toLocaleString()}
                </div>
              </div>
              <div className="rounded-lg bg-gray-100 p-3">
                <div className="text-xs font-medium text-gray-600">
                  Est. CPA
                </div>
                <div className="mt-1 text-lg font-bold">
                  ${(campaignBudget / (estimatedReach * 0.02)).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          These metrics are estimated based on similar campaign performance and
          may vary
        </div>
      </div>
    </div>
  );
}
