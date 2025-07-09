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
import { Label } from "@/components/atoms/Label";
import PromotionWidget from "@/components/features/campaigns/PromotionWidget";
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
  Clock,
  ArrowRight,
  Upload,
  Trash,
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

  // State for drag and drop
  const [draggedMediaType, setDraggedMediaType] = useState<string | null>(null);

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

  // Reconstruct mediaAssetsByType if it doesn't exist but mediaAssets does
  const getMediaAssetsByType = (adData: any) => {
    if (adData.mediaAssetsByType) {
      return adData.mediaAssetsByType;
    }

    // Reconstruct from mediaAssets if available
    if (adData.mediaAssets) {
      const mediaAssetsByType: { [key: string]: any[] } = {};
      adData.mediaAssets.forEach((asset: any) => {
        const mediaType = asset.mediaType || "display_banner"; // fallback
        if (!mediaAssetsByType[mediaType]) {
          mediaAssetsByType[mediaType] = [];
        }
        mediaAssetsByType[mediaType].push(asset);
      });
      return mediaAssetsByType;
    }

    return {};
  };

  // Handle asset upload from inline preview
  const handleAssetUpload = useCallback(
    (mediaType: string, file: File) => {
      if (onAssetUpload) {
        onAssetUpload(mediaType, file);
      }
    },
    [onAssetUpload]
  );

  // Handle asset removal from inline preview
  const handleAssetRemove = useCallback(
    (mediaType: string, assetId: string) => {
      if (onAssetRemove) {
        onAssetRemove(mediaType, assetId);
      }
    },
    [onAssetRemove]
  );

  // Handle file selection for upload
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, mediaType: string) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        handleAssetUpload(mediaType, file);
      }
    },
    [handleAssetUpload]
  );

  // Handle drag and drop
  const handleFileDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, mediaType: string) => {
      e.preventDefault();
      setDraggedMediaType(null);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        handleAssetUpload(mediaType, file);
      }
    },
    [handleAssetUpload]
  );

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

  // Define media types order for consistent display
  const mediaTypes = [
    {
      id: "display_banner",
      label: "Display Banner",
      dimensions: "728x90",
      requiresAsset: true,
    },
    {
      id: "double_decker",
      label: "Double Decker",
      dimensions: "728x180",
      requiresAsset: true,
    },
    {
      id: "native",
      label: "Native (No Image)",
      dimensions: "Text Only",
      requiresAsset: false,
    },
  ];

  // Step configuration with enhanced data display - Updated for streamlined ad creation flow
  const adsData = allAdsData || formData.ads;

  const hasValidPreviewData =
    currentAdData &&
    currentAdData.currentAd &&
    currentAdData.currentAd.mediaType &&
    currentAdData.currentAd.mediaType.length > 0;

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 w-full max-w-full overflow-x-hidden overflow-y-auto h-full ${className}`}
    >
      {hasValidPreviewData ? (
        /* Media Type Previews */
        <div className="space-y-4 w-full">
          {mediaTypes
            .filter((mediaType) =>
              currentAdData.currentAd.mediaType.includes(mediaType.id)
            )
            .map((mediaType) => {
              const mediaTypeAssets =
                currentAdData.currentAd.mediaAssetsByType?.[mediaType.id] || [];
              const firstAsset = mediaTypeAssets[0];

              return (
                <div key={mediaType.id} className="space-y-2 w-full">
                  {/* Media Type Label */}
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700">
                      {mediaType.label}
                    </Label>
                    <Badge variant="outline" className="text-sm">
                      {mediaType.dimensions}
                    </Badge>
                  </div>

                  {/* Preview Component */}
                  <div className="border border-gray-200 rounded-md p-3 bg-gray-50 w-full overflow-hidden">
                    <div className="w-full overflow-hidden">
                      <div
                        className="max-w-full"
                        style={{
                          transform: "scale(0.9)",
                          transformOrigin: "top left",
                        }}
                      >
                        <PromotionWidget
                          merchantLogo={getMerchantLogo(
                            currentAdData.currentAd.offerId
                          )}
                          merchantName={currentAdData.currentAd.merchantName}
                          promotionText={getPromotionText(
                            currentAdData.currentAd.offerId
                          )}
                          featured={true}
                          bannerImage={firstAsset?.previewUrl || undefined}
                          mediaType={mediaType.id}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Asset Status */}
                  {mediaType.requiresAsset && (
                    <div className="text-sm text-gray-600 flex items-center mt-2">
                      {mediaTypeAssets.length > 0 ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="font-medium">Asset uploaded:</span>
                          <span className="ml-1 truncate">
                            {firstAsset.name}
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                          <span>No asset uploaded</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-primary"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Preview Available
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            Complete the ad details on the left to see a live preview of your
            advertisement assets and formats.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-muted-foreground rounded-full mr-2"></div>
              Select a merchant and offer
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-muted-foreground rounded-full mr-2"></div>
              Choose media types
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-muted-foreground rounded-full mr-2"></div>
              Upload assets (optional)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
