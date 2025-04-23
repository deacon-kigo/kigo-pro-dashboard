"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useCallback, useMemo } from "react";
import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn?: string;
  filterPlaceholder?: string;
  hideColumnVisibility?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
  filterPlaceholder = "Filter...",
  hideColumnVisibility = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Memoize table options to prevent unnecessary recalculations
  const tableOptions = useMemo(
    () => ({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        pagination: {
          pageIndex: 0,
          pageSize: rowsPerPage,
        },
      },
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
    }),
    [data, columns, sorting, columnFilters, columnVisibility, rowsPerPage]
  );

  // Create the table instance with memoized options
  const table = useReactTable(tableOptions);

  // Memoize handlers to prevent recreation on each render
  const handleFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (filterColumn) {
        table.getColumn(filterColumn)?.setFilterValue(event.target.value);
      }
    },
    [table, filterColumn]
  );

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
    [table.getHeaderGroups()]
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
    [table.getRowModel, columns.length]
  );

  const columnVisibilityDropdown = useMemo(() => {
    if (hideColumnVisibility) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Columns <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }, [table.getAllColumns, hideColumnVisibility]);

  const filterInput = useMemo(() => {
    if (!filterColumn) return null;

    return (
      <Input
        placeholder={filterPlaceholder}
        value={
          (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""
        }
        onChange={handleFilterChange}
        className="max-w-sm"
      />
    );
  }, [table, filterColumn, filterPlaceholder, handleFilterChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {filterInput}
        {columnVisibilityDropdown}
      </div>
      <Card className="overflow-hidden rounded-lg">
        <div className="p-0">
          <Table>
            {tableHeaderContent}
            {tableBodyContent}
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 p-4 border-t">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} item(s) found.
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
        </div>
      </Card>
    </div>
  );
}
