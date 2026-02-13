"use client";

import React, { useMemo, memo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Button } from "@/components/atoms/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { OfferListSearchBar, FilterTag } from "./OfferListSearchBar";
import { OfferListTable } from "./OfferListTable";
import { OfferDeleteDialog } from "./OfferDeleteDialog";
import {
  MOCK_OFFERS,
  OfferListItem,
  semanticSearch,
} from "./offerListMockData";

const OfferListView = memo(function OfferListView() {
  const router = useRouter();

  // State
  const [offers, setOffers] = useState<OfferListItem[]>(MOCK_OFFERS);
  const [selectedFilters, setSelectedFilters] = useState<FilterTag[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<OfferListItem | null>(null);

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

  const handleTogglePublish = useCallback((offerId: string) => {
    setOffers((prev) =>
      prev.map((offer) => {
        if (offer.id === offerId) {
          const newStatus =
            offer.offerStatus === "published" ? "draft" : "published";
          return { ...offer, offerStatus: newStatus };
        }
        return offer;
      })
    );
  }, []);

  const handleEdit = useCallback((offerId: string) => {
    console.log("Edit offer:", offerId);
  }, []);

  const handleDelete = useCallback((offer: OfferListItem) => {
    setDeleteTarget(offer);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setOffers((prev) => prev.filter((o) => o.id !== deleteTarget.id));
    console.log("Deleted offer:", deleteTarget.id);
  }, [deleteTarget]);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteTarget(null);
  }, []);

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
      // "inactive" matches all non-published statuses (draft, expired, archived)
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

  // Create button
  const createOfferButton = useMemo(
    () => (
      <Button
        onClick={() => router.push("/offer-manager?version=p0.5&create=true")}
        className="flex items-center gap-1"
      >
        <PlusIcon className="h-4 w-4" />
        Create Offer
      </Button>
    ),
    [router]
  );

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
        data={filteredOffers}
        searchQuery={searchQuery}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onTogglePublish={handleTogglePublish}
        onEdit={handleEdit}
        onDelete={handleDelete}
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

export default OfferListView;
