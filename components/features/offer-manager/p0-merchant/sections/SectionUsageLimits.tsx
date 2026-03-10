"use client";

import React from "react";
import { Label } from "@/components/ui/label";

// Match kigo-admin-tools constants
const REDEMPTION_LIMITS = [
  { value: "1", label: "1 time" },
  { value: "2", label: "2 times" },
  { value: "3", label: "3 times" },
  { value: "4", label: "4 times" },
  { value: "5", label: "5 times" },
  { value: "6", label: "6 times" },
  { value: "7", label: "7 times" },
  { value: "8", label: "8 times" },
  { value: "9", label: "9 times" },
  { value: "9999", label: "Unlimited" },
];

const REDEMPTION_ROLLING_PERIODS = [
  { value: "U", label: "Single Use" },
  { value: "M", label: "Monthly" },
  { value: "Y", label: "Yearly" },
];

interface SectionUsageLimitsProps {
  formData: {
    usageLimitPerCustomer?: string;
    redemptionRollingPeriod?: string;
  };
  onUpdate: (field: string, value: any) => void;
}

export default function SectionUsageLimits({
  formData,
  onUpdate,
}: SectionUsageLimitsProps) {
  const isUnlimited = formData.usageLimitPerCustomer === "9999";

  const handleUsageLimitChange = (value: string) => {
    onUpdate("usageLimitPerCustomer", value);
    if (value === "9999") {
      onUpdate("redemptionRollingPeriod", "U");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="usageLimitPerCustomer">Uses Per Customer*</Label>
          <select
            id="usageLimitPerCustomer"
            value={formData.usageLimitPerCustomer || "1"}
            onChange={(e) => handleUsageLimitChange(e.target.value)}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {REDEMPTION_LIMITS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-gray-500 text-sm">
            How many times each customer can use this offer
          </p>
        </div>

        <div>
          <Label htmlFor="redemptionRollingPeriod">
            Redemption Rolling Period*
          </Label>
          <select
            id="redemptionRollingPeriod"
            value={isUnlimited ? "U" : formData.redemptionRollingPeriod || "U"}
            onChange={(e) =>
              onUpdate("redemptionRollingPeriod", e.target.value)
            }
            disabled={isUnlimited}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {REDEMPTION_ROLLING_PERIODS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-gray-500 text-sm">
            {isUnlimited
              ? "Rolling period not applicable for unlimited usage"
              : "Time period for redemption limits to reset"}
          </p>
        </div>
      </div>
    </div>
  );
}
