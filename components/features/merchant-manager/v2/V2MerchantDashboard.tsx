"use client";

import React, { useState, useMemo, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import PageHeader from "@/components/molecules/PageHeader/PageHeader";
import { DataTable } from "@/components/organisms/DataTable/DataTable";
import { Pagination } from "@/components/atoms/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/hooks/use-toast";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { V2Merchant } from "./types";
import V2AddMerchantDialog, { NewMerchantData } from "./V2AddMerchantDialog";
import { v2Merchants } from "./mockData";
import {
  createV2MerchantColumns,
  getV2MerchantRowClassName,
} from "./merchantColumns";
import {
  CampaignListSearchBar,
  CampaignFilterTag,
} from "@/components/features/tmt-campaigns/CampaignListSearchBar";
import V2MerchantKPIs from "./V2MerchantKPIs";
import V2ExpiredOffersTab from "./V2ExpiredOffersTab";
import V2DuplicatesTab from "./V2DuplicatesTab";

export default function V2MerchantDashboard() {
  const { toast } = useToast();
  const [selectedFilters, setSelectedFilters] = useState<CampaignFilterTag[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleAddMerchant = useCallback(
    (data: NewMerchantData) => {
      toast({
        title: "Merchant Added",
        description: `"${data.name}" (${data.category}) has been created.`,
      });
    },
    [toast]
  );

  // Parse search
  const searchQuery = useMemo(() => {
    return selectedFilters
      .filter((f) => f.category === "search")
      .map((f) => f.value.split(":").slice(1).join(":"))
      .join(" ");
  }, [selectedFilters]);

  // Filter
  const filteredMerchants = useMemo(() => {
    if (!searchQuery.trim()) return v2Merchants;
    const lower = searchQuery.toLowerCase();
    return v2Merchants.filter(
      (m) =>
        m.name.toLowerCase().includes(lower) ||
        m.id.toLowerCase().includes(lower) ||
        m.category.toLowerCase().includes(lower) ||
        m.source.toLowerCase().includes(lower) ||
        m.publishers.some((p) => p.toLowerCase().includes(lower))
    );
  }, [searchQuery]);

  // Reset page on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters]);

  // Paginate
  const totalItems = filteredMerchants.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentPageData = filteredMerchants.slice(startIndex, endIndex);

  // Action callbacks
  const handleEdit = useCallback(
    (merchant: V2Merchant) => {
      toast({
        title: "Edit Merchant",
        description: `Opening editor for "${merchant.name}"`,
      });
    },
    [toast]
  );

  const handleView = useCallback(
    (merchant: V2Merchant) => {
      toast({
        title: "Merchant Details",
        description: `${merchant.name} (${merchant.id}) — ${merchant.category}`,
      });
    },
    [toast]
  );

  const handleDelete = useCallback(
    (merchant: V2Merchant) => {
      toast({
        title: "Delete Merchant",
        description: `Delete action for "${merchant.name}" — not yet implemented`,
        variant: "destructive",
      });
    },
    [toast]
  );

  const columns = useMemo(
    () =>
      createV2MerchantColumns({
        onEdit: handleEdit,
        onView: handleView,
        onDelete: handleDelete,
      }),
    [handleEdit, handleView, handleDelete]
  );

  const handlePageSizeChange = useCallback((value: string) => {
    setPageSize(parseInt(value, 10));
    setCurrentPage(1);
  }, []);

  // Custom pagination — matches TMT pattern
  const customPagination = useMemo(
    () => (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {totalItems === 0 ? (
            <span>No items</span>
          ) : (
            <span>
              Showing {startIndex + 1}-{endIndex} of {totalItems} merchants
            </span>
          )}
          <div className="flex items-center ml-4">
            <span className="mr-2">Items per page:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-20">
                <SelectValue>{pageSize}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Pagination
          totalItems={totalItems}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    ),
    [
      totalItems,
      startIndex,
      endIndex,
      pageSize,
      currentPage,
      handlePageSizeChange,
    ]
  );

  const emptyState =
    selectedFilters.length > 0 ? (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MagnifyingGlassIcon className="h-10 w-10 text-gray-400 mb-3" />
        <h3 className="text-base font-semibold text-gray-900">
          No merchants found
        </h3>
        <p className="text-sm text-gray-500 mt-1 max-w-sm">
          Try adjusting your search terms or removing some filters.
        </p>
        <Button
          onClick={() => setSelectedFilters([])}
          variant="outline"
          className="mt-4"
        >
          Clear Filters
        </Button>
      </div>
    ) : (
      <div className="py-8 text-center text-muted-foreground">
        No merchants found
      </div>
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Merchant Manager"
        description="40,000+ merchants across all Kigo-powered platforms"
      />

      {/* Analytics KPIs */}
      <V2MerchantKPIs />

      {/* Tabs + Search row */}
      <Tabs defaultValue="all" className="w-full space-y-6">
        {/* Search + Tabs + Button row */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <CampaignListSearchBar
              selectedFilters={selectedFilters}
              onFiltersChange={setSelectedFilters}
            />
          </div>
          <TabsList>
            <TabsTrigger value="all">All Merchants</TabsTrigger>
            <TabsTrigger value="expired" className="flex items-center gap-1.5">
              Expired Offers
              <span className="bg-red-100 text-red-700 rounded-full text-[10px] font-bold px-1.5 py-0.5">
                47
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="duplicates"
              className="flex items-center gap-1.5"
            >
              Flagged Duplicates
              <span className="bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold px-1.5 py-0.5">
                3
              </span>
            </TabsTrigger>
          </TabsList>
          <Button className="shrink-0" onClick={() => setAddDialogOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" /> Add Merchant
          </Button>
        </div>

        {/* All Merchants Tab */}
        <TabsContent value="all" className="mt-0">
          <DataTable
            columns={columns as ColumnDef<unknown, unknown>[]}
            data={currentPageData as unknown[]}
            disablePagination={false}
            customPagination={customPagination}
            emptyState={emptyState}
            getRowClassName={
              getV2MerchantRowClassName as (row: unknown) => string
            }
            enableColumnDrag
          />
        </TabsContent>

        {/* Expired Offers Tab */}
        <TabsContent value="expired" className="mt-0">
          <V2ExpiredOffersTab />
        </TabsContent>

        {/* Flagged Duplicates Tab */}
        <TabsContent value="duplicates" className="mt-0">
          <V2DuplicatesTab />
        </TabsContent>
      </Tabs>

      <V2AddMerchantDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddMerchant}
      />
    </div>
  );
}
