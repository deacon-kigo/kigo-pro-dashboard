"use client";

import React, { useEffect, useCallback, useState, useRef } from "react";
import { useRouter } from "next/navigation";
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

// Import step components
import AdCreationStep from "./steps/AdCreationStep";

const AdvertisementWizard: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get campaign state from Redux
  const { formData, isGenerating } = useSelector(
    (state: RootState) => state.campaign
  );

  // State to track current ad data for live preview
  const [currentAdData, setCurrentAdData] = useState<any>(null);

  // Refs to access asset management functions from AdCreationStep
  const assetUploadRef = useRef<
    ((mediaType: string, file: File) => void) | null
  >(null);
  const assetRemoveRef = useRef<
    ((mediaType: string, assetId: string) => void) | null
  >(null);

  // Reset campaign form on initial load
  useEffect(() => {
    dispatch(resetCampaign());
  }, [dispatch]);

  // Update AI context when form data changes
  useEffect(() => {
    dispatch(setCampaignContext(formData));
  }, [dispatch, formData]);

  // Handle current ad data change from AdCreationStep
  const handleCurrentAdChange = useCallback((adData: any) => {
    setCurrentAdData(adData);
  }, []);

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
    // Handle ad creation
    console.log("Create advertisement with data:", formData);
    // TODO: Implement actual ad creation API call
    setTimeout(() => {
      // Simulate success
      alert("Advertisement created successfully!");
      router.push("/campaign-manager");
    }, 1000);
  }, [formData, router]);

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
      onClick={() => router.push("/campaign-manager")}
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
      Back to Ads Manager
    </Button>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-shrink-0">
        <PageHeader
          title="Create Ads"
          description="Design and launch your advertisement."
          emoji="📊"
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
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <div>
                    <h3 className="font-medium">Ad Details</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure your advertisement settings and media assets
                    </p>
                  </div>
                </div>
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
    </div>
  );
};

export default AdvertisementWizard;
