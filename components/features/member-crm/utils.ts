/**
 * @file Utility functions for Member CRM feature
 * @description Helper functions for data manipulation and formatting
 */

import { PointsTransaction, TransactionType } from "./types";

/**
 * Format points amount with commas
 */
export function formatPoints(points: number): string {
  return points.toLocaleString("en-US");
}

/**
 * Format USD cents to dollar string
 */
export function formatUsdCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Format date to readable string
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format date with time
 */
export function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Calculate time ago from ISO date
 */
export function timeAgo(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
  return formatDate(isoDate);
}

/**
 * Get transaction icon based on type
 */
export function getTransactionIcon(type: TransactionType): string {
  switch (type) {
    case "earn":
      return "✅";
    case "redeem":
      return "🎁";
    case "adjust":
      return "⚠️";
    default:
      return "•";
  }
}

/**
 * Get transaction color class based on type
 */
export function getTransactionColorClass(type: TransactionType): string {
  switch (type) {
    case "earn":
      return "text-green-600 bg-green-50";
    case "redeem":
      return "text-purple-600 bg-purple-50";
    case "adjust":
      return "text-yellow-600 bg-yellow-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}

/**
 * Get points display with sign
 */
export function formatPointsChange(points: number): string {
  if (points > 0) {
    return `+${formatPoints(points)}`;
  }
  return formatPoints(points);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate adjustment amount
 */
export function validateAdjustmentAmount(
  amount: number,
  direction: "add" | "subtract",
  currentBalance: number
): { valid: boolean; error?: string } {
  if (amount <= 0) {
    return { valid: false, error: "Amount must be greater than 0" };
  }

  if (direction === "subtract" && amount > currentBalance) {
    return {
      valid: false,
      error: `Cannot subtract ${amount} points. Current balance is only ${currentBalance} points.`,
    };
  }

  return { valid: true };
}

/**
 * Calculate new balance after adjustment
 */
export function calculateNewBalance(
  currentBalance: number,
  amount: number,
  direction: "add" | "subtract"
): number {
  return direction === "add"
    ? currentBalance + amount
    : currentBalance - amount;
}

/**
 * Sort transactions by date (newest first)
 */
export function sortTransactionsByDate(
  transactions: PointsTransaction[]
): PointsTransaction[] {
  return [...transactions].sort((a, b) => {
    return (
      new Date(b.transactionDate).getTime() -
      new Date(a.transactionDate).getTime()
    );
  });
}

/**
 * Filter transactions by type
 */
export function filterTransactionsByType(
  transactions: PointsTransaction[],
  type: TransactionType | "all"
): PointsTransaction[] {
  if (type === "all") return transactions;
  return transactions.filter((txn) => txn.transactionType === type);
}

/**
 * Get adjustment reason label
 */
export function getAdjustmentReasonLabel(reasonValue: string): string {
  const reasonMap: Record<string, string> = {
    receipt_processing_error: "Receipt Processing Error",
    duplicate_receipt: "Duplicate Receipt",
    system_error: "System Error",
    goodwill_credit: "Goodwill Credit",
    fraud_reversal: "Fraud Reversal",
    promotion_misapplication: "Promotion Misapplication",
    other: "Other",
  };

  return reasonMap[reasonValue] || reasonValue;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Generate mock receipt image URL (for demo purposes)
 */
export function getMockReceiptImageUrl(receiptId: string): string {
  // Map receipt IDs to actual mock images
  const mockImages: Record<string, string> = {
    "rcp-001": "/mock/mock-receipt-target.jpg",
    "rcp-002": "/mock/mock-receipt-walmart.jpg",
    "rcp-003": "/mock/mock-receipt-costco.jpg",
    "rcp-004": "/mock/mock-receipt-walgreens.jpg",
    "rcp-005": "/mock/mock-receipt-bestbuy.jpg",
    "rcp-006": "/mock/mock-receipt-walgreens-2.jpg",
    "rcp-007": "/mock/mock-receipt-target.jpg",
    "rcp-008": "/mock/mock-receipt-walmart.jpg",
    "rcp-009": "/mock/mock-receipt-costco.jpg",
    "rcp-010": "/mock/mock-receipt-walgreens.jpg",
    "rcp-011": "/mock/mock-receipt-bestbuy.jpg",
    "rcp-012": "/mock/mock-receipt-walgreens-2.jpg",
    "rcp-013": "/mock/mock-receipt-target.jpg",
    "rcp-014": "/mock/mock-receipt-walmart.jpg",
    "rcp-015": "/mock/mock-receipt-costco.jpg",
    "rcp-016": "/mock/mock-receipt-walgreens.jpg",
    "rcp-017": "/mock/mock-receipt-bestbuy.jpg",
    "rcp-018": "/mock/mock-receipt-walgreens-2.jpg",
    "rcp-019": "/mock/mock-receipt-target.jpg",
    "rcp-020": "/mock/mock-receipt-walmart.jpg",
  };

  // Return the mapped image or cycle through available images if ID not mapped
  if (mockImages[receiptId]) {
    return mockImages[receiptId];
  }

  // Fallback: cycle through available mock images based on receipt ID
  const availableImages = [
    "/mock/mock-receipt-target.jpg",
    "/mock/mock-receipt-walmart.jpg",
    "/mock/mock-receipt-costco.jpg",
    "/mock/mock-receipt-walgreens.jpg",
    "/mock/mock-receipt-bestbuy.jpg",
    "/mock/mock-receipt-walgreens-2.jpg",
  ];

  // Use receipt ID to deterministically select an image
  const idNum = parseInt(receiptId.replace(/\D/g, ""), 10) || 0;
  return availableImages[idNum % availableImages.length];
}
