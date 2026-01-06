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
  TagIcon,
  ReceiptRefundIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useToast } from "@/components/ui/use-toast";
import {
  MemberWithPoints,
  PointsAdjustmentResponse,
  ADJUSTMENT_REASONS,
  Promotion,
  Receipt,
} from "./types";
import {
  formatPoints,
  formatUsdCents,
  getAdjustmentReasonLabel,
  formatDate,
  getMockReceiptImageUrl,
} from "./utils";
import { getPromotionsByProgram, sampleReceipts } from "./data";
import ReceiptViewer from "./ReceiptViewer";
import PointsAdjustmentConfirmationModal from "./PointsAdjustmentConfirmationModal";
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

  // Promotion state
  const [selectedPromotionId, setSelectedPromotionId] = useState<string>("");
  const [availablePromotions, setAvailablePromotions] = useState<Promotion[]>(
    []
  );

  // Receipt state
  const [selectedReceiptId, setSelectedReceiptId] = useState<string>(
    receiptId || ""
  );
  const [showReceiptViewer, setShowReceiptViewer] = useState(false);

  // Modal state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Get member's receipts
  const memberReceipts = sampleReceipts.filter(
    (r) => r.accountId === member.accountId
  );
  const selectedReceipt =
    selectedReceiptId && selectedReceiptId !== "none"
      ? memberReceipts.find((r) => r.id === selectedReceiptId) || null
      : null;

  // Load promotions on mount
  useEffect(() => {
    const promotions = getPromotionsByProgram(program.id);
    setAvailablePromotions(promotions);
  }, [program.id]);

  const parsedPoints = parseInt(pointsAmount) || 0;
  const isFormValid = parsedPoints > 0 && reason && notes.trim().length >= 10;

  const handleContinue = () => {
    if (!isFormValid) return;
    setShowConfirmation(true);
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

      // Get selected promotion name
      const selectedPromotion = availablePromotions.find(
        (p) => p.id === selectedPromotionId
      );
      const promotionName = selectedPromotion
        ? selectedPromotion.name
        : undefined;

      // Mock successful response
      const response: PointsAdjustmentResponse = {
        success: true,
        ledgerEntryId: `ldg-${Date.now()}`,
        pointsAdjusted: parsedPoints,
        newBalancePoints: newBalance,
        newBalanceUsdCents,
        displayName: `${balance.displayNamePrefix} ${balance.displayName}`,
        transactionDate: new Date().toISOString(),
        message: promotionName ? `Promotion: ${promotionName}` : undefined,
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
      setShowConfirmation(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setPointsAmount("");
      setReason("");
      setNotes("");
      setError("");
      setSelectedPromotionId("");
      setSelectedReceiptId("");
      setShowConfirmation(false);
      onClose();
    }
  };

  const handleGoBack = () => {
    setShowConfirmation(false);
  };

  // Get selected promotion details
  const selectedPromotion =
    selectedPromotionId && selectedPromotionId !== "none"
      ? availablePromotions.find((p) => p.id === selectedPromotionId)
      : undefined;

  if (showConfirmation) {
    return (
      <PointsAdjustmentConfirmationModal
        member={member}
        pointsToAdd={parsedPoints}
        reasonCode={reason}
        reasonLabel={getAdjustmentReasonLabel(reason)}
        notes={notes}
        receiptId={selectedReceiptId !== "none" ? selectedReceiptId : undefined}
        onGoBack={handleGoBack}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <>
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Adjust Points Balance
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Add points to {member.fullName}'s account with receipt
              verification
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-5 pr-1">
              {/* Receipt Preview Section */}
              {selectedReceipt && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                      <PhotoIcon className="h-4 w-4 mr-2" />
                      Receipt Preview
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReceiptViewer(true)}
                      className="flex items-center gap-1"
                    >
                      <MagnifyingGlassPlusIcon className="h-3.5 w-3.5" />
                      View Full Receipt
                    </Button>
                  </div>

                  <div className="flex gap-4">
                    {/* Receipt Thumbnail */}
                    <div
                      className="flex-shrink-0 w-24 h-32 bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setShowReceiptViewer(true)}
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
                </div>
              )}

              {/* Program Info with Conversion Rate */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      Program Information
                    </h3>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">
                        {balance.displayNamePrefix} {balance.displayName}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {program.partnerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-500">
                      Conversion Rate
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {balance.conversionRate} pts = $1.00
                    </p>
                  </div>
                </div>
              </div>

              {/* Promotion Rules (if selected) */}
              {selectedPromotion && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <TagIcon className="h-4 w-4 mr-2" />
                    Promotion Rules
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedPromotion.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedPromotion.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Reward Amount
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {selectedPromotion.rewardAmount > 0
                            ? formatPoints(selectedPromotion.rewardAmount)
                            : "Variable"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          USD Value
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {selectedPromotion.rewardAmount > 0
                            ? formatUsdCents(
                                Math.round(
                                  (selectedPromotion.rewardAmount /
                                    balance.conversionRate) *
                                    100
                                )
                              )
                            : "Variable"}
                        </p>
                      </div>
                    </div>
                    {/* Eligible Products Section (placeholder) */}
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Eligible Products
                      </p>
                      <p className="text-sm text-gray-600">
                        All qualifying products in category
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Points to Add */}
              <div className="space-y-2">
                <Label
                  htmlFor="points"
                  className="text-sm font-semibold text-gray-900"
                >
                  Points to Add *
                </Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PlusIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="points"
                      type="number"
                      min="1"
                      value={pointsAmount}
                      onChange={(e) => setPointsAmount(e.target.value)}
                      placeholder="Enter points amount"
                      className="pl-10"
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-700">
                      points
                    </span>
                    {parsedPoints > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5">
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
                <p className="text-xs text-gray-500 flex items-center">
                  <InformationCircleIcon className="h-3.5 w-3.5 mr-1" />
                  This action will add points only. Points cannot be subtracted
                  through this interface.
                </p>
              </div>

              {/* Receipt Selector */}
              <div className="space-y-2">
                <Label
                  htmlFor="receipt"
                  className="text-sm font-semibold text-gray-900"
                >
                  Related Receipt
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (optional)
                  </span>
                </Label>
                <Select
                  value={selectedReceiptId}
                  onValueChange={setSelectedReceiptId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a receipt to link">
                      {selectedReceipt
                        ? `${selectedReceipt.merchantName} - ${formatDate(selectedReceipt.uploadedAt)}`
                        : "No receipt selected"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="cursor-pointer">
                      <div className="py-1">
                        <div className="font-medium text-gray-900">
                          No Receipt
                        </div>
                        <div className="text-xs text-gray-500">
                          Adjustment not linked to a receipt
                        </div>
                      </div>
                    </SelectItem>
                    {memberReceipts.length > 0 ? (
                      memberReceipts.slice(0, 10).map((receipt) => (
                        <SelectItem
                          key={receipt.id}
                          value={receipt.id}
                          className="cursor-pointer"
                        >
                          <div className="py-1">
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                              {receipt.merchantName}
                              <ReceiptStatusBadge
                                status={receipt.verificationStatus}
                                size="sm"
                              />
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(receipt.uploadedAt)} •{" "}
                              {formatUsdCents(
                                Math.round(receipt.totalAmount * 100)
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-3 text-sm text-gray-500">
                        No receipts found for this member
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Promotion Selector */}
              <div className="space-y-2">
                <Label
                  htmlFor="promotion"
                  className="text-sm font-semibold text-gray-900"
                >
                  Related Promotion
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (optional)
                  </span>
                </Label>
                <Select
                  value={selectedPromotionId}
                  onValueChange={setSelectedPromotionId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a promotion">
                      {selectedPromotion
                        ? selectedPromotion.name
                        : "No promotion selected"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="cursor-pointer">
                      <div className="py-1">
                        <div className="font-medium text-gray-900">
                          No Promotion
                        </div>
                        <div className="text-xs text-gray-500">
                          Standard points adjustment
                        </div>
                      </div>
                    </SelectItem>
                    {availablePromotions.length > 0 ? (
                      availablePromotions.map((promo) => (
                        <SelectItem
                          key={promo.id}
                          value={promo.id}
                          className="cursor-pointer"
                        >
                          <div className="py-1">
                            <div className="font-medium text-gray-900">
                              {promo.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {promo.description} •{" "}
                              {promo.rewardAmount > 0
                                ? `${formatPoints(promo.rewardAmount)} pts`
                                : "Variable"}
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-3 text-sm text-gray-500">
                        No active promotions found
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Reason Code Dropdown */}
              <div className="space-y-2">
                <Label
                  htmlFor="reason"
                  className="text-sm font-semibold text-gray-900"
                >
                  Adjustment Reason *
                </Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="w-full">
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
                          <div className="font-medium text-gray-900">
                            {option.label}
                          </div>
                          <div className="text-xs text-gray-500">
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
                  className="text-sm font-semibold text-gray-900"
                >
                  Notes *
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide detailed notes for audit purposes..."
                  rows={3}
                  className="resize-none"
                  disabled={isSubmitting}
                />
                <div className="flex justify-between">
                  <p className="text-xs text-gray-500">
                    Minimum 10 characters required
                  </p>
                  <p
                    className={`text-xs ${notes.length >= 10 ? "text-green-600" : "text-gray-500"}`}
                  >
                    {notes.length}/10
                  </p>
                </div>
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

      {/* Receipt Viewer Modal */}
      {selectedReceipt && showReceiptViewer && (
        <ReceiptViewer
          receiptId={selectedReceipt.id}
          onClose={() => setShowReceiptViewer(false)}
        />
      )}
    </>
  );
}
