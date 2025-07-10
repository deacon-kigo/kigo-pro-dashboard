"use client";

import React, { memo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/atoms/Button";
import {
  EyeIcon,
  PencilIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  TrashIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  channels: string[],
  maxLength: number = 30
): string => {
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

export const adColumns: ColumnDef<Ad>[] = [
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
        title={row.original.channels.join(", ")}
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
    header: () => <div className="text-right font-medium">Actions</div>,
    cell: ({ row }) => {
      const ad = row.original;

      return (
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => console.log("Viewing ad details:", ad.id)}
              >
                <EyeIcon className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Editing ad:", ad.id)}
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit Ad
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Duplicating ad:", ad.id)}
              >
                <DocumentDuplicateIcon className="mr-2 h-4 w-4" />
                Duplicate Ad
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => console.log("Deleting ad:", ad.id)}
                className="text-red-600"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete Ad
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableSorting: false,
  },
];
