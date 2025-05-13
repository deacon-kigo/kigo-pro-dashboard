"use client";

import React, { memo, useCallback, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/atoms/Button";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the shape of our data
export type ProductFilter = {
  id: string;
  name: string;
  queryView: string;
  description: string;
  createdBy: string;
  createdDate: string;
  expiryDate: string;
  status: "Active" | "Expired" | "Draft";
  publisherSpecific?: boolean;
  publisherName?: string;
  criteriaMet: boolean;
  criteriaCount: number;
  mandatoryCriteriaCount: number;
};

// Helper function to format dates in the required format
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString("en-US", { month: "short" });
  // Format month with period if not already ending with period
  const formattedMonth = month.endsWith(".") ? month : `${month}.`;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${formattedMonth} ${day}, ${year}`;
};

// The required criteria types
const MANDATORY_CRITERIA = [
  "MerchantKeyword",
  "MerchantName",
  "OfferCommodity",
  "OfferKeyword",
];

// Component for sort icon
const SortIcon = ({ sorted }: { sorted?: "asc" | "desc" | false }) => {
  if (sorted === "asc")
    return <ChevronUpIcon className="ml-2 h-4 w-4 text-primary" />;
  if (sorted === "desc")
    return <ChevronDownIcon className="ml-2 h-4 w-4 text-primary" />;
  return (
    <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground opacity-50" />
  );
};

// Extremely simplified ActionMenu component following shadcn exactly
const ActionMenu = memo(function ActionMenu({
  isDraft,
  filterId,
}: {
  isDraft: boolean;
  filterId: string;
}) {
  const payment = { id: filterId }; // Just for demonstration

  return (
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
          onClick={() =>
            console.log(isDraft ? "Edit filter" : "View details", filterId)
          }
        >
          {isDraft ? "Edit filter" : "View details"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => console.log("Duplicate filter", filterId)}
        >
          Duplicate
        </DropdownMenuItem>
        {!isDraft && (
          <DropdownMenuItem
            onClick={() => console.log("Extend expiry for filter", filterId)}
          >
            Extend expiry
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => console.log("Delete filter", filterId)}
          className="text-red-600"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export const productFilterColumns: ColumnDef<ProductFilter>[] = [
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
          Filter Name
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium text-left">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Description
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[500px] truncate text-left" title={description}>
          {description || "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "publisherSpecific",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Publisher
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const publisherSpecific = row.original.publisherSpecific;
      const publisherName = row.original.publisherName;

      if (!publisherSpecific) {
        return <span className="text-muted-foreground text-left">General</span>;
      }

      return (
        <span className="text-left">
          {publisherName || "Publisher Specific"}
        </span>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const publisherA = rowA.original.publisherSpecific
        ? rowA.original.publisherName || "Publisher Specific"
        : "General";
      const publisherB = rowB.original.publisherSpecific
        ? rowB.original.publisherName || "Publisher Specific"
        : "General";
      return publisherA.localeCompare(publisherB);
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Status
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <div className="flex items-center text-left">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              status === "Active"
                ? "bg-green-100 text-green-800"
                : status === "Expired"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-left font-medium">Actions</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isDraft = status === "Draft";
      const filterId = row.original.id;

      return <ActionMenu isDraft={isDraft} filterId={filterId} />;
    },
    enableSorting: false,
  },
];
