"use client";

import React, { memo, useMemo, useCallback } from "react";
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
import { getMerchantListColumns } from "./merchantColumns";
import type { Merchant } from "./types";

interface MerchantListTableProps {
  data: Merchant[];
  className?: string;
  searchQuery?: string;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: string) => void;
  onView: (merchant: Merchant) => void;
  onEdit: (merchant: Merchant) => void;
  onDelete: (merchant: Merchant) => void;
  onRowClick?: (row: Merchant) => void;
}

export const MerchantListTable = memo(function MerchantListTable({
  data,
  className,
  searchQuery = "",
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onView,
  onEdit,
  onDelete,
  onRowClick,
}: MerchantListTableProps) {
  const handlePageChange = useCallback(
    (page: number) => {
      onPageChange(page);
    },
    [onPageChange]
  );

  const handlePageSizeChange = useCallback(
    (value: string) => {
      onPageSizeChange(value);
    },
    [onPageSizeChange]
  );

  const paginationValues = useMemo(() => {
    const totalItems = data.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const currentPageData = data.slice(startIndex, endIndex);
    return { totalItems, totalPages, startIndex, endIndex, currentPageData };
  }, [data, currentPage, pageSize]);

  const { totalItems, startIndex, endIndex, currentPageData } =
    paginationValues;

  const baseColumns = useMemo(
    () =>
      getMerchantListColumns({
        onView,
        onEdit,
        onDelete,
      }),
    [onView, onEdit, onDelete]
  );

  // Highlight matching search query on the merchant name column
  const highlightedColumns = useMemo(() => {
    if (!searchQuery.trim()) {
      return baseColumns;
    }

    return baseColumns.map((col) => {
      if (
        Object.prototype.hasOwnProperty.call(col, "accessorKey") &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (col as any).accessorKey === "name"
      ) {
        const originalCell = col.cell;
        return {
          ...col,
          cell: (props: CellContext<Merchant, unknown>) => {
            const m = props.row.original;
            const value = m.name;
            const lowerValue = value.toLowerCase();
            const lowerQuery = searchQuery.toLowerCase();
            const matchStart = lowerValue.indexOf(lowerQuery);
            if (matchStart === -1) {
              return typeof originalCell === "function"
                ? originalCell(props)
                : null;
            }
            const matchEnd = matchStart + lowerQuery.length;
            return (
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-md text-lg"
                  style={{ backgroundColor: m.color }}
                  aria-hidden="true"
                >
                  <span>{m.emoji}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900">
                    {value.substring(0, matchStart)}
                    <span className="bg-yellow-200 font-semibold">
                      {value.substring(matchStart, matchEnd)}
                    </span>
                    {value.substring(matchEnd)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {m.source} · {m.category}
                  </span>
                </div>
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

  const customPagination = useMemo(
    () => (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div>
            {totalItems === 0 ? (
              <span>No merchants</span>
            ) : (
              <span>
                Showing {startIndex + 1}-{endIndex} of {totalItems} merchants
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
      />
    ),
    [columns, currentPageData, className, customPagination, onRowClick]
  );

  return <div className={cn("space-y-4", className)}>{tableComponent}</div>;
});
