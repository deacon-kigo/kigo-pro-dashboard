"use client";

import React, { useEffect, useCallback, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { RootState } from "@/lib/redux/store";

import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button";
import {
  resetCampaign,
  addAd,
  updateAd,
  removeAd,
  addMediaToAd,
  removeMediaFromAd,
} from "@/lib/redux/slices/campaignSlice";
import { setCampaignContext } from "@/lib/redux/slices/ai-assistantSlice";
import { CampaignAnalyticsPanelLite } from "../CampaignAnalyticsPanelLite";
import PageHeader from "@/components/molecules/PageHeader/PageHeader";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/Tabs";
import {
  PhotoIcon,
  RectangleGroupIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  SparklesIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/molecules/alert-dialog/AlertDialog";

// Import step components
import AdCreationStep from "./steps/AdCreationStep";

interface AdvertisementWizardProps {
  isAdGroupMode?: boolean;
}

const AdvertisementWizard: React.FC<AdvertisementWizardProps> = ({
  isAdGroupMode = false,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // Tab state
  const [currentTab, setCurrentTab] = useState(
    isAdGroupMode ? "adgroup" : "ad"
  );

  // Ad Group state
  const [selectedMerchant, setSelectedMerchant] = useState<string>("");
  const [merchantSearchOpen, setMerchantSearchOpen] = useState(false);
  const [merchantSearchQuery, setMerchantSearchQuery] = useState("");
  const [selectedAds, setSelectedAds] = useState<string[]>([]);

  // Mock merchant data (in real app, this would come from API)
  const availableMerchants = [
    {
      id: "m1",
      name: "Tony's Pizza - Tony's Restaurant Corp",
      category: "Restaurant",
    },
    {
      id: "m2",
      name: "Deacon's Pizza - Deacon's Restaurant Corp",
      category: "Restaurant",
    },
    {
      id: "m3",
      name: "Frank's Pizza - Frank's Restaurant Corp",
      category: "Restaurant",
    },
    { id: "m4", name: "Coffee Express Inc.", category: "Coffee Shop" },
    { id: "m5", name: "Campus Books & More", category: "Bookstore" },
    { id: "m6", name: "FitLife Gym", category: "Fitness" },
    { id: "m7", name: "TechWorld Electronics", category: "Electronics" },
    { id: "m8", name: "Fashion Forward Boutique", category: "Clothing" },
    { id: "m9", name: "Fresh Market Grocery", category: "Grocery" },
    { id: "m10", name: "Auto Care Center", category: "Automotive" },
  ];

  // Filter merchants based on search query
  const filteredMerchants = availableMerchants.filter(
    (merchant) =>
      merchant.name.toLowerCase().includes(merchantSearchQuery.toLowerCase()) ||
      merchant.category
        .toLowerCase()
        .includes(merchantSearchQuery.toLowerCase())
  );

  // Mock ads data for selected merchant (with merchantId included)
  const getAdsForMerchant = (merchantId: string) => {
    const adsMap: { [key: string]: any[] } = {
      m1: [
        {
          id: "ad-1",
          merchantId: "m1",
          name: "Tony's Family Special",
          offer: "20% off family meals (up to $15)",
          mediaTypes: ["Display Banner", "Social Media"],
          status: "Active",
        },
        {
          id: "ad-2",
          merchantId: "m1",
          name: "Tony's Lunch Deal",
          offer: "Buy one pizza, get 50% off second",
          mediaTypes: ["Display Banner"],
          status: "Active",
        },
      ],
      m2: [
        {
          id: "ad-3",
          merchantId: "m2",
          name: "Deacon's Weekend Bundle",
          offer: "Buy 2 pizzas, get free breadsticks",
          mediaTypes: ["Display Banner", "Social Media"],
          status: "Active",
        },
        {
          id: "ad-4",
          merchantId: "m2",
          name: "Deacon's Happy Hour",
          offer: "25% off all orders 3-6 PM",
          mediaTypes: ["Social Media"],
          status: "Paused",
        },
      ],
      m3: [
        {
          id: "ad-5",
          merchantId: "m3",
          name: "Frank's Lunch Deal",
          offer: "Two slices + drink for $8.99",
          mediaTypes: ["Display Banner"],
          status: "Active",
        },
      ],
      m4: [
        {
          id: "ad-6",
          merchantId: "m4",
          name: "Coffee Express Morning Special",
          offer: "Buy any coffee, get pastry 50% off",
          mediaTypes: ["Display Banner", "Native"],
          status: "Active",
        },
        {
          id: "ad-7",
          merchantId: "m4",
          name: "Coffee Express Loyalty",
          offer: "Buy 10 coffees, get 1 free",
          mediaTypes: ["Display Banner"],
          status: "Active",
        },
      ],
      m5: [
        {
          id: "ad-8",
          merchantId: "m5",
          name: "Textbook Sale",
          offer: "15% off all textbooks",
          mediaTypes: ["Social Media"],
          status: "Active",
        },
      ],
      m6: [
        {
          id: "ad-9",
          merchantId: "m6",
          name: "New Member Deal",
          offer: "First month free with annual membership",
          mediaTypes: ["Display Banner", "Video"],
          status: "Active",
        },
        {
          id: "ad-10",
          merchantId: "m6",
          name: "Personal Training Special",
          offer: "3 sessions for $99",
          mediaTypes: ["Display Banner"],
          status: "Active",
        },
      ],
    };
    return adsMap[merchantId] || [];
  };

  // Get all ads across all merchants for looking up selected ads
  const getAllAds = () => {
    const allAds: any[] = [];
    availableMerchants.forEach((merchant) => {
      allAds.push(...getAdsForMerchant(merchant.id));
    });
    return allAds;
  };

  const selectedMerchantData = availableMerchants.find(
    (m) => m.id === selectedMerchant
  );
  const availableAds = selectedMerchant
    ? getAdsForMerchant(selectedMerchant)
    : [];
  const allAds = getAllAds();

  // Sync tab state with URL parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "adgroup") {
      setCurrentTab("adgroup");
    } else {
      setCurrentTab("ad");
    }
  }, [searchParams]);

  // Handle tab change and update URL
  const handleTabChange = (newTab: string) => {
    setCurrentTab(newTab);
    const url = new URL(window.location.href);
    if (newTab === "adgroup") {
      url.searchParams.set("tab", "adgroup");
    } else {
      url.searchParams.delete("tab");
    }
    window.history.replaceState({}, "", url.toString());
  };

  // Redux selectors
  const { formData } = useSelector((state: RootState) => state.campaign);

  // State for current ad data and validation
  const [currentAdData, setCurrentAdData] = useState<any>(null);

  // State for confirmation dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // State to track if we're in edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAdData, setEditingAdData] = useState<any>(null);

  // Refs for asset management
  const assetUploadRef = useRef<
    ((mediaType: string, file: File) => void) | null
  >(null);
  const assetRemoveRef = useRef<
    ((mediaType: string, assetId: string) => void) | null
  >(null);

  // Check for edit mode and pre-populate data
  useEffect(() => {
    const isEdit = searchParams.get("edit") === "true";
    const editDataParam = searchParams.get("data");

    if (isEdit && editDataParam) {
      try {
        const editData = JSON.parse(editDataParam);
        setIsEditMode(true);
        setEditingAdData(editData);

        // Pre-populate the Redux store with the edit data
        dispatch(resetCampaign());
        dispatch(addAd(editData));
      } catch (error) {
        console.error("Error parsing edit data:", error);
        dispatch(resetCampaign());
      }
    } else {
      // Reset campaign form on initial load (non-edit mode)
      dispatch(resetCampaign());
    }
  }, [dispatch, searchParams]);

  // Update AI context when form data changes
  useEffect(() => {
    dispatch(setCampaignContext(formData));
  }, [dispatch, formData]);

  // Handle current ad change from step component
  const handleCurrentAdChange = useCallback((adData: any) => {
    setCurrentAdData(adData);
  }, []);

  // Check if current ad is valid for creation
  const isCurrentAdValid =
    currentAdData?.currentAd &&
    currentAdData.currentAd.merchantId &&
    currentAdData.currentAd.offerId &&
    currentAdData.currentAd.mediaType?.length > 0;

  // Asset management callbacks for the preview modal
  const handleAssetUploadForCurrentAd = useCallback(
    (mediaType: string, file: File) => {
      if (assetUploadRef.current) {
        assetUploadRef.current(mediaType, file);
      }
    },
    []
  );

  const handleAssetRemoveForCurrentAd = useCallback(
    (mediaType: string, assetId: string) => {
      if (assetRemoveRef.current) {
        assetRemoveRef.current(mediaType, assetId);
      } else {
        console.warn("Asset remove function not available");
      }
    },
    []
  );

  const handleCreateAd = useCallback(() => {
    // Validate the ad before showing confirmation
    if (!isCurrentAdValid) {
      console.warn("Ad is not valid for creation");
      return;
    }

    // Show confirmation dialog
    setCreateDialogOpen(true);
  }, [isCurrentAdValid]);

  const handleConfirmedCreateAd = useCallback(() => {
    // Close the dialog
    setCreateDialogOpen(false);

    // Handle ad creation or update
    if (isEditMode) {
      console.log("Update advertisement with data:", formData);
      // TODO: Implement actual ad update API call
      setTimeout(() => {
        // Simulate success and redirect to ads manager
        alert("Advertisement updated successfully!");
        router.push("/campaigns");
      }, 1000);
    } else {
      console.log("Create advertisement with data:", formData);
      // TODO: Implement actual ad creation API call
      setTimeout(() => {
        // Simulate success and redirect to ads manager
        alert("Advertisement created successfully!");
        router.push("/campaigns");
      }, 1000);
    }
  }, [formData, router, isEditMode]);

  // Handle ad-related actions
  const handleAddAd = useCallback(
    (ad) => {
      dispatch(addAd(ad));
    },
    [dispatch]
  );

  const handleUpdateAd = useCallback(
    (id, data) => {
      dispatch(updateAd({ id, data }));
    },
    [dispatch]
  );

  const handleRemoveAd = useCallback(
    (id) => {
      dispatch(removeAd(id));
    },
    [dispatch]
  );

  const handleAddMediaToAd = useCallback(
    (adId, media) => {
      dispatch(addMediaToAd({ adId, media }));
    },
    [dispatch]
  );

  const handleRemoveMediaFromAd = useCallback(
    (adId, mediaId) => {
      dispatch(removeMediaFromAd({ adId, mediaId }));
    },
    [dispatch]
  );

  // Create back button
  const backButton = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.push("/campaigns")}
      className="flex items-center gap-1"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 12L6 8L10 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back to Ad Manager
    </Button>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-shrink-0">
        <PageHeader
          title={
            currentTab === "adgroup"
              ? "Create Ad Group"
              : isEditMode
                ? "Edit Ad"
                : "Create Ad"
          }
          description={
            currentTab === "adgroup"
              ? "Group existing ads together for easier management and organization."
              : isEditMode
                ? "Update your promotional campaign to drive customer engagement and sales."
                : "Create promotional campaigns to drive customer engagement and sales."
          }
          emoji="🎯"
          actions={backButton}
          variant="aurora"
        />
      </div>

      <div
        className="overflow-hidden"
        style={{ height: "calc(100vh - 140px)" }}
      >
        <div className="h-full flex">
          {/* Side Navigation */}
          <div className="w-16 flex-shrink-0">
            <div className="h-full bg-white rounded-l-lg border border-r-0 border-gray-200 shadow-sm">
              <div className="p-3">
                <nav className="space-y-3">
                  <button
                    onClick={() => handleTabChange("ad")}
                    className={`group relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                      currentTab === "ad"
                        ? "!bg-primary !text-primary-foreground shadow-lg shadow-primary/25 scale-105 ring-2 ring-primary/20"
                        : "text-gray-600 hover:text-primary hover:bg-primary/10 hover:shadow-md hover:scale-105 bg-gray-50/80"
                    }`}
                    title="Create Ad"
                  >
                    <PhotoIcon className="h-5 w-5" />
                    {/* Active indicator */}
                    {currentTab === "ad" && (
                      <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-primary rounded-full" />
                    )}
                    {/* Tooltip on hover */}
                    <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      Create Ad
                    </div>
                  </button>

                  <button
                    onClick={() => handleTabChange("adgroup")}
                    className={`group relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                      currentTab === "adgroup"
                        ? "!bg-primary !text-primary-foreground shadow-lg shadow-primary/25 scale-105 ring-2 ring-primary/20"
                        : "text-gray-600 hover:text-primary hover:bg-primary/10 hover:shadow-md hover:scale-105 bg-gray-50/80"
                    }`}
                    title="Create Ad Group"
                  >
                    <RectangleGroupIcon className="h-5 w-5" />
                    {/* Active indicator */}
                    {currentTab === "adgroup" && (
                      <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-primary rounded-full" />
                    )}
                    {/* Tooltip on hover */}
                    <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      Create Ad Group
                    </div>
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {currentTab === "ad" && (
              <div className="flex gap-3 h-full">
                {/* Left Column - Ad Creation Form */}
                <div className="w-3/5 h-full flex flex-col">
                  <Card className="p-0 flex flex-col h-full overflow-hidden shadow-md">
                    {/* Header Section - Match preview panel style */}
                    <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 mr-2 text-primary"
                        >
                          <path d="m3 11 18-5v12L3 14v-3z"></path>
                          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
                        </svg>
                        <div>
                          <h3 className="font-medium">Ad Details</h3>
                          <p className="text-sm text-muted-foreground">
                            Configure your advertisement settings and media
                            assets
                          </p>
                        </div>
                      </div>

                      {/* Create Ad Button - positioned like Create Filter button */}
                      <Button
                        onClick={handleCreateAd}
                        disabled={!isCurrentAdValid}
                        className="flex items-center gap-1"
                        size="sm"
                      >
                        {isEditMode ? "Update Ad" : "Create Ad"}
                      </Button>
                    </div>

                    {/* Ad Creation Form - Direct render without steps */}
                    <div className="flex-1 overflow-auto">
                      <div className="p-3">
                        <AdCreationStep
                          ads={formData.ads}
                          addAd={handleAddAd}
                          updateAd={handleUpdateAd}
                          removeAd={handleRemoveAd}
                          addMediaToAd={handleAddMediaToAd}
                          removeMediaFromAd={handleRemoveMediaFromAd}
                          setStepValidation={() => {}} // No-op since we removed steps
                          onCurrentAdChange={handleCurrentAdChange}
                          onAssetUploadRef={assetUploadRef}
                          onAssetRemoveRef={assetRemoveRef}
                          onCreateAd={handleCreateAd}
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Right Column - Progress Checklist and Preview */}
                <div className="w-2/5 h-full flex flex-col">
                  <Card className="h-full p-0 flex flex-col overflow-hidden shadow-md">
                    <div className="flex-1 overflow-hidden">
                      <CampaignAnalyticsPanelLite
                        className="h-full flex-1"
                        currentAdData={currentAdData}
                        allAdsData={currentAdData?.ads || []}
                        onAssetUpload={handleAssetUploadForCurrentAd}
                        onAssetRemove={handleAssetRemoveForCurrentAd}
                      />
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {currentTab === "adgroup" && (
              <div className="flex gap-3 h-full">
                {/* Left Column - Ad Group Form (same width as ad creation) */}
                <div className="w-3/5 h-full flex flex-col">
                  <Card className="p-0 flex flex-col h-full overflow-hidden shadow-md">
                    {/* Header Section - Match ad creation style exactly */}
                    <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
                      <div className="flex items-center">
                        <RectangleGroupIcon className="h-5 w-5 mr-2 text-primary" />
                        <div>
                          <h3 className="font-medium">Ad Group Details</h3>
                          <p className="text-sm text-muted-foreground">
                            Configure your ad group settings and select ads
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {}}
                        disabled={selectedAds.length === 0}
                        className="flex items-center gap-1"
                        size="sm"
                      >
                        Create Ad Group
                      </Button>
                    </div>

                    {/* Ad Group Form - Match the ad creation form style */}
                    <div className="flex-1 overflow-auto">
                      <div className="p-3">
                        <div className="space-y-6">
                          {/* Basic Details Section */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-sm text-gray-900 border-b pb-2">
                              Basic Information
                            </h4>

                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Ad Group Name *
                              </label>
                              <input
                                type="text"
                                placeholder="Enter ad group name..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Description
                              </label>
                              <textarea
                                placeholder="Describe the purpose of this ad group..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                              />
                            </div>
                          </div>

                          {/* Merchant Selection Section */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-sm text-gray-900 border-b pb-2">
                              Merchant Selection
                            </h4>

                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Merchant *
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder={
                                    selectedMerchantData
                                      ? selectedMerchantData.name
                                      : "Type to search merchants..."
                                  }
                                  value={merchantSearchQuery}
                                  onChange={(e) => {
                                    setMerchantSearchQuery(e.target.value);
                                    setMerchantSearchOpen(true);
                                  }}
                                  onFocus={() => setMerchantSearchOpen(true)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <svg
                                    className="h-4 w-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </div>

                                {/* Merchant Dropdown */}
                                {merchantSearchOpen && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-10"
                                      onClick={() =>
                                        setMerchantSearchOpen(false)
                                      }
                                    />
                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                      {filteredMerchants.length > 0 ? (
                                        filteredMerchants.map((merchant) => (
                                          <div
                                            key={merchant.id}
                                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                            onClick={() => {
                                              setSelectedMerchant(merchant.id);
                                              setMerchantSearchQuery("");
                                              setMerchantSearchOpen(false);
                                              // Don't reset selected ads - preserve across merchant switches
                                            }}
                                          >
                                            <div className="font-medium text-sm">
                                              {merchant.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              {merchant.category}
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="px-3 py-2 text-sm text-gray-500">
                                          No merchants found
                                        </div>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {selectedMerchantData
                                  ? `Selected: ${selectedMerchantData.name}`
                                  : "Select a merchant to view available ads"}
                              </p>
                            </div>
                          </div>

                          {/* Ad Selection Section */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-sm text-gray-900 border-b pb-2 flex items-center gap-2">
                              Ad Selection
                              <span className="text-xs font-normal text-gray-500">
                                ({selectedAds.length} selected)
                              </span>
                            </h4>

                            {!selectedMerchant ? (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <RectangleGroupIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <p className="text-sm text-blue-700 font-medium mb-1">
                                  Select a Merchant First
                                </p>
                                <p className="text-xs text-blue-600">
                                  Choose a merchant above to view their
                                  available ads
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm text-gray-600">
                                    {availableAds.length} ads available from{" "}
                                    {selectedMerchantData?.name}
                                  </p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={availableAds.length === 0}
                                    onClick={() => {
                                      if (
                                        selectedAds.length ===
                                        availableAds.length
                                      ) {
                                        setSelectedAds([]);
                                      } else {
                                        setSelectedAds(
                                          availableAds.map((ad) => ad.id)
                                        );
                                      }
                                    }}
                                  >
                                    {selectedAds.length === availableAds.length
                                      ? "Deselect All"
                                      : "Select All"}
                                  </Button>
                                </div>

                                <div className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-3 bg-gray-50">
                                  {availableAds.map((ad) => (
                                    <div
                                      key={ad.id}
                                      className={`border rounded-md p-3 transition-colors bg-white ${
                                        selectedAds.includes(ad.id)
                                          ? "border-blue-500 ring-1 ring-blue-200"
                                          : "border-gray-200 hover:border-blue-300"
                                      }`}
                                    >
                                      <div className="flex items-start gap-3">
                                        <input
                                          type="checkbox"
                                          checked={selectedAds.includes(ad.id)}
                                          onChange={() => {
                                            if (selectedAds.includes(ad.id)) {
                                              setSelectedAds(
                                                selectedAds.filter(
                                                  (id) => id !== ad.id
                                                )
                                              );
                                            } else {
                                              setSelectedAds([
                                                ...selectedAds,
                                                ad.id,
                                              ]);
                                            }
                                          }}
                                          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h5 className="font-medium text-sm truncate">
                                              {ad.name}
                                            </h5>
                                            <span
                                              className={`px-2 py-1 text-xs rounded-full ${
                                                ad.status === "Active"
                                                  ? "bg-green-100 text-green-800"
                                                  : "bg-yellow-100 text-yellow-800"
                                              }`}
                                            >
                                              {ad.status}
                                            </span>
                                          </div>
                                          <p className="text-xs text-gray-500 mb-2">
                                            {ad.offer}
                                          </p>
                                          <div className="flex flex-wrap gap-1 mb-2">
                                            {ad.mediaTypes.map(
                                              (type: string) => (
                                                <span
                                                  key={type}
                                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                                >
                                                  {type}
                                                </span>
                                              )
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                          {selectedAds.includes(ad.id) ? (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => {
                                                setSelectedAds(
                                                  selectedAds.filter(
                                                    (id) => id !== ad.id
                                                  )
                                                );
                                              }}
                                              className="text-red-600 border-red-300 hover:bg-red-50"
                                            >
                                              Remove
                                            </Button>
                                          ) : (
                                            <Button
                                              size="sm"
                                              onClick={() => {
                                                setSelectedAds([
                                                  ...selectedAds,
                                                  ad.id,
                                                ]);
                                              }}
                                              className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                              Add
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}

                                  {availableAds.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                      <p>No ads available for this merchant</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Right Column - Ad Group Preview & Summary (same width as ad creation) */}
                <div className="w-2/5 h-full flex flex-col">
                  <Card className="h-full p-0 flex flex-col overflow-hidden shadow-md">
                    {/* Header Section - Match ad creation preview style */}
                    <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
                      <div className="flex items-center">
                        <SparklesIcon className="h-5 w-5 mr-2 text-primary" />
                        <div>
                          <h3 className="font-medium">Ad Group Preview</h3>
                          <p className="text-sm text-muted-foreground">
                            Review your ad group configuration
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Preview Content */}
                    <div className="flex-1 overflow-auto p-4">
                      <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {selectedAds.length}
                            </div>
                            <div className="text-xs text-blue-600">
                              Selected Ads
                            </div>
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {
                                new Set(
                                  selectedAds
                                    .map(
                                      (adId) =>
                                        allAds.find((a) => a.id === adId)
                                          ?.merchantId
                                    )
                                    .filter(Boolean)
                                ).size
                              }
                            </div>
                            <div className="text-xs text-green-600">
                              Merchants
                            </div>
                          </div>
                        </div>

                        {/* Group Hierarchy with Full Details */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm text-gray-900 border-b pb-2">
                            Group Hierarchy
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="space-y-3">
                              {/* Ad Group Header */}
                              <div className="flex items-center gap-2">
                                <RectangleGroupIcon className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-900">
                                  Ad Group
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({selectedAds.length} ads)
                                </span>
                              </div>

                              {/* Merchants and their ads */}
                              {selectedAds.length > 0 ? (
                                <div className="ml-6 space-y-3">
                                  {/* Group ads by merchant */}
                                  {Array.from(
                                    new Set(
                                      selectedAds
                                        .map(
                                          (adId) =>
                                            allAds.find((a) => a.id === adId)
                                              ?.merchantId
                                        )
                                        .filter(Boolean)
                                    )
                                  ).map((merchantId) => {
                                    const merchant = availableMerchants.find(
                                      (m) => m.id === merchantId
                                    );
                                    const merchantAds = selectedAds.filter(
                                      (adId) =>
                                        allAds.find((a) => a.id === adId)
                                          ?.merchantId === merchantId
                                    );

                                    return (
                                      <div
                                        key={merchantId}
                                        className="space-y-2"
                                      >
                                        {/* Merchant Header */}
                                        <div className="flex items-center gap-2">
                                          <BanknotesIcon className="h-3 w-3 text-green-600" />
                                          <span className="text-xs font-medium text-gray-700">
                                            {merchant?.name}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            ({merchantAds.length} ads)
                                          </span>
                                        </div>

                                        {/* Ads under this merchant */}
                                        <div className="ml-4 space-y-2">
                                          {merchantAds.map((adId) => {
                                            const ad = allAds.find(
                                              (a) => a.id === adId
                                            );
                                            return ad ? (
                                              <div
                                                key={adId}
                                                className="bg-white rounded-md p-3 border border-gray-200"
                                              >
                                                <div className="flex items-start justify-between gap-2">
                                                  <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                      <PhotoIcon className="h-3 w-3 text-blue-500" />
                                                      <span className="text-xs font-medium truncate">
                                                        {ad.name}
                                                      </span>
                                                      <span
                                                        className={`px-1.5 py-0.5 text-xs rounded-full ${
                                                          ad.status === "Active"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                      >
                                                        {ad.status}
                                                      </span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mb-1">
                                                      {ad.offer}
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                      {ad.mediaTypes.map(
                                                        (type: string) => (
                                                          <span
                                                            key={type}
                                                            className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                                                          >
                                                            {type}
                                                          </span>
                                                        )
                                                      )}
                                                    </div>
                                                  </div>
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                      setSelectedAds(
                                                        selectedAds.filter(
                                                          (id) => id !== adId
                                                        )
                                                      );
                                                    }}
                                                    className="text-red-600 border-red-300 hover:bg-red-50 flex-shrink-0"
                                                  >
                                                    ×
                                                  </Button>
                                                </div>
                                              </div>
                                            ) : null;
                                          })}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="ml-6 text-xs text-gray-400 italic">
                                  No ads selected
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEditMode
                ? "Confirm Advertisement Update"
                : "Confirm Advertisement Creation"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isEditMode
                ? "Are you sure you want to update this advertisement? This will apply your changes to the existing campaign."
                : "Are you sure you want to create this advertisement? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmedCreateAd}>
              {isEditMode ? "Update Ad" : "Create Ad"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdvertisementWizard;
