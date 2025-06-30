"use client";

import React, { useMemo, memo, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import {
  PlusIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  PlayIcon,
  PauseIcon,
} from "@heroicons/react/24/outline";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/Tabs";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/molecules/PageHeader";
import { AdTable, SelectedRows } from "./AdTable";
import { Ad, formatDate } from "./adColumns";
import { AdSearchBar, SearchField } from "./AdSearchBar";
import { useDispatch } from "react-redux";
import { clearAllDropdowns } from "@/lib/redux/slices/uiSlice";

// Type for pagination state
interface PaginationState {
  currentPage: number;
  pageSize: number;
}

// Bulk actions component
const BulkActions = memo(function BulkActions({
  selectedCount,
  onActivate,
  onPause,
  onDuplicate,
  onDelete,
}: {
  selectedCount: number;
  onActivate: () => void;
  onPause: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">
        {selectedCount} selected
      </span>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={onActivate}>
          <PlayIcon className="h-4 w-4 mr-1" />
          Activate
        </Button>
        <Button variant="outline" size="sm" onClick={onPause}>
          <PauseIcon className="h-4 w-4 mr-1" />
          Pause
        </Button>
        <Button variant="outline" size="sm" onClick={onDuplicate}>
          <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
          Duplicate
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="text-red-600 hover:text-red-700"
        >
          <TrashIcon className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
});

// Filter function for searching ads - updated to match simplified structure
const filterDataBySearch = (data: Ad[], searchQuery: string): Ad[] => {
  if (!searchQuery.trim()) return data;

  const lowerQuery = searchQuery.toLowerCase();
  return data.filter((ad) => {
    return (
      ad.name.toLowerCase().includes(lowerQuery) ||
      ad.merchantName.toLowerCase().includes(lowerQuery) ||
      ad.offerName.toLowerCase().includes(lowerQuery) ||
      ad.status.toLowerCase().includes(lowerQuery) ||
      ad.createdBy.toLowerCase().includes(lowerQuery)
    );
  });
};

/**
 * AdManagerListView Component
 *
 * Displays a list of ads in a tabbed interface
 * with options to view active, draft, or all ads.
 * Includes a global search box to search across all fields.
 */
export default function AdManagerListView() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [selectedAds, setSelectedAds] = useState<SelectedRows>({});

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
    paused: { currentPage: 1, pageSize: 5 },
    draft: { currentPage: 1, pageSize: 5 },
    all: { currentPage: 1, pageSize: 5 },
  });

  // Handle tab change with useCallback
  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value);
      // Clear selections when changing tabs
      setSelectedAds({});
      // Also clear any open dropdowns
      dispatch(clearAllDropdowns());
    },
    [dispatch]
  );

  // Handle row selection change with useCallback
  const handleRowSelectionChange = useCallback((selection: SelectedRows) => {
    setSelectedAds(selection);
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

  // Navigate to the new ad creation page with useCallback
  const handleCreateAd = useCallback(() => {
    router.push("/campaign-manager/ads-create");
  }, [router]);

  // Handle search with useCallback
  const handleSearch = useCallback(
    (query: string, field: SearchField) => {
      setSearchQuery(query);
      // Reset to page 1 on all tabs when search query changes
      setPaginationState((prev) => ({
        active: { ...prev.active, currentPage: 1 },
        paused: { ...prev.paused, currentPage: 1 },
        draft: { ...prev.draft, currentPage: 1 },
        all: { ...prev.all, currentPage: 1 },
      }));
      // Clear selections when searching
      setSelectedAds({});
      // Clear any open dropdowns
      dispatch(clearAllDropdowns());
    },
    [dispatch]
  );

  // Bulk action handlers with useCallback
  const handleBulkActivate = useCallback(() => {
    const selectedIds = Object.keys(selectedAds).filter(
      (id) => selectedAds[id]
    );
    console.log("Activating ads:", selectedIds);
    // Implement actual activation logic here
    // After action, clear selections
    setSelectedAds({});
  }, [selectedAds]);

  const handleBulkPause = useCallback(() => {
    const selectedIds = Object.keys(selectedAds).filter(
      (id) => selectedAds[id]
    );
    console.log("Pausing ads:", selectedIds);
    // Implement actual pause logic here
    // After action, clear selections
    setSelectedAds({});
  }, [selectedAds]);

  const handleBulkDuplicate = useCallback(() => {
    const selectedIds = Object.keys(selectedAds).filter(
      (id) => selectedAds[id]
    );
    console.log("Duplicating ads:", selectedIds);
    // Implement actual duplication logic here
    // After action, clear selections
    setSelectedAds({});
  }, [selectedAds]);

  const handleBulkDelete = useCallback(() => {
    const selectedIds = Object.keys(selectedAds).filter(
      (id) => selectedAds[id]
    );
    console.log("Deleting ads:", selectedIds);
    // Implement actual deletion logic here
    // After action, clear selections
    setSelectedAds({});
  }, [selectedAds]);

  // Simplified sample data matching our actual ad structure
  const ads = useMemo<Ad[]>(
    () => [
      {
        id: "1",
        name: "Summer Collection Sale",
        status: "Active" as const,
        merchantName: "Fashion Store",
        offerName: "Summer Collection 50% Off",
        createdBy: "admin",
        createdDate: "2024-05-15",
        lastModified: "2024-06-01",
      },
      {
        id: "2",
        name: "Back to School Special",
        status: "Published" as const,
        merchantName: "Widget Co",
        offerName: "Student Discount Program",
        createdBy: "marketing",
        createdDate: "2024-07-01",
        lastModified: "2024-07-15",
      },
      {
        id: "3",
        name: "New Customer Welcome",
        status: "Draft" as const,
        merchantName: "Example LLC",
        offerName: "Welcome Bonus 20% Off",
        createdBy: "admin",
        createdDate: "2024-07-20",
        lastModified: "2024-07-20",
      },
      {
        id: "4",
        name: "Holiday Season Flash Sale",
        status: "Published" as const,
        merchantName: "Best Store",
        offerName: "Holiday Mega Sale",
        createdBy: "admin",
        createdDate: "2024-06-01",
        lastModified: "2024-10-15",
      },
      {
        id: "5",
        name: "Spring Collection Launch",
        status: "Ended" as const,
        merchantName: "Fashion Outlet",
        offerName: "New Spring Arrivals",
        createdBy: "marketing",
        createdDate: "2024-02-01",
        lastModified: "2024-04-15",
      },
      {
        id: "6",
        name: "Loyalty Program Rewards",
        status: "Active" as const,
        merchantName: "Premium Brands",
        offerName: "VIP Member Exclusive Deals",
        createdBy: "admin",
        createdDate: "2023-12-15",
        lastModified: "2024-06-01",
      },
      {
        id: "7",
        name: "Weekend Flash Sale",
        status: "Paused" as const,
        merchantName: "Discount Depot",
        offerName: "Weekend Special 30% Off",
        createdBy: "marketing",
        createdDate: "2024-05-01",
        lastModified: "2024-05-20",
      },
    ],
    []
  );

  // Filter ads by status and search query
  const filteredActiveAds = useMemo(() => {
    const activeAds = ads.filter((ad) => ad.status === "Active");
    return filterDataBySearch(activeAds, searchQuery);
  }, [ads, searchQuery]);

  const filteredPausedAds = useMemo(() => {
    const pausedAds = ads.filter((ad) => ad.status === "Paused");
    return filterDataBySearch(pausedAds, searchQuery);
  }, [ads, searchQuery]);

  const filteredDraftAds = useMemo(() => {
    const draftAds = ads.filter((ad) => ad.status === "Draft");
    return filterDataBySearch(draftAds, searchQuery);
  }, [ads, searchQuery]);

  const filteredAllAds = useMemo(
    () => filterDataBySearch(ads, searchQuery),
    [ads, searchQuery]
  );

  // Memoize UI elements that don't need to be recreated on every render
  const createAdButton = useMemo(
    () => (
      <Button onClick={handleCreateAd} className="flex items-center gap-1">
        <PlusIcon className="h-4 w-4" />
        Create Ad
      </Button>
    ),
    [handleCreateAd]
  );

  const emptyStateContent = useMemo(
    () => (
      <div className="bg-white rounded-md border border-gray-200 p-6 flex justify-center items-center text-center overflow-hidden shadow-sm">
        <div>
          <p className="text-muted-foreground">No paused ads</p>
        </div>
      </div>
    ),
    []
  );

  const emptyDraftStateContent = useMemo(
    () => (
      <div className="bg-white rounded-md border border-gray-200 p-6 flex justify-center items-center text-center overflow-hidden shadow-sm">
        <div>
          <p className="text-muted-foreground">No draft ads</p>
        </div>
      </div>
    ),
    []
  );

  // Get the selected count
  const selectedCount = useMemo(
    () => Object.keys(selectedAds).filter((id) => selectedAds[id]).length,
    [selectedAds]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ads Manager"
        description="Create, manage, and optimize your advertising campaigns across multiple channels."
        emoji="📢"
        actions={createAdButton}
        variant="aurora"
      />

      <Tabs
        defaultValue="active"
        className="w-full"
        onValueChange={handleTabChange}
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-grow">
            <AdSearchBar onSearch={handleSearch} />
          </div>

          {selectedCount > 0 && (
            <div className="flex items-center border-l border-r px-4 h-9 border-gray-200">
              <BulkActions
                selectedCount={selectedCount}
                onActivate={handleBulkActivate}
                onPause={handleBulkPause}
                onDuplicate={handleBulkDuplicate}
                onDelete={handleBulkDelete}
              />
            </div>
          )}

          <TabsList>
            <TabsTrigger value="active">Active Ads</TabsTrigger>
            <TabsTrigger value="paused">Paused Ads</TabsTrigger>
            <TabsTrigger value="draft">Draft Ads</TabsTrigger>
            <TabsTrigger value="all">All Ads</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="mt-4">
          <AdTable
            data={filteredActiveAds}
            searchQuery={searchQuery}
            className="border-rounded"
            currentPage={paginationState.active.currentPage}
            pageSize={paginationState.active.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onRowSelectionChange={handleRowSelectionChange}
            rowSelection={selectedAds}
          />
        </TabsContent>

        <TabsContent value="paused" className="mt-4">
          {filteredPausedAds.length > 0 ? (
            <AdTable
              data={filteredPausedAds}
              searchQuery={searchQuery}
              className="border-rounded"
              currentPage={paginationState.paused.currentPage}
              pageSize={paginationState.paused.pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onRowSelectionChange={handleRowSelectionChange}
              rowSelection={selectedAds}
            />
          ) : (
            emptyStateContent
          )}
        </TabsContent>

        <TabsContent value="draft" className="mt-4">
          {filteredDraftAds.length > 0 ? (
            <AdTable
              data={filteredDraftAds}
              searchQuery={searchQuery}
              className="border-rounded"
              currentPage={paginationState.draft.currentPage}
              pageSize={paginationState.draft.pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onRowSelectionChange={handleRowSelectionChange}
              rowSelection={selectedAds}
            />
          ) : (
            emptyDraftStateContent
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <AdTable
            data={filteredAllAds}
            searchQuery={searchQuery}
            className="border-rounded"
            currentPage={paginationState.all.currentPage}
            pageSize={paginationState.all.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onRowSelectionChange={handleRowSelectionChange}
            rowSelection={selectedAds}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
