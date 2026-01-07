/**
 * @classification template molecule
 * @description Receipt status badge component with standardized colors and icons
 */

import React from "react";
import { Badge } from "@/components/atoms/Badge/Badge";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/solid";

export type ReceiptVerificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "manual_review"
  | "manually_approved"
  | "manually_rejected";

interface ReceiptStatusBadgeProps {
  status: ReceiptVerificationStatus;
  className?: string;
  showIcon?: boolean;
  size?: "default" | "sm" | "lg";
}

const statusConfig: Record<
  ReceiptVerificationStatus,
  {
    label: string;
    variant: string;
    icon: React.ComponentType<{ className?: string }>;
    className: string;
    iconClassName: string;
    style?: React.CSSProperties;
  }
> = {
  approved: {
    label: "Approved",
    variant: "success",
    icon: CheckCircleIcon,
    className: "font-semibold",
    iconClassName: "h-3.5 w-3.5",
    style: {
      backgroundColor: "#d1fae5",
      borderColor: "#6ee7b7",
      color: "#166534", // green-800 dark
    },
  },
  rejected: {
    label: "Rejected",
    variant: "error",
    icon: XCircleIcon,
    className: "font-semibold",
    iconClassName: "h-3.5 w-3.5",
    style: {
      backgroundColor: "#fee2e2",
      borderColor: "#fca5a5",
      color: "#991b1b", // red-800 dark
    },
  },
  pending: {
    label: "Pending",
    variant: "warning",
    icon: ClockIcon,
    className: "font-semibold",
    iconClassName: "h-3.5 w-3.5",
    style: {
      backgroundColor: "#dbeafe",
      borderColor: "#93c5fd",
      color: "#1e40af", // blue-800 dark
    },
  },
  manual_review: {
    label: "Manual Review",
    variant: "warning",
    icon: ExclamationCircleIcon,
    className: "font-semibold",
    iconClassName: "h-3.5 w-3.5",
    style: {
      backgroundColor: "#fef3c7",
      borderColor: "#fde047",
      color: "#854d0e", // yellow-800/amber-800 dark
    },
  },
  manually_approved: {
    label: "Manually Approved",
    variant: "success",
    icon: ShieldCheckIcon,
    className: "font-semibold",
    iconClassName: "h-3.5 w-3.5",
    style: {
      backgroundColor: "#d1fae5",
      borderColor: "#6ee7b7",
      color: "#166534", // green-800 dark
    },
  },
  manually_rejected: {
    label: "Manually Rejected",
    variant: "error",
    icon: ShieldExclamationIcon,
    className: "font-semibold",
    iconClassName: "h-3.5 w-3.5",
    style: {
      backgroundColor: "#fee2e2",
      borderColor: "#fca5a5",
      color: "#991b1b", // red-800 dark
    },
  },
};

export function ReceiptStatusBadge({
  status,
  className = "",
  showIcon = true,
  size = "default",
}: ReceiptStatusBadgeProps) {
  const config = statusConfig[status];

  if (!config) {
    return (
      <Badge variant="neutral" size={size}>
        Unknown
      </Badge>
    );
  }

  const Icon = config.icon;

  return (
    <Badge
      className={`${config.className} ${className}`}
      useClassName
      size={size}
      icon={showIcon ? <Icon className={config.iconClassName} /> : undefined}
      iconPosition="left"
      style={config.style}
    >
      {config.label}
    </Badge>
  );
}

export default ReceiptStatusBadge;
