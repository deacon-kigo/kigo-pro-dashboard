"use client";

/**
 * @file Publisher Manager (DES-876) — Catalog Filters tab
 * @description Lists a publisher's catalog filters in a facet-filtered, paginated
 * DataTable and visualizes the inclusion allow-list funnel as a compact strip.
 * Uses PublisherFilterBar for faceted filtering (offer type, status, free text).
 * Sits in a card container; derivation footer inside the card.
 */

import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, Copy, MoreHorizontal, Plus } from "lucide-react";

import { DataTable } from "@/components/organisms/DataTable/DataTable";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/atoms/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { PublisherFilterBar, type FacetOption } from "./PublisherFilterBar";
import { parseFilters, type FilterTag } from "./filterLogic";
import type { CatalogDerivation, CatalogFilter } from "./types";

// Status pill treatments mapped to the Badge atom's semantic variants.
const STATUS_VARIANT: Record<
  CatalogFilter["status"],
  "success" | "neutral" | "warning"
> = {
  Active: "success",
  Inactive: "neutral",
  Draft: "warning",
};

const catalogFilterColumns: ColumnDef<CatalogFilter>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "id",
    header: () => (
      <span className="font-medium text-foreground">Catalog Filter ID</span>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-xs">
          {row.original.id.slice(0, 8)}…
        </span>
        <Button
          variant="ghost"
          iconOnly
          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          icon={<Copy className="h-3.5 w-3.5" />}
          aria-label="Copy filter ID"
          onClick={() => navigator.clipboard?.writeText(row.original.id)}
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 px-3 text-sm font-medium text-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Filter Name
        <ChevronRight
          className={cn(
            "ml-1.5 h-3.5 w-3.5 shrink-0 transition-transform",
            column.getIsSorted() === "asc"
              ? "rotate-90"
              : column.getIsSorted() === "desc"
                ? "-rotate-90"
                : "rotate-0 opacity-40"
          )}
        />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "description",
    header: () => (
      <span className="font-medium text-foreground">Description</span>
    ),
    cell: ({ row }) => (
      <span className="block max-w-xs truncate text-sm text-gray-600">
        {row.original.description}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: () => <span className="font-medium text-foreground">Status</span>,
    cell: ({ row }) => (
      <Badge variant={STATUS_VARIANT[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "linkedPublishers",
    header: () => (
      <span className="font-medium text-foreground">Linked Publishers</span>
    ),
    cell: ({ row }) => {
      const count = row.original.linkedPublishers;
      return (
        <span className="text-sm text-gray-600">
          {count} {count === 1 ? "publisher" : "publishers"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="font-medium text-foreground">Actions</span>,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            iconOnly
            className="h-8 w-8 p-0"
            icon={<MoreHorizontal className="h-4 w-4" />}
            aria-label="Filter actions"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit filter</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
  },
];

export function CatalogFiltersTab({
  filters,
  derivation,
  offerTypeOptions,
}: {
  filters: CatalogFilter[];
  derivation: CatalogDerivation;
  offerTypeOptions: FacetOption[];
}) {
  const [selectedFilters, setSelectedFilters] = useState<FilterTag[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const statusOptions: FacetOption[] = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
    { label: "Draft", value: "Draft" },
  ];

  // Reset to page 1 whenever active filters change.
  useEffect(() => {
    setPage(1);
  }, [selectedFilters]);

  // Parse the filter bar selections into typed buckets then apply to data.
  const filtered = useMemo(() => {
    const { offerTypeIds, statuses, searchTerms } =
      parseFilters(selectedFilters);
    let result = filters;

    if (offerTypeIds.size > 0) {
      result = result.filter((f) =>
        f.offerTypeIds.some((id) => offerTypeIds.has(id))
      );
    }
    if (statuses.size > 0) {
      result = result.filter((f) => statuses.has(f.status));
    }
    for (const term of searchTerms) {
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(term) ||
          f.description.toLowerCase().includes(term)
      );
    }

    return result;
  }, [filters, selectedFilters]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);

  const pageData = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * pageSize,
        (currentPage - 1) * pageSize + pageSize
      ),
    [filtered, currentPage, pageSize]
  );

  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(total, (currentPage - 1) * pageSize + pageSize);

  const retained =
    derivation.masterCatalog > 0
      ? ((derivation.finalCatalog / derivation.masterCatalog) * 100).toFixed(1)
      : "0.0";

  const funnelSteps: {
    label: string;
    value: string;
    valueClassName?: string;
  }[] = [
    {
      label: "Kigo Master Catalog",
      value: derivation.masterCatalog.toLocaleString(),
    },
    {
      label: "After inclusion allow-list",
      value: derivation.afterInclusion.toLocaleString(),
    },
    { label: "Final Catalog", value: derivation.finalCatalog.toLocaleString() },
    {
      label: "Retained",
      value: `${retained}%`,
      valueClassName: "text-primary font-semibold",
    },
  ];

  const customPagination = (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-4 text-sm text-text-muted">
        <span>
          {total === 0
            ? "No filters"
            : `Showing ${start}–${end} of ${total} items`}
        </span>
        <span className="flex items-center gap-2">
          Items per page:
          <Select
            value={pageSize.toString()}
            onValueChange={(v) => {
              setPageSize(Number(v));
              setPage(1);
            }}
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
        </span>
      </div>
      <Pagination
        totalItems={total}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setPage}
      />
    </div>
  );

  return (
    <div>
      {/* A) Toolbar — filter bar + create, flush under the tab header */}
      <div className="flex items-start gap-3 border-b border-border-light px-4 py-3">
        <div className="flex-1">
          <PublisherFilterBar
            offerTypeOptions={offerTypeOptions}
            statusOptions={statusOptions}
            selectedFilters={selectedFilters}
            onFiltersChange={setSelectedFilters}
            placeholder="Filter catalog filters by offer type, status, or search…"
          />
        </div>
        <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
          Create Filter
        </Button>
      </div>

      {/* B + C) Table + pagination (flush) */}
      <DataTable
        flush
        columns={
          catalogFilterColumns as unknown as ColumnDef<unknown, unknown>[]
        }
        data={pageData}
        customPagination={customPagination}
        tableClassName="min-w-[820px]"
      />

      {/* D) Catalog Derivation — compact strip, card footer (inclusion allow-list) */}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-border-light bg-bg-light px-4 py-2.5 text-sm">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
          Catalog derivation
        </span>
        {funnelSteps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <span className="text-text-muted">{step.label}</span>
            <span
              className={cn("font-semibold text-gray-900", step.valueClassName)}
            >
              {step.value}
            </span>
            {i < funnelSteps.length - 1 && (
              <ChevronRight className="h-4 w-4 text-gray-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatalogFiltersTab;
