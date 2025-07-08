"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  addAd,
  updateAd,
  addMediaToAd,
  removeMediaFromAd,
  MediaAsset,
} from "@/lib/redux/slices/campaignSlice";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import PromotionWidget from "@/components/features/campaigns/PromotionWidget";

import { AnimatedList, AnimatedListItem } from "@/components/ui/animated-list";
import {
  Plus,
  ImagePlus,
  CheckCircle,
  AlertCircle,
  X,
  ChevronDown,
  MoreHorizontal,
  Clock,
  ArrowRight,
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
  const { formData } = useSelector((state: RootState) => state.campaign);
  const dispatch = useDispatch();

  // Memoize the mock ad data to prevent infinite loops
  const mockAdData = useMemo(() => {
    if (!currentAdData?.isValid) return null;

    const allAssets = Object.values(
      currentAdData.mediaAssetsByType || {}
    ).flat();
    return {
      id: "live-preview",
      name: currentAdData.name,
      merchantName: currentAdData.merchantName,
      offerId: currentAdData.offerId,
      mediaType: currentAdData.mediaTypes || [],
      mediaAssets: allAssets,
      mediaAssetsByType: currentAdData.mediaAssetsByType || {},
    };
  }, [
    currentAdData?.isValid,
    currentAdData?.name,
    currentAdData?.merchantName,
    currentAdData?.offerId,
    currentAdData?.mediaTypes,
    currentAdData?.mediaAssetsByType,
  ]);

  // Helper to truncate long text
  const truncateText = (text: string, maxLength: number = 20) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
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

  // Step configuration with enhanced data display - Updated for streamlined ad creation flow
  const adsData = allAdsData || formData.ads;

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}
    >
      {/* Live Preview Section */}
      {currentAdData?.isValid && (
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                  <Clock className="h-3 w-3 text-white" />
                </div>
                <h5 className="text-sm font-medium text-blue-800">
                  Live Preview
                </h5>
              </div>
              <Badge variant="outline" className="text-sm bg-white">
                {currentAdData.mediaTypes?.length || 0} formats
              </Badge>
            </div>

            {/* Preview Grid for Multiple Media Types */}
            <div className="space-y-3">
              {currentAdData.mediaTypes?.map((mediaType: string) => {
                const mediaTypeAssets =
                  currentAdData.mediaAssetsByType?.[mediaType] || [];
                const firstAsset = mediaTypeAssets[0];
                const mediaTypeDef = currentAdData.mediaTypeDefinitions?.find(
                  (mt: any) => mt.id === mediaType
                );

                return (
                  <div key={mediaType} className="bg-white rounded border p-3">
                    <div className="flex flex-col gap-3">
                      <div
                        className="w-full bg-slate-50 rounded overflow-hidden border border-slate-200"
                        style={{ minWidth: "400px", maxWidth: "600px" }}
                      >
                        <div className="w-full">
                          <PromotionWidget
                            merchantLogo={
                              currentAdData.offers?.find(
                                (o: any) => o.id === currentAdData.offerId
                              )?.logoUrl || ""
                            }
                            merchantName={
                              currentAdData.name || currentAdData.merchantName
                            }
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
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h6 className="text-sm font-medium text-slate-900 truncate">
                              {mediaTypeDef?.label || mediaType}
                            </h6>
                            <Badge variant="outline" className="text-sm">
                              {mediaTypeDef?.dimensions || "Auto"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-600 truncate">
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
                            className="text-sm h-5 px-2"
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

      {/* Created Ads - Direct List without wrapper */}
      {adsData.length > 0 ? (
        adsData.map((ad: any) => {
          // Get offer details from the promotion text mapping since we don't have offer objects
          const offerText = getPromotionText(ad.offerId);

          return (
            <div
              key={ad.id}
              className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm mb-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm font-medium text-slate-900 leading-relaxed">
                    {ad.name || ad.merchantName}
                  </p>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {ad.merchantName} • {offerText}
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center space-x-3">
                  <div className="text-sm text-slate-500 text-right space-y-1">
                    <div>
                      {ad.mediaType.length} type
                      {ad.mediaType.length !== 1 ? "s" : ""}
                    </div>
                    <div>
                      {ad.mediaAssets?.length || 0} asset
                      {ad.mediaAssets?.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <ImagePlus className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-3">
            No ads created yet
          </h3>
          <p className="text-sm text-slate-600 mb-6 max-w-sm leading-relaxed">
            Fill out the form on the left to create your first ad. Your preview
            will appear here as you build it.
          </p>
          <div className="flex items-center text-sm text-slate-500">
            <ArrowRight className="h-4 w-4 mr-2" />
            Start by entering an ad name
          </div>
        </div>
      )}
    </div>
  );
}
