"use client";

"use no memo";

import type { Header } from "@tanstack/react-table";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { flexRender } from "@tanstack/react-table";

import { TableHead } from "@/components/prod/table";
import { cn } from "@/components/prod/utils/cn";

const DraggableTableHeader = <TData,>({
  header,
}: {
  header: Header<TData, unknown>;
}) => {
  const isPinned = header.column.columnDef.meta?.isPinned ?? false;

  const {
    attributes: { role: _role, ...attributes },
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    disabled: isPinned ? { draggable: true, droppable: true } : false,
    id: header.column.id,
    transition: {
      duration: 200,
      easing: "ease",
    },
  });

  return (
    <TableHead
      className={cn(
        "relative whitespace-nowrap transition-[width] duration-200 ease-in-out",
        !isPinned && "cursor-grab active:cursor-grabbing",
        isDragging ? "!bg-primary/10 z-1 opacity-80" : "z-0"
      )}
      colSpan={header.colSpan}
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        width: header.column.getSize(),
      }}
      {...attributes}
      {...(!isPinned && listeners)}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
    </TableHead>
  );
};

export { DraggableTableHeader };
