import React, { useState, useMemo } from "react";
import {
  AlertDialog,
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
  ExclamationCircleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/atoms/Badge";
import { ProductFilter } from "./productFilterColumns";

interface CatalogFilterBulkDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (deletableFilterIds: string[]) => Promise<void>;
  selectedFilters: Array<{
    id: string;
    name: string;
  }>;
  allFilters: ProductFilter[]; // Need this to get the actual filter data
}

export function CatalogFilterBulkDeleteDialog({
  isOpen,
  onClose,
  onConfirmDelete,
  selectedFilters,
  allFilters,
}: CatalogFilterBulkDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Analyze dependencies
  const dependencyAnalysis = useMemo(() => {
    const deletableFilters: string[] = [];
    const blockedFilters: Array<{
      filterId: string;
      filterName: string;
      linkedCampaigns: Array<{
        id: string;
        name: string;
        partnerName: string;
        programName: string;
      }>;
    }> = [];

    selectedFilters.forEach((selectedFilter) => {
      const fullFilter = allFilters.find((f) => f.id === selectedFilter.id);
      const hasLinkedCampaigns =
        fullFilter?.linkedCampaigns && fullFilter.linkedCampaigns.length > 0;

      if (hasLinkedCampaigns) {
        blockedFilters.push({
          filterId: selectedFilter.id,
          filterName: selectedFilter.name,
          linkedCampaigns: fullFilter.linkedCampaigns || [],
        });
      } else {
        deletableFilters.push(selectedFilter.id);
      }
    });

    const totalDependencies = blockedFilters.reduce(
      (sum, filter) => sum + filter.linkedCampaigns.length,
      0
    );

    return {
      canDeleteAll: deletableFilters.length === selectedFilters.length,
      deletableFilters,
      blockedFilters,
      totalDependencies,
    };
  }, [selectedFilters, allFilters]);

  // Handle deletion of available filters
  const handleDeleteAvailable = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await onConfirmDelete(dependencyAnalysis.deletableFilters);
      onClose();
    } catch (error) {
      console.error("Failed to delete filters:", error);
      setDeleteError("Failed to delete filters. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle deletion of all filters (safe case)
  const handleDeleteAll = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await onConfirmDelete(selectedFilters.map((f) => f.id));
      onClose();
    } catch (error) {
      console.error("Failed to delete filters:", error);
      setDeleteError("Failed to delete filters. Please try again.");
    } finally {
      setIsDeleting(false);
    }
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
            <Button
              onClick={
                dependencyAnalysis.canDeleteAll
                  ? handleDeleteAll
                  : handleDeleteAvailable
              }
              disabled={isDeleting}
            >
              {isDeleting ? "Retrying..." : "Retry"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // All filters are safe to delete
  if (dependencyAnalysis.canDeleteAll) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              Delete {selectedFilters.length} Catalog Filter
              {selectedFilters.length !== 1 ? "s" : ""}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedFilters.length} catalog
              filter{selectedFilters.length !== 1 ? "s" : ""}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Filters to delete:
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {selectedFilters.map((filter) => (
                <div key={filter.id} className="text-sm text-gray-600">
                  • {filter.name}
                </div>
              ))}
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
            <Button
              onClick={handleDeleteAll}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting
                ? "Deleting..."
                : `Delete ${selectedFilters.length} Filter${selectedFilters.length !== 1 ? "s" : ""}`}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Some filters are blocked
  if (
    dependencyAnalysis.blockedFilters.length > 0 &&
    dependencyAnalysis.deletableFilters.length === 0
  ) {
    // All selected filters are blocked
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
              Cannot Delete Selected Filters
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              All {selectedFilters.length} selected filter
              {selectedFilters.length !== 1 ? "s are" : " is"} currently linked
              to promoted campaigns and cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Selected Filters with Dependencies:
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {dependencyAnalysis.blockedFilters.map(
                ({ filterId, filterName, linkedCampaigns }) => (
                  <div
                    key={filterId}
                    className="flex items-start justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">
                        {filterName}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Linked to {linkedCampaigns.length} campaign
                        {linkedCampaigns.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-800 ml-2"
                    >
                      {linkedCampaigns.length} Link
                      {linkedCampaigns.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>To delete these filters:</strong> Edit each filter
              individually and unlink them from their promoted campaigns, then
              try deleting again.
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Mixed state: some can be deleted, some cannot
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <InformationCircleIcon className="h-5 w-5 text-blue-500" />
            Partial Deletion Available
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {dependencyAnalysis.deletableFilters.length} of{" "}
            {selectedFilters.length} selected filters can be deleted.
            {dependencyAnalysis.blockedFilters.length} filter
            {dependencyAnalysis.blockedFilters.length !== 1 ? "s are" : " is"}{" "}
            linked to promoted campaigns.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Deletable filters */}
        {dependencyAnalysis.deletableFilters.length > 0 && (
          <div className="py-2">
            <h4 className="text-sm font-medium text-green-700 mb-2">
              ✓ Can Delete ({dependencyAnalysis.deletableFilters.length}):
            </h4>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {dependencyAnalysis.deletableFilters.map((filterId) => {
                const filter = selectedFilters.find((f) => f.id === filterId);
                return (
                  <div key={filterId} className="text-sm text-green-600">
                    • {filter?.name}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Blocked filters */}
        {dependencyAnalysis.blockedFilters.length > 0 && (
          <div className="py-2">
            <h4 className="text-sm font-medium text-amber-700 mb-2">
              ⚠ Cannot Delete ({dependencyAnalysis.blockedFilters.length}):
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {dependencyAnalysis.blockedFilters.map(
                ({ filterId, filterName, linkedCampaigns }) => (
                  <div
                    key={filterId}
                    className="flex items-start justify-between p-2 bg-amber-50 border border-amber-200 rounded"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">
                        {filterName}
                      </div>
                      <div className="text-xs text-gray-600">
                        {linkedCampaigns.length} linked campaign
                        {linkedCampaigns.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <Button
            onClick={handleDeleteAvailable}
            disabled={isDeleting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isDeleting
              ? "Deleting..."
              : `Delete Available (${dependencyAnalysis.deletableFilters.length})`}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
