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

  // Parse selected filters into structured buckets (mirrors OfferListView).
  // Category pills carry `category:<categoryId>`; we resolve each to its full
  // descendant set so selecting a parent matches merchants tagged with any
  // leaf underneath.
  const { searchTerms, categoryIdSet, catalogNames, offerStatusKeys, sort } =
    useMemo(() => {
      const searchTerms: string[] = [];
      const categoryIdSet = new Set<number>();
      const catalogNames = new Set<string>();
      const offerStatusKeys = new Set<"active" | "expired" | "unpublished">();
      let sort: "active-offers" | "a-z" | "z-a" = "active-offers";
      for (const f of selectedFilters) {
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
            if (
              val === "active" ||
              val === "expired" ||
              val === "unpublished"
            ) {
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
      return {
        searchTerms,
        categoryIdSet,
        catalogNames,
        offerStatusKeys,
        sort,
      };
    }, [selectedFilters]);

  const searchQuery = searchTerms.join(" ");

  const filtered = useMemo<Merchant[]>(() => {
    let results = data;

    // Keyword search — OR across stacked terms, scoped to fields the operator
    // can verify in the table (name / id / categories / catalogs / offer
    // names). Source / website / contact / detail live only on the detail
    // page and were dropped from the haystack 2026-06-18.
    if (searchTerms.length > 0) {
      const needles = searchTerms.map((t) => t.toLowerCase());
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

    // Category filter (OR within) — resolves each merchant to a set of
    // categoryIds (explicit `categoryIds` if present, otherwise the legacy
    // single-string `category` via LEGACY_CATEGORY_TO_IDS) and checks for
    // intersection with the selected descendant set.
    if (categoryIdSet.size > 0) {
      results = results.filter((m) => {
        const ids =
          m.categoryIds && m.categoryIds.length > 0
            ? m.categoryIds
            : (LEGACY_CATEGORY_TO_IDS[m.category] ?? []);
        for (const id of ids) {
          if (categoryIdSet.has(id)) return true;
        }
        return false;
      });
    }

    // Catalog filter — merchant must belong to ANY selected catalog.
    if (catalogNames.size > 0) {
      results = results.filter((m) =>
        (m.catalogs ?? []).some((c) => catalogNames.has(c))
      );
    }

    // Offer-status filter — merchant must have at least one offer matching
    // ANY selected presence key. Mirrors how the Offers column buckets them:
    //   active       → status === "published"
    //   unpublished  → status === "paused" || "archived"
    //   expired      → status === "expired"
    if (offerStatusKeys.size > 0) {
      results = results.filter((m) =>
        m.offers.some((o) => {
          if (offerStatusKeys.has("active") && o.status === "published")
            return true;
          if (
            offerStatusKeys.has("unpublished") &&
            (o.status === "paused" || o.status === "archived")
          )
            return true;
          if (offerStatusKeys.has("expired") && o.status === "expired")
            return true;
          return false;
        })
      );
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
  }, [data, searchTerms, categoryIdSet, catalogNames, offerStatusKeys, sort]);

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
