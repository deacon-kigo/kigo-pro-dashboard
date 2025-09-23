/**
 * Campaign Launch UI Component
 *
 * Step 5 of Tucker Williams' campaign creation workflow
 * Shows live campaign status, performance dashboard, and business impact metrics
 */

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Rocket,
  Activity,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  CheckCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Globe,
  Heart,
  RefreshCw,
} from "lucide-react";

interface CampaignLaunchUIProps {
  onViewInsights?: () => void;
}

export default function CampaignLaunchUI({
  onViewInsights,
}: CampaignLaunchUIProps) {
  const [isLive, setIsLive] = useState(false);
  const [currentCustomers, setCurrentCustomers] = useState({
    phase1: 0,
    phase2: 0,
    phase3: 0,
    phase4: 0,
  });

  // Simulate live campaign activation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLive(true);
      // Simulate customer progression
      setCurrentCustomers({
        phase1: 127,
        phase2: 89,
        phase3: 156,
        phase4: 195,
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const campaignStats = {
    targetCustomers: 567,
    totalActive:
      currentCustomers.phase1 +
      currentCustomers.phase2 +
      currentCustomers.phase3 +
      currentCustomers.phase4,
    nationalPartners: 15,
    localMerchants: 12000,
  };

  const financialProjections = {
    month1: {
      immediate: "$72K-139K",
      ltv: "$680K-1.08M",
    },
    month3: {
      immediate: "$86K-167K",
      ltv: "$2.04M-3.24M",
    },
    annual: {
      immediate: "$1.03M-2.00M",
      ltv: "$16.3M-25.8M",
    },
  };

  const businessImpact = {
    npsIncrease: "+23",
    serviceAdoption: "67%",
    churnReduction: "34%",
    referralRate: "1.3",
  };

  const phaseData = [
    {
      name: "Moving Logistics",
      current: currentCustomers.phase1,
      color: "#3b82f6",
    },
    {
      name: "Travel & Stay",
      current: currentCustomers.phase2,
      color: "#10b981",
    },
    {
      name: "Home Setup",
      current: currentCustomers.phase3,
      color: "#8b5cf6",
    },
    {
      name: "Local Integration",
      current: currentCustomers.phase4,
      color: "#f59e0b",
    },
  ];

  // Chart configurations
  const phaseChartConfig = {
    phase1: {
      label: "Moving Logistics",
      color: "#3b82f6",
    },
    phase2: {
      label: "Travel & Stay",
      color: "#10b981",
    },
    phase3: {
      label: "Home Setup",
      color: "#8b5cf6",
    },
    phase4: {
      label: "Local Integration",
      color: "#f59e0b",
    },
  };

  const revenueChartConfig = {
    immediate: {
      label: "Immediate Revenue",
      color: "#3b82f6",
    },
    ltv: {
      label: "LTV Enhancement",
      color: "#10b981",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header with Live Status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
            <Rocket className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Campaign Launch & Performance
            </h3>
            <p className="text-sm text-gray-600">
              Live campaign status and real-time performance metrics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isLive ? (
            <Badge className="bg-green-100 text-green-700 px-3 py-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Campaign Live
            </Badge>
          ) : (
            <Badge className="bg-yellow-100 text-yellow-700 px-3 py-1">
              <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
              Launching...
            </Badge>
          )}
        </div>
      </div>

      {!isLive ? (
        /* Launch Animation */
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-8 h-8 text-white animate-bounce" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Launching Campaign...
            </h3>
            <p className="text-gray-600 mb-4">
              Activating partner network and initializing customer journey
              tracking
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full animate-pulse"
                style={{ width: "75%" }}
              ></div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Live Campaign Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Target Customers
                    </p>
                    <p className="text-xl font-bold text-green-700">
                      {campaignStats.targetCustomers}/month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Currently Active
                    </p>
                    <p className="text-xl font-bold text-blue-700">
                      {campaignStats.totalActive}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      National Partners
                    </p>
                    <p className="text-xl font-bold text-purple-700">
                      {campaignStats.nationalPartners}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Local Merchants
                    </p>
                    <p className="text-xl font-bold text-orange-700">
                      {campaignStats.localMerchants.toLocaleString()}+
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Phase Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-blue-600" />
                Current Customer Distribution by Phase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartContainer config={phaseChartConfig} className="h-[250px]">
                  <PieChart>
                    <Pie
                      data={phaseData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="current"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {phaseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value, name) => [`${value} customers`, name]}
                    />
                  </PieChart>
                </ChartContainer>
                <div className="space-y-3">
                  {phaseData.map((phase) => (
                    <div
                      key={phase.name}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: phase.color }}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {phase.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {phase.current}
                        </p>
                        <p className="text-xs text-gray-500">
                          {Math.round(
                            (phase.current / campaignStats.totalActive) * 100
                          )}
                          %
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Performance Projections */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Financial Performance Projections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Month 1
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-lg font-bold text-blue-600">
                        {financialProjections.month1.immediate}
                      </p>
                      <p className="text-xs text-gray-600">Immediate Revenue</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">
                        {financialProjections.month1.ltv}
                      </p>
                      <p className="text-xs text-gray-600">LTV Boost</p>
                    </div>
                  </div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Month 3
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-lg font-bold text-blue-600">
                        {financialProjections.month3.immediate}
                      </p>
                      <p className="text-xs text-gray-600">Immediate Revenue</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">
                        {financialProjections.month3.ltv}
                      </p>
                      <p className="text-xs text-gray-600">Cumulative LTV</p>
                    </div>
                  </div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Annual Program
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-lg font-bold text-blue-600">
                        {financialProjections.annual.immediate}
                      </p>
                      <p className="text-xs text-gray-600">Immediate Revenue</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">
                        {financialProjections.annual.ltv}
                      </p>
                      <p className="text-xs text-gray-600">LTV Enhancement</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Impact Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Business Impact Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">
                    {businessImpact.npsIncrease}
                  </p>
                  <p className="text-xs text-gray-600">NPS Points Increase</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    {businessImpact.serviceAdoption}
                  </p>
                  <p className="text-xs text-gray-600">
                    Take Additional Services
                  </p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">
                    {businessImpact.churnReduction}
                  </p>
                  <p className="text-xs text-gray-600">Churn Reduction</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">
                    {businessImpact.referralRate}
                  </p>
                  <p className="text-xs text-gray-600">
                    New Customers per Relocater
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-Time Intelligence */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-6 h-6 text-blue-600" />
                <h4 className="text-lg font-semibold text-gray-900">
                  Real-Time AI Intelligence
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">
                      AI monitoring journey progression and personalizing timing
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">
                      Partner performance tracking with optimization
                      recommendations
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">
                      Revenue rebalancing between immediate gains and LTV
                      enhancement
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">
                      New pattern discovery for future campaign opportunities
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tucker's Success Quote */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <blockquote className="text-lg font-semibold text-gray-900 mb-2">
                "This gives us incredible visibility into immediate revenue and
                long-term value!"
              </blockquote>
              <p className="text-sm text-gray-600">
                — Tucker Williams, ABC FI Marketing Manager
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={onViewInsights}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Detailed Insights
            </Button>
            <Button
              variant="outline"
              onClick={() => console.log("Create similar campaign")}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2"
            >
              Create Similar Campaign
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
