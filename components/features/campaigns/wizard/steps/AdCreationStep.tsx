"use client";

import React, { useEffect, useState } from "react";
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

  // Convert merchants to combobox format
  const merchantOptions = merchants.map((merchant) => ({
    value: merchant.id,
    label: `${merchant.name} - ${merchant.dba}`,
  }));

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
    {
      id: "mcm_o12_2023",
      merchantId: "m11",
      name: "Buy 1 Get 1 sandwich",
      shortText: "BOGO Sandwich",
      logoUrl: "https://placehold.co/400x200/fa0/fff?text=McDonalds+Logo",
    },
    {
      id: "mcm_o13_2023",
      merchantId: "m12",
      name: "10% off paint",
      shortText: "Paint Discount",
      logoUrl: "https://placehold.co/400x200/f60/fff?text=HomeDepot+Logo",
    },
    {
      id: "mcm_o14_2023",
      merchantId: "m13",
      name: "$5 off $30 produce",
      shortText: "Fresh Produce",
      logoUrl: "https://placehold.co/400x200/00f/fff?text=Kroger+Logo",
    },
    {
      id: "mcm_o15_2023",
      merchantId: "m14",
      name: "25% off vitamins",
      shortText: "Vitamin Sale",
      logoUrl: "https://placehold.co/400x200/d00/fff?text=Walgreens+Logo",
    },
    {
      id: "mcm_o16_2023",
      merchantId: "m15",
      name: "$10 off membership renewal",
      shortText: "Membership Discount",
      logoUrl: "https://placehold.co/400x200/00f/fff?text=Costco+Logo",
    },
  ];

  // Convert offers to combobox format
  const getOfferOptions = (merchantId: string) => {
    const filteredOffers = offers.filter(
      (offer) => offer.merchantId === merchantId
    );
    return filteredOffers.map((offer) => ({
      value: offer.id,
      label: `${offer.shortText} - ${offer.name}`,
    }));
  };

  // Media types - Simplified to match spec
  const mediaTypes = [
    {
      id: "display_banner",
      label: "Display Banner",
      description: "Large banner with brand content and offer",
      dimensions: "970x250",
    },
    {
      id: "double_decker",
      label: "Double Decker",
      description: "Full-width banner with merchant details",
      dimensions: "600x320",
    },
    {
      id: "native",
      label: "Native (No Image)",
      description: "Clean card with merchant logo and offer text",
      noImageUpload: true,
      dimensions: "Auto-adapting",
    },
  ];

  // Form state for the current asset being created
  const [currentAd, setCurrentAd] = useState<{
    id: string | null;
    merchantId: string;
    merchantName: string;
    offerId: string;
    mediaType: string;
    mediaAssets: MediaAsset[];
  }>({
    id: null,
    merchantId: "",
    merchantName: "",
    offerId: "",
    mediaType: "",
    mediaAssets: [],
  });

  // Local state for file drag and drop
  const [isDragging, setIsDragging] = useState(false);

  // State for the selected ad to edit
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);

  // State to track if this is a new ad or editing existing
  const [isEditing, setIsEditing] = useState(false);

  // Get preview Image URL for promotion widget
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Current offer options
  const [offerOptions, setOfferOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Set step as valid when mounted or when ads are added/removed
  useEffect(() => {
    setStepValidation(true);
  }, [ads, setStepValidation]);

  // Update the current ad form when selecting an existing ad
  useEffect(() => {
    if (selectedAdId) {
      const ad = ads.find((ad) => ad.id === selectedAdId);
      if (ad) {
        setCurrentAd({
          id: ad.id,
          merchantId: ad.merchantId,
          merchantName: ad.merchantName,
          offerId: ad.offerId,
          mediaType: ad.mediaType.length > 0 ? ad.mediaType[0] : "",
          mediaAssets: ad.mediaAssets,
        });
        setIsEditing(true);

        // Set preview image if available
        if (ad.mediaAssets.length > 0) {
          setPreviewImageUrl(ad.mediaAssets[0].previewUrl);
        } else {
          setPreviewImageUrl(null);
        }
      }
    }
  }, [selectedAdId, ads]);

  // Update offer options when merchant changes
  useEffect(() => {
    if (currentAd.merchantId) {
      setOfferOptions(getOfferOptions(currentAd.merchantId));
    } else {
      setOfferOptions([]);
    }
  }, [currentAd.merchantId]);

  // Handle merchant selection
  const handleMerchantChange = (merchantId: string) => {
    const merchant = merchants.find((m) => m.id === merchantId);

    setCurrentAd({
      ...currentAd,
      merchantId,
      merchantName: merchant ? merchant.dba : "",
      offerId: "", // Reset offer when merchant changes
    });

    // Reset preview image when merchant changes
    setPreviewImageUrl(null);
  };

  // Handle offer selection
  const handleOfferChange = (offerId: string) => {
    setCurrentAd({
      ...currentAd,
      offerId,
    });
  };

  // Handle media type selection
  const handleMediaTypeChange = (mediaType: string) => {
    setCurrentAd({
      ...currentAd,
      mediaType,
    });

    // Reset preview image if changing to Native type
    if (mediaType === "native") {
      setPreviewImageUrl(null);
    } else if (currentAd.mediaAssets.length > 0) {
      setPreviewImageUrl(currentAd.mediaAssets[0].previewUrl);
    }
  };

  // Save or update the current ad
  const handleSaveAd = () => {
    if (!currentAd.merchantId || !currentAd.offerId || !currentAd.mediaType) {
      alert("Please fill in all required fields");
      return;
    }

    if (isEditing && currentAd.id) {
      // Update existing ad
      updateAd(currentAd.id, {
        merchantId: currentAd.merchantId,
        merchantName: currentAd.merchantName,
        offerId: currentAd.offerId,
        mediaType: [currentAd.mediaType],
        mediaAssets: currentAd.mediaAssets,
      });
    } else {
      // Create new ad
      const newAd: CampaignAd = {
        id: uuidv4(),
        merchantId: currentAd.merchantId,
        merchantName: currentAd.merchantName,
        offerId: currentAd.offerId,
        mediaType: [currentAd.mediaType],
        mediaAssets: currentAd.mediaAssets,
        costPerActivation: 0.15, // Default value
        costPerRedemption: 1.5, // Default value
      };
      addAd(newAd);
    }

    // Reset form
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setCurrentAd({
      id: null,
      merchantId: "",
      merchantName: "",
      offerId: "",
      mediaType: "",
      mediaAssets: [],
    });
    setSelectedAdId(null);
    setIsEditing(false);
    setPreviewImageUrl(null);
  };

  // Handle file drop for media uploads
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]; // Just take the first file for simplicity
      handleFileUpload(file);
    }
  };

  // Handle file selection from input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]; // Just take the first file for simplicity
      handleFileUpload(file);
    }
  };

  // Process file upload and update preview
  const handleFileUpload = (file: File) => {
    // Only proceed if media type requires upload
    if (currentAd.mediaType === "native") {
      alert("Native media type doesn't require image upload");
      return;
    }

    const mediaId = uuidv4();
    const fileUrl = URL.createObjectURL(file);

    // Create new media asset
    const newMedia: MediaAsset = {
      id: mediaId,
      name: file.name,
      type: file.type,
      size: file.size,
      url: fileUrl,
      previewUrl: fileUrl,
      dimensions: { width: 300, height: 250 }, // Mock dimensions
    };

    // Update current ad with new media
    setCurrentAd({
      ...currentAd,
      mediaAssets: [newMedia], // Replace existing assets
    });

    // Set preview image
    setPreviewImageUrl(fileUrl);
  };

  // Handle removing media
  const handleRemoveMedia = () => {
    setCurrentAd({
      ...currentAd,
      mediaAssets: [],
    });
    setPreviewImageUrl(null);
  };

  // Get logo URL for the offer
  const getLogoUrl = (offerId: string): string => {
    const offer = offers.find((o) => o.id === offerId);
    return offer?.logoUrl || "";
  };

  // Get offer name
  const getOfferName = (offerId: string): string => {
    const offer = offers.find((o) => o.id === offerId);
    return offer ? offer.name : offerId;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Edit an existing ad
  const handleEditAd = (adId: string) => {
    setSelectedAdId(adId);
  };

  // Delete an ad
  const handleDeleteAd = (adId: string) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      removeAd(adId);
      if (selectedAdId === adId) {
        resetForm();
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-slate-700">Campaign Assets</h3>
        <Badge variant="outline" className="text-xs px-2 py-0.5">
          {ads.length} Assets
        </Badge>
      </div>

      {/* Asset Creation Form */}
      <Card className="overflow-hidden border border-slate-200">
        <div className="flex items-center border-b border-slate-200 px-2 py-2 bg-slate-50">
          <div className="h-4 w-4 rounded-sm flex items-center justify-center bg-slate-600 text-white mr-2">
            {isEditing ? (
              <Edit className="h-2.5 w-2.5" />
            ) : (
              <Plus className="h-2.5 w-2.5" />
            )}
          </div>
          <h4 className="text-xs font-medium text-slate-600">
            {isEditing ? "Edit Asset" : "Add Asset"}
          </h4>
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
                  placeholder="Select an offer"
                  searchPlaceholder="Search offers..."
                  emptyText="No offers found for this merchant"
                  maxDisplayItems={10}
                  className="h-8 border-slate-300 hover:border-green-400 focus:border-green-500 shadow-sm text-xs"
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

          {/* Media Type Options */}
          <div className="mb-3">
            <Label className="text-xs mb-1 block font-medium text-slate-600">
              Media Type*
            </Label>
            <div className="grid grid-cols-3 gap-1.5">
              {mediaTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-1.5 border rounded cursor-pointer transition-colors ${
                    currentAd.mediaType === type.id
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => handleMediaTypeChange(type.id)}
                >
                  <div className="text-xs font-medium mb-0.5 text-slate-700">
                    {type.label}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {type.dimensions}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview and Upload - Only shown when the required fields are filled */}
          {currentAd.merchantId && currentAd.offerId && currentAd.mediaType && (
            <div className="border-t border-slate-200 pt-3 space-y-3">
              {/* Preview Section */}
              <div className="flex flex-col">
                <Label className="text-xs mb-1.5 block font-medium text-slate-600">
                  Promotion Preview
                </Label>
                <div className="bg-slate-50 p-2 rounded border">
                  <div className="max-w-md mx-auto">
                    <PromotionWidget
                      merchantLogo={getLogoUrl(currentAd.offerId)}
                      merchantName={currentAd.merchantName}
                      promotionText={getOfferName(currentAd.offerId)}
                      featured={true}
                      bannerImage={previewImageUrl || undefined}
                      mediaType={currentAd.mediaType}
                      distance="5.6 miles"
                      additionalOffers={1}
                    />
                  </div>
                </div>
              </div>

              {/* Upload Section or Native Info */}
              <div>
                <Label className="text-xs mb-1.5 block font-medium text-slate-600">
                  {currentAd.mediaType !== "native"
                    ? "Upload Asset"
                    : "Native Format"}
                </Label>

                {currentAd.mediaType !== "native" ? (
                  <div
                    className={`flex flex-col border-2 border-dashed rounded p-2 ${
                      isDragging
                        ? "border-blue-400 bg-blue-50"
                        : "border-slate-300"
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFileDrop}
                  >
                    {currentAd.mediaAssets.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-2 text-center">
                        <ImagePlus className="h-4 w-4 text-slate-400 mb-1.5" />
                        <p className="text-xs font-medium mb-0.5 text-slate-600">
                          Upload Media Asset
                        </p>
                        <p className="text-xs text-slate-500 mb-1.5">
                          Drag a file or browse
                        </p>
                        <input
                          type="file"
                          id="fileUpload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileSelect}
                        />
                        <Button
                          size="sm"
                          className="h-6 text-xs px-2"
                          onClick={() =>
                            document.getElementById("fileUpload")?.click()
                          }
                        >
                          <Upload className="h-2.5 w-2.5 mr-1" />
                          Browse
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between py-1">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-slate-100 rounded overflow-hidden mr-2">
                            <img
                              src={currentAd.mediaAssets[0].previewUrl}
                              alt={currentAd.mediaAssets[0].name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-medium truncate w-32 text-slate-700">
                              {currentAd.mediaAssets[0].name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {formatFileSize(currentAd.mediaAssets[0].size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveMedia}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <X className="h-2.5 w-2.5" />
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
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end mt-3 pt-2 border-t border-slate-200">
            <Button
              variant="outline"
              size="sm"
              onClick={resetForm}
              className="mr-2 h-7 text-xs px-2"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveAd}
              className="h-7 text-xs px-2"
              disabled={
                !currentAd.merchantId ||
                !currentAd.offerId ||
                !currentAd.mediaType ||
                (currentAd.mediaType !== "native" &&
                  currentAd.mediaAssets.length === 0)
              }
            >
              {isEditing ? "Update Asset" : "Add Asset"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Created Assets List */}
      {ads.length > 0 && (
        <Card className="overflow-hidden border border-slate-200">
          <div className="border-b border-slate-200 px-2 py-2 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-sm flex items-center justify-center bg-green-600 text-white mr-2">
                  <CheckCircle className="h-2.5 w-2.5" />
                </div>
                <h4 className="text-xs font-medium text-slate-600">
                  Created Assets ({ads.length})
                </h4>
              </div>
            </div>
          </div>

          <div className="p-2">
            <div className="space-y-2">
              {ads.map((ad, index) => (
                <div
                  key={ad.id}
                  className="border border-slate-200 rounded p-2 bg-slate-50/30"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-12 h-12 bg-white rounded border border-slate-200 overflow-hidden flex-shrink-0">
                      <img
                        src={getLogoUrl(ad.offerId)}
                        alt={ad.merchantName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="text-xs font-medium text-slate-900 truncate">
                            {ad.merchantName}
                          </h5>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                            {getOfferName(ad.offerId)}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Badge
                              variant="outline"
                              className="text-[10px] h-4 px-1"
                            >
                              {ad.mediaType}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-[10px] h-4 px-1"
                            >
                              {ad.mediaAssets.length} media
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-0.5 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAd(ad.id)}
                            className="h-6 w-6 p-0 text-slate-500 hover:text-blue-600"
                          >
                            <Edit className="h-2.5 w-2.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAd(ad.id)}
                            className="h-6 w-6 p-0 text-slate-500 hover:text-red-600"
                          >
                            <Trash className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {ads.length === 0 && !currentAd.merchantId && (
        <Card className="p-3 text-center border-dashed bg-slate-50/50 border-slate-300">
          <div className="flex flex-col items-center">
            <div className="bg-slate-100 rounded-full p-2 mb-2">
              <ImagePlus className="h-4 w-4 text-slate-500" />
            </div>
            <h3 className="text-xs font-medium mb-1 text-slate-700">
              No Campaign Assets Yet
            </h3>
            <p className="text-xs text-slate-500 mb-0">
              Add assets by completing the form above
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdCreationStep;
