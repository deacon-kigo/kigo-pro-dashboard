"use client";

import {
  ColumnDef,
  ColumnOrderState,
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
import { useState, memo, ReactNode, useMemo, useCallback, useRef } from "react";
import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

// Custom CSS for selected rows + column drag styles
const customTableStyles = `
  [data-state=selected] {
    background-color: rgba(219, 234, 254, 0.5) !important; /* Lighter blue-50 */
  }

  [data-state=selected]:hover {
    background-color: rgba(219, 234, 254, 0.7) !important; /* Slightly darker on hover but still light */
  }

  th[data-dragging="true"] {
    opacity: 0.5;
    background-color: #f0f9ff;
  }

  th[data-drag-over="true"] {
    box-shadow: inset 2px 0 0 0 #3b82f6;
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
  getRowClassName?: (row: TData) => string;
  onRowClick?: (row: TData) => void;
  emptyState?: ReactNode;
  enableColumnDrag?: boolean;
}

/**
 * DataTable Component
 *
 * A minimal reusable table component with support for:
 * - Pagination
 * - Sorting
 * - Row selection
 * - Column drag-and-drop reordering (opt-in via enableColumnDrag)
 */
export const DataTable = memo(function DataTable<TData, TValue>({
  columns,
  data,
  className,
  disablePagination = false,
  customPagination,
  rowSelection = {},
  onRowSelectionChange,
  getRowClassName,
  onRowClick,
  emptyState,
  enableColumnDrag = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Column ordering state for drag-and-drop
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const dragColumnRef = useRef<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

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
      ...(enableColumnDrag && columnOrder.length > 0 ? { columnOrder } : {}),
    }),
    [sorting, pageIndex, pageSize, rowSelection, enableColumnDrag, columnOrder]
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
    onColumnOrderChange: enableColumnDrag ? setColumnOrder : undefined,
    state: tableState,
    enableRowSelection: true,
    enableMultiSort: false,
  });

  // Column drag handlers
  const handleDragStart = useCallback(
    (e: React.DragEvent, columnId: string) => {
      dragColumnRef.current = columnId;
      e.dataTransfer.effectAllowed = "move";
      // Set a transparent drag image
      const el = e.currentTarget as HTMLElement;
      el.setAttribute("data-dragging", "true");
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragColumnRef.current && dragColumnRef.current !== columnId) {
      setDragOverColumn(columnId);
    }
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetColumnId: string) => {
      e.preventDefault();
      setDragOverColumn(null);

      const sourceColumnId = dragColumnRef.current;
      if (!sourceColumnId || sourceColumnId === targetColumnId) return;

      // Get current order (or derive from columns)
      const currentOrder =
        columnOrder.length > 0
          ? [...columnOrder]
          : table.getAllLeafColumns().map((c) => c.id);

      const sourceIdx = currentOrder.indexOf(sourceColumnId);
      const targetIdx = currentOrder.indexOf(targetColumnId);

      if (sourceIdx === -1 || targetIdx === -1) return;

      // Move the column
      currentOrder.splice(sourceIdx, 1);
      currentOrder.splice(targetIdx, 0, sourceColumnId);

      setColumnOrder(currentOrder);
    },
    [columnOrder, table]
  );

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.removeAttribute("data-dragging");
    dragColumnRef.current = null;
    setDragOverColumn(null);
  }, []);

  // Memoize table components to prevent unnecessary re-renders
  const tableHeader = useMemo(
    () => (
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                draggable={enableColumnDrag}
                data-dragging={undefined}
                data-drag-over={
                  enableColumnDrag && dragOverColumn === header.id
                    ? "true"
                    : undefined
                }
                onDragStart={
                  enableColumnDrag
                    ? (e) => handleDragStart(e, header.id)
                    : undefined
                }
                onDragOver={
                  enableColumnDrag
                    ? (e) => handleDragOver(e, header.id)
                    : undefined
                }
                onDragLeave={enableColumnDrag ? handleDragLeave : undefined}
                onDrop={
                  enableColumnDrag ? (e) => handleDrop(e, header.id) : undefined
                }
                onDragEnd={enableColumnDrag ? handleDragEnd : undefined}
                className={enableColumnDrag ? "select-none" : undefined}
                style={enableColumnDrag ? { cursor: "grab" } : undefined}
              >
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
    [
      table.getHeaderGroups(),
      enableColumnDrag,
      dragOverColumn,
      handleDragStart,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleDragEnd,
    ]
  );

  const tableBody = useMemo(
    () => (
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const rowClassName = getRowClassName
              ? getRowClassName(row.original)
              : "";
            return (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={cn(
                  "hover:bg-gray-50",
                  rowClassName,
                  onRowClick && "cursor-pointer"
                )}
                onClick={(e) => {
                  // Don't trigger row click if clicking on a button or link
                  const target = e.target as HTMLElement;
                  if (
                    target.closest("button") ||
                    target.closest("a") ||
                    target.closest('[role="menuitem"]')
                  ) {
                    return;
                  }
                  onRowClick?.(row.original);
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns?.length || 1}
              className="h-24 text-center"
            >
              {emptyState || "No results."}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    ),
    [
      table.getRowModel(),
      columns?.length,
      getRowClassName,
      onRowClick,
      emptyState,
    ]
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
      <style>{customTableStyles}</style>
      <Card className="overflow-hidden rounded-lg">
        <div className="p-0">
          <Table>
            {tableHeader}
            {tableBody}
          </Table>
        </div>
        {!disablePagination && (
          <div className="flex items-center justify-end p-4 border-t">
            {customPagination || defaultPagination}
          </div>
        )}
      </Card>
    </div>
  );
});
