import type { PremadeCampaign } from "./types";

/** Human-readable headline discount, e.g. "10% off" or "$25 off". */
export function discountLabel(c: PremadeCampaign): string {
  return c.discountType === "percent"
    ? `${c.discountValue}% off`
    : `$${c.discountValue} off`;
}

/** Short constraints summary, e.g. "Min spend $250 · Up to $2,500". */
export function constraintsSummary(c: PremadeCampaign): string {
  const parts: string[] = [];
  if (c.constraints.minSpend != null) {
    parts.push(`Min spend ${formatCurrency(c.constraints.minSpend)}`);
  }
  if (c.constraints.maxDiscount != null) {
    parts.push(`Up to ${formatCurrency(c.constraints.maxDiscount)}`);
  }
  return parts.length ? parts.join(" · ") : "No restrictions";
}

export function formatCurrency(value: number, withCents = false): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: withCents ? 2 : 0,
  });
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  // Parse as a local date (avoid TZ shifting for date-only strings).
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Slugify a campaign name into a deep-link path segment. */
export function buildCmsUrl(campaign: PremadeCampaign): string {
  const slug = campaign.id;
  return `https://deere.deals/everglades/${slug}`;
}

/** Today as an ISO date string (YYYY-MM-DD), local. */
export function todayIso(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/* -------------------------------------------------------------------------- */
/*  Per-medium activation links + QR payload                                  */
/* -------------------------------------------------------------------------- */

/** The mediums a dealer can activate a campaign through. */
export type ActivationChannel = "email" | "sms" | "social" | "qr";

export interface ChannelMeta {
  id: ActivationChannel;
  label: string;
  /** Short helper shown under the link. */
  hint: string;
  utmMedium: string;
}

/** Channels surfaced in the activation UI (QR is rendered separately). */
export const ACTIVATION_CHANNELS: ChannelMeta[] = [
  {
    id: "email",
    label: "Email",
    hint: "Paste into your email blast or newsletter CTA.",
    utmMedium: "email",
  },
  {
    id: "sms",
    label: "SMS / Text",
    hint: "Drop into a text-message campaign.",
    utmMedium: "sms",
  },
  {
    id: "social",
    label: "Social media",
    hint: "Use in social posts, bio links, or paid ads.",
    utmMedium: "social",
  },
];

/**
 * Build a tracked activation deep link for a given medium. Each medium gets its
 * own link so redemptions can be attributed to the channel that drove them.
 */
export function buildChannelUrl(
  campaign: PremadeCampaign,
  channel: ActivationChannel
): string {
  const base = buildCmsUrl(campaign);
  const params = new URLSearchParams({
    ch: channel,
    utm_source: channel,
    utm_medium: channel === "qr" ? "print" : channel,
    utm_campaign: campaign.id,
  });
  return `${base}?${params.toString()}`;
}
