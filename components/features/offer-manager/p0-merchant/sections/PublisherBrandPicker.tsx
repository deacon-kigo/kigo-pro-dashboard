"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getCurrentPublisher,
  isMultiBrandPublisher,
} from "@/lib/constants/publisher-brands";

interface PublisherBrandPickerProps {
  selectedBrandTag: string | null;
  onBrandChange: (editionTag: string) => void;
  disabled?: boolean;
}

export default function PublisherBrandPicker({
  selectedBrandTag,
  onBrandChange,
  disabled,
}: PublisherBrandPickerProps) {
  if (!isMultiBrandPublisher()) return null;

  const publisher = getCurrentPublisher();

  return (
    <div className="space-y-1.5 pt-3 border-t">
      <label className="text-sm font-medium">Publisher Brand</label>
      <Select
        value={selectedBrandTag ?? undefined}
        onValueChange={onBrandChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a brand edition" />
        </SelectTrigger>
        <SelectContent>
          {publisher.brands.map((brand) => (
            <SelectItem key={brand.editionTag} value={brand.editionTag}>
              {brand.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Choose which {publisher.name} edition this offer is for
      </p>
    </div>
  );
}
