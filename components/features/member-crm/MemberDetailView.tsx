"use client";

import React, { useState } from "react";
import {
  UserIcon,
  ArrowLeftIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentTextIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button/Button";
import {
  MemberWithPoints,
  PointsAdjustmentResponse,
  ManualReviewResponse,
} from "./types";
import PointsAdjustmentModal from "./PointsAdjustmentModal";
import ManualReviewModal from "./ManualReviewModal";
import PointsHistory from "./PointsHistory";
import ReceiptViewer from "./ReceiptViewer";
import CustomerDetailsTab from "./CustomerDetailsTab";
import { formatPoints, formatUsdCents, formatDate } from "./utils";
import { sampleReceipts } from "./data";
import { FEATURE_FLAGS, getDefaultTab } from "@/config/featureFlags";

interface MemberDetailViewProps {
  member: MemberWithPoints;
  onBack: () => void;
  onAdjustmentSuccess: (response: PointsAdjustmentResponse) => void;
}

/**
 * MemberDetailView - Two-panel layout for member details with tabs
 * @classification template
 */
export default function MemberDetailView({
  member,
  onBack,
  onAdjustmentSuccess,
}: MemberDetailViewProps) {
  const [currentTab, setCurrentTab] = useState<
    "profile" | "points" | "history" | "receipts" | "customer"
  >(getDefaultTab());
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustmentReceiptId, setAdjustmentReceiptId] = useState<
    string | undefined
  >();
  const [showManualReviewModal, setShowManualReviewModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [selectedReceiptForReview, setSelectedReceiptForReview] = useState<
    string | null
  >(null);

  // Single program per record
  const balance = member.pointsBalance;
  const program = member.program;

  // Get receipts for this member
  const memberReceipts = sampleReceipts.filter(
    (r) => r.accountId === member.accountId
  );

  const handleManualReviewSuccess = (response: ManualReviewResponse) => {
    console.log("Manual review completed:", response);
    setShowManualReviewModal(false);
    setSelectedReceiptForReview(null);
    // In production, would refresh member data here
  };

  return (
    <>
      <div className="flex gap-0 h-[calc(100vh-200px)]">
        {/* Side Navigation */}
        <div className="w-16 flex-shrink-0">
          <div className="h-full bg-white rounded-l-lg border border-r border-gray-200 shadow-sm flex flex-col">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="h-[61px] flex flex-col items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors border-b"
              title="Back to list"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="text-xs mt-1">Back</span>
            </button>

            {/* Tab Buttons */}
            {FEATURE_FLAGS.MEMBER_CUSTOMER_DETAILS_TAB && (
              <button
                onClick={() => setCurrentTab("customer")}
                className={`h-[61px] flex flex-col items-center justify-center transition-colors border-b ${
                  currentTab === "customer"
                    ? "bg-blue-50 text-blue-600 border-l-4 border-l-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                }`}
                title="Customer Details"
              >
                <RectangleStackIcon className="h-5 w-5" />
                <span className="text-xs mt-1">Customer</span>
              </button>
            )}

            {FEATURE_FLAGS.MEMBER_RECEIPTS_TAB && (
              <button
                onClick={() => setCurrentTab("receipts")}
                className={`h-[61px] flex flex-col items-center justify-center transition-colors border-b ${
                  currentTab === "receipts"
                    ? "bg-blue-50 text-blue-600 border-l-4 border-l-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                }`}
                title="Receipts"
              >
                <DocumentTextIcon className="h-5 w-5" />
                <span className="text-xs mt-1">Receipts</span>
              </button>
            )}

            {FEATURE_FLAGS.MEMBER_HISTORY_TAB && (
              <button
                onClick={() => setCurrentTab("history")}
                className={`h-[61px] flex flex-col items-center justify-center transition-colors border-b ${
                  currentTab === "history"
                    ? "bg-blue-50 text-blue-600 border-l-4 border-l-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                }`}
                title="History"
              >
                <ClockIcon className="h-5 w-5" />
                <span className="text-xs mt-1">History</span>
              </button>
            )}

            {FEATURE_FLAGS.MEMBER_POINTS_TAB && (
              <button
                onClick={() => setCurrentTab("points")}
                className={`h-[61px] flex flex-col items-center justify-center transition-colors border-b ${
                  currentTab === "points"
                    ? "bg-blue-50 text-blue-600 border-l-4 border-l-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                }`}
                title="Points"
              >
                <CurrencyDollarIcon className="h-5 w-5" />
                <span className="text-xs mt-1">Points</span>
              </button>
            )}

            {FEATURE_FLAGS.MEMBER_PROFILE_TAB && (
              <button
                onClick={() => setCurrentTab("profile")}
                className={`h-[61px] flex flex-col items-center justify-center transition-colors border-b ${
                  currentTab === "profile"
                    ? "bg-blue-50 text-blue-600 border-l-4 border-l-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                }`}
                title="Profile"
              >
                <UserIcon className="h-5 w-5" />
                <span className="text-xs mt-1">Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area - Two Panels */}
        <div className="flex-1 h-full">
          <Card className="p-0 flex flex-col h-full overflow-hidden shadow-md rounded-l-none border-l-0">
            {/* Header */}
            <div className="h-[61px] flex-shrink-0 border-b bg-gray-50 flex items-center justify-between p-3">
              <div className="flex items-center">
                {currentTab === "profile" && (
                  <UserIcon className="h-5 w-5 mr-2 text-blue-500" />
                )}
                {currentTab === "points" && (
                  <CurrencyDollarIcon className="h-5 w-5 mr-2 text-blue-500" />
                )}
                {currentTab === "history" && (
                  <ClockIcon className="h-5 w-5 mr-2 text-blue-500" />
                )}
                {currentTab === "receipts" && (
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-500" />
                )}
                {currentTab === "customer" && (
                  <RectangleStackIcon className="h-5 w-5 mr-2 text-blue-500" />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">
                    {currentTab === "profile" && "Member Profile"}
                    {currentTab === "points" && "Points Management"}
                    {currentTab === "history" && "Transaction History"}
                    {currentTab === "receipts" && "Receipt Submissions"}
                    {currentTab === "customer" && "Customer Details"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentTab === "profile" &&
                      `${member.fullName} • ${member.email}`}
                    {currentTab === "points" &&
                      "Adjust points and view balance"}
                    {currentTab === "history" &&
                      "All transactions and receipts"}
                    {currentTab === "receipts" &&
                      "Review and manage receipt submissions"}
                    {currentTab === "customer" &&
                      "Customer info and receipt details"}
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto p-4">
              {FEATURE_FLAGS.MEMBER_CUSTOMER_DETAILS_TAB &&
                currentTab === "customer" && (
                  <CustomerDetailsTab
                    member={member}
                    onReviewSuccess={() => {
                      // Refresh member data in production
                      console.log(
                        "Receipt review completed, refreshing member data"
                      );
                    }}
                    onOpenPointsAdjustment={(receiptId) => {
                      setAdjustmentReceiptId(receiptId);
                      setShowAdjustModal(true);
                    }}
                  />
                )}

              {FEATURE_FLAGS.MEMBER_PROFILE_TAB && currentTab === "profile" && (
                <div className="space-y-4">
                  {/* Account Information */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">
                      Account Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <p className="text-sm text-gray-900">
                          {member.fullName}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account ID
                        </label>
                        <p className="text-sm font-mono text-gray-900">
                          {member.accountId}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <p className="text-sm text-gray-900">{member.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <p className="text-sm text-gray-900">
                          {member.phoneNumber || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Member Since
                        </label>
                        <p className="text-sm text-gray-900">
                          {formatDate(member.memberSince)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded text-sm font-medium ${
                            member.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {member.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Program Enrollment - Single Program */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">
                      Program Enrollment
                    </h4>
                    <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {program.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {program.partnerName}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded text-sm font-medium ${
                          program.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {program.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {FEATURE_FLAGS.MEMBER_POINTS_TAB &&
                currentTab === "points" &&
                balance && (
                  <div className="space-y-6">
                    {/* Current Balance Card (Gradient) */}
                    <div
                      className="rounded-lg p-8 border border-blue-200"
                      style={{
                        background:
                          "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)",
                      }}
                    >
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-sm font-semibold mb-2 text-blue-700">
                            Current Balance
                          </p>
                          <p className="text-5xl font-bold mb-3 text-blue-900">
                            {formatPoints(balance.currentPoints)}
                          </p>
                          <p className="text-base font-medium text-blue-700">
                            {formatUsdCents(balance.currentUsdCents)} USD value
                            • {balance.displayNamePrefix} {balance.displayName}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Lifetime Summary (3-column grid) */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">
                        Lifetime Summary
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            Total Earned
                          </p>
                          <p className="text-3xl font-bold text-green-700">
                            {formatPoints(member.totalPointsEarned)}
                          </p>
                        </div>
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            Total Redeemed
                          </p>
                          <p className="text-3xl font-bold text-red-700">
                            {formatPoints(member.totalPointsRedeemed)}
                          </p>
                        </div>
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            Adjustments
                          </p>
                          <p
                            className={`text-3xl font-bold ${member.totalAdjustments >= 0 ? "text-green-700" : "text-red-700"}`}
                          >
                            {member.totalAdjustments >= 0 ? "+" : ""}
                            {formatPoints(member.totalAdjustments)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Adjustment Guidelines Card */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">⚠️</span>
                        <h4 className="text-sm font-semibold text-gray-900">
                          Adjustment Guidelines
                        </h4>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-2.5">
                        <li className="flex items-start gap-2">
                          <span className="text-gray-600 mt-0.5 font-bold">
                            •
                          </span>
                          <span>
                            Always provide a clear reason for adjustments
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-gray-600 mt-0.5 font-bold">
                            •
                          </span>
                          <span>
                            Document the issue in detail for audit purposes
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-gray-600 mt-0.5 font-bold">
                            •
                          </span>
                          <span>
                            Verify member identity before making changes
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-gray-600 mt-0.5 font-bold">
                            •
                          </span>
                          <span>
                            Contact supervisor for adjustments over 1,000 points
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

              {FEATURE_FLAGS.MEMBER_HISTORY_TAB && currentTab === "history" && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <PointsHistory
                    transactions={member.transactions}
                    onViewReceipt={setSelectedReceipt}
                  />
                </div>
              )}

              {FEATURE_FLAGS.MEMBER_RECEIPTS_TAB &&
                currentTab === "receipts" && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Receipt Submissions
                    </h4>

                    {memberReceipts.length === 0 ? (
                      <div className="text-center py-12">
                        <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-sm text-gray-500">
                          No receipts submitted yet
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                Receipt ID
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                Date
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                Merchant
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                Campaign
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                Amount
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                Status
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                Points
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {memberReceipts.map((receipt) => {
                              const statusStyles = {
                                approved:
                                  "bg-green-100 text-green-800 border-green-300",
                                rejected:
                                  "bg-red-100 text-red-800 border-red-300",
                                pending:
                                  "bg-yellow-100 text-yellow-800 border-yellow-300",
                                manual_review:
                                  "bg-indigo-100 text-indigo-800 border-indigo-300",
                              };

                              const statusLabels = {
                                approved: "Approved",
                                rejected: "Rejected",
                                pending: "Pending",
                                manual_review: "Manual Review",
                              };

                              return (
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
                                  <td className="py-3 px-4 text-sm text-gray-900">
                                    {receipt.merchantName}
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-600">
                                    {receipt.campaignName || "N/A"}
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-900">
                                    ${receipt.totalAmount.toFixed(2)}
                                  </td>
                                  <td className="py-3 px-4">
                                    <span
                                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${statusStyles[receipt.verificationStatus]}`}
                                    >
                                      {statusLabels[receipt.verificationStatus]}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                                    {receipt.verificationStatus ===
                                      "approved" && receipt.actionAmount
                                      ? `+${formatPoints(receipt.actionAmount)}`
                                      : receipt.verificationStatus ===
                                          "rejected"
                                        ? "—"
                                        : receipt.actionAmount
                                          ? formatPoints(receipt.actionAmount)
                                          : "—"}
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          setSelectedReceipt(receipt.id)
                                        }
                                      >
                                        View
                                      </Button>
                                      {receipt.verificationStatus ===
                                        "manual_review" && (
                                        <Button
                                          variant="primary"
                                          size="sm"
                                          onClick={() => {
                                            setSelectedReceiptForReview(
                                              receipt.id
                                            );
                                            setShowManualReviewModal(true);
                                          }}
                                        >
                                          Review
                                        </Button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {showAdjustModal && (
        <PointsAdjustmentModal
          member={member}
          receiptId={adjustmentReceiptId}
          onClose={() => {
            setShowAdjustModal(false);
            setAdjustmentReceiptId(undefined);
          }}
          onSuccess={onAdjustmentSuccess}
        />
      )}

      {showManualReviewModal && selectedReceiptForReview && (
        <ManualReviewModal
          member={member}
          receiptId={selectedReceiptForReview}
          onClose={() => {
            setShowManualReviewModal(false);
            setSelectedReceiptForReview(null);
          }}
          onSuccess={handleManualReviewSuccess}
        />
      )}

      {selectedReceipt && (
        <ReceiptViewer
          receiptId={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </>
  );
}
