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
import { ReceiptStatusBadge } from "@/components/molecules/badges";
import { getReceiptById } from "./data";
import { formatDate, getMockReceiptImageUrl, formatUsdCents } from "./utils";

interface ReceiptViewerProps {
  receiptId: string;
  onClose: () => void;
}

/**
 * ReceiptViewer component - Simplified modal for viewing receipt images
 * @classification organism
 * @description Displays large receipt image with minimal metadata (same as preview card)
 */
export default function ReceiptViewer({
  receiptId,
  onClose,
}: ReceiptViewerProps) {
  const receipt = getReceiptById(receiptId);

  if (!receipt) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Receipt Not Found
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              The receipt with ID {receiptId} could not be found.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="primary" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const imageUrl = getMockReceiptImageUrl(receiptId);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Receipt Image
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {receipt.merchantName} • {formatDate(receipt.uploadedAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {/* Receipt Image - Large and centered */}
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
              <img
                src={imageUrl}
                alt={`Receipt from ${receipt.merchantName}`}
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
                    {receipt.merchantName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(receipt.uploadedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Total Amount
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatUsdCents(Math.round(receipt.totalAmount * 100))}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Status
                  </p>
                  <ReceiptStatusBadge
                    status={receipt.verificationStatus}
                    size="sm"
                  />
                </div>
                {receipt.campaignName && (
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Campaign
                    </p>
                    <p className="text-sm text-gray-900">
                      {receipt.campaignName}
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

        <DialogFooter className="border-t border-gray-200 pt-4">
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
