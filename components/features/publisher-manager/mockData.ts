/**
 * @file Publisher Manager (DES-876) mock data
 * @description Prototype fixtures. Verizon (PUB-1010) mirrors the design
 * reference exactly (7/11 offer types enabled, 8 catalog filters, a
 * 3,841 → 5 → 5 derivation funnel). The other publishers carry deliberate
 * variation so switching the active publisher visibly changes every tab.
 */

import {
  Banknote,
  Copy,
  CreditCard,
  CircleDollarSign,
  Gift,
  MousePointerClick,
  Percent,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Wallet,
} from "lucide-react";

import type {
  Campaign,
  CatalogFilter,
  OfferType,
  Publisher,
  PublisherData,
} from "./types";

/** The 11 platform offer types (global). */
export const OFFER_TYPES: OfferType[] = [
  { id: "bogo", label: "Buy One Get One", icon: Copy },
  { id: "cash-back", label: "Cash Back", icon: Banknote },
  { id: "clickthru", label: "ClickThru", icon: MousePointerClick },
  { id: "digital-gift-card", label: "Digital Gift Card", icon: CreditCard },
  { id: "free-product", label: "Free Product", icon: Gift },
  { id: "merchandise", label: "Merchandise", icon: ShoppingBag },
  { id: "money-off", label: "Money Off", icon: CircleDollarSign },
  { id: "percentage-off", label: "Percentage Off", icon: Percent },
  { id: "physical-gift-card", label: "Physical Gift Card", icon: Wallet },
  { id: "special-price", label: "Special Price", icon: Tag },
  { id: "spend-and-get", label: "Spend and Get", icon: ShoppingCart },
];

export const PUBLISHERS: Publisher[] = [
  {
    id: "PUB-1010",
    name: "Verizon",
    initials: "VZ",
    avatarClassName: "bg-red-100 text-red-700",
    capabilities: ["Closed Loop", "Hub", "Dealer Network"],
    descriptor: "Corporate + dealer network",
  },
  {
    id: "PUB-1024",
    name: "Optum",
    initials: "OP",
    avatarClassName: "bg-orange-100 text-orange-700",
    capabilities: ["Hub", "Marketplace"],
    descriptor: "Health benefits marketplace",
  },
  {
    id: "PUB-1042",
    name: "John Deere",
    initials: "JD",
    avatarClassName: "bg-green-100 text-green-700",
    capabilities: ["Closed Loop", "Dealer Network"],
    descriptor: "Corporate + dealer network",
  },
  {
    id: "PUB-1058",
    name: "Everglades",
    initials: "EV",
    avatarClassName: "bg-teal-100 text-teal-700",
    capabilities: ["Hub"],
    descriptor: "Regional hub network",
  },
  {
    id: "PUB-1063",
    name: "Yardi",
    initials: "YA",
    avatarClassName: "bg-blue-100 text-blue-700",
    capabilities: ["Hub", "Property Network"],
    descriptor: "Property management network",
  },
  {
    id: "PUB-1071",
    name: "ampliFI",
    initials: "AF",
    avatarClassName: "bg-purple-100 text-purple-700",
    capabilities: ["Marketplace", "Fintech"],
    descriptor: "Fintech rewards platform",
  },
];

/** Pool of catalog filters; each publisher gets a slice of this list. */
const CATALOG_FILTER_POOL: CatalogFilter[] = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    name: "National Grocery",
    description: "Grocery merchants with nationwide coverage",
    status: "Active",
    linkedPublishers: 12,
    offerTypeIds: ["money-off", "percentage-off", "cash-back"],
  },
  {
    id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    name: "Premium Dining",
    description: "Full-service restaurants above $$ price tier",
    status: "Active",
    linkedPublishers: 8,
    offerTypeIds: ["percentage-off", "special-price", "bogo"],
  },
  {
    id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    name: "Fuel & Convenience",
    description: "Gas stations and c-stores in the dealer network",
    status: "Active",
    linkedPublishers: 5,
    offerTypeIds: ["cash-back", "money-off", "clickthru"],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Home Improvement",
    description: "Hardware, garden, and building supply retailers",
    status: "Active",
    linkedPublishers: 6,
    offerTypeIds: ["money-off", "percentage-off", "special-price"],
  },
  {
    id: "9b2e4d1a-3f6c-4a8e-b1d0-2c7f5e9a8b34",
    name: "Seasonal Apparel",
    description: "Clothing merchants flagged for seasonal campaigns",
    status: "Inactive",
    linkedPublishers: 2,
    offerTypeIds: ["bogo", "percentage-off", "free-product"],
  },
  {
    id: "1f8e7d6c-5b4a-3928-1706-e5d4c3b2a190",
    name: "Local Services",
    description: "Auto, home, and personal services within 25 miles",
    status: "Active",
    linkedPublishers: 4,
    offerTypeIds: ["clickthru", "money-off", "special-price"],
  },
  {
    id: "3e2d1c0b-a987-6543-2109-8f7e6d5c4b3a",
    name: "Electronics & Tech",
    description: "Consumer electronics and mobile accessories",
    status: "Draft",
    linkedPublishers: 1,
    offerTypeIds: ["cash-back", "digital-gift-card", "percentage-off"],
  },
  {
    id: "b5f8c2e1-7a34-4d9b-8e60-1a2b3c4d5e6f",
    name: "Travel & Experiences",
    description: "Hotels, activities, and ticketed experiences",
    status: "Active",
    linkedPublishers: 3,
    offerTypeIds: ["percentage-off", "spend-and-get", "digital-gift-card"],
  },
];

/** Pool of campaigns; each publisher gets a slice. */
const CAMPAIGN_POOL: Campaign[] = [
  {
    id: "CID-40218",
    name: "Summer Fuel Rewards",
    distribution: "Activation",
    comms: ["email", "sms", "push"],
    startDate: "Jun 1, 2026",
    endDate: "Aug 31, 2026",
    status: "Live",
    ctr: 0.062,
    redemptions: 18432,
    offerTypeIds: ["cash-back", "money-off"],
  },
  {
    id: "CID-40251",
    name: "Back to Work Bonus",
    distribution: "Program",
    comms: ["email", "push"],
    startDate: "Jul 8, 2026",
    endDate: "Sep 30, 2026",
    status: "Live",
    ctr: 0.041,
    redemptions: 9107,
    offerTypeIds: ["percentage-off", "spend-and-get"],
  },
  {
    id: "CID-40277",
    name: "Dealer Network Airdrop",
    distribution: "Airdrop",
    comms: ["push"],
    startDate: "Jul 15, 2026",
    endDate: "Jul 22, 2026",
    status: "Live",
    ctr: 0.088,
    redemptions: 4521,
    offerTypeIds: ["digital-gift-card", "clickthru"],
  },
  {
    id: "CID-40312",
    name: "Fall Loyalty Expansion",
    distribution: "Expansion",
    comms: ["email", "sms"],
    startDate: "Sep 1, 2026",
    endDate: "Nov 30, 2026",
    status: "Scheduled",
    ctr: null,
    redemptions: null,
    offerTypeIds: ["percentage-off", "special-price"],
  },
  {
    id: "CID-40355",
    name: "Holiday Gift Card Event",
    distribution: "Event",
    comms: ["email", "sms", "push"],
    startDate: "Nov 24, 2026",
    endDate: "Dec 26, 2026",
    status: "Scheduled",
    ctr: null,
    redemptions: null,
    offerTypeIds: ["digital-gift-card", "physical-gift-card"],
  },
  {
    id: "CID-40088",
    name: "Spring Activation Drive",
    distribution: "Campaign",
    comms: ["email"],
    startDate: "Mar 1, 2026",
    endDate: "May 31, 2026",
    status: "Past",
    ctr: 0.037,
    redemptions: 22890,
    offerTypeIds: ["money-off", "cash-back"],
  },
  {
    id: "CID-40129",
    name: "Q2 Reengagement Push",
    distribution: "Program",
    comms: ["push", "sms"],
    startDate: "Apr 1, 2026",
    endDate: "Jun 30, 2026",
    status: "Past",
    ctr: 0.029,
    redemptions: 15044,
    offerTypeIds: ["clickthru", "percentage-off"],
  },
];

/**
 * Per-publisher enabled offer types + slice sizes. Verizon is pinned to the
 * design-reference values; the rest vary so the UI reacts on switch.
 */
const PUBLISHER_CONFIG: Record<
  string,
  {
    enabledOfferTypeIds: string[];
    filterCount: number;
    campaignCount: number;
    derivation: { afterInclusion: number; finalCatalog: number };
  }
> = {
  "PUB-1010": {
    enabledOfferTypeIds: [
      "bogo",
      "cash-back",
      "clickthru",
      "digital-gift-card",
      "money-off",
      "percentage-off",
      "special-price",
    ],
    filterCount: 8,
    campaignCount: 7,
    derivation: { afterInclusion: 5, finalCatalog: 5 },
  },
  "PUB-1024": {
    enabledOfferTypeIds: [
      "cash-back",
      "clickthru",
      "digital-gift-card",
      "money-off",
      "percentage-off",
    ],
    filterCount: 6,
    campaignCount: 4,
    derivation: { afterInclusion: 214, finalCatalog: 198 },
  },
  "PUB-1042": {
    enabledOfferTypeIds: [
      "bogo",
      "cash-back",
      "free-product",
      "merchandise",
      "money-off",
      "percentage-off",
      "physical-gift-card",
      "special-price",
      "spend-and-get",
    ],
    filterCount: 8,
    campaignCount: 6,
    derivation: { afterInclusion: 892, finalCatalog: 874 },
  },
  "PUB-1058": {
    enabledOfferTypeIds: [
      "clickthru",
      "money-off",
      "percentage-off",
      "special-price",
    ],
    filterCount: 4,
    campaignCount: 3,
    derivation: { afterInclusion: 61, finalCatalog: 61 },
  },
  "PUB-1063": {
    enabledOfferTypeIds: [
      "cash-back",
      "clickthru",
      "digital-gift-card",
      "money-off",
      "percentage-off",
      "spend-and-get",
    ],
    filterCount: 7,
    campaignCount: 5,
    derivation: { afterInclusion: 430, finalCatalog: 402 },
  },
  "PUB-1071": {
    enabledOfferTypeIds: [
      "cash-back",
      "clickthru",
      "digital-gift-card",
      "money-off",
      "percentage-off",
      "special-price",
      "spend-and-get",
    ],
    filterCount: 5,
    campaignCount: 4,
    derivation: { afterInclusion: 1203, finalCatalog: 1150 },
  },
};

const MASTER_CATALOG_SIZE = 3841;

export function getPublisherData(publisherId: string): PublisherData {
  const config = PUBLISHER_CONFIG[publisherId] ?? PUBLISHER_CONFIG["PUB-1010"];
  return {
    enabledOfferTypeIds: config.enabledOfferTypeIds,
    catalogFilters: CATALOG_FILTER_POOL.slice(0, config.filterCount),
    catalogDerivation: {
      masterCatalog: MASTER_CATALOG_SIZE,
      afterInclusion: config.derivation.afterInclusion,
      finalCatalog: config.derivation.finalCatalog,
    },
    campaigns: CAMPAIGN_POOL.slice(0, config.campaignCount),
  };
}
