import { redirect } from "next/navigation";
import { LandingPageConfig } from "@/types/tmt-campaign";
import {
  SecondaryScreenContent,
  PromotionEnded,
} from "@/components/features/tmt-campaigns/landing";

const KIGO_BASE_URL = process.env.NEXT_PUBLIC_KIGO_CORE_SERVER_URL;

function decodeConfiguration(config: any): any {
  if (typeof config === "string") {
    try {
      return JSON.parse(decodeURIComponent(atob(config)));
    } catch {
      return config;
    }
  }
  return config;
}

async function getCampaign(slug: string): Promise<LandingPageConfig | null> {
  try {
    const res = await fetch(
      `${KIGO_BASE_URL}/public/tmt-campaigns?affiliate_slug=${slug}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const config = decodeConfiguration(data.configuration);
    return {
      id: data.id,
      campaignName: data.campaign_name,
      googleTagManagerId: data.google_tag_manager_id,
      affiliateSlug: data.affiliate_slug,
      isActive: data.is_active,
      endCampaignDate: data.end_campaign_date,
      ...config,
    };
  } catch {
    return null;
  }
}

async function getCodeInfo(slug: string, code: string) {
  try {
    const res = await fetch(
      `${KIGO_BASE_URL}/public/tmt-codes?affiliate_slug=${slug}&code=${code}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const VALID_TYPES = ["pos", "with-timer", "online"];

export default async function SecondaryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; type: string }>;
  searchParams: Promise<{ code?: string }>;
}) {
  const { slug, type } = await params;
  const { code } = await searchParams;

  if (!VALID_TYPES.includes(type) || !code) return <PromotionEnded />;

  const campaign = await getCampaign(slug);
  if (!campaign || !campaign.isActive) return <PromotionEnded />;

  const codeInfo = await getCodeInfo(slug, code);
  if (!codeInfo) return <PromotionEnded />;

  return (
    <SecondaryScreenContent
      config={campaign}
      codeInfo={codeInfo}
      type={type as "with-timer" | "online" | "pos"}
      slug={slug}
    />
  );
}
