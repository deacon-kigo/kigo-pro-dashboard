/**
 * PlatformOverview — Full composition using REAL UI components + layouts + fx.
 *
 * 8 scenes showcasing the Kigo platform:
 * 1. Title (4s/120f) — HeroTitle with grid background
 * 2. Problem (5s/150f) — SplitContent with callout
 * 3. Dashboard (7s/210f) — Real GenericDashboardView in FullScreenUI
 * 4. Campaigns (6s/180f) — Real CampaignManagementDashboard in FullScreenUI
 * 5. AI Assistant (6s/180f) — Real AIAssistant in SplitContent
 * 6. Stats (4s/120f) — StatHighlight with animated numbers
 * 7. Partners (3s/90f) — Partner showcase
 * 8. CTA (3s/90f) — ClosingCTA
 *
 * Total: 38s / 1140f @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// Layout templates
import {
  HeroTitle,
  SplitContent,
  FullScreenUI,
  StatHighlight,
  ClosingCTA,
} from "../components/layouts";

// FX effects
import { GradientText, SpotlightCard, GlassMorphCard } from "../components/fx";

// Brand
import { colors, springs as springPresets } from "../lib/brand";
import { fontFamily, fontStyles } from "../lib/fonts";

// REAL UI COMPONENTS from kigo-pro-dashboard
import GenericDashboardView from "@/components/features/dashboard/views/GenericDashboardView";
import { CampaignManagementDashboard } from "@/components/features/campaign-management/CampaignManagementDashboard";
import AIAssistant from "@/components/organisms/AIAssistant/AIAssistant";

// ─── Scene 1: Title Card ───────────────────────────────────────────
const TitleScene: React.FC = () => (
  <HeroTitle
    title="The Future of Loyalty & Rewards"
    subtitle="One platform to power every loyalty touchpoint"
    backgroundEffect="grid"
  />
);

// ─── Scene 2: Problem Statement ────────────────────────────────────
const ProblemScene: React.FC = () => (
  <SplitContent
    heading="Loyalty Is Broken"
    body="Brands struggle with fragmented systems, poor redemption rates, and disconnected customer experiences across channels."
    bullets={[
      "Siloed reward programs across partners",
      "Low engagement and redemption rates",
      "No unified view of customer loyalty",
    ]}
    accentColor={colors.coral}
    rightContent={
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
        }}
      >
        <SpotlightCard spotlightColor={colors.coral}>
          <div style={{ padding: 40, fontFamily }}>
            <div
              style={{
                ...fontStyles.heading,
                fontSize: 48,
                color: colors.coral,
                marginBottom: 16,
              }}
            >
              73%
            </div>
            <div
              style={{ ...fontStyles.body, fontSize: 20, color: colors.white }}
            >
              of loyalty points go unredeemed
            </div>
          </div>
        </SpotlightCard>
      </div>
    }
  />
);

// ─── Scene 3: REAL Dashboard ───────────────────────────────────────
const DashboardScene: React.FC = () => (
  <FullScreenUI deviceFrame title="Kigo Pro Dashboard">
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

// ─── Scene 4: REAL Campaign Management ─────────────────────────────
const CampaignScene: React.FC = () => (
  <FullScreenUI deviceFrame title="Campaign Management">
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: colors.white,
        padding: 16,
      }}
    >
      <CampaignManagementDashboard />
    </div>
  </FullScreenUI>
);

// ─── Scene 5: REAL AI Assistant ────────────────────────────────────
const AIScene: React.FC = () => (
  <SplitContent
    heading="AI-Powered Intelligence"
    body="Your always-on loyalty strategist. Get instant insights, automated optimizations, and predictive analytics."
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

// ─── Scene 6: Stats ────────────────────────────────────────────────
const StatsScene: React.FC = () => (
  <StatHighlight
    title="Platform Impact"
    stats={[
      { value: 2400000, label: "Active Members", suffix: "+", decimals: 0 },
      { value: 34.2, label: "Redemption Rate", suffix: "%", decimals: 1 },
      {
        value: 18.7,
        label: "Revenue Impact",
        prefix: "$",
        suffix: "M",
        decimals: 1,
      },
      { value: 156, label: "Active Campaigns", decimals: 0 },
    ]}
  />
);

// ─── Scene 7: Partners ─────────────────────────────────────────────
const PartnerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: colors.black,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
        gap: 48,
      }}
    >
      <GradientText
        text="Trusted by Industry Leaders"
        style={{ fontSize: 48 }}
      />
      <div
        style={{
          display: "flex",
          gap: 32,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          "CVS Health",
          "Walgreens",
          "Target",
          "Kroger",
          "Safeway",
          "Costco",
        ].map((partner, i) => {
          const entrance = spring({
            frame: frame - 20 - i * 8,
            fps,
            config: springPresets.smooth,
          });
          return (
            <div
              key={partner}
              style={{
                width: 180,
                height: 80,
                borderRadius: 12,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: entrance,
                transform: `scale(${interpolate(entrance, [0, 1], [0.8, 1])})`,
              }}
            >
              <span
                style={{
                  ...fontStyles.subheading,
                  fontSize: 16,
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {partner}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 8: Closing CTA ──────────────────────────────────────────
const CTAScene: React.FC = () => (
  <ClosingCTA ctaText="Transform Your Loyalty Program" subtitle="kigo.io" />
);

// ─── Main Composition ──────────────────────────────────────────────
export const PlatformOverview: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: colors.black }}>
      {/* Scene 1: Title — 0-120f (4s) */}
      <Sequence from={0} durationInFrames={120}>
        <TitleScene />
      </Sequence>

      {/* Scene 2: Problem — 120-270f (5s) */}
      <Sequence from={120} durationInFrames={150}>
        <ProblemScene />
      </Sequence>

      {/* Scene 3: REAL Dashboard — 270-480f (7s) */}
      <Sequence from={270} durationInFrames={210}>
        <DashboardScene />
      </Sequence>

      {/* Scene 4: REAL Campaigns — 480-660f (6s) */}
      <Sequence from={480} durationInFrames={180}>
        <CampaignScene />
      </Sequence>

      {/* Scene 5: REAL AI Assistant — 660-840f (6s) */}
      <Sequence from={660} durationInFrames={180}>
        <AIScene />
      </Sequence>

      {/* Scene 6: Stats — 840-960f (4s) */}
      <Sequence from={840} durationInFrames={120}>
        <StatsScene />
      </Sequence>

      {/* Scene 7: Partners — 960-1050f (3s) */}
      <Sequence from={960} durationInFrames={90}>
        <PartnerScene />
      </Sequence>

      {/* Scene 8: CTA — 1050-1140f (3s) */}
      <Sequence from={1050} durationInFrames={90}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
