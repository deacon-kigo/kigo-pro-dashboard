"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SectionTermsProps {
  formData: {
    termsConditions?: string;
    usageLimitPerCustomer?: string;
    redemptionRollingPeriod?: string;
  };
  onUpdate: (field: string, value: any) => void;
}

export default function SectionTerms({
  formData,
  onUpdate,
}: SectionTermsProps) {
  return (
    <div className="space-y-5">
      {/* Terms & Conditions */}
      <div>
        <Label htmlFor="termsConditions" className="mb-1">
          Terms & Conditions
        </Label>
        <Textarea
          id="termsConditions"
          placeholder="Enter the terms and conditions for this offer..."
          value={formData.termsConditions || ""}
          onChange={(e) => onUpdate("termsConditions", e.target.value)}
          rows={3}
          maxLength={1000}
          className="resize-none"
        />
        <p className="mt-1 text-gray-600 text-sm">
          {(formData.termsConditions || "").length}/1000 characters
        </p>
      </div>

      {/* Usage Settings */}
      <div className="flex flex-wrap items-center gap-4 pt-3 border-t">
        <div className="flex items-center gap-2">
          <Label
            htmlFor="usageLimitPerCustomer"
            className="text-sm text-gray-700 whitespace-nowrap"
          >
            Uses per customer:
          </Label>
          <select
            id="usageLimitPerCustomer"
            value={formData.usageLimitPerCustomer || "1"}
            onChange={(e) => onUpdate("usageLimitPerCustomer", e.target.value)}
            className="h-8 px-2 text-sm border rounded-md bg-white"
          >
            <option value="1">1 time</option>
            <option value="2">2 times</option>
            <option value="3">3 times</option>
            <option value="5">5 times</option>
            <option value="unlimited">Unlimited</option>
          </select>
        </div>

        <span className="text-gray-400">|</span>

        <div className="flex items-center gap-2">
          <Label
            htmlFor="redemptionRollingPeriod"
            className="text-sm text-gray-700 whitespace-nowrap"
          >
            Resets:
          </Label>
          <select
            id="redemptionRollingPeriod"
            value={formData.redemptionRollingPeriod || "single"}
            onChange={(e) =>
              onUpdate("redemptionRollingPeriod", e.target.value)
            }
            className="h-8 px-2 text-sm border rounded-md bg-white"
          >
            <option value="single">Never</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>
    </div>
  );
}
