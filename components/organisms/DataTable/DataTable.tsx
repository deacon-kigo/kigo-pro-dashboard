"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, memo, ReactNode, useMemo, useCallback } from "react";
import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

// Custom CSS for selected rows
const customTableStyles = `
  [data-state=selected] {
    background-color: rgba(219, 234, 254, 0.5) !important; /* Lighter blue-50 */
  }
  
  [data-state=selected]:hover {
    background-color: rgba(219, 234, 254, 0.7) !important; /* Slightly darker on hover but still light */
  }
`;

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  disablePagination?: boolean;
  customPagination?: ReactNode;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (selection: Record<string, boolean>) => void;
}

/**
 * DataTable Component
 *
 * A minimal reusable table component with support for:
 * - Pagination
 * - Sorting
 * - Row selection
 */
export const DataTable = memo(function DataTable<TData, TValue>({
  columns,
  data,
  className,
  disablePagination = false,
  customPagination,
  rowSelection = {},
  onRowSelectionChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Memoize handlers to prevent recreation on each render
  const handleRowSelectionChange = useCallback(
    (updatedRowSelection: unknown) => {
      if (onRowSelectionChange) {
        onRowSelectionChange(updatedRowSelection as Record<string, boolean>);
      }
    },
    [onRowSelectionChange]
  );

  const handlePreviousPage = useCallback(() => {
    setPageIndex((current) => Math.max(0, current - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPageIndex((current) => current + 1);
  }, []);

  const handleSortingChange = useCallback(
    (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
      setSorting(updaterOrValue);
    },
    []
  );

  // Memoize the table state to prevent recreating the object on each render
  const tableState = useMemo(
    () => ({
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
      rowSelection,
    }),
    [sorting, pageIndex, pageSize, rowSelection]
  );

  // Create table instance with memoized dependencies
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: handleSortingChange,
    onRowSelectionChange: handleRowSelectionChange,
    state: tableState,
    enableRowSelection: true,
  });

  // Memoize table components to prevent unnecessary re-renders
  const tableHeader = useMemo(
    () => (
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
    ),
    [table.getHeaderGroups()]
  );

  const tableBody = useMemo(
    () => (
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className="hover:bg-gray-50"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    ),
    [table.getRowModel(), columns.length]
  );

  // Memoize the default pagination UI
  const defaultPagination = useMemo(
    () => (
      <>
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getRowModel().rows.length} item(s) found.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </>
    ),
    [
      table.getRowModel().rows.length,
      table.getCanPreviousPage(),
      table.getCanNextPage(),
      handlePreviousPage,
      handleNextPage,
    ]
  );

  return (
    <div className={cn("space-y-4", className)}>
      <style jsx global>
        {customTableStyles}
      </style>
      <Card className="overflow-hidden rounded-none">
        <div className="p-0">
          <Table>
            {tableHeader}
            {tableBody}
          </Table>
        </div>
        {(!disablePagination || customPagination) && (
          <div className="flex items-center justify-end space-x-2 p-4 border-t">
            {customPagination ? (
              <div className="w-full">{customPagination}</div>
            ) : (
              defaultPagination
            )}
          </div>
        )}
      </Card>
    </div>
  );
});
