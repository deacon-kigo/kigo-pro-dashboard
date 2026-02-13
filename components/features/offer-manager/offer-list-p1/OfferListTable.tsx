"use client";

import React, { memo, useMemo, useState, useCallback } from "react";
import { DataTable } from "@/components/organisms/DataTable";
import { ColumnDef, CellContext } from "@tanstack/react-table";
import { Pagination } from "@/components/atoms/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select";
import { cn } from "@/lib/utils";
import { OfferListItem } from "./offerListMockData";
import { getOfferListColumns, formatDate } from "./offerListColumns";

// Row styling based on offer status
function getOfferRowClassName(row: unknown): string {
  const offer = row as OfferListItem;
  if (offer.offerStatus === "expired" || offer.offerStatus === "archived") {
    return "opacity-60";
  }
  return "";
}

interface OfferListTableProps {
  data: OfferListItem[];
  className?: string;
  searchQuery?: string;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (value: string) => void;
  onEdit: (offerId: string) => void;
  onDelete: (offer: OfferListItem) => void;
  onRowClick?: (row: OfferListItem) => void;
  emptyState?: React.ReactNode;
}

export const OfferListTable = memo(function OfferListTable({
  data,
  className,
  searchQuery = "",
  currentPage: externalCurrentPage,
  pageSize: externalPageSize,
  onPageChange: externalPageChange,
  onPageSizeChange: externalPageSizeChange,
  onEdit,
  onDelete,
  onRowClick,
  emptyState,
}: OfferListTableProps) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(10);

  const currentPage =
    externalCurrentPage !== undefined
      ? externalCurrentPage
      : internalCurrentPage;

  const pageSize =
    externalPageSize !== undefined ? externalPageSize : internalPageSize;

  const handlePageChange = useCallback(
    (page: number) => {
      if (externalPageChange) {
        externalPageChange(page);
      } else {
        setInternalCurrentPage(page);
      }
    },
    [externalPageChange]
  );

  const handlePageSizeChange = useCallback(
    (value: string) => {
      if (externalPageSizeChange) {
        externalPageSizeChange(value);
      } else {
        const newPageSize = parseInt(value, 10);
        setInternalPageSize(newPageSize);
        setInternalCurrentPage(1);
      }
    },
    [externalPageSizeChange]
  );

  // Pagination calculations
  const paginationValues = useMemo(() => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const currentPageData = data.slice(startIndex, endIndex);

    return { totalItems, totalPages, startIndex, endIndex, currentPageData };
  }, [data, currentPage, pageSize]);

  const { totalItems, startIndex, endIndex, currentPageData } =
    paginationValues;

  // Base columns with callbacks
  const baseColumns = useMemo(
    () =>
      getOfferListColumns({
        onEdit,
        onDelete,
      }),
    [onEdit, onDelete]
  );

  // Columns with search highlighting on offerName
  const highlightedColumns = useMemo(() => {
    if (!searchQuery.trim()) {
      return baseColumns;
    }

    return baseColumns.map((col) => {
      if (
        Object.prototype.hasOwnProperty.call(col, "accessorKey") &&
        (col as any).accessorKey === "offerName"
      ) {
        const originalCell = col.cell;

        return {
          ...col,
          cell: (props: CellContext<OfferListItem, unknown>) => {
            const value = props.row.getValue("offerName") as string;
            if (!value) {
              return typeof originalCell === "function" ? (
                originalCell(props)
              ) : (
                <div className="text-left">-</div>
              );
            }
            const lowerValue = value.toLowerCase();
            const lowerQuery = searchQuery.toLowerCase();
            if (!lowerValue.includes(lowerQuery)) {
              return typeof originalCell === "function" ? (
                originalCell(props)
              ) : (
                <div className="font-medium text-left">{value}</div>
              );
            }
            const matchStart = lowerValue.indexOf(lowerQuery);
            const matchEnd = matchStart + lowerQuery.length;
            return (
              <div className="font-medium text-left">
                {value.substring(0, matchStart)}
                <span className="bg-yellow-200 font-medium">
                  {value.substring(matchStart, matchEnd)}
                </span>
                {value.substring(matchEnd)}
              </div>
            );
          },
        };
      }
      return col;
    });
  }, [baseColumns, searchQuery]);

  const columns = highlightedColumns as unknown as ColumnDef<
    unknown,
    unknown
  >[];

  // Pagination element
  const paginationElement = useMemo(
    () => (
      <Pagination
        totalItems={totalItems}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    ),
    [totalItems, pageSize, currentPage, handlePageChange]
  );

  // Custom pagination UI
  const customPagination = useMemo(
    () => (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div>
            {totalItems === 0 ? (
              <span>No items</span>
            ) : (
              <span>
                Showing {startIndex + 1}-{endIndex} of {totalItems} items
              </span>
            )}
          </div>

          <div className="flex items-center ml-4">
            <span className="mr-2">Items per page:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-20">
                <SelectValue>{pageSize}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">{paginationElement}</div>
      </div>
    ),
    [
      totalItems,
      startIndex,
      endIndex,
      pageSize,
      handlePageSizeChange,
      paginationElement,
    ]
  );

  const tableComponent = useMemo(
    () => (
      <DataTable
        columns={columns}
        data={currentPageData as unknown[]}
        className={className}
        disablePagination={false}
        customPagination={customPagination}
        onRowClick={onRowClick as ((row: unknown) => void) | undefined}
        emptyState={emptyState}
        getRowClassName={getOfferRowClassName}
        enableColumnDrag
      />
    ),
    [
      columns,
      currentPageData,
      className,
      customPagination,
      onRowClick,
      emptyState,
    ]
  );

  return <div className={cn("space-y-4", className)}>{tableComponent}</div>;
});
