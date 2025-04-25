"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/atoms/Button";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
const formatDate = (dateString: string) => {
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

export const productFilterColumns: ColumnDef<ProductFilter>[] = [
  {
    accessorKey: "name",
    header: "Filter Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[250px] truncate" title={description}>
          {description || "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "queryView",
    header: "Query View",
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    accessorKey: "createdDate",
    header: "Created Date",
    cell: ({ row }) => {
      const dateString = row.getValue("createdDate") as string;
      return <div>{formatDate(dateString)}</div>;
    },
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    cell: ({ row }) => {
      const dateString = row.getValue("expiryDate") as string;
      return <div>{formatDate(dateString)}</div>;
    },
  },
  {
    accessorKey: "criteria",
    header: "Criteria",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const criteriaCount = row.original.criteriaCount;
      const mandatoryCriteriaCount = row.original.mandatoryCriteriaCount;
      const isDraft = status === "Draft";

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                {isDraft ? (
                  <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
                ) : (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                )}
                <span>{criteriaCount} criteria</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{mandatoryCriteriaCount}/4 mandatory criteria</p>
              <p>{criteriaCount - mandatoryCriteriaCount} optional criteria</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "publisherSpecific",
    header: "Publisher",
    cell: ({ row }) => {
      const publisherSpecific = row.original.publisherSpecific;
      const publisherName = row.original.publisherName;

      if (!publisherSpecific) {
        return <span className="text-muted-foreground">General</span>;
      }

      return <span>{publisherName || "Publisher Specific"}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <div className="flex items-center">
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
    header: "Actions",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isDraft = status === "Draft";

      return (
        <div className="flex space-x-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {}}
          >
            {isDraft ? (
              <PencilIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
            <span className="sr-only">
              {isDraft ? "Edit filter" : "View details"}
            </span>
          </Button>
        </div>
      );
    },
  },
];
