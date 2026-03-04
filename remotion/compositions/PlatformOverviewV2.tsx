/**
 * PlatformOverviewV2 — 60s platform overview focused on real UI + micro-interactions.
 *
 * 10 scenes showcasing the Kigo Pro all-in-one platform:
 * 1. Brand Intro (4s/120f) — HeroTitle with grid
 * 2. All-in-One (8s/240f) — FeatureGrid with 6 modules
 * 3. Dashboard (7s/210f) — Real GenericDashboardView in FullScreenUI
 * 4. Offer Manager (7s/210f) — Real OfferManagerView in SplitContent
 * 5. AI Campaign (7s/210f) — Real AICampaignCreationPage in FullScreenUI
 * 6. Member CRM (6s/180f) — Real MemberCRMView in SplitContent
 * 7. Marketing Insights (6s/180f) — Real MarketingInsightsView in FullScreenUI
 * 8. AI Assistant (5s/150f) — Real AIAssistant in SplitContent
 * 9. Stats (5s/150f) — StatHighlight with animated numbers
 * 10. CTA (5s/150f) — ClosingCTA
 *
 * Total: 60s / 1800f @ 30fps
 */
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";

// Layout templates
import {
  HeroTitle,
  SplitContent,
  FullScreenUI,
  StatHighlight,
  FeatureGrid,
  ClosingCTA,
} from "../components/layouts";

// FX effects
import {
  GradientText,
  GlassMorphCard,
  AccentBar,
  ShimmerBorder,
  Spotlight,
  ParticleField,
  GridPattern,
} from "../components/fx";

// Brand + Motion
import { colors, gradients } from "../lib/brand";
import { fontFamily, fontStyles } from "../lib/fonts";
import { MOTION } from "../lib/motion-tokens";

// REAL UI COMPONENTS (all default exports)
import GenericDashboardView from "@/components/features/dashboard/views/GenericDashboardView";
import OfferManagerView from "@/components/features/offer-manager/OfferManagerView";
import AICampaignCreationPage from "@/components/features/campaigns/creation/AICampaignCreationPage";
import MemberCRMView from "@/components/features/member-crm/MemberCRMView";
import MarketingInsightsView from "@/components/features/marketing-insights/MarketingInsightsView";
import AIAssistant from "@/components/organisms/AIAssistant/AIAssistant";

// ─── Scene 1: Brand Intro ─────────────────────────────────────────
const BrandIntro: React.FC = () => (
  <HeroTitle
    title="Kigo Pro"
    subtitle="Everything loyalty. One platform."
    backgroundEffect="grid"
  />
);

// ─── Scene 2: The All-in-One ──────────────────────────────────────
const AllInOne: React.FC = () => (
  <FeatureGrid
    title="Six Modules. Zero Silos."
    features={[
      { icon: "📊", title: "Dashboard", description: "Real-time KPIs" },
      { icon: "🎯", title: "Offers", description: "AI-powered creation" },
      { icon: "📣", title: "Campaigns", description: "Smart automation" },
      { icon: "👥", title: "Members", description: "CRM & insights" },
      { icon: "📈", title: "Analytics", description: "Journey discovery" },
      { icon: "🤖", title: "AI Assistant", description: "Always-on advisor" },
    ]}
  />
);

// ─── Scene 3: Dashboard ───────────────────────────────────────────
const DashboardScene: React.FC = () => (
  <FullScreenUI deviceFrame title="Dashboard">
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: colors.white,
      }}
    >
      <GenericDashboardView />
    </div>
  </FullScreenUI>
);

// ─── Scene 4: Offer Manager ──────────────────────────────────────
const OfferManagerScene: React.FC = () => (
  <SplitContent
    heading="Smart Offer Creation"
    body="AI-powered workflows that turn complex offer logic into guided steps."
    bullets={[
      "AI-generated offer recommendations",
      "Multi-step wizard with live preview",
      "Bulk actions across offer catalog",
    ]}
    accentColor={colors.coral}
    rightContent={
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: 12,
          background: colors.white,
        }}
      >
        <OfferManagerView />
      </div>
    }
  />
);

// ─── Scene 5: AI Campaign Builder ────────────────────────────────
const AICampaignScene: React.FC = () => (
  <FullScreenUI deviceFrame title="AI Campaign Builder">
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: colors.white,
      }}
    >
      <AICampaignCreationPage />
    </div>
  </FullScreenUI>
);

// ─── Scene 6: Member CRM ─────────────────────────────────────────
const MemberCRMScene: React.FC = () => (
  <SplitContent
    heading="Know Every Member"
    body="Full CRM with transaction history, points management, and behavioral insights."
    bullets={[
      "Instant member lookup & filtering",
      "Points adjustment & balance tracking",
      "Complete transaction history",
    ]}
    accentColor={colors.blue}
    rightContent={
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: 12,
          background: colors.white,
        }}
      >
        <MemberCRMView />
      </div>
    }
  />
);

// ─── Scene 7: Marketing Insights ─────────────────────────────────
const MarketingInsightsScene: React.FC = () => (
  <FullScreenUI deviceFrame title="Marketing Insights">
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: colors.white,
      }}
    >
      <MarketingInsightsView />
    </div>
  </FullScreenUI>
);

// ─── Scene 8: AI Assistant ───────────────────────────────────────
const AIAssistantScene: React.FC = () => (
  <SplitContent
    heading="AI That Works With You"
    body="Ask anything about your loyalty program. Get instant answers, predictions, and recommendations."
    accentColor={colors.purple}
    rightContent={
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: 12,
          background: colors.white,
        }}
      >
        <AIAssistant />
      </div>
    }
  />
);

// ─── Scene 9: Platform Impact ────────────────────────────────────
const StatsScene: React.FC = () => (
  <StatHighlight
    title="The Numbers Speak"
    stats={[
      { value: 6, suffix: " modules", label: "UNIFIED PLATFORM", decimals: 0 },
      { value: 2.4, suffix: "M+", label: "MEMBERS MANAGED", decimals: 1 },
      { value: 34, suffix: "%", label: "HIGHER REDEMPTION", decimals: 0 },
      { value: 10, suffix: "x", label: "FASTER LAUNCH", decimals: 0 },
    ]}
  />
);

// ─── Scene 10: Closing CTA ──────────────────────────────────────
const CTAScene: React.FC = () => (
  <ClosingCTA ctaText="One Platform. Every Touchpoint." subtitle="kigo.io" />
);

// ─── Main Composition ───────────────────────────────────────────
export const PlatformOverviewV2: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: colors.black }}>
      {/* Scene 1: Brand Intro — 0-120f (4s) */}
      <Sequence from={0} durationInFrames={120}>
        <BrandIntro />
      </Sequence>

      {/* Scene 2: All-in-One — 120-360f (8s) */}
      <Sequence from={120} durationInFrames={240}>
        <AllInOne />
      </Sequence>

      {/* Scene 3: Dashboard — 360-570f (7s) */}
      <Sequence from={360} durationInFrames={210}>
        <DashboardScene />
      </Sequence>

      {/* Scene 4: Offer Manager — 570-780f (7s) */}
      <Sequence from={570} durationInFrames={210}>
        <OfferManagerScene />
      </Sequence>

      {/* Scene 5: AI Campaign Builder — 780-990f (7s) */}
      <Sequence from={780} durationInFrames={210}>
        <AICampaignScene />
      </Sequence>

      {/* Scene 6: Member CRM — 990-1170f (6s) */}
      <Sequence from={990} durationInFrames={180}>
        <MemberCRMScene />
      </Sequence>

      {/* Scene 7: Marketing Insights — 1170-1350f (6s) */}
      <Sequence from={1170} durationInFrames={180}>
        <MarketingInsightsScene />
      </Sequence>

      {/* Scene 8: AI Assistant — 1350-1500f (5s) */}
      <Sequence from={1350} durationInFrames={150}>
        <AIAssistantScene />
      </Sequence>

      {/* Scene 9: Stats — 1500-1650f (5s) */}
      <Sequence from={1500} durationInFrames={150}>
        <StatsScene />
      </Sequence>

      {/* Scene 10: CTA — 1650-1800f (5s) */}
      <Sequence from={1650} durationInFrames={150}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
