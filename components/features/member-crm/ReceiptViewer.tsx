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
import {
  CalendarIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { getReceiptById } from "./data";
import { formatDateTime, getMockReceiptImageUrl, formatPoints } from "./utils";

interface ReceiptViewerProps {
  receiptId: string;
  onClose: () => void;
}

/**
 * ReceiptViewer component - Modal for viewing receipt images and details
 * @classification organism
 * @description Displays receipt image and metadata for verification
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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Receipt Details
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Review receipt information and image
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Left Column - Receipt Image */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Receipt Image
                </h3>
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={imageUrl}
                    alt="Receipt"
                    className="w-full h-auto"
                    style={{ maxHeight: "600px", objectFit: "contain" }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Use browser zoom (Ctrl/Cmd +/-) to view details
                </p>
              </div>
            </div>

            {/* Right Column - Receipt Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Receipt Information
                </h3>

                <div className="space-y-3">
                  {/* Status Badge */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Status
                    </p>
                    <ReceiptStatusBadge status={receipt.verificationStatus} />
                  </div>

                  {/* Merchant */}
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-start">
                      <BuildingStorefrontIcon className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Merchant
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {receipt.merchantName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-start">
                      <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Total Amount
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          ${receipt.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Upload Date */}
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-start">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Uploaded
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatDateTime(receipt.uploadedAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Points Awarded (for approved receipts) */}
                  {receipt.verificationStatus === "approved" &&
                    receipt.actionAmount && (
                      <div className="border-t border-gray-100 pt-3">
                        <div className="flex items-start">
                          <CheckCircleIcon className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 mb-1">
                              Points Awarded
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatPoints(receipt.actionAmount)}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              ≈ ${(receipt.actionAmount / 100).toFixed(2)} value
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
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
