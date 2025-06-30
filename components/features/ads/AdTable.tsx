"use client";

import React, { memo, useMemo, useState, useCallback } from "react";
import { DataTable } from "@/components/organisms/DataTable";
import { ColumnDef, CellContext } from "@tanstack/react-table";
import { Ad, adColumns, formatDate } from "./adColumns";
import { Pagination } from "@/components/atoms/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";

// Type for selected rows - reuse this where needed
export type SelectedRows = Record<string, boolean>;

interface AdTableProps {
  data: Ad[];
  className?: string;
  searchQuery?: string; // Optional search query for highlighting
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (value: string) => void;
  onRowSelectionChange?: (selectedRows: SelectedRows) => void;
  rowSelection?: SelectedRows;
}

/**
 * Ad Table component
 *
 * A specialized DataTable implementation specifically for ads.
 * Uses the generic DataTable component with ad-specific configuration.
 * Supports highlighting search matches when searchQuery is provided.
 */
export const AdTable = memo(function AdTable({
  data,
  className,
  searchQuery = "", // Default to empty string
  currentPage: externalCurrentPage,
  pageSize: externalPageSize,
  onPageChange: externalPageChange,
  onPageSizeChange: externalPageSizeChange,
  onRowSelectionChange,
  rowSelection = {}, // Default to empty object if not provided
}: AdTableProps) {
  // Use internal state only if external state is not provided
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(5); // Default page size

  // Determine which state to use (external or internal)
  const currentPage =
    externalCurrentPage !== undefined
      ? externalCurrentPage
      : internalCurrentPage;

  const pageSize =
    externalPageSize !== undefined ? externalPageSize : internalPageSize;

  // Handle page change - memoize with useCallback
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

  // Handle page size change - memoize with useCallback
  const handlePageSizeChange = useCallback(
    (value: string) => {
      if (externalPageSizeChange) {
        externalPageSizeChange(value);
      } else {
        const newPageSize = parseInt(value, 10);
        setInternalPageSize(newPageSize);
        // Reset to page 1 when changing page size
        setInternalCurrentPage(1);
      }
    },
    [externalPageSizeChange]
  );

  // Simplify row selection change handler with useCallback
  const handleRowSelectionChange = useCallback(
    (selection: SelectedRows) => {
      if (onRowSelectionChange) {
        onRowSelectionChange(selection);
      }
    },
    [onRowSelectionChange]
  );

  // Calculate pagination - memoize derived values
  const paginationValues = useMemo(() => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const currentPageData = data.slice(startIndex, endIndex);

    return {
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      currentPageData,
    };
  }, [data, currentPage, pageSize]);

  const { totalItems, startIndex, endIndex, currentPageData } =
    paginationValues;

  // Create highlighted columns for search - memoize this expensive operation
  const highlightedColumns = useMemo(() => {
    if (!searchQuery.trim()) {
      return adColumns;
    }

    return adColumns.map((col) => {
      if (typeof col.accessorKey === "string") {
        const accessorKey = col.accessorKey;
        const originalCell = col.cell;

        // Handle text fields that need highlighting
        if (["name", "merchantName", "offerName"].includes(accessorKey)) {
          return {
            ...col,
            cell: (props: CellContext<Ad, unknown>) => {
              const value = props.row.getValue(accessorKey) as string;
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
                  <div className="text-left">{value}</div>
                );
              }
              // Highlight the matched text
              const startIndex = lowerValue.indexOf(lowerQuery);
              const endIndex = startIndex + lowerQuery.length;
              return (
                <div className="text-left">
                  {value.substring(0, startIndex)}
                  <span className="bg-yellow-200 font-medium">
                    {value.substring(startIndex, endIndex)}
                  </span>
                  {value.substring(endIndex)}
                </div>
              );
            },
          };
        }
      }
      return col;
    });
  }, [searchQuery]);

  // We need this type assertion for compatibility with the DataTable component
  const columns = highlightedColumns as unknown as ColumnDef<
    unknown,
    unknown
  >[];

  // Memoize the selection count for display
  const selectionCount = useMemo(
    () => Object.keys(rowSelection).filter((key) => rowSelection[key]).length,
    [rowSelection]
  );

  // Memoize pagination component
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

  // Memoize the custom pagination UI
  const customPagination = useMemo(
    () => (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div>
            {totalItems === 0 ? (
              <span>No ads</span>
            ) : (
              <span>
                Showing {startIndex + 1}-{endIndex} of {totalItems} ads
              </span>
            )}
          </div>

          <div className="flex items-center ml-4">
            <span className="mr-2">Ads per page:</span>
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
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {selectionCount > 0 && (
            <div className="mr-4 text-sm">{selectionCount} selected</div>
          )}
          {paginationElement}
        </div>
      </div>
    ),
    [
      totalItems,
      startIndex,
      endIndex,
      pageSize,
      handlePageSizeChange,
      selectionCount,
      paginationElement,
    ]
  );

  // Memoize the final component to render
  const tableComponent = useMemo(
    () => (
      <DataTable
        columns={columns}
        data={currentPageData as unknown[]}
        className={className}
        disablePagination={false}
        rowSelection={rowSelection}
        onRowSelectionChange={handleRowSelectionChange}
        customPagination={customPagination}
      />
    ),
    [
      columns,
      currentPageData,
      className,
      rowSelection,
      handleRowSelectionChange,
      customPagination,
    ]
  );

  return <div className={cn("space-y-4", className)}>{tableComponent}</div>;
});
