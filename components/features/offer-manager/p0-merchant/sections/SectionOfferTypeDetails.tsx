"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  OFFER_TYPE_CONFIG,
  OfferTypeKey,
} from "@/lib/constants/offer-templates";
import { VALIDATION_RANGES } from "../hooks/useFormValidation";

interface SectionOfferTypeDetailsProps {
  offerType: OfferTypeKey;
  formData: {
    discountValue?: string;
    minimumSpend?: string;
    cashbackCap?: string;
    cashbackPercentage?: string;
    shortText?: string;
    redemptionValue?: string;
  };
  onUpdate: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

export default function SectionOfferTypeDetails({
  offerType,
  formData,
  onUpdate,
  errors = {},
}: SectionOfferTypeDetailsProps) {
  const typeConfig = OFFER_TYPE_CONFIG[offerType];
  const range = VALIDATION_RANGES[offerType];

  return (
    <div className="space-y-5">
      {/* Discount Value — standard input (not BOGO text) */}
      <div>
        <Label htmlFor="discountValue">{typeConfig.discountLabel}*</Label>
        <div className="relative mt-1">
          {typeConfig.discountPrefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
              {typeConfig.discountPrefix}
            </span>
          )}
          <Input
            id="discountValue"
            type={
              typeConfig.inputType || (offerType === "bogo" ? "text" : "number")
            }
            placeholder={typeConfig.discountPlaceholder}
            value={formData.discountValue || ""}
            onChange={(e) => onUpdate("discountValue", e.target.value)}
            onFocus={(e) => {
              if (e.target.value === "0") onUpdate("discountValue", "");
              e.target.select();
            }}
            className={cn(
              typeConfig.discountPrefix && "pl-7",
              typeConfig.discountSuffix && "pr-10",
              errors.discountValue &&
                "border-red-300 focus-visible:ring-red-500"
            )}
            min="0"
            step={typeConfig.inputStep || "1"}
          />
          {typeConfig.discountSuffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
              {typeConfig.discountSuffix}
            </span>
          )}
        </div>
        {errors.discountValue ? (
          <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
            <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
            {errors.discountValue}
          </p>
        ) : (
          <p className="mt-1.5 text-gray-600 text-sm">
            {offerType === "bogo"
              ? 'Describe the item (e.g., "Any entr\u00e9e")'
              : offerType === "cashback"
                ? "Percentage of purchase amount returned as cash back"
                : "The discount amount for this offer"}
            {range && (
              <span className="text-gray-500 ml-1">({range.label})</span>
            )}
          </p>
        )}
      </div>

      {/* BOGO: Short text item description */}
      {offerType === "bogo" && (
        <div>
          <Label htmlFor="shortText">Item Description*</Label>
          <div className="relative mt-1">
            <Input
              id="shortText"
              type="text"
              placeholder='e.g., "Buy one pizza, get one free"'
              value={formData.shortText || ""}
              onChange={(e) => {
                if (e.target.value.length <= 100) {
                  onUpdate("shortText", e.target.value);
                }
              }}
              maxLength={100}
              className={cn(
                errors.shortText && "border-red-300 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            {errors.shortText ? (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
                {errors.shortText}
              </p>
            ) : (
              <p className="text-gray-600 text-sm">
                Short description shown on the offer card
              </p>
            )}
            <span
              className={cn(
                "text-sm",
                (formData.shortText?.length || 0) > 80
                  ? "text-amber-600"
                  : "text-gray-500"
              )}
            >
              {formData.shortText?.length || 0}/100
            </span>
          </div>
        </div>
      )}

      {/* Minimum Spend — for dollar_off_with_min */}
      {typeConfig.hasMinimumSpend && (
        <div>
          <Label htmlFor="minimumSpend">
            {typeConfig.minimumSpendLabel || "Minimum Spend"}*
          </Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
              $
            </span>
            <Input
              id="minimumSpend"
              type="number"
              placeholder="50"
              value={formData.minimumSpend || ""}
              onChange={(e) => onUpdate("minimumSpend", e.target.value)}
              onFocus={(e) => {
                if (e.target.value === "0") onUpdate("minimumSpend", "");
                e.target.select();
              }}
              className={cn(
                "pl-7",
                errors.minimumSpend &&
                  "border-red-300 focus-visible:ring-red-500"
              )}
              min="0"
              step="1"
            />
          </div>
          {errors.minimumSpend ? (
            <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
              <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
              {errors.minimumSpend}
            </p>
          ) : (
            <p className="mt-1.5 text-gray-600 text-sm">
              Customer must spend at least this amount to qualify
            </p>
          )}
        </div>
      )}

      {/* Cash Back Cap — for cashback */}
      {typeConfig.hasCashbackCap && (
        <div>
          <Label htmlFor="cashbackCap">
            {typeConfig.cashbackCapLabel || "Maximum Cash Back"}
          </Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
              $
            </span>
            <Input
              id="cashbackCap"
              type="number"
              placeholder="25"
              value={formData.cashbackCap || ""}
              onChange={(e) => onUpdate("cashbackCap", e.target.value)}
              onFocus={(e) => {
                if (e.target.value === "0") onUpdate("cashbackCap", "");
                e.target.select();
              }}
              className={cn(
                "pl-7",
                errors.cashbackCap &&
                  "border-red-300 focus-visible:ring-red-500"
              )}
              min="0"
              step="1"
            />
          </div>
          {errors.cashbackCap ? (
            <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
              <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
              {errors.cashbackCap}
            </p>
          ) : (
            <p className="mt-1.5 text-gray-600 text-sm">
              Maximum cash back per transaction (leave empty for unlimited)
            </p>
          )}
        </div>
      )}

      {/* Fixed Price: estimated savings (redemptionValue) */}
      {offerType === "fixed_price" && (
        <div>
          <Label htmlFor="redemptionValue">Estimated Savings</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
              $
            </span>
            <Input
              id="redemptionValue"
              type="number"
              placeholder="10"
              value={formData.redemptionValue || ""}
              onChange={(e) => onUpdate("redemptionValue", e.target.value)}
              onFocus={(e) => {
                if (e.target.value === "0") onUpdate("redemptionValue", "");
                e.target.select();
              }}
              className="pl-7"
              min="0"
              step="0.01"
            />
          </div>
          <p className="mt-1.5 text-gray-600 text-sm">
            Approximate savings vs. regular price (shown in analytics)
          </p>
        </div>
      )}

      {/* Savings indicator */}
      <div className="flex items-center gap-2 bg-muted/50 rounded-md px-3 py-2 text-sm text-gray-700">
        <InformationCircleIcon className="h-4 w-4 flex-shrink-0 text-gray-500" />
        <div>
          <span className="font-medium">Example:</span> {typeConfig.example}
        </div>
      </div>
    </div>
  );
}
