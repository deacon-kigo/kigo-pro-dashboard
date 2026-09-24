"use client";

import type { SkeletonColumn } from "./types";

import { Button } from "@/components/prod/button";
import { Pagination } from "@/components/prod/pagination";
import { PAGE_SIZES } from "@/components/prod/pagination/constants/page-size";
import { Skeleton } from "@/components/prod/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/prod/table";
import { cn } from "@/components/prod/utils/cn";

const [DEFAULT_ROWS] = PAGE_SIZES;

interface DataTableSkeletonProps {
  columns: SkeletonColumn[];
  /**
   * Overrides the skeleton row height. Set this to match the real table's row
   * height (e.g. taller rows that render logos/avatars) so there's no layout
   * shift when the data replaces the skeleton. Defaults to `h-16`.
   */
  rowClassName?: string;
  rows?: number;
  withPagination?: boolean;
}

const getColumnKey = (column: SkeletonColumn, index: number): string => {
  if (column.type === "checkbox") return "checkbox";
  if (column.type === "actions") return "actions";

  return `col-${index.toString()}`;
};

const DataTableSkeleton = ({
  columns,
  rowClassName,
  rows = DEFAULT_ROWS,
  withPagination,
}: DataTableSkeletonProps) => (
  <div>
    <div className="overflow-auto" data-testid="data-table-skeleton">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, colIndex) => {
              const key = getColumnKey(column, colIndex);

              if (column.type === "checkbox") {
                return (
                  <TableHead className="w-8" key={key}>
                    <Skeleton
                      className="size-4 rounded"
                      data-testid="skeleton-header-checkbox"
                    />
                  </TableHead>
                );
              }

              if (column.type === "actions") {
                return (
                  <TableHead className="w-[150px]" key={key}>
                    <span className="text-muted-foreground text-sm font-medium">
                      Actions
                    </span>
                  </TableHead>
                );
              }

              return (
                <TableHead className="w-[150px]" key={key}>
                  <Skeleton
                    className="h-3.5 w-full"
                    data-testid="skeleton-header-data"
                  />
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }, (_value, rowIndex) => (
            <TableRow
              className={cn("h-16", rowClassName)}
              key={`row-${rowIndex.toString()}`}
            >
              {columns.map((column, colIndex) => {
                const columnKey = getColumnKey(column, colIndex);
                const cellKey = `${rowIndex.toString()}-${columnKey}`;

                if (column.type === "checkbox") {
                  return (
                    <TableCell key={cellKey}>
                      <Skeleton
                        className="size-4 rounded"
                        data-testid={`skeleton-${cellKey}`}
                        style={{
                          animationDelay: `${(rowIndex * 75).toString()}ms`,
                        }}
                      />
                    </TableCell>
                  );
                }

                if (column.type === "actions") {
                  return (
                    <TableCell key={cellKey}>
                      <Button
                        className="text-base"
                        color="secondary"
                        disabled
                        size="xs"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  );
                }

                return (
                  <TableCell key={cellKey}>
                    <Skeleton
                      className="h-3.5 w-full"
                      data-testid={`skeleton-${cellKey}`}
                      style={{
                        animationDelay: `${(rowIndex * 75).toString()}ms`,
                      }}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    {withPagination && (
      <div
        aria-hidden
        className="pointer-events-none opacity-50"
        data-testid="skeleton-pagination-wrapper"
        inert
      >
        <Pagination className="border-t pt-4" pageCount={1} rowCount={0} />
      </div>
    )}
  </div>
);

export { DataTableSkeleton };
