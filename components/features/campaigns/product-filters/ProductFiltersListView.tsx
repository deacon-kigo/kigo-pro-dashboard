"use client";

import React, { useMemo, memo, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import {
  PlusIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/Tabs";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/molecules/PageHeader";
import { ProductFilterTable, SelectedRows } from "./ProductFilterTable";
import { ProductFilter, formatDate } from "./productFilterColumns";
import { ProductFilterSearchBar, SearchField } from "./ProductFilterSearchBar";
import { useDispatch } from "react-redux";
import { clearAllDropdowns } from "@/lib/redux/slices/uiSlice";
import { CatalogFilterBulkDeleteDialog } from "./CatalogFilterBulkDeleteDialog";

// Type for pagination state
interface PaginationState {
  currentPage: number;
  pageSize: number;
}

/**
 * Bulk Actions Component
 *
 * Displays actions that can be performed on multiple selected filters
 */
const BulkActions = memo(function BulkActions({
  selectedCount,
  onDelete,
  selectedFilters,
  allFilters,
}: {
  selectedCount: number;
  onDelete: (deletableFilterIds: string[]) => Promise<void>;
  selectedFilters: Array<{ id: string; name: string }>;
  allFilters: ProductFilter[];
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium whitespace-nowrap">
          {selectedCount} selected
        </span>
        <Button
          variant="destructive"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <TrashIcon className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>

      {/* Enhanced bulk delete confirmation dialog */}
      <CatalogFilterBulkDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirmDelete={onDelete}
        selectedFilters={selectedFilters}
        allFilters={allFilters}
      />
    </>
  );
});

/**
 * ProductFiltersListView Component
 *
 * Displays a list of product filters in a tabbed interface
 * with options to view active, expired, or all filters.
 * Includes a global search box to search across all fields.
 */
const ProductFiltersListView = memo(function ProductFiltersListView() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [selectedFilters, setSelectedFilters] = useState<SelectedRows>({});

  // Clear dropdowns when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      dispatch(clearAllDropdowns());
    };
  }, [dispatch]);

  // Tab-specific pagination state
  const [paginationState, setPaginationState] = useState<
    Record<string, PaginationState>
  >({
    active: { currentPage: 1, pageSize: 5 },
    expired: { currentPage: 1, pageSize: 5 },
    draft: { currentPage: 1, pageSize: 5 },
    all: { currentPage: 1, pageSize: 5 },
  });

  // Handle tab change with useCallback
  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value);
      // Clear selections when changing tabs
      setSelectedFilters({});
      // Also clear any open dropdowns
      dispatch(clearAllDropdowns());
    },
    [dispatch]
  );

  // Handle row selection change with useCallback
  const handleRowSelectionChange = useCallback((selection: SelectedRows) => {
    // Use a functional update to ensure we get the latest state
    setSelectedFilters(selection);
  }, []);

  // Handle page change with useCallback
  const handlePageChange = useCallback(
    (page: number) => {
      setPaginationState((prev) => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          currentPage: page,
        },
      }));
    },
    [activeTab]
  );

  // Handle page size change with useCallback
  const handlePageSizeChange = useCallback(
    (value: string) => {
      const newPageSize = parseInt(value, 10);
      setPaginationState((prev) => {
        const newState = {
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            pageSize: newPageSize,
            currentPage: 1, // Reset to page 1 when changing page size
          },
        };
        return newState;
      });
    },
    [activeTab]
  );

  // Navigate to the new product filter page with useCallback
  const handleCreateFilter = useCallback(() => {
    router.push("/campaigns/product-filters/new");
  }, [router]);

  // Handle search with useCallback
  const handleSearch = useCallback(
    (query: string, field: SearchField) => {
      setSearchQuery(query);
      // Reset to page 1 on all tabs when search query changes
      setPaginationState((prev) => ({
        active: { ...prev.active, currentPage: 1 },
        expired: { ...prev.expired, currentPage: 1 },
        draft: { ...prev.draft, currentPage: 1 },
        all: { ...prev.all, currentPage: 1 },
      }));
      // Clear selections when searching
      setSelectedFilters({});
      // Clear any open dropdowns
      dispatch(clearAllDropdowns());
    },
    [dispatch]
  );

  // Bulk action handlers with useCallback
  const handleBulkDuplicate = useCallback(() => {
    const selectedIds = Object.keys(selectedFilters).filter(
      (id) => selectedFilters[id]
    );
    console.log("Duplicating filters:", selectedIds);
    // Implement actual duplication logic here
    // After action, clear selections
    setSelectedFilters({});
  }, [selectedFilters]);

  const handleBulkDelete = useCallback(async (deletableFilterIds: string[]) => {
    console.log("Deleting filters:", deletableFilterIds);
    // Implement actual deletion logic here

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // After action, clear selections
    setSelectedFilters({});
  }, []);

  const handleBulkExtendExpiry = useCallback(() => {
    const selectedIds = Object.keys(selectedFilters).filter(
      (id) => selectedFilters[id]
    );
    console.log("Extending expiry for filters:", selectedIds);
    // Implement actual expiry extension logic here
    // After action, clear selections
    setSelectedFilters({});
  }, [selectedFilters]);

  // Sample data for the tables - use useMemo for static data
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
        linkedCampaigns: [
          {
            id: "pp1",
            name: "Legal Research Promotion",
            partnerName: "Augeo",
            programName: "LexisNexis",
          },
          {
            id: "pp4",
            name: "Retirement Planning",
            partnerName: "Augeo",
            programName: "Fidelity Investments",
          },
        ],
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
        linkedCampaigns: [
          {
            id: "pp6",
            name: "Credit Card Rewards",
            partnerName: "ampliFI",
            programName: "Chase",
          },
        ],
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
      {
        id: "15",
        name: "Tech Gadgets Deals",
        queryView: "tech_gadgets_view",
        description: "Latest discounts on technology and electronics",
        createdBy: "admin",
        createdDate: "2023-08-15",
        expiryDate: "2024-08-15",
        status: "Active",
        criteriaMet: true,
        criteriaCount: 7,
        mandatoryCriteriaCount: 4,
        publisherSpecific: false,
      },
      {
        id: "16",
        name: "Travel Experiences",
        queryView: "travel_experiences_view",
        description: "Discounted travel packages and experiences",
        createdBy: "admin",
        createdDate: "2023-09-05",
        expiryDate: "2024-09-05",
        status: "Active",
        criteriaMet: true,
        criteriaCount: 8,
        mandatoryCriteriaCount: 4,
        publisherSpecific: false,
      },
      {
        id: "17",
        name: "Home Improvement",
        queryView: "home_improvement_view",
        description: "Deals on home renovation and improvements",
        createdBy: "admin",
        createdDate: "2023-10-10",
        expiryDate: "2024-10-10",
        status: "Active",
        criteriaMet: true,
        criteriaCount: 6,
        mandatoryCriteriaCount: 4,
        publisherSpecific: false,
      },
      {
        id: "18",
        name: "Fitness & Wellness Essentials",
        queryView: "fitness_wellness_view",
        description: "Promotions on fitness equipment and wellness products",
        createdBy: "admin",
        createdDate: "2023-11-20",
        expiryDate: "2024-11-20",
        status: "Draft",
        criteriaMet: false,
        criteriaCount: 5,
        mandatoryCriteriaCount: 3,
        publisherSpecific: false,
      },
      {
        id: "19",
        name: "Beauty Products",
        queryView: "beauty_products_view",
        description: "Discounts on beauty and skincare products",
        createdBy: "admin",
        createdDate: "2023-12-05",
        expiryDate: "2024-12-05",
        status: "Active",
        criteriaMet: true,
        criteriaCount: 6,
        mandatoryCriteriaCount: 4,
        publisherSpecific: false,
      },
      {
        id: "20",
        name: "Educational Resources",
        queryView: "educational_resources_view",
        description:
          "Special offers on books, courses, and educational materials",
        createdBy: "admin",
        createdDate: "2023-08-25",
        expiryDate: "2024-08-25",
        status: "Active",
        criteriaMet: true,
        criteriaCount: 5,
        mandatoryCriteriaCount: 4,
        publisherSpecific: false,
      },
      {
        id: "21",
        name: "Pet Supplies",
        queryView: "pet_supplies_view",
        description: "Discounts on pet food, toys, and accessories",
        createdBy: "admin",
        createdDate: "2023-09-15",
        expiryDate: "2024-09-15",
        status: "Draft",
        criteriaMet: false,
        criteriaCount: 4,
        mandatoryCriteriaCount: 3,
        publisherSpecific: false,
      },
      {
        id: "22",
        name: "Outdoor Activities",
        queryView: "outdoor_activities_view",
        description: "Offers on camping, hiking, and outdoor equipment",
        createdBy: "admin",
        createdDate: "2023-10-25",
        expiryDate: "2024-10-25",
        status: "Active",
        criteriaMet: true,
        criteriaCount: 7,
        mandatoryCriteriaCount: 4,
        publisherSpecific: false,
      },
      {
        id: "23",
        name: "Children's Products",
        queryView: "children_products_view",
        description: "Discounts on toys, clothes, and products for children",
        createdBy: "admin",
        createdDate: "2023-11-10",
        expiryDate: "2024-11-10",
        status: "Active",
        criteriaMet: true,
        criteriaCount: 6,
        mandatoryCriteriaCount: 4,
        publisherSpecific: false,
      },
      {
        id: "24",
        name: "Black Friday 2022",
        queryView: "black_friday_2022_view",
        description: "Special Black Friday deals and discounts",
        createdBy: "admin",
        createdDate: "2022-11-20",
        expiryDate: "2022-11-30",
        status: "Expired",
        criteriaMet: true,
        criteriaCount: 8,
        mandatoryCriteriaCount: 4,
        publisherSpecific: false,
      },
      {
        id: "25",
        name: "Valentine's Day Specials",
        queryView: "valentines_specials_view",
        description: "Valentine's Day gifts and special offers",
        createdBy: "admin",
        createdDate: "2023-01-15",
        expiryDate: "2023-02-15",
        status: "Expired",
        criteriaMet: true,
        criteriaCount: 5,
        mandatoryCriteriaCount: 4,
        publisherSpecific: false,
      },
      {
        id: "26",
        name: "Spring Cleaning",
        queryView: "spring_cleaning_view",
        description: "Deals on cleaning supplies and home organization",
        createdBy: "admin",
        createdDate: "2023-03-01",
        expiryDate: "2023-04-30",
        status: "Expired",
        criteriaMet: true,
        criteriaCount: 6,
        mandatoryCriteriaCount: 4,
        publisherSpecific: false,
      },
      {
        id: "27",
        name: "Office Supplies",
        queryView: "office_supplies_view",
        description: "Discounts on office furniture, stationery, and equipment",
        createdBy: "admin",
        createdDate: "2023-05-05",
        expiryDate: "2024-05-05",
        status: "Active",
        criteriaMet: true,
        criteriaCount: 6,
        mandatoryCriteriaCount: 4,
        publisherSpecific: false,
      },
      {
        id: "28",
        name: "Gift Cards & Promotions",
        queryView: "gift_cards_promos_view",
        description: "Special offers on gift cards and promotional items",
        createdBy: "admin",
        createdDate: "2023-06-10",
        expiryDate: "2024-06-10",
        status: "Active",
        criteriaMet: true,
        criteriaCount: 5,
        mandatoryCriteriaCount: 4,
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

  // Filter data based on search query - moved to a memoized function
  const filterDataBySearch = useCallback(
    (data: ProductFilter[], query: string) => {
      if (!query.trim()) {
        return data;
      }

      const lowerQuery = query.toLowerCase();
      return data.filter((filter) => {
        // Publisher logic
        const publisherLabel = filter.publisherSpecific
          ? filter.publisherName?.toLowerCase() || ""
          : "general";
        // Date logic
        const createdDateFormatted = formatDate(
          filter.createdDate
        ).toLowerCase();
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
          (field) => field && field.toLowerCase().includes(lowerQuery)
        );
      });
    },
    []
  );

  // Apply search filter to all data sets
  const filteredActiveFilters = useMemo(
    () => filterDataBySearch(activeFilters, searchQuery),
    [activeFilters, searchQuery, filterDataBySearch]
  );

  const filteredExpiredFilters = useMemo(
    () => filterDataBySearch(expiredFilters, searchQuery),
    [expiredFilters, searchQuery, filterDataBySearch]
  );

  const filteredDraftFilters = useMemo(
    () => filterDataBySearch(draftFilters, searchQuery),
    [draftFilters, searchQuery, filterDataBySearch]
  );

  const filteredAllFilters = useMemo(
    () => filterDataBySearch(filters, searchQuery),
    [filters, searchQuery, filterDataBySearch]
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
          <p className="text-muted-foreground">No expired catalog filters</p>
        </div>
      </div>
    ),
    []
  );

  const emptyDraftStateContent = useMemo(
    () => (
      <div className="bg-white rounded-md border border-gray-200 p-6 flex justify-center items-center text-center overflow-hidden shadow-sm">
        <div>
          <p className="text-muted-foreground">No draft catalog filters</p>
        </div>
      </div>
    ),
    []
  );

  // Check if any active filters are selected
  const hasSelectedActiveFilters = useMemo(() => {
    const selectedIds = Object.keys(selectedFilters).filter(
      (id) => selectedFilters[id]
    );

    // For the 'all' tab, check if any active filters are selected
    if (activeTab === "all") {
      return selectedIds.some((id) => {
        const filter = filters.find((f) => f.id === id);
        return filter && filter.status === "Active";
      });
    }

    // For other tabs, just check if it's the active tab
    return activeTab === "active";
  }, [selectedFilters, activeTab, filters]);

  // Get the selected count and filter data
  const selectedCount = useMemo(
    () =>
      Object.keys(selectedFilters).filter((id) => selectedFilters[id]).length,
    [selectedFilters]
  );

  // Prepare selected filters data for bulk actions
  const selectedFiltersData = useMemo(() => {
    const selectedIds = Object.keys(selectedFilters).filter(
      (id) => selectedFilters[id]
    );
    return selectedIds.map((id) => {
      const filter = filters.find((f) => f.id === id);
      return {
        id,
        name: filter?.name || "Unknown Filter",
      };
    });
  }, [selectedFilters, filters]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catalog Filters"
        description="Manage catalog filters to control offer display in the TOP platform."
        emoji="🏷️"
        actions={createFilterButton}
        variant="aurora"
      />

      <Tabs
        defaultValue="active"
        className="w-full"
        onValueChange={handleTabChange}
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-grow">
            <ProductFilterSearchBar onSearch={handleSearch} />
          </div>

          {selectedCount > 0 && (
            <div className="flex items-center border-l border-r px-4 h-9 border-gray-200">
              <BulkActions
                selectedCount={selectedCount}
                onDelete={handleBulkDelete}
                selectedFilters={selectedFiltersData}
                allFilters={filters}
              />
            </div>
          )}

          <TabsList>
            <TabsTrigger value="active">Active Filters</TabsTrigger>
            <TabsTrigger value="draft">Draft Filters</TabsTrigger>
            <TabsTrigger value="all">All Filters</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="mt-4">
          <ProductFilterTable
            data={filteredActiveFilters}
            searchQuery={searchQuery}
            className="border-rounded"
            currentPage={paginationState.active.currentPage}
            pageSize={paginationState.active.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onRowSelectionChange={handleRowSelectionChange}
            rowSelection={selectedFilters}
          />
        </TabsContent>

        <TabsContent value="draft" className="mt-4">
          {filteredDraftFilters.length > 0 ? (
            <ProductFilterTable
              data={filteredDraftFilters}
              searchQuery={searchQuery}
              className="border-rounded"
              currentPage={paginationState.draft.currentPage}
              pageSize={paginationState.draft.pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onRowSelectionChange={handleRowSelectionChange}
              rowSelection={selectedFilters}
            />
          ) : (
            emptyDraftStateContent
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <ProductFilterTable
            data={filteredAllFilters}
            searchQuery={searchQuery}
            className="border-rounded"
            currentPage={paginationState.all.currentPage}
            pageSize={paginationState.all.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onRowSelectionChange={handleRowSelectionChange}
            rowSelection={selectedFilters}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
});

export default ProductFiltersListView;
