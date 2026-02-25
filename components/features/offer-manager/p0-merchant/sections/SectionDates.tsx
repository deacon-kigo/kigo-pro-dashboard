"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { getDefaultDates } from "@/lib/constants/offer-templates";

interface SectionDatesProps {
  formData: {
    startDate?: string;
    endDate?: string;
  };
  onUpdate: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

export default function SectionDates({
  formData,
  onUpdate,
  errors = {},
}: SectionDatesProps) {
  const [noExpiration, setNoExpiration] = useState(!formData.endDate);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date*</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate || ""}
            onChange={(e) => onUpdate("startDate", e.target.value)}
            className={cn(
              "mt-1",
              errors.startDate && "border-red-300 focus-visible:ring-red-500"
            )}
          />
          {errors.startDate && (
            <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
              <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
              {errors.startDate}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={noExpiration ? "" : formData.endDate || ""}
            onChange={(e) => onUpdate("endDate", e.target.value)}
            min={formData.startDate}
            disabled={noExpiration}
            className={cn(
              "mt-1",
              errors.endDate && "border-red-300 focus-visible:ring-red-500"
            )}
          />
          {errors.endDate && (
            <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
              <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
              {errors.endDate}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="noExpiration"
          checked={noExpiration}
          onCheckedChange={(checked) => {
            setNoExpiration(!!checked);
            if (checked) {
              onUpdate("endDate", "");
            } else {
              const defaults = getDefaultDates();
              onUpdate("endDate", defaults.endDate);
            }
          }}
        />
        <label
          htmlFor="noExpiration"
          className="text-sm text-gray-700 cursor-pointer"
        >
          No expiration date
        </label>
      </div>
    </div>
  );
}
