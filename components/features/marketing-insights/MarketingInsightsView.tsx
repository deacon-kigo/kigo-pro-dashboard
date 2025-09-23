"use client";

import React, { useState } from "react";
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
} from "lucide-react";

// Import chart components
import JourneyDiscoveryDashboard from "./components/JourneyDiscoveryDashboard";
import RevenueProjectionCharts from "./components/RevenueProjectionCharts";
import CustomerBehaviorAnalytics from "./components/CustomerBehaviorAnalytics";
import AICopilotDemo from "./components/AICopilotDemo";

export default function MarketingInsightsView() {
  const [selectedJourney, setSelectedJourney] = useState<string | null>(null);

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
          background: #4b55fd !important;
          color: white !important;
          border: 1px solid #4b55fd !important;
        }
      `}</style>
      <div className="space-y-4">
        {/* Minimalistic Header */}
        <div className="relative overflow-hidden rounded-lg border border-gray-200 p-6 bg-white shadow-sm">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-pastel-blue border border-gray-200">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  AI Marketing Insights
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  High-value customer journeys and campaign optimization
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-pastel-green border border-green-200 text-green-700 px-3 py-1 text-sm font-medium">
                <Zap className="w-4 h-4 mr-2" />
                AI Active
              </Badge>
              <Button className="bg-primary hover:bg-primary/90 text-white border-0 px-4 py-2 text-sm font-medium shadow-sm">
                <Target className="w-4 h-4 mr-2" />
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
                    Active Journeys
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">8,897</p>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2 bg-green-500" />
                    <p className="text-sm font-medium text-green-600">
                      +12% vs last month
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-pastel-blue border border-gray-200">
                  <Users className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Monthly Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">$425K</p>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2 bg-green-500" />
                    <p className="text-sm font-medium text-green-600">
                      +8% vs target
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-pastel-green border border-gray-200">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    AI Confidence
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">88%</p>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2 bg-purple-500" />
                    <p className="text-sm font-medium text-purple-600">
                      High accuracy
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-pastel-purple border border-gray-200">
                  <Brain className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    ROI Projection
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">890%</p>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2 bg-blue-500" />
                    <p className="text-sm font-medium text-blue-600">
                      LTV impact
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-pastel-blue border border-gray-200">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout: Journey Opportunities + Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Journey Opportunities - Minimalistic */}
          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-pastel-blue border border-gray-200">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Journey Opportunities
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      AI-discovered customer patterns
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-pastel-blue border border-gray-200 text-primary px-3 py-1 text-sm font-medium">
                  4 Patterns Found
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {journeyOpportunities.map((journey) => (
                  <Card
                    key={journey.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                      selectedJourney === journey.id
                        ? "border-primary bg-pastel-blue shadow-sm"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                    onClick={() => setSelectedJourney(journey.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 ${
                              journey.id === "home-relocation"
                                ? "bg-pastel-blue"
                                : journey.id === "diy-home-improvement"
                                  ? "bg-pastel-green"
                                  : journey.id === "back-to-school"
                                    ? "bg-pastel-purple"
                                    : "bg-pastel-yellow"
                            }`}
                          >
                            <div
                              className={`${
                                journey.id === "home-relocation"
                                  ? "text-blue-600"
                                  : journey.id === "diy-home-improvement"
                                    ? "text-green-600"
                                    : journey.id === "back-to-school"
                                      ? "text-purple-600"
                                      : "text-yellow-600"
                              }`}
                            >
                              {journey.icon}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {journey.title}
                            </h3>
                            <p className="text-xs text-gray-600 mt-1">
                              {journey.description}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-pastel-green border border-gray-200 text-green-700 px-2 py-1 text-xs font-medium">
                          {journey.confidence}%
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs font-medium text-gray-600 mb-1">
                            Customers
                          </p>
                          <p className="font-semibold text-gray-900 text-sm">
                            {journey.customers.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs font-medium text-gray-600 mb-1">
                            Revenue
                          </p>
                          <p className="font-semibold text-gray-900 text-sm">
                            {journey.revenueRange}
                          </p>
                        </div>
                        <div className="text-center p-2 bg-pastel-green rounded-lg border border-gray-200">
                          <p className="text-xs font-medium text-gray-600 mb-1">
                            Monthly
                          </p>
                          <p className="font-semibold text-green-700 text-sm">
                            {journey.monthlyRevenue}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Minimalistic Analytics Dashboard */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <Tabs defaultValue="overview" className="w-full">
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
                  <div className="grid grid-cols-2 gap-4">
                    {/* Mini Journey Timeline */}
                    <Card className="bg-white border border-gray-200 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          Journey Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="h-24 flex items-end justify-between gap-1">
                          {[45, 67, 89, 123, 156, 134, 178, 145].map(
                            (value, index) => (
                              <div
                                key={index}
                                className="bg-primary/20 rounded-t-sm flex-1"
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

                    {/* Engagement Phases */}
                    <Card className="bg-white border border-gray-200 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          Engagement Phases
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {[
                            {
                              phase: "Discovery",
                              rate: 94,
                              color: "bg-blue-200",
                            },
                            {
                              phase: "Consideration",
                              rate: 89,
                              color: "bg-green-200",
                            },
                            {
                              phase: "Decision",
                              rate: 96,
                              color: "bg-purple-200",
                            },
                            {
                              phase: "Integration",
                              rate: 91,
                              color: "bg-yellow-200",
                            },
                          ].map((item) => (
                            <div
                              key={item.phase}
                              className="flex items-center justify-between"
                            >
                              <span className="text-xs text-gray-600 w-20">
                                {item.phase}
                              </span>
                              <div className="flex-1 mx-2 bg-gray-100 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${item.color}`}
                                  style={{
                                    width: `${item.rate}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs font-medium text-gray-700 w-8">
                                {item.rate}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Geographic Distribution */}
                    <Card className="bg-white border border-gray-200 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-600" />
                          Top Markets
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {[
                            {
                              market: "Denver",
                              value: 2847,
                              color: "bg-blue-200",
                            },
                            {
                              market: "Austin",
                              value: 2156,
                              color: "bg-green-200",
                            },
                            {
                              market: "Seattle",
                              value: 1923,
                              color: "bg-purple-200",
                            },
                            {
                              market: "Charleston",
                              value: 1654,
                              color: "bg-yellow-200",
                            },
                          ].map((item) => (
                            <div
                              key={item.market}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${item.color}`}
                                />
                                <span className="text-xs text-gray-600">
                                  {item.market}
                                </span>
                              </div>
                              <span className="text-xs font-medium text-gray-700">
                                {item.value.toLocaleString()}
                              </span>
                            </div>
                          ))}
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

        {/* AI Co-pilot Demo Section */}
        <div className="mt-6">
          <AICopilotDemo />
        </div>
      </div>
    </>
  );
}
