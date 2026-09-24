import type { ColumnDef } from "@tanstack/react-table";

import { getColumnId } from "../get-column-ids";

const getPinnedIds = <TData>(columns: ColumnDef<TData>[]) =>
  new Set(columns.filter((column) => column.meta?.isPinned).map(getColumnId));

export { getPinnedIds };
