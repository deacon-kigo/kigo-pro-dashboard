"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { ArrowRight, ArrowUpDown } from "lucide-react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

import { Button as SortButton } from "@/components/atoms/Button";
import { Badge } from "@/components/prod/badge";
import { Button } from "@/components/prod/button";
import { cn } from "@/components/prod/utils/cn";

import {
  CONFIDENCE_THRESHOLD,
  DISPUTE_STATUS,
  FLAG_LABEL,
  INVOICE_STATUS,
  formatSubmitted,
  invoiceDecision,
  waitingLabel,
  type DisputeRow,
  type InvoiceFlag,
  type InvoiceRow,
} from "./data";
import { StatusPill } from "./StatusPill";
import { TONE } from "./tone";

const SortIcon = ({ sorted }: { sorted: false | "asc" | "desc" }) => {
  if (sorted === "asc")
    return <ChevronUpIcon className="ml-2 h-4 w-4 text-primary" />;
  if (sorted === "desc")
    return <ChevronDownIcon className="ml-2 h-4 w-4 text-primary" />;
  return (
    <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground opacity-50" />
  );
};

const sortableHeader = (label: string) => {
  const Header = ({
    column,
  }: {
    column: {
      toggleSorting: (desc?: boolean) => void;
      getIsSorted: () => false | "asc" | "desc";
    };
  }) => (
    <SortButton
      className="hover:bg-transparent w-full justify-start px-0 font-medium"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      variant="ghost"
    >
      {label}
      <SortIcon sorted={column.getIsSorted()} />
    </SortButton>
  );
  Header.displayName = `${label}Header`;
  return Header;
};

const flagSubline = (flag: InvoiceFlag) => {
  if (flag.kind === "duplicate") return `Matches ${flag.of}`;
  if (flag.kind === "passed") return `${flag.confidence}%`;
  return `${flag.confidence}% · needs ${CONFIDENCE_THRESHOLD}%`;
};

const invoiceColumns: ColumnDef<InvoiceRow>[] = [
  {
    accessorKey: "status",
    header: sortableHeader("Status"),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        <StatusPill color={INVOICE_STATUS[row.original.status].color}>
          {INVOICE_STATUS[row.original.status].label}
        </StatusPill>
      </div>
    ),
  },
  {
    accessorKey: "invoice",
    header: sortableHeader("Invoice number"),
    cell: ({ row }) => (
      <span className="font-mono text-base">{row.original.invoice}</span>
    ),
  },
  {
    id: "flag",
    accessorFn: (row) => row.flag.confidence,
    header: sortableHeader("Flag"),
    cell: ({ row }) => {
      const { flag } = row.original;
      return (
        <div>
          <div className="flex flex-wrap items-center gap-2 text-base whitespace-nowrap">
            <span
              aria-hidden
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                TONE[FLAG_LABEL[flag.kind].tone].dot
              )}
            />
            <span className="font-medium text-gray-900">
              {FLAG_LABEL[flag.kind].label}
            </span>
            {row.original.dealerEdited && (
              <Badge
                className="text-sm"
                color="neutral"
                size="sm"
                variant="outline"
              >
                Dealer edit
              </Badge>
            )}
          </div>
          <div className="mt-0.5 text-sm text-gray-600">
            {flagSubline(flag)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "dealership",
    header: sortableHeader("Dealership"),
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-gray-900">
          {row.original.dealership}
        </div>
        <div className="text-sm text-gray-600">{row.original.city}</div>
      </div>
    ),
  },
  {
    accessorKey: "submitter",
    header: sortableHeader("Submitter"),
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-gray-900">
          {row.original.submitter}
        </div>
        <div className="text-sm text-gray-600">{row.original.email}</div>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: sortableHeader("Submitted"),
    cell: ({ row }) => (
      <div>
        <div className="text-base text-gray-900">
          {formatSubmitted(row.original.date)}
        </div>
        <div className="text-sm text-gray-600">
          {row.original.status === "pending"
            ? waitingLabel(row.original.date, row.original.time)
            : row.original.time}
        </div>
      </div>
    ),
  },
  {
    id: "actions",
    enableSorting: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="text-right">
        <Button
          color={row.original.status === "pending" ? "primary" : "secondary"}
          href={`/john-deere/invoices/${row.original.invoice}?decision=${invoiceDecision(row.original.status)}`}
          size="sm"
          variant={row.original.status === "pending" ? "default" : "outline"}
        >
          {row.original.status === "pending" ? "Review" : "View details"}
        </Button>
      </div>
    ),
  },
];

const disputeColumns: ColumnDef<DisputeRow>[] = [
  {
    accessorKey: "status",
    header: sortableHeader("Status"),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        <StatusPill color={DISPUTE_STATUS[row.original.status].color}>
          {DISPUTE_STATUS[row.original.status].label}
        </StatusPill>
      </div>
    ),
  },
  {
    accessorKey: "promotion",
    header: sortableHeader("Promotion"),
  },
  {
    id: "changes",
    accessorFn: (row) => row.changes.map((change) => change.label).join(", "),
    header: sortableHeader("Requested change"),
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {row.original.changes.map((change) => (
          <div
            className="flex flex-wrap items-center gap-x-1.5 text-base"
            key={change.field}
          >
            <span className="text-gray-500">{change.label}</span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span
                className={cn(
                  "text-gray-500 line-through",
                  change.mono && "font-mono"
                )}
              >
                {change.from}
              </span>
              <ArrowRight
                aria-hidden
                className="size-3 shrink-0 text-gray-400"
              />
              <span
                className={cn(
                  "font-medium text-gray-900",
                  change.mono && "font-mono"
                )}
              >
                {change.to}
              </span>
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "dealership",
    header: sortableHeader("Dealership"),
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-gray-900">
          {row.original.dealership}
        </div>
        <div className="text-sm text-gray-600">{row.original.city}</div>
      </div>
    ),
  },
  {
    accessorKey: "submitter",
    header: sortableHeader("Submitter"),
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-gray-900">
          {row.original.submitter}
        </div>
        <div className="text-sm text-gray-600">{row.original.email}</div>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: sortableHeader("Submitted"),
    cell: ({ row }) => (
      <div>
        <div className="text-base text-gray-900">
          {formatSubmitted(row.original.date)}
        </div>
        <div className="text-sm text-gray-600">
          {row.original.status === "pending"
            ? waitingLabel(row.original.date, row.original.time)
            : row.original.time}
        </div>
      </div>
    ),
  },
  {
    id: "actions",
    enableSorting: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="text-right">
        <Button
          color={row.original.status === "pending" ? "primary" : "secondary"}
          href={`/john-deere/disputes/${row.original.invoice}?decision=${row.original.status}`}
          size="sm"
          variant={row.original.status === "pending" ? "default" : "outline"}
        >
          {row.original.status === "pending" ? "Review" : "View details"}
        </Button>
      </div>
    ),
  },
];

export { disputeColumns, invoiceColumns };
