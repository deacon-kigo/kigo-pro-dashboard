"use client";

import React, { useMemo, memo, useState } from "react";
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
import { ProductFilter, formatDate } from "./productFilterColumns";
import { ProductFilterSearchBar, SearchField } from "./ProductFilterSearchBar";

/**
 * ProductFiltersListView Component
 *
 * Displays a list of product filters in a tabbed interface
 * with options to view active, expired, or all filters.
 * Includes a global search box to search across all fields.
 */
const ProductFiltersListView = memo(function ProductFiltersListView() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Navigate to the new product filter page
  const handleCreateFilter = () => {
    router.push("/campaigns/product-filters/new");
  };

  // Handle search
  const handleSearch = (query: string, field: SearchField) => {
    setSearchQuery(query);
  };

  // Sample data for the tables - in a real app, this would be fetched from an API
  const filters = useMemo<ProductFilter[]>(
    () => [
      {
        id: "1",
        name: "Pizza Edition",
        queryView: "pizza_view",
        description: "All pizza-related offers for the summer campaign",
        createdBy: "admin",
        createdDate: "2023-10-15",
        expiryDate: "2024-10-15",
        status: "Active",
        criteriaMet: true,
        criteriaCount: 6,
        mandatoryCriteriaCount: 4,
        publisherSpecific: false,
      },
      {
        id: "2",
        name: "Coffee & Treats",
        queryView: "coffee_treats_view",
        description: "Coffee and bakery offers for morning promotions",
        createdBy: "admin",
        createdDate: "2023-11-05",
        expiryDate: "2024-11-05",
        status: "Active",
        criteriaMet: true,
        criteriaCount: 5,
        mandatoryCriteriaCount: 4,
        publisherSpecific: false,
      },
      {
        id: "3",
        name: "Health & Wellness",
        queryView: "health_wellness_view",
        description: "Fitness, nutrition, and wellness offers",
        createdBy: "admin",
        createdDate: "2023-09-20",
        expiryDate: "2024-09-20",
        status: "Draft",
        criteriaMet: false,
        criteriaCount: 5,
        mandatoryCriteriaCount: 3,
        publisherSpecific: false,
      },
      {
        id: "4",
        name: "T-Mobile Tuesdays",
        queryView: "tmobile_tuesdays_view",
        description: "Exclusive offers for T-Mobile customers on Tuesdays",
        createdBy: "admin",
        createdDate: "2023-08-01",
        expiryDate: "2024-08-01",
        status: "Active",
        criteriaMet: true,
        criteriaCount: 8,
        mandatoryCriteriaCount: 4,
        publisherSpecific: true,
        publisherName: "T-Mobile",
      },
      {
        id: "5",
        name: "Bank of America Exclusives",
        queryView: "bofa_exclusives_view",
        description: "Exclusive offers for Bank of America credit card holders",
        createdBy: "admin",
        createdDate: "2023-07-15",
        expiryDate: "2024-07-15",
        status: "Active",
        criteriaMet: true,
        criteriaCount: 7,
        mandatoryCriteriaCount: 4,
        publisherSpecific: true,
        publisherName: "Bank of America",
      },
      {
        id: "6",
        name: "Holiday Promotions",
        queryView: "holiday_promos_view",
        description: "Special offers for the holiday season",
        createdBy: "admin",
        createdDate: "2023-12-01",
        expiryDate: "2024-12-31",
        status: "Draft",
        criteriaMet: false,
        criteriaCount: 4,
        mandatoryCriteriaCount: 2,
        publisherSpecific: false,
      },
      {
        id: "7",
        name: "Summer Deals 2023",
        queryView: "summer_deals_2023_view",
        description: "Summer season special offers",
        createdBy: "admin",
        createdDate: "2023-05-15",
        expiryDate: "2023-09-15",
        status: "Expired",
        criteriaMet: true,
        criteriaCount: 6,
        mandatoryCriteriaCount: 4,
        publisherSpecific: false,
      },
      {
        id: "8",
        name: "Fast Food Favorites",
        queryView: "fast_food_view",
        description: "Popular fast food restaurant deals and discounts",
        createdBy: "admin",
        createdDate: "2023-06-20",
        expiryDate: "2024-06-20",
        status: "Active",
        criteriaMet: true,
        criteriaCount: 9,
        mandatoryCriteriaCount: 4,
        publisherSpecific: false,
      },
      {
        id: "9",
        name: "Family Fun Activities",
        queryView: "family_fun_view",
        description: "Activities and entertainment for the whole family",
        createdBy: "admin",
        createdDate: "2023-07-01",
        expiryDate: "2024-07-01",
        status: "Active",
        criteriaMet: true,
        criteriaCount: 5,
        mandatoryCriteriaCount: 4,
        publisherSpecific: false,
      },
      {
        id: "10",
        name: "Chase Freedom Rewards",
        queryView: "chase_rewards_view",
        description: "Special offers for Chase Freedom card members",
        createdBy: "admin",
        createdDate: "2023-08-10",
        expiryDate: "2024-08-10",
        status: "Active",
        criteriaMet: true,
        criteriaCount: 6,
        mandatoryCriteriaCount: 4,
        publisherSpecific: true,
        publisherName: "Chase",
      },
      {
        id: "11",
        name: "Winter Promotion 2022",
        queryView: "winter_promo_2022_view",
        description: "Winter holiday deals and special offers",
        createdBy: "admin",
        createdDate: "2022-11-15",
        expiryDate: "2023-01-15",
        status: "Expired",
        criteriaMet: true,
        criteriaCount: 7,
        mandatoryCriteriaCount: 4,
        publisherSpecific: false,
      },
      {
        id: "12",
        name: "Back to School 2022",
        queryView: "back_school_2022_view",
        description: "School supplies and student discounts",
        createdBy: "admin",
        createdDate: "2022-08-01",
        expiryDate: "2022-09-30",
        status: "Expired",
        criteriaMet: true,
        criteriaCount: 5,
        mandatoryCriteriaCount: 4,
        publisherSpecific: false,
      },
      {
        id: "13",
        name: "Dining Experiences",
        queryView: "dining_experiences_view",
        description: "Restaurants, cafes, and unique dining experiences",
        createdBy: "admin",
        createdDate: "2023-09-01",
        expiryDate: "2024-09-01",
        status: "Draft",
        criteriaMet: false,
        criteriaCount: 5,
        mandatoryCriteriaCount: 3,
        publisherSpecific: false,
      },
      {
        id: "14",
        name: "Automotive Deals",
        queryView: "automotive_deals_view",
        description: "Car services, parts, and maintenance specials",
        createdBy: "admin",
        createdDate: "2023-07-10",
        expiryDate: "2024-07-10",
        status: "Draft",
        criteriaMet: false,
        criteriaCount: 4,
        mandatoryCriteriaCount: 2,
        publisherSpecific: false,
      },
    ],
    []
  );

  // Derived data - memoized to prevent recalculation on every render
  const activeFilters = useMemo(
    () => filters.filter((filter) => filter.status === "Active"),
    [filters]
  );

  const expiredFilters = useMemo(
    () => filters.filter((filter) => filter.status === "Expired"),
    [filters]
  );

  const draftFilters = useMemo(
    () => filters.filter((filter) => filter.status === "Draft"),
    [filters]
  );

  // Filter data based on search query
  const filterDataBySearch = (data: ProductFilter[]) => {
    if (!searchQuery.trim()) {
      return data;
    }

    const query = searchQuery.toLowerCase();
    return data.filter((filter) => {
      // Publisher logic
      const publisherLabel = filter.publisherSpecific
        ? filter.publisherName?.toLowerCase() || ""
        : "general";
      // Date logic
      const createdDateFormatted = formatDate(filter.createdDate).toLowerCase();
      const expiryDateFormatted = formatDate(filter.expiryDate).toLowerCase();
      // All searchable fields
      const fields = [
        filter.name,
        filter.description,
        filter.queryView,
        filter.createdBy,
        filter.createdDate,
        filter.expiryDate,
        createdDateFormatted,
        expiryDateFormatted,
        publisherLabel,
      ];
      return fields.some(
        (field) => field && field.toLowerCase().includes(query)
      );
    });
  };

  // Apply search filter to all data sets
  const filteredActiveFilters = useMemo(
    () => filterDataBySearch(activeFilters),
    [activeFilters, searchQuery]
  );

  const filteredExpiredFilters = useMemo(
    () => filterDataBySearch(expiredFilters),
    [expiredFilters, searchQuery]
  );

  const filteredDraftFilters = useMemo(
    () => filterDataBySearch(draftFilters),
    [draftFilters, searchQuery]
  );

  const filteredAllFilters = useMemo(
    () => filterDataBySearch(filters),
    [filters, searchQuery]
  );

  // Memoize UI elements that don't need to be recreated on every render
  const createFilterButton = useMemo(
    () => (
      <Button onClick={handleCreateFilter} className="flex items-center gap-1">
        <PlusIcon className="h-4 w-4" />
        Create Filter
      </Button>
    ),
    [handleCreateFilter]
  );

  const emptyStateContent = useMemo(
    () => (
      <div className="bg-white rounded-md border border-gray-200 p-6 flex justify-center items-center text-center overflow-hidden shadow-sm">
        <div>
          <p className="text-muted-foreground">No expired product filters</p>
        </div>
      </div>
    ),
    []
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
        <div className="flex items-center justify-between mb-4">
          <ProductFilterSearchBar onSearch={handleSearch} />
          <TabsList>
            <TabsTrigger value="active">Active Filters</TabsTrigger>
            <TabsTrigger value="expired">Expired Filters</TabsTrigger>
            <TabsTrigger value="draft">Draft Filters</TabsTrigger>
            <TabsTrigger value="all">All Filters</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="mt-4">
          <ProductFilterTable
            data={filteredActiveFilters}
            searchQuery={searchQuery}
            className=""
          />
        </TabsContent>

        <TabsContent value="expired" className="mt-4">
          {filteredExpiredFilters.length > 0 ? (
            <ProductFilterTable
              data={filteredExpiredFilters}
              searchQuery={searchQuery}
            />
          ) : (
            emptyStateContent
          )}
        </TabsContent>

        <TabsContent value="draft" className="mt-4">
          {filteredDraftFilters.length > 0 ? (
            <ProductFilterTable
              data={filteredDraftFilters}
              searchQuery={searchQuery}
            />
          ) : (
            <div className="bg-white rounded-md border border-gray-200 p-6 flex justify-center items-center text-center overflow-hidden shadow-sm">
              <div>
                <p className="text-muted-foreground">
                  No draft product filters
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <ProductFilterTable
            data={filteredAllFilters}
            searchQuery={searchQuery}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
});

export default ProductFiltersListView;
