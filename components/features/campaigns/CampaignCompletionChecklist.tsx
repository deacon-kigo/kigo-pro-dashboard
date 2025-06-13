"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  CAMPAIGN_STEPS,
  addAd,
  setCurrentStep,
} from "@/lib/redux/slices/campaignSlice";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import PromotionWidget from "@/components/features/campaigns/PromotionWidget";
import { AdPreviewModal } from "./AdPreviewModal";
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
  currentAdData?: any;
}

export function CampaignCompletionChecklist({
  className = "",
  onStartNewAd,
  currentAdData,
}: CampaignCompletionChecklistProps) {
  // Get campaign state from Redux
  const { formData, stepValidation, currentStep } = useSelector(
    (state: RootState) => state.campaign
  );
  const dispatch = useDispatch();

  // Local state for expanded ad details
  const [adsExpanded, setAdsExpanded] = useState(false);
  const [expandedAdId, setExpandedAdId] = useState<string | null>(null);

  // Modal state for ad preview
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedAdForPreview, setSelectedAdForPreview] = useState<any>(null);

  // Debug modal state changes
  useEffect(() => {
    console.log("Modal state changed:", {
      previewModalOpen,
      selectedAdForPreview,
    });
  }, [previewModalOpen, selectedAdForPreview]);

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

  // Get merchant logo for preview
  const getMerchantLogo = (offerId: string): string => {
    // This is a mock function - in a real app, you would have a proper lookup
    // This would typically come from your backend or a lookup function
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
    // This is a mock function - in a real app, you would have a proper lookup
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

  // Handle toggling the expanded state of an ad
  const toggleAdExpand = (adId: string) => {
    setExpandedAdId(expandedAdId === adId ? null : adId);
  };

  // Handle opening ad preview modal
  const handleAdPreview = (ad: any, event?: React.MouseEvent) => {
    console.log("handleAdPreview called with ad:", ad);
    console.log("Ad is valid:", !!ad);
    console.log("Ad keys:", ad ? Object.keys(ad) : "no ad");

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
    console.log("Modal state set to true, selected ad:", ad);
  };

  // Handle closing ad preview modal
  const handleClosePreview = () => {
    setPreviewModalOpen(false);
    setSelectedAdForPreview(null);
  };

  // Handle edit from modal
  const handleEditFromModal = () => {
    goToAdCreationStep();
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-3 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium">Completion Checklist</h4>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            {completedSteps} of {totalSteps} steps
          </span>
        </div>
      </div>

      {/* Prominent test button */}
      <div className="mb-3">
        <button
          onClick={() => {
            console.log("GLOBAL TEST BUTTON CLICKED!");
            alert("Global test works! Ads count: " + formData.ads.length);
            if (formData.ads.length > 0) {
              console.log("Testing with first ad:", formData.ads[0]);
              handleAdPreview(formData.ads[0]);
            }
          }}
          className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 text-sm rounded font-medium"
        >
          🧪 TEST MODAL (Ads: {formData.ads.length})
        </button>
      </div>

      <div className="space-y-3">
        {/* Live Preview for Current Ad Being Created */}
        {currentAdData?.isValid && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
            <div className="flex items-center mb-2">
              <div className="h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                <svg
                  className="h-2.5 w-2.5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              </div>
              <h5 className="text-xs font-medium text-blue-800">
                Live Preview
              </h5>
              <Badge variant="outline" className="text-[9px] ml-auto bg-white">
                {currentAdData.mediaTypes?.length || 0} formats
              </Badge>
            </div>

            {/* Compact Ad Preview Card */}
            <div
              className="bg-white rounded border p-2 hover:bg-slate-50 cursor-pointer transition-colors group"
              onClick={() => {
                console.log("Live Preview clicked!");
                console.log("Current ad data:", currentAdData);
                // Create a mock ad object from currentAdData for the modal
                const mockAd = {
                  id: "live-preview",
                  merchantName: currentAdData.merchantName,
                  offerId: currentAdData.offerId,
                  mediaType: currentAdData.mediaTypes || [],
                  mediaAssets: currentAdData.mediaAssets || [],
                };
                handleAdPreview(mockAd);
              }}
            >
              <div className="flex gap-2">
                {/* Preview Thumbnail */}
                <div className="w-16 h-12 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                  <div
                    className="transform scale-[0.4] origin-top-left"
                    style={{ width: "250%", height: "250%" }}
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
                      bannerImage={currentAdData.previewImageUrl || undefined}
                      mediaType={
                        currentAdData.mediaTypes?.[0] || "display_banner"
                      }
                    />
                  </div>
                </div>

                {/* Ad Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h6 className="text-xs font-medium text-slate-900 truncate">
                      {currentAdData.merchantName}
                    </h6>
                    <Eye className="h-3 w-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <p className="text-[10px] text-slate-600 truncate mt-0.5">
                    {currentAdData.offers?.find(
                      (o: any) => o.id === currentAdData.offerId
                    )?.name || ""}
                  </p>

                  {/* Media Type Indicators */}
                  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                    {currentAdData.mediaTypes
                      ?.slice(0, 3)
                      .map((typeId: string) => (
                        <Badge
                          key={typeId}
                          variant="outline"
                          className="text-[8px] h-3 px-1"
                        >
                          {currentAdData.mediaTypeDefinitions?.find(
                            (t: any) => t.id === typeId
                          )?.label || typeId}
                        </Badge>
                      ))}
                    {currentAdData.mediaTypes?.length > 3 && (
                      <Badge variant="outline" className="text-[8px] h-3 px-1">
                        +{currentAdData.mediaTypes.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                        <div className="p-2 flex items-center justify-between">
                          {/* Simple test button first */}
                          <button
                            onClick={() => {
                              console.log("TEST BUTTON CLICKED!");
                              alert("Test button works!");
                              handleAdPreview(ad);
                            }}
                            className="bg-red-500 text-white px-2 py-1 text-xs rounded mr-2"
                          >
                            TEST
                          </button>

                          <div
                            className="flex items-center flex-1 cursor-pointer hover:bg-slate-50 rounded p-1 -m-1 border border-red-200"
                            onClick={(e) => {
                              console.log("Ad preview clicked, ad data:", ad);
                              console.log(
                                "Ad structure:",
                                JSON.stringify(ad, null, 2)
                              );
                              handleAdPreview(ad, e);
                            }}
                            style={{
                              minHeight: "30px",
                              backgroundColor: "rgba(255,0,0,0.1)",
                            }}
                          >
                            <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-xs mr-2">
                              {index + 1}
                            </div>
                            <span className="text-xs font-medium">
                              {truncateText(ad.merchantName, 15)}
                            </span>
                            <Eye className="h-3 w-3 text-slate-400 ml-2" />
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge
                              variant={
                                ad.mediaAssets.length > 0
                                  ? "success"
                                  : "destructive"
                              }
                              className="text-[10px] h-5"
                            >
                              {ad.mediaAssets.length} Assets
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAdExpand(ad.id);
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <ChevronRight
                                className={`h-3.5 w-3.5 transition-transform ${
                                  expandedAdId === ad.id ? "rotate-90" : ""
                                }`}
                              />
                            </Button>
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

                            {/* Compact Ad Preview */}
                            <div className="my-2 pt-2 border-t">
                              <p className="text-[10px] font-medium mb-2">
                                Preview:
                              </p>
                              <div
                                className="bg-slate-50 rounded border p-2 hover:bg-slate-100 transition-colors cursor-pointer group"
                                onClick={() => handleAdPreview(ad)}
                              >
                                <div className="flex gap-2">
                                  {/* Preview Thumbnail */}
                                  <div className="w-14 h-10 bg-white rounded overflow-hidden flex-shrink-0 border">
                                    <div
                                      className="transform scale-[0.35] origin-top-left"
                                      style={{ width: "285%", height: "285%" }}
                                    >
                                      <PromotionWidget
                                        merchantLogo={getMerchantLogo(
                                          ad.offerId
                                        )}
                                        merchantName={ad.merchantName}
                                        promotionText={getPromotionText(
                                          ad.offerId
                                        )}
                                        featured={true}
                                        bannerImage={
                                          ad.mediaAssets.length > 0
                                            ? ad.mediaAssets[0].previewUrl
                                            : undefined
                                        }
                                        mediaType={ad.mediaType[0]}
                                      />
                                    </div>
                                  </div>

                                  {/* Ad Summary */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center gap-1 flex-wrap">
                                        {ad.mediaType
                                          .slice(0, 2)
                                          .map((type) => (
                                            <Badge
                                              key={type}
                                              variant="outline"
                                              className="text-[8px] h-3 px-1"
                                            >
                                              {getMediaTypeLabel(type)}
                                            </Badge>
                                          ))}
                                        {ad.mediaType.length > 2 && (
                                          <Badge
                                            variant="outline"
                                            className="text-[8px] h-3 px-1"
                                          >
                                            +{ad.mediaType.length - 2}
                                          </Badge>
                                        )}
                                      </div>
                                      <Eye className="h-3 w-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                    <div className="flex items-center text-[9px] text-slate-600">
                                      <span>
                                        {ad.mediaAssets.length} assets
                                      </span>
                                      {ad.mediaAssets.length > 0 && (
                                        <span className="ml-2 text-green-600">
                                          ✓ Ready
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
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

      {/* Ad Preview Modal */}
      <AdPreviewModal
        isOpen={previewModalOpen}
        onClose={handleClosePreview}
        ad={selectedAdForPreview}
        onEdit={handleEditFromModal}
        getMerchantLogo={getMerchantLogo}
        getPromotionText={getPromotionText}
        getMediaTypeLabel={getMediaTypeLabel}
      />
    </div>
  );
}
