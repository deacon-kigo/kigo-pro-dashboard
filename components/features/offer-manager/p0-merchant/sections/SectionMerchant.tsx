"use client";

import React, { useState } from "react";
import MerchantHybridSearch, { MerchantData } from "../MerchantHybridSearch";
import MerchantManualEntry from "../MerchantManualEntry";

interface SectionMerchantProps {
  selectedMerchant: MerchantData | null;
  onSelect: (merchant: MerchantData) => void;
  onClear: () => void;
}

export default function SectionMerchant({
  selectedMerchant,
  onSelect,
  onClear,
}: SectionMerchantProps) {
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualEntrySearchQuery, setManualEntrySearchQuery] = useState("");

  const handleManualEntry = (searchQuery?: string) => {
    setManualEntrySearchQuery(searchQuery || "");
    setShowManualEntry(true);
  };

  const handleManualEntrySave = (merchantData: MerchantData) => {
    onSelect(merchantData);
    setShowManualEntry(false);
  };

  return (
    <div className="space-y-4">
      {showManualEntry ? (
        <MerchantManualEntry
          onSave={handleManualEntrySave}
          onBack={() => setShowManualEntry(false)}
          initialSearchQuery={manualEntrySearchQuery}
        />
      ) : (
        <MerchantHybridSearch
          onMerchantSelect={onSelect}
          onManualEntry={handleManualEntry}
          selectedMerchant={selectedMerchant}
          onClearSelection={onClear}
        />
      )}

      {!selectedMerchant && !showManualEntry && (
        <p className="text-gray-700 text-sm">
          Search by business name, address, or ID
        </p>
      )}
    </div>
  );
}
