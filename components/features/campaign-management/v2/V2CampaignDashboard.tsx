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
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/hooks/use-toast";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { V2Campaign } from "./types";
import { v2Campaigns } from "./mockData";
import { createV2CampaignColumns, getV2RowClassName } from "./campaignColumns";
import {
  CampaignListSearchBar,
  CampaignFilterTag,
} from "@/components/features/tmt-campaigns/CampaignListSearchBar";
import V2CampaignKPIs from "./V2CampaignKPIs";
import V2CampaignCharts from "./V2CampaignCharts";

export default function V2CampaignDashboard() {
  const { toast } = useToast();
  const [selectedFilters, setSelectedFilters] = useState<CampaignFilterTag[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Parse unified search filters
  const { searchTerms, statuses } = useMemo(() => {
    const searchTerms: string[] = [];
    const statuses: string[] = [];
    for (const f of selectedFilters) {
      const val = f.value.split(":").slice(1).join(":");
      if (f.category === "search") searchTerms.push(val);
      else if (f.category === "status") statuses.push(val);
    }
    return { searchTerms, statuses };
  }, [selectedFilters]);

  const searchQuery = searchTerms.join(" ");

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    let results = [...v2Campaigns];

    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(lower) ||
          c.id.toLowerCase().includes(lower) ||
          c.publisher.toLowerCase().includes(lower) ||
          c.campaignType.toLowerCase().includes(lower)
      );
    }

    if (statuses.length > 0) {
      results = results.filter((c) => {
        if (statuses.includes("active")) return c.deliveryStatus === "live";
        if (statuses.includes("inactive"))
          return c.deliveryStatus === "planned";
        return true;
      });
    }

    return results;
  }, [searchQuery, statuses]);

  // Reset page on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters]);

  // Paginate
  const totalItems = filteredCampaigns.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentPageData = filteredCampaigns.slice(startIndex, endIndex);

  // Action callbacks
  const handleEdit = useCallback(
    (campaign: V2Campaign) => {
      toast({
        title: "Edit Campaign",
        description: `Opening editor for "${campaign.name}"`,
      });
    },
    [toast]
  );

  const handleView = useCallback(
    (campaign: V2Campaign) => {
      toast({
        title: "Campaign Details",
        description: `${campaign.name} (${campaign.id}) — ${campaign.publisher}`,
      });
    },
    [toast]
  );

  const handleDelete = useCallback(
    (campaign: V2Campaign) => {
      toast({
        title: "Delete Campaign",
        description: `Delete action for "${campaign.name}" — not yet implemented`,
        variant: "destructive",
      });
    },
    [toast]
  );

  const columns = useMemo(
    () =>
      createV2CampaignColumns({
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
              Showing {startIndex + 1}-{endIndex} of {totalItems} items
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
          No campaigns found
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
        No campaigns found
      </div>
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaign Manager"
        description={`${v2Campaigns.length} campaigns across all publishers`}
      />

      {/* Analytics KPIs + Charts */}
      <V2CampaignKPIs />
      <V2CampaignCharts />

      {/* Unified Search Bar + New Campaign Button */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <CampaignListSearchBar
            selectedFilters={selectedFilters}
            onFiltersChange={setSelectedFilters}
          />
        </div>
        <Button className="shrink-0">
          <PlusIcon className="h-4 w-4 mr-2" /> New Campaign
        </Button>
      </div>

      {/* DataTable — no card wrapper, matches TMT pattern */}
      <DataTable
        columns={columns as ColumnDef<unknown, unknown>[]}
        data={currentPageData as unknown[]}
        disablePagination={false}
        customPagination={customPagination}
        emptyState={emptyState}
        getRowClassName={getV2RowClassName as (row: unknown) => string}
        enableColumnDrag
      />
    </div>
  );
}
