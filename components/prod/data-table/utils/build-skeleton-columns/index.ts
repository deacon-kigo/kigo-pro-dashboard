import type { ColumnDef } from "@tanstack/react-table";

import type { SkeletonColumn } from "../../atoms/data-table-skeleton/types";

const buildSkeletonColumns = <TData>(
  columns: ColumnDef<TData>[]
): SkeletonColumn[] =>
  columns.map((column) => {
    const id = "id" in column ? column.id : undefined;

    if (id === "select") {
      return { type: "checkbox" as const };
    }

    if (
      id === "actions" ||
      ("header" in column && column.header === "Actions")
    ) {
      return { type: "actions" as const };
    }

    return { type: "data" as const };
  });

export { buildSkeletonColumns };
