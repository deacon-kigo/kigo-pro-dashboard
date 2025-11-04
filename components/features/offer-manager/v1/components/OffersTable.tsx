"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { DataTable } from "@/components/organisms/DataTable/DataTable";
import { Badge } from "@/components/atoms/Badge/Badge";
import { Button } from "@/components/atoms/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVerticalIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

// Mock offer type definition
interface Offer {
  id: string;
  title: string;
  description: string;
  programType: "john_deere" | "yardi" | "general";
  programLabel: string;
  status: "active" | "draft" | "scheduled" | "paused";
  redemptionMethod: string;
  redemptionCount: number;
  ctr: string;
  daysRemaining?: number | null;
  scheduledDate?: string;
  offerType: string;
  campaignCount: number;
}

interface OffersTableProps {
  offers: Offer[];
  searchQuery?: string;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "active":
      return {
        variant: "default" as const,
        className: "bg-green-100 text-green-800 border-green-300",
      };
    case "draft":
      return {
        variant: "default" as const,
        className: "bg-yellow-100 text-yellow-800 border-yellow-300",
      };
    case "scheduled":
      return {
        variant: "default" as const,
        className: "bg-purple-100 text-purple-800 border-purple-300",
      };
    case "paused":
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

const getProgramStyle = (programType: string) => {
  switch (programType) {
    case "john_deere":
      return {
        variant: "outline" as const,
        className: "bg-green-50 text-green-700 border-green-300",
      };
    case "yardi":
      return {
        variant: "outline" as const,
        className: "bg-blue-50 text-blue-700 border-blue-300",
      };
    default:
      return {
        variant: "outline" as const,
        className: "bg-gray-50 text-gray-700 border-gray-300",
      };
  }
};

const OfferActions = React.memo(({ row }: { row: { original: Offer } }) => {
  const offer = row.original;

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        className="border-gray-300 hover:bg-gray-50"
      >
        <ChartBarIcon className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 hover:bg-gray-50"
          >
            <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="cursor-pointer">
            <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
          {offer.status === "active" && (
            <DropdownMenuItem className="cursor-pointer">
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Pause
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="cursor-pointer text-red-600">
            <ArchiveBoxIcon className="h-4 w-4 mr-2" />
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

OfferActions.displayName = "OfferActions";

export function OffersTable({ offers, searchQuery = "" }: OffersTableProps) {
  const columns: ColumnDef<Offer>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => {
          return (
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="flex items-center gap-1 font-semibold hover:text-gray-900"
            >
              Offer Name
              {column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="h-4 w-4" />
              ) : null}
            </button>
          );
        },
        cell: ({ row }) => {
          const offer = row.original;
          const title = row.getValue("title") as string;
          // Remove search highlighting to prevent re-renders
          // const isMatch =
          //   searchQuery &&
          //   title.toLowerCase().includes(searchQuery.toLowerCase());

          return (
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">{title}</span>
              <span className="text-sm text-gray-600">{offer.description}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "programLabel",
        header: "Program",
        cell: ({ row }) => {
          const offer = row.original;
          const programStyle = getProgramStyle(offer.programType);
          return (
            <div className="flex flex-col gap-1">
              <Badge {...programStyle}>{row.getValue("programLabel")}</Badge>
              <Badge
                variant="outline"
                className="text-xs border-gray-300 bg-white"
              >
                {offer.redemptionMethod}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const offer = row.original;
          const status = row.getValue("status") as string;
          const statusStyle = getStatusStyle(status);

          return (
            <div className="flex flex-col gap-1">
              <Badge {...statusStyle} className="capitalize w-fit">
                {status}
              </Badge>
              {offer.status === "active" && offer.daysRemaining && (
                <span className="text-xs text-gray-600">
                  {offer.daysRemaining} days left
                </span>
              )}
              {offer.status === "scheduled" && offer.scheduledDate && (
                <span className="text-xs text-gray-600">
                  {offer.scheduledDate}
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "redemptionCount",
        header: ({ column }) => {
          return (
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="flex items-center gap-1 font-semibold hover:text-gray-900"
            >
              Redemptions
              {column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="h-4 w-4" />
              ) : null}
            </button>
          );
        },
        cell: ({ row }) => {
          const count = row.getValue("redemptionCount") as number;
          return (
            <div className="font-semibold text-gray-900">
              {count.toLocaleString()}
            </div>
          );
        },
      },
      {
        accessorKey: "ctr",
        header: "CTR",
        cell: ({ row }) => {
          const ctr = row.getValue("ctr") as string;
          return <div className="font-semibold text-primary-brand">{ctr}</div>;
        },
      },
      {
        accessorKey: "campaignCount",
        header: "Campaigns",
        cell: ({ row }) => {
          const count = row.getValue("campaignCount") as number;
          return (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-300"
            >
              {count} {count === 1 ? "campaign" : "campaigns"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: OfferActions,
      },
    ],
    // Disable dependencies to prevent re-renders and dropdown menu issues
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <DataTable
      columns={columns}
      data={offers}
      className="mt-0"
      disablePagination={false}
    />
  );
}
