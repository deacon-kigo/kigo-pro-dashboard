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
} from "@/components/atoms/Select";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  PhotoIcon,
  MagnifyingGlassPlusIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@/components/ui/use-toast";
import { ReceiptStatusBadge } from "@/components/molecules/badges";
import {
  MemberWithPoints,
  ManualReviewDecision,
  ManualReviewResponse,
  REJECTION_REASONS,
  Promotion,
  Receipt,
} from "./types";
import { formatPoints, formatUsdCents, formatDate } from "./utils";
import { getPromotionsByProgram, getReceiptById } from "./data";
import ReceiptViewer from "./ReceiptViewer";

interface ManualReviewModalProps {
  member: MemberWithPoints;
  receiptId: string;
  onClose: () => void;
  onSuccess: (response: ManualReviewResponse) => void;
}

/**
 * ManualReviewModal - Modal for manual review of receipt submissions
 * @classification organism
 * @description Allows agents to approve or reject receipt submissions with reason codes
 */
export default function ManualReviewModal({
  member,
  receiptId,
  onClose,
  onSuccess,
}: ManualReviewModalProps) {
  const { toast } = useToast();

  const balance = member.pointsBalance;
  const program = member.program;

  // View state - 'form' | 'confirmation'
  const [currentView, setCurrentView] = useState<"form" | "confirmation">(
    "form"
  );

  const [decision, setDecision] = useState<ManualReviewDecision | null>(null);
  const [pointsAmount, setPointsAmount] = useState("");
  const [reasonCode, setReasonCode] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [receiptData, setReceiptData] = useState<Receipt | null>(null);
  const [isReceiptViewerOpen, setIsReceiptViewerOpen] = useState(false);
  const [availablePromotions, setAvailablePromotions] = useState<Promotion[]>(
    []
  );

  // Load receipt and promotions on mount
  useEffect(() => {
    const receipt = getReceiptById(receiptId);
    setReceiptData(receipt || null);

    const promotions = getPromotionsByProgram(program.id);
    setAvailablePromotions(promotions);

    // Pre-fill points from promotion if available
    if (promotions.length > 0) {
      setPointsAmount(promotions[0].rewardAmount.toString());
    }
  }, [receiptId, program.id]);

  const parsedPoints = parseInt(pointsAmount) || 0;

  const isFormValid =
    decision !== null &&
    (decision === "reject"
      ? reasonCode && notes.trim().length >= 10
      : parsedPoints > 0 && notes.trim().length >= 10);

  const reasonLabel =
    decision === "reject"
      ? REJECTION_REASONS.find((r) => r.value === reasonCode)?.label
      : undefined;

  const handleContinue = () => {
    if (!isFormValid) return;
    setCurrentView("confirmation");
  };

  const handleGoBack = () => {
    setCurrentView("form");
  };

  const handleConfirm = async () => {
    if (!isFormValid || !decision) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response: ManualReviewResponse = {
        success: true,
        receiptId,
        decision,
        pointsAwarded: decision === "approve" ? parsedPoints : undefined,
        newBalancePoints:
          decision === "approve"
            ? balance.currentPoints + parsedPoints
            : balance.currentPoints,
        newBalanceUsdCents:
          decision === "approve"
            ? Math.round(
                ((balance.currentPoints + parsedPoints) /
                  balance.conversionRate) *
                  100
              )
            : balance.currentUsdCents,
        message:
          decision === "approve"
            ? "Receipt approved successfully"
            : "Receipt rejected",
        reasonCode: decision === "reject" ? reasonCode : undefined,
        notes,
        reviewedAt: new Date().toISOString(),
      };

      onSuccess(response);

      toast({
        title: decision === "approve" ? "Receipt Approved" : "Receipt Rejected",
        description:
          decision === "approve"
            ? `Added ${formatPoints(parsedPoints)} points to ${member.fullName}'s account`
            : `Receipt rejected: ${reasonLabel}`,
        variant: "default",
      });

      handleClose();
    } catch (err: any) {
      setError(err.message || "Failed to process review. Please try again.");
      setIsSubmitting(false);
      setCurrentView("form");
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setDecision(null);
      setPointsAmount("");
      setReasonCode("");
      setNotes("");
      setError("");
      setCurrentView("form");
      onClose();
    }
  };

  // Confirmation View
  if (currentView === "confirmation" && decision) {
    return (
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {decision === "approve"
                ? "Confirm Approval"
                : "Confirm Rejection"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Review details before confirming • Step 2 of 2
            </DialogDescription>
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1.5 flex-1 bg-primary rounded-full transition-all"></div>
              <div className="h-1.5 flex-1 bg-primary rounded-full transition-all"></div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-5">
              {/* Decision Summary with color-coded backgrounds */}
              <div
                className={`border-l-4 ${decision === "approve" ? "border-green-500 bg-gradient-to-br from-green-50/50 to-white" : "border-red-500 bg-gradient-to-br from-red-50/50 to-white"} border border-gray-200 rounded-lg p-4 shadow-sm`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {decision === "approve" ? (
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircleIcon className="h-8 w-8 text-red-600" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {decision === "approve"
                        ? "Approving Receipt"
                        : "Rejecting Receipt"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {decision === "approve"
                        ? `${formatPoints(parsedPoints)} will be added to member's account`
                        : "No points will be awarded"}
                    </p>
                  </div>
                </div>

                {decision === "approve" && (
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                        Points to Award
                      </p>
                      <p className="text-xl font-bold text-green-700">
                        {formatPoints(parsedPoints)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                        USD Value
                      </p>
                      <p className="text-xl font-bold text-green-700">
                        {formatUsdCents(
                          Math.round(
                            (parsedPoints / balance.conversionRate) * 100
                          )
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {decision === "reject" && reasonLabel && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                      Rejection Reason
                    </p>
                    <p className="text-sm font-semibold text-red-700">
                      {reasonLabel}
                    </p>
                  </div>
                )}
              </div>

              {/* Receipt & Member Info */}
              {receiptData && (
                <div className="border-l-4 border-primary bg-gradient-to-br from-blue-50/50 to-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Receipt Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                        Merchant
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {receiptData.merchantName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                        Amount
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatUsdCents(
                          Math.round(receiptData.totalAmount * 100)
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                        Member
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {member.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                        Program
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {balance.displayNamePrefix} {balance.displayName}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {notes && (
                <div className="border-l-4 border-primary bg-gradient-to-br from-blue-50/50 to-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
                    Notes
                  </h3>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t">
            <div className="flex items-center justify-between w-full">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoBack}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Go Back
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className={
                  decision === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }
              >
                {isSubmitting
                  ? "Processing..."
                  : decision === "approve"
                    ? "Confirm Approval"
                    : "Confirm Rejection"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Form View
  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Manual Review - Receipt Submission
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Review the receipt and decide whether to approve or reject • Step 1
            of 2
          </DialogDescription>
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 flex-1 bg-primary rounded-full transition-all"></div>
            <div className="h-1.5 flex-1 bg-gray-200 rounded-full transition-all"></div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form className="space-y-5">
            {/* Receipt Image Preview */}
            {receiptData && (
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
                    onClick={() => setIsReceiptViewerOpen(true)}
                    className="flex items-center gap-1 text-sm font-semibold"
                  >
                    <MagnifyingGlassPlusIcon className="h-4 w-4" />
                    View Full Receipt
                  </Button>
                </div>

                <div className="flex gap-4">
                  {/* Receipt Thumbnail */}
                  <div
                    className="flex-shrink-0 w-24 h-32 bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setIsReceiptViewerOpen(true)}
                  >
                    <img
                      src={receiptData.imageUrl}
                      alt={`Receipt from ${receiptData.merchantName}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Receipt Details */}
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                        Merchant
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {receiptData.merchantName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                        Date
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(receiptData.uploadedAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                        Total Amount
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatUsdCents(
                          Math.round(receiptData.totalAmount * 100)
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                        Status
                      </p>
                      <ReceiptStatusBadge
                        status={receiptData.verificationStatus}
                        size="sm"
                      />
                    </div>
                    {receiptData.campaignName && (
                      <div className="col-span-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                          Campaign
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {receiptData.campaignName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Promotion Rules */}
            {availablePromotions.length > 0 && (
              <div className="border-l-4 border-primary bg-gradient-to-br from-blue-50/50 to-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-3">
                  Promotion Rules
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">Promotion:</span>{" "}
                    {availablePromotions[0].name}
                  </p>
                  <p className="text-sm text-gray-600">
                    • {availablePromotions[0].description}
                  </p>
                  <p className="text-sm text-gray-600">
                    • Conversion: {balance.conversionRate} points = $1
                  </p>
                </div>
              </div>
            )}

            {/* Review Decision */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">
                Review Decision *
              </Label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="decision"
                    value="approve"
                    checked={decision === "approve"}
                    onChange={() => setDecision("approve")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-900">Approve</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="decision"
                    value="reject"
                    checked={decision === "reject"}
                    onChange={() => setDecision("reject")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-900">Reject</span>
                </label>
              </div>
            </div>

            {/* Conditional Fields Based on Decision */}
            {decision === "approve" && (
              <div className="space-y-2">
                <Label
                  htmlFor="points"
                  className="text-sm font-semibold text-gray-900"
                >
                  Points to Award*
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="points"
                    type="number"
                    min="1"
                    value={pointsAmount}
                    onChange={(e) => setPointsAmount(e.target.value)}
                    placeholder="Enter points amount"
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-700">pts</span>
                </div>
                <p className="text-sm text-gray-500">
                  Conversion: {balance.conversionRate} points = $1
                </p>
              </div>
            )}

            {decision === "reject" && (
              <div className="space-y-2">
                <Label
                  htmlFor="reason"
                  className="text-sm font-semibold text-gray-900"
                >
                  Rejection Reason*
                </Label>
                <Select value={reasonCode} onValueChange={setReasonCode}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select rejection reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {REJECTION_REASONS.map((reason) => (
                      <SelectItem
                        key={reason.value}
                        value={reason.value}
                        className="cursor-pointer"
                      >
                        <div className="py-1">
                          <div className="font-medium text-gray-900">
                            {reason.label}
                          </div>
                          <div className="text-sm text-gray-500">
                            {reason.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Notes */}
            {decision && (
              <div className="space-y-2">
                <Label
                  htmlFor="notes"
                  className="text-sm font-semibold text-gray-900"
                >
                  Notes*{" "}
                  <span className="text-sm font-normal text-gray-600">
                    (min 10 characters)
                  </span>
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this review decision..."
                  rows={3}
                  className="resize-none"
                />
                <p className="text-sm text-gray-500">
                  {notes.length}/10 characters minimum
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </form>
        </div>

        {/* Footer Buttons */}
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

      {/* Receipt Viewer Modal */}
      {isReceiptViewerOpen && receiptData && (
        <ReceiptViewer
          receiptId={receiptData.id}
          onClose={() => setIsReceiptViewerOpen(false)}
        />
      )}
    </Dialog>
  );
}
