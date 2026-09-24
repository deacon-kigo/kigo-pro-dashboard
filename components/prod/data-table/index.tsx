"use client";

"use no memo";

import type { DragEndEvent } from "@dnd-kit/core";
import type {
  CoreOptions,
  TableOptions,
  TableState,
} from "@tanstack/react-table";

import { useEffect, useState } from "react";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Pagination } from "@/components/prod/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/prod/table";
import { useColumnOrder } from "@/components/prod/hooks/use-column-order";
import { cn } from "@/components/prod/utils/cn";

import { DataTableSkeleton } from "./atoms/data-table-skeleton";
import { DragAlongCell } from "./atoms/drag-along-cell";
import { DraggableTableHeader } from "./atoms/draggable-table-header";
import { buildSkeletonColumns } from "./utils/build-skeleton-columns";
import { getPinnedIds } from "./utils/get-pinned-ids";
import { reorderColumns } from "./utils/reorder-columns";

interface BaseDataTableProps<TData> extends Omit<
  TableOptions<TData>,
  keyof Omit<CoreOptions<TData>, "columns" | "getRowId">
> {
  className?: string;
  data: TData[];
  emptyMessage?: string;
  isManual?: boolean;
  /** Noun for the counted rows in the pagination footer. Defaults to "items". */
  itemNoun?: string;
  pageCount?: number;
  state?: Partial<TableState>;
}

type DataTableProps<TData> = (
  | DataTableWithDraggableColumns
  | DataTableWithoutDraggableColumns
) &
  (
    | DataTableWithoutPaginationProps<TData>
    | DataTableWithPaginationProps<TData>
  );

interface DataTableWithDraggableColumns {
  hasDraggableColumns: true;
  tableId: string;
}

interface DataTableWithoutDraggableColumns {
  hasDraggableColumns?: false;
  tableId?: never;
}

interface DataTableWithoutPaginationProps<
  TData,
> extends BaseDataTableProps<TData> {
  rowCount?: never;
  withPagination: false;
}

interface DataTableWithPaginationProps<
  TData,
> extends BaseDataTableProps<TData> {
  rowCount: number;
  withPagination?: true;
}

function DataTable<TData>({
  className,
  columns,
  data,
  emptyMessage = "No results.",
  enableRowSelection = false,
  hasDraggableColumns = false,
  isManual = false,
  itemNoun,
  onRowSelectionChange,
  pageCount,
  rowCount,
  state,
  tableId,
  withPagination = true,
  ...props
}: DataTableProps<TData>) {
  const [mounted, setMounted] = useState(!hasDraggableColumns);

  useEffect(() => {
    if (hasDraggableColumns) {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setMounted(true);
    }
  }, [hasDraggableColumns]);

  const { columnOrder, onColumnOrderChange } = useColumnOrder({
    columns,
    tableId: tableId ?? "",
  });

  const pinnedIds = getPinnedIds(columns);

  const sortableColumnOrder = columnOrder.filter((id) => !pinnedIds.has(id));

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {})
  );

  const table = useReactTable({
    autoResetPageIndex: true,
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: isManual,
    manualPagination: isManual,
    manualSorting: isManual,
    ...(rowCount && { rowCount }),
    ...(!isManual &&
      withPagination && {
        getPaginationRowModel: getPaginationRowModel(),
      }),
    ...(state && {
      state: { ...state, ...(hasDraggableColumns && { columnOrder }) },
    }),
    ...(!state && hasDraggableColumns && { state: { columnOrder } }),
    ...(pageCount && { pageCount }),
    enableRowSelection,
    ...(enableRowSelection && {
      onRowSelectionChange,
    }),
    ...(hasDraggableColumns && { onColumnOrderChange }),
    ...props,
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      onColumnOrderChange((prev) => {
        const sortable = prev.filter((id) => !pinnedIds.has(id));

        return reorderColumns({
          columnOrder: prev,
          newIndex: sortable.indexOf(over.id as string),
          oldIndex: sortable.indexOf(active.id as string),
          pinnedIds,
        });
      });
    }
  };

  const pagination = withPagination ? (
    <Pagination
      className="border-t pt-4"
      {...(itemNoun && { itemNoun })}
      pageCount={pageCount ?? table.getPageCount()}
      rowCount={rowCount!}
    />
  ) : null;

  const tableContent = (
    <div>
      <div className={cn("overflow-auto", className)} data-testid="data-table">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {hasDraggableColumns ? (
                  <SortableContext
                    items={sortableColumnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    {headerGroup.headers.map((header) => (
                      <DraggableTableHeader header={header} key={header.id} />
                    ))}
                  </SortableContext>
                ) : (
                  headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: header.column.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="h-16"
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                >
                  {hasDraggableColumns ? (
                    <SortableContext
                      items={sortableColumnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <DragAlongCell cell={cell} key={cell.id} />
                      ))}
                    </SortableContext>
                  ) : (
                    row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {withPagination && pagination}
    </div>
  );

  /*
   * * Briefly show skeleton when hasDraggableColumns is true to avoid hydration mismatch,
   * * since the column order is loaded in a useLayoutEffect in useColumnOrder hook
   */
  if (hasDraggableColumns && !mounted) {
    return (
      <DataTableSkeleton
        columns={buildSkeletonColumns(columns)}
        {...(state?.pagination?.pageSize !== undefined && {
          rows: state.pagination.pageSize,
        })}
        withPagination={withPagination}
      />
    );
  }

  if (hasDraggableColumns) {
    return (
      <DndContext
        collisionDetection={closestCenter}
        id={tableId!}
        modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        {tableContent}
      </DndContext>
    );
  }

  return tableContent;
}

export { DataTable };
