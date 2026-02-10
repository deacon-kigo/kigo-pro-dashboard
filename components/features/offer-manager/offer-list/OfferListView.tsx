"use client";

import React, { useMemo, memo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Fuse from "fuse.js";
import { Button } from "@/components/atoms/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { OfferListSearchBar, FilterTag } from "./OfferListSearchBar";
import { OfferListTable } from "./OfferListTable";
import { OfferDeleteDialog } from "./OfferDeleteDialog";
import { OfferBulkActions } from "./OfferBulkActions";
import { OfferBulkDeleteDialog } from "./OfferBulkDeleteDialog";
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
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [showBulkDelete, setShowBulkDelete] = useState(false);

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

  // Clear selection when filters change
  useEffect(() => {
    setRowSelection({});
  }, [selectedFilters]);

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

  const handleClone = useCallback((offerId: string) => {
    console.log("Clone offer:", offerId);
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

  // Derived selected offers from row selection
  const selectedOffers = useMemo(() => {
    return Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((index) => filteredOffers[parseInt(index)])
      .filter(Boolean);
  }, [rowSelection, filteredOffers]);

  // Bulk action handlers
  const handleBulkPublish = useCallback(() => {
    const draftIds = new Set(
      selectedOffers.filter((o) => o.offerStatus === "draft").map((o) => o.id)
    );
    setOffers((prev) =>
      prev.map((offer) =>
        draftIds.has(offer.id)
          ? { ...offer, offerStatus: "published" as const }
          : offer
      )
    );
    setRowSelection({});
  }, [selectedOffers]);

  const handleBulkUnpublish = useCallback(() => {
    const publishedIds = new Set(
      selectedOffers
        .filter((o) => o.offerStatus === "published")
        .map((o) => o.id)
    );
    setOffers((prev) =>
      prev.map((offer) =>
        publishedIds.has(offer.id)
          ? { ...offer, offerStatus: "draft" as const }
          : offer
      )
    );
    setRowSelection({});
  }, [selectedOffers]);

  const handleBulkClone = useCallback(() => {
    const clones = selectedOffers.map((offer, i) => ({
      ...offer,
      id: `OFF-CLONE-${Date.now()}-${i}`,
      offerName: `${offer.offerName} (Copy)`,
      offerStatus: "draft" as const,
      redemptions: 0,
    }));
    setOffers((prev) => [...prev, ...clones]);
    setRowSelection({});
  }, [selectedOffers]);

  const handleBulkDelete = useCallback(async () => {
    const idsToDelete = new Set(selectedOffers.map((o) => o.id));
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setOffers((prev) => prev.filter((o) => !idsToDelete.has(o.id)));
    setRowSelection({});
  }, [selectedOffers]);

  const handleClearSelection = useCallback(() => {
    setRowSelection({});
  }, []);

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
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 100% 0%, #ccfffe35 0%, transparent 50%),
            radial-gradient(ellipse 100% 60% at 0% 100%, #c7d2fe25 0%, transparent 45%),
            radial-gradient(ellipse 80% 50% at 50% 50%, #e0e7ff15 0%, transparent 50%),
            linear-gradient(145deg, #f0fffe80 0%, white 40%, #e0e7ff30 80%, white 100%)
          `,
        }}
      >
        {/* Illustration — centered background */}
        <div className="absolute left-1/2 -translate-x-1/3 top-1/2 -translate-y-1/2 w-[280px] h-[130px] hidden md:block">
          <Image
            src="/illustration/offer-page-banner.png"
            alt=""
            fill
            className="object-contain animate-[floatY_4s_ease-in-out_infinite]"
            priority
          />
        </div>

        <div className="relative flex items-center justify-between px-8 py-6 z-10">
          {/* Left: text content */}
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Offer Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                View, search, and manage all offers across merchants.
              </p>
            </div>
          </div>

          {/* Right: CTA button */}
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
        onClone={handleClone}
        onDelete={handleDelete}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />

      <OfferBulkActions
        selectedCount={selectedOffers.length}
        selectedOffers={selectedOffers}
        onBulkPublish={handleBulkPublish}
        onBulkUnpublish={handleBulkUnpublish}
        onBulkClone={handleBulkClone}
        onBulkDelete={() => setShowBulkDelete(true)}
        onClearSelection={handleClearSelection}
      />

      <OfferDeleteDialog
        isOpen={deleteTarget !== null}
        onClose={handleCloseDeleteDialog}
        onConfirmDelete={handleConfirmDelete}
        offer={deleteTarget}
      />

      <OfferBulkDeleteDialog
        isOpen={showBulkDelete}
        onClose={() => setShowBulkDelete(false)}
        onConfirmDelete={handleBulkDelete}
        selectedOffers={selectedOffers}
      />
    </div>
  );
});

export default OfferListView;
