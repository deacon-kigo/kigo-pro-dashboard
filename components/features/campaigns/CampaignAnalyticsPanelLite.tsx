"use client";

import React from "react";
import { CampaignCompletionChecklist } from "./CampaignCompletionChecklist";

interface AdCreationPanelLiteProps {
  className?: string;
  currentAdData?: any;
  allAdsData?: any[];
  onAssetUpload?: (mediaType: string, file: File) => void;
  onAssetRemove?: (mediaType: string, assetId: string) => void;
}

export function CampaignAnalyticsPanelLite({
  className,
  currentAdData,
  allAdsData,
  onAssetUpload,
  onAssetRemove,
}: AdCreationPanelLiteProps) {
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
            <h3 className="font-medium">Ad Asset Creation</h3>
            <p className="text-xs text-muted-foreground">
              Create and manage your ad assets
            </p>
          </div>
        </div>
      </div>

      {/* Content - Just the enhanced checklist */}
      <div className="flex-1 overflow-y-auto p-3">
        <CampaignCompletionChecklist
          className="h-full"
          currentAdData={currentAdData}
          allAdsData={allAdsData}
          onAssetUpload={onAssetUpload}
          onAssetRemove={onAssetRemove}
        />
      </div>
    </div>
  );
}
