import type { Campaign, Merchant, Offer, OfferStatus } from "./types";

// ----- Lightweight builders for additional pagination-test merchants -----
// Keeps the new entries below tight while still hitting list-view fidelity
// (offer counts, campaign counts, publisher set via offers).

const _mkOffer = (
  id: string,
  name: string,
  status: OfferStatus,
  publisher: string,
  offerType: string
): Offer => ({
  id,
  name,
  status,
  channel: publisher,
  publisher,
  start: "Mar 1, 2026",
  end: "Jun 30, 2026",
  type: "Standard",
  offerType,
});

const _mkCampaign = (
  id: string,
  name: string,
  publisher = "ampliFI"
): Campaign => ({
  id,
  name,
  publisher,
  status: "Active",
});

/**
 * Mock merchant data ported from
 * kigo-demos/public/kigo-pro/index.html (lines 7608-7718).
 *
 * Notes:
 * - The prototype fixture stores offers with a `channel` field
 *   (e.g. "Verizon Value", "JD Perks", "Optum Offers"). In this list-view
 *   port we surface those channels as the offer's distribution publisher
 *   in the Publishers column.
 * - Detail-view fields (status, contact, website, revShare,
 *   supportedOfferTypes, merchantDetail, restrictions, perf, subGroups)
 *   were back-filled to match the prototype's `merchantData` so the
 *   MerchantDetailDialog renders the same content.
 */
export const merchants: Merchant[] = [
  {
    key: "sams",
    name: "Sam's Club",
    id: "MID-10042",
    category: "Retail",
    emoji: "🛒",
    color: "#fff3cd",
    source: "Augeo",
    commissionOffers: true,
    status: "published",
    contact: "Jennifer Walsh · jwalsh@samsclub.com",
    website: "samsclub.com",
    revShare: "8.5%",
    supportedOfferTypes: [
      "Percentage Off",
      "Free Product",
      "Merchandise",
      "Money Off",
    ],
    merchantDetail:
      "Warehouse club retailer offering bulk groceries, electronics, home goods, and membership-based savings programs.",
    restrictions: [
      { name: "Costco", id: "MID-10088" },
      { name: "BJ's Wholesale", id: "MID-10112" },
    ],
    offers: [
      {
        id: "OID-60000003",
        name: "50% Off Club Membership",
        status: "published",
        channel: "Verizon Value",
        publisher: "Verizon Value",
        start: "Mar 1, 2026",
        end: "Apr 30, 2026",
        type: "Airdrop",
        offerType: "Percentage Off",
        offerKey: "samsclub",
      },
      {
        id: "OID-55202",
        name: "Free Membership Trial",
        status: "published",
        channel: "JD Perks",
        publisher: "JD Perks",
        start: "Feb 1, 2026",
        end: "Apr 30, 2026",
        type: "Featured",
        offerType: "Free Product",
        offerKey: "samsclub",
      },
      {
        id: "OID-55203",
        name: "10% off Electronics",
        status: "draft",
        channel: "Verizon Value",
        publisher: "Verizon Value",
        start: "Apr 1, 2026",
        end: "Jun 30, 2026",
        type: "Bundle",
        offerType: "Percentage Off",
        offerKey: "samsclub",
      },
      {
        id: "OID-55100",
        name: "Holiday Gift Set Promo",
        status: "expired",
        channel: "JD Perks",
        publisher: "JD Perks",
        start: "Nov 1, 2025",
        end: "Dec 31, 2025",
        type: "Airdrop",
        offerType: "Merchandise",
        offerKey: "samsclub",
      },
    ],
    campaigns: [
      {
        id: "CID-3406",
        name: "Welcome Bundle",
        publisher: "Verizon",
        status: "Active",
      },
      {
        id: "CID-3401",
        name: "Monthly Airdrop Bundle",
        publisher: "ampliFI",
        status: "Active",
      },
    ],
    perf: [
      {
        offer: "$20 off $100 Purchase",
        channel: "Verizon Value",
        clicks: 4200,
        saves: 2100,
        redemptions: 680,
        revenue: "$5,780",
      },
      {
        offer: "Free Membership Trial",
        channel: "JD Perks",
        clicks: 1800,
        saves: 920,
        redemptions: 310,
        revenue: "$2,635",
      },
    ],
  },
  {
    key: "disney",
    name: "Disney+",
    id: "MID-10089",
    category: "Entertainment",
    emoji: "🎬",
    color: "#ede9fe",
    source: "EBG",
    commissionOffers: false,
    status: "published",
    contact: "Mark Torres · mtorres@disney.com",
    website: "disneyplus.com",
    revShare: "12.0%",
    supportedOfferTypes: [
      "Free Product",
      "Percentage Off",
      "Special Price",
      "ClickThru",
    ],
    merchantDetail:
      "Premium streaming service featuring Disney, Pixar, Marvel, Star Wars, and National Geographic content with bundle options.",
    restrictions: [
      { name: "Netflix", id: "MID-10091" },
      { name: "Hulu", id: "MID-10093" },
      { name: "HBO Max", id: "MID-10095" },
      { name: "Paramount+", id: "MID-10097" },
    ],
    offers: [
      {
        id: "OID-88100",
        name: "Disney+ Bundle — 1 Month Free",
        status: "published",
        channel: "Verizon Value",
        publisher: "Verizon Value",
        start: "Mar 1, 2026",
        end: "May 31, 2026",
        type: "Airdrop",
        offerType: "Free Product",
        offerKey: "disney",
      },
      {
        id: "OID-88199",
        name: "Disney+ Annual Plan Discount",
        status: "published",
        channel: "Verizon Value",
        publisher: "Verizon Value",
        start: "Feb 15, 2026",
        end: "Apr 15, 2026",
        type: "Featured",
        offerType: "Percentage Off",
        offerKey: "disney",
      },
      {
        id: "OID-88231",
        name: "Disney+ 3-Month Trial",
        status: "expired",
        channel: "Verizon Value",
        publisher: "Verizon Value",
        start: "Nov 15, 2025",
        end: "Mar 1, 2026",
        type: "Airdrop",
        offerType: "Free Product",
        offerKey: "disney",
      },
    ],
    campaigns: [
      {
        id: "CID-3402",
        name: "Boosted Rewards",
        publisher: "ampliFI",
        status: "Active",
      },
    ],
    perf: [
      {
        offer: "Disney+ Bundle — 1 Month Free",
        channel: "Verizon Value",
        clicks: 9100,
        saves: 5200,
        redemptions: 1840,
        revenue: "$16,560",
      },
      {
        offer: "Disney+ Annual Plan Discount",
        channel: "Verizon Value",
        clicks: 3400,
        saves: 1700,
        redemptions: 520,
        revenue: "$7,800",
      },
    ],
  },
  {
    key: "activefit",
    name: "Active&Fit Direct",
    id: "MID-10156",
    category: "Health & Wellness",
    emoji: "💪",
    color: "#dcfce7",
    source: "Augeo",
    commissionOffers: true,
    status: "published",
    contact: "Sara Kim · skim@activefit.com",
    website: "activefit.com",
    revShare: "10.0%",
    supportedOfferTypes: ["Free Product", "Percentage Off", "ClickThru"],
    merchantDetail:
      "Fitness membership program offering access to 11,000+ gyms and fitness centers nationwide through employer and health plan benefits.",
    restrictions: [],
    offers: [
      {
        id: "OID-62001",
        name: "Free 30-Day Fitness Pass",
        status: "published",
        channel: "Optum Offers",
        publisher: "Optum Offers",
        start: "Jan 15, 2026",
        end: "Jun 30, 2026",
        type: "Airdrop",
        offerType: "Free Product",
      },
    ],
    campaigns: [
      {
        id: "CID-3403",
        name: "Welcome Offer — Online Only",
        publisher: "John Deere",
        status: "Active",
      },
      {
        id: "CID-3403",
        name: "Welcome Offer — Online Only",
        publisher: "Everglades",
        status: "Active",
      },
    ],
    perf: [
      {
        offer: "Free 30-Day Fitness Pass",
        channel: "Optum Offers",
        clicks: 2800,
        saves: 1600,
        redemptions: 420,
        revenue: "$4,200",
      },
    ],
  },
  {
    key: "papajohns",
    name: "Papa John's",
    id: "MID-10207",
    category: "Food & Dining",
    emoji: "🍕",
    color: "#fee2e2",
    source: "Direct",
    commissionOffers: false,
    status: "unpublished",
    contact: "Alex Rivera · arivera@papajohns.com",
    website: "papajohns.com",
    revShare: "7.0%",
    supportedOfferTypes: [
      "Percentage Off",
      "Buy One Get One",
      "Money Off",
      "Free Product",
    ],
    merchantDetail:
      "National pizza delivery and carryout chain known for fresh ingredients and signature garlic sauce.",
    restrictions: [
      { name: "Domino's", id: "MID-10209" },
      { name: "Pizza Hut", id: "MID-10211" },
      { name: "Little Caesars", id: "MID-10213" },
    ],
    isParent: true,
    subGroups: [
      {
        name: "Papa John's — Chicago Metro",
        id: "MID-10207-A",
        contact: "Mike Chen · mchen@papajohns.com",
        status: "Active",
        activeOffers: 1,
        locations: 12,
      },
      {
        name: "Papa John's — Southeast Florida",
        id: "MID-10207-B",
        contact: "Lisa Tran · ltran@papajohns.com",
        status: "Active",
        activeOffers: 2,
        locations: 8,
      },
      {
        name: "Papa John's — Dallas/Fort Worth",
        id: "MID-10207-C",
        contact: "James Ruiz · jruiz@papajohns.com",
        status: "Review",
        activeOffers: 0,
      },
    ],
    offers: [
      {
        id: "OID-71001",
        name: "20% Off Medium Pizza",
        status: "published",
        channel: "Verizon Value",
        publisher: "Verizon Value",
        start: "Feb 1, 2026",
        end: "Apr 30, 2026",
        type: "Featured",
        offerType: "Percentage Off",
      },
      {
        id: "OID-71002",
        name: "Free Breadsticks with Order",
        status: "published",
        channel: "Verizon Value",
        publisher: "Verizon Value",
        start: "Mar 1, 2026",
        end: "Mar 31, 2026",
        type: "Bundle",
        offerType: "Buy One Get One",
      },
    ],
    campaigns: [
      {
        id: "CID-3416",
        name: "Mother's Day Bundle",
        publisher: "Verizon",
        status: "Review",
      },
    ],
    perf: [
      {
        offer: "20% Off Medium Pizza",
        channel: "Verizon Value",
        clicks: 5600,
        saves: 3100,
        redemptions: 1200,
        revenue: "$8,400",
      },
      {
        offer: "Free Breadsticks with Order",
        channel: "Verizon Value",
        clicks: 2900,
        saves: 1400,
        redemptions: 680,
        revenue: "$3,400",
      },
    ],
  },
  {
    key: "amazon",
    name: "Amazon",
    id: "MID-10331",
    category: "Retail",
    emoji: "📦",
    color: "#fef3c7",
    source: "Augeo",
    commissionOffers: true,
    status: "published",
    contact: "Chris Lee · clee@amazon.com",
    website: "amazon.com",
    revShare: "9.0%",
    supportedOfferTypes: [
      "Cash Back",
      "Percentage Off",
      "Free Product",
      "Spend and Get",
      "Digital Gift Card",
    ],
    merchantDetail:
      "Global e-commerce marketplace offering electronics, household goods, groceries, streaming, and cloud services with Prime membership benefits.",
    restrictions: [
      { name: "Walmart", id: "MID-10333" },
      { name: "Target", id: "MID-10335" },
    ],
    offers: [
      // Long-running evergreen — spans 3 years, currently active
      {
        id: "OID-95000",
        name: "Prime Member Cashback Program",
        status: "published",
        channel: "Verizon Value",
        publisher: "Verizon Value",
        start: "Jan 1, 2024",
        end: "Dec 31, 2026",
        type: "Evergreen",
        offerType: "Cash Back",
      },
      // 2024 expired seasonal
      {
        id: "OID-95005",
        name: "Holiday Lightning Deals 2024",
        status: "expired",
        channel: "JD Perks",
        publisher: "JD Perks",
        start: "Nov 1, 2024",
        end: "Dec 31, 2024",
        type: "Seasonal",
        offerType: "Percentage Off",
      },
      // Crosses 2024 → 2025 boundary
      {
        id: "OID-95002",
        name: "Prime Video 3-Month Free Trial",
        status: "expired",
        channel: "JD Perks",
        publisher: "JD Perks",
        start: "Nov 1, 2024",
        end: "Feb 28, 2025",
        type: "Featured",
        offerType: "Free Product",
      },
      // Crosses 2025 → 2026 boundary
      {
        id: "OID-95004",
        name: "Alexa Device Bundle Offer",
        status: "expired",
        channel: "Verizon Value",
        publisher: "Verizon Value",
        start: "Sep 1, 2025",
        end: "Apr 30, 2026",
        type: "Bundle",
        offerType: "Spend and Get",
      },
      // Crosses 2025 → 2026 boundary, ends recently
      {
        id: "OID-95001",
        name: "$15 off First Prime Purchase",
        status: "expired",
        channel: "Verizon Value",
        publisher: "Verizon Value",
        start: "Dec 1, 2025",
        end: "Mar 31, 2026",
        type: "Airdrop",
        offerType: "Cash Back",
      },
      // Crosses 2026 → 2027 boundary, planned future
      {
        id: "OID-95003",
        name: "20% off Amazon Fresh",
        status: "draft",
        channel: "Optum Offers",
        publisher: "Optum Offers",
        start: "Oct 1, 2026",
        end: "Jan 31, 2027",
        type: "Airdrop",
        offerType: "Percentage Off",
      },
      // Pure 2027 — future planned
      {
        id: "OID-95007",
        name: "Black Friday 2027 Preview",
        status: "draft",
        channel: "JD Perks",
        publisher: "JD Perks",
        start: "Oct 1, 2027",
        end: "Dec 1, 2027",
        type: "Seasonal",
        offerType: "Percentage Off",
      },
    ],
    campaigns: [
      {
        id: "CID-3401",
        name: "Monthly Airdrop Bundle",
        publisher: "ampliFI",
        status: "Active",
      },
      {
        id: "CID-3405",
        name: "Commodity Classic Event",
        publisher: "John Deere",
        status: "Review",
      },
      {
        id: "CID-3416",
        name: "Mother's Day Bundle",
        publisher: "Verizon",
        status: "Review",
      },
    ],
    perf: [
      {
        offer: "$15 off First Prime Purchase",
        channel: "Verizon Value",
        clicks: 12400,
        saves: 7200,
        redemptions: 2800,
        revenue: "$42,000",
      },
      {
        offer: "Prime Video 3-Month Free Trial",
        channel: "JD Perks",
        clicks: 4100,
        saves: 2400,
        redemptions: 820,
        revenue: "$12,300",
      },
      {
        offer: "20% off Amazon Fresh",
        channel: "Optum Offers",
        clicks: 3200,
        saves: 1900,
        redemptions: 640,
        revenue: "$9,600",
      },
    ],
  },

  // ----- Additional merchants (pagination filler). List-view complete; detail
  // dialog renders with the minimum fields the UI requires. -----
  {
    key: "target",
    name: "Target",
    id: "MID-10210",
    category: "Retail",
    emoji: "🎯",
    color: "#fee2e2",
    source: "Augeo",
    commissionOffers: true,
    status: "published",
    contact: "Linda Cho · lcho@target.com",
    website: "target.com",
    merchantDetail:
      "Mass-market retailer offering home goods, apparel, groceries, and Circle loyalty program rewards across in-store and online channels.",
    offers: [
      _mkOffer(
        "OID-71010",
        "Target Circle 10% Off",
        "published",
        "Verizon Value",
        "Percentage Off"
      ),
      _mkOffer(
        "OID-71011",
        "Free Shipping on $35+",
        "published",
        "T-Mobile Perks",
        "Free Product"
      ),
      _mkOffer(
        "OID-71012",
        "Holiday Gift Card Bonus",
        "expired",
        "JD Perks",
        "Money Off"
      ),
    ],
    campaigns: [
      _mkCampaign("CID-7101", "Welcome Bundle"),
      _mkCampaign("CID-7102", "Spring Refresh"),
    ],
  },
  {
    key: "bestbuy",
    name: "Best Buy",
    id: "MID-10218",
    category: "Electronics",
    emoji: "💻",
    color: "#dbeafe",
    source: "EBG",
    commissionOffers: true,
    status: "published",
    contact: "Ravi Patel · rpatel@bestbuy.com",
    website: "bestbuy.com",
    merchantDetail:
      "Consumer electronics and appliance retailer with Geek Squad services, My Best Buy member pricing, and trade-in programs.",
    offers: [
      _mkOffer(
        "OID-71020",
        "Geek Squad 6-Month Trial",
        "published",
        "Verizon Value",
        "Free Product"
      ),
      _mkOffer(
        "OID-71021",
        "15% Off Laptops",
        "published",
        "Optum Offers",
        "Percentage Off"
      ),
    ],
    campaigns: [_mkCampaign("CID-7103", "Tech Refresh")],
  },
  {
    key: "costco",
    name: "Costco",
    id: "MID-10221",
    category: "Retail",
    emoji: "🏬",
    color: "#fef3c7",
    source: "Direct",
    commissionOffers: false,
    status: "published",
    contact: "Greg Lopez · glopez@costco.com",
    website: "costco.com",
    merchantDetail:
      "Membership warehouse club with bulk groceries, electronics, optical, pharmacy, and fuel discounts for Gold Star and Executive members.",
    offers: [
      _mkOffer(
        "OID-71030",
        "$20 Off New Membership",
        "published",
        "AT&T Thanks",
        "Money Off"
      ),
    ],
    campaigns: [],
  },
  {
    key: "walmart",
    name: "Walmart",
    id: "MID-10232",
    category: "Retail",
    emoji: "🏪",
    color: "#dbeafe",
    source: "Augeo",
    commissionOffers: true,
    status: "published",
    contact: "Aisha Brown · abrown@walmart.com",
    website: "walmart.com",
    merchantDetail:
      "Largest U.S. retailer offering everyday low prices on groceries, apparel, electronics, and Walmart+ subscription benefits including free delivery.",
    offers: [
      _mkOffer(
        "OID-71040",
        "Walmart+ 30-Day Trial",
        "published",
        "Verizon Value",
        "Free Product"
      ),
      _mkOffer(
        "OID-71041",
        "10% Off Groceries",
        "published",
        "JD Perks",
        "Percentage Off"
      ),
      _mkOffer(
        "OID-71042",
        "Free Pickup",
        "published",
        "T-Mobile Perks",
        "Free Product"
      ),
      _mkOffer(
        "OID-71043",
        "Back-to-School Sale",
        "expired",
        "Optum Offers",
        "Percentage Off"
      ),
    ],
    campaigns: [
      _mkCampaign("CID-7104", "Family Essentials"),
      _mkCampaign("CID-7105", "Monthly Airdrop Bundle"),
    ],
  },
  {
    key: "macys",
    name: "Macy's",
    id: "MID-10245",
    category: "Apparel",
    emoji: "👗",
    color: "#fce7f3",
    source: "EBG",
    commissionOffers: true,
    status: "unpublished",
    contact: "Diana Wu · dwu@macys.com",
    website: "macys.com",
    merchantDetail:
      "Department store chain featuring apparel, beauty, home goods, and Star Rewards loyalty tiers with frequent seasonal sales.",
    offers: [
      _mkOffer(
        "OID-71050",
        "25% Off Sitewide",
        "published",
        "AT&T Thanks",
        "Percentage Off"
      ),
      _mkOffer(
        "OID-71051",
        "Free Beauty Bag",
        "expired",
        "Verizon Value",
        "Free Product"
      ),
    ],
    campaigns: [_mkCampaign("CID-7106", "Spring Refresh")],
  },
  {
    key: "netflix",
    name: "Netflix",
    id: "MID-10256",
    category: "Entertainment",
    emoji: "🎞️",
    color: "#fecaca",
    source: "Direct",
    commissionOffers: false,
    status: "published",
    contact: "Tom Hayes · thayes@netflix.com",
    website: "netflix.com",
    merchantDetail:
      "Subscription streaming service for movies, original series, documentaries, and games across ad-supported and ad-free tiers.",
    offers: [
      _mkOffer(
        "OID-71060",
        "Netflix Standard — 1 Month Free",
        "published",
        "T-Mobile Perks",
        "Free Product"
      ),
      _mkOffer(
        "OID-71061",
        "Annual Plan 20% Off",
        "published",
        "Verizon Value",
        "Percentage Off"
      ),
    ],
    campaigns: [_mkCampaign("CID-7107", "Boosted Rewards")],
  },
  {
    key: "spotify",
    name: "Spotify",
    id: "MID-10267",
    category: "Entertainment",
    emoji: "🎧",
    color: "#dcfce7",
    source: "Augeo",
    commissionOffers: true,
    status: "published",
    contact: "Maya Singh · msingh@spotify.com",
    website: "spotify.com",
    merchantDetail:
      "Audio streaming platform offering music, podcasts, and audiobooks with free ad-supported and Premium subscription tiers.",
    offers: [
      _mkOffer(
        "OID-71070",
        "Premium — 3 Months Free",
        "published",
        "Verizon Value",
        "Free Product"
      ),
    ],
    campaigns: [
      _mkCampaign("CID-7108", "Welcome Bundle"),
      _mkCampaign("CID-7109", "Boosted Rewards"),
    ],
  },
  {
    key: "hulu",
    name: "Hulu",
    id: "MID-10271",
    category: "Entertainment",
    emoji: "📺",
    color: "#d1fae5",
    source: "Direct",
    commissionOffers: false,
    status: "published",
    contact: "Erika Park · epark@hulu.com",
    website: "hulu.com",
    merchantDetail:
      "Streaming service with current-season TV, original content, and live TV bundles available standalone or as part of the Disney bundle.",
    offers: [
      _mkOffer(
        "OID-71080",
        "Hulu + Live TV — $20 Off",
        "published",
        "Optum Offers",
        "Money Off"
      ),
      _mkOffer(
        "OID-71081",
        "Hulu Ad-Supported Trial",
        "published",
        "JD Perks",
        "Free Product"
      ),
    ],
    campaigns: [],
  },
  {
    key: "starbucks",
    name: "Starbucks",
    id: "MID-10284",
    category: "Food & Dining",
    emoji: "☕",
    color: "#dcfce7",
    source: "Augeo",
    commissionOffers: true,
    status: "published",
    contact: "Jordan Lee · jlee@starbucks.com",
    website: "starbucks.com",
    merchantDetail:
      "Global coffee chain with handcrafted beverages, food, and Starbucks Rewards earning stars on every purchase for free items.",
    offers: [
      _mkOffer(
        "OID-71090",
        "BOGO Handcrafted Drinks",
        "published",
        "AT&T Thanks",
        "Free Product"
      ),
      _mkOffer(
        "OID-71091",
        "Double Stars Tuesdays",
        "published",
        "Verizon Value",
        "Percentage Off"
      ),
      _mkOffer(
        "OID-71092",
        "Free Birthday Drink",
        "published",
        "T-Mobile Perks",
        "Free Product"
      ),
    ],
    campaigns: [_mkCampaign("CID-7110", "Mother's Day Bundle")],
  },
  {
    key: "mcdonalds",
    name: "McDonald's",
    id: "MID-10292",
    category: "Food & Dining",
    emoji: "🍟",
    color: "#fef3c7",
    source: "EBG",
    commissionOffers: true,
    status: "published",
    contact: "Carlos Mendez · cmendez@mcdonalds.com",
    website: "mcdonalds.com",
    merchantDetail:
      "Quick-service restaurant chain with burgers, breakfast, McCafé, and MyMcDonald's Rewards points redeemable across the menu.",
    offers: [
      _mkOffer(
        "OID-71100",
        "Free Medium Fries with Purchase",
        "published",
        "JD Perks",
        "Free Product"
      ),
      _mkOffer(
        "OID-71101",
        "20% Off App Order",
        "published",
        "Optum Offers",
        "Percentage Off"
      ),
    ],
    campaigns: [_mkCampaign("CID-7111", "Commodity Classics")],
  },
  {
    key: "chickfila",
    name: "Chick-fil-A",
    id: "MID-10298",
    category: "Food & Dining",
    emoji: "🐔",
    color: "#fee2e2",
    source: "Direct",
    commissionOffers: false,
    status: "published",
    contact: "Beth Carter · bcarter@chick-fil-a.com",
    website: "chick-fil-a.com",
    merchantDetail:
      "Quick-service chicken specialist with the Chick-fil-A One rewards program offering tier-based perks and member-only menu items.",
    offers: [
      _mkOffer(
        "OID-71110",
        "Free Sandwich with Combo",
        "published",
        "Verizon Value",
        "Free Product"
      ),
    ],
    campaigns: [_mkCampaign("CID-7112", "Family Essentials")],
  },
  {
    key: "dominos",
    name: "Domino's",
    id: "MID-10305",
    category: "Food & Dining",
    emoji: "🍕",
    color: "#fee2e2",
    source: "Augeo",
    commissionOffers: true,
    status: "published",
    contact: "Nina Patel · npatel@dominos.com",
    website: "dominos.com",
    merchantDetail:
      "Pizza delivery and carryout chain with online ordering, Piece of the Pie Rewards points, and frequent buy-one-get-one offers.",
    offers: [
      _mkOffer(
        "OID-71120",
        "$7.99 Carryout Special",
        "published",
        "T-Mobile Perks",
        "Special Price"
      ),
      _mkOffer(
        "OID-71121",
        "50% Off Pizzas Online",
        "expired",
        "Verizon Value",
        "Percentage Off"
      ),
    ],
    campaigns: [],
  },
  {
    key: "marriott",
    name: "Marriott Bonvoy",
    id: "MID-10316",
    category: "Travel",
    emoji: "🏨",
    color: "#e0e7ff",
    source: "EBG",
    commissionOffers: true,
    status: "published",
    contact: "Henry Park · hpark@marriott.com",
    website: "marriott.com",
    merchantDetail:
      "Global hotel loyalty program spanning 30+ brands with points-earning stays, elite tiers, and partner redemption options.",
    offers: [
      _mkOffer(
        "OID-71130",
        "20% Off Stays",
        "published",
        "AT&T Thanks",
        "Percentage Off"
      ),
      _mkOffer(
        "OID-71131",
        "Free 4th Night",
        "published",
        "Verizon Value",
        "Free Product"
      ),
    ],
    campaigns: [
      _mkCampaign("CID-7113", "Spring Refresh"),
      _mkCampaign("CID-7114", "Welcome Bundle"),
    ],
  },
  {
    key: "hilton",
    name: "Hilton Honors",
    id: "MID-10324",
    category: "Travel",
    emoji: "🛏️",
    color: "#e0e7ff",
    source: "Direct",
    commissionOffers: true,
    status: "published",
    contact: "Olivia Reyes · oreyes@hilton.com",
    website: "hilton.com",
    merchantDetail:
      "Hilton portfolio loyalty program offering points and status across 20+ hotel brands, plus member-only rates and free Wi-Fi.",
    offers: [
      _mkOffer(
        "OID-71140",
        "Points Bonus — 2x Stays",
        "published",
        "Optum Offers",
        "Special Price"
      ),
    ],
    campaigns: [_mkCampaign("CID-7115", "Boosted Rewards")],
  },
  {
    key: "delta",
    name: "Delta Air Lines",
    id: "MID-10337",
    category: "Travel",
    emoji: "✈️",
    color: "#dbeafe",
    source: "Augeo",
    commissionOffers: false,
    status: "published",
    contact: "Frank Ozawa · fozawa@delta.com",
    website: "delta.com",
    merchantDetail:
      "Major U.S. carrier with SkyMiles loyalty program, Medallion elite tiers, and credit card partner earning across domestic and international routes.",
    offers: [
      _mkOffer(
        "OID-71150",
        "SkyMiles Bonus",
        "published",
        "JD Perks",
        "Special Price"
      ),
      _mkOffer(
        "OID-71151",
        "Companion Fare",
        "published",
        "Verizon Value",
        "Money Off"
      ),
      _mkOffer(
        "OID-71152",
        "Spring Sale",
        "expired",
        "T-Mobile Perks",
        "Percentage Off"
      ),
    ],
    campaigns: [_mkCampaign("CID-7116", "Spring Refresh")],
  },
  {
    key: "expedia",
    name: "Expedia",
    id: "MID-10349",
    category: "Travel",
    emoji: "🗺️",
    color: "#fef3c7",
    source: "EBG",
    commissionOffers: true,
    status: "unpublished",
    contact: "Iris Tan · itan@expedia.com",
    website: "expedia.com",
    merchantDetail:
      "Online travel agency with bundled flight, hotel, and car deals, plus the One Key rewards program shared across Expedia, Hotels.com, and Vrbo.",
    offers: [
      _mkOffer(
        "OID-71160",
        "10% Off Bundle Deals",
        "published",
        "AT&T Thanks",
        "Percentage Off"
      ),
    ],
    campaigns: [],
  },
  {
    key: "gnc",
    name: "GNC",
    id: "MID-10358",
    category: "Health & Wellness",
    emoji: "💊",
    color: "#dcfce7",
    source: "Augeo",
    commissionOffers: true,
    status: "published",
    contact: "Sam Doe · sdoe@gnc.com",
    website: "gnc.com",
    merchantDetail:
      "Vitamin, supplement, and wellness retailer with myGNC Rewards points and exclusive member pricing on protein, performance, and health products.",
    offers: [
      _mkOffer(
        "OID-71170",
        "Buy 1 Get 1 Vitamins",
        "published",
        "Verizon Value",
        "Free Product"
      ),
      _mkOffer(
        "OID-71171",
        "Pro Access Member Discount",
        "published",
        "Optum Offers",
        "Percentage Off"
      ),
    ],
    campaigns: [_mkCampaign("CID-7117", "Family Essentials")],
  },
  {
    key: "planetfitness",
    name: "Planet Fitness",
    id: "MID-10363",
    category: "Health & Wellness",
    emoji: "🏋️",
    color: "#fef3c7",
    source: "Direct",
    commissionOffers: false,
    status: "published",
    contact: "Maria Lopez · mlopez@planetfitness.com",
    website: "planetfitness.com",
    merchantDetail:
      "Gym chain with low-cost monthly memberships, Black Card perks, and a judgment-free environment focused on first-time gym-goers.",
    offers: [
      _mkOffer(
        "OID-71180",
        "$1 Down, $10/mo",
        "published",
        "T-Mobile Perks",
        "Special Price"
      ),
    ],
    campaigns: [_mkCampaign("CID-7118", "Welcome Bundle")],
  },
  {
    key: "sephora",
    name: "Sephora",
    id: "MID-10371",
    category: "Beauty",
    emoji: "💄",
    color: "#fce7f3",
    source: "EBG",
    commissionOffers: true,
    status: "published",
    contact: "Yuki Tanaka · ytanaka@sephora.com",
    website: "sephora.com",
    merchantDetail:
      "Beauty retailer carrying prestige skincare, makeup, fragrance, and hair brands with Beauty Insider rewards earning points on every purchase.",
    offers: [
      _mkOffer(
        "OID-71190",
        "Beauty Insider Free Sample",
        "published",
        "Verizon Value",
        "Free Product"
      ),
      _mkOffer(
        "OID-71191",
        "20% Off Rouge Sale",
        "published",
        "JD Perks",
        "Percentage Off"
      ),
    ],
    campaigns: [
      _mkCampaign("CID-7119", "Mother's Day Bundle"),
      _mkCampaign("CID-7120", "Boosted Rewards"),
    ],
  },
  {
    key: "ulta",
    name: "Ulta Beauty",
    id: "MID-10384",
    category: "Beauty",
    emoji: "💋",
    color: "#fce7f3",
    source: "Augeo",
    commissionOffers: true,
    status: "published",
    contact: "Priya Shah · pshah@ulta.com",
    website: "ulta.com",
    merchantDetail:
      "Beauty retailer combining prestige and mass brands with Ultamate Rewards tiers and in-store salon services.",
    offers: [
      _mkOffer(
        "OID-71200",
        "Ultamate Rewards 2x Points",
        "published",
        "AT&T Thanks",
        "Special Price"
      ),
    ],
    campaigns: [],
  },
  {
    key: "homedepot",
    name: "The Home Depot",
    id: "MID-10395",
    category: "Home Improvement",
    emoji: "🔨",
    color: "#fed7aa",
    source: "Direct",
    commissionOffers: true,
    status: "published",
    contact: "Brian Knox · bknox@homedepot.com",
    website: "homedepot.com",
    merchantDetail:
      "Home improvement retailer for tools, building materials, appliances, and Pro Xtra rewards for contractors and frequent buyers.",
    offers: [
      _mkOffer(
        "OID-71210",
        "Pro Xtra Member Discount",
        "published",
        "Optum Offers",
        "Percentage Off"
      ),
      _mkOffer(
        "OID-71211",
        "Free Delivery on Appliances",
        "published",
        "Verizon Value",
        "Free Product"
      ),
    ],
    campaigns: [_mkCampaign("CID-7121", "Spring Refresh")],
  },
  {
    key: "lowes",
    name: "Lowe's",
    id: "MID-10402",
    category: "Home Improvement",
    emoji: "🔧",
    color: "#dbeafe",
    source: "EBG",
    commissionOffers: false,
    status: "published",
    contact: "Karen Wells · kwells@lowes.com",
    website: "lowes.com",
    merchantDetail:
      "Home improvement chain with appliances, tools, lumber, and MyLowe's Rewards offering points and member-only pricing.",
    offers: [
      _mkOffer(
        "OID-71220",
        "MyLowe's 5% Off",
        "published",
        "JD Perks",
        "Percentage Off"
      ),
    ],
    campaigns: [_mkCampaign("CID-7122", "Family Essentials")],
  },
  {
    key: "shell",
    name: "Shell",
    id: "MID-10416",
    category: "Gas & Convenience",
    emoji: "⛽",
    color: "#fee2e2",
    source: "Augeo",
    commissionOffers: false,
    status: "published",
    contact: "Dale Pearson · dpearson@shell.com",
    website: "shell.com",
    merchantDetail:
      "Global fuel and convenience retailer with Fuel Rewards program offering per-gallon discounts and partner earn opportunities.",
    offers: [
      _mkOffer(
        "OID-71230",
        "Fuel Rewards 10¢/gal Off",
        "published",
        "T-Mobile Perks",
        "Money Off"
      ),
      _mkOffer(
        "OID-71231",
        "Shell Go+ Sign-Up Bonus",
        "published",
        "Verizon Value",
        "Free Product"
      ),
    ],
    campaigns: [],
  },
  {
    key: "att",
    name: "AT&T",
    id: "MID-10428",
    category: "Telecom",
    emoji: "📱",
    color: "#dbeafe",
    source: "Direct",
    commissionOffers: false,
    status: "published",
    contact: "Naomi Brooks · nbrooks@att.com",
    website: "att.com",
    merchantDetail:
      "Wireless, fiber internet, and entertainment provider with AT&T Thanks customer perks including ticket presales and partner discounts.",
    offers: [
      _mkOffer(
        "OID-71240",
        "$200 Off New Line",
        "published",
        "AT&T Thanks",
        "Money Off"
      ),
      _mkOffer(
        "OID-71241",
        "Free 5G Activation",
        "published",
        "Verizon Value",
        "Free Product"
      ),
    ],
    campaigns: [_mkCampaign("CID-7123", "Welcome Bundle")],
  },
  {
    key: "sevenelv",
    name: "7-Eleven",
    id: "MID-10434",
    category: "Gas & Convenience",
    emoji: "🥤",
    color: "#fef3c7",
    source: "EBG",
    commissionOffers: true,
    status: "published",
    contact: "Will Tang · wtang@7-eleven.com",
    website: "7-eleven.com",
    merchantDetail:
      "Convenience store chain with 7Rewards loyalty program offering points on coffee, fuel, snacks, and delivery via 7NOW.",
    offers: [
      _mkOffer(
        "OID-71250",
        "Free Slurpee Day",
        "published",
        "Optum Offers",
        "Free Product"
      ),
      _mkOffer(
        "OID-71251",
        "7Rewards Double Points",
        "published",
        "JD Perks",
        "Special Price"
      ),
    ],
    campaigns: [_mkCampaign("CID-7124", "Monthly Airdrop Bundle")],
  },
];

// ---------------------------------------------------------------------------
// Multi-value enrichment — categories + Catalog Filter memberships.
//
// In production both relationships are many-to-many: a merchant can be tagged
// with multiple offer/merchant categories and can match into several Catalog
// Filter bundles via the include/exclude criteria defined in
// kigo-admin-tools/.../catalog-filters. We enrich the merchant fixtures here
// (rather than inline) so the per-merchant declarations stay focused on
// identity + offers + campaigns.
// ---------------------------------------------------------------------------

// Catalog names mirror the publisher channels active on this prototype's
// offers (Verizon Value, JD Perks, Optum Offers, etc.) so the membership a
// merchant shows matches the offers they're surfacing through.
export const CATALOG_POOL = {
  jdPerks: "JD Perks",
  verizon: "Verizon Value",
  optum: "Optum Offers",
  amplifi: "ampliFI Marketplace",
  everglades: "Everglades Rewards",
  johnDeereLoyalty: "John Deere Loyalty",
  kigoMarketplace: "Kigo Marketplace",
} as const;

// Public-facing catalog name list — alphabetized for filter dropdowns.
export const CATALOG_NAMES: readonly string[] = Object.values(CATALOG_POOL)
  .slice()
  .sort((a, b) => a.localeCompare(b));

// Subset of merchants that legitimately span more than one category. Leave
// single-category merchants untouched so the chip layout still reads as a
// single tag in the common case.
const CATEGORY_OVERRIDES: Record<string, string> = {
  sams: "Retail, Wholesale",
  amazon: "Retail, Electronics, Entertainment",
  target: "Retail, Home Goods, Apparel",
  bestbuy: "Electronics, Appliances",
  walmart: "Retail, Grocery",
  costco: "Retail, Wholesale",
  macys: "Apparel, Beauty, Home Goods",
  sephora: "Beauty, Wellness",
  ulta: "Beauty, Wellness",
  homedepot: "Home Improvement, Garden",
  lowes: "Home Improvement, Appliances",
  shell: "Gas & Convenience, Automotive",
  sevenelv: "Gas & Convenience, Food & Dining",
  starbucks: "Food & Dining, Beverages",
  gnc: "Health & Wellness, Supplements",
  expedia: "Travel, Lodging",
};

const CATALOG_ASSIGNMENTS: Record<string, string[]> = {
  sams: [CATALOG_POOL.jdPerks, CATALOG_POOL.verizon, CATALOG_POOL.amplifi],
  disney: [CATALOG_POOL.verizon, CATALOG_POOL.amplifi],
  activefit: [CATALOG_POOL.optum, CATALOG_POOL.everglades],
  papajohns: [CATALOG_POOL.jdPerks, CATALOG_POOL.kigoMarketplace],
  amazon: [
    CATALOG_POOL.verizon,
    CATALOG_POOL.amplifi,
    CATALOG_POOL.kigoMarketplace,
  ],
  target: [CATALOG_POOL.kigoMarketplace, CATALOG_POOL.amplifi],
  bestbuy: [CATALOG_POOL.verizon, CATALOG_POOL.kigoMarketplace],
  costco: [CATALOG_POOL.jdPerks, CATALOG_POOL.everglades],
  walmart: [CATALOG_POOL.kigoMarketplace],
  macys: [CATALOG_POOL.amplifi, CATALOG_POOL.kigoMarketplace],
  netflix: [CATALOG_POOL.verizon],
  spotify: [CATALOG_POOL.verizon, CATALOG_POOL.amplifi],
  hulu: [CATALOG_POOL.verizon],
  starbucks: [
    CATALOG_POOL.jdPerks,
    CATALOG_POOL.optum,
    CATALOG_POOL.kigoMarketplace,
  ],
  mcdonalds: [CATALOG_POOL.kigoMarketplace, CATALOG_POOL.jdPerks],
  chickfila: [CATALOG_POOL.kigoMarketplace],
  dominos: [CATALOG_POOL.jdPerks, CATALOG_POOL.kigoMarketplace],
  marriott: [CATALOG_POOL.amplifi, CATALOG_POOL.everglades],
  hilton: [CATALOG_POOL.amplifi, CATALOG_POOL.everglades],
  delta: [CATALOG_POOL.amplifi],
  expedia: [CATALOG_POOL.amplifi, CATALOG_POOL.everglades],
  gnc: [CATALOG_POOL.optum, CATALOG_POOL.kigoMarketplace],
  planetfitness: [CATALOG_POOL.optum, CATALOG_POOL.everglades],
  sephora: [CATALOG_POOL.amplifi, CATALOG_POOL.kigoMarketplace],
  ulta: [CATALOG_POOL.amplifi, CATALOG_POOL.kigoMarketplace],
  homedepot: [CATALOG_POOL.johnDeereLoyalty, CATALOG_POOL.jdPerks],
  lowes: [CATALOG_POOL.johnDeereLoyalty, CATALOG_POOL.kigoMarketplace],
  shell: [CATALOG_POOL.johnDeereLoyalty, CATALOG_POOL.jdPerks],
  att: [CATALOG_POOL.verizon, CATALOG_POOL.kigoMarketplace],
  sevenelv: [CATALOG_POOL.kigoMarketplace, CATALOG_POOL.jdPerks],
};

for (const merchant of merchants) {
  if (CATEGORY_OVERRIDES[merchant.key]) {
    merchant.category = CATEGORY_OVERRIDES[merchant.key];
  }
  merchant.catalogs = CATALOG_ASSIGNMENTS[merchant.key] ?? [];
}
