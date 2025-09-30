"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/molecules/alert-dialog/AlertDialog";

interface BulkDeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  selectedItems: {
    campaigns: Array<{ id: string; name: string; status: string }>;
    adSets: Array<{ id: string; name: string; status: string }>;
    ads: Array<{ id: string; name: string; status: string }>;
  };
}

const BulkDeleteConfirmModal: React.FC<BulkDeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  selectedItems,
}) => {
  // Get all active items - check for both "active" and "Active" status
  const activeItems = [
    ...selectedItems.campaigns.filter(
      (item) => item.status === "active" || item.status === "Active"
    ),
    ...selectedItems.adSets.filter(
      (item) => item.status === "active" || item.status === "Active"
    ),
    ...selectedItems.ads.filter(
      (item) => item.status === "active" || item.status === "Active"
    ),
  ];

  // Debug logging
  console.log("BulkDeleteConfirmModal - selectedItems:", selectedItems);
  console.log("BulkDeleteConfirmModal - activeItems:", activeItems);

  // Get total count
  const totalCount =
    selectedItems.campaigns.length +
    selectedItems.adSets.length +
    selectedItems.ads.length;

  const getItemTypeDisplay = () => {
    const parts: string[] = [];
    if (selectedItems.campaigns.length > 0) {
      parts.push(
        `${selectedItems.campaigns.length} ${selectedItems.campaigns.length === 1 ? "campaign" : "campaigns"}`
      );
    }
    if (selectedItems.adSets.length > 0) {
      parts.push(
        `${selectedItems.adSets.length} ${selectedItems.adSets.length === 1 ? "ad group" : "ad groups"}`
      );
    }
    if (selectedItems.ads.length > 0) {
      parts.push(
        `${selectedItems.ads.length} ${selectedItems.ads.length === 1 ? "ad" : "ads"}`
      );
    }

    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
    const lastPart = parts.pop();
    return `${parts.join(", ")}, and ${lastPart}`;
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Selected Items</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <div>
              Are you sure you want to delete {getItemTypeDisplay()}? This
              action cannot be undone.
            </div>
            {activeItems.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm font-medium text-amber-800 mb-2">
                  ⚠️ Warning: The following items have active status and
                  deleting them will discontinue their attributes:
                </p>
                <ul className="text-sm text-amber-700 space-y-1 max-h-32 overflow-y-auto">
                  {selectedItems.campaigns
                    .filter(
                      (item) =>
                        item.status === "active" || item.status === "Active"
                    )
                    .map((item, index) => (
                      <li key={`campaign-${index}`} className="truncate">
                        • Campaign: {item.name} (Active)
                      </li>
                    ))}
                  {selectedItems.adSets
                    .filter(
                      (item) =>
                        item.status === "active" || item.status === "Active"
                    )
                    .map((item, index) => (
                      <li key={`adset-${index}`} className="truncate">
                        • Ad Group: {item.name} (Active)
                      </li>
                    ))}
                  {selectedItems.ads
                    .filter(
                      (item) =>
                        item.status === "active" || item.status === "Active"
                    )
                    .map((item, index) => (
                      <li key={`ad-${index}`} className="truncate">
                        • Ad: {item.name} (Active)
                      </li>
                    ))}
                </ul>
                <p className="text-sm text-amber-700 mt-2">
                  These active items will be immediately removed from all live
                  campaigns and their performance will be discontinued.
                </p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmDelete}
            style={{
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
            }}
            className="hover:bg-red-700 focus:ring-red-600"
          >
            Delete {totalCount} {totalCount === 1 ? "Item" : "Items"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BulkDeleteConfirmModal;
