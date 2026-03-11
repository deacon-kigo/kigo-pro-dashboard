import { redirect } from "next/navigation";
import { LandingPageConfig } from "@/types/tmt-campaign";
import {
  LandingPageContent,
  PromotionEnded,
} from "@/components/features/tmt-campaigns/landing";

const KIGO_BASE_URL = process.env.NEXT_PUBLIC_KIGO_CORE_SERVER_URL;

interface CodeInfo {
  code: string;
  affiliate_code_one: string;
  affiliate_code_two: string;
  is_used: boolean;
  has_email: boolean;
}

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

async function getCodeInfo(
  slug: string,
  code: string
): Promise<CodeInfo | null> {
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

export default async function PublicLandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ code?: string }>;
}) {
  const { slug } = await params;
  const { code } = await searchParams;

  if (!code) return <PromotionEnded />;

  const campaign = await getCampaign(slug);
  if (!campaign || !campaign.isActive) return <PromotionEnded />;

  // Check expiration
  if (campaign.endCampaignDate) {
    const endDate = new Date(campaign.endCampaignDate);
    if (endDate < new Date()) return <PromotionEnded />;
  }

  // Preview mode — bypass code validation for prototype testing
  const isPreview = code === "PREVIEW";
  const codeInfo: CodeInfo | null = isPreview
    ? {
        code: "PREVIEW",
        affiliate_code_one: "",
        affiliate_code_two: "",
        is_used: false,
        has_email: false,
      }
    : await getCodeInfo(slug, code);
  if (!codeInfo) return <PromotionEnded />;

  // Direct link redirect
  if (
    campaign.getCode === "direct-link" &&
    campaign.directLinkConfig.redirectUrl
  ) {
    // Mark used server-side
    try {
      await fetch(`${KIGO_BASE_URL}/public/tmt-codes/mark-used`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, affiliate_slug: slug }),
      });
    } catch {}
    redirect(campaign.directLinkConfig.redirectUrl + code);
  }

  return (
    <LandingPageContent
      config={campaign}
      codeInfo={codeInfo}
      slug={slug}
      code={code}
    />
  );
}
