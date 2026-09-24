import type { ColumnDef } from "@tanstack/react-table";

const getColumnId = <TData>(column: ColumnDef<TData>) => {
  if ("accessorKey" in column && typeof column.accessorKey === "string") {
    return column.id ?? column.accessorKey;
  }

  return column.id!;
};

const getColumnIds = <TData>(columns: ColumnDef<TData>[]) =>
  columns.map(getColumnId);

export { getColumnId, getColumnIds };
