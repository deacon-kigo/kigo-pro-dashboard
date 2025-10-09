"use client";

import React from "react";
import { ReactSelectMulti } from "@/components/ui/react-select-multi";

export interface CatalogSource {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  isActive: boolean;
}

export interface CatalogSourceSelectorProps {
  selectedSources: string[];
  onSourcesChange: (sources: string[]) => void;
  availableSources?: CatalogSource[];
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

// Default catalog sources
const DEFAULT_CATALOG_SOURCES: CatalogSource[] = [
  {
    id: "MCM",
    name: "MCM",
    displayName: "MCM (Merchant Commerce Manager)",
    description: "Primary merchant commerce platform",
    isActive: true,
  },
  {
    id: "FMTC",
    name: "FMTC",
    displayName: "FMTC (FlexOffers)",
    description: "FlexOffers affiliate network",
    isActive: true,
  },
  {
    id: "EBG",
    name: "EBG",
    displayName: "EBG (Enterprise Business Group)",
    description: "Enterprise business solutions",
    isActive: true,
  },
  {
    id: "RN",
    name: "RN",
    displayName: "RN (Retail Network)",
    description: "Retail partner network",
    isActive: true,
  },
  {
    id: "AUGEO",
    name: "AUGEO",
    displayName: "AUGEO (Augeo Platform)",
    description: "Augeo engagement platform",
    isActive: true,
  },
];

export function CatalogSourceSelector({
  selectedSources,
  onSourcesChange,
  availableSources = DEFAULT_CATALOG_SOURCES,
  className = "",
  disabled = false,
  required = false,
}: CatalogSourceSelectorProps) {
  const activeSources = availableSources.filter((source) => source.isActive);

  // Transform catalog sources to options format expected by ReactSelectMulti
  const options = activeSources.map((source) => ({
    label: source.displayName,
    value: source.id,
  }));

  return (
    <div className={className}>
      <ReactSelectMulti
        options={options}
        values={selectedSources}
        onChange={onSourcesChange}
        placeholder="Select sources..."
        isDisabled={disabled}
        className="w-full"
        maxDisplayValues={2}
      />
    </div>
  );
}
