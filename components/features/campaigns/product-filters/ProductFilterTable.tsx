"use client";

import React, { memo, useMemo } from "react";
import { DataTable } from "@/components/organisms/DataTable";
import { ColumnDef, CellContext } from "@tanstack/react-table";
import {
  ProductFilter,
  productFilterColumns,
  formatDate,
} from "./productFilterColumns";

interface ProductFilterTableProps {
  data: ProductFilter[];
  className?: string;
  searchQuery?: string; // Optional search query for highlighting
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
}: ProductFilterTableProps) {
  // Create modified column definitions with highlighting for search matches
  const highlightedColumns = useMemo(() => {
    const textFields = [
      "name",
      "description",
      "queryView",
      "createdBy",
      "createdDate",
      "expiryDate",
      "publisherSpecific", // We'll handle publisher column specially
    ];
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
  }, [productFilterColumns, searchQuery]);

  // We need this type assertion for compatibility with the DataTable component
  const columns = highlightedColumns as unknown as ColumnDef<
    unknown,
    unknown
  >[];

  return (
    <DataTable
      columns={columns}
      data={data as unknown[]}
      className={className}
    />
  );
});
