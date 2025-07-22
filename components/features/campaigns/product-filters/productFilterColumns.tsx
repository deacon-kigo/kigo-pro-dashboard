"use client";

import React, { memo, useCallback, useState, useEffect } from "react";
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
import { ArrowUpDown, MoreHorizontal, ChevronDown } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { useResizablePanel } from "@/lib/context/ResizablePanelContext";
import { AssignToProgramsPanel } from "./AssignToProgramsPanel";
import { CatalogFilterDeleteDialog } from "./CatalogFilterDeleteDialog";

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
  linkedCampaigns?: Array<{
    id: string;
    name: string;
    partnerName: string;
    programName: string;
  }>;
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
      const router = useRouter();
      const { openPanel, closePanel } = useResizablePanel();
      // Add state for delete dialog
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

      // Handle actions for this filter
      const handleViewDetails = () => {
        router.push(`/campaigns/product-filters/${filterId}`);
      };

      const handleEditFilter = () => {
        router.push(`/campaigns/product-filters/${filterId}/edit`);
      };

      const handleManageCriteria = () => {
        router.push(`/campaigns/product-filters/${filterId}/criteria`);
      };

      const handleCopyId = () => {
        navigator.clipboard.writeText(filterId);
      };

      const handleAssignPrograms = () => {
        // Open the resizable panel with our program assignment component
        openPanel(
          <AssignToProgramsPanel
            filterId={filterId}
            filterName={row.original.name}
            onClose={closePanel}
          />
        );
      };

      // Handler for delete confirmation
      const handleConfirmedDelete = async () => {
        // Handle delete logic here
        console.log(`Deleting filter ${filterId}`);
        // In a real implementation, you would call an API and then refresh the table

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Note: Dialog will be closed by the CatalogFilterDeleteDialog component
      };

      // Add effect to close dropdown when clicking outside
      useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
          const menu = document.getElementById(`filter-menu-${filterId}`);
          if (menu && !menu.classList.contains("hidden")) {
            const isClickInside = menu.contains(event.target as Node);
            const isButtonClick = (event.target as Element)
              .closest(`button`)
              ?.textContent?.includes("View Details");

            if (!isClickInside && !isButtonClick) {
              menu.classList.add("hidden");
            }
          }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
          document.removeEventListener("mousedown", handleOutsideClick);
        };
      }, [filterId]);

      return (
        <div className="flex">
          {/* Single action button that opens dropdown */}
          <div className="relative">
            <Button
              variant="secondary"
              className="h-auto px-3 py-1.5 font-medium"
              onClick={(e) => {
                e.stopPropagation();
                // Show dropdown menu for all filter types
                const menu = document.getElementById(`filter-menu-${filterId}`);
                if (menu) {
                  menu.classList.toggle("hidden");
                }
              }}
            >
              View Details
            </Button>

            {/* Custom dropdown menu for all filter types */}
            <div
              id={`filter-menu-${filterId}`}
              className="hidden absolute top-full left-0 mt-1 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
              tabIndex={-1}
            >
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-700 font-medium">
                  Filter Actions
                </div>
                <div className="h-px bg-gray-200"></div>

                {/* Edit Filter option */}
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    document
                      .getElementById(`filter-menu-${filterId}`)
                      ?.classList.add("hidden");
                    handleEditFilter();
                  }}
                >
                  Edit Filter
                </button>

                {/* Delete option */}
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    document
                      .getElementById(`filter-menu-${filterId}`)
                      ?.classList.add("hidden");
                    // Open the delete confirmation dialog
                    setDeleteDialogOpen(true);
                  }}
                >
                  Delete Filter
                </button>
              </div>
            </div>

            {/* Enhanced delete confirmation dialog */}
            <CatalogFilterDeleteDialog
              isOpen={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
              onConfirmDelete={handleConfirmedDelete}
              filter={row.original}
            />
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
];
