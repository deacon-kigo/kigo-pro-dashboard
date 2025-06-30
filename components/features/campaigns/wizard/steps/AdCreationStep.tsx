"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Label } from "@/components/atoms/Label";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Input } from "@/components/atoms/Input";
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
  onAssetUploadRef?: React.MutableRefObject<
    ((mediaType: string, file: File) => void) | null
  >;
  onAssetRemoveRef?: React.MutableRefObject<
    ((mediaType: string, assetId: string) => void) | null
  >;
  onCreateAd?: () => void;
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
  onAssetUploadRef,
  onAssetRemoveRef,
  onCreateAd,
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
    name: string;
    merchantId: string;
    merchantName: string;
    offerId: string;
    mediaTypes: string[];
    mediaAssetsByType: { [key: string]: MediaAsset[] };
  }>({
    id: null,
    name: "",
    merchantId: "",
    merchantName: "",
    offerId: "",
    mediaTypes: [],
    mediaAssetsByType: {},
  });

  // State for editing mode
  const [editingAdId, setEditingAdId] = useState<string | null>(null);

  // Other state
  const [isDragging, setIsDragging] = useState(false);
  const [draggedMediaType, setDraggedMediaType] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState<{ [key: string]: string }>(
    {}
  );

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
      !currentAd.name.trim() ||
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

    // Set "Media file is required" errors for missing assets
    const newErrors = { ...uploadErrors };
    requiredMediaTypes.forEach((type) => {
      const hasAsset =
        currentAd.mediaAssetsByType[type] &&
        currentAd.mediaAssetsByType[type].length > 0;
      if (!hasAsset && !newErrors[type]) {
        newErrors[type] = "Media file is required.";
      } else if (hasAsset && newErrors[type] === "Media file is required.") {
        delete newErrors[type];
      }
    });

    // Only update errors if they've actually changed
    if (JSON.stringify(newErrors) !== JSON.stringify(uploadErrors)) {
      setTimeout(() => setUploadErrors(newErrors), 0);
    }

    return missingAssets.length === 0;
  }, [currentAd, uploadErrors]);

  // Handle merchant selection
  const handleMerchantChange = (merchantId: string) => {
    const merchant = merchants.find((m) => m.id === merchantId);
    setCurrentAd({
      ...currentAd,
      merchantId,
      merchantName: merchant ? merchant.name : "",
      offerId: "", // Reset offer when merchant changes
      mediaTypes: [], // Clear media types when merchant changes
      mediaAssetsByType: {}, // Clear all uploaded assets when merchant changes
    });

    // Clear any upload errors
    setUploadErrors({});
  };

  // Handle offer selection
  const handleOfferChange = (offerId: string) => {
    setCurrentAd({
      ...currentAd,
      offerId,
      mediaTypes: [], // Clear media types when offer changes
      mediaAssetsByType: {}, // Clear all uploaded assets when offer changes
    });

    // Clear any upload errors
    setUploadErrors({});
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
      // Clear upload errors for this media type
      const newUploadErrors = { ...uploadErrors };
      delete newUploadErrors[mediaType];
      setUploadErrors(newUploadErrors);
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

  // File validation function
  const validateFile = (file: File, mediaType: string): string | null => {
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return "File must be under 10MB.";
    }

    // Check file type (JPG or PNG only)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return "File must be a JPG or PNG.";
    }

    return null; // No errors
  };

  // Handle file upload for specific media type (only one asset per type)
  const handleFileUpload = (file: File, mediaType: string) => {
    // Clear any existing errors for this media type
    const newErrors = { ...uploadErrors };
    delete newErrors[mediaType];
    setUploadErrors(newErrors);

    // Validate the file
    const validationError = validateFile(file, mediaType);
    if (validationError) {
      setUploadErrors({
        ...newErrors,
        [mediaType]: validationError,
      });
      return;
    }

    try {
      const newAsset: MediaAsset = {
        id: uuidv4(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        previewUrl: URL.createObjectURL(file),
        mediaType: mediaType, // Add mediaType to track which media type this asset belongs to
      };

      const newMediaAssetsByType = { ...currentAd.mediaAssetsByType };
      // Replace existing asset with new one (only one asset per media type)
      newMediaAssetsByType[mediaType] = [newAsset];

      const updatedAd = {
        ...currentAd,
        mediaAssetsByType: newMediaAssetsByType,
      };

      setCurrentAd(updatedAd);
    } catch (error) {
      setUploadErrors({
        ...newErrors,
        [mediaType]:
          "Sorry, something went wrong on our end. Please try again.",
      });
    }
  };

  // Handle remove media for specific media type
  const handleRemoveMedia = (mediaType: string, assetId: string) => {
    const newMediaAssetsByType = { ...currentAd.mediaAssetsByType };
    if (newMediaAssetsByType[mediaType]) {
      newMediaAssetsByType[mediaType] = newMediaAssetsByType[mediaType].filter(
        (asset) => asset.id !== assetId
      );
    }

    // Clear upload errors for this media type when removing
    const newErrors = { ...uploadErrors };
    delete newErrors[mediaType];
    setUploadErrors(newErrors);

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

  // Expose asset management functions via refs for external access (e.g., preview modal)
  useEffect(() => {
    if (onAssetUploadRef) {
      onAssetUploadRef.current = (mediaType: string, file: File) => {
        handleFileUpload(file, mediaType);
      };
    }
    if (onAssetRemoveRef) {
      onAssetRemoveRef.current = handleRemoveMedia;
    }
  }, [onAssetUploadRef, onAssetRemoveRef]);

  // Check if we have any media types that require assets
  const hasRequiredAssetTypes = currentAd.mediaTypes.some((type) => {
    const mediaTypeDef = mediaTypes.find((mt) => mt.id === type);
    return mediaTypeDef?.requiresAsset;
  });

  // Handle creating/confirming an ad
  const handleCreateAd = () => {
    if (!isCurrentAdValid) return;

    const newAd: CampaignAd = {
      id: currentAd.id || uuidv4(),
      name: currentAd.name,
      merchantId: currentAd.merchantId,
      merchantName: currentAd.merchantName,
      offerId: currentAd.offerId,
      mediaType: currentAd.mediaTypes, // Use mediaType (array) as per interface
      mediaAssets: Object.values(currentAd.mediaAssetsByType).flat(),
      costPerActivation: 0, // Default values for required fields
      costPerRedemption: 0,
    };

    if (editingAdId) {
      // Update existing ad
      updateAd(editingAdId, newAd);
      setEditingAdId(null);
    } else {
      // Add new ad
      addAd(newAd);
    }

    // Reset form
    setCurrentAd({
      id: null,
      name: "",
      merchantId: "",
      merchantName: "",
      offerId: "",
      mediaTypes: [],
      mediaAssetsByType: {},
    });

    // Clear errors
    setUploadErrors({});
  };

  // Handle editing an existing ad
  const handleEditAd = (ad: CampaignAd) => {
    setEditingAdId(ad.id);

    // Reconstruct mediaAssetsByType from mediaAssets
    const mediaAssetsByType: { [key: string]: MediaAsset[] } = {};
    ad.mediaAssets?.forEach((asset) => {
      // Use the mediaType property from the asset
      const mediaType = asset.mediaType || "display_banner"; // fallback
      if (!mediaAssetsByType[mediaType]) {
        mediaAssetsByType[mediaType] = [];
      }
      mediaAssetsByType[mediaType].push(asset);
    });

    setCurrentAd({
      id: ad.id,
      name: ad.name,
      merchantId: ad.merchantId,
      merchantName: ad.merchantName,
      offerId: ad.offerId,
      mediaTypes: ad.mediaType, // Use mediaType from CampaignAd
      mediaAssetsByType,
    });
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingAdId(null);
    setCurrentAd({
      id: null,
      name: "",
      merchantId: "",
      merchantName: "",
      offerId: "",
      mediaTypes: [],
      mediaAssetsByType: {},
    });
    setUploadErrors({});
  };

  // Check if we're in edit mode (there's already an ad created)
  const isEditMode = ads.length > 0;
  const existingAd = isEditMode ? ads[0] : null;

  // Initialize form with existing ad data if in edit mode
  useEffect(() => {
    if (isEditMode && existingAd && !currentAd.name) {
      // Reconstruct mediaAssetsByType from existing ad
      const mediaAssetsByType: { [key: string]: MediaAsset[] } = {};
      existingAd.mediaAssets?.forEach((asset) => {
        const mediaType = asset.mediaType || "display_banner";
        if (!mediaAssetsByType[mediaType]) {
          mediaAssetsByType[mediaType] = [];
        }
        mediaAssetsByType[mediaType].push(asset);
      });

      setCurrentAd({
        id: existingAd.id,
        name: existingAd.name,
        merchantId: existingAd.merchantId,
        merchantName: existingAd.merchantName,
        offerId: existingAd.offerId,
        mediaTypes: existingAd.mediaType,
        mediaAssetsByType,
      });
    }
  }, [isEditMode, existingAd, currentAd.name]);

  // Preview data - always show current form state for real-time sync
  const previewData = useMemo(() => {
    // Always use current form state as the source of truth for preview
    const hasBasicInfo =
      currentAd.merchantId &&
      currentAd.offerId &&
      currentAd.mediaTypes.length > 0;

    let currentAdPreview: CampaignAd | null = null;

    if (hasBasicInfo || currentAd.name) {
      // Find the first media type with assets for preview image
      let previewImageUrl: string | null = null;
      for (const mediaType of currentAd.mediaTypes) {
        const assets = currentAd.mediaAssetsByType[mediaType];
        if (assets && assets.length > 0) {
          previewImageUrl = assets[0].previewUrl;
          break;
        }
      }

      // Create preview data from current form state
      const previewAd: CampaignAd = {
        id:
          currentAd.id ||
          (isEditMode && existingAd ? existingAd.id : "temp-preview"),
        name: currentAd.name,
        merchantId: currentAd.merchantId,
        merchantName: currentAd.merchantName,
        offerId: currentAd.offerId,
        mediaType: currentAd.mediaTypes,
        mediaAssets: Object.values(currentAd.mediaAssetsByType).flat(),
        costPerActivation: 0,
        costPerRedemption: 0,
      };

      // Add preview-specific properties for the preview panel
      currentAdPreview = {
        ...previewAd,
        mediaAssetsByType: currentAd.mediaAssetsByType,
        isValid: isCurrentAdValid,
        offers: availableOffers,
        mediaTypeDefinitions: mediaTypes,
        previewImageUrl,
        isPreview: !isEditMode,
        isEditing: isEditMode,
      } as any;
    }

    // Return preview data that always reflects current form state
    return {
      // Show current form state in preview (single ad)
      ads: currentAdPreview ? [currentAdPreview as CampaignAd] : [],
      // Current ad being worked on
      currentAd: currentAdPreview,
      // Total count for display
      totalAds: currentAdPreview ? 1 : 0,
      // Is there a valid preview to show
      hasPreview: hasBasicInfo || currentAd.name,
      // Available offers for the current merchant
      offers: availableOffers,
      mediaTypeDefinitions: mediaTypes,
    };
  }, [currentAd, availableOffers, isCurrentAdValid, isEditMode, existingAd]);

  // Update parent only when preview data actually changes
  useEffect(() => {
    if (onCurrentAdChange) {
      onCurrentAdChange(previewData);
    }
  }, [previewData, onCurrentAdChange]);

  // Update step validation based on total ads created or current ad validity in edit mode
  useEffect(() => {
    setStepValidation(ads.length > 0 || (isEditMode && isCurrentAdValid));
  }, [ads.length, setStepValidation, isEditMode, isCurrentAdValid]);

  // Handle manual ad update in edit mode
  const handleUpdateAd = () => {
    if (!isCurrentAdValid || !existingAd) return;

    const updatedAd: CampaignAd = {
      id: existingAd.id,
      name: currentAd.name,
      merchantId: currentAd.merchantId,
      merchantName: currentAd.merchantName,
      offerId: currentAd.offerId,
      mediaType: currentAd.mediaTypes,
      mediaAssets: Object.values(currentAd.mediaAssetsByType).flat(),
      costPerActivation: existingAd.costPerActivation,
      costPerRedemption: existingAd.costPerRedemption,
    };

    updateAd(existingAd.id, updatedAd);
  };

  return (
    <div className="space-y-3">
      {/* Create Asset Form */}
      <Card className="overflow-hidden border border-slate-200 p-0">
        <div className="p-6">
          {/* Form Controls - Stacked vertically */}
          <div className="space-y-6 mb-8">
            <div>
              <Label
                htmlFor="adName"
                className="text-sm mb-2 block font-medium text-slate-600"
              >
                Ad Name*
              </Label>
              <Input
                id="adName"
                value={currentAd.name}
                onChange={(e) =>
                  setCurrentAd({ ...currentAd, name: e.target.value })
                }
                placeholder="Enter ad name..."
                className="w-full"
              />
            </div>

            <div>
              <Label
                htmlFor="merchant"
                className="text-sm mb-2 block font-medium text-slate-600"
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
                className="w-full"
              />
            </div>

            <div>
              <Label
                htmlFor="offer"
                className="text-sm mb-2 block font-medium text-slate-600"
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
                  searchFirst={true}
                  className="w-full"
                />
              ) : (
                <div className="w-full [&>div]:flex [&>div]:w-full">
                  <Button
                    variant="outline"
                    className="w-full text-muted-foreground justify-start font-normal"
                    disabled
                  >
                    Select a merchant first
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Media Type Options - Updated for multiple selection */}
          <div>
            <Label className="text-sm mb-4 block font-medium text-slate-600">
              Media Types* (Select multiple)
            </Label>
            <div className="grid grid-cols-3 gap-4 items-start">
              {mediaTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 h-[88px] flex flex-col ${
                    currentAd.mediaTypes.includes(type.id)
                      ? "border-primary"
                      : "border-input hover:border-primary/50 hover:bg-accent"
                  }`}
                  onClick={() => handleMediaTypeChange(type.id)}
                >
                  <div className="text-sm font-medium mb-2 flex-shrink-0 text-foreground">
                    {type.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {type.dimensions}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Sections - Per Media Type */}
          {currentAd.merchantId &&
            currentAd.offerId &&
            currentAd.mediaTypes.length > 0 && (
              <div className="border-t border-slate-200 pt-6 mt-6">
                <Label className="text-sm mb-4 block font-medium text-slate-600">
                  Upload Assets by Media Type
                  <span className="text-blue-600 ml-1">
                    → Preview updates in right panel
                  </span>
                </Label>

                <div className="space-y-6">
                  {mediaTypes
                    .filter((mediaType) =>
                      currentAd.mediaTypes.includes(mediaType.id)
                    )
                    .map((mediaType) => {
                      const mediaTypeId = mediaType.id;

                      const assets =
                        currentAd.mediaAssetsByType[mediaTypeId] || [];
                      const requiresAsset = mediaType.requiresAsset;

                      return (
                        <div
                          key={mediaTypeId}
                          className="border border-slate-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <h4 className="text-sm font-medium text-slate-700">
                                {mediaType.label}
                              </h4>
                              <Badge variant="outline" className="text-sm ml-2">
                                {mediaType.dimensions}
                              </Badge>
                            </div>
                            {requiresAsset && (
                              <Badge
                                variant={
                                  assets.length > 0 ? "default" : "destructive"
                                }
                                className="text-sm"
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
                                <div>
                                  <div
                                    className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                                      uploadErrors[mediaTypeId]
                                        ? "border-red-300 bg-red-50"
                                        : isDragging &&
                                            draggedMediaType === mediaTypeId
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
                                    onDrop={(e) =>
                                      handleFileDrop(e, mediaTypeId)
                                    }
                                  >
                                    <div className="flex flex-col items-center justify-center text-center">
                                      <ImagePlus
                                        className={`h-6 w-6 mb-3 ${
                                          uploadErrors[mediaTypeId]
                                            ? "text-red-400"
                                            : "text-slate-400"
                                        }`}
                                      />
                                      <p
                                        className={`text-sm font-medium mb-2 ${
                                          uploadErrors[mediaTypeId]
                                            ? "text-red-600"
                                            : "text-slate-600"
                                        }`}
                                      >
                                        {uploadErrors[mediaTypeId]
                                          ? "File upload"
                                          : `Upload Asset for ${mediaType.label}`}
                                      </p>
                                      <p
                                        className={`text-sm mb-4 ${
                                          uploadErrors[mediaTypeId]
                                            ? "text-red-500"
                                            : "text-slate-500"
                                        }`}
                                      >
                                        JPG or PNG (max file size: 10MB)
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
                                        className="h-10 text-sm px-6"
                                        onClick={() =>
                                          document
                                            .getElementById(
                                              `fileUpload-${mediaTypeId}`
                                            )
                                            ?.click()
                                        }
                                      >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Choose file
                                      </Button>
                                    </div>
                                  </div>
                                  {/* Error message display */}
                                  {uploadErrors[mediaTypeId] && (
                                    <div className="mt-4">
                                      <p className="text-sm text-red-600">
                                        {uploadErrors[mediaTypeId]}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                /* Asset Display - Only show the single asset with delete option */
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded border">
                                  <div className="flex items-center">
                                    <div className="h-12 w-12 bg-slate-100 rounded overflow-hidden mr-3">
                                      <img
                                        src={assets[0].previewUrl}
                                        alt={assets[0].name}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-slate-700">
                                        {assets[0].name}
                                      </p>
                                      <p className="text-sm text-slate-500">
                                        {formatFileSize(assets[0].size)}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleRemoveMedia(
                                        mediaTypeId,
                                        assets[0].id
                                      )
                                    }
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    title="Remove asset"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center bg-slate-50 border rounded p-3">
                              <div className="flex items-center text-sm">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                                <span className="text-sm text-slate-600">
                                  Native format uses the merchant logo - no
                                  upload required
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

          {/* Progress Status */}
          {currentAd.merchantId &&
            currentAd.offerId &&
            currentAd.mediaTypes.length > 0 && (
              <div className="border-t border-slate-200 pt-6 mt-6">
                {isEditMode ? (
                  // Edit Mode - Show update button
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-slate-600">
                      {isCurrentAdValid ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ready to update ad
                        </span>
                      ) : (
                        <span className="flex items-center text-amber-600">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Complete all required fields
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={handleUpdateAd}
                      disabled={!isCurrentAdValid}
                      className="h-10 text-sm px-6"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Update Ad
                    </Button>
                  </div>
                ) : (
                  // Create Mode - Show create ad button
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-slate-600">
                      {isCurrentAdValid ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ready to create ad
                        </span>
                      ) : (
                        <span className="flex items-center text-amber-600">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Complete all required fields
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={() => {
                        handleCreateAd();
                        onCreateAd?.();
                      }}
                      disabled={!isCurrentAdValid}
                      className="h-10 text-sm px-6"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Preview Ad
                    </Button>
                  </div>
                )}
              </div>
            )}
        </div>
      </Card>
    </div>
  );
};

export default AdCreationStep;
