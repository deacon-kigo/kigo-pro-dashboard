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
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { MemberWithPoints } from "./types";
import { formatPoints, formatUsdCents, formatDate } from "./utils";
import { sampleReceipts } from "./data";

interface PointsAdjustmentConfirmationModalProps {
  member: MemberWithPoints;
  pointsToAdd: number;
  reasonCode: string;
  reasonLabel: string;
  notes: string;
  receiptId?: string;
  onGoBack: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

/**
 * PointsAdjustmentConfirmationModal - Confirmation screen before finalizing adjustment
 * @classification organism
 * @description Shows balance preview and summary before committing the adjustment
 */
export default function PointsAdjustmentConfirmationModal({
  member,
  pointsToAdd,
  reasonCode,
  reasonLabel,
  notes,
  receiptId,
  onGoBack,
  onConfirm,
  isSubmitting,
}: PointsAdjustmentConfirmationModalProps) {
  const balance = member.pointsBalance;
  const currentBalance = balance.currentPoints;
  const newBalance = currentBalance + pointsToAdd;
  const usdValue = (pointsToAdd / balance.conversionRate) * 100;
  const newBalanceUsd = (newBalance / balance.conversionRate) * 100;

  // Get linked receipt if provided
  const linkedReceipt = receiptId
    ? sampleReceipts.find((r) => r.id === receiptId)
    : undefined;

  return (
    <Dialog open={true} onOpenChange={onGoBack}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Confirm Points Adjustment
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Review the adjustment details before confirming
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 py-4">
          {/* Balance Preview */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ArrowTrendingUpIcon className="h-4 w-4 text-blue-600" />
              Balance Preview
            </h4>

            <div className="space-y-3">
              {/* Before → After */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Before
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPoints(currentBalance)}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {formatUsdCents(balance.currentUsdCents)}
                  </p>
                </div>

                <div className="flex items-center">
                  <div className="h-px w-12 bg-gray-300"></div>
                  <div className="mx-2 text-gray-400">→</div>
                  <div className="h-px w-12 bg-gray-300"></div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    After
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatPoints(newBalance)}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {formatUsdCents(newBalanceUsd)}
                  </p>
                </div>
              </div>

              {/* Change Amount */}
              <div className="pt-3 border-t border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    Change
                  </span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-700">
                      +{formatPoints(pointsToAdd)}
                    </p>
                    <p className="text-xs text-gray-600">
                      (+{formatUsdCents(usdValue)})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Adjustment Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Adjustment Summary
            </h4>

            <div className="space-y-3">
              {/* Linked Receipt */}
              {linkedReceipt && (
                <div className="pb-3 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    Linked Receipt
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Merchant</p>
                        <p className="font-semibold text-gray-900">
                          {linkedReceipt.merchantName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(linkedReceipt.uploadedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reason Code */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Reason Code
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {reasonLabel}
                </p>
              </div>

              {/* Notes */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Notes</p>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {notes}
                  </p>
                </div>
              </div>

              {/* Program */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Program
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {balance.displayNamePrefix} {balance.displayName}
                </p>
                <p className="text-xs text-gray-600">
                  {member.program.partnerName}
                </p>
              </div>
            </div>
          </div>
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
            variant="primary"
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
                Confirm Adjustment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
