"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  CAMPAIGN_STEPS,
  addAd,
  setCurrentStep,
} from "@/lib/redux/slices/campaignSlice";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import {
  ChevronRight,
  Plus,
  ImagePlus,
  CheckCircle,
  AlertCircle,
  X,
  ChevronDown,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CampaignCompletionChecklistProps {
  className?: string;
  onStartNewAd?: () => void;
}

export function CampaignCompletionChecklist({
  className = "",
  onStartNewAd,
}: CampaignCompletionChecklistProps) {
  // Get campaign state from Redux
  const { formData, stepValidation, currentStep } = useSelector(
    (state: RootState) => state.campaign
  );
  const dispatch = useDispatch();

  // Local state for expanded ad details
  const [adsExpanded, setAdsExpanded] = useState(false);
  const [expandedAdId, setExpandedAdId] = useState<string | null>(null);

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

  // Navigate to ad creation step
  const goToAdCreationStep = () => {
    // Find the index of the ad creation step
    const adCreationStepIndex = CAMPAIGN_STEPS.findIndex(
      (step) => step.id === "ad-creation"
    );
    if (adCreationStepIndex !== -1) {
      dispatch(setCurrentStep(adCreationStepIndex));
    }

    // If provided, call the onStartNewAd callback
    if (onStartNewAd) {
      onStartNewAd();
    }
  };

  // Get media type label
  const getMediaTypeLabel = (typeId: string): string => {
    const mediaTypes = {
      display_banner: "Display Banner",
      double_decker: "Double Decker",
      native: "Native (No Image)",
    };

    return mediaTypes[typeId as keyof typeof mediaTypes] || typeId;
  };

  // Handle toggling the expanded state of an ad
  const toggleAdExpand = (adId: string) => {
    setExpandedAdId(expandedAdId === adId ? null : adId);
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-3 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium">Completion Checklist</h4>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
          {completedSteps} of {totalSteps} steps
        </span>
      </div>

      <div className="space-y-3">
        {/* Campaign Information Step */}
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

        {/* Ad Creation Step - Enhanced with collapsible detailed view */}
        <Collapsible
          open={adsExpanded}
          onOpenChange={setAdsExpanded}
          className="w-full border rounded-md overflow-hidden"
        >
          <div className="bg-muted/20 p-2">
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div
                  className={`h-5 w-5 rounded-full ${
                    formData.ads.length > 0
                      ? "bg-green-100"
                      : currentStep === 1
                        ? "bg-blue-100"
                        : "bg-gray-100"
                  } flex items-center justify-center mr-2`}
                >
                  {formData.ads.length > 0 ? (
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
                      : formData.ads.length > 0
                        ? ""
                        : "text-gray-500"
                  }`}
                >
                  Campaign Assets{" "}
                  {formData.ads.length > 0 && `(${formData.ads.length})`}
                </span>
              </div>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${adsExpanded ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <div className="p-2">
              {formData.ads.length === 0 ? (
                <div className="flex flex-col items-center py-4">
                  <div className="bg-primary/10 rounded-full p-2 mb-2">
                    <ImagePlus className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-xs text-center text-muted-foreground mb-2">
                    No assets added yet
                  </p>
                  <Button
                    size="sm"
                    className="text-xs h-7"
                    onClick={goToAdCreationStep}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Asset
                  </Button>
                </div>
              ) : (
                <ScrollArea className={formData.ads.length > 3 ? "h-48" : ""}>
                  <div className="space-y-2">
                    {formData.ads.map((ad, index) => (
                      <div
                        key={ad.id}
                        className="border rounded bg-white overflow-hidden"
                      >
                        <div
                          className="p-2 flex items-center justify-between cursor-pointer"
                          onClick={() => toggleAdExpand(ad.id)}
                        >
                          <div className="flex items-center">
                            <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-xs mr-2">
                              {index + 1}
                            </div>
                            <span className="text-xs font-medium">
                              {truncateText(ad.merchantName, 15)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Badge
                              variant={
                                ad.mediaAssets.length > 0
                                  ? "success"
                                  : "destructive"
                              }
                              className="text-[10px] h-5 mr-1"
                            >
                              {ad.mediaAssets.length} Assets
                            </Badge>
                            <ChevronRight
                              className={`h-3.5 w-3.5 transition-transform ${
                                expandedAdId === ad.id ? "rotate-90" : ""
                              }`}
                            />
                          </div>
                        </div>

                        {expandedAdId === ad.id && (
                          <div className="p-2 pt-0 border-t bg-muted/5">
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-1">
                              <div className="text-[10px] text-muted-foreground">
                                Merchant:
                              </div>
                              <div className="text-[10px] truncate">
                                {ad.merchantName}
                              </div>

                              <div className="text-[10px] text-muted-foreground">
                                Offer ID:
                              </div>
                              <div className="text-[10px] truncate">
                                {ad.offerId}
                              </div>

                              <div className="text-[10px] text-muted-foreground">
                                Media Types:
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {ad.mediaType.map((type) => (
                                  <Badge
                                    key={type}
                                    variant="outline"
                                    className="text-[10px] h-4 px-1"
                                  >
                                    {getMediaTypeLabel(type)}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="mt-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-medium">
                                  Media Status
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-5 text-[10px] p-0 px-1"
                                  onClick={goToAdCreationStep}
                                >
                                  Edit
                                </Button>
                              </div>

                              {ad.mediaAssets.length === 0 ? (
                                <div className="flex items-center text-xs text-red-500">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  <span className="text-[10px]">
                                    Media uploads required
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center text-xs text-green-500">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  <span className="text-[10px]">
                                    {ad.mediaAssets.length} media assets
                                    uploaded
                                  </span>
                                </div>
                              )}

                              {ad.mediaAssets.length > 0 && (
                                <div className="flex mt-1 gap-1 overflow-x-auto">
                                  {ad.mediaAssets.slice(0, 3).map((asset) => (
                                    <div
                                      key={asset.id}
                                      className="h-8 w-8 border rounded-sm flex-shrink-0 bg-muted"
                                    >
                                      {asset.type.startsWith("image/") && (
                                        <img
                                          src={asset.previewUrl}
                                          alt={asset.name}
                                          className="h-full w-full object-cover"
                                        />
                                      )}
                                    </div>
                                  ))}
                                  {ad.mediaAssets.length > 3 && (
                                    <div className="h-8 w-8 border rounded-sm flex-shrink-0 bg-muted flex items-center justify-center">
                                      <span className="text-[10px] text-muted-foreground">
                                        +{ad.mediaAssets.length - 3}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs w-full"
                      onClick={goToAdCreationStep}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Another Asset
                    </Button>
                  </div>
                </ScrollArea>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Target, Distribution & Budget Step */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <div
              className={`h-5 w-5 rounded-full ${
                stepValidation["targeting-distribution-budget"]
                  ? "bg-green-100"
                  : currentStep === 2
                    ? "bg-blue-100"
                    : "bg-gray-100"
              } flex items-center justify-center mr-2`}
            >
              {stepValidation["targeting-distribution-budget"] ? (
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
                  : stepValidation["targeting-distribution-budget"]
                    ? ""
                    : "text-gray-500"
              }`}
            >
              Target & Budget
            </span>
          </div>
          {/* Data tags for targeting, distribution, budget */}
          {stepValidation["targeting-distribution-budget"] && (
            <div className="ml-7 mt-1 flex flex-wrap gap-1">
              {/* Targeting */}
              {renderDataTag(formData.targeting.locations, "Locations")}
              {renderDataTag(formData.targeting.campaignWeight, "Weight")}

              {/* Distribution */}
              {renderDataTag(formData.distribution.channels, "Channels")}
              {renderDataTag(formData.distribution.programs, "Programs")}

              {/* Budget */}
              {renderDataTag(`$${formData.budget.maxBudget}`, "Budget")}
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
