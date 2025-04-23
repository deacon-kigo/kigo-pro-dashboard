"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useCallback, useMemo, memo } from "react";
import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

/**
 * DataTable Component
 * 
 * A minimal reusable table component with support for:
 * - Pagination
 * 
 * This component is heavily optimized to prevent unnecessary re-renders using:
 * - useMemo for complex calculations and JSX elements
 * - useCallback for event handlers
 * - Carefully organized dependency arrays
 * - React.memo for the entire component
 * 
 * When implementing a specialized table, create a wrapper component that
 * uses this DataTable rather than duplicating the implementation.
 */
export const DataTable = memo(function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // State declarations - these don't need memoization
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Memoize table options to prevent unnecessary recalculations
  const tableOptions = useMemo(
    () => ({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      state: {
        pagination: {
          pageIndex: 0,
          pageSize: rowsPerPage,
        },
      },
    }),
    [
      // First list stable dependencies (props and constants)
      columns, 
      rowsPerPage,
      // Then list data which might change more frequently
      data
    ]
  );

  // Create the table instance with memoized options
  const table = useReactTable(tableOptions);

  const handlePreviousPage = useCallback(() => {
    table.previousPage();
  }, [table]);

  const handleNextPage = useCallback(() => {
    table.nextPage();
  }, [table]);

  // Memoize table content elements to prevent unnecessary rerenders
  const tableHeaderContent = useMemo(
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
    [table]
  );

  const tableBodyContent = useMemo(
    () => (
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
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
    [table, columns.length]
  );

  // Pagination info and controls - memoized to prevent recreation
  const paginationControls = useMemo(() => {
    // Extract only the necessary data from the table
    const totalItems = table.getRowModel().rows.length;
    const canPreviousPage = table.getCanPreviousPage();
    const canNextPage = table.getCanNextPage();

    return (
      <div className="flex items-center justify-end space-x-2 p-4 border-t">
        <div className="flex-1 text-sm text-muted-foreground">
          {totalItems} item(s) found.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={!canPreviousPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!canNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [
    // More selective dependencies
    table.getRowModel().rows.length,
    table.getCanPreviousPage(),
    table.getCanNextPage(),
    handlePreviousPage,
    handleNextPage
  ]);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden rounded-lg">
        <div className="p-0">
          <Table>
            {tableHeaderContent}
            {tableBodyContent}
          </Table>
        </div>
        {paginationControls}
      </Card>
    </div>
  );
});
