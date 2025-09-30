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

interface AdGroupDeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  adGroupName: string;
  adGroupStatus: string;
  adsCount?: number;
}

const AdGroupDeleteConfirmModal: React.FC<AdGroupDeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  adGroupName,
  adGroupStatus,
  adsCount = 0,
}) => {
  const isActive = adGroupStatus === "active";

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Ad Group</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <div>
              Are you sure you want to delete "{adGroupName}"? This action
              cannot be undone.
            </div>
            {adsCount > 0 && (
              <div>
                This ad group contains {adsCount}{" "}
                {adsCount === 1 ? "ad" : "ads"} that will also be deleted.
              </div>
            )}
            {isActive && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm font-medium text-amber-800">
                  ⚠️ Warning: This ad group is currently active and will be
                  removed from all live campaigns.
                </p>
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
            Delete Ad Group
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdGroupDeleteConfirmModal;
