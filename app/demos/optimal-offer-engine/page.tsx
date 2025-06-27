"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  CpuChipIcon,
  BoltIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  StarIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  LightBulbIcon,
  UsersIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  FireIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

// Available goals and audiences for the dropdown simulation
const goals = [
  "Increase Visit Frequency",
  "Boost Average Order Value",
  "Drive New Customer Acquisition",
  "Improve Customer Retention",
  "Maximize Revenue Per Visit",
];

const audiences = [
  "High-Value Customers",
  "Frequent Shoppers",
  "New Customers",
  "Lapsed Customers",
  "Mobile App Users",
  "Weekend Shoppers",
];

// Engine performance data
const engineMetrics = {
  totalCampaigns: 2847,
  successRate: 94.2,
  avgLiftGenerated: 23.7,
  totalRevenueImpact: 47.8,
  avgROI: 4.2,
  avgROIChange: 12.3,
  campaignsThisWeek: 127,
  campaignsThisWeekChange: 8.4,
  accuracyImprovement: 15.2,
  topPerformingGoal: "Boost AOV",
  topPerformingAudience: "High-Value Customers",
};

// Real-time optimization data
const optimizationMetrics = {
  activeOptimizations: 34,
  queuedOptimizations: 12,
  avgOptimizationTime: 2.3,
  lastOptimization: "2 min ago",
  mlModelAccuracy: 97.4,
  dataPointsProcessed: 1.2,
  predictiveConfidence: 91.8,
};

// AI recommendations based on goal + audience combinations with complex data
const getRecommendation = (goal: string, audience: string) => {
  const recommendations: Record<string, any> = {
    "Increase Visit Frequency_High-Value Customers": {
      type: "Lightning Deal",
      icon: BoltIcon,
      rationale:
        "AI identifies time-sensitive exclusive offers drive 68% higher engagement rates for premium customers.",
      lift: "+18-24%",
      roi: "4.1x",
      confidence: 94.2,
      details:
        "Flash sales with 24-48 hour windows create urgency. Premium customer segment shows 3.2x higher conversion during limited-time offers.",
      historicalPerformance: {
        campaignsRun: 189,
        avgLift: 21.3,
        bestPerformance: 31.7,
        worstPerformance: 12.4,
        consistency: 89.2,
      },
      predictiveInsights: [
        "Peak performance window: 2-4 PM weekdays",
        "Mobile engagement 2.3x higher than desktop",
        "Bundled offers increase AOV by additional 15%",
      ],
      risks: "May reduce margins if discount depth exceeds 20%",
      estimatedRevenue: "$2.8M",
      timeToImplement: "24-48 hours",
      resourcesRequired: "Medium",
    },
    "Boost Average Order Value_High-Value Customers": {
      type: "Smart Bundle",
      icon: SparklesIcon,
      rationale:
        "ML algorithms identify optimal product combinations that increase basket size by 31% for premium segment.",
      lift: "+24-31%",
      roi: "5.2x",
      confidence: 91.8,
      details:
        "Dynamic bundling engine suggests complementary products based on purchase history and real-time inventory optimization.",
      historicalPerformance: {
        campaignsRun: 156,
        avgLift: 27.8,
        bestPerformance: 42.1,
        worstPerformance: 15.9,
        consistency: 92.4,
      },
      predictiveInsights: [
        "Cross-category bundles outperform single-category by 18%",
        "Personalized bundles show 2.7x higher conversion",
        "Premium + mid-tier combinations optimize margin retention",
      ],
      risks: "Inventory complexity may impact fulfillment times",
      estimatedRevenue: "$4.1M",
      timeToImplement: "3-5 days",
      resourcesRequired: "High",
    },
    "Drive New Customer Acquisition_New Customers": {
      type: "Welcome Journey",
      icon: StarIcon,
      rationale:
        "Multi-touch welcome sequences with progressive rewards achieve 43% higher first-purchase conversion rates.",
      lift: "+35-43%",
      roi: "3.7x",
      confidence: 87.9,
      details:
        "AI-orchestrated welcome series with personalized offers based on browsing behavior and demographic signals.",
      historicalPerformance: {
        campaignsRun: 203,
        avgLift: 38.2,
        bestPerformance: 51.6,
        worstPerformance: 22.1,
        consistency: 85.7,
      },
      predictiveInsights: [
        "Progressive discounts (10%, 15%, 20%) maximize lifetime value",
        "Social proof elements increase conversion by 22%",
        "Mobile-first experiences show 1.8x better performance",
      ],
      risks: "High acquisition costs may impact short-term profitability",
      estimatedRevenue: "$3.2M",
      timeToImplement: "1-2 weeks",
      resourcesRequired: "Medium",
    },
    "Improve Customer Retention_Lapsed Customers": {
      type: "Win-Back Engine",
      icon: CheckCircleIcon,
      rationale:
        "Predictive win-back campaigns targeting dormancy signals achieve 47% reactivation rates vs 12% baseline.",
      lift: "+39-47%",
      roi: "4.8x",
      confidence: 89.3,
      details:
        "ML-powered dormancy prediction triggers personalized win-back sequences with emotional messaging and value recovery offers.",
      historicalPerformance: {
        campaignsRun: 134,
        avgLift: 42.7,
        bestPerformance: 58.3,
        worstPerformance: 28.9,
        consistency: 88.1,
      },
      predictiveInsights: [
        "Nostalgic messaging increases open rates by 34%",
        "Graduated discounts (25%, 35%, 45%) optimize reactivation",
        "Timing: 30-45 days post-last-purchase shows peak effectiveness",
      ],
      risks: "Deep discounts may devalue brand perception",
      estimatedRevenue: "$2.1M",
      timeToImplement: "4-7 days",
      resourcesRequired: "Medium",
    },
  };

  const key = `${goal}_${audience}`;
  return (
    recommendations[key] ||
    recommendations["Increase Visit Frequency_High-Value Customers"]
  );
};

// KPI Card component matching the AI Campaign Report pattern
const KPICard = ({
  title,
  value,
  change,
  secondaryChange = null,
  secondaryChangeLabel = null,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  change: number;
  secondaryChange?: number | null;
  secondaryChangeLabel?: string | null;
  icon: any;
}) => {
  const isPositive = change >= 0;
  const isSecondaryPositive =
    secondaryChange !== null ? secondaryChange >= 0 : true;

  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value;

  const getIconBg = () => {
    switch (title) {
      case "Total Campaigns":
        return "#EFF6FF";
      case "Success Rate":
        return "#ECFDF5";
      case "Avg Lift":
        return "#F5F3FF";
      case "Revenue Impact":
        return "#FFFBEB";
      default:
        return "#F9FAFB";
    }
  };

  const getIconColor = () => {
    switch (title) {
      case "Total Campaigns":
        return "text-blue-600";
      case "Success Rate":
        return "text-green-600";
      case "Avg Lift":
        return "text-purple-600";
      case "Revenue Impact":
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  const getPercentageColor = () => {
    return isPositive ? "text-green-700" : "text-red-700";
  };

  const getPercentageBg = () => {
    return isPositive ? "bg-green-100" : "bg-red-100";
  };

  return (
    <div
      className="rounded-lg border border-gray-200 p-4 h-full bg-white"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center text-gray-700">
          <div
            className={`p-2.5 rounded-full ${getIconColor()}`}
            style={{ background: getIconBg() }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <span className="ml-2 text-sm font-medium">{title}</span>
        </div>
      </div>
      <div className="mt-1">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-900">
            {formattedValue}
          </span>
          <div className="ml-2.5">
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPercentageBg()} ${getPercentageColor()}`}
            >
              {isPositive ? "+" : ""}
              {change.toFixed(1)}%
            </span>
          </div>
        </div>
        {secondaryChange !== null && (
          <div className="mt-1 text-xs text-gray-500">
            <span
              className={
                isSecondaryPositive ? "text-green-700" : "text-red-700"
              }
            >
              {isSecondaryPositive ? "+" : ""}
              {secondaryChange.toFixed(1)}%
            </span>{" "}
            {secondaryChangeLabel || "WoW"}
          </div>
        )}
      </div>
    </div>
  );
};

export default function OptimalOfferEngine() {
  const [selectedGoal, setSelectedGoal] = useState(goals[0]);
  const [selectedAudience, setSelectedAudience] = useState(audiences[0]);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const recommendation = getRecommendation(selectedGoal, selectedAudience);

  // Simulate AI analysis when inputs change
  useEffect(() => {
    setIsAnalyzing(true);
    setShowRecommendation(false);

    const timer = setTimeout(() => {
      setIsAnalyzing(false);
      setShowRecommendation(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [selectedGoal, selectedAudience]);

  const handleCreateCampaign = () => {
    alert(
      `Creating ${recommendation.type} campaign for ${selectedAudience} to ${selectedGoal}!\n\nEstimated Revenue: ${recommendation.estimatedRevenue}\nImplementation Time: ${recommendation.timeToImplement}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="flex items-center justify-between p-6 bg-white rounded-lg border border-gray-200"
        style={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
        }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div
              className="p-2.5 rounded-lg text-blue-600"
              style={{ background: "#EFF6FF" }}
            >
              <CpuChipIcon className="h-6 w-6" />
            </div>
            Optimal Offer Engine
          </h1>
          <p className="text-gray-600 mt-2">
            AI-powered campaign optimization with predictive analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg border"
            style={{
              backgroundColor: "#DCFCE7",
              borderColor: "#BBF7D0",
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "#10B981" }}
            ></div>
            <span className="text-sm font-medium" style={{ color: "#059669" }}>
              ML Active
            </span>
          </div>
          <div
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: "#1D4ED8",
              color: "#FFFFFF",
            }}
          >
            Engine Running
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Campaigns"
          value={engineMetrics.totalCampaigns}
          change={engineMetrics.campaignsThisWeekChange}
          secondaryChange={engineMetrics.campaignsThisWeek}
          secondaryChangeLabel="this week"
          icon={BoltIcon}
        />
        <KPICard
          title="Success Rate"
          value={`${engineMetrics.successRate}%`}
          change={engineMetrics.accuracyImprovement}
          secondaryChange={optimizationMetrics.mlModelAccuracy}
          secondaryChangeLabel="ML accuracy"
          icon={TrophyIcon}
        />
        <KPICard
          title="Avg Lift"
          value={`${engineMetrics.avgLiftGenerated}%`}
          change={12.8}
          secondaryChange={optimizationMetrics.predictiveConfidence}
          secondaryChangeLabel="confidence"
          icon={ArrowTrendingUpIcon}
        />
        <KPICard
          title="Revenue Impact"
          value={`$${engineMetrics.totalRevenueImpact}M`}
          change={engineMetrics.avgROIChange}
          secondaryChange={engineMetrics.avgROI}
          secondaryChangeLabel="avg ROI"
          icon={CurrencyDollarIcon}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Configuration and Real-time Data */}
        <div className="lg:col-span-1 space-y-6">
          {/* Real-time Engine Status */}
          <Card
            className="p-6 bg-white border border-gray-200 hover:shadow-md transition-all duration-200"
            style={{
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div
                className="p-1.5 text-green-600"
                style={{ background: "#DCFCE7" }}
              >
                <FireIcon className="h-5 w-5" />
              </div>
              Real-time Status
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-medium text-blue-700">Active</p>
                  <p className="text-lg font-bold text-blue-900">
                    {optimizationMetrics.activeOptimizations}
                  </p>
                  <p className="text-xs text-blue-600">optimizations</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs font-medium text-purple-700">Queued</p>
                  <p className="text-lg font-bold text-purple-900">
                    {optimizationMetrics.queuedOptimizations}
                  </p>
                  <p className="text-xs text-purple-600">pending</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs font-medium text-green-700">Avg Time</p>
                  <p className="text-lg font-bold text-green-900">
                    {optimizationMetrics.avgOptimizationTime}s
                  </p>
                  <p className="text-xs text-green-600">processing</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs font-medium text-amber-700">
                    Data Processed
                  </p>
                  <p className="text-lg font-bold text-amber-900">
                    {optimizationMetrics.dataPointsProcessed}M
                  </p>
                  <p className="text-xs text-amber-600">points/hour</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Last optimization:</span>{" "}
                    {optimizationMetrics.lastOptimization}
                  </p>
                  <p>
                    <span className="font-medium">ML Model accuracy:</span>{" "}
                    {optimizationMetrics.mlModelAccuracy}%
                  </p>
                  <p>
                    <span className="font-medium">Top Goal:</span>{" "}
                    {engineMetrics.topPerformingGoal}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Campaign Configuration */}
          <Card
            className="p-6 bg-white border border-gray-200 hover:shadow-md transition-all duration-200"
            style={{
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div
                className="p-1.5 text-blue-600"
                style={{ background: "#EFF6FF" }}
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
              </div>
              Campaign Parameters
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Optimization Goal:
                </label>
                <div className="relative">
                  <select
                    value={selectedGoal}
                    onChange={(e) => setSelectedGoal(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                  >
                    {goals.map((goal) => (
                      <option key={goal} value={goal}>
                        {goal}
                      </option>
                    ))}
                  </select>
                  <ArrowRightIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 rotate-90 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Audience:
                </label>
                <div className="relative">
                  <select
                    value={selectedAudience}
                    onChange={(e) => setSelectedAudience(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                  >
                    {audiences.map((audience) => (
                      <option key={audience} value={audience}>
                        {audience}
                      </option>
                    ))}
                  </select>
                  <ArrowRightIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 rotate-90 pointer-events-none" />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>ML Confidence Level</span>
                  <span className="font-semibold">
                    {optimizationMetrics.predictiveConfidence}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${optimizationMetrics.predictiveConfidence}%`,
                      backgroundColor:
                        optimizationMetrics.predictiveConfidence > 90
                          ? "#059669"
                          : "#F59E0B",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel - AI Recommendation and Analysis */}
        <div className="lg:col-span-2">
          <Card
            className="p-6 bg-white border border-gray-200 hover:shadow-md transition-all duration-200"
            style={{
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div
                className="p-1.5 text-purple-600"
                style={{ background: "#F5F3FF" }}
              >
                <LightBulbIcon className="h-5 w-5" />
              </div>
              AI-Powered Recommendation Engine
            </h3>

            {/* AI Analysis Loading State */}
            {isAnalyzing && (
              <div className="text-center py-12">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div
                    className="animate-spin rounded-full h-8 w-8 border-b-2"
                    style={{ borderColor: "#1D4ED8" }}
                  ></div>
                  <span className="text-gray-600 font-medium">
                    Analyzing{" "}
                    {(goals.length * audiences.length * 1000).toLocaleString()}{" "}
                    data points...
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="h-2 rounded-full animate-pulse"
                    style={{
                      width: "82%",
                      background: "linear-gradient(to right, #1D4ED8, #7C3AED)",
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">
                  Processing historical performance • Predictive modeling • Risk
                  assessment
                </p>
              </div>
            )}

            {/* AI Recommendation Result */}
            {showRecommendation && !isAnalyzing && (
              <div className="space-y-6">
                {/* Main Recommendation */}
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="p-3 rounded-lg flex-shrink-0"
                      style={{
                        backgroundColor: "#1D4ED8",
                      }}
                    >
                      <recommendation.icon
                        className="h-6 w-6"
                        style={{ color: "#FFFFFF" }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {recommendation.type}
                      </h4>
                      <p className="text-gray-700 mb-3">
                        {recommendation.rationale}
                      </p>
                      <p className="text-sm text-gray-600">
                        {recommendation.details}
                      </p>
                    </div>
                  </div>

                  {/* Primary Metrics */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <div
                        className="h-5 w-5 mx-auto mb-1"
                        style={{ color: "#059669" }}
                      >
                        <ArrowTrendingUpIcon className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        Predicted Lift
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {recommendation.lift}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <div
                        className="h-5 w-5 mx-auto mb-1"
                        style={{ color: "#1D4ED8" }}
                      >
                        <CurrencyDollarIcon className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        ROI
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {recommendation.roi}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <div
                        className="h-5 w-5 mx-auto mb-1"
                        style={{ color: "#7C3AED" }}
                      >
                        <StarIcon className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        Confidence
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {recommendation.confidence}%
                      </p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <div
                        className="h-5 w-5 mx-auto mb-1"
                        style={{ color: "#F59E0B" }}
                      >
                        <ClockIcon className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        Implementation
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {recommendation.timeToImplement}
                      </p>
                    </div>
                  </div>

                  {/* Secondary Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        Estimated Revenue Impact
                      </p>
                      <p className="text-xl font-bold text-green-700">
                        {recommendation.estimatedRevenue}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Based on{" "}
                        {recommendation.historicalPerformance.campaignsRun}{" "}
                        similar campaigns
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        Historical Performance
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>
                          Avg:{" "}
                          <strong>
                            {recommendation.historicalPerformance.avgLift}%
                          </strong>
                        </span>
                        <span>
                          Best:{" "}
                          <strong>
                            {
                              recommendation.historicalPerformance
                                .bestPerformance
                            }
                            %
                          </strong>
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Consistency:{" "}
                        {recommendation.historicalPerformance.consistency}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Predictive Insights */}
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h5 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                    <CpuChipIcon className="h-4 w-4" />
                    AI Predictive Insights
                  </h5>
                  <div className="space-y-2">
                    {recommendation.predictiveInsights.map(
                      (insight: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-purple-800">{insight}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Risk Assessment & Implementation */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h6 className="font-semibold text-amber-900 mb-2">
                      Risk Assessment
                    </h6>
                    <p className="text-sm text-amber-800">
                      {recommendation.risks}
                    </p>
                    <div className="mt-2">
                      <p className="text-xs text-amber-700">
                        Resources Required:{" "}
                        <strong>{recommendation.resourcesRequired}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h6 className="font-semibold text-green-900 mb-2">
                      Implementation Plan
                    </h6>
                    <p className="text-sm text-green-800">
                      Ready to deploy in {recommendation.timeToImplement}
                    </p>
                    <div className="mt-2">
                      <p className="text-xs text-green-700">
                        Expected timeline:{" "}
                        <strong>Setup → Test → Launch</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleCreateCampaign}
                  className="w-full font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "#1D4ED8",
                    color: "#FFFFFF",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1E40AF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#1D4ED8";
                  }}
                >
                  Deploy {recommendation.type} Campaign
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="text-center text-xs text-gray-500 py-4">
        <p>
          Powered by Kigo Pro ML Engine •{" "}
          {engineMetrics.totalCampaigns.toLocaleString()} campaigns optimized •{" "}
          {optimizationMetrics.dataPointsProcessed}M data points processed daily
        </p>
      </div>
    </div>
  );
}
