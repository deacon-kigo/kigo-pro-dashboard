/**
 * Marketing Insights CopilotKit Actions
 *
 * Provides AI co-pilot functionality for marketing insights, behavioral analysis,
 * and strategic campaign recommendations. Integrates with the AI Marketing Insights dashboard.
 */

import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addNotification } from "../redux/slices/uiSlice";

// Mock data for marketing insights
const JOURNEY_OPPORTUNITIES = [
  {
    id: "home-relocation",
    title: "Home Purchase + Relocation",
    description: "High-value journey with significant LTV potential.",
    customers: 8897,
    revenueRange: "$127K - $139K",
    monthlyRevenue: "$1.1M",
    confidence: 94,
    category: "home-improvement",
    insights: [
      "Peak activity during spring months (March-May)",
      "Average customer spends 40% more in first 6 months",
      "High correlation with furniture and home goods purchases",
      "Opportunity for 2X points on home improvement categories",
    ],
    recommendations: [
      {
        type: "tactical",
        title: "2X Points Home Improvement Campaign",
        description:
          "Target customers with recent home purchases with 2X points on home improvement categories",
        estimatedRevenue: "$150K - $200K",
        timeline: "3 months",
        confidence: 92,
      },
      {
        type: "strategic",
        title: "Home Journey Partnership Program",
        description:
          "Partner with real estate agents and mortgage lenders for targeted offers",
        estimatedRevenue: "$300K - $500K",
        timeline: "6 months",
        confidence: 87,
      },
    ],
  },
  {
    id: "diy-home-improvement",
    title: "DIY Home Improvement",
    description: "Frequent activity, ripe for tactical offers.",
    customers: 7230,
    revenueRange: "$105K - $194K",
    monthlyRevenue: "$980K",
    confidence: 87,
    category: "home-improvement",
    insights: [
      "Weekend spending spikes by 65%",
      "Strong seasonal patterns (spring/summer)",
      "High engagement with video content and tutorials",
      "Cross-category opportunities with tools and materials",
    ],
    recommendations: [
      {
        type: "tactical",
        title: "Weekend DIY Bonus Points",
        description:
          "Offer bonus points on weekend purchases at home improvement stores",
        estimatedRevenue: "$80K - $120K",
        timeline: "2 months",
        confidence: 89,
      },
    ],
  },
  {
    id: "back-to-school",
    title: "Back to School",
    description: "Seasonal peak, strong engagement for family segments.",
    customers: 5120,
    revenueRange: "$130K - $257K",
    monthlyRevenue: "$750K",
    confidence: 92,
    category: "education",
    insights: [
      "Spending peaks 2 weeks before school starts",
      "Family segments show 3x higher engagement",
      "Strong correlation with technology and clothing purchases",
      "Opportunity for family-focused rewards",
    ],
    recommendations: [
      {
        type: "tactical",
        title: "Family Back-to-School Rewards",
        description: "Targeted family rewards for education-related purchases",
        estimatedRevenue: "$200K - $300K",
        timeline: "2 months",
        confidence: 94,
      },
    ],
  },
  {
    id: "low-food-beverage",
    title: "Low Food & Beverage Consumers",
    description: "Untapped opportunity for category expansion.",
    customers: 12450,
    revenueRange: "$85K - $125K",
    monthlyRevenue: "$650K",
    confidence: 88,
    category: "food-beverage",
    insights: [
      "Currently spend <10% on food & beverage",
      "High engagement with premium dining experiences",
      "Strong response to limited-time offers",
      "Opportunity for category trial incentives",
    ],
    recommendations: [
      {
        type: "tactical",
        title: "2X Points Food & Beverage Trial",
        description:
          "Target low F&B consumers with 2X points offers to drive category trial",
        estimatedRevenue: "$100K - $150K",
        timeline: "3 months",
        confidence: 91,
      },
      {
        type: "strategic",
        title: "Premium Dining Partnership",
        description:
          "Partner with premium restaurants for exclusive member experiences",
        estimatedRevenue: "$250K - $400K",
        timeline: "4 months",
        confidence: 85,
      },
    ],
  },
];

const BEHAVIORAL_INSIGHTS = [
  {
    segment: "High-Value Millennials",
    size: 15420,
    behavior: "Mobile-first, values experiences over products",
    opportunity: "Travel and entertainment rewards program",
    estimatedValue: "$300K - $450K",
  },
  {
    segment: "Suburban Families",
    size: 22100,
    behavior: "Bulk purchases, seasonal spending patterns",
    opportunity: "Family rewards and bulk purchase bonuses",
    estimatedValue: "$200K - $350K",
  },
  {
    segment: "Urban Professionals",
    size: 18750,
    behavior: "Convenience-focused, premium preferences",
    opportunity: "Premium services and convenience rewards",
    estimatedValue: "$400K - $600K",
  },
];

export function useMarketingInsightsCopilot() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.ui.currentPage);

  // Provide marketing insights context to AI
  useCopilotReadable({
    description:
      "Marketing insights, customer journey opportunities, and behavioral analysis data",
    value: {
      currentPage,
      journeyOpportunities: JOURNEY_OPPORTUNITIES,
      behavioralInsights: BEHAVIORAL_INSIGHTS,
      totalCustomers: JOURNEY_OPPORTUNITIES.reduce(
        (sum, journey) => sum + journey.customers,
        0
      ),
      totalMonthlyRevenue: JOURNEY_OPPORTUNITIES.reduce((sum, journey) => {
        const revenue = parseFloat(
          journey.monthlyRevenue.replace(/[$K,M]/g, "")
        );
        return (
          sum +
          (journey.monthlyRevenue.includes("M") ? revenue * 1000 : revenue)
        );
      }, 0),
      availableCategories: [
        "home-improvement",
        "education",
        "food-beverage",
        "travel",
        "technology",
      ],
      isOnInsightsPage: currentPage.includes("ai-insights"),
    },
  });

  // 🧠 ANALYZE CUSTOMER JOURNEY OPPORTUNITIES
  useCopilotAction({
    name: "analyzeJourneyOpportunity",
    description:
      "Analyze a specific customer journey opportunity and provide detailed insights and recommendations",
    parameters: [
      {
        name: "journeyId",
        type: "string",
        description:
          "ID of the journey to analyze (e.g., 'home-relocation', 'diy-home-improvement', 'back-to-school', 'low-food-beverage')",
        required: true,
      },
      {
        name: "analysisType",
        type: "string",
        description:
          "Type of analysis: 'insights', 'recommendations', 'revenue-projection', 'full'",
        required: false,
      },
    ],
    handler: async ({ journeyId, analysisType = "full" }) => {
      const journey = JOURNEY_OPPORTUNITIES.find((j) => j.id === journeyId);

      if (!journey) {
        return `❌ Journey opportunity "${journeyId}" not found. Available journeys: ${JOURNEY_OPPORTUNITIES.map((j) => j.id).join(", ")}`;
      }

      let analysis = `🎯 **${journey.title} Analysis**\n\n`;
      analysis += `📊 **Overview:**\n`;
      analysis += `• ${journey.customers.toLocaleString()} customers identified\n`;
      analysis += `• Revenue range: ${journey.revenueRange}\n`;
      analysis += `• Monthly revenue: ${journey.monthlyRevenue}\n`;
      analysis += `• AI confidence: ${journey.confidence}%\n\n`;

      if (analysisType === "insights" || analysisType === "full") {
        analysis += `💡 **Key Insights:**\n`;
        journey.insights.forEach((insight) => {
          analysis += `• ${insight}\n`;
        });
        analysis += `\n`;
      }

      if (analysisType === "recommendations" || analysisType === "full") {
        analysis += `🚀 **Recommendations:**\n\n`;
        journey.recommendations.forEach((rec, index) => {
          analysis += `**${index + 1}. ${rec.title}** (${rec.type.toUpperCase()})\n`;
          analysis += `${rec.description}\n`;
          analysis += `• Estimated revenue: ${rec.estimatedRevenue}\n`;
          analysis += `• Timeline: ${rec.timeline}\n`;
          analysis += `• Confidence: ${rec.confidence}%\n\n`;
        });
      }

      if (analysisType === "revenue-projection" || analysisType === "full") {
        const totalEstimated = journey.recommendations.reduce((sum, rec) => {
          const min = parseFloat(
            rec.estimatedRevenue.split(" - ")[0].replace(/[$K]/g, "")
          );
          const max = parseFloat(
            rec.estimatedRevenue.split(" - ")[1].replace(/[$K]/g, "")
          );
          return sum + (min + max) / 2;
        }, 0);

        analysis += `💰 **Revenue Projection:**\n`;
        analysis += `• Combined opportunity: ~$${Math.round(totalEstimated)}K\n`;
        analysis += `• ROI potential: 300-500%\n`;
        analysis += `• Payback period: 2-4 months\n\n`;
      }

      analysis += `Would you like me to create a campaign strategy for any of these recommendations?`;

      return analysis;
    },
  });

  // 🎯 GENERATE CAMPAIGN STRATEGY
  useCopilotAction({
    name: "generateCampaignStrategy",
    description:
      "Generate a detailed campaign strategy and plan brief based on a journey opportunity",
    parameters: [
      {
        name: "journeyId",
        type: "string",
        description: "ID of the journey opportunity",
        required: true,
      },
      {
        name: "recommendationIndex",
        type: "number",
        description:
          "Index of the recommendation to create strategy for (0-based)",
        required: false,
      },
      {
        name: "customObjective",
        type: "string",
        description:
          "Custom campaign objective if different from recommendation",
        required: false,
      },
    ],
    handler: async ({
      journeyId,
      recommendationIndex = 0,
      customObjective,
    }) => {
      const journey = JOURNEY_OPPORTUNITIES.find((j) => j.id === journeyId);

      if (!journey) {
        return `❌ Journey "${journeyId}" not found.`;
      }

      const recommendation = journey.recommendations[recommendationIndex];
      if (!recommendation) {
        return `❌ Recommendation index ${recommendationIndex} not found for journey "${journeyId}".`;
      }

      const strategy = `📋 **Campaign Strategy Brief**\n\n`;

      let content = strategy;
      content += `🎯 **Campaign:** ${recommendation.title}\n`;
      content += `📈 **Objective:** ${customObjective || recommendation.description}\n\n`;

      content += `👥 **Target Audience:**\n`;
      content += `• Primary: ${journey.customers.toLocaleString()} customers in ${journey.title.toLowerCase()} segment\n`;
      content += `• Behavioral profile: ${journey.description}\n`;
      content += `• Confidence level: ${journey.confidence}%\n\n`;

      content += `💰 **Financial Projections:**\n`;
      content += `• Estimated revenue: ${recommendation.estimatedRevenue}\n`;
      content += `• Current monthly revenue: ${journey.monthlyRevenue}\n`;
      content += `• Expected lift: 15-25%\n`;
      content += `• Timeline: ${recommendation.timeline}\n\n`;

      content += `🚀 **Campaign Mechanics:**\n`;
      if (recommendation.title.includes("2X Points")) {
        content += `• Offer: 2X points on qualifying purchases\n`;
        content += `• Duration: 90 days with potential extension\n`;
        content += `• Channels: Email, push notifications, in-app messaging\n`;
        content += `• Personalization: Category-specific targeting\n\n`;
      } else if (recommendation.title.includes("Partnership")) {
        content += `• Strategy: Strategic merchant partnerships\n`;
        content += `• Offer: Exclusive member benefits and experiences\n`;
        content += `• Duration: 6-month pilot program\n`;
        content += `• Channels: Email, direct mail, partner locations\n\n`;
      } else {
        content += `• Offer: Targeted rewards and incentives\n`;
        content += `• Duration: ${recommendation.timeline}\n`;
        content += `• Channels: Multi-channel approach\n`;
        content += `• Personalization: Behavioral targeting\n\n`;
      }

      content += `📊 **Success Metrics:**\n`;
      content += `• Participation rate: Target 15-20%\n`;
      content += `• Revenue per participant: $${Math.round((parseFloat(recommendation.estimatedRevenue.split(" - ")[0].replace(/[$K]/g, "")) * 1000) / (journey.customers * 0.175))}\n`;
      content += `• Customer lifetime value lift: 20-30%\n`;
      content += `• Category penetration increase: 25-40%\n\n`;

      content += `⚡ **Next Steps:**\n`;
      content += `1. Finalize audience segmentation and targeting criteria\n`;
      content += `2. Develop creative assets and messaging\n`;
      content += `3. Set up campaign tracking and measurement\n`;
      content += `4. Launch pilot with 25% of target audience\n`;
      content += `5. Monitor performance and optimize\n\n`;

      content += `Would you like me to:\n`;
      content += `• Navigate to campaign creation to build this campaign?\n`;
      content += `• Generate specific audience targeting criteria?\n`;
      content += `• Create approval workflow for budget allocation?\n`;
      content += `• Analyze competitive landscape for this opportunity?`;

      return content;
    },
  });

  // 🔍 BEHAVIORAL ANALYSIS
  useCopilotAction({
    name: "analyzeBehavioralSegments",
    description:
      "Analyze customer behavioral segments and identify opportunities",
    parameters: [
      {
        name: "segmentType",
        type: "string",
        description:
          "Type of segment analysis: 'all', 'high-value', 'growth-potential', 'at-risk'",
        required: false,
      },
    ],
    handler: async ({ segmentType = "all" }) => {
      let analysis = `🧠 **Behavioral Segment Analysis**\n\n`;

      if (segmentType === "all" || segmentType === "high-value") {
        const highValueSegments = BEHAVIORAL_INSIGHTS.filter(
          (s) =>
            parseFloat(s.estimatedValue.split(" - ")[1].replace(/[$K]/g, "")) >
            400
        );

        analysis += `💎 **High-Value Segments:**\n`;
        highValueSegments.forEach((segment) => {
          analysis += `• **${segment.segment}** (${segment.size.toLocaleString()} customers)\n`;
          analysis += `  Behavior: ${segment.behavior}\n`;
          analysis += `  Opportunity: ${segment.opportunity}\n`;
          analysis += `  Value: ${segment.estimatedValue}\n\n`;
        });
      }

      if (segmentType === "all" || segmentType === "growth-potential") {
        analysis += `📈 **Growth Opportunities:**\n`;
        analysis += `• **Category Expansion:** Target low F&B consumers with trial incentives\n`;
        analysis += `• **Frequency Increase:** Weekend bonus programs for DIY enthusiasts\n`;
        analysis += `• **Premium Upsell:** Exclusive experiences for high-value millennials\n\n`;
      }

      analysis += `🎯 **Recommended Actions:**\n`;
      analysis += `1. **Immediate (0-30 days):** Launch 2X points F&B trial campaign\n`;
      analysis += `2. **Short-term (1-3 months):** Develop premium dining partnerships\n`;
      analysis += `3. **Medium-term (3-6 months):** Create family rewards program\n`;
      analysis += `4. **Long-term (6+ months):** Build comprehensive lifestyle rewards ecosystem\n\n`;

      analysis += `💡 **Key Insights:**\n`;
      analysis += `• Cross-category opportunities represent 40% of untapped revenue\n`;
      analysis += `• Behavioral targeting increases campaign effectiveness by 65%\n`;
      analysis += `• Premium segments show 3x higher lifetime value\n`;
      analysis += `• Seasonal patterns drive 25% of incremental spending\n\n`;

      analysis += `Would you like me to dive deeper into any specific segment or create a campaign for one of these opportunities?`;

      return analysis;
    },
  });

  // 📊 NAVIGATE TO INSIGHTS DASHBOARD
  useCopilotAction({
    name: "openMarketingInsights",
    description: "Navigate to the AI Marketing Insights dashboard",
    parameters: [
      {
        name: "focusArea",
        type: "string",
        description:
          "Specific area to focus on: 'overview', 'journey-opportunities', 'charts', 'discovery'",
        required: false,
      },
    ],
    handler: async ({ focusArea = "overview" }) => {
      router.push("/campaign-manager/ai-insights");

      dispatch(
        addNotification({
          id: Date.now().toString(),
          type: "success",
          title: "AI Marketing Insights",
          message: `Navigated to insights dashboard${focusArea !== "overview" ? ` - ${focusArea} section` : ""}`,
          duration: 3000,
        })
      );

      return `✅ Navigated to AI Marketing Insights dashboard. 

The dashboard shows:
• 8,897 active customer journeys
• $425K monthly revenue from identified opportunities  
• 88% AI confidence in recommendations
• 890% ROI projection potential

${focusArea === "journey-opportunities" ? "Focusing on journey opportunities section with 4 high-value patterns discovered." : ""}
${focusArea === "charts" ? "Showing analytics charts with journey timeline, revenue trends, and engagement phases." : ""}
${focusArea === "discovery" ? "Displaying journey discovery dashboard with detailed customer behavior analysis." : ""}

What would you like to explore first?`;
    },
  });

  // 💬 NATURAL LANGUAGE INSIGHTS QUERY
  useCopilotAction({
    name: "queryMarketingInsights",
    description:
      "Answer natural language questions about marketing insights, customer behavior, and opportunities",
    parameters: [
      {
        name: "question",
        type: "string",
        description:
          "Natural language question about marketing insights, customer behavior, revenue opportunities, etc.",
        required: true,
      },
    ],
    handler: async ({ question }) => {
      const lowerQuestion = question.toLowerCase();

      // Revenue-related queries
      if (
        lowerQuestion.includes("revenue") ||
        lowerQuestion.includes("money") ||
        lowerQuestion.includes("profit")
      ) {
        const totalRevenue = JOURNEY_OPPORTUNITIES.reduce((sum, journey) => {
          const revenue = parseFloat(
            journey.monthlyRevenue.replace(/[$K,M]/g, "")
          );
          return (
            sum +
            (journey.monthlyRevenue.includes("M") ? revenue * 1000 : revenue)
          );
        }, 0);

        return `💰 **Revenue Insights:**

Current identified opportunities generate **$${Math.round(totalRevenue)}K monthly revenue** across ${JOURNEY_OPPORTUNITIES.length} customer journeys.

**Top Revenue Opportunities:**
• Home Purchase + Relocation: $1.1M monthly (${JOURNEY_OPPORTUNITIES[0].customers.toLocaleString()} customers)
• DIY Home Improvement: $980K monthly (${JOURNEY_OPPORTUNITIES[1].customers.toLocaleString()} customers)  
• Back to School: $750K monthly (${JOURNEY_OPPORTUNITIES[2].customers.toLocaleString()} customers)

**Projected Incremental Revenue:**
• 2X Points F&B Campaign: $100K-$150K (3 months)
• Home Journey Partnership: $300K-$500K (6 months)
• Premium Dining Program: $250K-$400K (4 months)

**Total Opportunity:** $650K-$1.05M in incremental revenue over 6 months.

Would you like me to create a campaign strategy for the highest-value opportunity?`;
      }

      // Customer behavior queries
      if (
        lowerQuestion.includes("customer") ||
        lowerQuestion.includes("behavior") ||
        lowerQuestion.includes("segment")
      ) {
        return `👥 **Customer Behavior Insights:**

**Key Behavioral Patterns:**
• **Home Buyers:** 40% higher spend in first 6 months, peak activity March-May
• **DIY Enthusiasts:** 65% weekend spending spike, strong seasonal patterns
• **Families:** 3x higher engagement during back-to-school season
• **Low F&B Users:** <10% category spend, high premium dining engagement

**Segment Opportunities:**
• **High-Value Millennials:** 15,420 customers, mobile-first, experience-focused
• **Suburban Families:** 22,100 customers, bulk purchases, seasonal patterns  
• **Urban Professionals:** 18,750 customers, convenience-focused, premium preferences

**Behavioral Triggers:**
• Life events (home purchase, school start) drive 45% of incremental spend
• Seasonal patterns account for 25% of revenue variance
• Weekend behavior differs significantly from weekday (65% spike for DIY)

What specific customer segment would you like to explore further?`;
      }

      // Campaign/strategy queries
      if (
        lowerQuestion.includes("campaign") ||
        lowerQuestion.includes("strategy") ||
        lowerQuestion.includes("recommend")
      ) {
        return `🚀 **Campaign Strategy Recommendations:**

**Immediate Opportunities (High Confidence):**
1. **2X Points Food & Beverage Trial** - Target 12,450 low F&B consumers
   • Estimated revenue: $100K-$150K over 3 months
   • 91% confidence, quick implementation

2. **Weekend DIY Bonus Points** - Target 7,230 DIY enthusiasts  
   • Estimated revenue: $80K-$120K over 2 months
   • 89% confidence, seasonal timing critical

**Strategic Initiatives (Medium-term):**
3. **Home Journey Partnership Program** - Real estate/mortgage partnerships
   • Estimated revenue: $300K-$500K over 6 months
   • 87% confidence, requires partner development

4. **Family Back-to-School Rewards** - Seasonal family targeting
   • Estimated revenue: $200K-$300K over 2 months  
   • 94% confidence, timing-sensitive (July-August)

**Next Steps:**
• Which campaign interests you most?
• Should I create a detailed strategy brief?
• Would you like me to start the campaign creation process?`;
      }

      // General/other queries
      return `🤔 I can help you with marketing insights in several areas:

**📊 Analytics & Data:**
• Customer journey opportunities and behavioral patterns
• Revenue projections and ROI analysis  
• Segment performance and growth potential

**🎯 Campaign Strategy:**
• Tactical campaign recommendations
• Strategic partnership opportunities
• Audience targeting and personalization

**💡 Business Insights:**
• Cross-category expansion opportunities
• Seasonal and behavioral triggers
• Competitive positioning and market gaps

Try asking me about:
• "What are our biggest revenue opportunities?"
• "Which customer segments should we target?"
• "What campaigns should we launch next?"
• "How can we increase customer lifetime value?"

What specific area would you like to explore?`;
    },
  });
}
