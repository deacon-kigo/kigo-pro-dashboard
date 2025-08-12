"use client";

import React, { memo, useCallback, useState, useEffect, useRef } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowUpDown,
  MoreHorizontal,
  ChevronDown,
  Building,
  Briefcase,
} from "lucide-react";
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
import { useToast } from "@/lib/hooks/use-toast";

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

// LinkedCampaigns cell component with hover details and deletion indicators
const LinkedCampaignsCell = memo(function LinkedCampaignsCell({
  campaigns,
}: {
  campaigns: Array<{
    id: string;
    name: string;
    partnerName: string;
    programName: string;
  }>;
}) {
  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="flex items-center text-gray-400">
        <span className="text-sm">None</span>
      </div>
    );
  }

  // Group campaigns by partner for better organization
  const campaignsByPartner = campaigns.reduce(
    (acc, campaign) => {
      if (!acc[campaign.partnerName]) {
        acc[campaign.partnerName] = [];
      }
      acc[campaign.partnerName].push(campaign);
      return acc;
    },
    {} as Record<string, typeof campaigns>
  );

  const totalCount = campaigns.length;
  const partnerCount = Object.keys(campaignsByPartner).length;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 rounded-md p-1 transition-colors">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 font-medium"
            >
              {totalCount} campaign{totalCount !== 1 ? "s" : ""}
            </Badge>
            <span className="text-xs text-gray-500">
              ({partnerCount} partner{partnerCount !== 1 ? "s" : ""})
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-md p-0 border-0">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-h-80 overflow-y-auto">
            <div className="mb-3">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <BriefcaseIcon className="h-4 w-4 text-blue-600" />
                Linked Promoted Campaigns
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {totalCount} campaign{totalCount !== 1 ? "s" : ""} across{" "}
                {partnerCount} partner{partnerCount !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="space-y-3">
              {Object.entries(campaignsByPartner).map(
                ([partnerName, partnerCampaigns]) => (
                  <div key={partnerName} className="space-y-2">
                    <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                      <BuildingOfficeIcon className="h-3.5 w-3.5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {partnerName}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {partnerCampaigns.length}
                      </Badge>
                    </div>

                    <div className="pl-5 space-y-1.5">
                      {partnerCampaigns.map((campaign) => (
                        <div
                          key={campaign.id}
                          className="flex items-start justify-between"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {campaign.name}
                            </div>
                            <div className="text-xs text-gray-600 flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {campaign.programName}
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 ml-2"
                          >
                            Active
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <ExclamationTriangleIcon className="h-3.5 w-3.5 text-amber-500" />
                This filter cannot be deleted while linked to campaigns
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
    accessorKey: "linkedCampaigns",
    header: () => <div className="text-left font-medium">Linked Campaigns</div>,
    cell: ({ row }) => {
      const campaigns = row.original.linkedCampaigns || [];
      return <LinkedCampaignsCell campaigns={campaigns} />;
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
      const { toast } = useToast();
      const buttonRef = useRef<HTMLButtonElement>(null);
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

      // Handler for CSV download
      const handleDownloadCSV = async () => {
        try {
          // Simulate CSV generation and download
          const csvContent = `Filter ID,Filter Name,Description,Status,Created Date,Linked Campaigns
${filterId},"${row.original.name}","${row.original.description}","${status}","${row.original.createdDate}","${(row.original.linkedCampaigns || []).length} campaigns"`;

          const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
          });
          const link = document.createElement("a");
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute(
            "download",
            `catalog-filter-${row.original.name}-offers.csv`
          );
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Show success toast
          toast({
            title: "✅ Download Successful",
            description: `Catalog filter offers have been downloaded as CSV.`,
            className: "!bg-green-100 !border-green-300 !text-green-800",
          });
        } catch (error) {
          toast({
            title: "❌ Download Failed",
            description: "Failed to download CSV. Please try again.",
            className: "!bg-red-100 !border-red-300 !text-red-800",
          });
        }
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
              ?.contains(buttonRef.current);

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
          {/* View Details action button matching consistent style */}
          <div className="relative">
            <Button
              ref={buttonRef}
              variant="secondary"
              className="h-8 px-3 py-1.5 font-medium"
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
              className="hidden absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
              tabIndex={-1}
            >
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-700 font-medium">
                  Filter Actions
                </div>
                <div className="h-px bg-gray-200"></div>

                {/* Download offer CSV option */}
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    document
                      .getElementById(`filter-menu-${filterId}`)
                      ?.classList.add("hidden");
                    handleDownloadCSV();
                  }}
                >
                  <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                  Download offer (CSV)
                </button>

                {/* Edit Filter option */}
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    document
                      .getElementById(`filter-menu-${filterId}`)
                      ?.classList.add("hidden");
                    handleEditFilter();
                  }}
                >
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit Filter
                </button>

                {/* Delete option - conditional based on linked campaigns */}
                {(() => {
                  const hasLinkedCampaigns =
                    row.original.linkedCampaigns &&
                    row.original.linkedCampaigns.length > 0;
                  const linkedCount = row.original.linkedCampaigns?.length || 0;

                  if (hasLinkedCampaigns) {
                    return (
                      <TooltipProvider>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed flex items-center"
                              disabled
                              onClick={(e) => e.preventDefault()}
                            >
                              <TrashIcon className="mr-2 h-4 w-4 text-gray-400" />
                              Delete Filter
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="max-w-sm">
                            <div className="p-2">
                              <div className="flex items-center gap-2 mb-2">
                                <ExclamationTriangleIcon className="h-4 w-4 text-amber-500" />
                                <span className="font-medium text-sm">
                                  Cannot Delete Filter
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                This filter is linked to {linkedCount} promoted
                                campaign{linkedCount !== 1 ? "s" : ""} and
                                cannot be deleted.
                              </p>
                              <p className="text-sm text-blue-600 font-medium">
                                Edit the filter to unlink campaigns first.
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  }

                  return (
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        document
                          .getElementById(`filter-menu-${filterId}`)
                          ?.classList.add("hidden");
                        // Open the delete confirmation dialog
                        setDeleteDialogOpen(true);
                      }}
                      style={{ color: "#dc2626" }}
                    >
                      <TrashIcon
                        className="mr-2 h-4 w-4"
                        style={{ color: "#dc2626" }}
                      />
                      Delete Filter
                    </button>
                  );
                })()}
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
