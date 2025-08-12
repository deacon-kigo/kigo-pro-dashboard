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
import { Button } from "@/components/atoms/Button";
import {
  ExclamationTriangleIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/atoms/Badge";
import { useRouter } from "next/navigation";
import { ProductFilter } from "./productFilterColumns";

interface CatalogFilterDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => Promise<void>;
  filter: ProductFilter;
}

export function CatalogFilterDeleteDialog({
  isOpen,
  onClose,
  onConfirmDelete,
  filter,
}: CatalogFilterDeleteDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const hasLinkedCampaigns =
    filter.linkedCampaigns && filter.linkedCampaigns.length > 0;
  const linkedCount = filter.linkedCampaigns?.length || 0;

  // Handle confirmed deletion
  const handleConfirmedDelete = async () => {
    if (hasLinkedCampaigns) return; // Shouldn't happen, but extra safety

    try {
      setIsDeleting(true);
      setDeleteError(null);
      await onConfirmDelete();
      onClose();
    } catch (error) {
      console.error("Failed to delete catalog filter:", error);
      setDeleteError("Failed to delete catalog filter. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle navigation to edit filter
  const handleEditFilter = () => {
    onClose();
    router.push(`/campaigns/product-filters/${filter.id}/edit`);
  };

  // Show error state
  if (deleteError) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              Deletion Failed
            </AlertDialogTitle>
            <AlertDialogDescription>{deleteError}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
            <Button onClick={handleConfirmedDelete} disabled={isDeleting}>
              {isDeleting ? "Retrying..." : "Retry"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Show blocked state if filter has linked campaigns
  if (hasLinkedCampaigns) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
              Cannot Delete Catalog Filter
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              <strong>"{filter.name}"</strong> cannot be deleted because it is
              currently linked to {linkedCount} promoted campaign
              {linkedCount !== 1 ? "s" : ""}.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Linked campaigns list */}
          <div className="py-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Linked Promoted Campaigns:
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filter.linkedCampaigns?.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-start justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">
                      {campaign.name}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {campaign.partnerName} • {campaign.programName}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800 ml-2"
                  >
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Action instructions */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>To delete this filter:</strong> Click "Edit Filter" below,
              then unlink it from the promoted campaigns listed above. Once
              unlinked, you'll be able to delete the filter.
            </div>
          </div>

          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
            <Button
              onClick={handleEditFilter}
              className="flex items-center gap-2"
            >
              Edit Filter
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Show safe deletion state
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            Delete Catalog Filter
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>"{filter.name}"</strong>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <Button
            onClick={handleConfirmedDelete}
            disabled={isDeleting}
            variant="destructive"
          >
            {isDeleting ? "Deleting..." : "Delete Filter"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
