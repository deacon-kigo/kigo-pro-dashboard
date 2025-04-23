"use client";

import React, { useMemo, memo } from "react";
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
import { ProductFilterTable } from "./ProductFilterTable";
import { ProductFilter } from "./productFilterColumns";

/**
 * ProductFiltersListView Component
 * 
 * Displays a list of product filters in a tabbed interface
 * with options to view active, expired, or all filters.
 */
const ProductFiltersListView = memo(function ProductFiltersListView() {
  const router = useRouter();

  // Navigate to the new product filter page
  const handleCreateFilter = () => {
    router.push("/campaigns/product-filters/new");
  };

  // Sample data for the tables - in a real app, this would be fetched from an API
  const filters = useMemo<ProductFilter[]>(() => [
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
  ], []);

  // Derived data - memoized to prevent recalculation on every render
  const activeFilters = useMemo(() => 
    filters.filter((filter) => filter.status === "Active"),
    [filters]
  );
  
  const expiredFilters = useMemo<ProductFilter[]>(() => [], []);

  // Memoize UI elements that don't need to be recreated on every render
  const createFilterButton = useMemo(() => (
    <Button onClick={handleCreateFilter} className="flex items-center gap-1">
      <PlusIcon className="h-4 w-4" />
      Create Filter
    </Button>
  ), [handleCreateFilter]);

  const emptyStateContent = useMemo(() => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 flex justify-center items-center text-center overflow-hidden shadow-sm">
      <div>
        <p className="text-muted-foreground">
          No expired product filters
        </p>
      </div>
    </div>
  ), []);

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
          <ProductFilterTable data={activeFilters} />
        </TabsContent>

        <TabsContent value="expired" className="mt-4">
          {expiredFilters.length > 0 ? (
            <ProductFilterTable data={expiredFilters} />
          ) : emptyStateContent}
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <ProductFilterTable data={filters} />
        </TabsContent>
      </Tabs>
    </div>
  );
});

export default ProductFiltersListView;
