"use client";

import React, { useState, useMemo } from "react";
import {
  PhotoIcon,
  PlusCircleIcon,
  EyeIcon,
  ClockIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/atoms/Badge/Badge";
import { ReceiptStatusBadge } from "@/components/molecules/badges";
import { Button } from "@/components/atoms/Button/Button";
import { MemberWithPoints, Receipt } from "./types";
import { formatDate } from "./utils";
import { sampleReceipts } from "./data";
import ManualReviewModal from "./ManualReviewModal";

interface CustomerDetailsTabProps {
  member: MemberWithPoints;
  onReviewSuccess?: () => void;
  onOpenPointsAdjustment?: (receiptId: string) => void;
}

/**
 * CustomerDetailsTab - Wireframe implementation for Customer Details screen
 * Shows Customer Details table and Receipt Details table
 * @classification organism
 */
export default function CustomerDetailsTab({
  member,
  onReviewSuccess,
  onOpenPointsAdjustment,
}: CustomerDetailsTabProps) {
  const [showManualReviewModal, setShowManualReviewModal] = useState(false);
  const [selectedReceiptForReview, setSelectedReceiptForReview] =
    useState<Receipt | null>(null);
  const [sortField, setSortField] = useState<keyof Receipt | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const balance = member.pointsBalance;

  // Filter and sort receipts
  const memberReceipts = useMemo(() => {
    const filtered = sampleReceipts.filter(
      (r) => r.accountId === member.accountId
    );

    // Sort receipts - manual_review always comes first
    return filtered.sort((a, b) => {
      // Priority 1: manual_review receipts first
      const aIsManualReview = a.verificationStatus === "manual_review";
      const bIsManualReview = b.verificationStatus === "manual_review";

      if (aIsManualReview && !bIsManualReview) return -1;
      if (!aIsManualReview && bIsManualReview) return 1;

      // Priority 2: Apply column sorting if selected
      if (sortField) {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      }

      // Priority 3: Default to submission date (newest first)
      return (
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
    });
  }, [member.accountId, sortField, sortDirection]);

  // Flag indicator logic
  const receiptsWithStatus = member.transactions.filter(
    (txn) => txn.receiptId && txn.metadata?.verificationStatus
  );
  const hasManualReview = receiptsWithStatus.some(
    (txn) => txn.metadata?.verificationStatus === "manual_review"
  );
  const hasApproved = receiptsWithStatus.some(
    (txn) => txn.metadata?.verificationStatus === "approved"
  );

  const handleManualReviewSuccess = () => {
    setShowManualReviewModal(false);
    setSelectedReceiptForReview(null);
    onReviewSuccess?.();
  };

  const handleSort = (field: keyof Receipt) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getFlagIndicator = () => {
    if (hasManualReview) {
      return (
        <Badge
          className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
          useClassName
        >
          Manual Review Needed
        </Badge>
      );
    }
    if (hasApproved) {
      return (
        <Badge
          className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
          useClassName
        >
          Approved
        </Badge>
      );
    }
    return <span className="text-sm text-gray-500">No Receipts</span>;
  };

  return (
    <>
      <div className="space-y-6">
        {/* Customer Details Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Customer Details
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">
                    Account ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">
                    Account First Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">
                    Account Last Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">
                    Account Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">
                    Program Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">
                    Flag Indicator
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-sm font-mono text-gray-900">
                    {member.accountId}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {member.firstName}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {member.lastName}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {member.email}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {balance.displayNamePrefix} {balance.displayName}
                  </td>
                  <td className="py-4 px-4">{getFlagIndicator()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Receipt Details Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Receipt Details
          </h2>
          {memberReceipts.length === 0 ? (
            <div className="text-center py-12">
              <PhotoIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">No receipts submitted yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center gap-1">
                        Receipt ID
                        <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("uploadedAt")}
                    >
                      <div className="flex items-center gap-1">
                        Receipt Submission Date
                        <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">
                      Receipt Image
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("campaignName")}
                    >
                      <div className="flex items-center gap-1">
                        Campaign Name
                        <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("verificationStatus")}
                    >
                      <div className="flex items-center gap-1">
                        Receipt Status
                        <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("reasonCode")}
                    >
                      <div className="flex items-center gap-1">
                        Reason Code
                        <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </th>
                    <th
                      className="text-right py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("actionAmount")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Dollar Amount Awarded
                        <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {memberReceipts.map((receipt) => (
                    <tr
                      key={receipt.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {receipt.id}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(receipt.uploadedAt)}
                      </td>
                      <td className="py-3 px-4">
                        <img
                          src={receipt.imageUrl}
                          alt="Receipt thumbnail"
                          className="w-10 h-12 object-cover rounded border border-gray-200"
                        />
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {receipt.campaignName || "—"}
                      </td>
                      <td className="py-3 px-4">
                        <ReceiptStatusBadge
                          status={receipt.verificationStatus}
                          size="sm"
                        />
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {receipt.reasonCode || "—"}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-right text-gray-900">
                        {receipt.verificationStatus === "approved" &&
                        receipt.actionAmount
                          ? `$${(receipt.actionAmount / 100).toFixed(2)}`
                          : "—"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {/* Process - Pending receipts */}
                          {receipt.verificationStatus === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className="gap-1.5 text-gray-500 border-gray-300"
                            >
                              <ClockIcon className="h-4 w-4" />
                              Process
                            </Button>
                          )}

                          {/* Review - Manual review needed */}
                          {receipt.verificationStatus === "manual_review" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedReceiptForReview(receipt);
                                setShowManualReviewModal(true);
                              }}
                              className="gap-1.5 text-blue-700 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 hover:border-blue-400"
                            >
                              <EyeIcon className="h-4 w-4" />
                              Review
                            </Button>
                          )}

                          {/* Adjust Points - For approved/rejected receipts */}
                          {(receipt.verificationStatus === "approved" ||
                            receipt.verificationStatus ===
                              "manually_approved" ||
                            receipt.verificationStatus === "rejected") &&
                            onOpenPointsAdjustment && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  onOpenPointsAdjustment(receipt.id)
                                }
                                className="gap-1.5 text-green-700 border-green-300 bg-green-50 hover:bg-green-100 hover:text-green-800 hover:border-green-400"
                              >
                                <PlusCircleIcon className="h-4 w-4" />
                                Adjust Points
                              </Button>
                            )}

                          {/* No action for manually rejected */}
                          {receipt.verificationStatus ===
                            "manually_rejected" && (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Manual Review Modal */}
      {showManualReviewModal && selectedReceiptForReview && (
        <ManualReviewModal
          member={member}
          receiptId={selectedReceiptForReview.id}
          onClose={() => {
            setShowManualReviewModal(false);
            setSelectedReceiptForReview(null);
          }}
          onSuccess={handleManualReviewSuccess}
        />
      )}
    </>
  );
}
