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
import CombinedOfferFormExpress from "./steps/CombinedOfferFormExpress";
import { ReviewPreviewPanel } from "@/components/ui/review-preview-panel";
import { useOfferContentAI } from "@/lib/hooks/useOfferContentAI";

/**
 * Offer Manager Express Template
 *
 * Simplified skateboard version for quick online offer creation
 * - Online-only redemption (external URL)
 * - US-only geography (hardcoded)
 * - Single static promo code only
 * - Single-page form (no stepper)
 * - Covers 80% of use cases
 */

interface OfferManagerViewExpressProps {
  onCreatingChange?: (isCreating: boolean) => void;
  autoStart?: boolean;
  onBackToDashboard?: () => void;
}

// Simplified validation for Express template (combined form)
const validateFormExpress = (formData: any): boolean => {
  // All required fields in one validation
  return !!(
    formData.merchant &&
    formData.offerSource &&
    formData.offerName?.trim() &&
    formData.description?.trim() &&
    formData.startDate?.trim() &&
    formData.termsConditions?.trim() &&
    formData.offerType?.trim() &&
    formData.externalUrl?.trim() &&
    formData.promoCode?.trim() &&
    formData.usageLimitPerCustomer?.trim()
  );
};

export default function OfferManagerViewExpress({
  onCreatingChange,
  autoStart = false,
  onBackToDashboard,
}: OfferManagerViewExpressProps = {}) {
  const [isFormValid, setIsFormValid] = useState(false);

  // Publish modal state
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Express Template Form data - simplified, only essential fields
  const [formData, setFormData] = useState({
    // Offer Details
    merchant: null, // Required - Select/create merchant
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

    // Redemption Method (hardcoded for Express)
    redemptionTypes: ["external_url"], // Hardcoded: online only
    promoCodeType: "single", // Hardcoded: static code only
    promoCode: "", // Required
    externalUrl: "", // Required

    // Usage limits
    usageLimitPerCustomer: "1", // Required
    locationScope: "all", // Hardcoded: online, no location restrictions

    // Hidden/hardcoded values (not exposed in UI)
    geography: "US", // Hardcoded
    channel: "online", // Hardcoded
  });

  // Initialize CopilotKit AI content generation
  useOfferContentAI({
    merchantName: formData.merchant?.label || formData.merchant,
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
  const handleConfirmPublish = async () => {
    setIsPublishing(true);
    setPublishError(null);

    try {
      console.log("Publishing Express offer:", formData);

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
                      <h3 className="font-medium">
                        Create Offer - Express Template
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Quick online offer creation
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
                    <CombinedOfferFormExpress
                      formData={formData}
                      onUpdate={handleFormUpdate}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Review Preview Panel - Right Column */}
        <div className="w-[400px] flex-shrink-0">
          <Card className="h-full overflow-hidden shadow-md rounded-r-lg">
            <ReviewPreviewPanel formData={formData} currentStep="details" />
          </Card>
        </div>
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
                <div className="space-y-4">
                  <p>
                    You are about to publish{" "}
                    <strong>{formData.offerName || "this offer"}</strong> using
                    the Express template.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-sm text-blue-900">
                      <strong>Express Template Settings:</strong>
                    </p>
                    <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
                      <li>Online redemption only (US)</li>
                      <li>Single static promo code: {formData.promoCode}</li>
                      <li>Redirect URL: {formData.externalUrl}</li>
                    </ul>
                  </div>
                  <p className="text-sm text-gray-600">
                    Are you sure you want to continue?
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            {publishSuccess ? null : publishError ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPublishModal(false);
                    setPublishError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmPublish}
                  disabled={isPublishing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isPublishing ? "Retrying..." : "Try Again"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowPublishModal(false)}
                  disabled={isPublishing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmPublish}
                  disabled={isPublishing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isPublishing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Confirm & Publish
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
