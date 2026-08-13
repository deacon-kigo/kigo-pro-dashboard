/**
 * @file Publisher Manager (DES-876) domain types
 * @description Shared type contract for the Publisher Manager feature. The
 * switcher/header and the two work-surface tabs (Catalog Filters, Campaigns)
 * consume these; the offer-type rail filters both. Mock data lives in
 * `mockData.ts`.
 */

import type { LucideIcon } from "lucide-react";

/** A capability tag shown next to the publisher name in the header. */
export type PublisherCapability =
  | "Closed Loop"
  | "Hub"
  | "Dealer Network"
  | "Marketplace"
  | "Property Network"
  | "Fintech";

export interface Publisher {
  /** Human identifier, e.g. "PUB-1010". */
  id: string;
  name: string;
  /** 1–2 char monogram for the avatar. */
  initials: string;
  /** Tailwind classes for the avatar chip (bg + text). */
  avatarClassName: string;
  capabilities: PublisherCapability[];
  /** Right-aligned descriptor, e.g. "Corporate + dealer network". */
  descriptor: string;
}

/** One of the 11 platform offer types (global catalog). */
export interface OfferType {
  id: string;
  label: string;
  icon: LucideIcon;
}

export type CatalogFilterStatus = "Active" | "Inactive" | "Draft";

export interface CatalogFilter {
  /** Full UUID; the table shows a truncated, copyable form. */
  id: string;
  name: string;
  description: string;
  status: CatalogFilterStatus;
  /** Count of publishers this filter is linked to. */
  linkedPublishers: number;
  /** Offer-type IDs (from OFFER_TYPES) this filter applies to; drives the
   *  offer-type filter rail. */
  offerTypeIds: string[];
}

/** The allow-list funnel visualized in the Catalog Derivation strip. */
export interface CatalogDerivation {
  masterCatalog: number;
  afterInclusion: number;
  finalCatalog: number;
}

export type DistributionType =
  | "Activation"
  | "Airdrop"
  | "Event"
  | "Program"
  | "Campaign"
  | "Expansion";

export type CommsChannel = "email" | "sms" | "push";

export type CampaignStatus = "Live" | "Scheduled" | "Past";

export interface Campaign {
  /** Campaign ID (CID), e.g. "CID-40218". */
  id: string;
  name: string;
  distribution: DistributionType;
  comms: CommsChannel[];
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  /** Click-through rate as a fraction (0.042 = 4.2%); null when not live/past. */
  ctr: number | null;
  /** Redemption count; null for scheduled campaigns (renders as "—"). */
  redemptions: number | null;
  /** Offer-type IDs (from OFFER_TYPES) this campaign promotes; drives the
   *  offer-type filter rail. */
  offerTypeIds: string[];
}

/** Everything the tabs need for a single selected publisher. */
export interface PublisherData {
  /** IDs (from OFFER_TYPES) currently enabled for this publisher. */
  enabledOfferTypeIds: string[];
  catalogFilters: CatalogFilter[];
  catalogDerivation: CatalogDerivation;
  campaigns: Campaign[];
}
