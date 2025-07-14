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

// Type for navigation levels
type NavigationLevel = "campaigns" | "adsets" | "ads";

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
const getStatusColor = (status: CampaignStatus) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Paused":
      return "bg-yellow-100 text-yellow-800";
    case "Published":
      return "bg-blue-100 text-blue-800";
    case "Draft":
      return "bg-gray-100 text-gray-800";
    case "Ended":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Sort icon component
const SortIcon = memo(function SortIcon({
  sorted,
}: {
  sorted: false | "asc" | "desc";
}) {
  if (sorted === "asc") {
    return <ChevronDownIcon className="ml-2 h-4 w-4" />;
  } else if (sorted === "desc") {
    return <ChevronDownIcon className="ml-2 h-4 w-4 rotate-180" />;
  }
  return <ArrowUpDown className="ml-2 h-4 w-4" />;
});

// Campaign columns definition
const createCampaignColumns = (
  onCampaignSelect: (campaign: Campaign) => void
): ColumnDef<Campaign>[] => [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Campaign Name
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-left max-w-[200px]">
        <div className="font-medium truncate" title={row.getValue("name")}>
          {row.getValue("name") || "Unnamed Campaign"}
        </div>
        <div className="text-sm text-gray-500">
          {new Date(row.original.createdDate || new Date()).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          )}{" "}
          -{" "}
          {new Date(row.original.lastModified || new Date()).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Status
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span
        className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${getStatusColor(row.getValue("status") || "Draft")}`}
      >
        {row.getValue("status") || "Draft"}
      </span>
    ),
  },
  {
    accessorKey: "budget",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Budget
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-left">
        <div className="font-medium">
          ${((row.getValue("budget") as number) || 0).toLocaleString()}
        </div>
        <div className="text-sm text-gray-500">
          Spent: ${(row.original.spent || 0).toLocaleString()}
        </div>
      </div>
    ),
  },
  {
    id: "market",
    header: () => <div className="text-left font-medium">Market</div>,
    cell: () => (
      <div className="text-left">
        <div className="text-sm">Northeast</div>
        <div className="text-sm text-gray-500">Multi-state</div>
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "adSets",
    header: () => <div className="text-left font-medium">Ads Groups</div>,
    cell: ({ row }) => (
      <div className="text-left">
        <div className="font-medium">{(row.original.adSets || []).length}</div>
        <div className="text-sm text-gray-500">
          {
            (row.original.adSets || []).filter((as) => as.status === "Active")
              .length
          }{" "}
          active
        </div>
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "performance",
    header: () => <div className="text-left font-medium">Performance</div>,
    cell: ({ row }) => {
      const clicks = row.original.clicks || 0;
      const conversions = row.original.conversions || 0;
      const conversionRate =
        clicks > 0 ? ((conversions / clicks) * 100).toFixed(1) : "0.0";
      const performanceIndicator =
        conversions > 50 ? "↗" : conversions > 20 ? "→" : "↘";
      const performanceText =
        conversions > 50
          ? `+${conversionRate}%`
          : conversions > 20
            ? `${conversionRate}%`
            : `-${conversionRate}%`;

      return (
        <div className="text-left">
          <div className="flex items-center">
            <span className="mr-1">{performanceIndicator}</span>
            <span
              className={
                conversions > 50
                  ? "text-green-600"
                  : conversions > 20
                    ? "text-gray-600"
                    : "text-red-600"
              }
            >
              {performanceText}
            </span>
          </div>
          <div className="text-sm text-gray-500">{conversions} conversions</div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <ActionDropdown
          onViewClick={() => onCampaignSelect(row.original)}
          onEditClick={() => console.log("Edit campaign", row.original.id)}
          viewLabel="View Ads Groups"
          editLabel="Edit Campaign"
        />
      </div>
    ),
    enableSorting: false,
  },
];

// Ad Set columns definition
const createAdSetColumns = (
  onAdSetSelect: (adSet: AdSet) => void
): ColumnDef<AdSet>[] => [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Ads Group Name
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className="font-medium text-left max-w-[200px] truncate"
        title={row.getValue("name")}
      >
        {row.getValue("name") || "Unnamed Ads Group"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Status
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span
        className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${getStatusColor(row.getValue("status") || "Draft")}`}
      >
        {row.getValue("status") || "Draft"}
      </span>
    ),
  },
  {
    accessorKey: "budget",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Budget
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-left font-medium">
        ${((row.getValue("budget") as number) || 0).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "targetAudience",
    header: () => <div className="text-left font-medium">Target Audience</div>,
    cell: ({ row }) => (
      <div
        className="text-left max-w-[200px] truncate"
        title={row.getValue("targetAudience")}
      >
        {row.getValue("targetAudience") || "Not specified"}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "ads",
    header: () => <div className="text-left font-medium">Ads</div>,
    cell: ({ row }) => (
      <div className="text-left font-medium">
        {(row.original.ads || []).length}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <ActionDropdown
          onViewClick={() => onAdSetSelect(row.original)}
          onEditClick={() => console.log("Edit ads group", row.original.id)}
          viewLabel="View Ads"
          editLabel="Edit Ads Group"
        />
      </div>
    ),
    enableSorting: false,
  },
];

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
      <span className="text-base font-medium text-gray-700">
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

// Campaign Table Component using DataTable
const CampaignTable = memo(function CampaignTable({
  data,
  onCampaignSelect,
  className,
  rowSelection = {},
  onRowSelectionChange,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}: {
  data: Campaign[];
  onCampaignSelect: (campaign: Campaign) => void;
  className?: string;
  rowSelection?: SelectedRows;
  onRowSelectionChange?: (selection: SelectedRows) => void;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (value: string) => void;
}) {
  // Use internal state only if external state is not provided
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(10);

  // Determine which state to use (external or internal)
  const actualCurrentPage = onPageChange ? currentPage : internalCurrentPage;
  const actualPageSize = onPageSizeChange ? pageSize : internalPageSize;

  // Handle pagination changes
  const handlePageChange = useCallback(
    (page: number) => {
      if (onPageChange) {
        onPageChange(page);
      } else {
        setInternalCurrentPage(page);
      }
    },
    [onPageChange]
  );

  const handlePageSizeChange = useCallback(
    (value: string) => {
      if (onPageSizeChange) {
        onPageSizeChange(value);
      } else {
        const newPageSize = parseInt(value, 10);
        setInternalPageSize(newPageSize);
        setInternalCurrentPage(1);
      }
    },
    [onPageSizeChange]
  );

  const handleRowSelectionChange = useCallback(
    (selection: SelectedRows) => {
      if (onRowSelectionChange) {
        onRowSelectionChange(selection);
      }
    },
    [onRowSelectionChange]
  );

  // Calculate pagination
  const paginationValues = useMemo(() => {
    const totalItems = (data || []).length;
    const startIndex = (actualCurrentPage - 1) * actualPageSize;
    const endIndex = Math.min(startIndex + actualPageSize, totalItems);
    const currentPageData = (data || []).slice(startIndex, endIndex);

    return {
      totalItems,
      startIndex,
      endIndex,
      currentPageData,
    };
  }, [data, actualCurrentPage, actualPageSize]);

  const { totalItems, startIndex, endIndex, currentPageData } =
    paginationValues;

  // Create columns
  const columns = useMemo(() => {
    const campaignColumns = createCampaignColumns(onCampaignSelect);
    return (campaignColumns || []) as unknown as ColumnDef<unknown, unknown>[];
  }, [onCampaignSelect]);

  // Selection count
  const selectionCount = useMemo(
    () =>
      Object.keys(rowSelection || {}).filter((key) => (rowSelection || {})[key])
        .length,
    [rowSelection]
  );

  // Pagination component
  const paginationElement = useMemo(
    () => (
      <Pagination
        totalItems={totalItems}
        pageSize={actualPageSize}
        currentPage={actualCurrentPage}
        onPageChange={handlePageChange}
      />
    ),
    [totalItems, actualPageSize, actualCurrentPage, handlePageChange]
  );

  // Custom pagination UI
  const customPagination = useMemo(
    () => (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2 text-base text-muted-foreground">
          <div>
            {totalItems === 0 ? (
              <span>No campaigns</span>
            ) : (
              <span>
                Showing {startIndex + 1}-{endIndex} of {totalItems} campaigns
              </span>
            )}
          </div>

          <div className="flex items-center ml-4">
            <span className="mr-2">Campaigns per page:</span>
            <Select
              value={actualPageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-20">
                <SelectValue>{actualPageSize}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {selectionCount > 0 && (
            <div className="mr-4 text-base">{selectionCount} selected</div>
          )}
          {paginationElement}
        </div>
      </div>
    ),
    [
      totalItems,
      startIndex,
      endIndex,
      actualPageSize,
      handlePageSizeChange,
      selectionCount,
      paginationElement,
    ]
  );

  return (
    <div className={cn("space-y-4", className)}>
      <DataTable
        columns={columns}
        data={currentPageData as unknown[]}
        disablePagination={false}
        rowSelection={rowSelection}
        onRowSelectionChange={handleRowSelectionChange}
        customPagination={customPagination}
      />
    </div>
  );
});

// Ad Set Table Component using DataTable
const AdSetTable = memo(function AdSetTable({
  data,
  onAdSetSelect,
  className,
  rowSelection = {},
  onRowSelectionChange,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}: {
  data: AdSet[];
  onAdSetSelect: (adSet: AdSet) => void;
  className?: string;
  rowSelection?: SelectedRows;
  onRowSelectionChange?: (selection: SelectedRows) => void;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (value: string) => void;
}) {
  // Use internal state only if external state is not provided
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(10);

  // Determine which state to use (external or internal)
  const actualCurrentPage = onPageChange ? currentPage : internalCurrentPage;
  const actualPageSize = onPageSizeChange ? pageSize : internalPageSize;

  // Handle pagination changes
  const handlePageChange = useCallback(
    (page: number) => {
      if (onPageChange) {
        onPageChange(page);
      } else {
        setInternalCurrentPage(page);
      }
    },
    [onPageChange]
  );

  const handlePageSizeChange = useCallback(
    (value: string) => {
      if (onPageSizeChange) {
        onPageSizeChange(value);
      } else {
        const newPageSize = parseInt(value, 10);
        setInternalPageSize(newPageSize);
        setInternalCurrentPage(1);
      }
    },
    [onPageSizeChange]
  );

  const handleRowSelectionChange = useCallback(
    (selection: SelectedRows) => {
      if (onRowSelectionChange) {
        onRowSelectionChange(selection);
      }
    },
    [onRowSelectionChange]
  );

  // Calculate pagination
  const paginationValues = useMemo(() => {
    const totalItems = (data || []).length;
    const startIndex = (actualCurrentPage - 1) * actualPageSize;
    const endIndex = Math.min(startIndex + actualPageSize, totalItems);
    const currentPageData = (data || []).slice(startIndex, endIndex);

    return {
      totalItems,
      startIndex,
      endIndex,
      currentPageData,
    };
  }, [data, actualCurrentPage, actualPageSize]);

  const { totalItems, startIndex, endIndex, currentPageData } =
    paginationValues;

  // Create columns
  const columns = useMemo(() => {
    const adSetColumns = createAdSetColumns(onAdSetSelect);
    return (adSetColumns || []) as unknown as ColumnDef<unknown, unknown>[];
  }, [onAdSetSelect]);

  // Selection count
  const selectionCount = useMemo(
    () =>
      Object.keys(rowSelection || {}).filter((key) => (rowSelection || {})[key])
        .length,
    [rowSelection]
  );

  // Pagination component
  const paginationElement = useMemo(
    () => (
      <Pagination
        totalItems={totalItems}
        pageSize={actualPageSize}
        currentPage={actualCurrentPage}
        onPageChange={handlePageChange}
      />
    ),
    [totalItems, actualPageSize, actualCurrentPage, handlePageChange]
  );

  // Custom pagination UI
  const customPagination = useMemo(
    () => (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2 text-base text-muted-foreground">
          <div>
            {totalItems === 0 ? (
              <span>No ads groups</span>
            ) : (
              <span>
                Showing {startIndex + 1}-{endIndex} of {totalItems} ads groups
              </span>
            )}
          </div>

          <div className="flex items-center ml-4">
            <span className="mr-2">Ads groups per page:</span>
            <Select
              value={actualPageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-20">
                <SelectValue>{actualPageSize}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {selectionCount > 0 && (
            <div className="mr-4 text-base">{selectionCount} selected</div>
          )}
          {paginationElement}
        </div>
      </div>
    ),
    [
      totalItems,
      startIndex,
      endIndex,
      actualPageSize,
      handlePageSizeChange,
      selectionCount,
      paginationElement,
    ]
  );

  return (
    <div className={cn("space-y-4", className)}>
      <DataTable
        columns={columns}
        data={currentPageData as unknown[]}
        disablePagination={false}
        rowSelection={rowSelection}
        onRowSelectionChange={handleRowSelectionChange}
        customPagination={customPagination}
      />
    </div>
  );
});

// Kigo-specific status types
type CampaignStatus = "Published" | "Active" | "Paused" | "Draft" | "Ended";

// Type for Campaign
interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  createdDate: string;
  lastModified: string;
  adSets: AdSet[];
}

// Type for Ad Set
interface AdSet {
  id: string;
  name: string;
  campaignId: string;
  status: CampaignStatus;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  targetAudience: string;
  placement: string[];
  createdDate: string;
  lastModified: string;
  ads: Ad[];
}

// Type for campaign filters
interface CampaignFilters {
  adNames: string[];
  merchants: string[];
  offers: string[];
}

// Mock data with Kigo context - loyalty/cashback platform, focused on ad-specific data
const mockCampaigns: Campaign[] = [
  {
    id: "campaign-1",
    name: "Summer Family Dining Campaign",
    status: "Active",
    budget: 5000,
    spent: 2847.5,
    impressions: 45820,
    clicks: 1284,
    conversions: 127,
    createdDate: "2024-06-01",
    lastModified: "2024-06-15",
    adSets: [
      {
        id: "adset-1",
        name: "Northeast Pizza Restaurants",
        campaignId: "campaign-1",
        status: "Active",
        budget: 2500,
        spent: 1423.75,
        impressions: 22910,
        clicks: 642,
        conversions: 63,
        targetAudience: "Families within 5 miles",
        placement: ["TOP", "Local+"],
        createdDate: "2024-06-01",
        lastModified: "2024-06-10",
        ads: [
          {
            id: "ad-1",
            name: "Tony's Pizza Family Special",
            merchantId: "m1",
            merchantName: "Tony's Authentic Pizza",
            offerId: "o1",
            offerName: "20% off family meals (up to $15)",
            status: "Active",
            mediaType: ["Display Banner", "Native"],
            mediaAssets: [
              {
                id: "asset-1",
                name: "tonys-pizza-banner.jpg",
                type: "image",
                size: 245000,
                url: "/assets/tonys-pizza-banner.jpg",
                previewUrl: "/assets/tonys-pizza-banner-thumb.jpg",
                dimensions: { width: 728, height: 90 },
                mediaType: "display_banner",
              },
              {
                id: "asset-2",
                name: "tonys-pizza-copy.txt",
                type: "text",
                size: 1024,
                url: "/assets/tonys-pizza-copy.txt",
                previewUrl: "/assets/tonys-pizza-copy.txt",
                mediaType: "native",
              },
            ],
            createdDate: "2024-06-01",
            lastModified: "2024-06-15",
            createdBy: "Sarah Johnson",
          },
          {
            id: "ad-2",
            name: "Deacon's Weekend Bundle",
            merchantId: "m2",
            merchantName: "Deacon's Pizza House",
            offerId: "o2",
            offerName: "Buy 2 pizzas, get free breadsticks",
            status: "Active",
            mediaType: ["Display Banner", "Social Media"],
            mediaAssets: [
              {
                id: "asset-3",
                name: "deacons-weekend-banner.jpg",
                type: "image",
                size: 198000,
                url: "/assets/deacons-weekend-banner.jpg",
                previewUrl: "/assets/deacons-weekend-banner-thumb.jpg",
                dimensions: { width: 728, height: 90 },
                mediaType: "display_banner",
              },
              {
                id: "asset-4",
                name: "deacons-social.jpg",
                type: "image",
                size: 156000,
                url: "/assets/deacons-social.jpg",
                previewUrl: "/assets/deacons-social-thumb.jpg",
                dimensions: { width: 1200, height: 628 },
                mediaType: "social",
              },
            ],
            createdDate: "2024-06-10",
            lastModified: "2024-06-20",
            createdBy: "Mike Chen",
          },
          {
            id: "ad-3",
            name: "Frank's Slice Deal",
            merchantId: "m3",
            merchantName: "Frank's Famous Pizza",
            offerId: "o3",
            offerName: "Two slices + drink for $8.99",
            status: "Published",
            mediaType: ["Video"],
            mediaAssets: [
              {
                id: "asset-5",
                name: "franks-pizza-video.mp4",
                type: "video",
                size: 5200000,
                url: "/assets/franks-pizza-video.mp4",
                previewUrl: "/assets/franks-pizza-video-thumb.jpg",
                dimensions: { width: 1920, height: 1080 },
                mediaType: "video",
              },
            ],
            createdDate: "2024-06-12",
            lastModified: "2024-06-18",
            createdBy: "Alex Rodriguez",
          },
          {
            id: "ad-4",
            name: "Luigi's Lunch Rush",
            merchantId: "m4",
            merchantName: "Luigi's Pizzeria",
            offerId: "o4",
            offerName: "15% off orders over $25 (weekdays 11-2pm)",
            status: "Paused",
            mediaType: ["Double Decker", "Native"],
            mediaAssets: [
              {
                id: "asset-6",
                name: "luigis-double-decker.jpg",
                type: "image",
                size: 367000,
                url: "/assets/luigis-double-decker.jpg",
                previewUrl: "/assets/luigis-double-decker-thumb.jpg",
                dimensions: { width: 728, height: 180 },
                mediaType: "double_decker",
              },
              {
                id: "asset-7",
                name: "luigis-native-copy.txt",
                type: "text",
                size: 892,
                url: "/assets/luigis-native-copy.txt",
                previewUrl: "/assets/luigis-native-copy.txt",
                mediaType: "native",
              },
            ],
            createdDate: "2024-06-08",
            lastModified: "2024-06-22",
            createdBy: "Jennifer Park",
          },
        ],
      },
      {
        id: "adset-2",
        name: "Boston Metro Casual Dining",
        campaignId: "campaign-1",
        status: "Paused",
        budget: 2500,
        spent: 890.25,
        impressions: 15630,
        clicks: 423,
        conversions: 28,
        targetAudience: "Working professionals",
        placement: ["TOP", "Local+"],
        createdDate: "2024-06-05",
        lastModified: "2024-06-18",
        ads: [
          {
            id: "ad-5",
            name: "Mama Mia's Lunch Express",
            merchantId: "m5",
            merchantName: "Mama Mia's Italian Kitchen",
            offerId: "o5",
            offerName: "15% off lunch orders (weekdays only)",
            status: "Paused",
            mediaType: ["Double Decker"],
            mediaAssets: [
              {
                id: "asset-8",
                name: "mama-mias-double-decker.jpg",
                type: "image",
                size: 324000,
                url: "/assets/mama-mias-double-decker.jpg",
                previewUrl: "/assets/mama-mias-double-decker-thumb.jpg",
                dimensions: { width: 728, height: 180 },
                mediaType: "double_decker",
              },
            ],
            createdDate: "2024-06-03",
            lastModified: "2024-06-18",
            createdBy: "Lisa Park",
          },
        ],
      },
    ],
  },
  {
    id: "campaign-2",
    name: "Local Coffee & Breakfast Promo",
    status: "Active",
    budget: 3200,
    spent: 1567.89,
    impressions: 28450,
    clicks: 841,
    conversions: 89,
    createdDate: "2024-07-01",
    lastModified: "2024-07-20",
    adSets: [
      {
        id: "adset-3",
        name: "Morning Rush Hour Targeting",
        campaignId: "campaign-2",
        status: "Active",
        budget: 1600,
        spent: 834.5,
        impressions: 18920,
        clicks: 456,
        conversions: 54,
        targetAudience: "Commuters 7-9am",
        placement: ["TOP", "Local+", "Signals"],
        createdDate: "2024-07-01",
        lastModified: "2024-07-15",
        ads: [
          {
            id: "ad-4",
            name: "Java Joe's Morning Special",
            merchantId: "merchant-jj",
            merchantName: "Java Joe's Coffee House",
            offerId: "offer-jj-01",
            offerName: "Free pastry with coffee purchase",
            status: "Active",
            mediaType: ["Display Banner", "Native"],
            mediaAssets: [
              {
                id: "asset-1",
                name: "Morning Banner",
                type: "image",
                size: 245600,
                url: "/images/java-joe-banner.jpg",
                previewUrl: "/images/java-joe-banner-thumb.jpg",
                dimensions: { width: 728, height: 90 },
                mediaType: "Display Banner",
              },
              {
                id: "asset-2",
                name: "Native Ad Image",
                type: "image",
                size: 156800,
                url: "/images/java-joe-native.jpg",
                previewUrl: "/images/java-joe-native-thumb.jpg",
                dimensions: { width: 400, height: 300 },
                mediaType: "Native",
              },
            ],
            numberOfAssets: 2,
            channels: ["TOP", "Local+"],
            startDateTime: "2024-07-15T06:00:00Z",
            endDateTime: "2024-09-30T10:00:00Z",
            createdDate: "2024-07-01",
            lastModified: "2024-07-15",
            createdBy: "Alex Rivera",
          },
          {
            id: "ad-5",
            name: "Brew & Bite Breakfast Deal",
            merchantId: "merchant-bb",
            merchantName: "Brew & Bite Cafe",
            offerId: "offer-bb-01",
            offerName: "$2 off breakfast sandwiches",
            status: "Published",
            mediaType: ["Display Banner", "Video", "Social"],
            mediaAssets: [
              {
                id: "asset-3",
                name: "Breakfast Banner",
                type: "image",
                size: 198400,
                url: "/images/brew-bite-banner.jpg",
                previewUrl: "/images/brew-bite-banner-thumb.jpg",
                dimensions: { width: 300, height: 250 },
                mediaType: "Display Banner",
              },
              {
                id: "asset-4",
                name: "Breakfast Video",
                type: "video",
                size: 5242880,
                url: "/videos/brew-bite-video.mp4",
                previewUrl: "/images/brew-bite-video-thumb.jpg",
                dimensions: { width: 1920, height: 1080 },
                mediaType: "Video",
              },
            ],
            numberOfAssets: 2,
            channels: ["TOP", "Local+", "Signals"],
            startDateTime: "2024-07-20T06:00:00Z",
            endDateTime: "2024-09-25T11:00:00Z",
            createdDate: "2024-07-10",
            lastModified: "2024-07-18",
            createdBy: "Alex Rivera",
          },
        ],
      },
      {
        id: "adset-4",
        name: "Weekend Brunch Campaign",
        campaignId: "campaign-2",
        status: "Draft",
        budget: 1600,
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        targetAudience: "Weekend brunch crowd",
        placement: ["TOP", "Local+"],
        createdDate: "2024-07-15",
        lastModified: "2024-07-15",
        ads: [
          {
            id: "ad-6",
            name: "Sunny Side Brunch Special",
            merchantId: "merchant-ss",
            merchantName: "Sunny Side Breakfast Bar",
            offerId: "offer-ss-01",
            offerName: "Buy brunch, get mimosa half-price",
            status: "Draft",
            mediaType: ["Display Banner"],
            mediaAssets: [
              {
                id: "asset-6",
                name: "sunny-side-banner.jpg",
                type: "image",
                size: 180000,
                url: "/assets/sunny-side-banner.jpg",
                previewUrl: "/assets/sunny-side-banner-thumb.jpg",
                dimensions: { width: 728, height: 90 },
                mediaType: "display_banner",
              },
            ],
            numberOfAssets: 2,
            channels: ["TOP"],
            startDateTime: "2024-08-25T09:00:00Z",
            endDateTime: "2024-12-31T14:00:00Z",
            createdDate: "2024-07-15",
            lastModified: "2024-07-15",
            createdBy: "Emma Wilson",
          },
        ],
      },
    ],
  },
  {
    id: "campaign-3",
    name: "Local Retail Holiday Push",
    status: "Ended",
    budget: 4500,
    spent: 4245.67,
    impressions: 58340,
    clicks: 1634,
    conversions: 167,
    createdDate: "2024-05-15",
    lastModified: "2024-06-30",
    adSets: [
      {
        id: "adset-5",
        name: "Memorial Day Weekend Sales",
        campaignId: "campaign-3",
        status: "Active",
        budget: 2000,
        spent: 798.45,
        impressions: 18200,
        clicks: 542,
        conversions: 43,
        targetAudience: "Coffee Lovers 22-45",
        placement: ["TOP", "Local+", "Catalog"],
        createdDate: "2024-05-15",
        lastModified: "2024-06-20",
        ads: [
          {
            id: "ad-7",
            name: "Starbucks Loyalty Rewards",
            merchantId: "merchant-sb",
            merchantName: "Starbucks Corporation",
            offerId: "offer-sb-01",
            offerName: "Buy 2 Get 1 Free beverages",
            status: "Active",
            mediaType: ["Display Banner", "Video"],
            mediaAssets: [
              {
                id: "asset-7",
                name: "starbucks-loyalty-banner.jpg",
                type: "image",
                size: 340000,
                url: "/assets/starbucks-loyalty-banner.jpg",
                previewUrl: "/assets/starbucks-loyalty-banner-thumb.jpg",
                dimensions: { width: 728, height: 90 },
                mediaType: "display_banner",
              },
            ],
            numberOfAssets: 5,
            channels: ["TOP", "Local+", "Catalog"],
            startDateTime: "2024-01-01T00:00:00Z",
            endDateTime: "2024-12-31T23:59:59Z",
            createdDate: "2024-05-15",
            lastModified: "2024-06-01",
            createdBy: "David Kim",
          },
          {
            id: "ad-8",
            name: "Starbucks Holiday Blend Promo",
            merchantId: "merchant-sb",
            merchantName: "Starbucks Corporation",
            offerId: "offer-sb-02",
            offerName: "20% off holiday blends",
            status: "Ended",
            mediaType: ["Native", "Social"],
            mediaAssets: [
              {
                id: "asset-8",
                name: "starbucks-holiday-native.jpg",
                type: "image",
                size: 280000,
                url: "/assets/starbucks-holiday-native.jpg",
                previewUrl: "/assets/starbucks-holiday-native-thumb.jpg",
                mediaType: "native",
              },
            ],
            numberOfAssets: 3,
            channels: ["TOP", "Local+"],
            startDateTime: "2024-05-01T06:00:00Z",
            endDateTime: "2024-06-30T23:59:59Z",
            createdDate: "2024-04-20",
            lastModified: "2024-05-15",
            createdBy: "David Kim",
          },
        ],
      },
      {
        id: "adset-6",
        name: "Chipotle Welcome Offers",
        campaignId: "campaign-3",
        status: "Draft",
        budget: 1500,
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        targetAudience: "Young Adults 18-35",
        placement: ["TOP", "Signals"],
        createdDate: "2024-06-20",
        lastModified: "2024-06-20",
        ads: [
          {
            id: "ad-9",
            name: "Chipotle Welcome Offer",
            merchantId: "merchant-chipotle",
            merchantName: "Chipotle Mexican Grill",
            offerId: "offer-chipotle-01",
            offerName: "Free guacamole with entrée",
            status: "Draft",
            mediaType: ["Display Banner"],
            mediaAssets: [
              {
                id: "asset-9",
                name: "chipotle-welcome-banner.jpg",
                type: "image",
                size: 220000,
                url: "/assets/chipotle-welcome-banner.jpg",
                previewUrl: "/assets/chipotle-welcome-banner-thumb.jpg",
                dimensions: { width: 728, height: 90 },
                mediaType: "display_banner",
              },
            ],
            numberOfAssets: 2,
            channels: ["TOP"],
            startDateTime: "2024-08-01T00:00:00Z",
            endDateTime: "2024-12-31T23:59:59Z",
            createdDate: "2024-06-20",
            lastModified: "2024-06-20",
            createdBy: "Maria Santos",
          },
        ],
      },
    ],
  },
  {
    id: "campaign-4",
    name: "Holiday Shopping Extravaganza",
    status: "Draft",
    budget: 12000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    createdDate: "2024-07-25",
    lastModified: "2024-07-25",
    adSets: [
      {
        id: "adset-7",
        name: "Walmart Holiday Promotions",
        campaignId: "campaign-4",
        status: "Draft",
        budget: 6000,
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        targetAudience: "Families with children",
        placement: ["TOP", "Local+", "Signals", "Catalog"],
        createdDate: "2024-07-25",
        lastModified: "2024-07-25",
        ads: [
          {
            id: "ad-10",
            name: "Walmart Holiday Promotion",
            merchantId: "merchant-walmart",
            merchantName: "Walmart Inc.",
            offerId: "offer-walmart-01",
            offerName: "$10 off $50 purchase",
            status: "Draft",
            mediaType: ["Display Banner", "Video"],
            mediaAssets: [
              {
                id: "asset-10",
                name: "walmart-holiday-banner.jpg",
                type: "image",
                size: 350000,
                url: "/assets/walmart-holiday-banner.jpg",
                previewUrl: "/assets/walmart-holiday-banner-thumb.jpg",
                dimensions: { width: 728, height: 90 },
                mediaType: "display_banner",
              },
            ],
            numberOfAssets: 6,
            channels: ["TOP", "Local+", "Signals", "Catalog"],
            startDateTime: "2024-11-25T06:00:00Z",
            endDateTime: "2024-12-26T06:00:00Z",
            createdDate: "2024-07-25",
            lastModified: "2024-07-25",
            createdBy: "Jennifer Lee",
          },
        ],
      },
      {
        id: "adset-8",
        name: "Target Home Decor Holiday",
        campaignId: "campaign-4",
        status: "Draft",
        budget: 6000,
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        targetAudience: "Homeowners 25-55",
        placement: ["TOP", "Local+"],
        createdDate: "2024-07-25",
        lastModified: "2024-07-25",
        ads: [
          {
            id: "ad-11",
            name: "Target Home Decor Special",
            merchantId: "merchant-target",
            merchantName: "Target Corporation",
            offerId: "offer-target-01",
            offerName: "15% off home decor",
            status: "Draft",
            mediaType: ["Display Banner"],
            mediaAssets: [
              {
                id: "asset-11",
                name: "target-home-decor-banner.jpg",
                type: "image",
                size: 280000,
                url: "/assets/target-home-decor-banner.jpg",
                previewUrl: "/assets/target-home-decor-banner-thumb.jpg",
                dimensions: { width: 728, height: 90 },
                mediaType: "display_banner",
              },
            ],
            numberOfAssets: 4,
            channels: ["TOP", "Local+"],
            startDateTime: "2024-11-01T00:00:00Z",
            endDateTime: "2024-12-31T23:59:59Z",
            createdDate: "2024-07-25",
            lastModified: "2024-07-25",
            createdBy: "Robert Chang",
          },
          {
            id: "ad-12",
            name: "Target Holiday Lighting Sale",
            merchantId: "merchant-target",
            merchantName: "Target Corporation",
            offerId: "offer-target-02",
            offerName: "25% off holiday lighting",
            status: "Draft",
            mediaType: ["Display Banner", "Social Media"],
            mediaAssets: [
              {
                id: "asset-12",
                name: "target-lighting-banner.jpg",
                type: "image",
                size: 260000,
                url: "/assets/target-lighting-banner.jpg",
                previewUrl: "/assets/target-lighting-banner-thumb.jpg",
                dimensions: { width: 728, height: 90 },
                mediaType: "display_banner",
              },
            ],
            numberOfAssets: 3,
            channels: ["TOP", "Local+"],
            startDateTime: "2024-11-15T00:00:00Z",
            endDateTime: "2024-12-24T23:59:59Z",
            createdDate: "2024-07-25",
            lastModified: "2024-07-25",
            createdBy: "Robert Chang",
          },
        ],
      },
    ],
  },
];

// Custom dropdown without ShadCN to avoid re-rendering issues
const CreateButtonCustom = memo(function CreateButtonCustom() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 192; // w-48 = 192px
      const dropdownHeight = 150; // Approximate height
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      const padding = 16;

      // Calculate horizontal position (align to right edge of button)
      let left = rect.right - dropdownWidth;
      if (left < padding) {
        left = rect.left; // Align to left edge if not enough space
      }
      if (left + dropdownWidth > viewport.width - padding) {
        left = viewport.width - dropdownWidth - padding;
      }

      // Calculate vertical position
      let top = rect.bottom + 8;
      if (top + dropdownHeight > viewport.height - padding) {
        top = rect.top - dropdownHeight - 8;
      }
      if (top < padding) {
        top = padding;
      }

      setDropdownPosition({ top, left });
    }
  }, [isOpen]);

  return (
    <>
      <Button
        ref={buttonRef}
        className="flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        Create
        <ChevronDownIcon className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed w-48 bg-white rounded-md shadow-lg border z-[9999]"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
          >
            <div className="py-1">
              <div className="px-5 py-3 text-sm font-medium text-gray-700 border-b">
                Create New
              </div>
              <Link
                href="/campaigns/create"
                className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <FolderIcon className="mr-3 h-4 w-4" />
                Campaign
              </Link>
              <button
                className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  console.log("Create Ads Group clicked");
                  setIsOpen(false);
                }}
              >
                <RectangleGroupIcon className="mr-3 h-4 w-4" />
                Ads Group
              </button>
              <Link
                href="/campaign-manager/ads-create"
                className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <PhotoIcon className="mr-3 h-4 w-4" />
                Ad
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
});

// Custom action dropdown component to prevent re-rendering issues
const ActionDropdown = memo(function ActionDropdown({
  onViewClick,
  onEditClick,
  viewLabel,
  editLabel,
}: {
  onViewClick: () => void;
  onEditClick: () => void;
  viewLabel: string;
  editLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 192; // w-48 = 192px
      const dropdownHeight = 200; // Approximate height
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      const padding = 16;

      // Calculate horizontal position (prefer centering on button)
      let left = rect.left - 48;
      if (left + dropdownWidth > viewport.width - padding) {
        left = rect.right - dropdownWidth;
      }
      if (left < padding) {
        left = padding;
      }

      // Calculate vertical position
      let top = rect.bottom + 8;
      if (top + dropdownHeight > viewport.height - padding) {
        top = rect.top - dropdownHeight - 8;
      }
      if (top < padding) {
        top = padding;
      }

      setDropdownPosition({ top, left });
    }
  }, [isOpen]);

  const handleViewClick = useCallback(() => {
    onViewClick();
    setIsOpen(false);
  }, [onViewClick]);

  const handleEditClick = useCallback(() => {
    onEditClick();
    setIsOpen(false);
  }, [onEditClick]);

  return (
    <>
      <Button
        ref={buttonRef}
        variant="ghost"
        className="h-8 w-8 p-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed w-48 bg-white rounded-md shadow-lg border z-[9999]"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
          >
            <div className="py-1">
              <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
                Actions
              </div>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={handleViewClick}
              >
                <EyeIcon className="mr-2 h-4 w-4" />
                {viewLabel}
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={handleEditClick}
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                {editLabel}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
});

// Simple static create button - no dropdown, no re-renders
const CreateButtonSimple = (
  <Link href="/campaign-manager/ads-create">
    <Button className="flex items-center gap-1">
      <PlusIcon className="h-4 w-4" />
      Create Ad
    </Button>
  </Link>
);

// Campaign Filter Component
const CampaignFilterDropdown = memo(function CampaignFilterDropdown({
  campaigns,
  filters,
  onFiltersChange,
  onClearFilters,
}: {
  campaigns: Campaign[];
  filters: CampaignFilters;
  onFiltersChange: (filters: CampaignFilters) => void;
  onClearFilters: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });

  // Extract unique filter options from ALL ADS (attribute level filtering)
  const filterOptions = useMemo(() => {
    const allAds = campaigns.flatMap((campaign) =>
      campaign.adSets.flatMap((adSet) => adSet.ads)
    );

    const adNames = [...new Set(allAds.map((ad) => ad.name))]
      .sort()
      .map((name) => ({ label: name, value: name }));
    const merchants = [...new Set(allAds.map((ad) => ad.merchantName))]
      .sort()
      .map((name) => ({ label: name, value: name }));
    const offers = [...new Set(allAds.map((ad) => ad.offerName))]
      .sort()
      .map((name) => ({ label: name, value: name }));

    return { adNames, merchants, offers };
  }, [campaigns]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  const hasActiveFilters =
    filters.adNames.length > 0 ||
    filters.merchants.length > 0 ||
    filters.offers.length > 0;

  const handleFilterChange = (
    type: keyof CampaignFilters,
    values: string[]
  ) => {
    onFiltersChange({
      ...filters,
      [type]: values,
    });
  };

  const activeFilterCount =
    filters.adNames.length + filters.merchants.length + filters.offers.length;

  return (
    <>
      <Button
        ref={buttonRef}
        variant={hasActiveFilters ? "primary" : "outline"}
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative transition-all duration-200",
          hasActiveFilters &&
            "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
        )}
      >
        <FunnelIcon className="h-4 w-4 mr-2" />
        Filters
        {activeFilterCount > 0 && (
          <span className="ml-2 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
            {activeFilterCount}
          </span>
        )}
        <ChevronDownIcon
          className={cn(
            "h-4 w-4 ml-2 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-96"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Filter Ads
              </h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-gray-600 hover:text-gray-900 px-2"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
              {/* Ad Name Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Ad Name
                </label>
                <ReactSelectMulti
                  placeholder="Select ad names..."
                  options={filterOptions.adNames}
                  values={filters.adNames}
                  onChange={(values) => handleFilterChange("adNames", values)}
                  width="100%"
                  maxDisplayValues={2}
                />
              </div>

              {/* Merchant Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Merchant
                </label>
                <ReactSelectMulti
                  placeholder="Select merchants..."
                  options={filterOptions.merchants}
                  values={filters.merchants}
                  onChange={(values) => handleFilterChange("merchants", values)}
                  width="100%"
                  maxDisplayValues={2}
                />
              </div>

              {/* Offer Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Offer
                </label>
                <ReactSelectMulti
                  placeholder="Select offers..."
                  options={filterOptions.offers}
                  values={filters.offers}
                  onChange={(values) => handleFilterChange("offers", values)}
                  width="100%"
                  maxDisplayValues={2}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="px-6 py-2"
              >
                Done
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
});

/**
 * AdManagerListView Component
 *
 * Displays a hierarchical view of campaigns, ads groups, and ads
 * with navigation tabs similar to Facebook's Ad Manager
 */
export default function AdManagerListView() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLevel, setCurrentLevel] =
    useState<NavigationLevel>("campaigns");
  const [selectedAds, setSelectedAds] = useState<SelectedRows>({});
  const [selectedRowId] = useState<string | null>(null);

  // Navigation state - tracks which campaign/ad set is selected
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [selectedAdSet, setSelectedAdSet] = useState<AdSet | null>(null);

  // Campaign filter state
  const [campaignFilters, setCampaignFilters] = useState<CampaignFilters>({
    adNames: [],
    merchants: [],
    offers: [],
  });

  // Modal states - use useState with function to prevent object recreation
  const [modalState, setModalState] = useState<ModalState>(() => ({
    statusChange: {
      isOpen: false,
      ad: null,
      newStatus: "",
    },
    adDetail: {
      isOpen: false,
      ad: null,
    },
  }));

  // Clear dropdowns when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      dispatch(clearAllDropdowns());
    };
  }, [dispatch]);

  // Level-specific pagination state - use useState with function to prevent object recreation
  const [paginationState, setPaginationState] = useState<
    Record<NavigationLevel, PaginationState>
  >(() => ({
    campaigns: { currentPage: 1, pageSize: 10 },
    adsets: { currentPage: 1, pageSize: 10 },
    ads: { currentPage: 1, pageSize: 10 },
  }));

  // Handle level change with useCallback
  const handleLevelChange = useCallback(
    (level: NavigationLevel) => {
      setCurrentLevel(level);
      // Clear selections when changing levels
      setSelectedAds(EMPTY_SELECTED_ADS);
      // Reset to campaigns level if going back
      if (level === "campaigns") {
        setSelectedCampaign(null);
        setSelectedAdSet(null);
      } else if (level === "adsets") {
        setSelectedAdSet(null);
      }
      // Clear any open dropdowns
      dispatch(clearAllDropdowns());
    },
    [dispatch]
  );

  // Handle campaign selection
  const handleCampaignSelect = useCallback((campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setCurrentLevel("adsets");
    setSelectedAds(EMPTY_SELECTED_ADS);
  }, []);

  // Handle ad set selection
  const handleAdSetSelect = useCallback((adSet: AdSet) => {
    setSelectedAdSet(adSet);
    setCurrentLevel("ads");
    setSelectedAds(EMPTY_SELECTED_ADS);
  }, []);

  // Get base data with ad-level filtering
  const baseData = useMemo(() => {
    const hasActiveFilters = Object.values(campaignFilters).some(
      (arr) => arr.length > 0
    );

    switch (currentLevel) {
      case "campaigns":
        let campaigns = mockCampaigns || [];

        // Apply ad-level filters (filter campaigns by their nested ads)
        if (hasActiveFilters) {
          campaigns = campaigns.filter((campaign) => {
            // Get all ads in this campaign
            const campaignAds = campaign.adSets.flatMap((adSet) => adSet.ads);

            // Check if campaign contains ads matching filter criteria
            return campaignAds.some((ad) => {
              let matches = true;

              // Filter by ad names
              if (campaignFilters.adNames.length > 0) {
                matches = matches && campaignFilters.adNames.includes(ad.name);
              }

              // Filter by merchants
              if (campaignFilters.merchants.length > 0) {
                matches =
                  matches &&
                  campaignFilters.merchants.includes(ad.merchantName);
              }

              // Filter by offers
              if (campaignFilters.offers.length > 0) {
                matches =
                  matches && campaignFilters.offers.includes(ad.offerName);
              }

              return matches;
            });
          });
        }

        return campaigns;

      case "adsets":
        if (!selectedCampaign) return [];
        let adSets = selectedCampaign.adSets || [];

        // Apply ad-level filters (filter adsets by their nested ads)
        if (hasActiveFilters) {
          adSets = adSets.filter((adSet) => {
            // Check if adset contains ads matching filter criteria
            return adSet.ads.some((ad) => {
              let matches = true;

              // Filter by ad names
              if (campaignFilters.adNames.length > 0) {
                matches = matches && campaignFilters.adNames.includes(ad.name);
              }

              // Filter by merchants
              if (campaignFilters.merchants.length > 0) {
                matches =
                  matches &&
                  campaignFilters.merchants.includes(ad.merchantName);
              }

              // Filter by offers
              if (campaignFilters.offers.length > 0) {
                matches =
                  matches && campaignFilters.offers.includes(ad.offerName);
              }

              return matches;
            });
          });
        }

        return adSets;

      case "ads":
        // For ads level - filter individual ads directly by their attributes
        let ads: Ad[] = [];

        if (selectedAdSet) {
          // If we're viewing a specific adset, get ads from that adset
          ads = selectedAdSet.ads || [];
        } else {
          // If no specific adset selected, get all ads from all campaigns
          ads = (mockCampaigns || []).flatMap((campaign) =>
            campaign.adSets.flatMap((adSet) => adSet.ads)
          );
        }

        // Apply ad-level filters directly to individual ads
        if (hasActiveFilters) {
          ads = ads.filter((ad) => {
            let matches = true;

            // Filter by ad names
            if (campaignFilters.adNames.length > 0) {
              matches = matches && campaignFilters.adNames.includes(ad.name);
            }

            // Filter by merchants
            if (campaignFilters.merchants.length > 0) {
              matches =
                matches && campaignFilters.merchants.includes(ad.merchantName);
            }

            // Filter by offers
            if (campaignFilters.offers.length > 0) {
              matches =
                matches && campaignFilters.offers.includes(ad.offerName);
            }

            return matches;
          });
        }

        return ads;

      default:
        return [];
    }
  }, [
    currentLevel,
    selectedCampaign,
    selectedAdSet,
    campaignFilters,
    mockCampaigns,
  ]);

  // Apply search filtering
  const searchFilteredData = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) {
      return baseData;
    }

    const query = searchQuery.toLowerCase();
    return baseData.filter((item: any) => {
      if (currentLevel === "campaigns") {
        return item.name?.toLowerCase().includes(query);
      } else if (currentLevel === "adsets") {
        return (
          item.name?.toLowerCase().includes(query) ||
          item.targetAudience?.toLowerCase().includes(query)
        );
      } else if (currentLevel === "ads") {
        return (
          item.name?.toLowerCase().includes(query) ||
          item.merchantName?.toLowerCase().includes(query) ||
          item.offerName?.toLowerCase().includes(query)
        );
      }
      return false;
    });
  }, [baseData, searchQuery, currentLevel]);

  // Get current data with sorting by start date/time in descending order
  const getCurrentData = useMemo(() => {
    if (currentLevel === "ads") {
      // Sort ads by start date/time in descending order (most recent first)
      return [...searchFilteredData].sort((a: any, b: any) => {
        const dateA = new Date(a.startDateTime || a.createdDate || 0);
        const dateB = new Date(b.startDateTime || b.createdDate || 0);
        return dateB.getTime() - dateA.getTime();
      });
    }
    return searchFilteredData;
  }, [searchFilteredData, currentLevel]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Handle campaign filter changes
  const handleCampaignFiltersChange = useCallback(
    (filters: CampaignFilters) => {
      setCampaignFilters(filters);
      // Reset to page 1 when filters change
      setPaginationState((prev) => ({
        ...prev,
        campaigns: { ...prev.campaigns, currentPage: 1 },
      }));
      // Clear selections when filtering
      setSelectedAds(EMPTY_SELECTED_ADS);
    },
    []
  );

  // Handle clear all filters
  const handleClearCampaignFilters = useCallback(() => {
    setCampaignFilters({
      adNames: [],
      merchants: [],
      offers: [],
    });
    // Reset to page 1 when clearing filters
    setPaginationState((prev) => ({
      ...prev,
      campaigns: { ...prev.campaigns, currentPage: 1 },
    }));
    // Clear selections when clearing filters
    setSelectedAds(EMPTY_SELECTED_ADS);
  }, []);

  // Handle pagination changes
  const handlePageChange = useCallback((page: number) => {
    setPaginationState((prev) => ({
      ...prev,
      ads: { ...prev.ads, currentPage: page },
    }));
  }, []);

  const handlePageSizeChange = useCallback((size: string) => {
    setPaginationState((prev) => ({
      ...prev,
      ads: { ...prev.ads, pageSize: parseInt(size) },
    }));
  }, []);

  // Handle modal state changes
  const handleViewDetails = useCallback((ad: Ad) => {
    setModalState({
      ...CLOSED_MODAL_STATE,
      adDetail: {
        isOpen: true,
        ad,
      },
    });
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setModalState(CLOSED_MODAL_STATE);
  }, []);

  // Handle bulk actions
  const handleBulkActivate = useCallback(() => {
    // TODO: Implement bulk activate functionality
    console.log(
      "Bulk activate:",
      Object.keys(selectedAds || {}).filter((id) => selectedAds[id])
    );
  }, [selectedAds]);

  const handleBulkPause = useCallback(() => {
    // TODO: Implement bulk pause functionality
    console.log(
      "Bulk pause:",
      Object.keys(selectedAds || {}).filter((id) => selectedAds[id])
    );
  }, [selectedAds]);

  const handleBulkDuplicate = useCallback(() => {
    // TODO: Implement bulk duplicate functionality
    console.log(
      "Bulk duplicate:",
      Object.keys(selectedAds || {}).filter((id) => selectedAds[id])
    );
  }, [selectedAds]);

  const handleBulkDelete = useCallback(() => {
    // TODO: Implement bulk delete functionality
    console.log(
      "Bulk delete:",
      Object.keys(selectedAds || {}).filter((id) => selectedAds[id])
    );
  }, [selectedAds]);

  // Handle row selection change
  const handleRowSelectionChange = useCallback((selection: SelectedRows) => {
    setSelectedAds(selection);
  }, []);

  // Get the selected count
  const selectedCount = useMemo(
    () =>
      Object.keys(selectedAds || {}).filter((id) => (selectedAds || {})[id])
        .length,
    [selectedAds]
  );

  // Use custom dropdown (switch to this after testing simple button)
  const headerActions = useMemo(() => <CreateButtonCustom />, []);

  // Create simple breadcrumb
  const getBreadcrumb = useMemo(() => {
    const breadcrumbs = [
      { label: "Campaigns", level: "campaigns" as NavigationLevel },
    ];

    if (selectedCampaign) {
      breadcrumbs.push({
        label: selectedCampaign.name,
        level: "adsets" as NavigationLevel,
      });
    }

    if (selectedAdSet) {
      breadcrumbs.push({
        label: selectedAdSet.name,
        level: "ads" as NavigationLevel,
      });
    }

    return breadcrumbs;
  }, [selectedCampaign, selectedAdSet]);

  // Create dynamic page header and search context
  const getContextProps = useMemo(() => {
    let title = "Ads Manager";
    let description =
      "Create, manage, and optimize your advertising campaigns across multiple channels and platforms.";
    let searchPlaceholder = "Search campaigns...";

    if (currentLevel === "ads") {
      title = "Ads Manager";
      description =
        "Create, manage, and optimize your advertising campaigns across multiple channels and platforms.";
      searchPlaceholder = "Search ads...";
    } else if (currentLevel === "adsets") {
      title = "Ads Manager";
      description =
        "Create, manage, and optimize your advertising campaigns across multiple channels and platforms.";
      searchPlaceholder = "Search ads groups...";
    }

    return { title, description, searchPlaceholder };
  }, [currentLevel]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={getContextProps.title}
        description={getContextProps.description}
        actions={headerActions}
        variant="aurora"
      />

      {/* Tab-styled Breadcrumb Navigation */}
      {getBreadcrumb.length > 1 && (
        <div className="flex justify-start mb-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-4 py-2 shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-blue-600">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span className="text-sm font-medium">Navigation:</span>
              </div>
              {getBreadcrumb.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2 text-blue-400">→</span>}
                  <button
                    onClick={() => handleLevelChange(crumb.level)}
                    className={
                      index === getBreadcrumb.length - 1
                        ? "font-semibold text-blue-900 bg-blue-100 px-2 py-1 rounded-md text-sm cursor-default"
                        : "text-blue-700 hover:text-blue-900 cursor-pointer text-sm hover:underline"
                    }
                  >
                    {crumb.label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Aligned with Catalog Filter Pattern */}
      <Tabs
        value={currentLevel}
        className="w-full"
        onValueChange={(value) => handleLevelChange(value as NavigationLevel)}
      >
        <div className="flex items-center space-x-4 mb-4">
          {/* Left: Search Bar - Flex Grow like Catalog */}
          <div className="flex-grow">
            <AdSearchBar
              onSearch={handleSearch}
              placeholder={getContextProps.searchPlaceholder}
            />
          </div>

          {/* Center: Campaign Filter Button */}
          {currentLevel === "campaigns" && (
            <div className="flex items-center">
              <CampaignFilterDropdown
                campaigns={mockCampaigns}
                filters={campaignFilters}
                onFiltersChange={handleCampaignFiltersChange}
                onClearFilters={handleClearCampaignFilters}
              />
            </div>
          )}

          {/* Right: Tabs like Catalog */}
          <TabsList>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="adsets" disabled={!selectedCampaign}>
              Ads Groups
            </TabsTrigger>
            <TabsTrigger value="ads" disabled={!selectedAdSet}>
              Ads
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Campaigns Level */}
        <TabsContent value="campaigns" className="mt-4">
          <CampaignTable
            data={getCurrentData as Campaign[]}
            onCampaignSelect={handleCampaignSelect}
            className="border-rounded"
            rowSelection={selectedAds}
            onRowSelectionChange={handleRowSelectionChange}
            currentPage={paginationState.campaigns.currentPage}
            pageSize={paginationState.campaigns.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </TabsContent>

        {/* Ads Groups Level */}
        <TabsContent value="adsets" className="mt-4">
          <AdSetTable
            data={getCurrentData as AdSet[]}
            onAdSetSelect={handleAdSetSelect}
            className="border-rounded"
            rowSelection={selectedAds}
            onRowSelectionChange={handleRowSelectionChange}
            currentPage={paginationState.adsets.currentPage}
            pageSize={paginationState.adsets.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </TabsContent>

        {/* Ads Level */}
        <TabsContent value="ads" className="mt-4">
          <AdTable
            data={getCurrentData as Ad[]}
            searchQuery={searchQuery}
            className="border-rounded"
            currentPage={paginationState.ads.currentPage}
            pageSize={paginationState.ads.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onRowSelectionChange={handleRowSelectionChange}
            rowSelection={selectedAds}
            selectedRowId={selectedRowId}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <StatusChangeDialog
        isOpen={modalState.statusChange.isOpen}
        onClose={handleModalClose}
        onConfirm={handleModalClose}
        ad={modalState.statusChange.ad}
        newStatus={modalState.statusChange.newStatus}
      />

      <AdDetailModal
        isOpen={modalState.adDetail.isOpen}
        onClose={handleModalClose}
        ad={modalState.adDetail.ad}
      />
    </div>
  );
}
