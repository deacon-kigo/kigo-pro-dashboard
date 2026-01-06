"use client";

import React, { useState } from "react";
import { EyeIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/atoms/Button/Button";
import Card from "@/components/atoms/Card/Card";
import { PointsTransaction, TransactionType } from "./types";
import {
  formatDateTime,
  formatPointsChange,
  getTransactionIcon,
  getTransactionColorClass,
  sortTransactionsByDate,
  filterTransactionsByType,
  getAdjustmentReasonLabel,
  truncateText,
} from "./utils";

interface PointsHistoryProps {
  transactions: PointsTransaction[];
  onViewReceipt?: (receiptId: string) => void;
}

/**
 * PointsHistory component - Displays transaction history with filtering
 * @classification organism
 * @description Shows member's points transaction history with filter and view options
 */
export default function PointsHistory({
  transactions,
  onViewReceipt,
}: PointsHistoryProps) {
  const [filterType, setFilterType] = useState<TransactionType | "all">("all");

  const sortedTransactions = sortTransactionsByDate(transactions);
  const filteredTransactions = filterTransactionsByType(
    sortedTransactions,
    filterType
  );

  const transactionCounts = {
    all: transactions.length,
    earn: transactions.filter((t) => t.transactionType === "earn").length,
    redeem: transactions.filter((t) => t.transactionType === "redeem").length,
    adjust: transactions.filter((t) => t.transactionType === "adjust").length,
  };

  return (
    <div className="space-y-5">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setFilterType("all")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            filterType === "all"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          All <span className="ml-1 text-xs">({transactionCounts.all})</span>
        </button>
        <button
          onClick={() => setFilterType("earn")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            filterType === "earn"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Earned{" "}
          <span className="ml-1 text-xs">({transactionCounts.earn})</span>
        </button>
        <button
          onClick={() => setFilterType("redeem")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            filterType === "redeem"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Redeemed{" "}
          <span className="ml-1 text-xs">({transactionCounts.redeem})</span>
        </button>
        <button
          onClick={() => setFilterType("adjust")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            filterType === "adjust"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Adjustments{" "}
          <span className="ml-1 text-xs">({transactionCounts.adjust})</span>
        </button>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 rounded-lg border border-gray-200 bg-gray-50">
            <p className="text-sm font-medium text-gray-500">
              No transactions found
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Transactions will appear here
            </p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors"
            >
              {/* Transaction Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-lg p-3 ${
                      transaction.transactionType === "earn"
                        ? "bg-green-100"
                        : transaction.transactionType === "redeem"
                          ? "bg-orange-100"
                          : "bg-yellow-100"
                    }`}
                  >
                    <span className="text-2xl">
                      {getTransactionIcon(transaction.transactionType)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-base font-bold ${
                          transaction.transactionType === "earn"
                            ? "text-green-900"
                            : transaction.transactionType === "redeem"
                              ? "text-orange-900"
                              : "text-yellow-900"
                        }`}
                      >
                        {transaction.transactionType === "earn" && "Earned "}
                        {transaction.transactionType === "redeem" &&
                          "Redeemed "}
                        {transaction.transactionType === "adjust" &&
                          "Adjusted "}
                        {formatPointsChange(transaction.pointsAmount)} points
                      </span>
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
                          transaction.transactionType === "earn"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : transaction.transactionType === "redeem"
                              ? "bg-orange-50 text-orange-700 border-orange-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        {transaction.sourceType}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-gray-600">
                      {formatDateTime(transaction.transactionDate)}
                    </div>
                  </div>
                </div>
                <div className="text-right px-4 py-2 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="text-xs font-semibold text-gray-600">
                    Balance after
                  </div>
                  <div className="text-base font-bold text-gray-900 mt-0.5">
                    {transaction.balanceAfterPoints.toLocaleString()} pts
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              {(transaction.receiptId ||
                transaction.adjustmentReason ||
                transaction.description) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {/* Receipt-based earn */}
                  {transaction.transactionType === "earn" &&
                    transaction.receiptId && (
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-green-900">
                            Receipt: {transaction.merchantName} - $
                            {((transaction.receiptTotal || 0) / 100).toFixed(2)}
                          </span>
                          {onViewReceipt && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                onViewReceipt(transaction.receiptId!)
                              }
                              className="text-green-700 hover:text-green-800 hover:bg-green-50"
                            >
                              <EyeIcon className="h-4 w-4 mr-1" />
                              View Receipt
                            </Button>
                          )}
                        </div>
                        {transaction.promotionName && (
                          <div className="text-sm font-medium text-green-800">
                            Promotion: {transaction.promotionName}
                          </div>
                        )}
                      </div>
                    )}

                  {/* Manual adjustment */}
                  {transaction.transactionType === "adjust" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-yellow-900 font-semibold">
                        <span className="text-lg">⚠️</span>
                        Manual Adjustment
                      </div>
                      {transaction.adjustmentReason && (
                        <div className="text-sm font-medium text-yellow-900">
                          <span className="font-bold">Reason:</span>{" "}
                          {getAdjustmentReasonLabel(
                            transaction.adjustmentReason
                          )}
                        </div>
                      )}
                      {transaction.adjustedByName && (
                        <div className="text-sm font-medium text-yellow-900">
                          <span className="font-bold">Adjusted by:</span>{" "}
                          {transaction.adjustedByName}
                        </div>
                      )}
                      {transaction.adjustmentNotes && (
                        <div className="mt-3 p-3 rounded-lg text-sm font-medium text-yellow-900 bg-yellow-50 border border-yellow-200">
                          <span className="font-bold">Notes:</span>{" "}
                          {truncateText(transaction.adjustmentNotes, 150)}
                        </div>
                      )}
                      {transaction.promotionName && (
                        <div className="text-sm font-medium text-yellow-900">
                          <span className="font-bold">Related Promotion:</span>{" "}
                          {transaction.promotionName}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Redemption */}
                  {transaction.transactionType === "redeem" && (
                    <div className="text-sm font-medium text-orange-900">
                      {transaction.description}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredTransactions.length > 10 && (
        <div className="text-center py-4">
          <Button
            variant="secondary"
            className="px-6 py-2.5 font-semibold shadow-sm"
          >
            Load More Transactions
          </Button>
        </div>
      )}
    </div>
  );
}
