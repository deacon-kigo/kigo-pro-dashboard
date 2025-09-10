"use client";

import React, { useEffect, useCallback, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { RootState } from "@/lib/redux/store";
import { useToast } from "@/lib/hooks/use-toast";

import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ShinyBorder } from "@/components/ui/shiny-border";
import { SelectedProgramsDisplay } from "@/components/features/campaigns/product-filters/SelectedProgramsDisplay";
import {
  AssignToProgramsPanel,
  mockPartners,
} from "@/components/features/campaigns/product-filters/AssignToProgramsPanel";
import { Badge } from "@/components/atoms/Badge";

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
  DocumentTextIcon,
  BuildingStorefrontIcon,
  CogIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  ChevronRightIcon,
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
  const { toast } = useToast();

  // Tab state
  const [currentTab, setCurrentTab] = useState(
    isAdGroupMode ? "adgroup" : "ad"
  );

  // Ad Group state
  const [selectedMerchant, setSelectedMerchant] = useState<string>("");
  const [merchantSearchOpen, setMerchantSearchOpen] = useState(false);
  const [merchantSearchQuery, setMerchantSearchQuery] = useState("");
  const [selectedAds, setSelectedAds] = useState<string[]>([]);
  const adsContainerRef = useRef<HTMLDivElement>(null);
  const previewAdsContainerRef = useRef<HTMLDivElement>(null);

  // Function to scroll preview to bottom
  const scrollPreviewToBottom = useCallback(() => {
    setTimeout(() => {
      if (previewAdsContainerRef.current) {
        previewAdsContainerRef.current.scrollTop =
          previewAdsContainerRef.current.scrollHeight;
      }
    }, 100);
  }, []);

  // Program assignment state
  const [isProgramAssignmentOpen, setIsProgramAssignmentOpen] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);

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
        },
        {
          id: "ad-2",
          merchantId: "m1",
          name: "Tony's Lunch Deal",
          offer: "Buy one pizza, get 50% off second",
          mediaTypes: ["Display Banner"],
        },
      ],
      m2: [
        {
          id: "ad-3",
          merchantId: "m2",
          name: "Deacon's Weekend Bundle",
          offer: "Buy 2 pizzas, get free breadsticks",
          mediaTypes: ["Display Banner", "Social Media"],
        },
        {
          id: "ad-4",
          merchantId: "m2",
          name: "Deacon's Happy Hour",
          offer: "25% off all orders 3-6 PM",
          mediaTypes: ["Social Media"],
        },
      ],
      m3: [
        {
          id: "ad-5",
          merchantId: "m3",
          name: "Frank's Lunch Deal",
          offer: "Two slices + drink for $8.99",
          mediaTypes: ["Display Banner"],
        },
      ],
      m4: [
        {
          id: "ad-6",
          merchantId: "m4",
          name: "Coffee Express Morning Special",
          offer: "Buy any coffee, get pastry 50% off",
          mediaTypes: ["Display Banner", "Native"],
        },
        {
          id: "ad-7",
          merchantId: "m4",
          name: "Coffee Express Loyalty",
          offer: "Buy 10 coffees, get 1 free",
          mediaTypes: ["Display Banner"],
        },
      ],
      m5: [
        {
          id: "ad-8",
          merchantId: "m5",
          name: "Textbook Sale",
          offer: "15% off all textbooks",
          mediaTypes: ["Social Media"],
        },
      ],
      m6: [
        {
          id: "ad-9",
          merchantId: "m6",
          name: "New Member Deal",
          offer: "First month free with annual membership",
          mediaTypes: ["Display Banner", "Video"],
        },
        {
          id: "ad-10",
          merchantId: "m6",
          name: "Personal Training Special",
          offer: "3 sessions for $99",
          mediaTypes: ["Display Banner"],
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

  // Mock program campaigns data
  const mockProgramCampaigns = [
    {
      id: "pc-001",
      name: "Summer Holiday Campaign",
      description: "Special offers for summer vacation packages",
      category: "Seasonal",
      active: true,
    },
    {
      id: "pc-002",
      name: "Winter Wonderland",
      description: "Winter season promotional campaign",
      category: "Seasonal",
      active: true,
    },
    {
      id: "pc-003",
      name: "Family Package Promotion",
      description: "Special rates for family packages",
      category: "Demographic",
      active: true,
    },
    {
      id: "pc-004",
      name: "Weekend Getaway",
      description: "Special offers for weekend trips",
      category: "Travel Type",
      active: true,
    },
  ];

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
              <div className="p-2">
                <nav className="space-y-3">
                  <button
                    onClick={() => handleTabChange("ad")}
                    className={`group relative w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 ${
                      currentTab === "ad"
                        ? "bg-pastel-blue text-primary font-medium"
                        : "text-gray-600 hover:bg-pastel-blue hover:text-primary"
                    }`}
                    title="Create Ad"
                  >
                    <PhotoIcon className="h-5 w-5" />

                    {/* Tooltip on hover */}
                    <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      Create Ad
                    </div>
                  </button>

                  <button
                    onClick={() => handleTabChange("adgroup")}
                    className={`group relative w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 ${
                      currentTab === "adgroup"
                        ? "bg-pastel-blue text-primary font-medium"
                        : "text-gray-600 hover:bg-pastel-blue hover:text-primary"
                    }`}
                    title="Create Ad Group"
                  >
                    <RectangleGroupIcon className="h-5 w-5" />

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
                        <div className="space-y-4">
                          {/* Basic Details Section */}
                          <Accordion
                            type="single"
                            collapsible
                            defaultValue="basic-info"
                            className="border rounded-md overflow-hidden"
                          >
                            <AccordionItem
                              value="basic-info"
                              className="border-none"
                            >
                              <AccordionTrigger className="px-4 py-3 text-sm font-medium">
                                <div className="flex items-center">
                                  <DocumentTextIcon className="h-4 w-4 mr-2 text-blue-600" />
                                  Basic Information
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 text-left overflow-hidden">
                                <div className="space-y-4 pb-4">
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
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>

                          {/* Merchant & Ad Selection Section */}
                          <Accordion
                            type="single"
                            collapsible
                            defaultValue="merchant-ads"
                            className="border rounded-md overflow-hidden"
                          >
                            <AccordionItem
                              value="merchant-ads"
                              className="border-none"
                            >
                              <AccordionTrigger className="px-4 py-3 text-sm font-medium">
                                <div className="flex items-center">
                                  <BuildingStorefrontIcon className="h-4 w-4 mr-2 text-green-600" />
                                  Merchant & Ad Selection
                                  {selectedMerchant &&
                                    selectedAds.length > 0 && (
                                      <span className="ml-2 text-sm text-gray-500">
                                        ({selectedAds.length} ads selected)
                                      </span>
                                    )}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 text-left overflow-hidden">
                                <div className="space-y-6 pb-4">
                                  {/* Merchant Selection */}
                                  <div className="space-y-4">
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
                                            setMerchantSearchQuery(
                                              e.target.value
                                            );
                                            setMerchantSearchOpen(true);
                                          }}
                                          onFocus={() =>
                                            setMerchantSearchOpen(true)
                                          }
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
                                                filteredMerchants.map(
                                                  (merchant) => (
                                                    <div
                                                      key={merchant.id}
                                                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                      onClick={() => {
                                                        setSelectedMerchant(
                                                          merchant.id
                                                        );
                                                        setMerchantSearchQuery(
                                                          ""
                                                        );
                                                        setMerchantSearchOpen(
                                                          false
                                                        );
                                                      }}
                                                    >
                                                      <div className="font-medium text-sm text-gray-400">
                                                        {merchant.name}
                                                      </div>
                                                    </div>
                                                  )
                                                )
                                              ) : (
                                                <div className="px-3 py-2 text-sm text-gray-500">
                                                  No merchants found
                                                </div>
                                              )}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        Choose merchants individually by
                                        selecting each merchant and its ads. You
                                        can select multiple merchants
                                      </p>
                                    </div>
                                  </div>

                                  {/* Ad Selection Section */}
                                  <div className="space-y-4">
                                    <h4 className="font-medium text-sm text-gray-900 border-b pb-2">
                                      Merchant and Ad Selection
                                    </h4>

                                    {!selectedMerchant ? (
                                      <div className="flex flex-col items-center justify-center text-center py-8">
                                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full">
                                          <BuildingStorefrontIcon className="w-8 h-8 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                          Select a Merchant First
                                        </h3>
                                        <p className="text-sm text-muted-foreground max-w-sm">
                                          Choose a merchant above to view their
                                          available ads for your ad group
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                          <p className="text-sm text-gray-600">
                                            {availableAds.length} ads available
                                            from {selectedMerchantData?.name}
                                          </p>
                                          {availableAds.length > 0 && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => {
                                                // Check if all current merchant's ads are selected
                                                const currentMerchantSelectedCount =
                                                  availableAds.filter((ad) =>
                                                    selectedAds.includes(ad.id)
                                                  ).length;

                                                if (
                                                  currentMerchantSelectedCount ===
                                                  availableAds.length
                                                ) {
                                                  // Deselect only current merchant's ads
                                                  const otherMerchantAds =
                                                    selectedAds.filter(
                                                      (adId) =>
                                                        !availableAds.some(
                                                          (ad) => ad.id === adId
                                                        )
                                                    );
                                                  setSelectedAds(
                                                    otherMerchantAds
                                                  );

                                                  // Show toast feedback for deselect all
                                                  toast({
                                                    title: "Ads Removed",
                                                    description: `${availableAds.length} ads have been removed from ad group`,
                                                    className:
                                                      "!bg-yellow-100 !border-yellow-300 !text-yellow-800",
                                                  });
                                                } else {
                                                  // Add current merchant's ads to existing selection
                                                  const newSelection = [
                                                    ...new Set([
                                                      ...selectedAds,
                                                      ...availableAds.map(
                                                        (ad) => ad.id
                                                      ),
                                                    ]),
                                                  ];
                                                  setSelectedAds(newSelection);

                                                  // Show toast feedback for select all
                                                  toast({
                                                    title: "Ads Added",
                                                    description: `${availableAds.length} ads have been added to ad group`,
                                                    className:
                                                      "!bg-green-100 !border-green-300 !text-green-800",
                                                  });

                                                  // Scroll to bottom of both containers
                                                  setTimeout(() => {
                                                    if (
                                                      adsContainerRef.current
                                                    ) {
                                                      adsContainerRef.current.scrollTop =
                                                        adsContainerRef.current.scrollHeight;
                                                    }
                                                  }, 100);

                                                  // Scroll preview to bottom
                                                  scrollPreviewToBottom();
                                                }
                                              }}
                                            >
                                              {availableAds.filter((ad) =>
                                                selectedAds.includes(ad.id)
                                              ).length === availableAds.length
                                                ? "Deselect All"
                                                : "Select All"}
                                            </Button>
                                          )}
                                        </div>

                                        <div
                                          ref={adsContainerRef}
                                          className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-3 bg-gray-50"
                                        >
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
                                                  checked={selectedAds.includes(
                                                    ad.id
                                                  )}
                                                  onChange={() => {
                                                    if (
                                                      selectedAds.includes(
                                                        ad.id
                                                      )
                                                    ) {
                                                      setSelectedAds(
                                                        selectedAds.filter(
                                                          (id) => id !== ad.id
                                                        )
                                                      );

                                                      // Show toast feedback for removal
                                                      toast({
                                                        title: "Ad Removed",
                                                        description: `"${ad.name}" has been removed from your ad group`,
                                                        className:
                                                          "!bg-yellow-100 !border-yellow-300 !text-yellow-800",
                                                      });
                                                    } else {
                                                      setSelectedAds([
                                                        ...selectedAds,
                                                        ad.id,
                                                      ]);

                                                      // Show toast feedback for addition
                                                      toast({
                                                        title: "Ad Added",
                                                        description: `"${ad.name}" has been added to your ad group`,
                                                        className:
                                                          "!bg-green-100 !border-green-300 !text-green-800",
                                                      });

                                                      // Scroll to bottom of both containers
                                                      setTimeout(() => {
                                                        if (
                                                          adsContainerRef.current
                                                        ) {
                                                          adsContainerRef.current.scrollTop =
                                                            adsContainerRef.current.scrollHeight;
                                                        }
                                                      }, 100);

                                                      // Scroll preview to bottom
                                                      scrollPreviewToBottom();
                                                    }
                                                  }}
                                                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <div className="flex-1 min-w-0">
                                                  <div className="flex items-center gap-2 mb-1">
                                                    <h5 className="font-medium text-sm truncate">
                                                      {ad.name}
                                                    </h5>
                                                  </div>
                                                  <p className="text-sm text-gray-500 mb-2">
                                                    {ad.offer}
                                                  </p>
                                                  <div className="flex flex-wrap gap-1 mb-2">
                                                    {ad.mediaTypes.map(
                                                      (type: string) => (
                                                        <span
                                                          key={type}
                                                          className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                                                        >
                                                          {type}
                                                        </span>
                                                      )
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}

                                          {availableAds.length === 0 && (
                                            <div className="text-center py-8 text-gray-500">
                                              <p>
                                                No ads available for this
                                                merchant
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>

                          {/* Program Assignment Section - Clean button interface */}
                          <div className="flex-1 min-h-0">
                            <ShinyBorder
                              isActive={selectedPrograms.length > 0}
                              borderRadius={8}
                            >
                              <div className="border rounded-md overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer">
                                <Button
                                  variant="ghost"
                                  className="w-full justify-between px-4 py-3 text-sm font-medium hover:bg-transparent"
                                  onClick={() =>
                                    setIsProgramAssignmentOpen(true)
                                  }
                                >
                                  <div className="flex items-center">
                                    <UsersIcon className="h-4 w-4 mr-2" />
                                    {selectedPrograms.length > 0
                                      ? `Edit Program Assignments (${selectedPrograms.length})`
                                      : "Assign to Program Campaigns"}
                                    <Badge
                                      variant="outline"
                                      className="ml-2 text-xs bg-blue-50 text-blue-700"
                                    >
                                      Optional
                                    </Badge>
                                  </div>
                                  <ChevronRightIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </ShinyBorder>
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
                          <h3 className="font-medium">Preview Ad Groups</h3>
                          <p className="text-sm text-muted-foreground">
                            Review your ad group configuration
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Preview Content */}
                    <div className="flex-1 overflow-hidden p-3">
                      <div className="h-full flex flex-col gap-3">
                        {/* Group Hierarchy - Static Container - 50% height */}
                        <div className="flex-1 flex flex-col min-h-0">
                          {/* Ad Group Container - Static */}
                          <div className="border rounded-lg overflow-hidden h-full flex flex-col">
                            <div className="px-4 py-3 text-sm font-medium flex-shrink-0 border-b bg-gray-50">
                              <div className="flex items-center gap-2">
                                <RectangleGroupIcon className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-900">
                                  Ad Group
                                </span>
                                <span className="text-sm text-gray-500">
                                  ({selectedAds.length} ads,{" "}
                                  {
                                    Array.from(
                                      new Set(
                                        selectedAds
                                          .map(
                                            (adId) =>
                                              allAds.find((a) => a.id === adId)
                                                ?.merchantId
                                          )
                                          .filter(Boolean)
                                      )
                                    ).length
                                  }{" "}
                                  merchants)
                                </span>
                              </div>
                            </div>
                            <div
                              ref={previewAdsContainerRef}
                              className="px-4 py-4 flex-1 overflow-auto min-h-0"
                            >
                              {/* Merchants and their ads - Multiple merchants supported */}
                              {selectedAds.length > 0 ? (
                                <div className="space-y-3">
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
                                      <Accordion
                                        key={merchantId}
                                        type="single"
                                        collapsible
                                        defaultValue={`merchant-${merchantId}`}
                                        className="border rounded-md overflow-hidden"
                                      >
                                        <AccordionItem
                                          value={`merchant-${merchantId}`}
                                          className="border-none"
                                        >
                                          <AccordionTrigger className="px-3 py-2 text-sm hover:no-underline">
                                            <div className="flex items-center gap-2">
                                              <BanknotesIcon className="h-3 w-3 text-green-600" />
                                              <span className="text-sm font-medium text-gray-700">
                                                {merchant?.name}
                                              </span>
                                              <span className="text-sm text-gray-500">
                                                ({merchantAds.length} ads)
                                              </span>
                                            </div>
                                          </AccordionTrigger>
                                          <AccordionContent className="px-3 pb-3">
                                            {/* Ads under this merchant */}
                                            <div className="space-y-2">
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
                                                          <span className="text-sm font-medium truncate">
                                                            {ad.name}
                                                          </span>
                                                        </div>
                                                        <div className="text-sm text-gray-500 mb-1">
                                                          {ad.offer}
                                                        </div>
                                                        <div className="flex flex-wrap gap-1">
                                                          {ad.mediaTypes.map(
                                                            (type: string) => (
                                                              <span
                                                                key={type}
                                                                className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-sm rounded"
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
                                                              (id) =>
                                                                id !== adId
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
                                          </AccordionContent>
                                        </AccordionItem>
                                      </Accordion>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center text-center py-8">
                                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full">
                                    <RectangleGroupIcon className="w-8 h-8 text-primary" />
                                  </div>
                                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No Ads Selected
                                  </h3>
                                  <p className="text-sm text-muted-foreground max-w-sm">
                                    Select ads from the form on the left to
                                    group them together for easier management
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Program Campaigns Assignment - 50% height */}
                        <div className="flex-1 flex flex-col min-h-0">
                          <div className="bg-white rounded-lg overflow-hidden border border-gray-200 h-full flex flex-col">
                            <div className="flex items-center gap-2 p-3 border-b bg-gray-50 flex-shrink-0">
                              <UsersIcon className="h-4 w-4 text-purple-600" />
                              <span className="text-sm font-medium text-gray-900">
                                Program Campaign Assignment
                              </span>
                            </div>
                            <div className="flex-1 overflow-auto min-h-0">
                              {selectedPrograms.length > 0 ? (
                                <SelectedProgramsDisplay
                                  partners={mockPartners}
                                  selectedProgramIds={selectedPrograms}
                                  onEditClick={() =>
                                    setIsProgramAssignmentOpen(true)
                                  }
                                  bulkAssignmentStatus="idle"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center text-center py-8">
                                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full">
                                    <UsersIcon className="w-8 h-8 text-primary" />
                                  </div>
                                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No Program Campaigns Assigned
                                  </h3>
                                  <p className="text-sm text-muted-foreground max-w-sm">
                                    Assign this ad group to program campaigns
                                    for distribution and reach
                                  </p>
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

      {/* Program Assignment Modal - EXACT catalog filter structure */}
      {isProgramAssignmentOpen && (
        <Dialog
          open={isProgramAssignmentOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsProgramAssignmentOpen(false);
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Assign Ad Group to Programs</DialogTitle>
              <DialogDescription>
                Select which program campaigns this ad group should be assigned
                to for distribution.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[calc(80vh-10rem)] overflow-hidden">
              <AssignToProgramsPanel
                filterId="ad-group-temp-id"
                filterName="Ad Group Assignment"
                onClose={(selectedIds) => {
                  setIsProgramAssignmentOpen(false);
                  if (selectedIds) {
                    setSelectedPrograms(selectedIds);
                  }
                }}
                initialSelection={selectedPrograms}
                partnerData={mockPartners}
                onSelectionChange={() => {}}
                onStartBulkAssignment={() => {}}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

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
