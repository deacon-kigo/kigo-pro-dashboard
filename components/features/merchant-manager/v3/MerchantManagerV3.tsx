"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Button } from "@/components/atoms/Button";
import { merchants as merchantSeed } from "./mockData";
import { MerchantListSearchBar, type FilterTag } from "./MerchantListSearchBar";
import { MerchantListTable } from "./MerchantListTable";
import type { Merchant } from "./types";
import { useToast } from "@/lib/hooks/use-toast";

const PAGE_SIZE_DEFAULT = 20;

function countActive(merchant: Merchant): number {
  return merchant.offers.filter((o) => o.status === "published").length;
}

export default function MerchantManagerV3() {
  const router = useRouter();
  const [selectedFilters, setSelectedFilters] = useState<FilterTag[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
  const [data] = useState<Merchant[]>(merchantSeed);
  const { toast } = useToast();

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

  const handleView = useCallback(
    (m: Merchant) => {
      router.push(`/merchants/${encodeURIComponent(m.id)}`);
    },
    [router]
  );

  const handleEdit = useCallback(
    (m: Merchant) => {
      router.push(`/merchants/${encodeURIComponent(m.id)}?tab=edit`);
    },
    [router]
  );

  const handleDelete = useCallback(
    (m: Merchant) => {
      toast({
        title: "Delete merchant",
        description: `${m.name} (${m.id}) — delete flow not yet wired up.`,
      });
    },
    [toast]
  );

  const headerActions = (
    <Button
      variant="primary"
      icon={<PlusIcon className="h-4 w-4" />}
      onClick={() => router.push("/merchants/new")}
    >
      Add Merchant
    </Button>
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
        onRowClick={handleView}
      />
    </div>
  );
}
