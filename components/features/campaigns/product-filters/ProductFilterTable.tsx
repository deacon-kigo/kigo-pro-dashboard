"use client";

import React, { memo, useMemo, useState, useCallback } from "react";
import { DataTable } from "@/components/organisms/DataTable";
import { ColumnDef, CellContext } from "@tanstack/react-table";
import {
  ProductFilter,
  productFilterColumns,
  formatDate,
} from "./productFilterColumns";
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

interface ProductFilterTableProps {
  data: ProductFilter[];
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
 * Product Filter Table component
 *
 * A specialized DataTable implementation specifically for product filters.
 * Uses the generic DataTable component with product filter specific configuration.
 * Supports highlighting search matches when searchQuery is provided.
 */
export const ProductFilterTable = memo(function ProductFilterTable({
  data,
  className,
  searchQuery = "", // Default to empty string
  currentPage: externalCurrentPage,
  pageSize: externalPageSize,
  onPageChange: externalPageChange,
  onPageSizeChange: externalPageSizeChange,
  onRowSelectionChange,
  rowSelection = {}, // Default to empty object if not provided
}: ProductFilterTableProps) {
  // Use internal state only if external state is not provided
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(5); // Default page size

  // Determine which state to use (external or internal)
  const currentPage = useMemo(
    () =>
      externalCurrentPage !== undefined
        ? externalCurrentPage
        : internalCurrentPage,
    [externalCurrentPage, internalCurrentPage]
  );

  const pageSize = useMemo(
    () =>
      externalPageSize !== undefined ? externalPageSize : internalPageSize,
    [externalPageSize, internalPageSize]
  );

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

  // Create modified column definitions with highlighting for search matches
  const highlightedColumns = useMemo(() => {
    if (!searchQuery.trim()) {
      return productFilterColumns;
    }

    return productFilterColumns.map((col) => {
      if (
        Object.prototype.hasOwnProperty.call(col, "accessorKey") &&
        typeof (col as any).accessorKey === "string"
      ) {
        const accessorKey = (col as any).accessorKey as string;
        const originalCell = col.cell;

        // Publisher column
        if (accessorKey === "publisherSpecific") {
          return {
            ...col,
            cell: (props: CellContext<ProductFilter, unknown>) => {
              const publisherSpecific = props.row.original.publisherSpecific;
              const publisherName = props.row.original.publisherName;
              const label = publisherSpecific
                ? publisherName || "Publisher Specific"
                : "General";
              const lowerLabel = label.toLowerCase();
              const lowerQuery = searchQuery.toLowerCase();
              if (!lowerLabel.includes(lowerQuery)) {
                return typeof originalCell === "function" ? (
                  originalCell(props)
                ) : (
                  <span className="text-muted-foreground text-left">
                    {label}
                  </span>
                );
              }
              const startIndex = lowerLabel.indexOf(lowerQuery);
              const endIndex = startIndex + lowerQuery.length;
              return (
                <span className="text-left">
                  {label.substring(0, startIndex)}
                  <span className="bg-yellow-200 font-medium">
                    {label.substring(startIndex, endIndex)}
                  </span>
                  {label.substring(endIndex)}
                </span>
              );
            },
          };
        }

        // Date columns
        if (accessorKey === "createdDate" || accessorKey === "expiryDate") {
          return {
            ...col,
            cell: (props: CellContext<ProductFilter, unknown>) => {
              const dateString = props.row.getValue(accessorKey) as string;
              const formatted = formatDate(dateString);
              const lowerFormatted = formatted.toLowerCase();
              const lowerQuery = searchQuery.toLowerCase();
              if (!lowerFormatted.includes(lowerQuery)) {
                return typeof originalCell === "function" ? (
                  originalCell(props)
                ) : (
                  <div className="text-left">{formatted}</div>
                );
              }
              const startIndex = lowerFormatted.indexOf(lowerQuery);
              const endIndex = startIndex + lowerQuery.length;
              return (
                <div className="text-left">
                  {formatted.substring(0, startIndex)}
                  <span className="bg-yellow-200 font-medium">
                    {formatted.substring(startIndex, endIndex)}
                  </span>
                  {formatted.substring(endIndex)}
                </div>
              );
            },
          };
        }

        // Other text fields
        if (
          ["name", "description", "queryView", "createdBy"].includes(
            accessorKey
          )
        ) {
          return {
            ...col,
            cell: (props: CellContext<ProductFilter, unknown>) => {
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

  return (
    <div className={cn("space-y-4", className)}>
      <DataTable
        columns={columns}
        data={currentPageData as unknown[]}
        className={className}
        disablePagination={false}
        rowSelection={rowSelection}
        onRowSelectionChange={handleRowSelectionChange}
        customPagination={customPagination}
      />
    </div>
  );
});
