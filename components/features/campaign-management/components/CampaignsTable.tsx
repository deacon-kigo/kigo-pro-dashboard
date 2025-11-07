"use client";

import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { DataTable } from "@/components/organisms/DataTable/DataTable";
import { Badge } from "@/components/atoms/Badge/Badge";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// Campaign type definition based on BRD
interface Campaign {
  id: string;
  name: string;
  partner_name: string;
  program_name: string;
  type: "promotional" | "targeted" | "seasonal";
  description: string;
  start_date: string;
  end_date: string;
  active: boolean;
  has_products: boolean;
  status: "active" | "scheduled" | "ended" | "paused" | "draft";
  created_at: string;
}

interface CampaignsTableProps {
  campaigns: Campaign[];
  searchQuery?: string;
  highlightedId?: string | null;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "active":
      return {
        variant: "default" as const,
        className: "bg-green-100 text-green-800 border-green-300",
      };
    case "scheduled":
      return {
        variant: "default" as const,
        className: "bg-blue-100 text-blue-800 border-blue-300",
      };
    case "ended":
      return {
        variant: "default" as const,
        className: "bg-red-100 text-red-800 border-red-300",
      };
    case "paused":
      return {
        variant: "default" as const,
        className: "bg-yellow-100 text-yellow-800 border-yellow-300",
      };
    case "draft":
      return {
        variant: "default" as const,
        className: "bg-gray-100 text-gray-800 border-gray-300",
      };
    default:
      return {
        variant: "default" as const,
        className: "bg-gray-100 text-gray-800 border-gray-300",
      };
  }
};

const getTypeStyle = (type: string) => {
  switch (type) {
    case "promotional":
      return {
        variant: "outline" as const,
        className: "bg-purple-50 text-purple-700 border-purple-300",
      };
    case "targeted":
      return {
        variant: "outline" as const,
        className: "bg-orange-50 text-orange-700 border-orange-300",
      };
    case "seasonal":
      return {
        variant: "outline" as const,
        className: "bg-cyan-50 text-cyan-700 border-cyan-300",
      };
    default:
      return {
        variant: "outline" as const,
        className: "bg-gray-50 text-gray-700 border-gray-300",
      };
  }
};

export function CampaignsTable({
  campaigns,
  searchQuery = "",
  highlightedId = null,
}: CampaignsTableProps) {
  const columns: ColumnDef<Campaign>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="flex items-center gap-1 font-semibold hover:text-gray-900"
            >
              Campaign Name
              {column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="h-4 w-4" />
              ) : null}
            </button>
          );
        },
        cell: ({ row }) => {
          const campaign = row.original;
          const name = row.getValue("name") as string;

          return (
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">{name}</span>
              <span className="text-sm text-gray-600">
                {campaign.description}
              </span>
              {!campaign.has_products && (
                <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                  <ExclamationTriangleIcon className="h-3 w-3" />
                  <span className="font-medium">No products linked</span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "partner_name",
        header: "Partner",
        cell: ({ row }) => {
          const campaign = row.original;
          return (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-900">
                {row.getValue("partner_name")}
              </span>
              <span className="text-xs text-gray-600">
                {campaign.program_name}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const type = row.getValue("type") as string;
          const typeStyle = getTypeStyle(type);
          return (
            <Badge {...typeStyle} className="capitalize">
              {type}
            </Badge>
          );
        },
      },
      {
        accessorKey: "start_date",
        header: ({ column }) => {
          return (
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="flex items-center gap-1 font-semibold hover:text-gray-900"
            >
              Start Date
              {column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="h-4 w-4" />
              ) : null}
            </button>
          );
        },
        cell: ({ row }) => {
          const date = row.getValue("start_date") as string;
          return (
            <div className="text-sm text-gray-900">
              {new Date(date).toLocaleDateString()}
            </div>
          );
        },
      },
      {
        accessorKey: "end_date",
        header: ({ column }) => {
          return (
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="flex items-center gap-1 font-semibold hover:text-gray-900"
            >
              End Date
              {column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="h-4 w-4" />
              ) : null}
            </button>
          );
        },
        cell: ({ row }) => {
          const date = row.getValue("end_date") as string;
          return (
            <div className="text-sm text-gray-900">
              {new Date(date).toLocaleDateString()}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const campaign = row.original;
          const status = row.getValue("status") as string;
          const statusStyle = getStatusStyle(status);

          return (
            <div className="flex flex-col gap-1">
              <Badge {...statusStyle} className="capitalize w-fit">
                {status}
              </Badge>
              {campaign.active ? (
                <span className="text-xs text-green-600">Active</span>
              ) : (
                <span className="text-xs text-gray-500">Paused</span>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={campaigns}
      className="mt-0"
      disablePagination={false}
      getRowClassName={(row) =>
        row.id === highlightedId
          ? "ring-2 ring-green-500 ring-offset-2 bg-green-50/50 animate-pulse"
          : ""
      }
    />
  );
}
