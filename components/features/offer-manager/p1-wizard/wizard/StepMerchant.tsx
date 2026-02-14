"use client";

import React, { useState } from "react";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/solid";
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
  locked?: boolean;
}

export default function StepMerchant({
  selectedMerchant,
  onSelect,
  onClear,
  locked = false,
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

  // Locked view for published offers being edited
  if (locked && selectedMerchant) {
    return (
      <div className="space-y-6">
        <div className="rounded-md border">
          <div className="flex items-center gap-2 px-4 py-3 font-medium border-b bg-muted/30">
            <BuildingStorefrontIcon className="size-4" />
            <span>Merchant</span>
            <LockClosedIcon className="h-3.5 w-3.5 text-gray-400 ml-auto" />
          </div>
          <div className="px-4 pb-4 pt-4">
            <div className="flex items-center gap-4 p-4 rounded-lg border bg-gray-50/50">
              {selectedMerchant.logoPreview && (
                <img
                  src={selectedMerchant.logoPreview}
                  alt={selectedMerchant.dbaName}
                  className="w-12 h-12 rounded-lg object-cover opacity-80"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">
                    {selectedMerchant.dbaName}
                  </p>
                  <LockClosedIcon className="h-3.5 w-3.5 text-gray-400" />
                </div>
                {selectedMerchant.id && (
                  <p className="text-sm text-gray-500">
                    ID: {selectedMerchant.id}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-3 flex items-start gap-2 text-sm text-gray-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              <LockClosedIcon className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>
                Merchant cannot be changed after publishing. Create a new offer
                to use a different merchant.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
