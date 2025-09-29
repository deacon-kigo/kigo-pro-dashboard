"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Brain,
  Zap,
  Home,
  ShoppingBag,
  GraduationCap,
  Coffee,
  Calendar,
  Sparkles,
  X,
  ArrowRight,
  Lightbulb,
  Gift,
} from "lucide-react";

// Import chart components
import JourneyDiscoveryDashboard from "./components/JourneyDiscoveryDashboard";
import RevenueProjectionCharts from "./components/RevenueProjectionCharts";
import CustomerBehaviorAnalytics from "./components/CustomerBehaviorAnalytics";

// Import demo components
import { ABCFIDemoTrigger } from "../demo/ABCFIDemoTrigger";
import { JourneyOpportunityCards } from "../demo/JourneyOpportunityCards";
import { CampaignPlanView } from "../demo/CampaignPlanView";
import { ROIModelView } from "../demo/ROIModelView";
import { MobileExperienceView } from "../demo/MobileExperienceView";

// AI Insight Notification - Proactive suggestion for Q4 opportunity
interface AIInsightNotificationProps {
  onDismiss: () => void;
}

const AIInsightNotification = ({ onDismiss }: AIInsightNotificationProps) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExploreOpportunity = () => {
    // Navigate to AI command center with auto-prompt
    router.push(
      "/campaign-manager/ai-command-center?prompt=new-mover-journey&client=abc-fi"
    );
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in-right">
      <Card
        className="border-purple-200 shadow-lg"
        style={{
          background: "linear-gradient(to bottom right, #faf5ff, #eff6ff)",
        }}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  AI Insight
                </h3>
                <Badge className="bg-purple-100 text-purple-700 text-xs">
                  Q4 Opportunity
                </Badge>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                <strong>Tucker</strong>, I've identified a high-impact Q4
                opportunity in your Home Purchase journey data.
              </p>
            </div>

            {!isExpanded ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  The <strong>567 new mortgage customers/month</strong> segment
                  shows strong potential for an AI-powered moving journey.
                </p>
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                >
                  Show campaign details →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 space-y-2 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Campaign Opportunity
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-bold text-blue-900">567</div>
                      <div className="text-blue-600">customers/month</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-bold text-green-900">
                        $127K-$245K
                      </div>
                      <div className="text-green-600">revenue potential</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">
                      AI-Powered New Mover Journey
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Start with personalized $100 gifts, then guide customers
                    through curated moving offers from U-Haul, Public Storage,
                    and Hilton.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleExploreOpportunity}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm"
              >
                <ArrowRight className="w-3 h-3 mr-1" />
                Create Campaign
              </Button>
              <Button
                onClick={onDismiss}
                variant="outline"
                className="text-xs px-3"
              >
                Later
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default function MarketingInsightsView() {
  const [selectedJourney, setSelectedJourney] = useState<string | null>(null);
  const [showAIInsight, setShowAIInsight] = useState(false);

  // Demo state management
  const [demoView, setDemoView] = useState<
    | "dashboard"
    | "opportunities"
    | "campaign"
    | "roi-model"
    | "mobile-experience"
  >("dashboard");
  const [demoData, setDemoData] = useState<any>(null);

  // Demo transition handler
  const handleDashboardTransition = (step: string, data?: any) => {
    switch (step) {
      case "show-opportunities":
        setDemoView("opportunities");
        setDemoData(data);
        break;
      case "show-campaign":
        setDemoView("campaign");
        setDemoData(data);
        break;
      case "show-campaign-plan":
        setDemoView("campaign");
        setDemoData(data);
        break;
      case "show-roi-model":
        setDemoView("roi-model");
        setDemoData(data);
        break;
      case "show-mobile-experience":
        setDemoView("mobile-experience");
        setDemoData(data);
        break;
      case "reset":
        setDemoView("dashboard");
        setDemoData(null);
        break;
      default:
        break;
    }
  };

  // Show AI insight when user selects the home-purchase journey
  const handleJourneySelection = (journeyId: string) => {
    setSelectedJourney(journeyId);

    // Show AI insight when home-purchase journey is selected
    if (journeyId === "home-purchase") {
      setShowAIInsight(true);
    }
  };

  // Mock data for journey opportunities
  const journeyOpportunities = [
    {
      id: "home-purchase",
      title: "Home Purchase + Relocation",
      icon: <Home className="w-5 h-5" />,
      customers: 567,
      revenueRange: "$127-245",
      monthlyRevenue: "$72K-139K",
      confidence: 94,
      color: "bg-blue-500",
      description:
        "Cross-state family relocations with high-value spending patterns",
    },
    {
      id: "back-to-school",
      title: "Back to School",
      icon: <GraduationCap className="w-5 h-5" />,
      customers: 2890,
      revenueRange: "$45-89",
      monthlyRevenue: "$130K-257K",
      confidence: 92,
      color: "bg-green-500",
      description:
        "Family preparation for new school year with seasonal spending",
    },
    {
      id: "weekend-entertainment",
      title: "Weekend Entertainment",
      icon: <Coffee className="w-5 h-5" />,
      customers: 4200,
      revenueRange: "$28-52",
      monthlyRevenue: "$118K-218K",
      confidence: 78,
      color: "bg-purple-500",
      description: "Regular leisure and dining patterns with loyalty potential",
    },
    {
      id: "home-improvement",
      title: "DIY Home Improvement",
      icon: <ShoppingBag className="w-5 h-5" />,
      customers: 1240,
      revenueRange: "$85-156",
      monthlyRevenue: "$105K-194K",
      confidence: 87,
      color: "bg-orange-500",
      description: "Seasonal home projects with predictable purchase cycles",
    },
  ];

  return (
    <>
      <style jsx>{`
        .tabs-trigger-active[data-state="active"] {
          background: #2563eb !important;
          color: white !important;
          border: 2px solid #2563eb !important;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3) !important;
          transform: translateY(-1px) !important;
        }
        .tabs-trigger-active[data-state="inactive"] {
          background: #f8fafc !important;
          color: #64748b !important;
          border: 1px solid #e2e8f0 !important;
        }
      `}</style>

      {/* Proactive AI Insight - appears while Tucker analyzes insights */}
      {showAIInsight && (
        <AIInsightNotification onDismiss={() => setShowAIInsight(false)} />
      )}

      <div className="space-y-4">
        {/* Minimalistic Header */}
        <div className="relative overflow-hidden rounded-lg border border-gray-200 p-6 bg-white shadow-sm">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white border border-gray-200 p-2">
                <img
                  src="/logos/abc-fi-logo.png"
                  alt="ABC FI Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  ABC FI Rewards Growth Advisor
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Customer engagement and loyalty dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 border border-green-200 text-green-700 px-3 py-1 text-sm font-medium">
                <Zap className="w-4 h-4 mr-2 text-green-700" />
                AI Active
              </Badge>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-4 py-2 text-sm font-medium shadow-sm">
                <Target className="w-4 h-4 mr-2 text-white" />
                Generate Campaign
              </Button>
            </div>
          </div>
        </div>

        {/* Compact Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Active Cardholders
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">1.2M</p>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2 bg-green-500" />
                    <p className="text-sm font-medium text-green-600">
                      +8% MoM
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 border border-gray-200">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Total Card Spend
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">$1.2B</p>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2 bg-green-500" />
                    <p className="text-sm font-medium text-green-600">
                      +4.7% MoM
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-100 border border-gray-200">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Total Redemptions
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">8.4M</p>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2 bg-green-500" />
                    <p className="text-sm font-medium text-green-600">
                      +12% MoM
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-100 border border-gray-200">
                  <Gift className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Incremental Value Generated
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">$4.2M</p>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2 bg-green-500" />
                    <p className="text-sm font-medium text-green-600">
                      +18% MoM
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100 border border-gray-200">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Full Width Analytics Dashboard */}
        <div className="w-full">
          {/* Full Width Analytics Dashboard */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <Tabs defaultValue="discovery" className="w-full">
              <div className="border-b border-gray-200 bg-gray-50">
                <TabsList className="grid w-full grid-cols-4 bg-transparent h-auto p-2 gap-1">
                  <TabsTrigger
                    value="overview"
                    className="tabs-trigger-active rounded-lg py-3 px-4 font-medium text-sm transition-all duration-200 text-gray-600 hover:text-gray-800 bg-white border border-gray-200"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="discovery"
                    className="tabs-trigger-active rounded-lg py-3 px-4 font-medium text-sm transition-all duration-200 text-gray-600 hover:text-gray-800 bg-white border border-gray-200"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Discovery
                  </TabsTrigger>
                  <TabsTrigger
                    value="revenue"
                    className="tabs-trigger-active rounded-lg py-3 px-4 font-medium text-sm transition-all duration-200 text-gray-600 hover:text-gray-800 bg-white border border-gray-200"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Revenue
                  </TabsTrigger>
                  <TabsTrigger
                    value="behavior"
                    className="tabs-trigger-active rounded-lg py-3 px-4 font-medium text-sm transition-all duration-200 text-gray-600 hover:text-gray-800 bg-white border border-gray-200"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Behavior
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-4">
                <TabsContent value="overview" className="mt-0">
                  <div className="grid grid-cols-3 gap-4">
                    {/* Program Performance Chart */}
                    <Card className="bg-white border border-gray-200 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          Program Performance Trailing 90 Days
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="h-24 flex items-end justify-between gap-1">
                          {[45, 67, 89, 123, 156, 134, 178, 145].map(
                            (value, index) => (
                              <div
                                key={index}
                                className="bg-blue-200 rounded-t-sm flex-1"
                                style={{
                                  height: `${(value / 178) * 100}%`,
                                  minHeight: "4px",
                                }}
                              />
                            )
                          )}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>W1</span>
                          <span>W8</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Revenue Projection */}
                    <Card className="bg-white border border-gray-200 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          Revenue Trend
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="h-24 flex items-end justify-between gap-1">
                          {[120, 135, 128, 145, 160, 155, 170, 185].map(
                            (value, index) => (
                              <div
                                key={index}
                                className="bg-green-200 rounded-t-sm flex-1"
                                style={{
                                  height: `${(value / 185) * 100}%`,
                                  minHeight: "4px",
                                }}
                              />
                            )
                          )}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>$120K</span>
                          <span>$185K</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Top performing offer categories */}
                    <Card className="bg-white border border-gray-200 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          Top performing offer categories
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {[
                            {
                              category: "Dining & Restaurants",
                              value: "$1.1M",
                              color: "bg-blue-200",
                            },
                            {
                              category: "Home & Garden",
                              value: "$850K",
                              color: "bg-green-200",
                            },
                            {
                              category: "Travel & Experiences",
                              value: "$670K",
                              color: "bg-purple-200",
                            },
                            {
                              category: "Health & Wellness",
                              value: "$550K",
                              color: "bg-yellow-200",
                            },
                            {
                              category: "Apparel & Accessories",
                              value: "$480K",
                              color: "bg-red-200",
                            },
                          ].map((item) => (
                            <div
                              key={item.category}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${item.color}`}
                                />
                                <span className="text-xs text-gray-600">
                                  {item.category}
                                </span>
                              </div>
                              <span className="text-xs font-medium text-gray-700">
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Audience Spotlight */}
                    <Card className="bg-white border border-gray-200 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-600" />
                          Audience Spotlight
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {[
                            {
                              audience: "High Earners",
                              description: "Premium segment",
                              color: "bg-blue-200",
                            },
                            {
                              audience: "New Movers",
                              description: "Relocation journey",
                              color: "bg-green-200",
                            },
                            {
                              audience: "Families w/ Kids",
                              description: "Family-focused",
                              color: "bg-purple-200",
                            },
                          ].map((item) => (
                            <div
                              key={item.audience}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${item.color}`}
                                />
                                <span className="text-xs text-gray-600">
                                  {item.audience}
                                </span>
                              </div>
                              <span className="text-xs font-medium text-gray-500">
                                {item.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Key Metrics */}
                    <Card className="bg-white border border-gray-200 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          Key Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-900">
                              700K
                            </div>
                            <div className="text-xs text-blue-600">
                              Avg Weekly Redemptions
                            </div>
                            <div className="text-xs text-gray-500">
                              Trailing 90 Days
                            </div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-lg font-bold text-green-900">
                              94.2%
                            </div>
                            <div className="text-xs text-green-600">
                              Redemption Rate
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="discovery" className="mt-0">
                  <JourneyDiscoveryDashboard
                    selectedJourney={selectedJourney}
                  />
                </TabsContent>

                <TabsContent value="revenue" className="mt-0">
                  <RevenueProjectionCharts selectedJourney={selectedJourney} />
                </TabsContent>

                <TabsContent value="behavior" className="mt-0">
                  <CustomerBehaviorAnalytics
                    selectedJourney={selectedJourney}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Remove the overlay - cards will be inside chat now */}

      {demoView === "campaign" && (
        <div className="fixed inset-0 bg-white z-30">
          <CampaignPlanView isVisible={true} campaignData={demoData} />
        </div>
      )}

      {demoView === "roi-model" && (
        <div className="fixed inset-0 bg-white z-30">
          <ROIModelView isVisible={true} campaignData={demoData} />
        </div>
      )}

      {demoView === "mobile-experience" && (
        <div className="fixed inset-0 bg-white z-30">
          <MobileExperienceView isVisible={true} campaignData={demoData} />
        </div>
      )}

      {/* ABC FI Demo Trigger */}
      <ABCFIDemoTrigger onDashboardTransition={handleDashboardTransition} />
    </>
  );
}
