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
} from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Ad, formatDate, formatDateTime, formatChannels } from "./adColumns";
import { AdSearchBar, SearchField } from "./AdSearchBar";
import { AdvancedFilters } from "./AdvancedFilters";
import { StatusChangeDialog } from "./StatusChangeDialog";
import { AdDetailModal } from "./AdDetailModal";
import { useDispatch } from "react-redux";
import { clearAllDropdowns } from "@/lib/redux/slices/uiSlice";
import { DataTable } from "@/components/organisms/DataTable";
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

// Type for pagination state
interface PaginationState {
  currentPage: number;
  pageSize: number;
}

// Type for advanced filters
interface AdvancedFilterState {
  adNames: string[];
  merchants: string[];
  offers: string[];
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
    header: () => <div className="text-left font-medium">Ad Sets</div>,
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onCampaignSelect(row.original)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Ad Sets
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PencilIcon className="mr-2 h-4 w-4" />
              Edit Campaign
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
          Ad Set Name
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className="font-medium text-left max-w-[200px] truncate"
        title={row.getValue("name")}
      >
        {row.getValue("name") || "Unnamed Ad Set"}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAdSetSelect(row.original)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Ads
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PencilIcon className="mr-2 h-4 w-4" />
              Edit Ad Set
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
              <span>No ad sets</span>
            ) : (
              <span>
                Showing {startIndex + 1}-{endIndex} of {totalItems} ad sets
              </span>
            )}
          </div>

          <div className="flex items-center ml-4">
            <span className="mr-2">Ad sets per page:</span>
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

// Mock data with Kigo context - restaurants, local businesses, real use cases
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
            merchantName: "Tony's Authentic Pizza",
            offerName: "20% off family meals",
            status: "Active",
            numberOfAssets: 4,
            channels: ["TOP", "Local+"],
            startDateTime: "2024-06-01T09:00:00Z",
            endDateTime: "2024-08-31T23:59:00Z",
            createdDate: "2024-06-01",
            lastModified: "2024-06-15",
            createdBy: "Sarah Johnson",
          },
          {
            id: "ad-2",
            name: "Deacon's Weekend Bundle",
            merchantName: "Deacon's Pizza House",
            offerName: "Buy 2 pizzas, get free breadsticks",
            status: "Active",
            numberOfAssets: 3,
            channels: ["TOP", "Local+", "Signals"],
            startDateTime: "2024-06-15T10:00:00Z",
            endDateTime: "2024-08-31T23:59:00Z",
            createdDate: "2024-06-10",
            lastModified: "2024-06-20",
            createdBy: "Mike Chen",
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
            id: "ad-3",
            name: "Mama Mia's Lunch Express",
            merchantName: "Mama Mia's Italian Kitchen",
            offerName: "15% off lunch orders",
            status: "Paused",
            numberOfAssets: 5,
            channels: ["TOP", "Local+"],
            startDateTime: "2024-06-05T08:00:00Z",
            endDateTime: "2024-09-05T20:00:00Z",
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
            merchantName: "Java Joe's Coffee House",
            offerName: "Free pastry with coffee purchase",
            status: "Active",
            numberOfAssets: 6,
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
            merchantName: "Brew & Bite Cafe",
            offerName: "$2 off breakfast sandwiches",
            status: "Published",
            numberOfAssets: 4,
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
            merchantName: "Sunny Side Breakfast Bar",
            offerName: "Buy brunch, get mimosa half-price",
            status: "Draft",
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
            merchantName: "Starbucks Corporation",
            offerName: "Buy 2 Get 1 Free beverages",
            status: "Active",
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
            merchantName: "Starbucks Corporation",
            offerName: "20% off holiday blends",
            status: "Ended",
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
            merchantName: "Chipotle Mexican Grill",
            offerName: "Free guacamole with entrée",
            status: "Draft",
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
            merchantName: "Walmart Inc.",
            offerName: "$10 off $50 purchase",
            status: "Draft",
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
            merchantName: "Target Corporation",
            offerName: "15% off home decor",
            status: "Draft",
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
            merchantName: "Target Corporation",
            offerName: "25% off holiday lighting",
            status: "Draft",
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
    right: 0,
  });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen]);

  return (
    <>
      <Button
        ref={buttonRef}
        className="flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <PlusIcon className="h-4 w-4" />
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
              right: dropdownPosition.right,
            }}
          >
            <div className="py-1">
              <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
                Create New
              </div>
              <Link
                href="/campaigns/create"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Campaign
              </Link>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  console.log("Create Ad Set clicked");
                  setIsOpen(false);
                }}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Ad Set
              </button>
              <Link
                href="/campaign-manager/ads-create"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Ad
              </Link>
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

/**
 * AdManagerListView Component
 *
 * Displays a hierarchical view of campaigns, ad sets, and ads
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

  // Advanced filters state - use useState with function to prevent object recreation
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>(
    () => ({
      adNames: [],
      merchants: [],
      offers: [],
    })
  );

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

  // Get base data without filtering
  const baseData = useMemo(() => {
    switch (currentLevel) {
      case "campaigns":
        return mockCampaigns || [];
      case "adsets":
        return selectedCampaign ? selectedCampaign.adSets || [] : [];
      case "ads":
        return selectedAdSet ? selectedAdSet.ads || [] : [];
      default:
        return [];
    }
  }, [currentLevel, selectedCampaign, selectedAdSet]);

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

  // Apply advanced filters (only for ads level)
  const getCurrentData = useMemo(() => {
    if (currentLevel !== "ads" || searchFilteredData.length === 0) {
      return searchFilteredData;
    }

    let data = searchFilteredData as Ad[];
    const { adNames, merchants, offers } = advancedFilters;

    if (adNames.length > 0) {
      data = data.filter((ad) => adNames.includes(ad.name));
    }

    if (merchants.length > 0) {
      data = data.filter((ad) => merchants.includes(ad.merchantName));
    }

    if (offers.length > 0) {
      data = data.filter((ad) => offers.includes(ad.offerName));
    }

    return data;
  }, [searchFilteredData, advancedFilters, currentLevel]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Handle advanced filters change
  const handleAdvancedFiltersChange = useCallback(
    (filters: AdvancedFilterState) => {
      setAdvancedFilters(filters);
    },
    []
  );

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

  // Create navigation breadcrumb
  const getBreadcrumb = useMemo(() => {
    const breadcrumbs = ["Campaigns"];

    if (selectedCampaign) {
      breadcrumbs.push(selectedCampaign.name);
    }

    if (selectedAdSet) {
      breadcrumbs.push(selectedAdSet.name);
    }

    return breadcrumbs;
  }, [selectedCampaign, selectedAdSet]);

  // Get the selected count
  const selectedCount = useMemo(
    () =>
      Object.keys(selectedAds || {}).filter((id) => (selectedAds || {})[id])
        .length,
    [selectedAds]
  );

  // Use custom dropdown (switch to this after testing simple button)
  const headerActions = useMemo(() => <CreateButtonCustom />, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ads Manager"
        description="Create, manage, and optimize your advertising campaigns across multiple channels and platforms."
        actions={headerActions}
        variant="aurora"
      />

      {/* Combined Navigation and Tabs Bar */}
      <Tabs
        value={currentLevel}
        className="w-full"
        onValueChange={(value) => handleLevelChange(value as NavigationLevel)}
      >
        <div className="space-y-4 mb-4">
          <div className="flex items-center justify-between space-x-4">
            {/* Left: Search Bar */}
            <div className="flex-shrink-0 w-80">
              <AdSearchBar onSearch={handleSearch} />
            </div>

            {/* Center: Navigation Breadcrumb */}
            <div className="flex-grow flex justify-center">
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
                      {index > 0 && (
                        <span className="mx-2 text-blue-400">→</span>
                      )}
                      <span
                        className={
                          index === getBreadcrumb.length - 1
                            ? "font-semibold text-blue-900 bg-blue-100 px-2 py-1 rounded-md text-sm"
                            : "text-blue-700 hover:text-blue-900 cursor-pointer text-sm hover:underline"
                        }
                      >
                        {crumb}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Campaign Tabs + Advanced Filters */}
            <div className="flex items-center space-x-4">
              <TabsList>
                <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                <TabsTrigger value="adsets" disabled={!selectedCampaign}>
                  Ad Sets
                </TabsTrigger>
                <TabsTrigger value="ads" disabled={!selectedAdSet}>
                  Ads
                </TabsTrigger>
              </TabsList>

              {/* Advanced Filters - inline for ads level */}
              {currentLevel === "ads" && (
                <AdvancedFilters
                  ads={getCurrentData as Ad[]}
                  onFiltersChange={handleAdvancedFiltersChange}
                  initialFilters={advancedFilters}
                />
              )}

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
            </div>
          </div>
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

        {/* Ad Sets Level */}
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
