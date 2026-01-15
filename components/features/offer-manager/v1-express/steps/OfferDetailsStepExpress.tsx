"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReactSelectCreatable } from "@/components/ui/react-select-creatable";
import { InformationCircleIcon, TagIcon } from "@heroicons/react/24/outline";

interface OfferDetailsStepExpressProps {
  formData: any;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
}

// Available offer sources (external reference values)
const OFFER_SOURCES = [
  { label: "MCM (Merchant Commerce Manager)", value: "MCM" },
  { label: "FMTC (FlexOffers)", value: "FMTC" },
  { label: "EBG (Enterprise Business Group)", value: "EBG" },
  { label: "RN (Retail Network)", value: "RN" },
  { label: "AUGEO (Augeo Platform)", value: "AUGEO" },
];

export default function OfferDetailsStepExpress({
  formData,
  onUpdate,
}: OfferDetailsStepExpressProps) {
  // Local state for immediate UI updates (fixes INP performance issue)
  const [localOfferName, setLocalOfferName] = useState(
    formData.offerName || formData.shortText || ""
  );
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local state with formData when it changes externally
  useEffect(() => {
    setLocalOfferName(formData.offerName || formData.shortText || "");
  }, [formData.offerName, formData.shortText]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Debounced handler for offer name changes (fixes INP issue)
  const handleOfferNameChange = (value: string) => {
    // Update local state immediately for responsive UI
    setLocalOfferName(value);

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the actual state updates to avoid blocking main thread
    debounceTimerRef.current = setTimeout(() => {
      onUpdate("offerName", value);
      // Keep backward compatibility with shortText
      onUpdate("shortText", value);
    }, 150); // 150ms debounce
  };

  return (
    <div className="space-y-4">
      {/* Basic Information Section */}
      <div className="rounded-md border border-b">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
            <div className="flex items-center gap-2">
              <InformationCircleIcon className="size-4" />
              <span>Basic Information</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 pt-0 space-y-5">
          <div>
            <Label htmlFor="merchant">Merchant*</Label>
            <ReactSelectCreatable
              options={OFFER_SOURCES}
              value={formData.merchant || null}
              onChange={(value) => onUpdate("merchant", value)}
              placeholder="Select existing or create new merchant"
              formatCreateLabel={(inputValue) =>
                `Create new merchant "${inputValue.toUpperCase().replace(/\s+/g, "_")}"`
              }
              helperText="Merchant or partner providing this offer (e.g., MCM, FMTC, EBG, RN, AUGEO)"
            />
          </div>

          <div>
            <Label htmlFor="offerSource">Offer Source*</Label>
            <ReactSelectCreatable
              options={OFFER_SOURCES}
              value={formData.offerSource || null}
              onChange={(value) => onUpdate("offerSource", value)}
              placeholder="Select or create offer source"
              formatCreateLabel={(inputValue) =>
                `Create source "${inputValue.toUpperCase()}"`
              }
              helperText="Source of this offer (e.g., MCM, FMTC, EBG, RN, AUGEO)"
            />
          </div>

          <div>
            <Label htmlFor="offerName">Offer Name*</Label>
            <Input
              id="offerName"
              placeholder="Brief offer name for listing view (e.g., '20% Off Dinner')"
              value={localOfferName}
              onChange={(e) => handleOfferNameChange(e.target.value)}
              maxLength={60}
            />
            <p className="mt-2 text-muted-foreground text-sm">
              {localOfferName.length}/60 characters - Used for short description
              in UX
            </p>
          </div>

          <div>
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              placeholder="Detailed offer description for detail view"
              value={formData.description || formData.longText || ""}
              onChange={(e) => {
                onUpdate("description", e.target.value);
                // Keep backward compatibility with longText
                onUpdate("longText", e.target.value);
              }}
              rows={4}
              maxLength={250}
            />
            <p className="mt-2 text-muted-foreground text-sm">
              {(formData.description || formData.longText || "").length}/250
              characters - Used in long description on offer details page
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date*</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => onUpdate("startDate", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => onUpdate("endDate", e.target.value)}
                min={formData.startDate}
              />
              <p className="mt-2 text-muted-foreground text-sm">
                Leave blank for no expiration
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="termsConditions">Terms & Conditions*</Label>
            <Textarea
              id="termsConditions"
              placeholder="Enter the terms and conditions for this offer"
              value={formData.termsConditions}
              onChange={(e) => onUpdate("termsConditions", e.target.value)}
              rows={4}
              maxLength={1000}
            />
            <p className="mt-2 text-muted-foreground text-sm">
              {(formData.termsConditions || "").length}/1000 characters
            </p>
          </div>
        </div>
      </div>

      {/* Classification Section */}
      <div className="rounded-md border border-b">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
            <div className="flex items-center gap-2">
              <TagIcon className="size-4" />
              <span>Classification</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 pt-0 space-y-5">
          {/* Offer Type - Keep in this step per Express template */}
          <div>
            <Label htmlFor="offerType">Offer Type*</Label>
            <Select
              value={formData.offerType}
              onValueChange={(value) => onUpdate("offerType", value)}
            >
              <SelectTrigger id="offerType">
                <SelectValue placeholder="Select offer type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bogo">BOGO (Buy One Get One)</SelectItem>
                <SelectItem value="percent_off">Percentage Off</SelectItem>
                <SelectItem value="dollar_off">Dollar Amount Off</SelectItem>
                <SelectItem value="free">Free Item/Service</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
