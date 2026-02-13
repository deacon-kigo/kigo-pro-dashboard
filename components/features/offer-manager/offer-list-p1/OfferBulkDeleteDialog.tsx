"use client";

import React, { useState } from "react";
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
import { OfferListItem } from "./offerListMockData";

interface OfferBulkDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => Promise<void>;
  selectedOffers: OfferListItem[];
}

export function OfferBulkDeleteDialog({
  isOpen,
  onClose,
  onConfirmDelete,
  selectedOffers,
}: OfferBulkDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const publishedOffers = selectedOffers.filter(
    (o) => o.offerStatus === "published"
  );
  const totalCount = selectedOffers.length;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirmDelete();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Selected Offers</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <div>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {totalCount} {totalCount === 1 ? "offer" : "offers"}
              </span>
              ? This action cannot be undone.
            </div>
            {publishedOffers.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm font-medium text-amber-800 mb-2">
                  Warning: The following offers are currently published and will
                  be immediately removed:
                </p>
                <ul className="text-sm text-amber-700 space-y-1 max-h-32 overflow-y-auto">
                  {publishedOffers.map((offer) => (
                    <li key={offer.id} className="truncate">
                      &bull; {offer.offerName} — {offer.merchantName}{" "}
                      (Published)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting
              ? "Deleting..."
              : `Delete ${totalCount} ${totalCount === 1 ? "Offer" : "Offers"}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
