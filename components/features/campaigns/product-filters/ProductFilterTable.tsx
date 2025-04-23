"use client";

import React, { memo } from "react";
import { DataTable } from "@/components/organisms/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { ProductFilter, productFilterColumns } from "./productFilterColumns";

interface ProductFilterTableProps {
  data: ProductFilter[];
}

/**
 * Product Filter Table component
 * 
 * A specialized DataTable implementation specifically for product filters.
 * Uses the generic DataTable component with product filter specific configuration.
 * This is a minimal implementation with only pagination functionality.
 */
export const ProductFilterTable = memo(function ProductFilterTable({ data }: ProductFilterTableProps) {
  // Use a more aggressive type assertion to satisfy TypeScript
  const columns = productFilterColumns as unknown as ColumnDef<unknown, unknown>[];
  
  return (
    <DataTable
      columns={columns}
      data={data as unknown[]}
    />
  );
});
