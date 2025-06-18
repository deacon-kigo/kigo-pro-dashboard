"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Label } from "@/components/atoms/Label";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card/Card";
import { CampaignAd, MediaAsset } from "@/lib/redux/slices/campaignSlice";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/atoms/Select";
import { v4 as uuidv4 } from "uuid";
import {
  Plus,
  X,
  Upload,
  Trash,
  ImagePlus,
  AlertCircle,
  CheckCircle,
  Edit,
  ChevronRight,
  Check,
} from "lucide-react";
import PromotionWidget from "@/components/features/campaigns/PromotionWidget";
import { Combobox } from "@/components/ui/combobox";

interface AdCreationStepProps {
  ads: CampaignAd[];
  addAd: (ad: CampaignAd) => void;
  updateAd: (id: string, data: Partial<CampaignAd>) => void;
  removeAd: (id: string) => void;
  addMediaToAd: (adId: string, media: MediaAsset) => void;
  removeMediaFromAd: (adId: string, mediaId: string) => void;
  setStepValidation: (isValid: boolean) => void;
  onCurrentAdChange?: (currentAd: any) => void;
}

const AdCreationStep: React.FC<AdCreationStepProps> = ({
  ads,
  addAd,
  updateAd,
  removeAd,
  addMediaToAd,
  removeMediaFromAd,
  setStepValidation,
  onCurrentAdChange,
}) => {
  // Generate 50+ mock merchants for the dropdown (5 original + 50 new)
  const merchants = [
    { id: "m1", name: "CVS Pharmacy", dba: "CVS Health" },
    { id: "m2", name: "Albertsons Companies", dba: "Albertsons" },
    { id: "m3", name: "Best Buy Co.", dba: "Best Buy" },
    { id: "m4", name: "T-Mobile USA", dba: "T-Mobile" },
    { id: "m5", name: "Chipotle Mexican Grill", dba: "Chipotle" },
    // Additional merchants
    { id: "m6", name: "Walmart Inc.", dba: "Walmart" },
    { id: "m7", name: "Target Corporation", dba: "Target" },
    { id: "m8", name: "Amazon.com Inc.", dba: "Amazon" },
    { id: "m9", name: "Apple Inc.", dba: "Apple" },
    { id: "m10", name: "Starbucks Corporation", dba: "Starbucks" },
    { id: "m11", name: "McDonald's Corporation", dba: "McDonald's" },
    { id: "m12", name: "Home Depot Inc.", dba: "The Home Depot" },
    { id: "m13", name: "Kroger Co.", dba: "Kroger" },
    { id: "m14", name: "Walgreens Boots Alliance", dba: "Walgreens" },
    { id: "m15", name: "Costco Wholesale", dba: "Costco" },
    { id: "m16", name: "AT&T Inc.", dba: "AT&T" },
    { id: "m17", name: "Verizon Communications", dba: "Verizon" },
    { id: "m18", name: "Lowe's Companies", dba: "Lowe's" },
    { id: "m19", name: "JPMorgan Chase & Co.", dba: "Chase" },
    { id: "m20", name: "Bank of America", dba: "Bank of America" },
    { id: "m21", name: "Wells Fargo & Company", dba: "Wells Fargo" },
    { id: "m22", name: "United Parcel Service", dba: "UPS" },
    { id: "m23", name: "FedEx Corporation", dba: "FedEx" },
    { id: "m24", name: "Nike, Inc.", dba: "Nike" },
    { id: "m25", name: "Adidas AG", dba: "Adidas" },
    { id: "m26", name: "Under Armour, Inc.", dba: "Under Armour" },
    { id: "m27", name: "Burger King Holdings", dba: "Burger King" },
    { id: "m28", name: "Wendy's Company", dba: "Wendy's" },
    { id: "m29", name: "Subway Restaurants", dba: "Subway" },
    { id: "m30", name: "Pizza Hut LLC", dba: "Pizza Hut" },
    { id: "m31", name: "Domino's Pizza", dba: "Domino's" },
    { id: "m32", name: "Papa John's International", dba: "Papa John's" },
    { id: "m33", name: "KFC Corporation", dba: "KFC" },
    { id: "m34", name: "Taco Bell Corp.", dba: "Taco Bell" },
    { id: "m35", name: "Macy's, Inc.", dba: "Macy's" },
    { id: "m36", name: "Nordstrom, Inc.", dba: "Nordstrom" },
    { id: "m37", name: "Kohl's Corporation", dba: "Kohl's" },
    { id: "m38", name: "Sears Holdings", dba: "Sears" },
    { id: "m39", name: "JCPenney Company", dba: "JCPenney" },
    { id: "m40", name: "Gap Inc.", dba: "Gap" },
    { id: "m41", name: "Old Navy LLC", dba: "Old Navy" },
    { id: "m42", name: "Banana Republic LLC", dba: "Banana Republic" },
    { id: "m43", name: "H&M Hennes & Mauritz AB", dba: "H&M" },
    { id: "m44", name: "Zara USA, Inc.", dba: "Zara" },
    { id: "m45", name: "Whole Foods Market", dba: "Whole Foods" },
    { id: "m46", name: "Trader Joe's Company", dba: "Trader Joe's" },
    { id: "m47", name: "Sprouts Farmers Market", dba: "Sprouts" },
    { id: "m48", name: "Publix Super Markets", dba: "Publix" },
    { id: "m49", name: "Safeway Inc.", dba: "Safeway" },
    { id: "m50", name: "7-Eleven, Inc.", dba: "7-Eleven" },
    { id: "m51", name: "Circle K Stores Inc.", dba: "Circle K" },
    { id: "m52", name: "Rite Aid Corporation", dba: "Rite Aid" },
    { id: "m53", name: "Sephora USA, Inc.", dba: "Sephora" },
    { id: "m54", name: "Ulta Beauty, Inc.", dba: "Ulta" },
    { id: "m55", name: "GameStop Corp.", dba: "GameStop" },
  ];

  // Generate mock offers for all merchants
  const offers = [
    // Original offers
    {
      id: "mcm_o1_2023",
      merchantId: "m1",
      name: "30% off select vitamins",
      shortText: "Vitamins Sale",
      logoUrl: "https://placehold.co/400x200/ccf/fff?text=CVS+Logo",
    },
    {
      id: "mcm_o2_2023",
      merchantId: "m1",
      name: "Buy 1 Get 1 on cough & cold",
      shortText: "Cold Medicine",
      logoUrl: "https://placehold.co/400x200/ccf/fff?text=CVS+Logo",
    },
    {
      id: "mcm_o3_2023",
      merchantId: "m2",
      name: "$5 off $25 grocery purchase",
      shortText: "Grocery Deal",
      logoUrl: "https://placehold.co/400x200/afa/333?text=Albertsons+Logo",
    },
    {
      id: "mcm_o4_2023",
      merchantId: "m3",
      name: "15% off laptops",
      shortText: "Laptop Discount",
      logoUrl: "https://placehold.co/400x200/00f/fff?text=Best+Buy+Logo",
    },
    {
      id: "mcm_o5_2023",
      merchantId: "m4",
      name: "$10 off monthly bill",
      shortText: "Bill Credit",
      logoUrl: "https://placehold.co/400x200/f5f/fff?text=T-Mobile+Logo",
    },
    {
      id: "mcm_o6_2023",
      merchantId: "m5",
      name: "Free guacamole with entrée",
      shortText: "Free Guac",
      logoUrl: "https://placehold.co/400x200/3b3/fff?text=Chipotle+Logo",
    },
    // Additional offers for new merchants (just a sample - 2 offers per merchant would be too many)
    {
      id: "mcm_o7_2023",
      merchantId: "m6",
      name: "$10 off $50 purchase",
      shortText: "Store Discount",
      logoUrl: "https://placehold.co/400x200/00a/fff?text=Walmart+Logo",
    },
    {
      id: "mcm_o8_2023",
      merchantId: "m7",
      name: "15% off home decor",
      shortText: "Home Decor",
      logoUrl: "https://placehold.co/400x200/e11/fff?text=Target+Logo",
    },
    {
      id: "mcm_o9_2023",
      merchantId: "m8",
      name: "Free shipping on orders $25+",
      shortText: "Free Shipping",
      logoUrl: "https://placehold.co/400x200/ff9900/000?text=Amazon+Logo",
    },
    {
      id: "mcm_o10_2023",
      merchantId: "m9",
      name: "$50 off new iPhone",
      shortText: "iPhone Discount",
      logoUrl: "https://placehold.co/400x200/999/fff?text=Apple+Logo",
    },
    {
      id: "mcm_o11_2023",
      merchantId: "m10",
      name: "Free drink with food purchase",
      shortText: "Free Drink",
      logoUrl: "https://placehold.co/400x200/0a0/fff?text=Starbucks+Logo",
    },
  ];

  // Media type definitions
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

  // State for current ad being created/edited
  const [currentAd, setCurrentAd] = useState<{
    id: string | null;
    merchantId: string;
    merchantName: string;
    offerId: string;
    mediaTypes: string[];
    mediaAssetsByType: { [key: string]: MediaAsset[] };
  }>({
    id: null,
    merchantId: "",
    merchantName: "",
    offerId: "",
    mediaTypes: [],
    mediaAssetsByType: {},
  });

  // Other state
  const [isDragging, setIsDragging] = useState(false);
  const [draggedMediaType, setDraggedMediaType] = useState<string | null>(null);

  // Derived state - computed during render, no complex dependencies
  const availableOffers = useMemo(
    () => offers.filter((offer) => offer.merchantId === currentAd.merchantId),
    [currentAd.merchantId]
  );

  // Convert to combobox format - derived state
  const merchantOptions = useMemo(
    () =>
      merchants.map((merchant) => ({
        value: merchant.id,
        label: `${merchant.name} - ${merchant.dba}`,
      })),
    []
  );

  const offerOptions = useMemo(
    () =>
      availableOffers.map((offer) => ({
        value: offer.id,
        label: offer.name,
      })),
    [availableOffers]
  );

  // Form validation - derived state
  const isCurrentAdValid = useMemo(() => {
    if (
      !currentAd.merchantId ||
      !currentAd.offerId ||
      currentAd.mediaTypes.length === 0
    ) {
      return false;
    }

    // Check if required media types have assets (one asset per type)
    const requiredMediaTypes = currentAd.mediaTypes.filter((type) => {
      const mediaTypeDef = mediaTypes.find((mt) => mt.id === type);
      return mediaTypeDef?.requiresAsset;
    });

    const missingAssets = requiredMediaTypes.filter((type) => {
      return (
        !currentAd.mediaAssetsByType[type] ||
        currentAd.mediaAssetsByType[type].length === 0
      );
    });

    return missingAssets.length === 0;
  }, [currentAd]);

  // Preview data - derived state (show preview even if not fully valid)
  const previewData = useMemo(() => {
    // Show preview if we have basic info (merchant, offer, at least one media type)
    const hasBasicInfo =
      currentAd.merchantId &&
      currentAd.offerId &&
      currentAd.mediaTypes.length > 0;

    if (!hasBasicInfo) return null;

    // Find the first media type with assets for preview image
    let previewImageUrl: string | null = null;
    for (const mediaType of currentAd.mediaTypes) {
      const assets = currentAd.mediaAssetsByType[mediaType];
      if (assets && assets.length > 0) {
        previewImageUrl = assets[0].previewUrl;
        break;
      }
    }

    return {
      ...currentAd,
      isValid: hasBasicInfo, // Show preview with basic info
      offers: availableOffers,
      mediaTypeDefinitions: mediaTypes,
      previewImageUrl,
    };
  }, [currentAd, availableOffers]);

  // Update parent only when preview data actually changes and is valid
  useEffect(() => {
    if (previewData && onCurrentAdChange) {
      onCurrentAdChange(previewData);
    }
  }, [previewData, onCurrentAdChange]);

  // Update step validation when current ad changes
  useEffect(() => {
    setStepValidation(isCurrentAdValid);
  }, [isCurrentAdValid, setStepValidation]);

  // Handle merchant selection
  const handleMerchantChange = (merchantId: string) => {
    const merchant = merchants.find((m) => m.id === merchantId);
    setCurrentAd({
      ...currentAd,
      merchantId,
      merchantName: merchant ? merchant.name : "",
      offerId: "", // Reset offer when merchant changes
    });
  };

  // Handle offer selection
  const handleOfferChange = (offerId: string) => {
    setCurrentAd({
      ...currentAd,
      offerId,
    });
  };

  // Handle media type selection (multiple selection)
  const handleMediaTypeChange = (mediaType: string) => {
    const isSelected = currentAd.mediaTypes.includes(mediaType);
    const newMediaTypes = isSelected
      ? currentAd.mediaTypes.filter((type) => type !== mediaType)
      : [...currentAd.mediaTypes, mediaType];

    const newMediaAssetsByType = { ...currentAd.mediaAssetsByType };

    // If deselecting a media type, remove its assets
    if (isSelected) {
      delete newMediaAssetsByType[mediaType];
    } else {
      // If selecting a new media type, initialize empty assets array
      if (!newMediaAssetsByType[mediaType]) {
        newMediaAssetsByType[mediaType] = [];
      }
    }

    setCurrentAd({
      ...currentAd,
      mediaTypes: newMediaTypes,
      mediaAssetsByType: newMediaAssetsByType,
    });
  };

  // Handle file upload for specific media type (only one asset per type)
  const handleFileUpload = (file: File, mediaType: string) => {
    const newAsset: MediaAsset = {
      id: uuidv4(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      previewUrl: URL.createObjectURL(file),
    };

    const newMediaAssetsByType = { ...currentAd.mediaAssetsByType };
    // Replace existing asset with new one (only one asset per media type)
    newMediaAssetsByType[mediaType] = [newAsset];

    setCurrentAd({
      ...currentAd,
      mediaAssetsByType: newMediaAssetsByType,
    });
  };

  // Handle remove media for specific media type
  const handleRemoveMedia = (mediaType: string, assetId: string) => {
    const newMediaAssetsByType = { ...currentAd.mediaAssetsByType };
    if (newMediaAssetsByType[mediaType]) {
      newMediaAssetsByType[mediaType] = newMediaAssetsByType[mediaType].filter(
        (asset) => asset.id !== assetId
      );
    }

    setCurrentAd({
      ...currentAd,
      mediaAssetsByType: newMediaAssetsByType,
    });
  };

  // Handle file drop for specific media type
  const handleFileDrop = (
    e: React.DragEvent<HTMLDivElement>,
    mediaType: string
  ) => {
    e.preventDefault();
    setIsDragging(false);
    setDraggedMediaType(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file, mediaType);
    }
  };

  // Handle file selection from input for specific media type
  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    mediaType: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileUpload(file, mediaType);
    }
  };

  // Get logo URL for an offer
  const getLogoUrl = (offerId: string): string => {
    const offer = offers.find((o) => o.id === offerId);
    return offer
      ? offer.logoUrl
      : "https://placehold.co/400x200/ccf/fff?text=Logo";
  };

  // Get offer name for display
  const getOfferName = (offerId: string): string => {
    const offer = offers.find((o) => o.id === offerId);
    return offer ? offer.name : "";
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Check if we have any media types that require assets
  const hasRequiredAssetTypes = currentAd.mediaTypes.some((type) => {
    const mediaTypeDef = mediaTypes.find((mt) => mt.id === type);
    return mediaTypeDef?.requiresAsset;
  });

  return (
    <div className="space-y-3">
      {/* Create Asset Form */}
      <Card className="overflow-hidden border border-slate-200">
        <div className="border-b border-slate-200 px-2 py-2 bg-blue-50">
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-sm flex items-center justify-center bg-blue-600 text-white mr-2">
              <Plus className="h-2.5 w-2.5" />
            </div>
            <h3 className="text-xs font-medium text-blue-800">
              Create Campaign Asset
            </h3>
          </div>
        </div>

        <div className="p-3">
          {/* Form Controls - Stacked vertically */}
          <div className="space-y-2 mb-3">
            <div>
              <Label
                htmlFor="merchant"
                className="text-xs mb-1 block font-medium text-slate-600"
              >
                Merchant*
              </Label>
              <Combobox
                options={merchantOptions}
                value={currentAd.merchantId}
                onChange={handleMerchantChange}
                placeholder="Type to search merchants..."
                searchPlaceholder="Type to search merchants..."
                emptyText="No merchants found"
                searchFirst={true}
                className="h-8 border-slate-300 hover:border-blue-400 focus:border-blue-500 shadow-sm text-xs"
              />
            </div>

            <div>
              <Label
                htmlFor="offer"
                className="text-xs mb-1 block font-medium text-slate-600"
              >
                Offer*
              </Label>
              {currentAd.merchantId ? (
                <Combobox
                  options={offerOptions}
                  value={currentAd.offerId}
                  onChange={handleOfferChange}
                  placeholder="Select an offer..."
                  searchPlaceholder="Search offers..."
                  emptyText="No offers found"
                  maxDisplayItems={10}
                  className="h-8 border-slate-300 hover:border-blue-400 focus:border-blue-500 shadow-sm text-xs"
                />
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-8 text-slate-500 justify-start font-normal border-slate-200 text-xs"
                  disabled
                >
                  Select a merchant first
                </Button>
              )}
            </div>
          </div>

          {/* Media Type Options - Updated for multiple selection */}
          <div className="mb-3">
            <Label className="text-xs mb-1 block font-medium text-slate-600">
              Media Types* (Select multiple)
            </Label>
            <div className="grid grid-cols-3 gap-1.5">
              {mediaTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-1.5 border rounded cursor-pointer transition-colors relative ${
                    currentAd.mediaTypes.includes(type.id)
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => handleMediaTypeChange(type.id)}
                >
                  {/* Checkbox indicator */}
                  <div className="absolute top-1 right-1">
                    <div
                      className={`w-3 h-3 rounded-sm border flex items-center justify-center ${
                        currentAd.mediaTypes.includes(type.id)
                          ? "bg-blue-600 border-blue-600"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {currentAd.mediaTypes.includes(type.id) && (
                        <Check className="h-2 w-2 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="text-xs font-medium mb-0.5 text-slate-700 pr-4">
                    {type.label}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {type.dimensions}
                  </div>
                </div>
              ))}
            </div>
            {currentAd.mediaTypes.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {currentAd.mediaTypes.map((typeId) => {
                  const type = mediaTypes.find((t) => t.id === typeId);
                  return (
                    <Badge key={typeId} variant="outline" className="text-xs">
                      {type?.label}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upload Sections - Per Media Type */}
          {currentAd.merchantId &&
            currentAd.offerId &&
            currentAd.mediaTypes.length > 0 && (
              <div className="border-t border-slate-200 pt-3">
                <Label className="text-xs mb-2 block font-medium text-slate-600">
                  Upload Assets by Media Type
                  <span className="text-blue-600 ml-1">
                    → Preview updates in right panel
                  </span>
                </Label>

                <div className="space-y-3">
                  {currentAd.mediaTypes.map((mediaTypeId) => {
                    const mediaType = mediaTypes.find(
                      (mt) => mt.id === mediaTypeId
                    );
                    if (!mediaType) return null;

                    const assets =
                      currentAd.mediaAssetsByType[mediaTypeId] || [];
                    const requiresAsset = mediaType.requiresAsset;

                    return (
                      <div
                        key={mediaTypeId}
                        className="border border-slate-200 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <h4 className="text-xs font-medium text-slate-700">
                              {mediaType.label}
                            </h4>
                            <Badge
                              variant="outline"
                              className="text-[10px] ml-2"
                            >
                              {mediaType.dimensions}
                            </Badge>
                          </div>
                          {requiresAsset && (
                            <Badge
                              variant={
                                assets.length > 0 ? "default" : "destructive"
                              }
                              className="text-[10px]"
                            >
                              {assets.length > 0
                                ? "Asset uploaded"
                                : "Required"}
                            </Badge>
                          )}
                        </div>

                        {requiresAsset ? (
                          <div>
                            {assets.length === 0 ? (
                              /* Upload Section - Only visible when no asset exists */
                              <div
                                className={`border-2 border-dashed rounded p-3 transition-colors ${
                                  isDragging && draggedMediaType === mediaTypeId
                                    ? "border-blue-400 bg-blue-50"
                                    : "border-slate-300 hover:border-slate-400"
                                }`}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  setIsDragging(true);
                                  setDraggedMediaType(mediaTypeId);
                                }}
                                onDragLeave={() => {
                                  setIsDragging(false);
                                  setDraggedMediaType(null);
                                }}
                                onDrop={(e) => handleFileDrop(e, mediaTypeId)}
                              >
                                <div className="flex flex-col items-center justify-center text-center">
                                  <ImagePlus className="h-4 w-4 text-slate-400 mb-1.5" />
                                  <p className="text-xs font-medium mb-0.5 text-slate-600">
                                    Upload Asset for {mediaType.label}
                                  </p>
                                  <p className="text-xs text-slate-500 mb-2">
                                    Drag file here or browse
                                  </p>
                                  <input
                                    type="file"
                                    id={`fileUpload-${mediaTypeId}`}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleFileSelect(e, mediaTypeId)
                                    }
                                  />
                                  <Button
                                    size="sm"
                                    className="h-6 text-xs px-3"
                                    onClick={() =>
                                      document
                                        .getElementById(
                                          `fileUpload-${mediaTypeId}`
                                        )
                                        ?.click()
                                    }
                                  >
                                    <Upload className="h-2.5 w-2.5 mr-1" />
                                    Browse File
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              /* Asset Display - Only show the single asset with delete option */
                              <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded border">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 bg-slate-100 rounded overflow-hidden mr-3">
                                    <img
                                      src={assets[0].previewUrl}
                                      alt={assets[0].name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-slate-700">
                                      {assets[0].name}
                                    </p>
                                    <p className="text-[10px] text-slate-500">
                                      {formatFileSize(assets[0].size)}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveMedia(mediaTypeId, assets[0].id)
                                  }
                                  className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                  title="Remove asset"
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center bg-slate-50 border rounded p-2">
                            <div className="flex items-center text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1.5" />
                              <span className="text-xs text-slate-600">
                                Native format uses the merchant logo - no upload
                                required
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
        </div>
      </Card>
    </div>
  );
};

export default AdCreationStep;
