"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { ReactSelectMulti } from "@/components/ui/react-select-multi";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { AVAILABLE_CATEGORIES, AVAILABLE_COMMODITIES } from "./shared";

interface SectionClassificationProps {
  formData: {
    category_ids?: string[];
    commodity_ids?: string[];
  };
  onUpdate: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

export default function SectionClassification({
  formData,
  onUpdate,
  errors = {},
}: SectionClassificationProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5">
      <div>
        <Label htmlFor="categories" className="mb-1">
          Categories*
        </Label>
        <ReactSelectMulti
          options={AVAILABLE_CATEGORIES}
          values={formData.category_ids || []}
          onChange={(values) => onUpdate("category_ids", values)}
          placeholder="Select categories..."
          maxDisplayValues={3}
        />
        {errors.category_ids ? (
          <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
            <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
            {errors.category_ids}
          </p>
        ) : (
          <p className="mt-1.5 text-gray-700 text-sm">
            Select one or more categories
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="commodities" className="mb-1">
          Commodities Group
        </Label>
        <ReactSelectMulti
          options={AVAILABLE_COMMODITIES}
          values={formData.commodity_ids || []}
          onChange={(values) => onUpdate("commodity_ids", values)}
          placeholder="Select commodities group..."
          maxDisplayValues={3}
        />
        <p className="mt-1.5 text-gray-700 text-sm">
          Select specific items or services
        </p>
      </div>
    </div>
  );
}
