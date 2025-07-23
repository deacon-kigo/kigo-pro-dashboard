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
  // Media type icons
  PhotoIcon,
  RectangleStackIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

// Simplified Ad data structure - matches actual CampaignAd interface from campaignSlice
export type Ad = {
  id: string;
  name: string; // Ad Name (max 50 characters)
  status: "Published" | "Active" | "Paused" | "Draft" | "Ended";
  merchantId: string; // Merchant ID
  merchantName: string; // Merchant display name
  offerId: string; // Offer ID
  offerName: string; // Offer display name (for UI display)
  mediaType: string[]; // Media formats used (Display Banner, Double Decker, Social Media)
  mediaAssets: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    previewUrl: string;
    dimensions?: { width: number; height: number };
    mediaType?: string;
  }[];
  numberOfAssets?: number; // Number of media assets
  channels?: string[]; // Delivery channels
  startDateTime?: string; // Start date and time
  endDateTime?: string; // End date and time
  createdBy: string;
  createdDate: string;
  lastModified: string;
};

// Media type configuration with appropriate icons
const MEDIA_TYPE_CONFIG = {
  "Display Banner": {
    icon: PhotoIcon,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    label: "Banner",
  },
  "Double Decker": {
    icon: RectangleStackIcon,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    label: "Double",
  },
  "Social Media": {
    icon: ShareIcon,
    color: "bg-orange-100 text-orange-800 border-orange-200",
    label: "Social",
  },
};

// Media Types Component with Icons
const MediaTypesDisplay = memo(({ mediaTypes }: { mediaTypes: string[] }) => {
  if (!mediaTypes || mediaTypes.length === 0) {
    return <span className="text-gray-400">No media</span>;
  }

  // If there are many types, show first few + count
  const maxVisible = 2;
  const visibleTypes = mediaTypes.slice(0, maxVisible);
  const remainingCount = mediaTypes.length - maxVisible;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {visibleTypes.map((type, index) => {
        const config =
          MEDIA_TYPE_CONFIG[type as keyof typeof MEDIA_TYPE_CONFIG];
        if (!config) return null;

        const IconComponent = config.icon;

        return (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className={`${config.color} flex items-center gap-1 text-xs px-2 py-1 cursor-help`}
                >
                  <IconComponent className="w-3 h-3" />
                  <span className="hidden sm:inline">{config.label}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{type}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}

      {remainingCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="bg-gray-100 text-gray-600 border-gray-200 text-xs px-2 py-1 cursor-help"
              >
                +{remainingCount}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                {mediaTypes.slice(maxVisible).map((type, index) => (
                  <p key={index}>{type}</p>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
});

MediaTypesDisplay.displayName = "MediaTypesDisplay";

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
  onEditAd,
  onDelete,
}: {
  ad: Ad;
  onEditAd: () => void;
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
      const dropdownHeight = 120; // Reduced height for fewer actions
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

  const handleEditClick = useCallback(() => {
    onEditAd();
    setIsOpen(false);
  }, [onEditAd]);

  const handleDeleteClick = useCallback(() => {
    onDelete();
    setIsOpen(false);
  }, [onDelete]);

  return (
    <>
      <Button
        ref={buttonRef}
        variant="secondary"
        className="h-8 px-3 py-1.5 font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        View Details
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

              {/* Edit Action */}
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={handleEditClick}
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit Ad
              </button>

              {/* Delete Action */}
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center"
                onClick={handleDeleteClick}
                style={{ color: "#dc2626" }}
              >
                <TrashIcon
                  className="mr-2 h-4 w-4"
                  style={{ color: "#dc2626" }}
                />
                Delete Ad
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
});

export const createAdColumns = (): ColumnDef<Ad>[] => [
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
    accessorKey: "merchantName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Merchant
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className="font-medium text-left max-w-[150px] truncate"
        title={
          (row.original && row.original.merchantName) || "Unknown Merchant"
        }
      >
        {(row.original && row.original.merchantName) || "Unknown Merchant"}
      </div>
    ),
  },
  {
    accessorKey: "offerName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Offer
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className="text-left max-w-[200px] truncate"
        title={(row.original && row.original.offerName) || "No offer"}
      >
        {(row.original && row.original.offerName) || "No offer"}
      </div>
    ),
  },
  {
    accessorKey: "mediaType",
    header: () => <div className="text-left font-medium">Media Types</div>,
    cell: ({ row }) => (
      <MediaTypesDisplay
        mediaTypes={(row.original && row.original.mediaType) || []}
      />
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    header: () => <div className="text-left font-medium">Actions</div>,
    cell: ({ row }) => {
      const ad = row.original;
      const router = useRouter();

      // Guard against undefined ad
      if (!ad) {
        return (
          <div className="flex justify-center">
            <span className="text-gray-400">No data</span>
          </div>
        );
      }

      // State for dialogs
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

      // Handler functions
      function handleEditAd() {
        console.log("Edit ad:", ad.id);

        // Serialize the ad data to pass to the edit screen
        const editData = {
          id: ad.id,
          name: ad.name,
          merchantId: ad.merchantId,
          merchantName: ad.merchantName,
          offerId: ad.offerId,
          offerName: ad.offerName,
          mediaType: ad.mediaType,
          mediaAssets: ad.mediaAssets,
          costPerActivation: 0, // Default value since not in Ad type
          costPerRedemption: 0, // Default value since not in Ad type
        };

        // Navigate to ad creation screen with edit data
        const editParams = new URLSearchParams({
          edit: "true",
          data: JSON.stringify(editData),
        });

        router.push(`/campaign-manager/ads-create?${editParams.toString()}`);
      }

      function handleConfirmedDelete() {
        console.log("Deleting ad:", ad.id);
        // TODO: Implement actual delete logic
        setDeleteDialogOpen(false);
      }

      return (
        <>
          <div className="flex">
            <AdActionDropdown
              ad={ad}
              onEditAd={handleEditAd}
              onDelete={() => setDeleteDialogOpen(true)}
            />
          </div>

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
                <Button variant="destructive" onClick={handleConfirmedDelete}>
                  Delete Ad
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
    enableSorting: false,
  },
];

// Default export for backward compatibility
export const adColumns = createAdColumns();
