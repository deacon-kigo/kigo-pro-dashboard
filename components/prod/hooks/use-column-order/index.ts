"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { useState } from "react";

import { getColumnIds } from "@/components/prod/data-table/utils/get-column-ids";
import { getPinnedIds } from "@/components/prod/data-table/utils/get-pinned-ids";
import { STORAGE_KEYS } from "@/components/prod/constants/storage-keys";

import { useIsomorphicLayoutEffect } from "../use-isomorphic-layout-effect";

/*
 * Reconciles a persisted column order against the current column definitions.
 *
 * Pinned columns are anchored to their canonical position (the order in which
 * they appear in the column definitions) — the saved order only governs the
 * relative order of the sortable (non-pinned) columns. This prevents a pinned
 * column (e.g. a trailing "actions" column) from drifting into the middle of
 * the table when a new column is later added to the definitions.
 */
const reconcileColumnOrder = (
  savedOrder: string[],
  currentIds: string[],
  pinnedIds: Set<string>
) => {
  const currentSet = new Set(currentIds);

  // Saved sortable ids that still exist, preserving the user's chosen order.
  const savedSortable = savedOrder.filter(
    (id) => currentSet.has(id) && !pinnedIds.has(id)
  );
  const savedSortableSet = new Set(savedSortable);

  // Sortable ids missing from the saved order, in canonical definition order.
  const newSortable = currentIds.filter(
    (id) => !pinnedIds.has(id) && !savedSortableSet.has(id)
  );

  const sortable = [...savedSortable, ...newSortable];

  // Walk the canonical skeleton: pinned ids stay put, sortable slots are filled.
  let sortableIdx = 0;

  return currentIds.map((id) => {
    if (pinnedIds.has(id)) {
      return id;
    }

    const next = sortable[sortableIdx]!;

    sortableIdx += 1;

    return next;
  });
};

const useColumnOrder = <TData>({
  columns,
  tableId,
}: {
  columns: ColumnDef<TData>[];
  tableId: string;
}) => {
  const storageKey = `${STORAGE_KEYS.local.columnOrder}:${tableId}`;
  const currentIds = getColumnIds(columns);
  const pinnedIds = getPinnedIds(columns);
  const [columnOrder, setColumnOrder] = useState<string[]>(currentIds);

  useIsomorphicLayoutEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);

      if (saved) {
        const parsed = JSON.parse(saved) as string[];

        setColumnOrder(reconcileColumnOrder(parsed, currentIds, pinnedIds));
      }
    } catch {
      // Ignore malformed localStorage data
    }
  }, []);

  const onColumnOrderChange = (
    updaterOrValue: ((prev: string[]) => string[]) | string[]
  ) => {
    setColumnOrder((prev) => {
      const next =
        typeof updaterOrValue === "function"
          ? updaterOrValue(prev)
          : updaterOrValue;

      localStorage.setItem(storageKey, JSON.stringify(next));

      return next;
    });
  };

  return { columnOrder, onColumnOrderChange };
};

export { useColumnOrder };
