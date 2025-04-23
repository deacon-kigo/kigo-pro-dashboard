"use client";

import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/Tabs";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/molecules/PageHeader";
import { DataTable } from "./data-table";
import { ProductFilter, columns } from "./columns";

export default function ProductFiltersListView() {
  const router = useRouter();

  // Navigate to the new product filter page
  const handleCreateFilter = () => {
    router.push("/campaigns/product-filters/new");
  };

  // Data for the tables
  const filters: ProductFilter[] = [
    {
      id: "1",
      name: "Pizza Edition",
      queryView: "pizza_view",
      createdBy: "admin",
      createdDate: "2023-10-15",
      expiryDate: "2024-10-15",
      status: "Active",
    },
    {
      id: "2",
      name: "Coffee & Treats",
      queryView: "coffee_treats_view",
      createdBy: "admin",
      createdDate: "2023-11-05",
      expiryDate: "2024-11-05",
      status: "Active",
    },
    {
      id: "3",
      name: "Health & Wellness",
      queryView: "health_wellness_view",
      createdBy: "admin",
      createdDate: "2023-09-20",
      expiryDate: "2024-09-20",
      status: "Active",
    },
    {
      id: "4",
      name: "T-Mobile Tuesdays",
      queryView: "tmobile_tuesdays_view",
      createdBy: "admin",
      createdDate: "2023-08-01",
      expiryDate: "2024-08-01",
      status: "Active",
    },
  ];

  // In a real app, these would be fetched based on status
  const activeFilters = filters.filter((filter) => filter.status === "Active");
  const expiredFilters: ProductFilter[] = [];

  const createFilterButton = (
    <Button onClick={handleCreateFilter} className="flex items-center gap-1">
      <PlusIcon className="h-4 w-4" />
      Create Filter
    </Button>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Filters"
        description="Manage product filters to control offer display in the TOP platform."
        emoji="🏷️"
        actions={createFilterButton}
        variant="aurora"
      />

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Filters</TabsTrigger>
          <TabsTrigger value="expired">Expired Filters</TabsTrigger>
          <TabsTrigger value="all">All Filters</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <DataTable columns={columns} data={activeFilters} />
        </TabsContent>

        <TabsContent value="expired" className="mt-4">
          {expiredFilters.length > 0 ? (
            <DataTable columns={columns} data={expiredFilters} />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6 flex justify-center items-center text-center">
              <div>
                <p className="text-muted-foreground">
                  No expired product filters
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <DataTable columns={columns} data={filters} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
