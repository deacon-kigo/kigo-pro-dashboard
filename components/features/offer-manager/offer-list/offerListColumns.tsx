"use client";

import React, { memo, useState, useRef, useEffect, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/atoms/Button";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { ArrowUpDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OfferListItem, STATUS_LABELS } from "./offerListMockData";
import { OfferStatus } from "@/types/offers";

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

// Helper to format dates
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString("en-US", { month: "short" });
  const formattedMonth = month.endsWith(".") ? month : `${month}.`;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${formattedMonth} ${day}, ${year}`;
};

// Custom Offer Action Dropdown Component (matches AdActionDropdown pattern)
const OfferActionDropdown = memo(function OfferActionDropdown({
  offer,
  onEdit,
  onDelete,
}: {
  offer: OfferListItem;
  onEdit: () => void;
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
      const dropdownHeight = 160; // Approximate height for 3 menu items + header
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
    onEdit();
    setIsOpen(false);
  }, [onEdit]);

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
                Edit Offer
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
                Delete Offer
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
});

interface OfferListColumnsOptions {
  onTogglePublish: (offerId: string) => void;
  onEdit: (offerId: string) => void;
  onDelete: (offer: OfferListItem) => void;
}

export function getOfferListColumns({
  onTogglePublish,
  onEdit,
  onDelete,
}: OfferListColumnsOptions): ColumnDef<OfferListItem>[] {
  return [
    {
      accessorKey: "offerStatus",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Status
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue("offerStatus") as OfferStatus;
        const isPublished = status === "published";
        const label = isPublished ? "Published" : "Inactive";

        return (
          <div className="flex items-center">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Switch
                      checked={isPublished}
                      onCheckedChange={() => onTogglePublish(row.original.id)}
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {label}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
    {
      accessorKey: "offerName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Offer Name
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-left">{row.getValue("offerName")}</div>
      ),
    },
    {
      accessorKey: "merchantName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Merchant Name
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("merchantName")}</div>
      ),
    },
    {
      accessorKey: "redemptions",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Redemptions
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.getValue("redemptions") as number;
        return (
          <div className="text-left tabular-nums">{value.toLocaleString()}</div>
        );
      },
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          End Date
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => {
        const dateString = row.getValue("endDate") as string;
        return <div className="text-left">{formatDate(dateString)}</div>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-left font-medium">Actions</div>,
      cell: ({ row }) => {
        return (
          <div className="flex">
            <OfferActionDropdown
              offer={row.original}
              onEdit={() => onEdit(row.original.id)}
              onDelete={() => onDelete(row.original)}
            />
          </div>
        );
      },
      enableSorting: false,
    },
  ];
}
