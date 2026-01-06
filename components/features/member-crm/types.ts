/**
 * @file TypeScript interfaces for Member CRM feature
 * @description Defines all types used in the Member CRM module
 */

export type TransactionType = "earn" | "redeem" | "adjust";
export type SourceType = "receipt" | "redemption" | "manual" | "affiliate";
export type AdjustmentDirection = "add" | "subtract";

export interface Program {
  id: string;
  name: string;
  displayName: string;
  partnerName: string;
  isActive: boolean;
}

export interface PointsBalance {
  programId: string;
  programName: string;
  currentPoints: number;
  currentUsdCents: number;
  conversionRate: number; // e.g., 100 points = $1.00
  displayNamePrefix: string; // e.g., "Optum"
  displayName: string; // e.g., "Rewards Points"
}

export interface PointsTransaction {
  id: string;
  accountId: string;
  programId: string;
  transactionType: TransactionType;
  sourceType: SourceType;
  pointsAmount: number; // Calculated from USD cents
  usdAmountCents: number; // Invariant stored value
  balanceAfterPoints: number;
  balanceAfterUsdCents: number;
  transactionDate: string; // ISO string
  description?: string;

  // Receipt-specific fields
  receiptId?: string;
  merchantName?: string;
  receiptTotal?: number;

  // Promotion fields
  promotionId?: string;
  promotionName?: string;

  // Adjustment-specific fields
  adjustedByAdministratorId?: string;
  adjustedByName?: string;
  adjustmentReason?: string;
  adjustmentNotes?: string;

  // Metadata
  metadata?: Record<string, any>;
}

export interface Member {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  accountId: string; // Unique per program enrollment (e.g., acc-789xyz-prog-optum-001)
  memberSince: string; // ISO string
  phoneNumber?: string;
  address?: string;
  status: "active" | "inactive" | "suspended";
}

export interface MemberWithPoints extends Member {
  // Single program per record (database has separate rows per enrollment)
  program: Program;
  pointsBalance: PointsBalance;
  transactions: PointsTransaction[];
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  totalAdjustments: number;
}

export interface PointsAdjustmentRequest {
  accountId: string;
  programId: string;
  direction: AdjustmentDirection;
  pointsAmount: number;
  promotionId?: string;
  adjustmentReason: string;
  notes: string;
}

export interface PointsAdjustmentResponse {
  success: boolean;
  ledgerEntryId: string;
  pointsAdjusted: number;
  newBalancePoints: number;
  newBalanceUsdCents: number;
  displayName: string;
  transactionDate: string;
  message?: string;
}

export interface Receipt {
  id: string;
  accountId: string;
  uploadedAt: string;
  merchantName: string;
  totalAmount: number;
  verificationStatus: "pending" | "approved" | "rejected" | "manual_review";
  imageUrl: string;
  items?: ReceiptItem[];
  campaignName?: string;
  reasonCode?: string;
  actionAmount?: number;
}

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  isQualifying?: boolean;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  programId: string;
  rewardType: "points" | "cashback";
  rewardAmount: number;
  isActive: boolean;
}

export interface AdjustmentReason {
  value: string;
  label: string;
  description?: string;
}

export const ADJUSTMENT_REASONS: AdjustmentReason[] = [
  {
    value: "receipt_processing_error",
    label: "Receipt Processing Error",
    description: "OCR failed but receipt is valid",
  },
  {
    value: "duplicate_receipt",
    label: "Duplicate Receipt",
    description: "User submitted same receipt multiple times",
  },
  {
    value: "system_error",
    label: "System Error",
    description: "Technical issue prevented points from being awarded",
  },
  {
    value: "goodwill_credit",
    label: "Goodwill Credit",
    description: "Customer satisfaction gesture",
  },
  {
    value: "fraud_reversal",
    label: "Fraud Reversal",
    description: "Fraudulent transaction being reversed",
  },
  {
    value: "promotion_misapplication",
    label: "Promotion Misapplication",
    description: "Wrong promotion was applied to transaction",
  },
  {
    value: "other",
    label: "Other",
    description: "Custom reason - please explain in notes",
  },
];

export const REJECTION_REASONS: AdjustmentReason[] = [
  {
    value: "fraud",
    label: "Fraud",
    description: "Fraudulent receipt or suspicious activity detected",
  },
  {
    value: "invalid_product",
    label: "Invalid Product",
    description: "Product does not qualify for promotion",
  },
  {
    value: "receipt_too_old",
    label: "Receipt Too Old",
    description: "Receipt exceeds submission deadline",
  },
  {
    value: "insufficient_purchase",
    label: "Insufficient Purchase Amount",
    description: "Purchase amount does not meet minimum requirement",
  },
  {
    value: "invalid_exception",
    label: "Invalid Exception",
    description: "Does not meet promotion terms and conditions",
  },
  {
    value: "other",
    label: "Other",
    description: "Other reason - please explain in notes",
  },
];

export type ManualReviewDecision = "approve" | "reject";

export interface ManualReviewRequest {
  receiptId: string;
  decision: ManualReviewDecision;
  pointsAmount?: number; // Required if approving
  reasonCode?: string; // Required if rejecting
  notes: string;
}

export interface ManualReviewResponse {
  success: boolean;
  receiptId: string;
  decision: ManualReviewDecision;
  pointsAwarded?: number;
  newBalancePoints?: number;
  newBalanceUsdCents?: number;
  message?: string;
}
