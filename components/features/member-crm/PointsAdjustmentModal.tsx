"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/molecules/dialog";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ExclamationCircleIcon,
  PlusIcon,
  PhotoIcon,
  MagnifyingGlassPlusIcon,
  InformationCircleIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@/components/ui/use-toast";
import {
  MemberWithPoints,
  PointsAdjustmentResponse,
  ADJUSTMENT_REASONS,
} from "./types";
import {
  formatPoints,
  formatUsdCents,
  getAdjustmentReasonLabel,
  formatDate,
  getMockReceiptImageUrl,
} from "./utils";
import { sampleReceipts } from "./data";
import { ReceiptStatusBadge } from "@/components/molecules/badges";

interface PointsAdjustmentModalProps {
  member: MemberWithPoints;
  receiptId?: string; // Initial receipt to select
  onClose: () => void;
  onSuccess: (response: PointsAdjustmentResponse) => void;
}

/**
 * PointsAdjustmentModal - Enhanced modal for adding points with receipt preview
 * @classification organism
 * @description Allows agents to add points with receipt verification, promotion rules, and detailed notes
 */
export default function PointsAdjustmentModal({
  member,
  receiptId,
  onClose,
  onSuccess,
}: PointsAdjustmentModalProps) {
  const { toast } = useToast();

  // Single program per record - no selection needed
  const balance = member.pointsBalance;
  const program = member.program;

  // Form state
  const [pointsAmount, setPointsAmount] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  // Receipt state
  const [selectedReceiptId, setSelectedReceiptId] = useState<string>(
    receiptId || ""
  );

  // View state - 'form' | 'receipt' | 'confirmation'
  const [currentView, setCurrentView] = useState<
    "form" | "receipt" | "confirmation"
  >("form");

  // Modal state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Get member's receipts
  const memberReceipts = sampleReceipts.filter(
    (r) => r.accountId === member.accountId
  );
  const selectedReceipt =
    selectedReceiptId && selectedReceiptId !== "none"
      ? memberReceipts.find((r) => r.id === selectedReceiptId) || null
      : null;

  const parsedPoints = parseInt(pointsAmount) || 0;
  const isFormValid = parsedPoints > 0 && reason;

  const handleContinue = () => {
    if (!isFormValid) return;
    setCurrentView("confirmation");
  };

  const handleConfirm = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newBalance = balance.currentPoints + parsedPoints;
      const newBalanceUsdCents = Math.round(
        (newBalance / balance.conversionRate) * 100
      );

      // Mock successful response
      const response: PointsAdjustmentResponse = {
        success: true,
        ledgerEntryId: `ldg-${Date.now()}`,
        pointsAdjusted: parsedPoints,
        newBalancePoints: newBalance,
        newBalanceUsdCents,
        displayName: `${balance.displayNamePrefix} ${balance.displayName}`,
        transactionDate: new Date().toISOString(),
      };

      onSuccess(response);

      // Show success toast with details
      toast({
        title: "Points Adjusted Successfully",
        description: `Added ${formatPoints(parsedPoints)} points • New balance: ${formatPoints(newBalance)}`,
        variant: "default",
      });

      handleClose();
    } catch (err: any) {
      setError(
        err.message || "Failed to process adjustment. Please try again."
      );
      setIsSubmitting(false);
      setCurrentView("form");
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setPointsAmount("");
      setReason("");
      setNotes("");
      setError("");
      setSelectedReceiptId("");
      setCurrentView("form");
      onClose();
    }
  };

  const handleGoBack = () => {
    setCurrentView("form");
  };

  const handleViewReceipt = () => {
    if (selectedReceipt) {
      setCurrentView("receipt");
    }
  };

  const handleBackToForm = () => {
    setCurrentView("form");
  };

  // Calculate preview values
  const currentBalance = balance.currentPoints;
  const newBalancePoints = currentBalance + parsedPoints;
  const usdValue = (parsedPoints / balance.conversionRate) * 100;
  const newBalanceUsd = (newBalancePoints / balance.conversionRate) * 100;

  // Render Confirmation View
  if (currentView === "confirmation") {
    return (
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Confirm Points Adjustment
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Review details before confirming • Step 2 of 2
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-5">
              {/* Progress Indicator */}
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1.5 flex-1 bg-primary rounded-full transition-all"></div>
                <div className="h-1.5 flex-1 bg-primary rounded-full transition-all"></div>
              </div>

              {/* Balance Preview */}
              <div className="border-l-4 border-primary bg-gradient-to-br from-blue-50/50 to-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-4 flex items-center gap-2">
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                  Balance Preview
                </h4>

                <div className="space-y-4">
                  {/* Before → After */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
                        Current Balance
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatPoints(currentBalance)}
                      </p>
                      <p className="text-sm font-medium text-gray-600 mt-1">
                        {formatUsdCents(balance.currentUsdCents)}
                      </p>
                    </div>

                    <div className="flex items-center px-4">
                      <div className="text-2xl text-gray-400 font-light">→</div>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
                        New Balance
                      </p>
                      <p className="text-3xl font-bold text-blue-900">
                        {formatPoints(newBalancePoints)}
                      </p>
                      <p className="text-sm font-medium text-gray-600 mt-1">
                        {formatUsdCents(newBalanceUsd)}
                      </p>
                    </div>
                  </div>

                  {/* Change Amount */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium uppercase tracking-wide text-gray-500">
                        Points Added
                      </span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-700">
                          +{formatPoints(parsedPoints)}
                        </p>
                        <p className="text-sm font-medium text-gray-600">
                          (+{formatUsdCents(usdValue)})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adjustment Details */}
              <div className="border-l-4 border-primary bg-gradient-to-br from-blue-50/50 to-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h4 className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-4">
                  Adjustment Details
                </h4>

                <div className="space-y-4">
                  {/* Reason Code */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                      Reason Code
                    </p>
                    <p className="text-base font-bold text-gray-900">
                      {getAdjustmentReasonLabel(reason)}
                    </p>
                  </div>

                  {/* Notes */}
                  {notes && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                        Notes
                      </p>
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">
                          {notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Program */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                      Program
                    </p>
                    <p className="text-base font-bold text-gray-900">
                      {balance.displayNamePrefix} {balance.displayName}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {program.partnerName}
                    </p>
                  </div>

                  {/* Linked Receipt */}
                  {selectedReceipt && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
                        Linked Receipt
                      </p>
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-500">Merchant</p>
                            <p className="text-sm font-bold text-gray-900">
                              {selectedReceipt.merchantName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="text-sm font-bold text-gray-900">
                              {formatDate(selectedReceipt.uploadedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoBack}
              disabled={isSubmitting}
              className="text-base font-semibold"
            >
              ← Go Back
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="text-base font-semibold"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Confirm Adjustment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Render Receipt View
  if (currentView === "receipt" && selectedReceipt) {
    const imageUrl = getMockReceiptImageUrl(selectedReceipt.id);

    return (
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Receipt Image
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {selectedReceipt.merchantName} •{" "}
              {formatDate(selectedReceipt.uploadedAt)}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {/* Receipt Image - Large and centered */}
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <img
                  src={imageUrl}
                  alt={`Receipt from ${selectedReceipt.merchantName}`}
                  className="w-full h-auto"
                  style={{ maxHeight: "70vh", objectFit: "contain" }}
                />
              </div>

              {/* Receipt Metadata - Same structure as preview card */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Merchant
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedReceipt.merchantName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Date
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(selectedReceipt.uploadedAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Total Amount
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatUsdCents(
                        Math.round(selectedReceipt.totalAmount * 100)
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Status
                    </p>
                    <ReceiptStatusBadge
                      status={selectedReceipt.verificationStatus}
                      size="sm"
                    />
                  </div>
                  {selectedReceipt.campaignName && (
                    <div className="col-span-2">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Campaign
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedReceipt.campaignName}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Use browser zoom (Ctrl/Cmd +/-) to view receipt details
              </p>
            </div>
          </div>

          <DialogFooter className="border-t border-gray-200 pt-4 flex gap-3">
            <Button variant="outline" onClick={handleBackToForm}>
              ← Back to Form
            </Button>
            <Button variant="primary" onClick={handleBackToForm}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Render Form View
  return (
    <>
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Adjust Points Balance
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Add points to {member.fullName}'s account • Step 1 of 2
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-5">
              {/* Progress Indicator */}
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 bg-primary rounded-full transition-all"></div>
                <div className="h-1.5 flex-1 bg-gray-200 rounded-full transition-all"></div>
              </div>

              {/* Receipt Preview Section */}
              {selectedReceipt && (
                <div className="border-l-4 border-primary bg-gradient-to-br from-blue-50/50 to-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500 flex items-center">
                      <PhotoIcon className="h-4 w-4 mr-2" />
                      Receipt Preview
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleViewReceipt}
                      className="flex items-center gap-1 text-sm font-semibold"
                    >
                      <MagnifyingGlassPlusIcon className="h-4 w-4" />
                      View Full Receipt
                    </Button>
                  </div>

                  <div className="flex gap-4">
                    {/* Receipt Thumbnail */}
                    <div
                      className="flex-shrink-0 w-24 h-32 bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm cursor-pointer hover:border-blue-500 transition-all"
                      onClick={handleViewReceipt}
                    >
                      <img
                        src={getMockReceiptImageUrl(selectedReceipt.id)}
                        alt={`Receipt from ${selectedReceipt.merchantName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Receipt Details */}
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                          Merchant
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          {selectedReceipt.merchantName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                          Date
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          {formatDate(selectedReceipt.uploadedAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                          Total Amount
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          {formatUsdCents(
                            Math.round(selectedReceipt.totalAmount * 100)
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                          Status
                        </p>
                        <ReceiptStatusBadge
                          status={selectedReceipt.verificationStatus}
                          size="sm"
                        />
                      </div>
                      {selectedReceipt.campaignName && (
                        <div className="col-span-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                            Campaign
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedReceipt.campaignName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Program Info with Conversion Rate */}
              <div className="border-l-4 border-primary bg-gradient-to-br from-blue-50/50 to-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
                      Program Information
                    </h3>
                    <p className="text-base font-semibold text-gray-900">
                      {balance.displayNamePrefix} {balance.displayName}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {program.partnerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                      Conversion Rate
                    </p>
                    <p className="text-base font-bold text-gray-900">
                      {balance.conversionRate} pts = $1.00
                    </p>
                  </div>
                </div>
              </div>

              {/* Points to Add */}
              <div className="space-y-2">
                <Label
                  htmlFor="points"
                  className="text-base font-semibold text-gray-900"
                >
                  Points to Add *
                </Label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PlusIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="points"
                      type="number"
                      min="1"
                      value={pointsAmount}
                      onChange={(e) => setPointsAmount(e.target.value)}
                      placeholder="Enter points amount"
                      className="pl-10 text-base font-semibold"
                    />
                  </div>
                  <div className="text-right min-w-[90px]">
                    <span className="text-base font-bold text-gray-900">
                      points
                    </span>
                    {parsedPoints > 0 && (
                      <p className="text-sm font-medium text-gray-600 mt-0.5">
                        ={" "}
                        {formatUsdCents(
                          Math.round(
                            (parsedPoints / balance.conversionRate) * 100
                          )
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 flex items-center mt-2">
                  <InformationCircleIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                  This action will add points only. Points cannot be subtracted
                  through this interface.
                </p>
              </div>

              {/* Reason Code Dropdown */}
              <div className="space-y-2">
                <Label
                  htmlFor="reason"
                  className="text-base font-semibold text-gray-900"
                >
                  Adjustment Reason *
                </Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="w-full text-base">
                    <SelectValue placeholder="Select a reason code">
                      {reason && getAdjustmentReasonLabel(reason)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ADJUSTMENT_REASONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="cursor-pointer"
                      >
                        <div className="py-1">
                          <div className="font-semibold text-gray-900">
                            {option.label}
                          </div>
                          <div className="text-sm text-gray-600">
                            {option.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="notes"
                  className="text-base font-semibold text-gray-900"
                >
                  Notes
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes for this adjustment..."
                  rows={3}
                  className="resize-none text-base"
                  disabled={isSubmitting}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleContinue}
              disabled={!isFormValid || isSubmitting}
            >
              Continue →
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
