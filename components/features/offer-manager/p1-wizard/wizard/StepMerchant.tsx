"use client";

import React, { useState } from "react";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import MerchantHybridSearch, { MerchantData } from "../MerchantHybridSearch";
import MerchantManualEntry from "../MerchantManualEntry";

/**
 * Step 2: Merchant Selection
 *
 * Wraps existing MerchantHybridSearch component with wizard-friendly UI.
 */

interface StepMerchantProps {
  selectedMerchant: MerchantData | null;
  onSelect: (merchant: MerchantData) => void;
  onClear: () => void;
}

export default function StepMerchant({
  selectedMerchant,
  onSelect,
  onClear,
}: StepMerchantProps) {
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualEntrySearchQuery, setManualEntrySearchQuery] = useState("");

  const handleMerchantSelect = (merchant: MerchantData) => {
    onSelect(merchant);
  };

  const handleManualEntry = (searchQuery?: string) => {
    setManualEntrySearchQuery(searchQuery || "");
    setShowManualEntry(true);
  };

  const handleManualEntrySave = (merchantData: MerchantData) => {
    onSelect(merchantData);
    setShowManualEntry(false);
  };

  const handleClearSelection = () => {
    onClear();
  };

  return (
    <div className="space-y-6">
      {/* Section Header - Matches existing form pattern */}
      <div className="rounded-md border">
        <div className="flex items-center gap-2 px-4 py-3 font-medium border-b bg-muted/30">
          <BuildingStorefrontIcon className="size-4" />
          <span>Merchant</span>
        </div>
        <div className="px-4 pb-4 pt-4 space-y-4">
          {showManualEntry ? (
            <MerchantManualEntry
              onSave={handleManualEntrySave}
              onBack={() => setShowManualEntry(false)}
              initialSearchQuery={manualEntrySearchQuery}
            />
          ) : (
            <MerchantHybridSearch
              onMerchantSelect={handleMerchantSelect}
              onManualEntry={handleManualEntry}
              selectedMerchant={selectedMerchant}
              onClearSelection={handleClearSelection}
            />
          )}

          {/* Help Text */}
          {!selectedMerchant && !showManualEntry && (
            <p className="text-gray-600 text-sm">
              Search by business name, address, or ID
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export { StepMerchant };
