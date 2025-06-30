"use client";

import React, { memo, useCallback, useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/atoms/Button";
import {
  EyeIcon,
  PencilIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PlayIcon,
  PauseIcon,
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
  name: string; // Ad Name
  status: "Published" | "Active" | "Paused" | "Draft" | "Ended";
  merchantName: string; // Acts as Ad Set
  offerName: string; // Ad Creative/Offer
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
    id: "onOff",
    header: () => <div className="text-left font-medium">On/Off</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      const isActive = status === "Active";
      const isPaused = status === "Paused";
      const canToggle = isActive || isPaused;

      return (
        <div className="flex items-center">
          {canToggle ? (
            <div className="flex items-center">
              <div
                className={`w-8 h-5 rounded-full p-1 cursor-pointer transition-colors ${
                  isActive ? "bg-blue-600" : "bg-gray-300"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Toggling ad ${row.original.id}`);
                }}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white transition-transform ${
                    isActive ? "translate-x-3" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          ) : (
            <div className="w-8 h-5 rounded-full bg-gray-200 p-1">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
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
          Ad name
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
          Ad set
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className="text-left max-w-[150px] truncate"
        title={row.getValue("merchantName")}
      >
        {row.getValue("merchantName")}
      </div>
    ),
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
    accessorKey: "offerName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Creative
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className="text-left max-w-[150px] truncate"
        title={row.getValue("offerName")}
      >
        {row.getValue("offerName")}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right font-medium">Actions</div>,
    cell: ({ row }) => {
      const ad = row.original;
      const router = useRouter();
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

      const handleViewDetails = () => {
        console.log("Viewing ad details:", ad.id);
      };

      const handleEditAd = () => {
        console.log("Editing ad:", ad.id);
      };

      const handleDuplicateAd = () => {
        console.log("Duplicating ad:", ad.id);
      };

      const handleConfirmedDelete = () => {
        console.log("Deleting ad:", ad.id);
        setDeleteDialogOpen(false);
      };

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
              <DropdownMenuItem onClick={handleViewDetails}>
                <EyeIcon className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEditAd}>
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit Ad
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicateAd}>
                <DocumentDuplicateIcon className="mr-2 h-4 w-4" />
                Duplicate Ad
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteDialogOpen(true)}
                className="text-red-600"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete Ad
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the ad "{ad.name}". This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmedDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
    enableSorting: false,
  },
];
