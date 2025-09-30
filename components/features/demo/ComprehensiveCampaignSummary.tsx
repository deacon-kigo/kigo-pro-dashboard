"use client";

import React, { useState, useEffect } from "react";
import {
  Gift,
  MapPin,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Clock,
  BarChart3,
  PieChart,
  Home,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ComprehensiveCampaignSummaryProps {
  title: string;
  giftAmount?: number;
  timeline?: string;
  locationData?: any;
  isEnhanced?: boolean;
  className?: string;
}

export function ComprehensiveCampaignSummary({
  title,
  giftAmount = 100,
  timeline = "30-days",
  locationData,
  isEnhanced = false,
  className = "",
}: ComprehensiveCampaignSummaryProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [visibleSection, setVisibleSection] = useState(0);

  // Progressive rendering effect
  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleSection(1), 400), // Header
      setTimeout(() => setVisibleSection(2), 900), // Gift Configuration
      setTimeout(() => setVisibleSection(3), 1500), // Customer Journey
      setTimeout(() => setVisibleSection(4), 2200), // Performance Chart
      setTimeout(() => setVisibleSection(5), 2900), // Gift Distribution
      setTimeout(() => setVisibleSection(6), 3600), // ROI Model Tab
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // Scene 4 ROI Model Data (from documentation)
  const roiData = {
    monthlyClosings: 567,
    costPerGift: giftAmount,
    coopFunding: 40, // 40%
    totalMonthlyCost: 567 * giftAmount,
    netCostToBank: 567 * giftAmount * (1 - 0.4),
    incrementalRevenue: 45360, // 20% take follow-up offers @ $400 value
    projectedROI: 33, // ((45360 - 34020) / 34020) * 100
  };

  // Chart data
  const performanceData = [
    { name: "Week 1", engagement: 85, conversion: 12 },
    { name: "Week 2", engagement: 92, conversion: 18 },
    { name: "Week 3", engagement: 88, conversion: 22 },
    { name: "Week 4", engagement: 95, conversion: 28 },
  ];

  const giftDistributionData = [
    { name: "Home Depot", value: 45, color: "#f97316" },
    { name: "Cleaning Service", value: 30, color: "#10b981" },
    { name: "Williams Sonoma", value: 25, color: "#8b5cf6" },
  ];

  const merchantCategoryData = [
    { category: "Home Improvement", count: 8, revenue: 12400 },
    { category: "Storage", count: 5, revenue: 8900 },
    { category: "Hotels", count: 3, revenue: 6700 },
    { category: "Moving Services", count: 4, revenue: 9200 },
  ];

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg shadow-black/10 border border-gray-200/50 p-6 backdrop-blur-sm ${className}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)",
      }}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between mb-4 transition-all duration-800 ease-out ${
          visibleSection >= 1
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
      >
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            {title}
          </h2>
          <p className="text-sm text-gray-600">Ready to launch campaign</p>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-700">Configured</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="overview" className="text-xs">
            Overview
          </TabsTrigger>
          <TabsTrigger value="metrics" className="text-xs">
            Metrics
          </TabsTrigger>
          <TabsTrigger value="roi" className="text-xs">
            ROI Model
          </TabsTrigger>
          <TabsTrigger value="partners" className="text-xs">
            Partners
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-3">
          {/* Gift Configuration */}
          <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-xl p-4 border border-blue-200/50 backdrop-blur-sm shadow-sm">
            <h3 className="font-medium text-blue-900 text-sm mb-2 flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Gift Configuration
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {giftDistributionData.map((gift) => (
                <div key={gift.name} className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    ${giftAmount}
                  </div>
                  <div className="text-xs text-gray-600">{gift.name}</div>
                  <div className="text-xs text-blue-600">
                    {gift.value}% preference
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Journey */}
          <div className="bg-gradient-to-r from-gray-50/80 to-slate-50/80 rounded-xl p-4 border border-gray-200/30 backdrop-blur-sm shadow-sm">
            <h3 className="font-medium text-gray-900 text-sm mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Customer Experience Timeline
            </h3>
            <div className="flex justify-between items-center text-xs">
              <div className="text-center">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mb-1">
                  <Gift className="w-3 h-3 text-white" />
                </div>
                <div className="text-gray-600">Gift Selection</div>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-2"></div>
              <div className="text-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mb-1">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="text-gray-600">Instant Delivery</div>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-2"></div>
              <div className="text-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mb-1">
                  <BarChart3 className="w-3 h-3 text-white" />
                </div>
                <div className="text-gray-600">On Demand Follow-up</div>
              </div>
            </div>
          </div>

          {/* Location Summary */}
          {isEnhanced && locationData && (
            <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-xl p-4 border border-green-200/50 backdrop-blur-sm shadow-sm">
              <h3 className="font-medium text-green-900 text-sm mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Target Location: {locationData.customerData?.name}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Coverage:</span>
                  <span className="ml-1 text-gray-900">Nationwide</span>
                </div>
                <div>
                  <span className="text-gray-500">Partners:</span>
                  <span className="ml-1 text-gray-900">30,000+ locations</span>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-3">
          {/* Performance Chart */}
          <div className="bg-white/80 border border-gray-200/50 rounded-xl p-4 backdrop-blur-sm shadow-sm">
            <h3 className="font-medium text-gray-900 text-sm mb-3">
              Campaign Performance Projection
            </h3>
            <ChartContainer config={{}} className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="engagement"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="conversion"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Gift Preference Distribution */}
          <div className="bg-white/80 border border-gray-200/50 rounded-xl p-4 backdrop-blur-sm shadow-sm">
            <h3 className="font-medium text-gray-900 text-sm mb-3">
              Expected Gift Preferences
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <ChartContainer config={{}} className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={giftDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={15}
                        outerRadius={35}
                        dataKey="value"
                      >
                        {giftDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="flex-1 space-y-1">
                {giftDistributionData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-medium text-gray-900">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ROI Model Tab (Scene 4) */}
        <TabsContent value="roi" className="space-y-3">
          <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-xl p-4 border border-green-200/50 backdrop-blur-sm shadow-sm">
            <h3 className="font-medium text-green-900 text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Projected Monthly ROI Model
            </h3>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-white rounded-lg p-2">
                <h4 className="text-xs font-medium text-gray-700 mb-2">
                  Inputs
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Closings:</span>
                    <span className="font-medium">
                      {roiData.monthlyClosings.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost Per Gift:</span>
                    <span className="font-medium">${roiData.costPerGift}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Co-op Funding:</span>
                    <span className="font-medium">{roiData.coopFunding}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-2">
                <h4 className="text-xs font-medium text-gray-700 mb-2">
                  Outputs
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Cost:</span>
                    <span className="font-medium">
                      ${roiData.totalMonthlyCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net Cost:</span>
                    <span className="font-medium">
                      ${roiData.netCostToBank.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Revenue:</span>
                    <span className="font-medium">
                      ${roiData.incrementalRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROI Result */}
            <div className="bg-green-600 text-white rounded-lg p-2 text-center">
              <div className="text-lg font-bold">
                +{roiData.projectedROI}% ROI
              </div>
              <div className="text-xs opacity-90">Projected Monthly Return</div>
            </div>
          </div>
        </TabsContent>

        {/* Partners Tab */}
        <TabsContent value="partners" className="space-y-3">
          {/* Merchant Categories */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h3 className="font-medium text-gray-900 text-sm mb-3 flex items-center gap-2">
              <Home className="w-4 h-4" />
              Partner Network Around Denver Location
            </h3>
            <div className="space-y-2">
              {merchantCategoryData.map((category) => (
                <div
                  key={category.category}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {category.category}
                    </div>
                    <div className="text-xs text-gray-600">
                      {category.count} partners
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      ${category.revenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Est. monthly</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          {isEnhanced && locationData && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <h3 className="font-medium text-blue-900 text-sm mb-2">
                AI Optimization Insights
              </h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-bold text-blue-700">
                    {locationData.aiInsights?.proximityScore || 95}%
                  </div>
                  <div className="text-blue-600">Proximity Match</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-700">
                    {locationData.aiInsights?.relevanceScore || 88}%
                  </div>
                  <div className="text-blue-600">Relevance</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-700">
                    {locationData.aiInsights?.expectedEngagement || "High"}
                  </div>
                  <div className="text-blue-600">Engagement</div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
