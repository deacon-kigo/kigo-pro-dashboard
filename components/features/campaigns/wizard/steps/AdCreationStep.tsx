"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/atoms/Label";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card/Card";
import { Textarea } from "@/components/atoms/Textarea";
import { CampaignAd, MediaAsset } from "@/lib/redux/slices/campaignSlice";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/atoms/Select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  Card as ShadcnCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from "uuid";
import {
  Plus,
  X,
  Upload,
  FileImage,
  DollarSign,
  Trash,
  CheckCircle2,
  Store,
  Tag,
  BarChart3,
  Image,
  ImagePlus,
  AlertCircle,
  LayoutGrid,
  MoreHorizontal,
  Edit,
  ChevronRight
} from "lucide-react";

interface AdCreationStepProps {
  ads: CampaignAd[];
  addAd: (ad: CampaignAd) => void;
  updateAd: (id: string, data: Partial<CampaignAd>) => void;
  removeAd: (id: string) => void;
  addMediaToAd: (adId: string, media: MediaAsset) => void;
  removeMediaFromAd: (adId: string, mediaId: string) => void;
  setStepValidation: (isValid: boolean) => void;
}

const AdCreationStep: React.FC<AdCreationStepProps> = ({
  ads,
  addAd,
  updateAd,
  removeAd,
  addMediaToAd,
  removeMediaFromAd,
  setStepValidation,
}) => {
  // Mock merchant data (would come from API in production)
  const merchants = [
    { id: "m1", name: "CVS Pharmacy", dba: "CVS Health" },
    { id: "m2", name: "Albertsons Companies", dba: "Albertsons" },
    { id: "m3", name: "Best Buy Co.", dba: "Best Buy" },
    { id: "m4", name: "T-Mobile USA", dba: "T-Mobile" },
    { id: "m5", name: "Chipotle Mexican Grill", dba: "Chipotle" },
  ];

  // Mock offer data (would come from API in production)
  const offers = [
    {
      id: "mcm_o1_2023",
      merchantId: "m1",
      name: "30% off select vitamins",
      shortText: "Vitamins Sale",
      logoUrl: "https://placehold.co/400x200/ccf/fff?text=CVS+Logo"
    },
    {
      id: "mcm_o2_2023",
      merchantId: "m1",
      name: "Buy 1 Get 1 on cough & cold",
      shortText: "Cold Medicine",
      logoUrl: "https://placehold.co/400x200/ccf/fff?text=CVS+Logo"
    },
    {
      id: "mcm_o3_2023",
      merchantId: "m2",
      name: "$5 off $25 grocery purchase",
      shortText: "Grocery Deal",
      logoUrl: "https://placehold.co/400x200/afa/333?text=Albertsons+Logo"
    },
    {
      id: "mcm_o4_2023",
      merchantId: "m3",
      name: "15% off laptops",
      shortText: "Laptop Discount",
      logoUrl: "https://placehold.co/400x200/00f/fff?text=Best+Buy+Logo"
    },
    {
      id: "mcm_o5_2023",
      merchantId: "m4",
      name: "$10 off monthly bill",
      shortText: "Bill Credit",
      logoUrl: "https://placehold.co/400x200/f5f/fff?text=T-Mobile+Logo"
    },
    {
      id: "mcm_o6_2023",
      merchantId: "m5",
      name: "Free guacamole with entrée",
      shortText: "Free Guac",
      logoUrl: "https://placehold.co/400x200/3b3/fff?text=Chipotle+Logo"
    },
  ];

  // Media types
  const mediaTypes = [
    {
      id: "banner",
      label: "Display Banner",
      description: "Standard display ad banners",
    },
    {
      id: "native",
      label: "Native Ad",
      description: "Ads that match the look & feel of the platform",
    },
    {
      id: "carousel",
      label: "Carousel",
      description: "Multiple images in rotating gallery",
    },
    { id: "video", label: "Video", description: "Video advertisements" },
    {
      id: "doubleExposure",
      label: "Double Decker",
      description: "Large format ads with two visual sections",
    },
  ];

  // Replace the banner size info with more detailed requirements
  const bannerTypeInfo = [
    { 
      name: "Wide Display Banner", 
      size: "970x250", 
      maxCount: 5,
      fileType: "JPG or PNG (max file size: 10MB)",
      description: "The most prominent advertising option. Appears in the top half of the offer platform Home screen.",
      icon: "🖥️"
    },
    { 
      name: "Double-Decker Banner", 
      size: "320x480", 
      maxCount: 5,
      fileType: "JPG or PNG (max file size: 10MB)",
      description: "Named for being the height of two default offer cards. Appears within the list of nearby offers and search results.",
      icon: "📱"
    },
    { 
      name: "Leaderboard", 
      size: "728x90", 
      fileType: "JPG or PNG (max file size: 10MB)",
      description: "Desktop horizontal banner that appears throughout the platform.",
      icon: "💻"
    },
    { 
      name: "MREC", 
      size: "300x250", 
      fileType: "JPG or PNG (max file size: 10MB)",
      description: "Medium rectangle format for both mobile and desktop views.",
      icon: "📲"
    },
    { 
      name: "Mobile Banner", 
      size: "320x50", 
      fileType: "JPG or PNG (max file size: 10MB)",
      description: "Compact horizontal format designed specifically for mobile views.",
      icon: "📱"
    },
    { 
      name: "In-line Featured Card", 
      size: "Auto-generated",
      fileType: "No upload needed",
      description: "Uses the merchant logo with a circular border in the logo's primary color. Appears within the list of nearby offers and search results.",
      icon: "✨",
      autoGenerated: true
    }
  ];

  // Form state for ad creation
  const [currentAd, setCurrentAd] = useState<{
    merchantId: string;
    merchantName: string;
    offerId: string;
    mediaType: string[];
    costPerActivation: string;
    costPerRedemption: string;
  }>({
    merchantId: "",
    merchantName: "",
    offerId: "",
    mediaType: [],
    costPerActivation: "0.15",
    costPerRedemption: "1.50",
  });

  // Local state for drag and drop file upload
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  
  // State for creation and editing modes
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [creationStep, setCreationStep] = useState<number>(1);
  const [creatingNew, setCreatingNew] = useState<boolean>(false);
  const [expandedAdId, setExpandedAdId] = useState<string | null>(null);

  // Set step as valid when mounted or when ads are added/removed
  useEffect(() => {
    setStepValidation(true);
  }, [ads, setStepValidation]);

  // Get filtered offers based on selected merchant
  const filteredOffers = offers.filter(
    (offer) =>
      !currentAd.merchantId || offer.merchantId === currentAd.merchantId
  );

  // Handle merchant selection
  const handleMerchantChange = (merchantId: string) => {
    const merchant = merchants.find((m) => m.id === merchantId);

    setCurrentAd({
      ...currentAd,
      merchantId,
      merchantName: merchant ? merchant.dba : "",
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

  // Toggle media type selection
  const toggleMediaType = (typeId: string) => {
    setCurrentAd({
      ...currentAd,
      mediaType: currentAd.mediaType.includes(typeId)
        ? currentAd.mediaType.filter((id) => id !== typeId)
        : [...currentAd.mediaType, typeId],
    });
  };

  // Create a new ad
  const handleAddAd = () => {
    if (
      !currentAd.merchantId ||
      !currentAd.offerId ||
      currentAd.mediaType.length === 0
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const newAd: CampaignAd = {
      id: uuidv4(),
      merchantId: currentAd.merchantId,
      merchantName: currentAd.merchantName,
      offerId: currentAd.offerId,
      mediaType: currentAd.mediaType,
      mediaAssets: [],
      costPerActivation: parseFloat(currentAd.costPerActivation) || 0.15,
      costPerRedemption: parseFloat(currentAd.costPerRedemption) || 1.5,
    };

    addAd(newAd);
    setExpandedAdId(newAd.id);
    setCreationStep(2);

    // Reset form if not editing
    if (!editingAdId) {
      setCurrentAd({
        merchantId: "",
        merchantName: "",
        offerId: "",
        mediaType: [],
        costPerActivation: "0.15",
        costPerRedemption: "1.50",
      });
    } else {
      setEditingAdId(null);
    }
  };

  // Handle file drop for media uploads
  const handleFileDrop = (adId: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Process each dropped file
      Array.from(e.dataTransfer.files).forEach((file) => {
        // Mock file upload with progress
        const mediaId = uuidv4();
        setUploadProgress((prev) => ({ ...prev, [mediaId]: 0 }));

        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            const newProgress = (prev[mediaId] || 0) + 10;
            if (newProgress >= 100) {
              clearInterval(interval);

              // Create media asset
              const newMedia: MediaAsset = {
                id: mediaId,
                name: file.name,
                type: file.type,
                size: file.size,
                url: URL.createObjectURL(file),
                previewUrl: URL.createObjectURL(file),
                dimensions: { width: 300, height: 250 }, // Mock dimensions
              };

              // Add media to ad
              addMediaToAd(adId, newMedia);
            }
            return { ...prev, [mediaId]: newProgress };
          });
        }, 200);
      });
    }
  };

  // Handle file input change
  const handleFileSelect = (
    adId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      // Process each selected file
      Array.from(e.target.files).forEach((file) => {
        // Mock file upload with progress
        const mediaId = uuidv4();
        setUploadProgress((prev) => ({ ...prev, [mediaId]: 0 }));

        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            const newProgress = (prev[mediaId] || 0) + 10;
            if (newProgress >= 100) {
              clearInterval(interval);

              // Create media asset
              const newMedia: MediaAsset = {
                id: mediaId,
                name: file.name,
                type: file.type,
                size: file.size,
                url: URL.createObjectURL(file),
                previewUrl: URL.createObjectURL(file),
                dimensions: { width: 300, height: 250 }, // Mock dimensions
              };

              // Add media to ad
              addMediaToAd(adId, newMedia);
            }
            return { ...prev, [mediaId]: newProgress };
          });
        }, 200);
      });
    }
  };

  // Start creating a new ad
  const startNewAd = () => {
    setCreatingNew(true);
    setCreationStep(1);
    setCurrentAd({
      merchantId: "",
      merchantName: "",
      offerId: "",
      mediaType: [],
      costPerActivation: "0.15",
      costPerRedemption: "1.50",
    });
  };

  // Cancel ad creation
  const cancelCreation = () => {
    setCreatingNew(false);
    setEditingAdId(null);
    setCreationStep(1);
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Get offer name by ID
  const getOfferName = (offerId: string): string => {
    const offer = offers.find((o) => o.id === offerId);
    return offer ? `${offer.name} (${offer.shortText})` : offerId;
  };

  // Get number of assets for an ad
  const getAssetCount = (adId: string): number => {
    const ad = ads.find(ad => ad.id === adId);
    return ad ? ad.mediaAssets.length : 0;
  };

  // Get logo URL for an ad
  const getLogoUrl = (offerId: string): string => {
    const offer = offers.find(o => o.id === offerId);
    return offer?.logoUrl || "";
  };

  // Get media type label
  const getMediaTypeLabel = (typeId: string): string => {
    const type = mediaTypes.find(t => t.id === typeId);
    return type?.label || typeId;
  };

  return (
    <div className="space-y-6">
      {/* Campaign Ads Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Campaign Advertisements</h3>
          <p className="text-sm text-muted-foreground">
            Create one or more advertisements for this campaign
          </p>
        </div>
        {!creatingNew && (
          <Button onClick={startNewAd} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add New Ad
          </Button>
        )}
      </div>

      {/* New Ad Creation Flow */}
      {creatingNew && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Step Header */}
          <div className="flex justify-between items-center p-3 border-b bg-muted/20">
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2">
                {creationStep}
              </span>
              <h4 className="text-sm font-medium">
                {creationStep === 1 ? "Ad Details" : "Upload Media"}
              </h4>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={cancelCreation}
              className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Step 1: Ad Details */}
          {creationStep === 1 && (
            <div className="p-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="merchant">Merchant*</Label>
                    <Select
                      value={currentAd.merchantId}
                      onValueChange={handleMerchantChange}
                    >
                      <SelectTrigger id="merchant" className="mt-1">
                        <SelectValue placeholder="Select a merchant" />
                      </SelectTrigger>
                      <SelectContent>
                        {merchants.map((merchant) => (
                          <SelectItem key={merchant.id} value={merchant.id}>
                            {merchant.name} - {merchant.dba}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="offer">Offer ID*</Label>
                    <Select
                      value={currentAd.offerId}
                      onValueChange={handleOfferChange}
                      disabled={!currentAd.merchantId}
                    >
                      <SelectTrigger id="offer" className="mt-1">
                        <SelectValue
                          placeholder={
                            currentAd.merchantId
                              ? "Select an offer"
                              : "Select a merchant first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredOffers.map((offer) => (
                          <SelectItem key={offer.id} value={offer.id}>
                            {offer.id} - {offer.shortText}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Each ad is associated with exactly one offer ID
                    </p>
                  </div>

                  {currentAd.offerId && (
                    <div className="border rounded-md p-3 bg-muted/10 flex flex-col items-center">
                      <img 
                        src={offers.find(o => o.id === currentAd.offerId)?.logoUrl} 
                        alt="Merchant Logo" 
                        className="h-16 object-contain"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Logo imported from mom database (not editable)
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="costPerActivation">Cost Per Activation ($)</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="costPerActivation"
                          type="number"
                          step="0.01"
                          min="0"
                          value={currentAd.costPerActivation}
                          onChange={(e) =>
                            setCurrentAd({
                              ...currentAd,
                              costPerActivation: e.target.value,
                            })
                          }
                          className="pl-8"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="costPerRedemption">Cost Per Redemption ($)</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="costPerRedemption"
                          type="number"
                          step="0.01"
                          min="0"
                          value={currentAd.costPerRedemption}
                          onChange={(e) =>
                            setCurrentAd({
                              ...currentAd,
                              costPerRedemption: e.target.value,
                            })
                          }
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Media Types* (Select all that apply)</Label>
                  <div className="grid grid-cols-1 gap-2 mt-1">
                    {mediaTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`p-2 border rounded-md cursor-pointer transition-all ${
                          currentAd.mediaType.includes(type.id)
                            ? "border-primary bg-primary/5"
                            : "hover:border-muted-foreground"
                        }`}
                        onClick={() => toggleMediaType(type.id)}
                      >
                        <div className="flex items-start">
                          <Checkbox
                            id={`mediaType-${type.id}`}
                            checked={currentAd.mediaType.includes(type.id)}
                            className="mt-0.5 mr-2"
                          />
                          <div>
                            <Label
                              htmlFor={`mediaType-${type.id}`}
                              className="font-medium cursor-pointer text-sm"
                            >
                              {type.label}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button 
                  variant="outline" 
                  className="mr-2"
                  onClick={cancelCreation}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddAd} 
                  disabled={!currentAd.merchantId || !currentAd.offerId || currentAd.mediaType.length === 0}
                >
                  Continue to Upload Media
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Asset Upload */}
          {creationStep === 2 && expandedAdId && (
            <div className="p-3">
              <div className="flex flex-col space-y-4">
                <div className="bg-muted/20 p-3 rounded-md flex items-center">
                  <img 
                    src={getLogoUrl(ads.find(ad => ad.id === expandedAdId)?.offerId || "")}
                    alt="Logo" 
                    className="h-10 w-10 object-contain mr-3"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{ads.find(ad => ad.id === expandedAdId)?.merchantName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {ads.find(ad => ad.id === expandedAdId)?.offerId}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {ads.find(ad => ad.id === expandedAdId)?.mediaType.map(type => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {getMediaTypeLabel(type)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Upload Zone */}
                <div
                  className={`border-2 border-dashed rounded-md p-5 text-center transition-colors ${
                    isDragging ? "border-primary bg-primary/5" : "border-muted"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => handleFileDrop(expandedAdId, e)}
                >
                  <div className="flex flex-col items-center">
                    <ImagePlus className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-base mb-2">Upload Ad Media Assets</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop files here or click to upload
                    </p>
                    <input
                      type="file"
                      id="fileUpload"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileSelect(expandedAdId, e)}
                    />
                    <Button
                      onClick={() => document.getElementById("fileUpload")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Select Files
                    </Button>
                  </div>
                </div>

                {/* Banner Type Requirements */}
                <div className="mt-5 border rounded-md overflow-hidden">
                  <div className="p-3 bg-muted/20 border-b">
                    <h4 className="text-sm font-medium flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-primary" />
                      Banner Requirements
                    </h4>
                  </div>
                  <div className="p-3">
                    <div className="space-y-4">
                      {bannerTypeInfo.map((banner, idx) => (
                        <div key={idx} className="rounded-md border p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="text-sm font-medium flex items-center">
                                <span className="mr-2">{banner.icon}</span>
                                {banner.name} 
                                <span className="ml-2 text-xs font-normal text-muted-foreground">
                                  {banner.size}
                                </span>
                                {banner.maxCount && (
                                  <Badge variant="outline" className="ml-2 text-[10px]">
                                    Max {banner.maxCount}
                                  </Badge>
                                )}
                              </h5>
                              <p className="text-xs text-muted-foreground mt-1">
                                {banner.description}
                              </p>
                            </div>
                            <Badge 
                              variant={banner.autoGenerated ? "secondary" : "outline"} 
                              className="text-xs"
                            >
                              {banner.autoGenerated ? "Auto-generated" : banner.fileType}
                            </Badge>
                          </div>
                          
                          {/* If we want to add visuals for each banner type */}
                          {!banner.autoGenerated && (
                            <div className="mt-2 flex items-center justify-center">
                              <div 
                                className={`border border-dashed rounded p-1 flex items-center justify-center text-xs text-muted-foreground ${
                                  banner.name === "Wide Display Banner" ? "w-32 h-8" :
                                  banner.name === "Double-Decker Banner" ? "w-8 h-24" :
                                  banner.name === "Leaderboard" ? "w-32 h-4" :
                                  banner.name === "MREC" ? "w-16 h-16" :
                                  "w-24 h-3"
                                }`}
                              >
                                {banner.size}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upload Progress */}
                {Object.entries(uploadProgress).map(([mediaId, progress]) => {
                  if (progress < 100) {
                    return (
                      <div key={mediaId} className="border rounded-md p-2">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-sm font-medium">Uploading...</div>
                          <div className="text-xs">{progress}%</div>
                        </div>
                        <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-1"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}

                {/* Uploaded Media Preview */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Uploaded Media ({getAssetCount(expandedAdId)})</h3>
                  
                  {getAssetCount(expandedAdId) === 0 ? (
                    <div className="text-center py-6 text-muted-foreground border rounded-md">
                      No media assets uploaded yet
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {ads.find(ad => ad.id === expandedAdId)?.mediaAssets.map((media) => (
                        <div
                          key={media.id}
                          className="border rounded-md overflow-hidden group relative"
                        >
                          {media.type.startsWith("image/") ? (
                            <div className="aspect-video w-full bg-muted relative">
                              <img
                                src={media.previewUrl}
                                alt={media.name}
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => removeMediaFromAd(expandedAdId, media.id)}
                                className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="aspect-video w-full bg-muted flex items-center justify-center">
                              <FileImage className="h-8 w-8 text-muted-foreground" />
                              <button
                                onClick={() => removeMediaFromAd(expandedAdId, media.id)}
                                className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                          <div className="p-1.5 text-xs">
                            <div className="truncate">{media.name}</div>
                            <div className="text-muted-foreground mt-0.5 text-[10px] flex justify-between">
                              <span>{formatFileSize(media.size)}</span>
                              {media.dimensions && (
                                <span>
                                  {media.dimensions.width}×{media.dimensions.height}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-2 flex justify-end">
                  <Button 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => {
                      setCreatingNew(false);
                      setCreationStep(1);
                    }}
                  >
                    Done
                  </Button>
                  <Button 
                    onClick={startNewAd}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Ad
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List of Created Ads */}
      {ads.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <LayoutGrid className="h-4 w-4 mr-2" />
            <span>
              {ads.length} {ads.length === 1 ? 'Advertisement' : 'Advertisements'} in this Campaign
            </span>
          </div>
          
          <div className="grid gap-4">
            {ads.map((ad, index) => (
              <div key={ad.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div 
                  className={`flex justify-between items-center p-4 border-b cursor-pointer ${
                    expandedAdId === ad.id ? "bg-muted/10" : ""
                  }`}
                  onClick={() => setExpandedAdId(expandedAdId === ad.id ? null : ad.id)}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium mr-3">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium flex items-center">
                        {ad.merchantName}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({ad.offerId})
                        </span>
                      </h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {ad.mediaType.map((type) => (
                          <Badge
                            key={type}
                            variant="outline"
                            className="text-xs"
                          >
                            {getMediaTypeLabel(type)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Badge 
                      variant={ad.mediaAssets.length > 0 ? "success" : "destructive"} 
                      className="mr-3"
                    >
                      {ad.mediaAssets.length} Assets
                    </Badge>
                    <div className="flex">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          if(confirm("Are you sure you want to delete this ad?")) {
                            removeAd(ad.id);
                            if(expandedAdId === ad.id) setExpandedAdId(null);
                          }
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedAdId(expandedAdId === ad.id ? null : ad.id);
                        }}
                      >
                        <ChevronRight 
                          className={`h-5 w-5 transition-transform ${
                            expandedAdId === ad.id ? "rotate-90" : ""
                          }`} 
                        />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Expanded View: Media Assets */}
                {expandedAdId === ad.id && (
                  <div className="p-4 bg-muted/5">
                    <div className="mb-3 flex justify-between items-center">
                      <h4 className="text-sm font-medium">Media Assets</h4>
                      <input
                        type="file"
                        id={`fileUpload-${ad.id}`}
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileSelect(ad.id, e)}
                      />
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => document.getElementById(`fileUpload-${ad.id}`)?.click()}
                      >
                        <Upload className="mr-1.5 h-3.5 w-3.5" />
                        Upload Assets
                      </Button>
                    </div>

                    {ad.mediaAssets.length === 0 ? (
                      <div 
                        className="border-2 border-dashed rounded-md p-8 text-center"
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => handleFileDrop(ad.id, e)}
                      >
                        <div className="flex flex-col items-center">
                          <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm mb-1">No media assets uploaded</p>
                          <p className="text-xs text-muted-foreground mb-2">
                            Drag files here or click the upload button
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {ad.mediaAssets.map((media) => (
                          <div
                            key={media.id}
                            className="border rounded-md overflow-hidden group relative"
                          >
                            {media.type.startsWith("image/") ? (
                              <div className="aspect-video w-full bg-muted relative">
                                <img
                                  src={media.previewUrl}
                                  alt={media.name}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={() => removeMediaFromAd(ad.id, media.id)}
                                  className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="aspect-video w-full bg-muted flex items-center justify-center">
                                <FileImage className="h-8 w-8 text-muted-foreground" />
                                <button
                                  onClick={() => removeMediaFromAd(ad.id, media.id)}
                                  className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                            <div className="p-1.5 text-xs">
                              <div className="truncate">{media.name}</div>
                              <div className="text-muted-foreground mt-0.5 text-[10px] flex justify-between">
                                <span>{formatFileSize(media.size)}</span>
                                {media.dimensions && (
                                  <span>
                                    {media.dimensions.width}×{media.dimensions.height}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {ads.length === 0 && !creatingNew && (
        <div className="flex flex-col items-center justify-center bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="bg-primary/10 rounded-full p-3 mb-3">
            <ImagePlus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium mb-1">No Advertisements Created Yet</h3>
          <p className="text-muted-foreground text-sm mb-4 max-w-md">
            Create one or more advertisements for this campaign. Each advertisement can target a specific offer and have its own media assets.
          </p>
          <Button onClick={startNewAd}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Ad
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdCreationStep;
