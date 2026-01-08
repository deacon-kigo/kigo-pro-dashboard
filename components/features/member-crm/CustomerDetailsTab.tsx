"use client";

import React, { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
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

  const balance = member.pointsBalance;
  const memberReceipts = sampleReceipts.filter(
    (r) => r.accountId === member.accountId
  );

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
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">
                      Receipt ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">
                      Receipt Submission Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">
                      Receipt Image
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">
                      Campaign Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">
                      Receipt Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">
                      Reason Code
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">
                      Dollar Amount Awarded
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
                          {/* Pending - Waiting for AI verification */}
                          {receipt.verificationStatus === "pending" && (
                            <span className="text-sm text-gray-500 italic">
                              Processing...
                            </span>
                          )}

                          {/* Manual Review - Needs agent review */}
                          {receipt.verificationStatus === "manual_review" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedReceiptForReview(receipt);
                                setShowManualReviewModal(true);
                              }}
                              className="text-yellow-700 border-yellow-300 hover:bg-yellow-50"
                            >
                              Review
                            </Button>
                          )}

                          {/* Approved (AI or Manual) - Can adjust if needed */}
                          {(receipt.verificationStatus === "approved" ||
                            receipt.verificationStatus ===
                              "manually_approved") &&
                            onOpenPointsAdjustment && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  onOpenPointsAdjustment(receipt.id)
                                }
                              >
                                Adjust Points
                              </Button>
                            )}

                          {/* Rejected (AI) - Can adjust/override if needed */}
                          {receipt.verificationStatus === "rejected" &&
                            onOpenPointsAdjustment && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  onOpenPointsAdjustment(receipt.id)
                                }
                              >
                                Override
                              </Button>
                            )}

                          {/* Manually Rejected - Final decision, no action */}
                          {receipt.verificationStatus ===
                            "manually_rejected" && (
                            <span className="text-sm text-gray-500">—</span>
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
