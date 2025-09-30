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
  // Get all active items
  const activeItems = [
    ...selectedItems.campaigns.filter((item) => item.status === "active"),
    ...selectedItems.adSets.filter((item) => item.status === "active"),
    ...selectedItems.ads.filter((item) => item.status === "active"),
  ];

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
                  ⚠️ Warning: The following active items will be deleted:
                </p>
                <ul className="text-sm text-amber-700 space-y-1 max-h-32 overflow-y-auto">
                  {activeItems.map((item, index) => (
                    <li key={index} className="truncate">
                      • {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmDelete}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Delete {totalCount} {totalCount === 1 ? "Item" : "Items"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BulkDeleteConfirmModal;
