// V2 Campaign types based on John Keough's prototype design spec
// kigo-pro-dashboard/docs/prototype/kigo-pro-prototype-v2.html

export interface V2Campaign {
  id: string;
  name: string;
  publisherSubtitle: string;
  publisher: string;
  campaignType: string;
  channels: string[];
  timeline: string;
  approvalStatus: "approved" | "pending" | "planning";
  deliveryStatus: "live" | "scheduled" | "planned";
  impressions: string;
  ctr: string;
  redemptions: string;
}

export const CHANNEL_COLORS: Record<string, { bg: string; text: string }> = {
  Email: { bg: "bg-blue-100", text: "text-blue-700" },
  SMS: { bg: "bg-purple-100", text: "text-purple-700" },
  Push: { bg: "bg-amber-100", text: "text-amber-800" },
  "In-App": { bg: "bg-green-100", text: "text-green-700" },
};

export const CAMPAIGN_TYPE_COLORS: Record<
  string,
  { bg: string; text: string }
> = {
  Spotlight: { bg: "bg-green-100", text: "text-green-700" },
  Event: { bg: "bg-sky-100", text: "text-sky-700" },
  Program: { bg: "bg-sky-100", text: "text-sky-700" },
  Campaign: { bg: "bg-amber-100", text: "text-amber-800" },
  Collection: { bg: "bg-pink-100", text: "text-pink-700" },
  Expansion: { bg: "bg-amber-100", text: "text-amber-800" },
  Sports: { bg: "bg-amber-100", text: "text-amber-800" },
  Gaming: { bg: "bg-sky-100", text: "text-sky-700" },
};
