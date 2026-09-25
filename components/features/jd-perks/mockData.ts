import type {
  PremadeCampaign,
  DealerLocation,
  Activation,
  DealerUserMetrics,
} from "./types";

// ---------------------------------------------------------------------------
// Dealer context — "Dealer Dan" at Everglades Equipment (a John Deere dealer)
// ---------------------------------------------------------------------------

export const DEALER = {
  id: "everglades-equipment",
  name: "Everglades Equipment",
  contactName: "Dealer Dan",
  publisher: "John Deere",
};

export const DEALER_LOCATIONS: DealerLocation[] = [
  {
    id: "loc-belle-glade",
    name: "Belle Glade",
    street: "2017 NW 16th St",
    city: "Belle Glade",
    state: "FL",
    zip: "33430",
  },
  {
    id: "loc-okeechobee",
    name: "Okeechobee",
    street: "820 US-98 N",
    city: "Okeechobee",
    state: "FL",
    zip: "34972",
  },
  {
    id: "loc-fort-pierce",
    name: "Fort Pierce",
    street: "6150 Orange Ave",
    city: "Fort Pierce",
    state: "FL",
    zip: "34947",
  },
  {
    id: "loc-clewiston",
    name: "Clewiston",
    street: "1100 W Sugarland Hwy",
    city: "Clewiston",
    state: "FL",
    zip: "33440",
  },
];

// ---------------------------------------------------------------------------
// Pre-made campaigns the dealer can opt into
// ---------------------------------------------------------------------------

export const PREMADE_CAMPAIGNS: PremadeCampaign[] = [
  {
    id: "spring-parts-savings",
    name: "Spring Parts Savings",
    tagline: "10% off genuine John Deere parts",
    description:
      "Drive parts revenue as the spring season ramps up. Customers save 10% on genuine John Deere parts, with a cap that protects your margin on large orders.",
    builtBy: "John Deere",
    category: "Parts",
    discountType: "percent",
    discountValue: 10,
    constraints: { minSpend: 250, maxDiscount: 2500 },
    suggestedStart: "2027-03-01",
    suggestedEnd: "2027-05-31",
    accent: "#367C2B",
    performance: {
      clicks: { email: 1140, sms: 640, social: 980, qr: 360 },
      tokensDelivered: 2340,
      tokensActivated: 1580,
      tokensApplied: 1190,
      discount: 84300,
      sales: 612400,
    },
  },
  {
    id: "oil-fluids-refresh",
    name: "Oil & Fluids Refresh",
    tagline: "$25 off oil & fluids service kits",
    description:
      "A simple, high-frequency offer that brings customers back for seasonal maintenance. $25 off qualifying oil and fluids purchases.",
    builtBy: "John Deere",
    category: "Oil & Fluids",
    discountType: "amount",
    discountValue: 25,
    constraints: { minSpend: 100, maxDiscount: null },
    suggestedStart: "2026-06-10",
    suggestedEnd: "2026-09-10",
    accent: "#FFAE34",
    performance: {
      clicks: { email: 1520, sms: 880, social: 1010, qr: 450 },
      tokensDelivered: 2980,
      tokensActivated: 2120,
      tokensApplied: 1640,
      discount: 41000,
      sales: 268000,
    },
  },
  {
    id: "mower-season-tuneup",
    name: "Mower Season Tune-Up",
    tagline: "15% off service, up to $300",
    description:
      "Fill your service bays ahead of peak mowing season. 15% off service labor with a $300 cap keeps the offer compelling without runaway discounts.",
    builtBy: "John Deere",
    category: "Service",
    discountType: "percent",
    discountValue: 15,
    constraints: { minSpend: 150, maxDiscount: 300 },
    suggestedStart: "2026-06-01",
    suggestedEnd: "2026-07-31",
    accent: "#367C2B",
    performance: {
      clicks: { email: 760, sms: 470, social: 620, qr: 290 },
      tokensDelivered: 1620,
      tokensActivated: 1150,
      tokensApplied: 880,
      discount: 19400,
      sales: 143000,
    },
  },
  {
    id: "gator-accessories-bonus",
    name: "Gator Accessories Bonus",
    tagline: "$50 off Gator™ accessories",
    description:
      "Boost attachment and accessory sales on Gator utility vehicles. $50 off accessory purchases over the minimum spend.",
    builtBy: "John Deere",
    category: "Merchandise",
    discountType: "amount",
    discountValue: 50,
    constraints: { minSpend: 300, maxDiscount: null },
    suggestedStart: "2026-07-01",
    suggestedEnd: "2026-09-30",
    accent: "#FFDE00",
    performance: {
      clicks: { email: 310, sms: 210, social: 420, qr: 140 },
      tokensDelivered: 810,
      tokensActivated: 560,
      tokensApplied: 420,
      discount: 21000,
      sales: 156000,
    },
  },
  {
    id: "loyalty-member-appreciation",
    name: "Loyalty Member Appreciation",
    tagline: "10% off, up to $2,500 discount",
    description:
      "Reward your highest-value customers. 10% off large orders with a $2,500 cap — a $30,000 purchase still earns the full $2,500.",
    builtBy: "John Deere",
    category: "Equipment",
    discountType: "percent",
    discountValue: 10,
    constraints: { minSpend: 1000, maxDiscount: 2500 },
    suggestedStart: "2026-06-20",
    suggestedEnd: "2026-08-31",
    accent: "#367C2B",
    performance: {
      clicks: { email: 280, sms: 120, social: 170, qr: 70 },
      tokensDelivered: 470,
      tokensActivated: 320,
      tokensApplied: 240,
      discount: 96000,
      sales: 1240000,
    },
  },
  {
    id: "new-customer-welcome",
    name: "New Customer Welcome",
    tagline: "$100 off your first parts order",
    description:
      "Convert first-time buyers into repeat customers. $100 off a first qualifying parts order over the minimum spend.",
    builtBy: "John Deere",
    category: "Parts",
    discountType: "amount",
    discountValue: 100,
    constraints: { minSpend: 500, maxDiscount: null },
    suggestedStart: "2026-06-10",
    suggestedEnd: "2026-12-31",
    accent: "#FFAE34",
    performance: {
      clicks: { email: 430, sms: 250, social: 520, qr: 160 },
      tokensDelivered: 1020,
      tokensActivated: 690,
      tokensApplied: 510,
      discount: 51000,
      sales: 389000,
    },
  },
];

// Dealer-level login activity shown at the top of the reporting dashboard.
export const DEALER_USER_METRICS: DealerUserMetrics = {
  uniqueAccounts: 3840,
  returningAccounts: 1460,
};

export function getCampaignById(id: string): PremadeCampaign | undefined {
  return PREMADE_CAMPAIGNS.find((c) => c.id === id);
}

// ---------------------------------------------------------------------------
// Pre-seeded activations so the dealer dashboard has data on first view.
// ---------------------------------------------------------------------------

export const SEED_ACTIVATIONS: Record<string, Activation> = {
  // Committed for next spring — activated, but the window hasn't opened, so
  // this one reports as "queued" with no performance data yet.
  "spring-parts-savings": {
    campaignId: "spring-parts-savings",
    startDate: "2027-03-01",
    endDate: "2027-05-31",
    locationIds: [],
    activatedAt: "2026-09-18T14:00:00.000Z",
    cmsUrl: "https://deere.deals/everglades/spring-parts-savings",
  },
  "oil-fluids-refresh": {
    campaignId: "oil-fluids-refresh",
    startDate: "2026-03-01",
    endDate: "2026-09-10",
    locationIds: [], // all locations
    activatedAt: "2026-02-24T15:00:00.000Z",
    cmsUrl: "https://deere.deals/everglades/oil-fluids-refresh",
  },
  "new-customer-welcome": {
    campaignId: "new-customer-welcome",
    startDate: "2026-03-01",
    endDate: "2026-12-31",
    locationIds: ["loc-okeechobee", "loc-fort-pierce"],
    activatedAt: "2026-02-26T18:30:00.000Z",
    cmsUrl: "https://deere.deals/everglades/new-customer-welcome",
  },
};
