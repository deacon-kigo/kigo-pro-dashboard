"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/atoms/Tabs";
import { Button } from "@/components/atoms/Button";

import { OFFER_TYPES, PUBLISHERS, getPublisherData } from "./mockData";
import { PublisherHeader } from "./PublisherHeader";
import { CatalogFiltersTab } from "./CatalogFiltersTab";
import { CampaignsTab } from "./CampaignsTab";
import { CampaignStatusPills } from "./CampaignStatusPills";
import { PublisherFilterBar, type FacetOption } from "./PublisherFilterBar";
import { parseFilters, type FilterTag } from "./filterLogic";

/**
 * Publisher Manager (DES-876) orchestrator.
 *
 * Follows the Kigo Pro list-page convention (aurora header, then a tabbed work
 * surface). The tab switcher, the faceted filter bar and the tab's primary
 * action share ONE toolbar row — the tabs previously sat in a band of their own
 * that was ~85% empty. Because the toolbar is shared, filter state for both tabs
 * lives here and each tab component renders only its table.
 */

const CATALOG_STATUS_OPTIONS: FacetOption[] = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Draft", value: "Draft" },
];

const CAMPAIGN_STATUS_OPTIONS: FacetOption[] = [
  { label: "Live", value: "Live" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "Past", value: "Past" },
];

export default function PublisherManagerView() {
  const [selectedPublisherId, setSelectedPublisherId] = useState(
    PUBLISHERS[0].id
  );
  const [activeTab, setActiveTab] = useState("catalog-filters");
  const [catalogTags, setCatalogTags] = useState<FilterTag[]>([]);
  const [campaignTags, setCampaignTags] = useState<FilterTag[]>([]);

  const selectedPublisher = useMemo(
    () => PUBLISHERS.find((p) => p.id === selectedPublisherId) ?? PUBLISHERS[0],
    [selectedPublisherId]
  );

  const data = useMemo(
    () => getPublisherData(selectedPublisher.id),
    [selectedPublisher.id]
  );

  const [supportedIds, setSupportedIds] = useState<string[]>(
    data.enabledOfferTypeIds
  );

  // Switching publisher resets the supported set and both tabs' filters — the
  // tags reference the previous publisher's offer types and statuses.
  useEffect(() => {
    setSupportedIds(getPublisherData(selectedPublisher.id).enabledOfferTypeIds);
    setCatalogTags([]);
    setCampaignTags([]);
  }, [selectedPublisher.id]);

  // The Offer Type facet offers the publisher's supported types (label + id).
  const offerTypeOptions = useMemo<FacetOption[]>(() => {
    const supported = new Set(supportedIds);
    return OFFER_TYPES.filter((t) => supported.has(t.id)).map((t) => ({
      label: t.label,
      value: t.id,
    }));
  }, [supportedIds]);

  // ---- Catalog Filters: facets applied here so the toolbar can own the bar ----
  const catalogFiltered = useMemo(() => {
    const { offerTypeIds, statuses, searchTerms } = parseFilters(catalogTags);
    let result = data.catalogFilters;

    if (offerTypeIds.size > 0) {
      result = result.filter((f) =>
        f.offerTypeIds.some((id) => offerTypeIds.has(id))
      );
    }
    if (statuses.size > 0) {
      result = result.filter((f) => statuses.has(f.status));
    }
    for (const term of searchTerms) {
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(term) ||
          f.description.toLowerCase().includes(term)
      );
    }

    return result;
  }, [data.catalogFilters, catalogTags]);

  // ---- Campaigns: base list (no status) feeds the pill counts ----
  const campaignParsed = useMemo(
    () => parseFilters(campaignTags),
    [campaignTags]
  );

  const campaignsBase = useMemo(() => {
    const { offerTypeIds, searchTerms } = campaignParsed;
    return data.campaigns.filter((c) => {
      if (
        offerTypeIds.size > 0 &&
        !c.offerTypeIds.some((id) => offerTypeIds.has(id))
      ) {
        return false;
      }
      if (
        searchTerms.length > 0 &&
        !searchTerms.every(
          (term) =>
            c.name.toLowerCase().includes(term) ||
            c.id.toLowerCase().includes(term)
        )
      ) {
        return false;
      }
      return true;
    });
  }, [data.campaigns, campaignParsed]);

  const campaignsFiltered = useMemo(() => {
    const { statuses } = campaignParsed;
    if (statuses.size === 0) return campaignsBase;
    return campaignsBase.filter((c) => statuses.has(c.status));
  }, [campaignsBase, campaignParsed]);

  const isCatalog = activeTab === "catalog-filters";

  return (
    <div className="space-y-6">
      <PublisherHeader
        publishers={PUBLISHERS}
        selected={selectedPublisher}
        onSelect={setSelectedPublisherId}
        allOfferTypes={OFFER_TYPES}
        supportedIds={supportedIds}
        onSupportedChange={setSupportedIds}
      />

      {/* One unified work-surface card. The toolbar row carries the tab
          switcher, the filter bar and the tab's primary action; the active
          tab's table sits flush beneath it. */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-hidden rounded-lg border border-border-light bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border-light px-4 py-2.5">
            <div className="min-w-[240px] flex-1">
              <PublisherFilterBar
                key={activeTab}
                offerTypeOptions={offerTypeOptions}
                statusOptions={
                  isCatalog ? CATALOG_STATUS_OPTIONS : CAMPAIGN_STATUS_OPTIONS
                }
                selectedFilters={isCatalog ? catalogTags : campaignTags}
                onFiltersChange={isCatalog ? setCatalogTags : setCampaignTags}
                placeholder={
                  isCatalog
                    ? "Filter catalog filters by offer type, status, or search…"
                    : "Filter campaigns by offer type, status, or search…"
                }
              />
            </div>

            <TabsList>
              <TabsTrigger value="catalog-filters">Catalog Filters</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            </TabsList>

            {isCatalog ? (
              <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
                Create Filter
              </Button>
            ) : (
              <CampaignStatusPills
                campaigns={campaignsBase}
                selectedFilters={campaignTags}
                onFiltersChange={setCampaignTags}
              />
            )}
          </div>

          <TabsContent
            value="catalog-filters"
            className="m-0 focus-visible:outline-none"
          >
            <CatalogFiltersTab
              key={selectedPublisher.id}
              filters={catalogFiltered}
              derivation={data.catalogDerivation}
            />
          </TabsContent>

          <TabsContent
            value="campaigns"
            className="m-0 focus-visible:outline-none"
          >
            <CampaignsTab
              key={selectedPublisher.id}
              campaigns={campaignsFiltered}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
