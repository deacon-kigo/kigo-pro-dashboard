"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Label } from "@/components/atoms/Label";
import Card from "@/components/atoms/Card/Card";
import PromotionWidget from "@/components/features/campaigns/PromotionWidget";
import { Download, Upload, ImagePlus, Plus, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  ad?: any;
  allAds?: any[];
  offers?: any[];
  getMerchantLogo?: (offerId: string) => string;
  getPromotionText?: (offerId: string) => string;
  getMediaTypeLabel?: (typeId: string) => string;
  onAssetUpload?: (mediaType: string, file: File) => void;
  onAssetRemove?: (mediaType: string, assetId: string) => void;
  allowEditing?: boolean; // New prop to control editing mode
}

export function AdPreviewModal({
  isOpen,
  onClose,
  ad,
  allAds,
  offers,
  getMerchantLogo,
  getPromotionText,
  getMediaTypeLabel,
  onAssetUpload,
  onAssetRemove,
  allowEditing = true, // Default to allowing editing
}: AdPreviewModalProps) {
  const [draggedMediaType, setDraggedMediaType] = useState<string | null>(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // Determine which ads to show
  const adsToShow = allAds && allAds.length > 0 ? allAds : ad ? [ad] : [];
  const currentAd = adsToShow[currentAdIndex] || {};

  // Fix: Reconstruct mediaAssetsByType if it doesn't exist but mediaAssets does
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

  const currentAdMediaAssetsByType = getMediaAssetsByType(currentAd);

  // Reset to first ad when modal opens or ads change
  useEffect(() => {
    if (isOpen) {
      setCurrentAdIndex(0);
    }
  }, [isOpen, allAds]);

  if (!currentAd || adsToShow.length === 0) {
    return null;
  }

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

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    mediaType: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (onAssetUpload) {
        // For now, if we have multiple ads, we're operating on the currently displayed one
        // The callback should update the correct ad based on the current ad's context
        onAssetUpload(mediaType, file);
      }
    }
  };

  const handleFileDrop = (
    e: React.DragEvent<HTMLDivElement>,
    mediaType: string
  ) => {
    e.preventDefault();
    setDraggedMediaType(null);

    if (
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0 &&
      onAssetUpload
    ) {
      const file = e.dataTransfer.files[0];
      onAssetUpload(mediaType, file);
    }
  };

  const exportAsset = (mediaType: string) => {
    // Export functionality - download the asset
    const assets = currentAdMediaAssetsByType[mediaType] || [];
    if (assets.length > 0) {
      const asset = assets[0];
      const link = document.createElement("a");
      link.href = asset.url;
      link.download = asset.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Campaign Asset Preview
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {adsToShow.length > 1
              ? `${adsToShow.length} ads created`
              : "Single ad preview"}
          </p>

          {/* Ad Tabs - Only show if multiple ads */}
          {adsToShow.length > 1 && (
            <div className="flex gap-1 mt-3 border-b">
              {adsToShow.map((adItem, index) => (
                <button
                  key={adItem.id || index}
                  onClick={() => setCurrentAdIndex(index)}
                  className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                    index === currentAdIndex
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {adItem.merchantName || `Ad ${index + 1}`}
                </button>
              ))}
            </div>
          )}
        </DialogHeader>

        <div className="space-y-4">
          {/* Campaign Summary Card */}
          <Card className="border border-slate-200">
            <div className="border-b border-slate-200 px-3 py-2 bg-slate-50">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-sm flex items-center justify-center bg-slate-600 text-white mr-2">
                  <Plus className="h-2.5 w-2.5" />
                </div>
                <h3 className="text-xs font-medium text-slate-700">
                  {adsToShow.length > 1 ? "Campaign Summary" : "Ad Summary"}
                </h3>
              </div>
            </div>
            <div className="p-3">
              {adsToShow.length > 1 ? (
                /* Multiple ads - show aggregated data */
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-slate-600">Total Ads</Label>
                    <p className="font-medium">{adsToShow.length}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-600">Merchants</Label>
                    <p className="font-medium">
                      {new Set(adsToShow.map((ad) => ad.merchantName)).size}{" "}
                      unique
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-600">
                      Media Types
                    </Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Array.from(
                        new Set(adsToShow.flatMap((ad) => ad.mediaType || []))
                      ).map((type: string) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {getMediaTypeLabel?.(type) || type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-600">
                      Total Assets
                    </Label>
                    <p className="font-medium">
                      {adsToShow.reduce((total, ad) => {
                        return (
                          total +
                          (getMediaAssetsByType(ad)
                            ? Object.values(getMediaAssetsByType(ad)).flat()
                                .length
                            : ad.mediaAssets?.length || 0)
                        );
                      }, 0)}{" "}
                      uploaded
                    </p>
                  </div>
                </div>
              ) : (
                /* Single ad - show specific data */
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-slate-600">Merchant</Label>
                    <p className="font-medium">{currentAd.merchantName}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-600">Offer</Label>
                    <p className="font-medium">
                      {offers?.find((offer) => offer.id === currentAd.offerId)
                        ?.name ||
                        getPromotionText?.(currentAd.offerId) ||
                        "No offer selected"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-600">
                      Media Types
                    </Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentAd.mediaType?.map((type: string) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {getMediaTypeLabel?.(type) || type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-600">
                      Total Assets
                    </Label>
                    <p className="font-medium">
                      {Object.values(currentAdMediaAssetsByType).flat().length}{" "}
                      uploaded
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Media Type Sections */}
          {mediaTypes
            .filter((mediaType) => currentAd.mediaType?.includes(mediaType.id))
            .map((mediaType) => {
              const mediaTypeAssets =
                currentAdMediaAssetsByType[mediaType.id] || [];
              const firstAsset = mediaTypeAssets[0];

              return (
                <Card key={mediaType.id} className="border border-slate-200">
                  <div className="border-b border-slate-200 px-3 py-2 bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-4 w-4 rounded-sm flex items-center justify-center bg-blue-600 text-white mr-2">
                          <ImagePlus className="h-2.5 w-2.5" />
                        </div>
                        <h3 className="text-xs font-medium text-blue-800">
                          {mediaType.label}
                        </h3>
                        <Badge variant="outline" className="text-[10px] ml-2">
                          {mediaType.dimensions}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            mediaTypeAssets.length > 0
                              ? "default"
                              : "destructive"
                          }
                          className="text-[10px]"
                        >
                          {mediaTypeAssets.length > 0
                            ? "Asset uploaded"
                            : "No asset"}
                        </Badge>
                        {mediaTypeAssets.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => exportAsset(mediaType.id)}
                            className="h-6 text-xs px-2"
                          >
                            <Download className="h-2.5 w-2.5 mr-1" />
                            Export
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="grid grid-cols-2 gap-4 h-full">
                      {/* Left: Preview */}
                      <div className="flex flex-col">
                        <Label className="text-xs mb-2 block font-medium text-slate-600">
                          Preview
                        </Label>
                        <div className="bg-slate-50 border rounded-lg p-4 flex justify-center min-h-[200px] items-center flex-1">
                          {mediaTypeAssets.length > 0 ? (
                            <div className="max-w-full">
                              <PromotionWidget
                                merchantLogo={
                                  getMerchantLogo?.(currentAd.offerId) || ""
                                }
                                merchantName={currentAd.merchantName}
                                promotionText={
                                  getPromotionText?.(currentAd.offerId) || ""
                                }
                                featured={true}
                                bannerImage={
                                  firstAsset?.previewUrl || undefined
                                }
                                mediaType={mediaType.id}
                              />
                            </div>
                          ) : (
                            <div className="text-center text-slate-500">
                              <ImagePlus className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                              <p className="text-sm">No asset uploaded</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Asset Management */}
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs block font-medium text-slate-600">
                            Asset Management
                          </Label>
                          {!allowEditing && (
                            <Badge
                              variant="outline"
                              className="text-[10px] text-blue-600"
                            >
                              View Only
                            </Badge>
                          )}
                        </div>

                        {mediaType.requiresAsset ? (
                          <div className="flex-1 flex flex-col">
                            {mediaTypeAssets.length === 0 ? (
                              /* Upload Section */
                              <div
                                className={`border-2 border-dashed rounded p-4 transition-colors flex-1 flex items-center justify-center ${
                                  draggedMediaType === mediaType.id
                                    ? "border-blue-400 bg-blue-50"
                                    : "border-slate-300 hover:border-slate-400"
                                }`}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  setDraggedMediaType(mediaType.id);
                                }}
                                onDragLeave={() => setDraggedMediaType(null)}
                                onDrop={(e) => handleFileDrop(e, mediaType.id)}
                              >
                                <div className="flex flex-col items-center justify-center text-center w-full">
                                  <ImagePlus className="h-6 w-6 text-slate-400 mb-2" />
                                  <p className="text-sm font-medium mb-1 text-slate-600">
                                    Upload Asset
                                  </p>
                                  <p className="text-xs text-slate-500 mb-3">
                                    JPG or PNG (max file size: 10MB)
                                  </p>
                                  <input
                                    type="file"
                                    id={`fileUpload-${mediaType.id}`}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleFileSelect(e, mediaType.id)
                                    }
                                  />
                                  <Button
                                    size="sm"
                                    className="h-7 text-xs px-3"
                                    disabled={!allowEditing}
                                    onClick={() =>
                                      document
                                        .getElementById(
                                          `fileUpload-${mediaType.id}`
                                        )
                                        ?.click()
                                    }
                                  >
                                    <Upload className="h-3 w-3 mr-1" />
                                    {!allowEditing
                                      ? "View Only"
                                      : "Choose file"}
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              /* Asset Display with Replace Option */
                              <div className="space-y-3 flex-1 flex flex-col">
                                <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded border">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 bg-slate-100 rounded overflow-hidden mr-3">
                                      <img
                                        src={firstAsset.previewUrl}
                                        alt={firstAsset.name}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium text-slate-700">
                                        {firstAsset.name}
                                      </p>
                                      <p className="text-[10px] text-slate-500">
                                        {formatFileSize(firstAsset.size)}
                                      </p>
                                    </div>
                                  </div>
                                  {onAssetRemove && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      disabled={!allowEditing}
                                      onClick={() =>
                                        onAssetRemove(
                                          mediaType.id,
                                          firstAsset.id
                                        )
                                      }
                                      className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 disabled:text-slate-400"
                                      title={
                                        !allowEditing
                                          ? "View only mode"
                                          : "Remove asset"
                                      }
                                    >
                                      <Trash className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>

                                {/* Replace Asset Option */}
                                <div className="border-t border-slate-200 pt-3 mt-auto">
                                  <input
                                    type="file"
                                    id={`fileReplace-${mediaType.id}`}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleFileSelect(e, mediaType.id)
                                    }
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!allowEditing}
                                    className="w-full h-7 text-xs border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 disabled:text-slate-400 disabled:border-slate-300"
                                    onClick={() =>
                                      document
                                        .getElementById(
                                          `fileReplace-${mediaType.id}`
                                        )
                                        ?.click()
                                    }
                                  >
                                    <Upload className="h-3 w-3 mr-1" />
                                    {!allowEditing
                                      ? "View Only"
                                      : "Replace Asset"}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center bg-slate-50 border rounded p-4 flex-1">
                            <div className="flex items-center text-sm">
                              <Plus className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-xs text-slate-600">
                                Native format uses merchant logo - no upload
                                required
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
