"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Zap,
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
  LineChart,
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

interface StreamingROIMetricsProps {
  giftAmount: number;
  timeline: string;
  onAnalysisComplete: () => void;
  className?: string;
}

export function StreamingROIMetrics({
  giftAmount,
  timeline,
  onAnalysisComplete,
  className = "",
}: StreamingROIMetricsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [animatedValues, setAnimatedValues] = useState({
    monthlyClosings: 0,
    totalCost: 0,
    netCost: 0,
    revenue: 0,
    roi: 0,
  });

  // Target values for animation
  const targetValues = {
    monthlyClosings: 567,
    totalCost: 567 * giftAmount,
    netCost: 567 * giftAmount * 0.6, // 40% co-op funding
    revenue: 45360,
    roi: 33,
  };

  // Chart data that updates as values animate
  const [chartData, setChartData] = useState({
    monthlyTrend: [
      { month: "Jan", closings: 0, revenue: 0 },
      { month: "Feb", closings: 0, revenue: 0 },
      { month: "Mar", closings: 0, revenue: 0 },
      { month: "Apr", closings: 0, revenue: 0 },
    ],
    costBreakdown: [
      { name: "Gift Costs", value: 0, color: "#ef4444" },
      { name: "Co-op Funding", value: 0, color: "#10b981" },
      { name: "Net Bank Cost", value: 0, color: "#3b82f6" },
    ],
    roiProgression: [
      { week: "Week 1", roi: 0 },
      { week: "Week 2", roi: 0 },
      { week: "Week 3", roi: 0 },
      { week: "Week 4", roi: 0 },
    ],
  });

  const steps = [
    {
      title: "Analyzing Monthly Mortgage Closings",
      description: "Processing historical closing data...",
      duration: 2000,
    },
    {
      title: "Calculating Program Costs",
      description: "Computing gift costs and co-op funding...",
      duration: 1500,
    },
    {
      title: "Projecting Revenue Impact",
      description: "Estimating incremental revenue from follow-up offers...",
      duration: 2000,
    },
    {
      title: "Computing ROI Projections",
      description: "Finalizing return on investment calculations...",
      duration: 1500,
    },
  ];

  useEffect(() => {
    const runAnalysis = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);

        // Animate values for current step
        const stepDuration = steps[i].duration;
        const animationSteps = 60; // 60 frames
        const stepInterval = stepDuration / animationSteps;

        for (let frame = 0; frame <= animationSteps; frame++) {
          const progress = frame / animationSteps;
          const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

          setTimeout(() => {
            setAnimatedValues({
              monthlyClosings: Math.floor(
                targetValues.monthlyClosings * easeProgress * (i >= 0 ? 1 : 0)
              ),
              totalCost: Math.floor(
                targetValues.totalCost * easeProgress * (i >= 1 ? 1 : 0)
              ),
              netCost: Math.floor(
                targetValues.netCost * easeProgress * (i >= 1 ? 1 : 0)
              ),
              revenue: Math.floor(
                targetValues.revenue * easeProgress * (i >= 2 ? 1 : 0)
              ),
              roi: Math.floor(
                targetValues.roi * easeProgress * (i >= 3 ? 1 : 0)
              ),
            });

            // Update chart data
            if (i >= 1) {
              setChartData((prev) => ({
                ...prev,
                monthlyTrend: [
                  {
                    month: "Jan",
                    closings: Math.floor(540 * easeProgress),
                    revenue: Math.floor(43200 * easeProgress),
                  },
                  {
                    month: "Feb",
                    closings: Math.floor(567 * easeProgress),
                    revenue: Math.floor(45360 * easeProgress),
                  },
                  {
                    month: "Mar",
                    closings: Math.floor(589 * easeProgress),
                    revenue: Math.floor(47120 * easeProgress),
                  },
                  {
                    month: "Apr",
                    closings: Math.floor(612 * easeProgress),
                    revenue: Math.floor(48960 * easeProgress),
                  },
                ],
                costBreakdown: [
                  {
                    name: "Gift Costs",
                    value: Math.floor(targetValues.totalCost * easeProgress),
                    color: "#ef4444",
                  },
                  {
                    name: "Co-op Funding",
                    value: Math.floor(
                      targetValues.totalCost * 0.4 * easeProgress
                    ),
                    color: "#10b981",
                  },
                  {
                    name: "Net Bank Cost",
                    value: Math.floor(targetValues.netCost * easeProgress),
                    color: "#3b82f6",
                  },
                ],
                roiProgression: [
                  { week: "Week 1", roi: Math.floor(8 * easeProgress) },
                  { week: "Week 2", roi: Math.floor(18 * easeProgress) },
                  { week: "Week 3", roi: Math.floor(26 * easeProgress) },
                  { week: "Week 4", roi: Math.floor(33 * easeProgress) },
                ],
              }));
            }
          }, frame * stepInterval);
        }

        // Wait for step to complete
        await new Promise((resolve) => setTimeout(resolve, stepDuration));
      }

      // Analysis complete
      setTimeout(() => {
        onAnalysisComplete();
      }, 1000);
    };

    runAnalysis();
  }, [giftAmount, timeline]);

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-4 ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">
            ROI Impact Analysis
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          {currentStep < steps.length
            ? steps[currentStep].description
            : "Analysis complete"}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex-1 text-center ${
                index < steps.length - 1 ? "border-r border-gray-200" : ""
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-medium ${
                  index <= currentStep
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              <div className="text-xs text-gray-600 px-1">
                {step.title.split(" ")[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Monthly Closings
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-700">
            {animatedValues.monthlyClosings.toLocaleString()}
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">
              Projected ROI
            </span>
          </div>
          <div className="text-2xl font-bold text-green-700">
            +{animatedValues.roi}%
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-900">Net Cost</span>
          </div>
          <div className="text-lg font-bold text-red-700">
            ${animatedValues.netCost.toLocaleString()}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">
              Est. Revenue
            </span>
          </div>
          <div className="text-lg font-bold text-purple-700">
            ${animatedValues.revenue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Charts */}
      {currentStep >= 1 && (
        <div className="space-y-3">
          {/* Monthly Trend Chart */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Monthly Performance Projection
            </h4>
            <ChartContainer config={{}} className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Cost Breakdown */}
          {currentStep >= 2 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Cost Structure Analysis
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <ChartContainer config={{}} className="h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={chartData.costBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={12}
                          outerRadius={30}
                          dataKey="value"
                        >
                          {chartData.costBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="flex-1 space-y-1">
                  {chartData.costBreakdown.map((item) => (
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
                        ${item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ROI Progression */}
          {currentStep >= 3 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                ROI Growth Timeline
              </h4>
              <ChartContainer config={{}} className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.roiProgression}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="roi"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
