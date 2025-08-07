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

const AdvertisementWizard: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

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
          title={isEditMode ? "Edit Ad" : "Create Ad"}
          description={
            isEditMode
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
                      Configure your advertisement settings and media assets
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
