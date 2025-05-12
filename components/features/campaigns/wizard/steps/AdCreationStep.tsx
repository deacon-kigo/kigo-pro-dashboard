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
  AlertCircle
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

  // Add banner size validation information
  const bannerSizeInfo = [
    { name: "Desktop Banner", size: "970x250", description: "Desktop large format" },
    { name: "Leaderboard", size: "728x90", description: "Desktop horizontal" },
    { name: "MREC", size: "300x250", description: "Mobile & desktop medium rectangle" },
    { name: "Mobile Banner", size: "320x50", description: "Mobile horizontal format" },
    { name: "Double Decker", size: "320x480", description: "Mobile vertical format" }
  ];

  return (
    <div className="space-y-4">
      <Tabs defaultValue={ads.length > 0 ? "existing" : "create"} className="w-full">
        <TabsList className="mb-4 border-b rounded-none bg-transparent p-0 h-auto">
          <TabsTrigger 
            value="create" 
            className="flex items-center py-2 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Ad
          </TabsTrigger>
          <TabsTrigger 
            value="existing" 
            className="flex items-center py-2 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none" 
            disabled={ads.length === 0}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            My Ads ({ads.length})
          </TabsTrigger>
        </TabsList>
        
        {/* Create New Ad Tab */}
        <TabsContent value="create" className="mt-0">
          <Card className="p-0 shadow-none border-0">
            <div className="flex items-center justify-between px-0 py-3 flex-shrink-0">
              <div className="flex items-center">
                <Plus className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Create a New Advertisement</h3>
              </div>
            </div>
            
            <div className="px-0">
              <Accordion 
                type="multiple" 
                defaultValue={["basic-info"]}
                className="w-full"
              >
                {/* Basic Info Section */}
                <AccordionItem value="basic-info" className="border rounded-md mb-4">
                  <AccordionTrigger className="px-4 py-3 text-sm font-medium">
                    <div className="flex items-center">
                      <Store className="h-4 w-4 mr-2 text-primary" />
                      <span>Merchant & Offer Details</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
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
                        <p className="text-xs text-muted-foreground mt-1">
                          The merchant this ad will represent
                        </p>
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
                          The offer ID to promote in this ad (only one selection allowed)
                        </p>
                      </div>
                      
                      {currentAd.offerId && (
                        <div>
                          <Label>Merchant Logo</Label>
                          <div className="mt-1 border rounded-md p-4 bg-muted/10">
                            {currentAd.offerId && (
                              <div className="flex flex-col items-center">
                                <img 
                                  src={offers.find(o => o.id === currentAd.offerId)?.logoUrl || "https://placehold.co/400x200/eee/999?text=No+Logo"} 
                                  alt="Merchant Logo" 
                                  className="max-h-24 object-contain"
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                  Logo imported from mom database (not editable)
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Media Types Section */}
                <AccordionItem value="media-types" className="border rounded-md mb-4">
                  <AccordionTrigger className="px-4 py-3 text-sm font-medium">
                    <div className="flex items-center">
                      <Image className="h-4 w-4 mr-2 text-primary" />
                      <span>Media Types</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                              className="mt-1 mr-2"
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
                  </AccordionContent>
                </AccordionItem>

                {/* Performance Metrics Section */}
                <AccordionItem value="performance" className="border rounded-md">
                  <AccordionTrigger className="px-4 py-3 text-sm font-medium">
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                      <span>Performance Metrics</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={handleAddAd} 
                  disabled={!currentAd.merchantId || !currentAd.offerId || currentAd.mediaType.length === 0}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Create Advertisement
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        {/* Existing Ads Tab */}
        <TabsContent value="existing" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ad List */}
            <div className="md:col-span-1">
              <Card className="p-0 shadow-none border-0">
                <div className="flex items-center justify-between px-0 py-3 flex-shrink-0">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">My Advertisements</h3>
                  </div>
                </div>
                
                <div className="px-0">
                  <ScrollArea className="h-[420px] pr-3">
                    {ads.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-[150px] text-center">
                        <p className="text-muted-foreground mb-2">No advertisements created yet</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            const createTabButton = document.querySelector('button[data-state="inactive"][value="create"]');
                            if (createTabButton) {
                              (createTabButton as HTMLButtonElement).click();
                            }
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Create Your First Ad
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {ads.map((ad) => (
                          <div
                            key={ad.id}
                            onClick={() => setSelectedAdId(ad.id)}
                            className={`p-3 border rounded-md cursor-pointer hover:border-primary/50 transition-all ${
                              selectedAdId === ad.id ? "border-primary bg-primary/5" : ""
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{ad.merchantName}</div>
                                <div className="text-sm text-muted-foreground truncate max-w-[150px]">
                                  {getOfferName(ad.offerId)}
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {ad.mediaType.map((type) => (
                                    <Badge
                                      key={type}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {type}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if(confirm("Are you sure you want to delete this ad?")) {
                                      removeAd(ad.id);
                                      if(selectedAdId === ad.id) setSelectedAdId(null);
                                    }
                                  }}
                                  className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-sm"
                                >
                                  <Trash className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                              <div>
                                ${ad.costPerActivation.toFixed(2)} per activation
                              </div>
                              <div className="flex items-center">
                                <Image className="h-3 w-3 mr-1" />
                                {ad.mediaAssets.length}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </Card>
            </div>
            
            {/* Media Assets Panel */}
            <div className="md:col-span-2">
              <Card className="p-0 shadow-none border-0">
                <div className="flex items-center justify-between px-0 py-3 flex-shrink-0">
                  <div className="flex items-center">
                    <ImagePlus className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">
                      {selectedAdId 
                        ? `Media Assets: ${ads.find(ad => ad.id === selectedAdId)?.merchantName}`
                        : "Media Assets"}
                    </h3>
                  </div>
                </div>
                
                <div className="px-0">
                  {!selectedAdId ? (
                    <div className="flex flex-col items-center justify-center h-[200px] text-center border border-dashed rounded-md bg-muted/5">
                      <FileImage className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Select an ad to upload media assets</p>
                    </div>
                  ) : (
                    <>
                      {/* Upload Zone */}
                      <div
                        className={`border-2 border-dashed rounded-md mb-4 p-4 text-center transition-colors ${
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
                          <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm mb-2">Drop files here or click to upload</p>
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
                            size="sm"
                            onClick={() => document.getElementById("fileUpload")?.click()}
                          >
                            <Upload className="mr-1 h-4 w-4" />
                            Select Files
                          </Button>
                          <div className="mt-3 text-xs text-muted-foreground max-w-sm">
                            <p className="font-medium flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Images must comply with Kigo Banner Guide
                            </p>
                            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-left">
                              {bannerSizeInfo.map((item, i) => (
                                <div key={i} className="flex items-center text-xs">
                                  <div className="w-3 h-3 bg-primary/20 rounded-full flex-shrink-0 mr-1"></div>
                                  <span className="font-medium">{item.size}</span>
                                  <span className="ml-1 text-muted-foreground">({item.name})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Media Gallery */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Uploaded Media</h3>
                        
                        {/* Upload Progress */}
                        {Object.entries(uploadProgress).map(([mediaId, progress]) => {
                          if (progress < 100) {
                            return (
                              <div key={mediaId} className="border rounded-md p-2 mb-2">
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
                        
                        {/* Uploaded Media */}
                        <ScrollArea className="h-[250px]">
                          {ads.find(ad => ad.id === selectedAdId)?.mediaAssets.length === 0 ? (
                            <div className="text-center py-6 text-muted-foreground">
                              No media assets uploaded yet
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-3">
                              {ads.find(ad => ad.id === selectedAdId)?.mediaAssets.map((media) => (
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
                                        onClick={() => removeMediaFromAd(selectedAdId, media.id)}
                                        className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="aspect-video w-full bg-muted flex items-center justify-center">
                                      <FileImage className="h-8 w-8 text-muted-foreground" />
                                      <button
                                        onClick={() => removeMediaFromAd(selectedAdId, media.id)}
                                        className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </div>
                                  )}
                                  <div className="p-2 text-xs">
                                    <div className="truncate font-medium">{media.name}</div>
                                    <div className="text-muted-foreground mt-1 flex justify-between">
                                      <span>{formatFileSize(media.size)}</span>
                                      {media.dimensions && (
                                        <span>
                                          {media.dimensions.width} × {media.dimensions.height}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </ScrollArea>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdCreationStep;
