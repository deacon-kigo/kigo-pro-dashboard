import { arrayMove } from "@dnd-kit/sortable";

const reorderColumns = ({
  columnOrder,
  newIndex,
  oldIndex,
  pinnedIds,
}: {
  columnOrder: string[];
  newIndex: number;
  oldIndex: number;
  pinnedIds: Set<string>;
}) => {
  const sortable = columnOrder.filter((id) => !pinnedIds.has(id));
  const reordered = arrayMove(sortable, oldIndex, newIndex);

  let sortableIdx = 0;

  return columnOrder.map((id) => {
    if (pinnedIds.has(id)) {
      return id;
    }

    const next = reordered[sortableIdx]!;

    sortableIdx += 1;

    return next;
  });
};

export { reorderColumns };
