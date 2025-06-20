"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  CAMPAIGN_STEPS,
  addAd,
  setCurrentStep,
  updateAd,
  addMediaToAd,
  removeMediaFromAd,
  MediaAsset,
} from "@/lib/redux/slices/campaignSlice";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import PromotionWidget from "@/components/features/campaigns/PromotionWidget";
import { AdPreviewModal } from "./AdPreviewModal";
import { AnimatedList, AnimatedListItem } from "@/components/ui/animated-list";
import {
  ChevronRight,
  Plus,
  ImagePlus,
  CheckCircle,
  AlertCircle,
  X,
  ChevronDown,
  Eye,
  MoreHorizontal,
  Target,
  DollarSign,
  FileText,
  Layers,
  Clock,
  ArrowRight,
  Share2,
} from "lucide-react";

interface CampaignCompletionChecklistProps {
  className?: string;
  onStartNewAd?: () => void;
  currentAdData?: any;
  allAdsData?: any[];
  onAssetUpload?: (mediaType: string, file: File) => void;
  onAssetRemove?: (mediaType: string, assetId: string) => void;
}

export function CampaignCompletionChecklist({
  className = "",
  onStartNewAd,
  currentAdData,
  allAdsData,
  onAssetUpload,
  onAssetRemove,
}: CampaignCompletionChecklistProps) {
  // Get campaign state from Redux
  const { formData, stepValidation, currentStep } = useSelector(
    (state: RootState) => state.campaign
  );
  const dispatch = useDispatch();

  // Modal state for ad preview
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedAdForPreview, setSelectedAdForPreview] = useState<any>(null);

  // Memoize the mock ad data to prevent infinite loops
  const mockAdData = useMemo(() => {
    if (!currentAdData?.isValid) return null;

    const allAssets = Object.values(
      currentAdData.mediaAssetsByType || {}
    ).flat();
    return {
      id: "live-preview",
      merchantName: currentAdData.merchantName,
      offerId: currentAdData.offerId,
      mediaType: currentAdData.mediaTypes || [],
      mediaAssets: allAssets,
      mediaAssetsByType: currentAdData.mediaAssetsByType || {},
    };
  }, [
    currentAdData?.isValid,
    currentAdData?.merchantName,
    currentAdData?.offerId,
    currentAdData?.mediaTypes,
    currentAdData?.mediaAssetsByType,
  ]);

  // Debug modal state changes (but only log when modal actually opens/closes)
  useEffect(() => {
    if (previewModalOpen || selectedAdForPreview) {
      console.log("Modal state changed:", {
        previewModalOpen,
        selectedAdForPreview: !!selectedAdForPreview,
      });
    }
  }, [previewModalOpen, selectedAdForPreview?.id]); // Only depend on the ID to prevent object comparison issues

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

  // Navigate to specific step
  const goToStep = useCallback(
    (stepIndex: number) => {
      dispatch(setCurrentStep(stepIndex));
    },
    [dispatch]
  );

  // Handle opening ad preview modal
  const handleAdPreview = useCallback((ad: any, event?: React.MouseEvent) => {
    console.log("handleAdPreview called with ad:", ad?.id);

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!ad) {
      console.error("No ad provided to handleAdPreview");
      return;
    }

    setSelectedAdForPreview(ad);
    setPreviewModalOpen(true);
  }, []);

  // Handle closing ad preview modal
  const handleClosePreview = useCallback(() => {
    setPreviewModalOpen(false);
    setSelectedAdForPreview(null);
  }, []);

  // Handle asset upload from modal - for specific ad editing
  const handleAssetUpload = useCallback(
    (mediaType: string, file: File) => {
      if (selectedAdForPreview && selectedAdForPreview.id) {
        // Create new media asset
        const newAsset: MediaAsset = {
          id: uuidv4(),
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
          previewUrl: URL.createObjectURL(file),
          mediaType: mediaType,
        };

        // Add to specific ad in Redux store
        dispatch(
          addMediaToAd({ adId: selectedAdForPreview.id, media: newAsset })
        );
      } else if (onAssetUpload) {
        // Fallback to parent handler for current ad being created
        onAssetUpload(mediaType, file);
      }
    },
    [selectedAdForPreview, dispatch, onAssetUpload]
  );

  // Handle asset removal from modal - for specific ad editing
  const handleAssetRemove = useCallback(
    (mediaType: string, assetId: string) => {
      if (selectedAdForPreview && selectedAdForPreview.id) {
        // Remove from specific ad in Redux store
        dispatch(
          removeMediaFromAd({ adId: selectedAdForPreview.id, mediaId: assetId })
        );
      } else if (onAssetRemove) {
        // Fallback to parent handler for current ad being created
        onAssetRemove(mediaType, assetId);
      }
    },
    [selectedAdForPreview, dispatch, onAssetRemove]
  );

  // Handle live preview click
  const handleLivePreviewClick = useCallback(
    (mediaType: string) => {
      console.log("Live Preview clicked for media type:", mediaType);
      if (mockAdData) {
        handleAdPreview(mockAdData);
      }
    },
    [mockAdData, handleAdPreview]
  );

  // Get media type label
  const getMediaTypeLabel = (typeId: string): string => {
    const mediaTypes = {
      display_banner: "Display Banner",
      double_decker: "Double Decker",
      native: "Native (No Image)",
    };
    return mediaTypes[typeId as keyof typeof mediaTypes] || typeId;
  };

  // Get merchant logo for preview
  const getMerchantLogo = (offerId: string): string => {
    const logoMap: { [key: string]: string } = {
      o1: "https://placehold.co/400x200/ccf/fff?text=Vitamin+Logo",
      o2: "https://placehold.co/400x200/ccf/fff?text=Medicine+Logo",
      o3: "https://placehold.co/400x200/afa/333?text=Grocery+Logo",
      o4: "https://placehold.co/400x200/00f/fff?text=Laptop+Logo",
      o5: "https://placehold.co/400x200/f5f/fff?text=Bill+Logo",
      o6: "https://placehold.co/400x200/3b3/fff?text=Guac+Logo",
      mcm_o1_2023: "https://placehold.co/400x200/ccf/fff?text=CVS+Logo",
      mcm_o2_2023: "https://placehold.co/400x200/ccf/fff?text=CVS+Logo",
      mcm_o3_2023: "https://placehold.co/400x200/afa/333?text=Albertsons+Logo",
      mcm_o4_2023: "https://placehold.co/400x200/00f/fff?text=Best+Buy+Logo",
      mcm_o5_2023: "https://placehold.co/400x200/f5f/fff?text=T-Mobile+Logo",
      mcm_o6_2023: "https://placehold.co/400x200/3b3/fff?text=Chipotle+Logo",
    };
    return logoMap[offerId] || "https://placehold.co/400x200/ccf/fff?text=Logo";
  };

  // Get promotion text for preview
  const getPromotionText = (offerId: string): string => {
    const textMap: { [key: string]: string } = {
      o1: "30% off select vitamins",
      o2: "Buy 1 Get 1 on cough & cold",
      o3: "$5 off $25 grocery purchase",
      o4: "15% off laptops",
      o5: "$10 off monthly bill",
      o6: "Free guacamole with entrée",
      mcm_o1_2023: "30% off select vitamins",
      mcm_o2_2023: "Buy 1 Get 1 on cough & cold",
      mcm_o3_2023: "$5 off $25 grocery purchase",
      mcm_o4_2023: "15% off laptops",
      mcm_o5_2023: "$10 off monthly bill",
      mcm_o6_2023: "Free guacamole with entrée",
    };
    return textMap[offerId] || "Promotion";
  };

  // Helper function to format campaign duration
  const formatCampaignDuration = () => {
    const { startDate, endDate, noEndDate } = formData.targeting;
    if (!startDate) return "Duration not set";

    const start = new Date(startDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (noEndDate) return `${start} - Ongoing`;
    if (!endDate) return `${start} - End date TBD`;

    const end = new Date(endDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${start} - ${end}`;
  };

  // Step configuration with enhanced data display
  const steps = [
    {
      id: "basic-info",
      title: "Campaign Information",
      icon: FileText,
      stepIndex: 0,
      isCompleted: stepValidation["basic-info"],
      isCurrent: currentStep === 0,
      data: formData.basicInfo,
      keyInfo: formData.basicInfo.name
        ? { label: "Campaign Name", value: formData.basicInfo.name }
        : null,
    },
    {
      id: "ad-creation",
      title: "Campaign Assets",
      icon: Layers,
      stepIndex: 1,
      isCompleted: formData.ads.length > 0,
      isCurrent: currentStep === 1,
      data: formData.ads,
      keyInfo:
        formData.ads.length > 0
          ? {
              label: "Assets Created",
              value: `${formData.ads.length} ad${formData.ads.length !== 1 ? "s" : ""}`,
              detail: `${formData.ads.reduce((total, ad) => total + (ad.mediaAssets?.length || 0), 0)} media files`,
            }
          : null,
    },
    {
      id: "targeting-budget",
      title: "Target & Budget",
      icon: Target,
      stepIndex: 2,
      isCompleted: stepValidation["targeting-budget"],
      isCurrent: currentStep === 2,
      data: { targeting: formData.targeting, budget: formData.budget },
      keyInfo:
        formData.budget.maxBudget > 0 || formData.targeting.startDate
          ? {
              label: "Campaign Setup",
              value:
                formData.budget.maxBudget > 0
                  ? `$${formData.budget.maxBudget.toLocaleString()} budget`
                  : "Budget not set",
              detail: formatCampaignDuration(),
            }
          : null,
    },
    {
      id: "distribution",
      title: "Distribution",
      icon: Share2,
      stepIndex: 3,
      isCompleted: stepValidation["distribution"],
      isCurrent: currentStep === 3,
      data: formData.distribution,
      keyInfo:
        formData.distribution.channels.length > 0
          ? {
              label: "Distribution Setup",
              value: `${formData.distribution.channels.length} channel${formData.distribution.channels.length !== 1 ? "s" : ""}`,
              detail:
                formData.distribution.programCampaigns.length > 0
                  ? `${formData.distribution.programCampaigns.length} program${formData.distribution.programCampaigns.length !== 1 ? "s" : ""}`
                  : "No programs selected",
            }
          : null,
    },
    {
      id: "review",
      title: "Final Review",
      icon: CheckCircle,
      stepIndex: 4,
      isCompleted: stepValidation["review"],
      isCurrent: currentStep === 4,
      data: null,
      keyInfo: stepValidation["review"]
        ? { label: "Status", value: "Ready to launch" }
        : null,
    },
  ];

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Campaign Progress
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            Track your campaign setup progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
            {completedSteps} of {totalSteps} completed
          </span>
        </div>
      </div>

      {/* Live Preview Section */}
      {currentAdData?.isValid && (
        <div className="mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                  <Clock className="h-3 w-3 text-white" />
                </div>
                <h5 className="text-xs font-medium text-blue-800">
                  Live Preview
                </h5>
              </div>
              <Badge variant="outline" className="text-xs bg-white">
                {currentAdData.mediaTypes?.length || 0} formats
              </Badge>
            </div>

            {/* Preview Grid for Multiple Media Types */}
            <div className="space-y-2">
              {currentAdData.mediaTypes?.map((mediaType: string) => {
                const mediaTypeAssets =
                  currentAdData.mediaAssetsByType?.[mediaType] || [];
                const firstAsset = mediaTypeAssets[0];
                const mediaTypeDef = currentAdData.mediaTypeDefinitions?.find(
                  (mt: any) => mt.id === mediaType
                );

                return (
                  <div
                    key={mediaType}
                    className="bg-white rounded border p-2 hover:bg-slate-50 cursor-pointer transition-colors group"
                    onClick={() => handleLivePreviewClick(mediaType)}
                  >
                    <div className="flex gap-2">
                      <div className="w-12 h-8 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                        <div
                          className="transform scale-[0.3] origin-top-left"
                          style={{ width: "333%", height: "333%" }}
                        >
                          <PromotionWidget
                            merchantLogo={
                              currentAdData.offers?.find(
                                (o: any) => o.id === currentAdData.offerId
                              )?.logoUrl || ""
                            }
                            merchantName={currentAdData.merchantName}
                            promotionText={
                              currentAdData.offers?.find(
                                (o: any) => o.id === currentAdData.offerId
                              )?.name || ""
                            }
                            featured={true}
                            bannerImage={firstAsset?.previewUrl || undefined}
                            mediaType={mediaType}
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h6 className="text-xs font-medium text-slate-900 truncate">
                              {mediaTypeDef?.label || mediaType}
                            </h6>
                            <Badge variant="outline" className="text-[10px]">
                              {mediaTypeDef?.dimensions || "Auto"}
                            </Badge>
                          </div>
                          <Eye className="h-3 w-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-slate-600 truncate">
                            {currentAdData.offers?.find(
                              (o: any) => o.id === currentAdData.offerId
                            )?.name || ""}
                          </p>
                          <Badge
                            variant={
                              mediaTypeAssets.length > 0
                                ? "default"
                                : "destructive"
                            }
                            className="text-[8px] h-3 px-1"
                          >
                            {mediaTypeAssets.length > 0
                              ? `${mediaTypeAssets.length} asset${mediaTypeAssets.length > 1 ? "s" : ""}`
                              : "No assets"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Step Card */}
            <div
              className={`
                border rounded-lg p-3 transition-all duration-200 cursor-pointer relative
                ${
                  step.isCurrent
                    ? "border-blue-500 bg-blue-50/50 shadow-sm ring-1 ring-blue-100"
                    : step.isCompleted
                      ? "border-blue-200 bg-white hover:bg-blue-50/30"
                      : "border-slate-200 bg-white hover:bg-blue-50/20"
                }
              `}
              onClick={() => goToStep(step.stepIndex)}
            >
              {/* Current step accent bar */}
              {step.isCurrent && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg"></div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {/* Step Icon */}
                  <div
                    className={`
                      h-8 w-8 rounded-full flex items-center justify-center mr-3 transition-colors
                      ${
                        step.isCurrent
                          ? "bg-blue-600 shadow-sm"
                          : step.isCompleted
                            ? "bg-blue-100"
                            : "bg-slate-200"
                      }
                    `}
                  >
                    {step.isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    ) : (
                      <step.icon
                        className={`h-4 w-4 ${
                          step.isCurrent ? "text-white" : "text-slate-500"
                        }`}
                      />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-medium text-slate-900">
                        {step.title}
                      </h5>
                      {step.isCurrent && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                          Current
                        </Badge>
                      )}
                      {step.isCompleted && !step.isCurrent && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                          Completed
                        </Badge>
                      )}
                    </div>
                    {step.keyInfo && (
                      <div className="mt-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs text-slate-500">
                            {step.keyInfo.label}:
                          </span>
                          <span className="text-sm font-medium text-slate-800">
                            {step.keyInfo.value}
                          </span>
                        </div>
                        {step.keyInfo.detail && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {step.keyInfo.detail}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Step Details (for ads) */}
              {step.id === "ad-creation" && step.isCompleted && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="space-y-2">
                    {formData.ads.map((ad: any) => {
                      // Get offer details from the promotion text mapping since we don't have offer objects
                      const offerText = getPromotionText(ad.offerId);

                      return (
                        <div
                          key={ad.id}
                          className="bg-white rounded-lg border border-slate-200 p-2.5 hover:bg-blue-50/30 cursor-pointer transition-colors shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdPreview(ad);
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0 mr-3">
                              <p className="text-sm font-medium text-slate-900 leading-tight">
                                {ad.merchantName}
                              </p>
                              <p className="text-xs text-slate-600 mt-0.5 leading-tight">
                                {offerText}
                              </p>
                            </div>
                            <div className="flex-shrink-0 flex items-center space-x-2">
                              <div className="text-xs text-slate-500 text-right">
                                <div>
                                  {ad.mediaType.length} type
                                  {ad.mediaType.length !== 1 ? "s" : ""}
                                </div>
                                <div>
                                  {ad.mediaAssets?.length || 0} asset
                                  {ad.mediaAssets?.length !== 1 ? "s" : ""}
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-slate-400" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Connector Line - Fixed positioning to avoid overlaps */}
            {index < steps.length - 1 && (
              <div className="absolute left-7 top-[52px] w-0.5 h-3 bg-slate-200 -z-10"></div>
            )}
          </div>
        ))}
      </div>

      {/* Ad Preview Modal */}
      <AdPreviewModal
        isOpen={previewModalOpen}
        onClose={handleClosePreview}
        ad={
          selectedAdForPreview
            ? formData.ads.find((ad) => ad.id === selectedAdForPreview.id) ||
              selectedAdForPreview
            : undefined
        }
        allAds={
          selectedAdForPreview
            ? [
                formData.ads.find((ad) => ad.id === selectedAdForPreview.id) ||
                  selectedAdForPreview,
              ]
            : allAdsData || formData.ads
        }
        offers={currentAdData?.offers || []}
        getMerchantLogo={getMerchantLogo}
        getPromotionText={getPromotionText}
        getMediaTypeLabel={getMediaTypeLabel}
        onAssetUpload={handleAssetUpload}
        onAssetRemove={handleAssetRemove}
        allowEditing={true} // Always allow editing when viewing specific ads
      />
    </div>
  );
}
