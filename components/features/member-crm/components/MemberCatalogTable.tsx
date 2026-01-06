"use client";

import React, { useMemo } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { DataTable } from "@/components/organisms/DataTable/DataTable";
import { createMemberColumns } from "./memberColumns";
import { MemberWithPoints } from "../types";

interface MemberCatalogTableProps {
  members: MemberWithPoints[];
  searchQuery?: string;
  highlightedId?: string | null;
  onViewMember?: (member: MemberWithPoints) => void;
  onRowClick?: (member: MemberWithPoints) => void;
}

export function MemberCatalogTable({
  members,
  searchQuery = "",
  highlightedId = null,
  onViewMember,
  onRowClick,
}: MemberCatalogTableProps) {
  const columns = useMemo(
    () => createMemberColumns({ onViewMember }),
    [onViewMember]
  );

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-12">
      <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No members found
      </h3>
      <p className="text-sm text-gray-500">
        Try adjusting your search filters or criteria
      </p>
    </div>
  );

  return (
    <DataTable
      columns={columns}
      data={members}
      className="mt-0"
      disablePagination={false}
      emptyState={emptyState}
      getRowClassName={(row) => {
        if (!row || !row.accountId) return "cursor-pointer hover:bg-gray-50";
        return row.accountId === highlightedId
          ? "ring-2 ring-green-500 ring-offset-2 bg-green-50/50 animate-pulse cursor-pointer hover:bg-gray-50"
          : "cursor-pointer hover:bg-gray-50";
      }}
      onRowClick={onRowClick ? (row) => onRowClick(row) : undefined}
    />
  );
}
