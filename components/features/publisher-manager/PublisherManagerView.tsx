"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/atoms/Tabs";
import { OFFER_TYPES, PUBLISHERS, getPublisherData } from "./mockData";
import { PublisherHeader } from "./PublisherHeader";
import { CatalogFiltersTab } from "./CatalogFiltersTab";
import { CampaignsTab } from "./CampaignsTab";
import type { FacetOption } from "./PublisherFilterBar";

/**
 * Publisher Manager (DES-876) orchestrator.
 *
 * Follows the Kigo Pro list-page convention (aurora header, then a tabbed work
 * surface where each tab is a faceted filter bar + rich DataTable). The publisher
 * switcher lives in the header; the supported offer-type set (edited via the
 * header's Manage popover) drives the Offer Type facet in each tab's filter bar.
 */
export default function PublisherManagerView() {
  const [selectedPublisherId, setSelectedPublisherId] = useState(
    PUBLISHERS[0].id
  );

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

  useEffect(() => {
    setSupportedIds(getPublisherData(selectedPublisher.id).enabledOfferTypeIds);
  }, [selectedPublisher.id]);

  // The Offer Type facet offers the publisher's supported types (label + id).
  const offerTypeOptions = useMemo<FacetOption[]>(() => {
    const supported = new Set(supportedIds);
    return OFFER_TYPES.filter((t) => supported.has(t.id)).map((t) => ({
      label: t.label,
      value: t.id,
    }));
  }, [supportedIds]);

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

      {/* One unified work-surface card: the tab switcher is the card header,
          each tab's toolbar + table + footer sit flush beneath it. */}
      <Tabs defaultValue="catalog-filters" className="w-full">
        <div className="overflow-hidden rounded-lg border border-border-light bg-white shadow-sm">
          <div className="border-b border-border-light px-4 py-2.5">
            <TabsList>
              <TabsTrigger value="catalog-filters">Catalog Filters</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="catalog-filters"
            className="m-0 focus-visible:outline-none"
          >
            <CatalogFiltersTab
              key={selectedPublisher.id}
              filters={data.catalogFilters}
              derivation={data.catalogDerivation}
              offerTypeOptions={offerTypeOptions}
            />
          </TabsContent>

          <TabsContent
            value="campaigns"
            className="m-0 focus-visible:outline-none"
          >
            <CampaignsTab
              key={selectedPublisher.id}
              campaigns={data.campaigns}
              offerTypeOptions={offerTypeOptions}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
