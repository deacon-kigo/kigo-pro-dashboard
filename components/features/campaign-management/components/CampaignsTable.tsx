"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/organisms/DataTable/DataTable";
import { createCampaignColumns, Campaign } from "./campaignColumns";

interface CampaignsTableProps {
  campaigns: Campaign[];
  searchQuery?: string;
  highlightedId?: string | null;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (campaign: Campaign) => void;
  onRowClick?: (campaign: Campaign) => void;
}

export function CampaignsTable({
  campaigns,
  searchQuery = "",
  highlightedId = null,
  onEdit,
  onDelete,
  onRowClick,
}: CampaignsTableProps) {
  const columns = useMemo(
    () => createCampaignColumns({ onEdit, onDelete }),
    [onEdit, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={campaigns}
      className="mt-0"
      disablePagination={false}
      getRowClassName={(row) =>
        row.id === highlightedId
          ? "ring-2 ring-green-500 ring-offset-2 bg-green-50/50 animate-pulse cursor-pointer hover:bg-gray-50"
          : "cursor-pointer hover:bg-gray-50"
      }
      onRowClick={onRowClick ? (row) => onRowClick(row.original) : undefined}
    />
  );
}
