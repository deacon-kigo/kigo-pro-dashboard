"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoState, useDemoActions } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import ReactConfetti from "react-confetti";
import { buildDemoUrl } from "@/lib/utils";
import { CampaignCreationStepType } from "@/lib/redux/slices/demoSlice";

// Importing views statically to fix module not found errors
import BusinessIntelligenceView from "./views/BusinessIntelligenceView";
import CampaignSelectionGallery from "./views/CampaignSelectionGallery";
import AssetCreationWorkshop from "./views/AssetCreationWorkshop";
import PerformancePredictionDashboard from "./views/PerformancePredictionDashboard";
import LaunchControlCenter from "./views/LaunchControlCenter";

// Type Definitions
export interface BusinessData {
  salesByDay: { [key: string]: number };
  performanceTrend: Array<{
    week: string;
    sales: number;
    orders: number;
  }>;
  competitorActivity: Array<{
    month: string;
    ourPromos: number;
    competitorPromos: number;
  }>;
  customerSegments: Array<{
    segment: string;
    value: number;
  }>;
  insights: {
    salesByDay: string;
    performanceTrend: string;
    competitorActivity: string;
    customerSegments: string;
  };
  marketingOpportunities: Array<{
    title: string;
    description: string;
    impact: string;
    difficulty: string;
  }>;
}

export interface CampaignOption {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  primaryImage: string;
  estimatedReach: {
    min: number;
    max: number;
  };
  conversionRate: {
    min: number;
    max: number;
  };
  recommended: boolean;
}

export interface CampaignAsset {
  id: string;
  type: "primary" | "social" | "promotional";
  format: string;
  url: string;
  dimensions?: string;
  placeholder?: string;
}

export interface OfferDetails {
  title: string;
  description: string;
  discount: number;
  items: string[];
  terms: string;
  code: string;
  budget?: {
    total: number;
    dailyAverage?: number;
  };
}

export interface PerformancePredictions {
  views: {
    min: number;
    max: number;
  };
  viewsTrend: number;
  redemptions: {
    min: number;
    max: number;
  };
  redemptionsTrend: number;
  revenue: {
    min: number;
    max: number;
  };
  revenueTrend: number;
  costPerAcquisition: {
    min: number;
    max: number;
  };
  costTrend: number;
  revenueTimeline: Array<{
    date: string;
    withCampaign: number;
    withoutCampaign: number;
  }>;
  customerFlow: Array<{
    stage: string;
    count: number;
  }>;
  competitiveComparison: Array<{
    metric: string;
    value: number;
    benchmark: number;
  }>;
  suggestions: Array<{
    id: string;
    title: string;
    description: string;
    impact: number;
  }>;
}

// Update to use Redux type
type ViewType = CampaignCreationStepType;

interface DynamicCanvasProps {
  // initialView and onViewChange no longer needed with Redux
}

const DynamicCanvas: React.FC<DynamicCanvasProps> = () => {
  const { clientId, campaignCreationStep } = useDemoState();
  const { setCampaignCreationStep } = useDemoActions();
  const router = useRouter();
  const [selectedCampaign, setSelectedCampaign] =
    useState<CampaignOption | null>(null);
  const [campaignAssets, setCampaignAssets] = useState<CampaignAsset[]>([]);
  const [offerDetails, setOfferDetails] = useState<OfferDetails>({
    title: "",
    description: "",
    discount: 0,
    items: [],
    terms: "",
    code: "",
    budget: {
      total: 750,
      dailyAverage: 25,
    },
  });
  const [campaignParams, setCampaignParams] = useState({
    targeting: {
      audience: "Families within 5 miles",
      radius: 5,
      days: ["monday", "tuesday", "wednesday", "thursday"],
      timeRange: "4pm-8pm",
    },
    schedule: {
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
      endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000), // One month after start
      duration: 30,
    },
    offerDetails: {
      name: "Family Dinner Special",
      price: 29.99,
      items: ["Large Pizza", "Breadsticks", "2-Liter Soda"],
      discountPercentage: 20,
    },
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  // Step numbers for visual reference
  const viewSteps: { [key in ViewType]: number } = {
    "business-intelligence": 1,
    "campaign-selection": 2,
    "asset-creation": 3,
    "performance-prediction": 4,
    "launch-control": 5,
  };

  // Ordered list of steps for navigation
  const orderedSteps: ViewType[] = [
    "business-intelligence",
    "campaign-selection",
    "asset-creation",
    "performance-prediction",
    "launch-control",
  ];

  // Simple navigation functions
  const goToPreviousStep = useCallback(() => {
    const currentIndex = orderedSteps.indexOf(campaignCreationStep);
    if (currentIndex > 0) {
      setCampaignCreationStep(orderedSteps[currentIndex - 1]);
    }
  }, [campaignCreationStep, setCampaignCreationStep]);

  // Determine mock data based on client ID
  const mockBusinessData: BusinessData = useMemo(() => {
    if (clientId === "seven-eleven") {
      return {
        salesByDay: {
          Monday: 8200,
          Tuesday: 7950,
          Wednesday: 8100,
          Thursday: 8500,
          Friday: 12200,
          Saturday: 15800,
          Sunday: 11500,
        },
        performanceTrend: [
          { week: "Week 1", sales: 72500, orders: 5820 },
          { week: "Week 2", sales: 68400, orders: 5472 },
          { week: "Week 3", sales: 74300, orders: 5944 },
          { week: "Week 4", sales: 71900, orders: 5752 },
        ],
        competitorActivity: [
          { month: "Jan", ourPromos: 2, competitorPromos: 5 },
          { month: "Feb", ourPromos: 1, competitorPromos: 4 },
          { month: "Mar", ourPromos: 3, competitorPromos: 6 },
          { month: "Apr", ourPromos: 2, competitorPromos: 7 },
          { month: "May", ourPromos: 2, competitorPromos: 8 },
          { month: "Jun", ourPromos: 3, competitorPromos: 5 },
        ],
        customerSegments: [
          { segment: "Families", value: 35 },
          { segment: "Young Adults", value: 28 },
          { segment: "Seniors", value: 12 },
          { segment: "Business", value: 25 },
        ],
        insights: {
          salesByDay:
            "Weekday sales are significantly lower than weekend sales, with Tuesday showing the lowest performance",
          performanceTrend:
            "Overall sales are stable with weekly fluctuations of 5-8%",
          competitorActivity:
            "Competitor promotional activity has increased 35% in the last quarter",
          customerSegments:
            "Families and young adults are your primary customer segments",
        },
        marketingOpportunities: [
          {
            title: "Weekday Delivery Boost",
            description:
              "Create a weekday-only promotion to drive 7NOW delivery service usage during slower days",
            impact: "High",
            difficulty: "Medium",
          },
          {
            title: "Family Value Bundle",
            description:
              "Bundle popular family items with special pricing for the family segment",
            impact: "High",
            difficulty: "Low",
          },
          {
            title: "App-Exclusive Deals",
            description:
              "Drive app downloads with special deals only available through the 7-Eleven app",
            impact: "Medium",
            difficulty: "Low",
          },
        ],
      };
    } else {
      // Default Deacon's Pizza data
      return {
        salesByDay: {
          Monday: 1200,
          Tuesday: 1350,
          Wednesday: 1500,
          Thursday: 1800,
          Friday: 3200,
          Saturday: 3800,
          Sunday: 2500,
        },
        performanceTrend: [
          { week: "Week 1", sales: 15200, orders: 328 },
          { week: "Week 2", sales: 14700, orders: 312 },
          { week: "Week 3", sales: 16100, orders: 347 },
          { week: "Week 4", sales: 15800, orders: 335 },
        ],
        competitorActivity: [
          { month: "Jan", ourPromos: 1, competitorPromos: 3 },
          { month: "Feb", ourPromos: 1, competitorPromos: 2 },
          { month: "Mar", ourPromos: 2, competitorPromos: 4 },
          { month: "Apr", ourPromos: 1, competitorPromos: 3 },
          { month: "May", ourPromos: 1, competitorPromos: 4 },
          { month: "Jun", ourPromos: 2, competitorPromos: 3 },
        ],
        customerSegments: [
          { segment: "Families", value: 42 },
          { segment: "Young Adults", value: 23 },
          { segment: "Seniors", value: 15 },
          { segment: "Business", value: 20 },
        ],
        insights: {
          salesByDay:
            "Weekday sales are significantly lower than weekend sales, with Monday showing the lowest performance",
          performanceTrend:
            "Sales have been stable with a slight upward trend in the last month",
          competitorActivity:
            "Competitors run 2-3x more promotions than you do",
          customerSegments: "Families are your strongest customer segment",
        },
        marketingOpportunities: [
          {
            title: "Weekday Family Dinner Deal",
            description:
              "Create a family bundle promotion for weekday evenings to drive traffic during slower periods",
            impact: "High",
            difficulty: "Low",
          },
          {
            title: "Competitor Price Match",
            description:
              "Offer to match competitors' prices or coupons to retain price-sensitive customers",
            impact: "Medium",
            difficulty: "Medium",
          },
          {
            title: "Loyalty Program Enhancement",
            description:
              "Add new tiers or rewards to your loyalty program to increase repeat visits",
            impact: "High",
            difficulty: "High",
          },
        ],
      };
    }
  }, [clientId]);

  // Generate mock campaign options based on client ID
  const mockCampaignOptions: CampaignOption[] = useMemo(() => {
    if (clientId === "seven-eleven") {
      return [
        {
          id: "se-campaign-1",
          name: "7NOW Weekday Delivery Special",
          description:
            "Drive delivery orders during weekdays with special pricing and free delivery promotion",
          targetAudience: "Convenience shoppers within delivery radius",
          primaryImage: "/images/campaigns/seven-eleven/campaign1.jpg",
          estimatedReach: {
            min: 12000,
            max: 15000,
          },
          conversionRate: {
            min: 2.8,
            max: 3.5,
          },
          recommended: true,
        },
        {
          id: "se-campaign-2",
          name: "Family Bundle Meal Deal",
          description:
            "Complete meal bundles for families at special pricing with mix-and-match options",
          targetAudience: "Families looking for convenient meal solutions",
          primaryImage: "/images/campaigns/seven-eleven/campaign2.jpg",
          estimatedReach: {
            min: 8000,
            max: 10000,
          },
          conversionRate: {
            min: 4.2,
            max: 5.0,
          },
          recommended: false,
        },
        {
          id: "se-campaign-3",
          name: "App-Exclusive Rewards Program",
          description:
            "Special offers and points exclusively for mobile app users to drive app adoption",
          targetAudience: "Smartphone users who visit stores regularly",
          primaryImage: "/images/campaigns/seven-eleven/campaign3.jpg",
          estimatedReach: {
            min: 20000,
            max: 25000,
          },
          conversionRate: {
            min: 1.5,
            max: 2.2,
          },
          recommended: false,
        },
      ];
    } else {
      // Default Deacon's Pizza campaign options
      return [
        {
          id: "campaign-1",
          name: "Family Dinner Bundle",
          description:
            "Complete meal package for families at an attractive price point",
          targetAudience: "Families with children",
          primaryImage: "/images/campaigns/deacons/campaign1.jpg",
          estimatedReach: {
            min: 3500,
            max: 4500,
          },
          conversionRate: {
            min: 4.5,
            max: 5.8,
          },
          recommended: true,
        },
        {
          id: "campaign-2",
          name: "Weekday BOGO Pizza",
          description:
            "Buy one, get one free pizza deal valid Monday through Thursday",
          targetAudience: "Value-conscious customers",
          primaryImage: "/images/campaigns/deacons/campaign2.jpg",
          estimatedReach: {
            min: 5000,
            max: 6000,
          },
          conversionRate: {
            min: 3.2,
            max: 4.1,
          },
          recommended: false,
        },
        {
          id: "campaign-3",
          name: "Game Night Special",
          description:
            "Sports-themed package ideal for watching games with friends",
          targetAudience: "Sports fans and group gatherings",
          primaryImage: "/images/campaigns/deacons/campaign3.jpg",
          estimatedReach: {
            min: 2800,
            max: 3600,
          },
          conversionRate: {
            min: 3.8,
            max: 4.7,
          },
          recommended: false,
        },
      ];
    }
  }, [clientId]);

  // Initialize mock assets
  const mockCampaignAssets: CampaignAsset[] = useMemo(() => {
    const basePath =
      clientId === "seven-eleven"
        ? "/images/campaigns/seven-eleven/assets/"
        : "/images/campaigns/deacons/assets/";

    return [
      {
        id: "asset-1",
        type: "primary",
        format: "jpg",
        url: `${basePath}hero.jpg`,
        dimensions: "1200x800",
      },
      {
        id: "asset-2",
        type: "social",
        format: "jpg",
        url: `${basePath}social-instagram.jpg`,
        dimensions: "1080x1080",
      },
      {
        id: "asset-3",
        type: "social",
        format: "jpg",
        url: `${basePath}social-facebook.jpg`,
        dimensions: "1200x630",
      },
      {
        id: "asset-4",
        type: "promotional",
        format: "jpg",
        url: `${basePath}email.jpg`,
        dimensions: "600x800",
      },
      {
        id: "asset-5",
        type: "promotional",
        format: "jpg",
        url: `${basePath}store-signage.jpg`,
        dimensions: "800x1200",
      },
    ];
  }, [clientId]);

  // Initialize mock offer details
  const mockOfferDetails: OfferDetails = useMemo(() => {
    if (clientId === "seven-eleven") {
      return {
        title: "7NOW Weekday Delivery Special",
        description:
          "Get free delivery and special pricing on orders placed Monday through Thursday",
        discount: 30,
        items: [
          "Free Delivery",
          "Buy 2 Get 1 Free on Select Items",
          "7Rewards Points Bonus",
        ],
        terms:
          "Valid on orders $15+. Limited to delivery radius. May not be combined with other offers.",
        code: "7NOWDEAL",
        budget: {
          total: 12000,
          dailyAverage: 400,
        },
      };
    } else {
      return {
        title: "Family Dinner Bundle",
        description: "Complete meal for a family of four at a special price",
        discount: 25,
        items: [
          "Large 2-Topping Pizza",
          "Breadsticks",
          "2-Liter Soda",
          "Side Salad",
        ],
        terms:
          "Available Mon-Thu only. Not valid with other offers. Price may vary by location.",
        code: "FAMILY25",
        budget: {
          total: 5000,
          dailyAverage: 166,
        },
      };
    }
  }, [clientId]);

  // Initialize mock performance predictions
  const mockPerformancePredictions: PerformancePredictions = useMemo(() => {
    if (clientId === "seven-eleven") {
      return {
        views: {
          min: 12000,
          max: 15000,
        },
        viewsTrend: 8.4,
        redemptions: {
          min: 360,
          max: 480,
        },
        redemptionsTrend: 12.6,
        revenue: {
          min: 7200,
          max: 9600,
        },
        revenueTrend: 15.2,
        costPerAcquisition: {
          min: 2.1,
          max: 2.8,
        },
        costTrend: -4.5,
        revenueTimeline: Array(14)
          .fill(0)
          .map((_, i) => ({
            date: `Day ${i + 1}`,
            withCampaign: 600 + Math.floor(Math.random() * 300),
            withoutCampaign: 450 + Math.floor(Math.random() * 100),
          })),
        customerFlow: [
          { stage: "Views", count: 14000 },
          { stage: "Clicks", count: 3800 },
          { stage: "App Open", count: 1900 },
          { stage: "Add to Cart", count: 950 },
          { stage: "Purchase", count: 420 },
        ],
        competitiveComparison: [
          { metric: "Offer Appeal", value: 7.8, benchmark: 6.4 },
          { metric: "Value Perception", value: 8.2, benchmark: 7.1 },
          { metric: "Conversion Rate", value: 3.0, benchmark: 2.2 },
          { metric: "Customer Satisfaction", value: 8.5, benchmark: 7.3 },
        ],
        suggestions: [
          {
            id: "suggestion-1",
            title: "Extend to Thursday",
            description:
              "Include Thursday in the promotion to capture pre-weekend planning",
            impact: 18,
          },
          {
            id: "suggestion-2",
            title: "Add Push Notification",
            description:
              "Send targeted push notifications to users who order regularly",
            impact: 12,
          },
          {
            id: "suggestion-3",
            title: "Increase Radius",
            description:
              "Expand delivery radius by 1 mile for this promotion only",
            impact: 8,
          },
        ],
      };
    } else {
      return {
        views: {
          min: 3500,
          max: 4500,
        },
        viewsTrend: 12.5,
        redemptions: {
          min: 175,
          max: 225,
        },
        redemptionsTrend: 18.2,
        revenue: {
          min: 5250,
          max: 6750,
        },
        revenueTrend: 22.7,
        costPerAcquisition: {
          min: 2.8,
          max: 3.5,
        },
        costTrend: -8.3,
        revenueTimeline: Array(14)
          .fill(0)
          .map((_, i) => ({
            date: `Day ${i + 1}`,
            withCampaign: 450 + Math.floor(Math.random() * 200),
            withoutCampaign: 300 + Math.floor(Math.random() * 100),
          })),
        customerFlow: [
          { stage: "Views", count: 4000 },
          { stage: "Clicks", count: 1500 },
          { stage: "Menu Open", count: 800 },
          { stage: "Add to Cart", count: 400 },
          { stage: "Purchase", count: 200 },
        ],
        competitiveComparison: [
          { metric: "Offer Appeal", value: 8.2, benchmark: 6.8 },
          { metric: "Value Perception", value: 8.7, benchmark: 7.3 },
          { metric: "Conversion Rate", value: 5.0, benchmark: 3.8 },
          { metric: "Customer Satisfaction", value: 9.1, benchmark: 7.7 },
        ],
        suggestions: [
          {
            id: "suggestion-1",
            title: "Include Thursday",
            description: "Add Thursday to capture more weekday family dinners",
            impact: 18,
          },
          {
            id: "suggestion-2",
            title: "Add Dessert Upsell",
            description: "Offer a discounted dessert with the bundle",
            impact: 15,
          },
          {
            id: "suggestion-3",
            title: "Double Social Media Budget",
            description: "Increase social media promotion budget",
            impact: 12,
          },
        ],
      };
    }
  }, [clientId]);

  const goToNextStep = useCallback(() => {
    console.log(
      "Next step button clicked, current step:",
      campaignCreationStep
    );
    const currentIndex = orderedSteps.indexOf(campaignCreationStep);

    if (currentIndex < orderedSteps.length - 1) {
      // For the demo, we'll auto-populate any required data if missing
      const nextStep = orderedSteps[currentIndex + 1];

      // If we're moving to asset-creation and no campaign is selected, select the first one
      if (
        nextStep === "asset-creation" &&
        !selectedCampaign &&
        mockCampaignOptions.length > 0
      ) {
        setSelectedCampaign(mockCampaignOptions[0]);
        setCampaignAssets(mockCampaignAssets);
        setOfferDetails(mockOfferDetails);
      }

      // Always proceed to the next step regardless of state
      setCampaignCreationStep(nextStep);
    }
  }, [
    campaignCreationStep,
    selectedCampaign,
    mockCampaignOptions,
    mockCampaignAssets,
    mockOfferDetails,
    setCampaignCreationStep,
    setCampaignAssets,
    setOfferDetails,
  ]);

  // Window resize handler
  const handleResize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // Get window size for confetti
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, [handleResize]);

  // Handle campaign selection
  const handleCampaignSelect = useCallback(
    (campaign: CampaignOption) => {
      setSelectedCampaign(campaign);
      setCampaignAssets(mockCampaignAssets);
      setOfferDetails(mockOfferDetails);
      setCampaignCreationStep("asset-creation");
    },
    [mockCampaignAssets, mockOfferDetails, setCampaignCreationStep]
  );

  // Handle parameter updates for performance prediction
  const handleParamUpdate = useCallback(
    (key: string, value: string | number | boolean | string[]) => {
      const keyParts = key.split(".");

      if (keyParts.length === 2) {
        const [category, param] = keyParts;
        setCampaignParams((prev) => ({
          ...prev,
          [category]: {
            ...prev[category as keyof typeof prev],
            [param]: value,
          },
        }));
      }
    },
    []
  );

  // Handle launch with appropriate redirect
  const handleLaunch = useCallback(() => {
    console.log("Campaign launched!");

    // Show confetti
    setShowConfetti(true);

    // Wait a bit then redirect to dashboard with new campaign added
    setTimeout(() => {
      if (clientId === "seven-eleven") {
        router.push(`${buildDemoUrl("seven-eleven", "")}?from=campaign-launch`);
      } else {
        router.push(`${buildDemoUrl("deacons", "pizza")}?from=campaign-launch`);
      }
    }, 3000);
  }, [router, clientId]);

  // Initialize mock launch details
  const mockLaunchDetails = useMemo(() => {
    if (clientId === "seven-eleven") {
      return {
        name: "7NOW Weekday Delivery Special",
        targetAudience: "Convenience shoppers within delivery radius",
        geographicReach: "Delivery service radius",
        schedule: {
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000),
          activeDays: ["monday", "tuesday", "wednesday", "thursday"],
        },
        budget: {
          total: 12000,
          dailyAverage: 400,
        },
        assets: [
          {
            type: "Hero Banner",
            url: "/images/campaigns/seven-eleven/assets/hero.jpg",
            status: "ready" as "ready" | "pending" | "failed",
          },
          {
            type: "Social Media",
            url: "/images/campaigns/seven-eleven/assets/social-instagram.jpg",
            status: "ready" as "ready" | "pending" | "failed",
          },
          {
            type: "Email Template",
            url: "/images/campaigns/seven-eleven/assets/email.jpg",
            status: "ready" as "ready" | "pending" | "failed",
          },
          {
            type: "Store Signage",
            url: "/images/campaigns/seven-eleven/assets/store-signage.jpg",
            status: "ready" as "ready" | "pending" | "failed",
          },
          {
            type: "App Notification",
            url: "",
            status: "pending" as "ready" | "pending" | "failed",
          },
        ],
        metrics: {
          estimatedReach: { min: 12000, max: 15000 },
          predictedEngagement: { min: 3800, max: 4600 },
          estimatedRedemptions: { min: 360, max: 480 },
        },
      };
    } else {
      return {
        name: "Family Weekday Special",
        targetAudience: "Families within 5 miles",
        geographicReach: "5 mile radius from store",
        schedule: {
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000),
          activeDays: ["monday", "tuesday", "wednesday", "thursday"],
        },
        budget: {
          total: 750,
          dailyAverage: 25,
        },
        assets: [
          {
            type: "Banner Ad",
            url: "/images/campaigns/deacons/assets/hero.jpg",
            status: "ready" as "ready" | "pending" | "failed",
          },
          {
            type: "Facebook Post",
            url: "/images/campaigns/deacons/assets/social-facebook.jpg",
            status: "ready" as "ready" | "pending" | "failed",
          },
          {
            type: "Instagram Post",
            url: "/images/campaigns/deacons/assets/social-instagram.jpg",
            status: "ready" as "ready" | "pending" | "failed",
          },
          {
            type: "Email Template",
            url: "/images/campaigns/deacons/assets/email.jpg",
            status: "ready" as "ready" | "pending" | "failed",
          },
          {
            type: "SMS Message",
            url: "",
            status: "pending" as "ready" | "pending" | "failed",
          },
        ],
        metrics: {
          estimatedReach: { min: 3500, max: 5000 },
          predictedEngagement: { min: 700, max: 1000 },
          estimatedRedemptions: { min: 175, max: 250 },
        },
      };
    }
  }, [clientId]);

  // Function to get view title
  const getViewTitle = useCallback((view: ViewType): string => {
    switch (view) {
      case "business-intelligence":
        return "Business Intelligence";
      case "campaign-selection":
        return "Campaign Options";
      case "asset-creation":
        return "Creative Assets";
      case "performance-prediction":
        return "Performance Analysis";
      case "launch-control":
        return "Launch Control";
    }
  }, []);

  // Animation variants
  const viewVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="h-full flex flex-col">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
        />
      )}

      {/* Fixed header */}
      <CanvasHeader
        title={getViewTitle(campaignCreationStep)}
        currentStep={viewSteps[campaignCreationStep]}
        totalSteps={5}
        className="flex-shrink-0 sticky top-0 z-10 bg-white"
      />

      {/* Content container with fixed height between header and footer */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={campaignCreationStep}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={viewVariants}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {campaignCreationStep === "business-intelligence" && (
              <BusinessIntelligenceView data={mockBusinessData} />
            )}

            {campaignCreationStep === "campaign-selection" && (
              <CampaignSelectionGallery
                options={mockCampaignOptions}
                onSelect={handleCampaignSelect}
              />
            )}

            {campaignCreationStep === "asset-creation" && selectedCampaign && (
              <AssetCreationWorkshop
                assets={campaignAssets}
                offerDetails={offerDetails}
                onUpdateDetails={(updatedDetails: OfferDetails) =>
                  setOfferDetails(updatedDetails)
                }
                onRegenerate={(assetId: string) =>
                  console.log("Regenerate asset", assetId)
                }
              />
            )}

            {campaignCreationStep === "performance-prediction" && (
              <PerformancePredictionDashboard
                predictions={mockPerformancePredictions}
                campaignParams={campaignParams}
                onUpdateParams={handleParamUpdate}
              />
            )}

            {campaignCreationStep === "launch-control" && (
              <LaunchControlCenter
                campaignDetails={mockLaunchDetails}
                onLaunch={handleLaunch}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation footer */}
      <div className="p-4 flex justify-between border-t border-gray-200 bg-white flex-shrink-0 sticky bottom-0 left-0 right-0 z-10">
        <button
          onClick={goToPreviousStep}
          disabled={campaignCreationStep === "business-intelligence"}
          className={`px-4 py-2 rounded-lg ${
            campaignCreationStep === "business-intelligence"
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Previous Step
        </button>

        <button
          onClick={goToNextStep}
          disabled={campaignCreationStep === "launch-control"}
          className={`px-4 py-2 rounded-lg ${
            campaignCreationStep === "launch-control"
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

// Header component for the canvas
const CanvasHeader: React.FC<{
  title: string;
  currentStep: number;
  totalSteps: number;
  className?: string;
}> = ({ title, currentStep, totalSteps, className }) => {
  return (
    <div className={`px-6 py-3 border-b border-gray-200 ${className || ""}`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 ease-in-out"
          style={{
            width: `${(currentStep / totalSteps) * 100}%`,
            background: "linear-gradient(to right, #4460F0, #9F7AEA)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default DynamicCanvas;
