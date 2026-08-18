"use client";

/**
 * @file Publisher Manager (DES-876) — Campaigns tab
 * @description Live & past campaigns for the selected publisher as a DataTable.
 * Faceted filtering and the status count-pills live in the shared toolbar row
 * owned by PublisherManagerView, so this component receives `campaigns` already
 * filtered and only renders the table.
 */

import type { ColumnDef } from "@tanstack/react-table";
import { Bell, Mail, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { DataTable } from "@/components/organisms/DataTable/DataTable";
import { Badge } from "@/components/atoms/Badge";

import type { Campaign, CampaignStatus, CommsChannel } from "./types";

/** lucide icon + label per comms channel. */
const COMMS_META: Record<CommsChannel, { icon: LucideIcon; label: string }> = {
  email: { icon: Mail, label: "Email" },
  sms: { icon: MessageSquare, label: "SMS" },
  push: { icon: Bell, label: "Push" },
};

/** Badge variant per campaign status. */
const STATUS_VARIANT: Record<CampaignStatus, "success" | "info" | "neutral"> = {
  Live: "success",
  Scheduled: "info",
  Past: "neutral",
};

const columns: ColumnDef<Campaign>[] = [
  {
    id: "campaign",
    header: () => <span className="font-medium text-foreground">Campaign</span>,
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-gray-900">{row.original.name}</div>
        <div className="text-xs text-gray-500">{row.original.id}</div>
      </div>
    ),
  },
  {
    id: "distribution",
    header: () => (
      <span className="font-medium text-foreground">Distribution</span>
    ),
    cell: ({ row }) => (
      <Badge variant="neutral">{row.original.distribution}</Badge>
    ),
  },
  {
    id: "comms",
    header: () => <span className="font-medium text-foreground">Comms</span>,
    cell: ({ row }) => (
      <div className="flex gap-1.5">
        {row.original.comms.map((channel) => {
          const { icon: Icon, label } = COMMS_META[channel];
          return (
            <span key={channel} title={label}>
              <Icon className="h-4 w-4 text-gray-500" aria-label={label} />
            </span>
          );
        })}
      </div>
    ),
  },
  {
    id: "dates",
    header: () => <span className="font-medium text-foreground">Dates</span>,
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {row.original.startDate} – {row.original.endDate}
      </span>
    ),
  },
  {
    id: "status",
    header: () => <span className="font-medium text-foreground">Status</span>,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={STATUS_VARIANT[status]}>
          {status === "Live" && (
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          )}
          {status}
        </Badge>
      );
    },
  },
  {
    id: "ctr",
    header: () => <span className="font-medium text-foreground">CTR</span>,
    cell: ({ row }) => {
      const { ctr } = row.original;
      if (ctr == null) return <span className="text-gray-400">—</span>;
      return <span className="text-gray-900">{(ctr * 100).toFixed(1)}%</span>;
    },
  },
  {
    id: "redemptions",
    header: () => (
      <span className="font-medium text-foreground">Redemptions</span>
    ),
    cell: ({ row }) => {
      const { redemptions } = row.original;
      if (redemptions == null) return <span className="text-gray-400">—</span>;
      return (
        <span className="text-gray-900">{redemptions.toLocaleString()}</span>
      );
    },
  },
];

export function CampaignsTab({
  campaigns,
}: {
  /** Already filtered by the shared toolbar in PublisherManagerView. */
  campaigns: Campaign[];
}) {
  return (
    <DataTable
      flush
      columns={columns as unknown as ColumnDef<unknown, unknown>[]}
      data={campaigns}
      disablePagination
      tableClassName="min-w-[900px]"
    />
  );
}

export default CampaignsTab;
