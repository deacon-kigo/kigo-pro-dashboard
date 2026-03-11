"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/organisms/DataTable";
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
import { LandingPageConfig } from "@/types/tmt-campaign";
import { apiService } from "@/lib/services/tmtCampaignService";
import {
  getCampaignStatus,
  getCampaignListColumns,
  getRowClassName,
} from "./campaignListColumns";
import {
  CampaignListSearchBar,
  CampaignFilterTag,
  CAMPAIGN_SEMANTIC_MAP,
} from "./CampaignListSearchBar";
import { isCampaignExpired } from "@/lib/tmt/timezone";
import CampaignAnalytics from "./CampaignAnalytics";
import TMTCodesModal from "./TMTCodesModal";

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function TMTCampaignDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<LandingPageConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<CampaignFilterTag[]>(
    []
  );
  const [codesModalCampaign, setCodesModalCampaign] =
    useState<LandingPageConfig | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadCampaigns = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getAllCampaigns();
      setCampaigns(data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  // Parse filters into categories
  const { searchTerms, statuses, types, dateRanges, features } = useMemo(() => {
    const searchTerms: string[] = [];
    const statuses: string[] = [];
    const types: string[] = [];
    const dateRanges: string[] = [];
    const features: string[] = [];
    for (const f of selectedFilters) {
      const val = f.value.split(":").slice(1).join(":");
      switch (f.category) {
        case "search":
          searchTerms.push(val);
          break;
        case "status":
          statuses.push(val);
          break;
        case "type":
          types.push(val);
          break;
        case "dateRange":
          dateRanges.push(val);
          break;
        case "feature":
          features.push(val);
          break;
      }
    }
    return { searchTerms, statuses, types, dateRanges, features };
  }, [selectedFilters]);

  const searchQuery = searchTerms.join(" ");

  // Filtered & sorted campaigns
  const filteredCampaigns = useMemo(() => {
    // Annotate campaigns with computed status for filtering
    const annotated = campaigns.map((c) => ({
      ...c,
      _status: getCampaignStatus(c),
    }));

    let results = annotated;

    // 1. Text search: Fuse.js fuzzy + semantic concept expansion
    if (searchQuery.trim()) {
      const fuse = new Fuse(results, {
        keys: [
          { name: "campaignName", weight: 0.5 },
          { name: "affiliateSlug", weight: 0.3 },
          { name: "title", weight: 0.2 },
        ],
        threshold: 0.3,
        includeScore: true,
        ignoreLocation: true,
      });
      const fuseResults = fuse.search(searchQuery).map((r) => r.item);

      // Semantic concept expansion
      const semanticResults: typeof results = [];
      for (const term of searchTerms) {
        const lower = term.toLowerCase();
        for (const [concept, config] of Object.entries(CAMPAIGN_SEMANTIC_MAP)) {
          if (lower.includes(concept) || concept.includes(lower)) {
            if (config.filterFn) {
              semanticResults.push(...results.filter(config.filterFn));
            }
          }
        }
      }

      // Union: Fuse results first, then semantic additions
      const seen = new Set<string>();
      const merged: typeof results = [];
      for (const item of [...fuseResults, ...semanticResults]) {
        const id = item.id || item.campaignName;
        if (!seen.has(id)) {
          seen.add(id);
          merged.push(item);
        }
      }
      results = merged;
    }

    // 2. Structured filters (AND across categories, OR within)
    if (statuses.length > 0) {
      results = results.filter((c) => statuses.includes(c._status));
    }

    if (types.length > 0) {
      results = results.filter((c) => types.includes(c.getCode || ""));
    }

    if (dateRanges.length > 0) {
      results = results.filter((c) => {
        if (!c.endCampaignDate) {
          return dateRanges.includes("no_end_date");
        }
        const daysUntilEnd = Math.ceil(
          (new Date(c.endCampaignDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        );
        if (
          dateRanges.includes("this_week") &&
          daysUntilEnd >= 0 &&
          daysUntilEnd <= 7
        )
          return true;
        if (
          dateRanges.includes("this_month") &&
          daysUntilEnd >= 0 &&
          daysUntilEnd <= 30
        )
          return true;
        if (
          dateRanges.includes("30_days") &&
          daysUntilEnd >= 0 &&
          daysUntilEnd <= 30
        )
          return true;
        if (dateRanges.includes("no_end_date") && !c.endCampaignDate)
          return true;
        if (dateRanges.includes("expired") && daysUntilEnd < 0) return true;
        return false;
      });
    }

    if (features.length > 0) {
      results = results.filter((c) => {
        if (features.includes("form") && c.showForm) return true;
        if (features.includes("copy_code") && c.copyCode?.enabled) return true;
        return false;
      });
    }

    // Default sort: newest updated first
    return [...results].sort((a, b) =>
      (b.updatedAt || "").localeCompare(a.updatedAt || "")
    );
  }, [
    campaigns,
    searchQuery,
    searchTerms,
    statuses,
    types,
    dateRanges,
    features,
  ]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters]);

  const handleDelete = useCallback(async (campaign: LandingPageConfig) => {
    if (!campaign.id || !confirm(`Delete "${campaign.campaignName}"?`)) return;
    setDeletingId(campaign.id);
    try {
      await apiService.deleteCampaign(campaign.id);
      toast({
        title: "Deleted",
        description: `"${campaign.campaignName}" has been deleted.`,
      });
      loadCampaigns();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  }, []);

  const handleEdit = useCallback(
    (campaign: LandingPageConfig) =>
      router.push(`/promo-campaigns/${campaign.id}`),
    [router]
  );

  const handlePreview = useCallback(
    (campaign: LandingPageConfig) =>
      window.open(`/p/${campaign.affiliateSlug}?code=TEST`, "_blank"),
    []
  );

  const handleRowClick = useCallback(
    (row: LandingPageConfig) => router.push(`/promo-campaigns/${row.id}`),
    [router]
  );

  const handlePageSizeChange = useCallback((value: string) => {
    setPageSize(parseInt(value, 10));
    setCurrentPage(1);
  }, []);

  // Paginated data
  const paginationValues = useMemo(() => {
    const totalItems = filteredCampaigns.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const currentPageData = filteredCampaigns.slice(startIndex, endIndex);
    return { totalItems, startIndex, endIndex, currentPageData };
  }, [filteredCampaigns, currentPage, pageSize]);

  const { totalItems, startIndex, endIndex, currentPageData } =
    paginationValues;

  // Column definitions
  const columns = useMemo(
    () =>
      getCampaignListColumns({
        onEdit: handleEdit,
        onCodes: setCodesModalCampaign,
        onPreview: handlePreview,
        onDelete: handleDelete,
      }),
    [handleEdit, handlePreview, handleDelete]
  );

  // Custom pagination UI (matching OfferListTable)
  const customPagination = useMemo(
    () => (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div>
            {totalItems === 0 ? (
              <span>No items</span>
            ) : (
              <span>
                Showing {startIndex + 1}-{endIndex} of {totalItems} items
              </span>
            )}
          </div>
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
        <div className="flex items-center space-x-2">
          <Pagination
            totalItems={totalItems}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
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

  const emptyState = isLoading ? (
    <div className="py-8 text-center text-muted-foreground">
      Loading campaigns...
    </div>
  ) : selectedFilters.length > 0 ? (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <MagnifyingGlassIcon className="h-10 w-10 text-gray-400 mb-3" />
      <h3 className="text-base font-semibold text-gray-900">
        No campaigns found
      </h3>
      <p className="text-sm text-gray-500 mt-1 max-w-sm">
        Try adjusting your search terms or removing some filters to see more
        results.
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
      {/* Analytics Section */}
      <CampaignAnalytics campaigns={campaigns} />

      {/* Unified Search Bar + New Campaign Button */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <CampaignListSearchBar
            selectedFilters={selectedFilters}
            onFiltersChange={setSelectedFilters}
          />
        </div>
        <Button
          onClick={() => router.push("/promo-campaigns/new")}
          className="shrink-0"
        >
          <PlusIcon className="h-4 w-4 mr-2" /> New Campaign
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns as ColumnDef<unknown, unknown>[]}
        data={currentPageData as unknown[]}
        disablePagination={false}
        customPagination={customPagination}
        onRowClick={handleRowClick as (row: unknown) => void}
        emptyState={emptyState}
        getRowClassName={getRowClassName}
        enableColumnDrag
      />

      {/* Codes Modal */}
      {codesModalCampaign && (
        <TMTCodesModal
          campaign={codesModalCampaign}
          onClose={() => setCodesModalCampaign(null)}
        />
      )}
    </div>
  );
}
