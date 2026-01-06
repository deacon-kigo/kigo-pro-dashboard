"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/molecules/dialog";
import { Button } from "@/components/atoms/Button/Button";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { MemberWithPoints, ManualReviewDecision } from "./types";
import { formatPoints, formatUsdCents } from "./utils";

interface ManualReviewConfirmationModalProps {
  member: MemberWithPoints;
  decision: ManualReviewDecision;
  pointsToAward?: number;
  reasonCode?: string;
  reasonLabel?: string;
  notes: string;
  onGoBack: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

/**
 * ManualReviewConfirmationModal - Confirmation screen before finalizing manual review
 * @classification organism
 * @description Shows review summary before committing the decision
 */
export default function ManualReviewConfirmationModal({
  member,
  decision,
  pointsToAward,
  reasonCode,
  reasonLabel,
  notes,
  onGoBack,
  onConfirm,
  isSubmitting,
}: ManualReviewConfirmationModalProps) {
  const balance = member.pointsBalance;
  const currentBalance = balance.currentPoints;
  const newBalance =
    decision === "approve" && pointsToAward
      ? currentBalance + pointsToAward
      : currentBalance;
  const usdValue = pointsToAward
    ? (pointsToAward / balance.conversionRate) * 100
    : 0;
  const newBalanceUsd = (newBalance / balance.conversionRate) * 100;

  return (
    <Dialog open={true} onOpenChange={onGoBack}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Confirm Manual Review
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Review the decision details before confirming
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Review Summary */}
          <div
            className={`border rounded-lg p-6 ${
              decision === "approve"
                ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                : "bg-gradient-to-br from-red-50 to-rose-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              {decision === "approve" ? (
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-600" />
              )}
              <h4 className="text-sm font-semibold text-gray-900">
                Decision: {decision === "approve" ? "APPROVED" : "REJECTED"}
              </h4>
            </div>

            {decision === "approve" && pointsToAward ? (
              <div className="space-y-3">
                {/* Points Added */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Points Added</p>
                  <p className="text-2xl font-bold text-green-700">
                    +{formatPoints(pointsToAward)}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    ({formatUsdCents(usdValue)})
                  </p>
                </div>

                {/* Balance Change */}
                <div className="pt-3 border-t border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Before</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatPoints(currentBalance)}
                      </p>
                    </div>
                    <div className="text-gray-400">→</div>
                    <div>
                      <p className="text-sm text-green-700 mb-1">After</p>
                      <p className="text-lg font-semibold text-green-800">
                        {formatPoints(newBalance)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {reasonLabel && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Rejection Reason
                    </p>
                    <p className="text-sm font-medium text-red-800">
                      {reasonLabel}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Notes</h4>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {notes}
              </p>
            </div>
          </div>

          {/* Program Info */}
          {decision === "approve" && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Program
              </h4>
              <p className="text-sm text-gray-900">
                {balance.displayNamePrefix} {balance.displayName}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {member.program.partnerName}
              </p>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onGoBack}
            disabled={isSubmitting}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button
            type="button"
            variant={decision === "approve" ? "primary" : "destructive"}
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Confirm {decision === "approve" ? "Approval" : "Rejection"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
