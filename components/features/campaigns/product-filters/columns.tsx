"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/atoms/Button";
import { useRouter } from "next/navigation";

// Define the shape of our data
export type ProductFilter = {
  id: string;
  name: string;
  queryView: string;
  createdBy: string;
  createdDate: string;
  expiryDate: string;
  status: "Active" | "Expired" | "Draft";
};

export const columns: ColumnDef<ProductFilter>[] = [
  {
    accessorKey: "name",
    header: "Filter Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "queryView",
    header: "Query View",
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    accessorKey: "createdDate",
    header: "Created Date",
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <div className="flex items-center">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              status === "Active"
                ? "bg-green-100 text-green-800"
                : status === "Expired"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const filter = row.original;

      // We need to use the useRouter hook outside this component
      const ActionCell = () => {
        const router = useRouter();
        return (
          <div className="text-right">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                router.push(`/campaigns/product-filters/${filter.id}`)
              }
            >
              View Details
            </Button>
          </div>
        );
      };

      return <ActionCell />;
    },
  },
];
