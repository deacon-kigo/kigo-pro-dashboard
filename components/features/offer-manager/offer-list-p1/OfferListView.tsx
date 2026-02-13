"use client";

import React, { useMemo, memo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Button } from "@/components/atoms/Button";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/outline";
import { OfferListSearchBar, FilterTag } from "./OfferListSearchBar";
import { OfferListTable } from "./OfferListTable";
import { OfferDeleteDialog } from "./OfferDeleteDialog";
import {
  MOCK_OFFERS,
  OfferListItem,
  semanticSearch,
} from "./offerListMockData";

const SESSION_KEY = "p1.1-offer-list-state";

// ---------------------------------------------------------------------------
// Loading Skeleton
// ---------------------------------------------------------------------------
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Banner skeleton */}
      <div className="rounded-2xl bg-gray-100 animate-pulse">
        <div className="flex items-center justify-between px-8 py-6">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-72 bg-gray-200 rounded" />
          </div>
          <div className="h-9 w-32 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Search bar skeleton */}
      <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />

      {/* Table skeleton */}
      <div className="border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 border-b px-4 py-3 flex gap-8">
          {[80, 160, 140, 100, 100, 90].map((w, i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 rounded animate-pulse"
              style={{ width: w }}
            />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: 5 }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="border-b last:border-b-0 px-4 py-4 flex gap-8 items-center"
          >
            <div className="h-5 w-10 bg-gray-100 rounded-full animate-pulse" />
            <div
              className="h-4 bg-gray-100 rounded animate-pulse"
              style={{ width: 140 + Math.random() * 60 }}
            />
            <div
              className="h-4 bg-gray-100 rounded animate-pulse"
              style={{ width: 100 + Math.random() * 60 }}
            />
            <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
            <div className="h-8 w-24 bg-gray-100 rounded animate-pulse" />
          </div>
        ))}
        {/* Pagination skeleton */}
        <div className="border-t px-4 py-3 flex justify-between items-center">
          <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
          <div className="h-8 w-32 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error State
// ---------------------------------------------------------------------------
function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-amber-400 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900">
          Something went wrong
        </h2>
        <p className="text-sm text-gray-500 mt-1 max-w-md">{message}</p>
        <Button onClick={onRetry} variant="outline" className="mt-6 gap-2">
          <ArrowPathIcon className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty States
// ---------------------------------------------------------------------------
function FirstTimeEmptyState({ onCreateOffer }: { onCreateOffer: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="rounded-full bg-primary-brand/10 p-4 mb-4">
        <DocumentPlusIcon className="h-10 w-10 text-primary-brand" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900">
        Create your first offer
      </h2>
      <p className="text-sm text-gray-500 mt-1 max-w-sm">
        Get started by creating an offer for one of your merchants. Offers drive
        engagement and bring customers through the door.
      </p>
      <Button onClick={onCreateOffer} className="mt-6 gap-2">
        <PlusIcon className="h-4 w-4" />
        Create Offer
      </Button>
    </div>
  );
}

function NoResultsEmptyState({
  onClearFilters,
}: {
  onClearFilters: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <MagnifyingGlassIcon className="h-10 w-10 text-gray-400 mb-3" />
      <h3 className="text-base font-semibold text-gray-900">No offers found</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-sm">
        Try adjusting your search terms or removing some filters to see more
        results.
      </p>
      <Button onClick={onClearFilters} variant="outline" className="mt-4">
        Clear Filters
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
const OfferListViewP1 = memo(function OfferListViewP1() {
  const router = useRouter();

  // Loading & error state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [offers, setOffers] = useState<OfferListItem[]>(MOCK_OFFERS);
  const [selectedFilters, setSelectedFilters] = useState<FilterTag[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<OfferListItem | null>(null);

  // Restore persisted list state from sessionStorage (back-to-list navigation)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        if (state.selectedFilters) setSelectedFilters(state.selectedFilters);
        if (state.currentPage) setCurrentPage(state.currentPage);
        if (state.pageSize) setPageSize(state.pageSize);
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Simulate initial loading (replace with real API call in production)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Parse filters into categories
  const { searchTerms, merchantIds, offerTypes, statuses } = useMemo(() => {
    const searchTerms: string[] = [];
    const merchantIds: string[] = [];
    const offerTypes: string[] = [];
    const statuses: string[] = [];
    for (const f of selectedFilters) {
      const val = f.value.split(":").slice(1).join(":");
      switch (f.category) {
        case "search":
          searchTerms.push(val);
          break;
        case "merchant":
          merchantIds.push(val);
          break;
        case "type":
          offerTypes.push(val);
          break;
        case "status":
          statuses.push(val);
          break;
      }
    }
    return { searchTerms, merchantIds, offerTypes, statuses };
  }, [selectedFilters]);

  // Derive searchQuery for table highlighting
  const searchQuery = searchTerms.join(" ");

  // Handlers
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((value: string) => {
    setPageSize(parseInt(value, 10));
    setCurrentPage(1);
  }, []);

  const handleEdit = useCallback(
    (offerId: string) => {
      // Store offer data for wizard to read
      const offer = offers.find((o) => o.id === offerId);
      if (offer) {
        localStorage.setItem("editOffer", JSON.stringify(offer));
      }
      // Persist list state before navigating
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ selectedFilters, currentPage, pageSize })
      );
      router.push(`/offer-manager?version=p1.1&edit=${offerId}`);
    },
    [router, offers, selectedFilters, currentPage, pageSize]
  );

  const handleDelete = useCallback((offer: OfferListItem) => {
    setDeleteTarget(offer);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setOffers((prev) => prev.filter((o) => o.id !== deleteTarget.id));
  }, [deleteTarget]);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  // Row-click navigation to offer detail / edit view
  const handleRowClick = useCallback(
    (offer: OfferListItem) => {
      // Store offer data for wizard to read
      localStorage.setItem("editOffer", JSON.stringify(offer));
      // Persist list state before navigating
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ selectedFilters, currentPage, pageSize })
      );
      router.push(`/offer-manager?version=p1.1&edit=${offer.id}`);
    },
    [router, selectedFilters, currentPage, pageSize]
  );

  // Filtered data
  const filteredOffers = useMemo(() => {
    let results = offers;

    // 1. Text search: Fuse.js fuzzy + semantic concept expansion
    if (searchQuery.trim()) {
      const fuse = new Fuse(results, {
        keys: [
          { name: "offerName", weight: 0.5 },
          { name: "merchantName", weight: 0.3 },
          { name: "id", weight: 0.2 },
        ],
        threshold: 0.3,
        includeScore: true,
        ignoreLocation: true,
      });
      const fuseResults = fuse.search(searchQuery).map((r) => r.item);
      const semanticResults = semanticSearch(results, searchTerms);

      // Union: Fuse results first (relevance-ranked), then semantic additions
      const seen = new Set<string>();
      const merged: OfferListItem[] = [];
      for (const item of [...fuseResults, ...semanticResults]) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          merged.push(item);
        }
      }
      results = merged;
    }

    // 2. Structured filters (AND across categories, OR within)
    if (merchantIds.length > 0) {
      results = results.filter((o) => merchantIds.includes(o.merchantId));
    }
    if (offerTypes.length > 0) {
      results = results.filter((o) => offerTypes.includes(o.offerType));
    }
    if (statuses.length > 0) {
      const hasInactive = statuses.includes("inactive");
      const hasPublished = statuses.includes("published");
      results = results.filter((o) => {
        if (hasPublished && o.offerStatus === "published") return true;
        if (hasInactive && o.offerStatus !== "published") return true;
        return false;
      });
    }

    return results;
  }, [offers, searchQuery, searchTerms, merchantIds, offerTypes, statuses]);

  // Default sort: newest first (by endDate descending)
  const sortedOffers = useMemo(() => {
    return [...filteredOffers].sort((a, b) =>
      b.endDate.localeCompare(a.endDate)
    );
  }, [filteredOffers]);

  // Empty state for table (shown when filters return no results)
  const tableEmptyState = useMemo(
    () => <NoResultsEmptyState onClearFilters={() => setSelectedFilters([])} />,
    []
  );

  // Create button
  const createOfferButton = useMemo(
    () => (
      <Button
        onClick={() => router.push("/offer-manager?version=p1.1&create=true")}
        className="flex items-center gap-1"
      >
        <PlusIcon className="h-4 w-4" />
        Create Offer
      </Button>
    ),
    [router]
  );

  // Retry handler for error state
  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    // Re-trigger loading simulation
    setTimeout(() => setIsLoading(false), 600);
  }, []);

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  // First-time experience: no offers exist at all
  if (offers.length === 0) {
    return (
      <div className="space-y-6">
        <div
          className="rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, #f0f9ff 0%, #e8faf3 50%, #f5f3ff 100%)",
          }}
        >
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Offer Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                View, search, and manage all offers across merchants.
              </p>
            </div>
            <div className="shrink-0">{createOfferButton}</div>
          </div>
        </div>
        <FirstTimeEmptyState
          onCreateOffer={() =>
            router.push("/offer-manager?version=p1.1&create=true")
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Offer Manager Banner */}
      <div
        className="rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, #f0f9ff 0%, #e8faf3 50%, #f5f3ff 100%)",
        }}
      >
        <div className="flex items-center justify-between px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Offer Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View, search, and manage all offers across merchants.
            </p>
          </div>
          <div className="shrink-0">{createOfferButton}</div>
        </div>
      </div>

      <OfferListSearchBar
        selectedFilters={selectedFilters}
        onFiltersChange={setSelectedFilters}
      />

      <OfferListTable
        data={sortedOffers}
        searchQuery={searchQuery}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={handleRowClick}
        emptyState={tableEmptyState}
      />

      <OfferDeleteDialog
        isOpen={deleteTarget !== null}
        onClose={handleCloseDeleteDialog}
        onConfirmDelete={handleConfirmDelete}
        offer={deleteTarget}
      />
    </div>
  );
});

export default OfferListViewP1;
