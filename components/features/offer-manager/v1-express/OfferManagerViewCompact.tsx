"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircleIcon,
  GiftIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import CombinedOfferFormCompact from "./steps/CombinedOfferFormCompact";
import { ReviewPreviewPanel } from "@/components/ui/review-preview-panel";
import { useOfferContentAI } from "@/lib/hooks/useOfferContentAI";

// Available merchants with IDs (shared with form)
const MERCHANTS = [
  { label: "Deacon's Pizza (ID: M001)", value: "M001" },
  { label: "Tony's Italian Restaurant (ID: M002)", value: "M002" },
  { label: "Burger Haven (ID: M003)", value: "M003" },
  { label: "Sushi Palace (ID: M004)", value: "M004" },
  { label: "Coffee Corner Cafe (ID: M005)", value: "M005" },
  { label: "The Steakhouse (ID: M006)", value: "M006" },
  { label: "Thai Spice Kitchen (ID: M007)", value: "M007" },
  { label: "Pizza Express (ID: M008)", value: "M008" },
  { label: "Mediterranean Grill (ID: M009)", value: "M009" },
  { label: "Taco Fiesta (ID: M010)", value: "M010" },
  { label: "Seafood Shack (ID: M011)", value: "M011" },
  { label: "Downtown Bakery (ID: M012)", value: "M012" },
  { label: "Garden Bistro (ID: M013)", value: "M013" },
  { label: "BBQ Junction (ID: M014)", value: "M014" },
  { label: "Noodle House (ID: M015)", value: "M015" },
  { label: "The Sandwich Shop (ID: M016)", value: "M016" },
  { label: "Ice Cream Parlor (ID: M017)", value: "M017" },
  { label: "Smoothie Bar (ID: M018)", value: "M018" },
  { label: "Breakfast Spot (ID: M019)", value: "M019" },
  { label: "Wine & Dine (ID: M020)", value: "M020" },
];

/**
 * Offer Manager Express Template - Compact Version
 *
 * Two-column layout for more compact form presentation
 * - Same functionality as standard Express template
 * - Optimized for better space utilization
 * - Responsive grid layout (1 column mobile, 2 columns desktop)
 */

interface OfferManagerViewCompactProps {
  onCreatingChange?: (isCreating: boolean) => void;
  autoStart?: boolean;
  onBackToDashboard?: () => void;
  showReviewPanel?: boolean; // P0: false (bare minimum), Future: true (with preview)
}

// Simplified validation for Express template (combined form)
const validateFormExpress = (formData: any): boolean => {
  // All required fields in one validation
  return !!(
    formData.merchant?.trim() && // Now a string value
    formData.offerSource &&
    formData.offerName?.trim() &&
    formData.description?.trim() &&
    formData.startDate?.trim() &&
    formData.termsConditions?.trim() &&
    formData.offerType?.trim() &&
    formData.discountValue?.trim() && // Required
    formData.externalUrl?.trim() &&
    formData.promoCode?.trim() &&
    formData.usageLimitPerCustomer?.trim() &&
    formData.redemptionRollingPeriod?.trim() // Required - single, monthly, or yearly
  );
};

export default function OfferManagerViewCompact({
  onCreatingChange,
  autoStart = false,
  onBackToDashboard,
  showReviewPanel = false, // Default to P0 (bare minimum) - no preview panel
}: OfferManagerViewCompactProps = {}) {
  const [isFormValid, setIsFormValid] = useState(false);

  // Publish modal state
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Express Template Form data - simplified, only essential fields
  const [formData, setFormData] = useState({
    // Offer Details
    merchant: "", // Required - Select merchant by ID
    offerSource: null, // Required - Select/create source
    offerName: "", // Required
    shortText: "", // Backward compat
    description: "", // Required
    longText: "", // Backward compat
    startDate: "", // Required
    endDate: "", // Optional
    termsConditions: "", // Required

    // Classification
    offerType: "", // Required
    discountValue: "", // Required
    maxDiscountAmount: "", // Optional

    // Redemption Method (hardcoded for Express)
    redemptionTypes: ["external_url"], // Hardcoded: online only
    promoCodeType: "single", // Hardcoded: static code only
    promoCode: "", // Required
    externalUrl: "", // Required

    // Usage limits
    usageLimitPerCustomer: "1", // Required
    redemptionRollingPeriod: "", // Required - single, monthly, or yearly
    locationScope: "all", // Hardcoded: online, no location restrictions

    // Hidden/hardcoded values (not exposed in UI)
    geography: "US", // Hardcoded
    channel: "online", // Hardcoded
  });

  // Initialize CopilotKit AI content generation
  // Find merchant label from ID for AI context
  const merchantLabel = formData.merchant
    ? MERCHANTS.find((m) => m.value === formData.merchant)?.label ||
      formData.merchant
    : "";

  useOfferContentAI({
    merchantName: merchantLabel,
    offerTitle: formData.offerName,
    offerType: formData.offerType,
    description: formData.description,
  });

  // Track validation state whenever formData changes
  useEffect(() => {
    setIsFormValid(validateFormExpress(formData));
  }, [formData]);

  // Notify parent component on mount
  useEffect(() => {
    onCreatingChange?.(true);
  }, [onCreatingChange]);

  const handleBackToDashboard = () => {
    if (onBackToDashboard) {
      onBackToDashboard();
    }
  };

  const handleFormUpdate = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Open publish confirmation modal
  const handleSubmit = () => {
    setShowPublishModal(true);
  };

  // Actual publish handler with API call
  const handleConfirmPublish = async (shouldPublish: boolean = true) => {
    setIsPublishing(true);
    setPublishError(null);

    try {
      console.log(
        shouldPublish
          ? "Creating and publishing offer:"
          : "Creating offer without publishing:",
        formData
      );

      // TODO: Replace with actual API call
      // const response = await fetch("/api/offers", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      //
      // if (!response.ok) {
      //   throw new Error("Failed to publish offer");
      // }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success!
      setPublishSuccess(true);
      setIsPublishing(false);

      // Close modal and return to dashboard after short delay
      setTimeout(() => {
        setShowPublishModal(false);
        handleBackToDashboard();
      }, 1500);
    } catch (error) {
      setIsPublishing(false);
      setPublishError(
        error instanceof Error
          ? error.message
          : "Failed to publish offer. Please try again."
      );
    }
  };

  return (
    <div className="overflow-hidden" style={{ height: "calc(100vh - 140px)" }}>
      <div className="h-full flex gap-3">
        {/* Main Content Area - Full Width (No Stepper) */}
        <div className="flex-1">
          <div className="h-full">
            <div className="w-full h-full flex flex-col">
              <Card className="p-0 flex flex-col h-full overflow-hidden shadow-md">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
                  <div className="flex items-center">
                    <GiftIcon className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <h3 className="font-medium">Create Offer</h3>
                      <p className="text-sm text-muted-foreground">
                        Build and publish your offer
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center gap-2">
                    <Button
                      className="flex items-center gap-1"
                      size="sm"
                      onClick={handleSubmit}
                      disabled={!isFormValid}
                      title={
                        !isFormValid
                          ? "Complete all required fields to publish"
                          : undefined
                      }
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      Publish Offer
                    </Button>
                  </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-auto">
                  <div className="p-4">
                    <CombinedOfferFormCompact
                      formData={formData}
                      onUpdate={handleFormUpdate}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Review Preview Panel - Right Column (Hidden in P0, shown in future versions) */}
        {showReviewPanel && (
          <div className="w-[400px] flex-shrink-0">
            <Card className="h-full overflow-hidden shadow-md rounded-r-lg">
              <ReviewPreviewPanel formData={formData} currentStep="details" />
            </Card>
          </div>
        )}
      </div>

      {/* Publish Confirmation Modal */}
      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {publishSuccess ? (
                <>
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  Offer Published Successfully!
                </>
              ) : publishError ? (
                <>
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  Publishing Failed
                </>
              ) : (
                <>
                  <GiftIcon className="h-6 w-6 text-blue-600" />
                  Publish Offer
                </>
              )}
            </DialogTitle>
            <DialogDescription className="pt-4">
              {publishSuccess ? (
                <div className="space-y-2">
                  <p className="text-green-700">
                    Your offer has been published and is now live!
                  </p>
                  <p className="text-sm text-gray-600">
                    Redirecting to dashboard...
                  </p>
                </div>
              ) : publishError ? (
                <div className="space-y-2">
                  <p className="text-red-700">{publishError}</p>
                  <p className="text-sm text-gray-600">
                    Please try again or contact support if the problem persists.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p>
                    Ready to create{" "}
                    <strong>"{formData.offerName || "this offer"}"</strong>?
                  </p>
                  <p>
                    Create and publish will make the offer live immediately.
                    <br />
                    Create without publishing will save it as inactive for later
                    review.
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-col items-center gap-2 sm:justify-between">
            {publishSuccess ? null : publishError ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowPublishModal(false);
                    setPublishError(null);
                  }}
                  className="mr-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleConfirmPublish(true)}
                  disabled={isPublishing}
                >
                  {isPublishing ? "Retrying..." : "Try Again"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setShowPublishModal(false)}
                  disabled={isPublishing}
                  className="mr-auto"
                >
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleConfirmPublish(true)}
                    disabled={isPublishing}
                  >
                    {isPublishing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      "Create and Publish"
                    )}
                  </Button>
                  <Button
                    onClick={() => handleConfirmPublish(false)}
                    disabled={isPublishing}
                  >
                    {isPublishing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      "Create without Publishing"
                    )}
                  </Button>
                </div>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
