"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from "lucide-react";
import { Badge } from "@/components/atoms/Badge/Badge";
import { MemberWithPoints } from "../types";

interface MemberColumnsProps {
  onViewMember?: (member: MemberWithPoints) => void;
}

export const createMemberColumns = ({
  onViewMember,
}: MemberColumnsProps = {}): ColumnDef<MemberWithPoints>[] => [
  {
    accessorKey: "accountId",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 font-semibold hover:text-gray-900"
        >
          Account ID
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="h-4 w-4" />
          ) : (
            <ArrowUpDownIcon className="h-4 w-4 text-gray-400" />
          )}
        </button>
      );
    },
    cell: ({ row }) => {
      const accountId = row.getValue("accountId") as string;
      return <div className="font-mono text-sm text-gray-700">{accountId}</div>;
    },
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 font-semibold hover:text-gray-900"
        >
          Account First Name
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="h-4 w-4" />
          ) : (
            <ArrowUpDownIcon className="h-4 w-4 text-gray-400" />
          )}
        </button>
      );
    },
    cell: ({ row }) => {
      const firstName = row.getValue("firstName") as string;
      return <div className="text-sm text-gray-900">{firstName}</div>;
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 font-semibold hover:text-gray-900"
        >
          Account Last Name
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="h-4 w-4" />
          ) : (
            <ArrowUpDownIcon className="h-4 w-4 text-gray-400" />
          )}
        </button>
      );
    },
    cell: ({ row }) => {
      const lastName = row.getValue("lastName") as string;
      return <div className="text-sm text-gray-900">{lastName}</div>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 font-semibold hover:text-gray-900"
        >
          Account Email
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="h-4 w-4" />
          ) : (
            <ArrowUpDownIcon className="h-4 w-4 text-gray-400" />
          )}
        </button>
      );
    },
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return <div className="text-sm text-gray-700">{email}</div>;
    },
  },
  {
    accessorKey: "program",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 font-semibold hover:text-gray-900"
        >
          Program Name
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="h-4 w-4" />
          ) : (
            <ArrowUpDownIcon className="h-4 w-4 text-gray-400" />
          )}
        </button>
      );
    },
    cell: ({ row }) => {
      const member = row.original;
      const program = member.program;
      const balance = member.pointsBalance;

      if (!program) {
        return <span className="text-sm text-gray-500">No program</span>;
      }

      return (
        <div className="text-sm text-gray-900">
          {balance.displayNamePrefix} {balance.displayName}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const programA =
        rowA.original.pointsBalance.displayNamePrefix +
        " " +
        rowA.original.pointsBalance.displayName;
      const programB =
        rowB.original.pointsBalance.displayNamePrefix +
        " " +
        rowB.original.pointsBalance.displayName;
      return programA.localeCompare(programB);
    },
  },
  {
    id: "flagIndicator",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 font-semibold hover:text-gray-900"
        >
          Flag Indicator
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="h-4 w-4" />
          ) : (
            <ArrowUpDownIcon className="h-4 w-4 text-gray-400" />
          )}
        </button>
      );
    },
    cell: ({ row }) => {
      const member = row.original;

      // Check transactions for receipts that need manual review
      const receiptsWithStatus = member.transactions.filter(
        (txn) => txn.receiptId && txn.metadata?.verificationStatus
      );

      // Check if any receipts need manual review
      const hasManualReview = receiptsWithStatus.some(
        (txn) => txn.metadata?.verificationStatus === "manual_review"
      );

      // Check if member has approved receipts
      const hasApprovedReceipts = receiptsWithStatus.some(
        (txn) => txn.metadata?.verificationStatus === "approved"
      );

      if (hasManualReview) {
        return (
          <Badge
            variant="default"
            className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
            useClassName={true}
          >
            Review Required
          </Badge>
        );
      }

      // No manual review needed
      return (
        <Badge
          variant="default"
          className="bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
          useClassName={true}
        >
          No Action Needed
        </Badge>
      );
    },
    sortingFn: (rowA, rowB) => {
      const getStatusPriority = (member: MemberWithPoints) => {
        const receiptsWithStatus = member.transactions.filter(
          (txn) => txn.receiptId && txn.metadata?.verificationStatus
        );
        const hasManualReview = receiptsWithStatus.some(
          (txn) => txn.metadata?.verificationStatus === "manual_review"
        );

        // Priority: Review Required (1) > No Action Needed (2)
        return hasManualReview ? 1 : 2;
      };

      return (
        getStatusPriority(rowA.original) - getStatusPriority(rowB.original)
      );
    },
  },
];
