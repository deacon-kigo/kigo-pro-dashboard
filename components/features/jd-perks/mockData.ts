import type { PremadeCampaign, DealerLocation, Activation } from "./types";

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
    city: "Belle Glade",
    state: "FL",
  },
  { id: "loc-okeechobee", name: "Okeechobee", city: "Okeechobee", state: "FL" },
  {
    id: "loc-fort-pierce",
    name: "Fort Pierce",
    city: "Fort Pierce",
    state: "FL",
  },
  { id: "loc-clewiston", name: "Clewiston", city: "Clewiston", state: "FL" },
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
    suggestedStart: "2026-06-15",
    suggestedEnd: "2026-08-15",
    accent: "#367C2B",
    performance: {
      sent: 12400,
      opened: 6820,
      used: 1190,
      discount: 84300,
      sales: 612400,
      monthly: [
        { month: "Mar", sent: 0, used: 0, sales: 0 },
        { month: "Apr", sent: 4100, used: 310, sales: 168000 },
        { month: "May", sent: 4300, used: 430, sales: 221400 },
        { month: "Jun", sent: 4000, used: 450, sales: 223000 },
      ],
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
      sent: 9800,
      opened: 5390,
      used: 1640,
      discount: 41000,
      sales: 268000,
      monthly: [
        { month: "Mar", sent: 2300, used: 360, sales: 58000 },
        { month: "Apr", sent: 2500, used: 410, sales: 67000 },
        { month: "May", sent: 2500, used: 430, sales: 71000 },
        { month: "Jun", sent: 2500, used: 440, sales: 72000 },
      ],
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
      sent: 7600,
      opened: 4180,
      used: 880,
      discount: 19400,
      sales: 143000,
      monthly: [
        { month: "Mar", sent: 1800, used: 190, sales: 31000 },
        { month: "Apr", sent: 1900, used: 220, sales: 36000 },
        { month: "May", sent: 1950, used: 230, sales: 38000 },
        { month: "Jun", sent: 1950, used: 240, sales: 38000 },
      ],
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
      sent: 5400,
      opened: 2700,
      used: 420,
      discount: 21000,
      sales: 156000,
      monthly: [
        { month: "Mar", sent: 0, used: 0, sales: 0 },
        { month: "Apr", sent: 0, used: 0, sales: 0 },
        { month: "May", sent: 2700, used: 200, sales: 74000 },
        { month: "Jun", sent: 2700, used: 220, sales: 82000 },
      ],
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
      sent: 3200,
      opened: 2080,
      used: 240,
      discount: 96000,
      sales: 1240000,
      monthly: [
        { month: "Mar", sent: 0, used: 0, sales: 0 },
        { month: "Apr", sent: 0, used: 0, sales: 0 },
        { month: "May", sent: 1600, used: 110, sales: 560000 },
        { month: "Jun", sent: 1600, used: 130, sales: 680000 },
      ],
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
      sent: 4600,
      opened: 2530,
      used: 510,
      discount: 51000,
      sales: 389000,
      monthly: [
        { month: "Mar", sent: 1100, used: 120, sales: 88000 },
        { month: "Apr", sent: 1150, used: 130, sales: 98000 },
        { month: "May", sent: 1170, used: 130, sales: 101000 },
        { month: "Jun", sent: 1180, used: 130, sales: 102000 },
      ],
    },
  },
];

export function getCampaignById(id: string): PremadeCampaign | undefined {
  return PREMADE_CAMPAIGNS.find((c) => c.id === id);
}

// ---------------------------------------------------------------------------
// Pre-seeded activations so the dealer dashboard has data on first view.
// ---------------------------------------------------------------------------

export const SEED_ACTIVATIONS: Record<string, Activation> = {
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
