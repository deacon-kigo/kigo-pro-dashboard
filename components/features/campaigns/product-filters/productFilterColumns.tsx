"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/atoms/Button";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
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
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
  },
  {
    accessorKey: "criteria",
    header: "Criteria",
    cell: ({ row }) => {
      const criteriaMet = row.original.criteriaMet;
      const criteriaCount = row.original.criteriaCount;
      const mandatoryCriteriaCount = row.original.mandatoryCriteriaCount;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                {criteriaMet ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ExclamationCircleIcon className="h-5 w-5 text-amber-500" />
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
      return (
        <div className="flex space-x-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {}}
          >
            <EyeIcon className="h-4 w-4" />
            <span className="sr-only">View details</span>
          </Button>
        </div>
      );
    },
  },
];
