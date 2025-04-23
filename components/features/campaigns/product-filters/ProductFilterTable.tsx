"use client";

import React from "react";
import { DataTable } from "@/components/organisms/DataTable";
import { ProductFilter, productFilterColumns } from "./productFilterColumns";

interface ProductFilterTableProps {
  data: ProductFilter[];
}

export function ProductFilterTable({ data }: ProductFilterTableProps) {
  return (
    <DataTable
      columns={productFilterColumns}
      data={data}
      filterColumn="name"
      filterPlaceholder="Filter by filter name..."
    />
  );
}
