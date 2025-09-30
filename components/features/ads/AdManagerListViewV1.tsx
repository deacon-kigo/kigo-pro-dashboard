"use client";

import React, {
  useMemo,
  memo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Button } from "@/components/atoms/Button";
import {
  PlusIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  PlayIcon,
  PauseIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  MegaphoneIcon,
  RectangleGroupIcon,
  PhotoIcon,
  FolderIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/Tabs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/molecules/PageHeader";
import { AdTable, SelectedRows } from "./AdTable";
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox";
import { DataTable } from "@/components/organisms/DataTable";
import { Ad, formatDate, formatDateTime, formatChannels } from "./adColumns";
import { AdSearchBar, SearchField } from "./AdSearchBar";
import { StatusChangeDialog } from "./StatusChangeDialog";
import { AdDetailModal } from "./AdDetailModal";
import { InlineBulkActions } from "./InlineBulkActions";
import { useDispatch } from "react-redux";
import { clearAllDropdowns } from "@/lib/redux/slices/uiSlice";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Pagination } from "@/components/atoms/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select";
import { cn } from "@/lib/utils";
import { ReactSelectMulti } from "@/components/ui/react-select-multi";

// Type for pagination state
interface PaginationState {
  currentPage: number;
  pageSize: number;
}

// Modal state interface
interface ModalState {
  statusChange: {
    isOpen: boolean;
    ad: Ad | null;
    newStatus: string;
  };
  adDetail: {
    isOpen: boolean;
    ad: Ad | null;
  };
}

// Type for navigation levels - simplified for v1
type NavigationLevel = "adgroups" | "ads";

// Constants to prevent object recreation on every render
const EMPTY_SELECTED_ADS: SelectedRows = {};
const EMPTY_ARRAY: any[] = [];

// Modal state constants to prevent object recreation
const CLOSED_MODAL_STATE: ModalState = {
  statusChange: {
    isOpen: false,
    ad: null,
    newStatus: "",
  },
  adDetail: {
    isOpen: false,
    ad: null,
  },
};

// Status color function moved outside component to prevent recreation
const getStatusColor = (status: string): string => {
  switch (status) {
    case "Active":
      return "text-green-600 bg-green-50";
    case "Paused":
      return "text-yellow-600 bg-yellow-50";
    case "Draft":
      return "text-gray-600 bg-gray-50";
    case "Ended":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

// Sort icon component to prevent recreation
const SortIcon = memo(({ sorted }: { sorted: false | "asc" | "desc" }) => (
  <ArrowUpDown className={cn("ml-2 h-4 w-4", sorted && "text-blue-600")} />
));
SortIcon.displayName = "SortIcon";

// Simplified types for v1
type AdGroupStatus = "Active" | "Paused" | "Draft" | "Ended";

// Simplified Ad Group interface for v1
interface SimpleAdGroup {
  id: string;
  name: string;
  status: AdGroupStatus;
  adsCount: number;
  activeAdsCount: number;
  createdDate: string;
  lastModified: string;
  ads: Ad[];
}

// Simplified filters for v1
interface SimpleFilters {
  adNames: string[];
  merchantNames: string[];
  offerNames: string[];
  offerTypes: string[];
}

// Offer type options based on database schema
const OFFER_TYPE_OPTIONS = [
  { label: "Money Off", value: "AMT" },
  { label: "Percent Off", value: "PCT" },
  { label: "Free Product", value: "FREE" },
  { label: "Cashback", value: "CASH" },
  { label: "Special Price", value: "SPEC" },
  { label: "Buy One, Get One", value: "BOGO" },
  { label: "Click Thru", value: "CLK" },
  { label: "Cash Back", value: "CB" },
];

// Simplified mock data for v1 - focus on ad groups
const mockAdGroups: SimpleAdGroup[] = [
  {
    id: "ag-1",
    name: "Pizza Promotions",
    status: "Active",
    adsCount: 3,
    activeAdsCount: 3,
    createdDate: "2024-06-01",
    lastModified: "2024-06-15",
    ads: [
      {
        id: "ad-1",
        name: "Tony's Pizza Family Special",
        merchantId: "m1",
        merchantName: "Tony's Pizza - Tony's Restaurant Corp",
        offerId: "o1",
        offerName: "20% off family meals (up to $15)",
        status: "Active",
        mediaType: ["Display Banner", "Social Media"],
        mediaAssets: [],
        createdDate: "2024-06-01",
        lastModified: "2024-06-15",
        createdBy: "Sarah Johnson",
      },
      {
        id: "ad-2",
        name: "Deacon's Weekend Bundle",
        merchantId: "m2",
        merchantName: "Deacon's Pizza - Deacon's Restaurant Corp",
        offerId: "o2",
        offerName: "Buy 2 pizzas, get free breadsticks",
        status: "Active",
        mediaType: ["Display Banner", "Social Media"],
        mediaAssets: [],
        createdDate: "2024-06-02",
        lastModified: "2024-06-14",
        createdBy: "Mike Chen",
      },
      {
        id: "ad-3",
        name: "Frank's Lunch Deal",
        merchantId: "m3",
        merchantName: "Frank's Pizza - Frank's Restaurant Corp",
        offerId: "o3",
        offerName: "Two slices + drink for $8.99",
        status: "Active",
        mediaType: ["Display Banner"],
        mediaAssets: [],
        createdDate: "2024-06-03",
        lastModified: "2024-06-13",
        createdBy: "Lisa Wang",
      },
    ],
  },
  {
    id: "ag-2",
    name: "Coffee Shop Deals",
    status: "Active",
    adsCount: 2,
    activeAdsCount: 1,
    createdDate: "2024-06-05",
    lastModified: "2024-06-18",
    ads: [
      {
        id: "ad-4",
        name: "Java Joe's Morning Special",
        merchantId: "merchant-jj",
        merchantName: "Java Joe's - Java Joe's Coffee Corp",
        offerId: "offer-jj-01",
        offerName: "Free pastry with coffee purchase",
        status: "Active",
        mediaType: ["Social Media"],
        mediaAssets: [],
        createdDate: "2024-06-05",
        lastModified: "2024-06-18",
        createdBy: "Tom Brady",
      },
      {
        id: "ad-5",
        name: "Brew & Bite Breakfast",
        merchantId: "merchant-bb",
        merchantName: "Brew & Bite - Brew & Bite Coffee Corp",
        offerId: "offer-bb-01",
        offerName: "$2 off breakfast sandwiches",
        status: "Paused",
        mediaType: ["Display Banner"],
        mediaAssets: [],
        createdDate: "2024-06-06",
        lastModified: "2024-06-17",
        createdBy: "Emma Davis",
      },
    ],
  },
  {
    id: "ag-3",
    name: "Holiday Specials",
    status: "Draft",
    adsCount: 2,
    activeAdsCount: 0,
    createdDate: "2024-11-01",
    lastModified: "2024-11-15",
    ads: [
      {
        id: "ad-6",
        name: "Starbucks Holiday Blend",
        merchantId: "merchant-sb",
        merchantName: "Starbucks - Starbucks Corporation",
        offerId: "offer-sb-02",
        offerName: "20% off holiday blends",
        status: "Draft",
        mediaType: ["Social Media", "Display Banner"],
        mediaAssets: [],
        createdDate: "2024-11-01",
        lastModified: "2024-11-15",
        createdBy: "Rachel Green",
      },
      {
        id: "ad-7",
        name: "Target Holiday Lighting",
        merchantId: "merchant-target",
        merchantName: "Target - Target Corporation",
        offerId: "offer-target-02",
        offerName: "25% off holiday lighting",
        status: "Draft",
        mediaType: ["Display Banner"],
        mediaAssets: [],
        createdDate: "2024-11-02",
        lastModified: "2024-11-14",
        createdBy: "Monica Geller",
      },
    ],
  },
];

// Simplified Ad Group table columns
const adGroupColumns: ColumnDef<SimpleAdGroup>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Ad Group Name
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <button
        className="font-medium text-left max-w-[200px] truncate text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
        onClick={() => {
          // Handle ad group click to show ads
        }}
      >
        {row.original.name}
      </button>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          getStatusColor(row.original.status)
        )}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    id: "adsCount",
    accessorKey: "adsCount",
    header: "Total Ads",
    cell: ({ row }) => (
      <div className="text-left">
        <div className="font-medium">{row.original.adsCount}</div>
        <div className="text-sm text-gray-500">
          {row.original.activeAdsCount} active
        </div>
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "createdDate",
    accessorKey: "createdDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent font-medium px-0"
      >
        Created
        <SortIcon sorted={column.getIsSorted()} />
      </Button>
    ),
    cell: ({ row }) => formatDate(row.original.createdDate),
  },
  {
    id: "lastModified",
    accessorKey: "lastModified",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent font-medium px-0"
      >
        Modified
        <SortIcon sorted={column.getIsSorted()} />
      </Button>
    ),
    cell: ({ row }) => formatDate(row.original.lastModified),
  },
];

/**
 * Simplified Ad Manager List View for V1
 * Focuses on ad groups as simple containers for ads
 */
export default function AdManagerListView() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Simplified state for v1
  const [currentLevel, setCurrentLevel] = useState<NavigationLevel>("adgroups");
  const [selectedAdGroup, setSelectedAdGroup] = useState<SimpleAdGroup | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAdGroups, setSelectedAdGroups] = useState<SelectedRows>({});
  const [selectedAds, setSelectedAds] = useState<SelectedRows>({});

  // Modal states
  const [modalState, setModalState] = useState<ModalState>(CLOSED_MODAL_STATE);

  // Filter state - simplified for v1
  const [filters, setFilters] = useState<SimpleFilters>({
    adNames: [],
    merchantNames: [],
    offerNames: [],
    offerTypes: [],
  });

  // Pagination state
  const [paginationState, setPaginationState] = useState<{
    adgroups: PaginationState;
    ads: PaginationState;
  }>({
    adgroups: { currentPage: 1, pageSize: 10 },
    ads: { currentPage: 1, pageSize: 10 },
  });

  // Generate filter options
  const filterOptions = useMemo(() => {
    const allAds = mockAdGroups.flatMap((group) => group.ads);
    const adNames = [...new Set(allAds.map((ad) => ad.name))].map((name) => ({
      label: name,
      value: name,
    }));
    const merchantNames = [...new Set(allAds.map((ad) => ad.merchantName))].map(
      (name) => ({
        label: name,
        value: name,
      })
    );
    const offerNames = [...new Set(allAds.map((ad) => ad.offerName))].map(
      (name) => ({
        label: name,
        value: name,
      })
    );

    return { adNames, merchantNames, offerNames };
  }, []);

  // Check if filters are active
  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter.length > 0
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (filterKey: keyof SimpleFilters, values: string[]) => {
      setFilters((prev) => ({
        ...prev,
        [filterKey]: values,
      }));
    },
    []
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({
      adNames: [],
      merchantNames: [],
      offerNames: [],
      offerTypes: [],
    });
  }, []);

  // Handle ad group selection
  const handleAdGroupSelect = useCallback((adGroup: SimpleAdGroup) => {
    setSelectedAdGroup(adGroup);
    setCurrentLevel("ads");
  }, []);

  // Handle back to ad groups
  const handleBackToAdGroups = useCallback(() => {
    setSelectedAdGroup(null);
    setCurrentLevel("adgroups");
  }, []);

  // Get current data based on level
  const getCurrentData = useMemo(() => {
    if (currentLevel === "adgroups") {
      let filteredGroups = mockAdGroups;

      // Apply search
      if (searchQuery) {
        filteredGroups = filteredGroups.filter((group) =>
          group.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      return filteredGroups;
    } else if (currentLevel === "ads" && selectedAdGroup) {
      let filteredAds = selectedAdGroup.ads;

      // Apply search
      if (searchQuery) {
        filteredAds = filteredAds.filter((ad) =>
          ad.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply filters
      if (filters.adNames.length > 0) {
        filteredAds = filteredAds.filter((ad) =>
          filters.adNames.includes(ad.name)
        );
      }
      if (filters.merchantNames.length > 0) {
        filteredAds = filteredAds.filter((ad) =>
          filters.merchantNames.includes(ad.merchantName)
        );
      }
      if (filters.offerNames.length > 0) {
        filteredAds = filteredAds.filter((ad) =>
          filters.offerNames.includes(ad.offerName)
        );
      }

      return filteredAds;
    }

    return [];
  }, [currentLevel, selectedAdGroup, searchQuery, filters]);

  // Create button component
  const CreateButtonCustom = useCallback(
    () => (
      <Button
        variant="outline"
        className="flex items-center gap-1"
        onClick={() => router.push("/campaign-manager/ads-create")}
      >
        <PlusIcon className="h-4 w-4" />
        Create Ad
      </Button>
    ),
    [router]
  );

  // Header actions
  const headerActions = useMemo(
    () => <CreateButtonCustom />,
    [CreateButtonCustom]
  );

  // Page context based on current level
  const getContextProps = useMemo(() => {
    if (currentLevel === "adgroups") {
      return {
        title: "Ad Manager",
        description:
          "Organize and manage your ads in groups for better campaign organization.",
        searchPlaceholder: "Search ad groups...",
      };
    } else if (currentLevel === "ads") {
      return {
        title: `${selectedAdGroup?.name || "Ad Group"} - Ads`,
        description: `Manage ads within the ${selectedAdGroup?.name || "selected"} ad group.`,
        searchPlaceholder: "Search ads...",
      };
    }
    return {
      title: "Ad Manager",
      description:
        "Organize and manage your ads in groups for better campaign organization.",
      searchPlaceholder: "Search...",
    };
  }, [currentLevel, selectedAdGroup]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={getContextProps.title}
        description={getContextProps.description}
        actions={headerActions}
        variant="aurora"
      />

      {/* Back button for ads level */}
      {currentLevel === "ads" && (
        <Button
          variant="outline"
          onClick={handleBackToAdGroups}
          className="flex items-center gap-2"
        >
          <ChevronDownIcon className="h-4 w-4 rotate-90" />
          Back to Ad Groups
        </Button>
      )}

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <AdSearchBar
            onSearch={(query, field) => setSearchQuery(query)}
            placeholder={getContextProps.searchPlaceholder}
          />
        </div>

        {/* Inline Bulk Actions (when items are selected) */}
        <InlineBulkActions
          selectedCounts={{
            campaigns: 0,
            adSets: Object.keys(selectedAdGroups).length,
            ads: Object.keys(selectedAds).length,
            total:
              Object.keys(selectedAdGroups).length +
              Object.keys(selectedAds).length,
          }}
          currentLevel={currentLevel === "adgroups" ? "adsets" : "ads"}
          onClearSelection={() => {
            setSelectedAdGroups({});
            setSelectedAds({});
          }}
          onBulkDelete={() => {
            console.log("Bulk delete");
          }}
          selectedItems={{
            campaigns: [],
            adSets: Object.keys(selectedAdGroups)
              .filter((id) => selectedAdGroups[id])
              .map((id) => {
                const adGroup = mockAdGroups.find((ag) => ag.id === id);
                return {
                  id,
                  name: adGroup?.name || `Ad Group ${id}`,
                  status: adGroup?.status || "unknown",
                };
              }),
            ads: Object.keys(selectedAds)
              .filter((id) => selectedAds[id])
              .map((id) => {
                let foundAd: any = null;
                for (const adGroup of mockAdGroups) {
                  const ad = adGroup.ads.find((a) => a.id === id);
                  if (ad) {
                    foundAd = ad;
                    break;
                  }
                }
                return {
                  id,
                  name: foundAd?.name || `Ad ${id}`,
                  status: foundAd?.status || "unknown",
                };
              }),
          }}
        />

        {/* Filter Button - only show when viewing ads */}
        {currentLevel === "ads" && (
          <div className="relative">
            <Button
              variant={hasActiveFilters ? "primary" : "outline"}
              className="flex items-center gap-2"
            >
              <FunnelIcon className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 rounded-full bg-white text-blue-600 px-2 py-0.5 text-xs font-medium">
                  {Object.values(filters).reduce(
                    (acc, arr) => acc + arr.length,
                    0
                  )}
                </span>
              )}
            </Button>

            {/* Filter Dropdown - would be implemented as a dropdown */}
            {hasActiveFilters && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      Clear All
                    </Button>
                  </div>

                  {/* Ad Name Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Ad Name
                    </label>
                    <ReactSelectMulti
                      placeholder="Select ad names..."
                      options={filterOptions.adNames}
                      values={filters.adNames}
                      onChange={(values) =>
                        handleFilterChange("adNames", values)
                      }
                      width="100%"
                      maxDisplayValues={2}
                    />
                  </div>

                  {/* Merchant Name Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Merchant Name
                    </label>
                    <ReactSelectMulti
                      placeholder="Select merchant names..."
                      options={filterOptions.merchantNames}
                      values={filters.merchantNames}
                      onChange={(values) =>
                        handleFilterChange("merchantNames", values)
                      }
                      width="100%"
                      maxDisplayValues={2}
                    />
                  </div>

                  {/* Offer Name Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Offer Name
                    </label>
                    <ReactSelectMulti
                      placeholder="Select offer names..."
                      options={filterOptions.offerNames}
                      values={filters.offerNames}
                      onChange={(values) =>
                        handleFilterChange("offerNames", values)
                      }
                      width="100%"
                      maxDisplayValues={2}
                    />
                  </div>

                  {/* Offer Type Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Offer Type
                    </label>
                    <ReactSelectMulti
                      placeholder="Select offer types..."
                      options={OFFER_TYPE_OPTIONS}
                      values={filters.offerTypes}
                      onChange={(values) =>
                        handleFilterChange("offerTypes", values)
                      }
                      width="100%"
                      maxDisplayValues={2}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Data Tables */}
      <div className="space-y-4">
        {currentLevel === "adgroups" && (
          <DataTable
            columns={adGroupColumns as any}
            data={getCurrentData as SimpleAdGroup[]}
            rowSelection={selectedAdGroups}
            onRowSelectionChange={setSelectedAdGroups}
            onRowClick={(row) => handleAdGroupSelect(row.original)}
            currentPage={paginationState.adgroups.currentPage}
            pageSize={paginationState.adgroups.pageSize}
            onPageChange={(page) =>
              setPaginationState((prev) => ({
                ...prev,
                adgroups: { ...prev.adgroups, currentPage: page },
              }))
            }
            onPageSizeChange={(size) =>
              setPaginationState((prev) => ({
                ...prev,
                adgroups: {
                  ...prev.adgroups,
                  pageSize: Number(size),
                  currentPage: 1,
                },
              }))
            }
          />
        )}

        {currentLevel === "ads" && (
          <AdTable
            data={getCurrentData as Ad[]}
            rowSelection={selectedAds}
            onRowSelectionChange={setSelectedAds}
            currentPage={paginationState.ads.currentPage}
            pageSize={paginationState.ads.pageSize}
            onPageChange={(page) =>
              setPaginationState((prev) => ({
                ...prev,
                ads: { ...prev.ads, currentPage: page },
              }))
            }
            onPageSizeChange={(size) =>
              setPaginationState((prev) => ({
                ...prev,
                ads: { ...prev.ads, pageSize: Number(size), currentPage: 1 },
              }))
            }
          />
        )}
      </div>

      {/* Modals */}
      <StatusChangeDialog
        isOpen={modalState.statusChange.isOpen}
        onClose={() =>
          setModalState((prev) => ({
            ...prev,
            statusChange: { ...CLOSED_MODAL_STATE.statusChange },
          }))
        }
        onConfirm={() => {
          // Handle status change confirmation
          setModalState((prev) => ({
            ...prev,
            statusChange: { ...CLOSED_MODAL_STATE.statusChange },
          }));
        }}
        ad={modalState.statusChange.ad}
        newStatus={modalState.statusChange.newStatus}
      />

      <AdDetailModal
        isOpen={modalState.adDetail.isOpen}
        onClose={() =>
          setModalState((prev) => ({
            ...prev,
            adDetail: { ...CLOSED_MODAL_STATE.adDetail },
          }))
        }
        ad={modalState.adDetail.ad}
      />
    </div>
  );
}
