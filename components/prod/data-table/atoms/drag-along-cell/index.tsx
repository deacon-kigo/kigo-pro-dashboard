"use client";

"use no memo";

import type { Cell } from "@tanstack/react-table";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { flexRender } from "@tanstack/react-table";

import { TableCell } from "@/components/prod/table";
import { cn } from "@/components/prod/utils/cn";

const DragAlongCell = <TData,>({ cell }: { cell: Cell<TData, unknown> }) => {
  const isPinned = cell.column.columnDef.meta?.isPinned ?? false;

  const { isDragging, setNodeRef, transform, transition } = useSortable({
    disabled: isPinned ? { draggable: true, droppable: true } : false,
    id: cell.column.id,
    transition: {
      duration: 200,
      easing: "ease",
    },
  });

  return (
    <TableCell
      className={cn(
        "relative transition-[width] duration-200 ease-in-out",
        isDragging ? "bg-primary/10 z-1 opacity-80" : "z-0"
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        width: cell.column.getSize(),
      }}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
};

export { DragAlongCell };
