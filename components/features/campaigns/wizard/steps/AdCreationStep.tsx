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
import { v4 as uuidv4 } from "uuid";
import {
  Plus,
  X,
  Upload,
  FileImage,
  Monitor,
  Smartphone,
  AlertCircle,
  DollarSign,
  FileCheck,
  Edit,
  Trash,
  CheckCircle2,
  Upload as UploadIcon,
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
      id: "o1",
      merchantId: "m1",
      name: "30% off select vitamins",
      shortText: "Vitamins Sale",
    },
    {
      id: "o2",
      merchantId: "m1",
      name: "Buy 1 Get 1 on cough & cold",
      shortText: "Cold Medicine",
    },
    {
      id: "o3",
      merchantId: "m2",
      name: "$5 off $25 grocery purchase",
      shortText: "Grocery Deal",
    },
    {
      id: "o4",
      merchantId: "m3",
      name: "15% off laptops",
      shortText: "Laptop Discount",
    },
    {
      id: "o5",
      merchantId: "m4",
      name: "$10 off monthly bill",
      shortText: "Bill Credit",
    },
    {
      id: "o6",
      merchantId: "m5",
      name: "Free guacamole with entrée",
      shortText: "Free Guac",
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
      label: "Double Exposure",
      description: "Large format ads with two visual sections",
    },
  ];

  // Form state for adding a new ad
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
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"new" | "existing">(
    ads.length > 0 ? "existing" : "new"
  );

  // Set step as valid when mounted (purely presentational mode)
  useEffect(() => {
    setStepValidation(true);
  }, [setStepValidation]);

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
    setSelectedAdId(newAd.id);

    // Reset form
    setCurrentAd({
      merchantId: "",
      merchantName: "",
      offerId: "",
      mediaType: [],
      costPerActivation: "0.15",
      costPerRedemption: "1.50",
    });
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-7/12">
          {/* Simple tab navigation */}
          <div className="border-b flex mb-4">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "new"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("new")}
            >
              Create New Ad
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "existing"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("existing")}
              disabled={ads.length === 0}
            >
              Existing Ads ({ads.length})
            </button>
          </div>

          {/* Tab content for 'new' */}
          {activeTab === "new" && (
            <Card className="p-4">
              <h4 className="font-medium mb-4">New Advertisement</h4>

              {/* Merchant & Offer Selection */}
              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="merchant">Merchant ID*</Label>
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Select the merchant this ad will represent
                  </p>
                </div>

                <div>
                  <Label htmlFor="offer">Offer*</Label>
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
                          {offer.name} - {offer.shortText}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select the offer to promote in this ad
                  </p>
                </div>
              </div>

              {/* Media Type Selection */}
              <div className="mb-6">
                <Label className="mb-2 block">Media Type*</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mediaTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-3 border rounded-md cursor-pointer transition-all ${
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
                          className="mt-1 mr-2"
                        />
                        <div>
                          <Label
                            htmlFor={`mediaType-${type.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {type.label}
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="costPerActivation">
                    Cost Per Activation ($)
                  </Label>
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Fee when users add offers to wallets
                  </p>
                </div>

                <div>
                  <Label htmlFor="costPerRedemption">
                    Cost Per Redemption ($)
                  </Label>
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Fee when offers are redeemed by users
                  </p>
                </div>
              </div>

              <Button onClick={handleAddAd} className="w-full">
                <Plus className="mr-1 h-4 w-4" />
                Add Advertisement
              </Button>
            </Card>
          )}

          {/* Tab content for 'existing' */}
          {activeTab === "existing" && (
            <Card className="p-4">
              <h4 className="font-medium mb-4">
                Created Advertisements ({ads.length})
              </h4>

              {ads.length === 0 ? (
                <div className="text-center py-6 border rounded-md bg-muted/20">
                  <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                  <p>
                    No ads created yet. Create your first ad to see it here.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {ads.map((ad) => (
                      <div
                        key={ad.id}
                        className={`border rounded-md p-3 cursor-pointer transition-all ${
                          selectedAdId === ad.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-muted-foreground"
                        }`}
                        onClick={() => setSelectedAdId(ad.id)}
                      >
                        <div className="flex justify-between mb-1">
                          <div className="font-medium">{ad.merchantName}</div>
                          <div className="flex space-x-2">
                            <button
                              className="text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (
                                  confirm(
                                    "Are you sure you want to delete this ad?"
                                  )
                                ) {
                                  removeAd(ad.id);
                                  if (selectedAdId === ad.id)
                                    setSelectedAdId(null);
                                }
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-sm mb-2">
                          {getOfferName(ad.offerId)}
                        </p>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {ad.mediaType.map((type) => (
                            <Badge
                              key={type}
                              variant="outline"
                              className="text-xs"
                            >
                              {mediaTypes.find((t) => t.id === type)?.label ||
                                type}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <div>
                            Activation: ${ad.costPerActivation.toFixed(2)}
                          </div>
                          <div>
                            Redemption: ${ad.costPerRedemption.toFixed(2)}
                          </div>
                        </div>

                        <div className="mt-3 flex justify-between items-center text-xs">
                          <div>
                            {ad.mediaAssets.length} media asset
                            {ad.mediaAssets.length !== 1 ? "s" : ""}
                          </div>
                          {ad.mediaAssets.length === 0 && (
                            <Badge
                              variant="destructive"
                              className="text-[10px] py-0"
                            >
                              Media Required
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </Card>
          )}
        </div>

        {/* Media Upload Section */}
        <div className="w-full md:w-5/12">
          <Card className="p-4">
            <h4 className="font-medium mb-4">Media Assets</h4>

            {!selectedAdId ? (
              <div className="text-center py-10 border rounded-md bg-muted/20">
                <FileImage className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <p>Select an ad to upload media assets</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h5 className="font-medium">
                      {ads.find((ad) => ad.id === selectedAdId)?.merchantName ||
                        "Ad"}
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      {getOfferName(
                        ads.find((ad) => ad.id === selectedAdId)?.offerId || ""
                      )}
                    </p>
                  </div>
                </div>

                {/* Upload Zone */}
                <div
                  className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
                    isDragging ? "border-primary bg-primary/5" : "border-muted"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => handleFileDrop(selectedAdId, e)}
                >
                  <div className="flex flex-col items-center">
                    <UploadIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <h3 className="font-medium mb-1">
                      Drop files here or click to upload
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      PNG, JPG, GIF, SVG or MP4 (max. 10MB)
                    </p>
                    <input
                      type="file"
                      id="fileUpload"
                      className="hidden"
                      accept="image/*,video/*"
                      multiple
                      onChange={(e) => handleFileSelect(selectedAdId, e)}
                    />
                    <Button
                      variant="outline"
                      onClick={() =>
                        document.getElementById("fileUpload")?.click()
                      }
                    >
                      <Upload className="mr-1 h-4 w-4" />
                      Select Files
                    </Button>
                  </div>
                </div>

                {/* Media Assets List */}
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Uploaded Assets</h5>

                  {/* Show uploads in progress */}
                  {Object.entries(uploadProgress).map(([mediaId, progress]) => {
                    if (progress < 100) {
                      return (
                        <div
                          key={mediaId}
                          className="border rounded-md p-2 mb-2"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-sm font-medium">
                              Uploading...
                            </div>
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

                  {/* Show uploaded assets */}
                  {selectedAdId && (
                    <div className="space-y-2 mt-3">
                      {ads.find((ad) => ad.id === selectedAdId)?.mediaAssets
                        .length === 0 ? (
                        <div className="text-center py-4 border rounded-md bg-muted/10">
                          <p className="text-sm text-muted-foreground">
                            No assets uploaded yet
                          </p>
                        </div>
                      ) : (
                        ads
                          .find((ad) => ad.id === selectedAdId)
                          ?.mediaAssets.map((media) => (
                            <div
                              key={media.id}
                              className="border rounded-md p-2 flex items-center"
                            >
                              <div className="w-12 h-12 bg-muted rounded mr-3 overflow-hidden flex-shrink-0">
                                {media.type.startsWith("image/") ? (
                                  <img
                                    src={media.previewUrl}
                                    alt={media.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <FileImage className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-grow">
                                <div className="font-medium text-sm truncate">
                                  {media.name}
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <span>{formatFileSize(media.size)}</span>
                                  {media.dimensions && (
                                    <span className="ml-2">
                                      {media.dimensions.width} ×{" "}
                                      {media.dimensions.height} px
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                className="ml-2 text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                  removeMediaFromAd(selectedAdId, media.id)
                                }
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdCreationStep;
