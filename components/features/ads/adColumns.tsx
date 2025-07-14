"use client";

import React, { memo, useState, useRef, useEffect, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/atoms/Button";
import {
  EyeIcon,
  PencilIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  PlayIcon,
  PauseIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
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

// Simplified Ad data structure - only include what we actually have
export type Ad = {
  id: string;
  name: string; // Ad Name (max 50 characters)
  status: "Published" | "Active" | "Paused" | "Draft" | "Ended";
  merchantName: string; // Merchant
  offerName: string; // Offer
  numberOfAssets: number; // Number of Assets
  startDateTime: string; // Start day and time (US format, UTC)
  endDateTime: string; // End day and time (US format, UTC)
  totalBudgetCap?: number; // Total Budget Cap in USD (v2)
  reach?: number; // Reach (v2)
  channels: string[]; // Channels / Offer Catalog
  createdBy: string;
  createdDate: string;
  lastModified: string;
};

// Utility function to format date
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

// Utility function to format date and time in US format with UTC
export const formatDateTime = (dateTimeString: string): string => {
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
    });
  } catch {
    return dateTimeString;
  }
};

// Utility function to format channels with truncation
export const formatChannels = (
  channels: string[] = [],
  maxLength: number = 30
): string => {
  if (!channels || channels.length === 0) {
    return "No channels";
  }
  const channelsText = channels.join(", ");
  if (channelsText.length <= maxLength) {
    return channelsText;
  }
  return channelsText.substring(0, maxLength - 3) + "...";
};

// Get delivery status based on ad status
const getDeliveryStatus = (status: string): { text: string; color: string } => {
  switch (status) {
    case "Active":
      return { text: "In delivery", color: "text-green-600" };
    case "Published":
      return { text: "In review", color: "text-blue-600" };
    case "Paused":
      return { text: "Paused", color: "text-orange-600" };
    case "Draft":
      return { text: "In draft", color: "text-gray-500" };
    case "Ended":
      return { text: "Ended", color: "text-red-600" };
    default:
      return { text: status, color: "text-gray-500" };
  }
};

// Sort icon component
const SortIcon = memo(function SortIcon({
  sorted,
}: {
  sorted: false | "asc" | "desc";
}) {
  if (sorted === "asc") {
    return <ChevronUpIcon className="ml-2 h-4 w-4" />;
  } else if (sorted === "desc") {
    return <ChevronDownIcon className="ml-2 h-4 w-4" />;
  }
  return <ArrowUpDown className="ml-2 h-4 w-4" />;
});

// Custom Ad Action Dropdown Component to prevent re-rendering issues
const AdActionDropdown = memo(function AdActionDropdown({
  ad,
  onViewDetails,
  onEditAd,
  onStatusChange,
  onDelete,
}: {
  ad: Ad;
  onViewDetails: () => void;
  onEditAd: () => void;
  onStatusChange: (status: string) => void;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 192; // w-48 = 192px
      const dropdownHeight = 280; // Approximate height for all action items
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      const padding = 16;

      // Calculate horizontal position (prefer centering on button)
      let left = rect.left - 48;
      if (left + dropdownWidth > viewport.width - padding) {
        left = rect.right - dropdownWidth;
      }
      if (left < padding) {
        left = padding;
      }

      // Calculate vertical position
      let top = rect.bottom + 8;
      if (top + dropdownHeight > viewport.height - padding) {
        top = rect.top - dropdownHeight - 8;
      }
      if (top < padding) {
        top = padding;
      }

      setDropdownPosition({ top, left });
    }
  }, [isOpen]);

  const handleViewClick = useCallback(() => {
    onViewDetails();
    setIsOpen(false);
  }, [onViewDetails]);

  const handleEditClick = useCallback(() => {
    onEditAd();
    setIsOpen(false);
  }, [onEditAd]);

  const handleStatusClick = useCallback(
    (status: string) => {
      onStatusChange(status);
      setIsOpen(false);
    },
    [onStatusChange]
  );

  const handleDeleteClick = useCallback(() => {
    onDelete();
    setIsOpen(false);
  }, [onDelete]);

  return (
    <>
      <Button
        ref={buttonRef}
        variant="ghost"
        className="h-8 w-8 p-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed w-48 bg-white rounded-md shadow-lg border z-[9999]"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
          >
            <div className="py-1">
              <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
                Actions
              </div>

              {/* View/Edit Actions */}
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={handleViewClick}
              >
                <EyeIcon className="mr-2 h-4 w-4" />
                View Ad
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={handleEditClick}
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit Ad
              </button>

              <div className="border-t my-1"></div>

              {/* Status Change Actions */}
              {ad.status !== "Active" && (
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => handleStatusClick("Active")}
                >
                  <PlayIcon className="mr-2 h-4 w-4" />
                  Activate
                </button>
              )}
              {ad.status === "Active" && (
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => handleStatusClick("Paused")}
                >
                  <PauseIcon className="mr-2 h-4 w-4" />
                  Pause
                </button>
              )}
              {(ad.status === "Draft" || ad.status === "Paused") && (
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => handleStatusClick("Published")}
                >
                  <DocumentDuplicateIcon className="mr-2 h-4 w-4" />
                  Publish
                </button>
              )}
              {ad.status !== "Ended" && (
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => handleStatusClick("Ended")}
                >
                  <XMarkIcon className="mr-2 h-4 w-4" />
                  End Campaign
                </button>
              )}

              <div className="border-t my-1"></div>

              {/* Delete Action */}
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                onClick={handleDeleteClick}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete Ad
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
});

export const createAdColumns = (
  onViewDetails?: (ad: Ad) => void
): ColumnDef<Ad>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Ad Name
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className="font-medium text-left max-w-[200px] truncate"
        title={row.getValue("name")}
      >
        {row.getValue("name")}
      </div>
    ),
  },
  {
    id: "merchantAndOffer",
    header: () => (
      <div className="text-left font-medium">Merchant and Offer</div>
    ),
    cell: ({ row }) => (
      <div className="text-left max-w-[200px]">
        <div className="font-medium truncate" title={row.original.merchantName}>
          {row.original.merchantName}
        </div>
        <div
          className="text-sm text-gray-500 truncate"
          title={row.original.offerName}
        >
          {row.original.offerName}
        </div>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "numberOfAssets",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Assets
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("numberOfAssets")}</div>
    ),
  },
  {
    id: "schedule",
    header: () => <div className="text-left font-medium">Start/End Time</div>,
    cell: ({ row }) => (
      <div className="text-left max-w-[180px]">
        <div className="text-sm">
          <span className="text-gray-600">Start:</span>{" "}
          {formatDateTime(row.original.startDateTime)}
        </div>
        <div className="text-sm">
          <span className="text-gray-600">End:</span>{" "}
          {formatDateTime(row.original.endDateTime)}
        </div>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "channels",
    header: () => <div className="text-left font-medium">Channels</div>,
    cell: ({ row }) => (
      <div
        className="text-left max-w-[150px] truncate"
        title={
          row.original.channels && row.original.channels.length > 0
            ? row.original.channels.join(", ")
            : "No channels"
        }
      >
        {formatChannels(row.original.channels)}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "delivery",
    header: () => <div className="text-left font-medium">Delivery</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      const delivery = getDeliveryStatus(status);

      return (
        <div className="flex items-center text-left">
          <div className={`flex items-center ${delivery.color}`}>
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                status === "Active"
                  ? "bg-green-500"
                  : status === "Published"
                    ? "bg-blue-500"
                    : status === "Paused"
                      ? "bg-orange-500"
                      : status === "Draft"
                        ? "bg-gray-400"
                        : "bg-red-500"
              }`}
            />
            <span className="text-sm">{delivery.text}</span>
          </div>
        </div>
      );
    },
    enableSorting: false,
  },

  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const ad = row.original;
      const router = useRouter();

      // State for dialogs - following filter management pattern
      const [statusChangeDialog, setStatusChangeDialog] = useState({
        isOpen: false,
        newStatus: "",
        ad: null as Ad | null,
      });
      const [detailModalOpen, setDetailModalOpen] = useState(false);
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

      // Handler functions - following filter management pattern
      function handleViewDetails() {
        if (onViewDetails) {
          onViewDetails(ad);
        } else {
          setDetailModalOpen(true);
        }
      }

      function handleEditAd() {
        console.log("Edit ad:", ad.id);
        // TODO: Navigate to edit interface
        // router.push(`/campaign-manager/ads/${ad.id}/edit`);
      }

      function handleStatusChange(newStatus: string) {
        setStatusChangeDialog({
          isOpen: true,
          newStatus,
          ad,
        });
      }

      function handleConfirmedStatusChange() {
        const { ad: dialogAd, newStatus } = statusChangeDialog;
        if (dialogAd) {
          console.log(
            `Changing status of ad ${dialogAd.id} from ${dialogAd.status} to ${newStatus}`
          );
          // TODO: Implement actual status change logic
        }
        setStatusChangeDialog({ isOpen: false, newStatus: "", ad: null });
      }

      function handleConfirmedDelete() {
        console.log("Deleting ad:", ad.id);
        // TODO: Implement actual delete logic
        setDeleteDialogOpen(false);
      }

      return (
        <>
          <div className="flex justify-center">
            <AdActionDropdown
              ad={ad}
              onViewDetails={handleViewDetails}
              onEditAd={handleEditAd}
              onStatusChange={handleStatusChange}
              onDelete={() => setDeleteDialogOpen(true)}
            />
          </div>

          {/* Status Change Confirmation Dialog */}
          <AlertDialog
            open={statusChangeDialog.isOpen}
            onOpenChange={(open) =>
              setStatusChangeDialog((prev) => ({ ...prev, isOpen: open }))
            }
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to change the status of "{ad.name}" to{" "}
                  {statusChangeDialog.newStatus}?
                  {statusChangeDialog.newStatus === "Ended" && (
                    <div className="mt-2 text-red-600 font-medium">
                      This action cannot be undone.
                    </div>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmedStatusChange}
                  className={
                    statusChangeDialog.newStatus === "Ended"
                      ? "bg-red-600 hover:bg-red-700"
                      : ""
                  }
                >
                  {statusChangeDialog.newStatus === "Ended"
                    ? "End Ad"
                    : `Change to ${statusChangeDialog.newStatus}`}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Ad</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{ad.name}"? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmedDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Ad
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* TODO: Add Ad Detail Modal */}
          {detailModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                <h2 className="text-xl font-bold mb-4">{ad.name}</h2>
                <p className="text-gray-600 mb-4">
                  Ad details will be shown here.
                </p>
                <Button onClick={() => setDetailModalOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </>
      );
    },
    enableSorting: false,
  },
];

// Default export for backward compatibility
export const adColumns = createAdColumns();
