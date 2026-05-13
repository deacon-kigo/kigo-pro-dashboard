"use client";

import React, { useCallback, useMemo, useState } from "react";
import { PlusIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Button } from "@/components/atoms/Button";
import { merchants as merchantSeed } from "./mockData";
import { MerchantListSearchBar, type FilterTag } from "./MerchantListSearchBar";
import { MerchantListTable } from "./MerchantListTable";
import type { Merchant } from "./types";
import AddMerchantDialog from "./AddMerchantDialog";
import MerchantDetailDialog from "./MerchantDetailDialog";
import type { MerchantData } from "@/components/features/offer-manager/p0-merchant/MerchantCreationInline";
import { useToast } from "@/lib/hooks/use-toast";

const PAGE_SIZE_DEFAULT = 20;

function countActive(merchant: Merchant): number {
  return merchant.offers.filter((o) => o.status === "Active").length;
}

export default function MerchantManagerV3() {
  const [selectedFilters, setSelectedFilters] = useState<FilterTag[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(
    null
  );
  const [data, setData] = useState<Merchant[]>(merchantSeed);
  const { toast } = useToast();

  const duplicatesCount = 3;

  // Parse selected filters into structured buckets (mirrors OfferListView)
  const { searchTerms, categories, commissionFlags, sort } = useMemo(() => {
    const searchTerms: string[] = [];
    const categories: string[] = [];
    const commissionFlags: string[] = [];
    let sort: "active-offers" | "a-z" | "z-a" = "active-offers";
    for (const f of selectedFilters) {
      const val = f.value.split(":").slice(1).join(":");
      switch (f.category) {
        case "search":
          searchTerms.push(val);
          break;
        case "category":
          categories.push(val);
          break;
        case "commission":
          commissionFlags.push(val);
          break;
        case "sort":
          if (val === "a-z" || val === "z-a" || val === "active-offers") {
            sort = val;
          }
          break;
      }
    }
    return { searchTerms, categories, commissionFlags, sort };
  }, [selectedFilters]);

  const searchQuery = searchTerms.join(" ");

  const filtered = useMemo<Merchant[]>(() => {
    let results = data;

    // Text search across name + id
    if (searchTerms.length > 0) {
      const needles = searchTerms.map((t) => t.toLowerCase());
      results = results.filter((m) => {
        const hay = `${m.name} ${m.id}`.toLowerCase();
        return needles.some((n) => hay.includes(n));
      });
    }

    // Category filter (OR within)
    if (categories.length > 0) {
      results = results.filter((m) => categories.includes(m.category));
    }

    // Commission filter
    if (commissionFlags.length > 0) {
      const wantsYes = commissionFlags.includes("yes");
      const wantsNo = commissionFlags.includes("no");
      results = results.filter((m) => {
        if (wantsYes && m.commissionOffers) return true;
        if (wantsNo && !m.commissionOffers) return true;
        return false;
      });
    }

    const sorted = [...results];
    if (sort === "a-z") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "z-a") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      sorted.sort((a, b) => countActive(b) - countActive(a));
    }
    return sorted;
  }, [data, searchTerms, categories, commissionFlags, sort]);

  const handleFiltersChange = useCallback((filters: FilterTag[]) => {
    setSelectedFilters(filters);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((p: number) => {
    setPage(p);
  }, []);

  const handlePageSizeChange = useCallback((value: string) => {
    setPageSize(parseInt(value, 10));
    setPage(1);
  }, []);

  const handleView = useCallback((m: Merchant) => {
    setSelectedMerchant(m);
  }, []);

  const handleEdit = useCallback((m: Merchant) => {
    // Edit lives in the same detail dialog footer for now.
    setSelectedMerchant(m);
  }, []);

  const handleDelete = useCallback((m: Merchant) => {
    console.log("[v3] Delete merchant:", m.id, m.name);
  }, []);

  const handleRowClick = useCallback((row: Merchant) => {
    setSelectedMerchant(row);
  }, []);

  const handleDetailOpenChange = useCallback((open: boolean) => {
    if (!open) setSelectedMerchant(null);
  }, []);

  const handleEditProfile = useCallback(
    (m: Merchant) => {
      toast({
        title: "Edit Merchant Profile",
        description: `Editor for ${m.name} (${m.id}) — not yet wired up.`,
      });
    },
    [toast]
  );

  const handleAddMerchantSave = useCallback(
    (merchant: MerchantData) => {
      const name =
        merchant.dbaName.trim() ||
        merchant.corpName.trim() ||
        "Unnamed Merchant";
      // Seed new IDs in the MID-90001+ range so they are visually distinct from
      // the canned fixture IDs (MID-100xx). Uses current list length, so adding
      // multiple merchants in one session generates a stable, incrementing ID.
      const newId = `MID-${90000 + data.length + 1}`;
      const newMerchant: Merchant = {
        key: `new-${Date.now()}`,
        name,
        id: newId,
        // NOTE: MerchantCreationInline doesn't capture category/emoji/color.
        // Sensible defaults for demo — wire to real category picker later.
        category: "Retail",
        emoji: "🏪",
        color: "#e0f2fe",
        source: "Direct",
        commissionOffers: false,
        offers: [],
        campaigns: [],
      };
      setData((prev) => [newMerchant, ...prev]);
      setIsAddOpen(false);
      toast({
        title: "Merchant added",
        description: `${newMerchant.name} (${newMerchant.id}) was added.`,
      });
    },
    [data.length, toast]
  );

  const headerActions = (
    <div className="flex items-center gap-3">
      <Button
        variant="secondary"
        icon={<DocumentDuplicateIcon className="h-4 w-4" />}
        onClick={() => console.log("[v3] Open duplicates panel")}
      >
        <span className="flex items-center gap-2">
          Duplicates
          {duplicatesCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-semibold text-white">
              {duplicatesCount}
            </span>
          )}
        </span>
      </Button>
      <Button
        variant="primary"
        icon={<PlusIcon className="h-4 w-4" />}
        onClick={() => setIsAddOpen(true)}
      >
        Add Merchant
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Merchant Manager"
        description="40,000+ merchants across all Kigo-powered platforms"
        emoji="🏪"
        actions={headerActions}
        variant="aurora"
      />

      <MerchantListSearchBar
        selectedFilters={selectedFilters}
        onFiltersChange={handleFiltersChange}
      />

      <MerchantListTable
        data={filtered}
        searchQuery={searchQuery}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={handleRowClick}
      />

      <AddMerchantDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSave={handleAddMerchantSave}
      />

      <MerchantDetailDialog
        merchant={selectedMerchant}
        open={selectedMerchant !== null}
        onOpenChange={handleDetailOpenChange}
        onEditProfile={handleEditProfile}
      />
    </div>
  );
}
