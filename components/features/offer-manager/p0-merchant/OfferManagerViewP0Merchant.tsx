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
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import CombinedOfferFormP0Merchant from "./CombinedOfferFormP0Merchant";

/**
 * Offer Manager P0 Merchant Creation
 *
 * This iteration adds inline merchant creation during the offer creation flow.
 * URL: /offer-manager?version=p0-merchant
 *
 * Features:
 * - Inline merchant creation with Google Places autocomplete for address
 * - Google Search suggestions for merchant URL
 * - All P0 offer creation features
 */

interface OfferManagerViewP0MerchantProps {
  onCreatingChange?: (isCreating: boolean) => void;
  autoStart?: boolean;
  onBackToDashboard?: () => void;
}

// Simplified validation for Express template (combined form)
const validateFormExpress = (formData: any): boolean => {
  return !!(
    (formData.merchant?.trim() || formData.merchantData) && // Merchant selected OR created
    formData.offerSource &&
    formData.offerName?.trim() &&
    formData.description?.trim() &&
    formData.startDate?.trim() &&
    formData.termsConditions?.trim() &&
    formData.offerType?.trim() &&
    formData.discountValue?.trim() &&
    formData.externalUrl?.trim() &&
    formData.promoCode?.trim() &&
    formData.usageLimitPerCustomer?.trim() &&
    formData.redemptionRollingPeriod?.trim()
  );
};

export default function OfferManagerViewP0Merchant({
  onCreatingChange,
  autoStart = false,
  onBackToDashboard,
}: OfferManagerViewP0MerchantProps = {}) {
  const [isFormValid, setIsFormValid] = useState(false);

  // Publish modal state
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Form data - includes merchantData for newly created merchants
  const [formData, setFormData] = useState({
    // Merchant
    merchant: "",
    merchantData: null as any, // Stores created merchant data

    // Offer Details
    offerSource: null,
    offerName: "",
    shortText: "",
    description: "",
    longText: "",
    startDate: "",
    endDate: "",
    termsConditions: "",

    // Classification
    offerType: "",
    discountValue: "",
    maxDiscountAmount: "",
    category_ids: [] as string[],
    commodity_ids: [] as string[],

    // Redemption Method
    redemptionTypes: ["external_url"],
    promoCodeType: "single",
    promoCode: "",
    externalUrl: "",

    // Usage limits
    usageLimitPerCustomer: "1",
    redemptionRollingPeriod: "",
    locationScope: "all",

    // Hidden/hardcoded values
    geography: "US",
    channel: "online",
  });

  // Track validation state
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
          ? "Creating and publishing offer with merchant:"
          : "Creating offer without publishing:",
        formData
      );

      // Log merchant data if newly created
      if (formData.merchantData) {
        console.log("New merchant to be created:", formData.merchantData);
      }

      // TODO: Replace with actual API calls
      // 1. If merchantData exists, create merchant first
      // 2. Then create offer with merchant ID

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setPublishSuccess(true);
      setIsPublishing(false);

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
        {/* Main Content Area */}
        <div className="flex-1">
          <div className="h-full">
            <div className="w-full h-full flex flex-col">
              <Card className="p-0 flex flex-col h-full overflow-hidden shadow-md">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
                  <div className="flex items-center">
                    {onBackToDashboard && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackToDashboard}
                        className="mr-2"
                      >
                        <ArrowLeftIcon className="h-4 w-4" />
                      </Button>
                    )}
                    <GiftIcon className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <h3 className="font-medium">Create Offer</h3>
                      <p className="text-sm text-muted-foreground">
                        Find your business and create an offer
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
                    <CombinedOfferFormP0Merchant
                      formData={formData}
                      onUpdate={handleFormUpdate}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
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
                    {formData.merchantData
                      ? "New merchant and offer have been created and published!"
                      : "Your offer has been published and is now live!"}
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
                  {formData.merchantData && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800 font-medium">
                        A new merchant will be created:
                      </p>
                      <p className="text-sm text-blue-700">
                        {formData.merchantData.dbaName} (
                        {formData.merchantData.corpName})
                      </p>
                    </div>
                  )}
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
