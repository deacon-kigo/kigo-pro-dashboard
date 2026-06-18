"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Button } from "@/components/atoms/Button";
import { merchants as merchantSeed } from "./mockData";
import { MerchantListSearchBar, type FilterTag } from "./MerchantListSearchBar";
import { MerchantListTable } from "./MerchantListTable";
import {
  getCategoryDescendants,
  LEGACY_CATEGORY_TO_IDS,
} from "./category-select/taxonomy";
import type { Merchant } from "./types";
import { useToast } from "@/lib/hooks/use-toast";

const PAGE_SIZE_DEFAULT = 20;

type OfferStatusFilterKey = "active" | "unpublished" | "expired";

interface ParsedFilters {
  searchTerms: string[];
  categoryIdSet: Set<number>;
  catalogNames: Set<string>;
  offerStatusKeys: Set<OfferStatusFilterKey>;
  sort: "active-offers" | "a-z" | "z-a";
}

function parseFilters(filters: FilterTag[]): ParsedFilters {
  const searchTerms: string[] = [];
  const categoryIdSet = new Set<number>();
  const catalogNames = new Set<string>();
  const offerStatusKeys = new Set<OfferStatusFilterKey>();
  let sort: "active-offers" | "a-z" | "z-a" = "active-offers";
  for (const f of filters) {
    const val = f.value.split(":").slice(1).join(":");
    switch (f.category) {
      case "search":
        searchTerms.push(val);
        break;
      case "category": {
        const id = Number(val);
        if (Number.isFinite(id)) {
          for (const desc of getCategoryDescendants(id)) {
            categoryIdSet.add(desc);
          }
        }
        break;
      }
      case "catalog":
        catalogNames.add(val);
        break;
      case "offerStatus":
        if (val === "active" || val === "expired" || val === "unpublished") {
          offerStatusKeys.add(val);
        }
        break;
      case "sort":
        if (val === "a-z" || val === "z-a" || val === "active-offers") {
          sort = val;
        }
        break;
    }
  }
  return { searchTerms, categoryIdSet, catalogNames, offerStatusKeys, sort };
}

function countActive(merchant: Merchant): number {
  return merchant.offers.filter((o) => o.status === "published").length;
}

// Applies the filter chain over `data`. Per-axis bucket can be omitted to
// support faceted-count computation ("apply everything except offer-status,
// then count how many merchants would each offer-status pill add").
function filterMerchants(
  data: Merchant[],
  f: Pick<
    ParsedFilters,
    "searchTerms" | "categoryIdSet" | "catalogNames" | "offerStatusKeys"
  >
): Merchant[] {
  let results = data;

  if (f.searchTerms.length > 0) {
    const needles = f.searchTerms.map((t) => t.toLowerCase());
    results = results.filter((m) => {
      const hay = [
        m.name,
        m.id,
        m.category,
        ...(m.catalogs ?? []),
        ...m.offers.map((o) => o.name),
      ]
        .join(" ")
        .toLowerCase();
      return needles.some((n) => hay.includes(n));
    });
  }

  if (f.categoryIdSet.size > 0) {
    results = results.filter((m) => {
      const ids =
        m.categoryIds && m.categoryIds.length > 0
          ? m.categoryIds
          : (LEGACY_CATEGORY_TO_IDS[m.category] ?? []);
      for (const id of ids) {
        if (f.categoryIdSet.has(id)) return true;
      }
      return false;
    });
  }

  if (f.catalogNames.size > 0) {
    results = results.filter((m) =>
      (m.catalogs ?? []).some((c) => f.catalogNames.has(c))
    );
  }

  if (f.offerStatusKeys.size > 0) {
    results = results.filter((m) =>
      m.offers.some((o) => {
        if (f.offerStatusKeys.has("active") && o.status === "published")
          return true;
        if (
          f.offerStatusKeys.has("unpublished") &&
          (o.status === "paused" || o.status === "archived")
        )
          return true;
        if (f.offerStatusKeys.has("expired") && o.status === "expired")
          return true;
        return false;
      })
    );
  }

  return results;
}

export default function MerchantManagerV3() {
  const router = useRouter();
  const [selectedFilters, setSelectedFilters] = useState<FilterTag[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
  const [data] = useState<Merchant[]>(merchantSeed);
  const { toast } = useToast();

  const parsed = useMemo(
    () => parseFilters(selectedFilters),
    [selectedFilters]
  );
  const { searchTerms, categoryIdSet, catalogNames, offerStatusKeys, sort } =
    parsed;

  const searchQuery = searchTerms.join(" ");

  const filtered = useMemo<Merchant[]>(() => {
    const results = filterMerchants(data, {
      searchTerms,
      categoryIdSet,
      catalogNames,
      offerStatusKeys,
    });
    const sorted = [...results];
    if (sort === "a-z") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "z-a") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      sorted.sort((a, b) => countActive(b) - countActive(a));
    }
    return sorted;
  }, [data, searchTerms, categoryIdSet, catalogNames, offerStatusKeys, sort]);

  const handleFiltersChange = useCallback((filters: FilterTag[]) => {
    setSelectedFilters(filters);
    setPage(1);
  }, []);

  // Toggle from clicking an offer-status pill in the table — add if absent,
  // remove if already applied. The functional updater avoids stale closure
  // capture of `selectedFilters` from the surrounding scope.
  const handleOfferStatusToggle = useCallback(
    (status: OfferStatusFilterKey) => {
      const tagValue = `offerStatus:${status}`;
      setSelectedFilters((prev) => {
        const existing = prev.findIndex((f) => f.value === tagValue);
        if (existing >= 0) {
          return prev.filter((_, i) => i !== existing);
        }
        const label =
          status === "active"
            ? "Has active offers"
            : status === "unpublished"
              ? "Has unpublished offers"
              : "Has expired offers";
        return [...prev, { label, value: tagValue, category: "offerStatus" }];
      });
      setPage(1);
    },
    []
  );

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
        onOfferStatusToggle={handleOfferStatusToggle}
        activeOfferStatuses={offerStatusKeys}
      />
    </div>
  );
}
