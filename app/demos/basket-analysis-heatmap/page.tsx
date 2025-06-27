"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CpuChipIcon,
  ShoppingCartIcon,
  ArrowRightIcon,
  LightBulbIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

// Mock data for product correlations
const products = [
  "Signature Flavor Pint A",
  "Classic Flavor Pint B",
  "Premium Flavor Pint C",
  "Seasonal Flavor Pint D",
  "Limited Edition Pint E",
  "Value Flavor Pint F",
];

const categories = [
  "Salty Snacks",
  "Ice Cream Cones",
  "Frozen Pizza",
  "Beverages",
  "Candy & Sweets",
  "Baked Goods",
];

// Generate correlation matrix data
const generateCorrelationData = () => {
  const data: Array<{
    product: string;
    category: string;
    correlation: number;
    purchases: number;
  }> = [];

  products.forEach((product) => {
    categories.forEach((category) => {
      // Generate realistic correlation values with minimum threshold
      let correlation = 0.1 + Math.random() * 0.9; // Ensure minimum 0.1 correlation

      // Create some strong correlations for demo purposes
      if (
        (product.includes("Signature") && category === "Salty Snacks") ||
        (product.includes("Classic") && category === "Ice Cream Cones") ||
        (product.includes("Premium") && category === "Beverages") ||
        (product.includes("Seasonal") && category === "Candy & Sweets")
      ) {
        correlation = 0.7 + Math.random() * 0.3; // Strong correlation (0.7-1.0)
      } else if (Math.random() > 0.6) {
        correlation = 0.4 + Math.random() * 0.3; // Medium correlation (0.4-0.7)
      } else {
        correlation = 0.1 + Math.random() * 0.3; // Weak correlation (0.1-0.4)
      }

      data.push({
        product,
        category,
        correlation,
        purchases:
          Math.floor(correlation * 10000) +
          Math.floor(Math.random() * 2000) +
          500, // Ensure minimum purchases
      });
    });
  });

  return data;
};

const correlationData = generateCorrelationData();

// Enhanced top co-purchases data with detailed metrics
const topCoPurchases = [
  {
    pair: "Premium Pint + Beverages",
    multiplier: "4.2x",
    percentage: "76.3%",
    totalSales: 284650,
    revenueImpact: "$1.2M",
    liftPotential: "+18.4%",
    confidence: 94.2,
  },
  {
    pair: "Signature Pint + Salty Snacks",
    multiplier: "3.8x",
    percentage: "68.7%",
    totalSales: 193820,
    revenueImpact: "$847K",
    liftPotential: "+15.2%",
    confidence: 91.8,
  },
  {
    pair: "Classic Pint + Ice Cream Cones",
    multiplier: "3.4x",
    percentage: "62.1%",
    totalSales: 167340,
    revenueImpact: "$623K",
    liftPotential: "+12.7%",
    confidence: 88.5,
  },
];

// Enhanced strategic recommendations with business impact
const recommendations = [
  {
    action: "Partner with salty snack brands for bundle offers",
    impact: "High",
    effort: "Medium",
    timeframe: "Q2 2024",
    expectedLift: "+23%",
    revenueEstimate: "$1.8M",
  },
  {
    action: "Position beverages adjacent to premium ice cream",
    impact: "Medium",
    effort: "Low",
    timeframe: "Q1 2024",
    expectedLift: "+15%",
    revenueEstimate: "$920K",
  },
  {
    action: "Create seasonal combo packages with candy",
    impact: "Medium",
    effort: "Medium",
    timeframe: "Q3 2024",
    expectedLift: "+18%",
    revenueEstimate: "$1.1M",
  },
  {
    action: "Develop frozen pizza + ice cream meal deals",
    impact: "High",
    effort: "High",
    timeframe: "Q4 2024",
    expectedLift: "+28%",
    revenueEstimate: "$2.1M",
  },
];

// Market basket analytics
const basketAnalytics = {
  avgBasketSize: 3.4,
  crossSellRate: 67.2,
  upsellOpportunities: 127,
  totalAnalyzedBaskets: 2840000,
  strongCorrelations: 34,
  mediumCorrelations: 89,
  weakCorrelations: 156,
};

// Get color intensity based on correlation value with inline styles
const getIntensityColorStyle = (correlation: number) => {
  if (correlation >= 0.7) {
    return {
      backgroundColor: "#10B981", // green-500
      color: "#FFFFFF",
    };
  }
  if (correlation >= 0.5) {
    return {
      backgroundColor: "#FDE047", // yellow-400
      color: "#1F2937",
    };
  }
  if (correlation >= 0.3) {
    return {
      backgroundColor: "#FED7AA", // orange-300
      color: "#1F2937",
    };
  }
  if (correlation >= 0.15) {
    return {
      backgroundColor: "#FEE2E2", // red-100
      color: "#7F1D1D",
    };
  }
  return {
    backgroundColor: "#F3F4F6", // gray-100
    color: "#6B7280",
    border: "1px solid #D1D5DB",
  };
};

// Get correlation description
const getCorrelationDescription = (correlation: number) => {
  if (correlation >= 0.7) return "Strong";
  if (correlation >= 0.5) return "Moderate";
  if (correlation >= 0.3) return "Weak";
  return "Minimal";
};

export default function BasketAnalysisHeatmap() {
  const [hoveredCell, setHoveredCell] = useState<{
    product: string;
    category: string;
    correlation: number;
    purchases: number;
  } | null>(null);

  const [selectedCell, setSelectedCell] = useState<{
    product: string;
    category: string;
    correlation: number;
    purchases: number;
  } | null>(null);

  const handleCellHover = (cellData: typeof hoveredCell) => {
    setHoveredCell(cellData);
  };

  const handleCellClick = (cellData: typeof selectedCell) => {
    setSelectedCell(cellData);
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
            AI-Powered Basket Analysis
          </h1>
          <p className="text-gray-600 mt-2">
            Discover product co-purchase patterns and optimization opportunities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg border"
            style={{
              backgroundColor: "#DBEAFE",
              borderColor: "#93C5FD",
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "#3B82F6" }}
            ></div>
            <span className="text-sm font-medium" style={{ color: "#1D4ED8" }}>
              Real-time
            </span>
          </div>
          <div
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: "#1D4ED8",
              color: "#FFFFFF",
            }}
          >
            Live Data
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Heatmap - Takes up 3 columns */}
        <div className="xl:col-span-3">
          <Card
            className="p-6 bg-white border border-gray-200 hover:shadow-md transition-all duration-200"
            style={{
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Product Correlation Heatmap
              </h2>
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                <span className="text-gray-700 font-medium text-sm">
                  Correlation Strength:
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <span className="text-xs text-gray-600 font-medium">
                      Low
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                    <span className="text-xs text-gray-600 font-medium">
                      Medium
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-xs text-gray-600 font-medium">
                      High
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="relative">
              <div className="grid grid-cols-7 gap-1">
                {/* Header row */}
                <div className="p-3"></div>
                {categories.map((category) => (
                  <div key={category} className="p-3 text-center">
                    <span className="text-xs font-medium text-gray-700 writing-mode-vertical transform -rotate-45 origin-center">
                      {category}
                    </span>
                  </div>
                ))}

                {/* Data rows */}
                {products.map((product) => (
                  <React.Fragment key={product}>
                    {/* Row header */}
                    <div className="p-3 flex items-center">
                      <span className="text-xs font-medium text-gray-700 text-right">
                        {product}
                      </span>
                    </div>

                    {/* Data cells */}
                    {categories.map((category) => {
                      const cellData = correlationData.find(
                        (d) => d.product === product && d.category === category
                      );

                      const correlation = cellData?.correlation || 0;
                      const colorStyle = getIntensityColorStyle(correlation);

                      return (
                        <div
                          key={`${product}-${category}`}
                          className={`
                            relative p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg
                            ${selectedCell?.product === product && selectedCell?.category === category ? "ring-2 ring-blue-500" : ""}
                          `}
                          style={{
                            backgroundColor: colorStyle.backgroundColor,
                            color: colorStyle.color,
                            border: colorStyle.border || "none",
                          }}
                          onMouseEnter={() => handleCellHover(cellData || null)}
                          onMouseLeave={() => setHoveredCell(null)}
                          onClick={() => handleCellClick(cellData || null)}
                        >
                          <div className="text-center">
                            <div className="text-sm font-bold">
                              {correlation.toFixed(1)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>

              {/* Tooltip */}
              {hoveredCell && (
                <div
                  className="absolute z-10 bg-white p-4 rounded-lg shadow-xl border border-gray-200 pointer-events-none"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900">
                      {hoveredCell.product} × {hoveredCell.category}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">
                        {(hoveredCell.correlation * 4.2).toFixed(1)}x
                      </span>{" "}
                      more likely to be bought together
                    </p>
                    <p className="text-xs text-gray-500">
                      {getCorrelationDescription(hoveredCell.correlation)}{" "}
                      correlation ({hoveredCell.correlation.toFixed(2)})
                    </p>
                    <p className="text-xs text-gray-500">
                      {hoveredCell.purchases.toLocaleString()} co-purchases
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar - Takes up 1 column */}
        <div className="xl:col-span-1 space-y-6">
          {/* Basket Analytics Summary */}
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
                style={{ background: "#F3E8FF" }}
              >
                <ChartBarIcon className="h-5 w-5" />
              </div>
              Analytics Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-purple-700">
                    Basket Size
                  </span>
                </div>
                <div className="text-lg font-bold text-purple-900">
                  {basketAnalytics.avgBasketSize}
                </div>
                <div className="text-xs text-purple-600">avg items</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-blue-700">
                    Cross-sell
                  </span>
                </div>
                <div className="text-lg font-bold text-blue-900">
                  {basketAnalytics.crossSellRate}%
                </div>
                <div className="text-xs text-blue-600">success rate</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-green-700">
                    Opportunities
                  </span>
                </div>
                <div className="text-lg font-bold text-green-900">
                  {basketAnalytics.upsellOpportunities}
                </div>
                <div className="text-xs text-green-600">identified</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">
                    Baskets
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {(basketAnalytics.totalAnalyzedBaskets / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-gray-600">analyzed</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>
                  Strong correlations: {basketAnalytics.strongCorrelations}
                </span>
                <span>Medium: {basketAnalytics.mediumCorrelations}</span>
                <span>Weak: {basketAnalytics.weakCorrelations}</span>
              </div>
            </div>
          </Card>

          {/* Top Co-Purchases */}
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
                <ChartBarIcon className="h-5 w-5" />
              </div>
              Top Co-Purchases
            </h3>
            <div className="space-y-4">
              {topCoPurchases.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        {item.pair}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="font-medium">
                          {item.percentage} correlation
                        </span>
                        <span>•</span>
                        <span>{item.totalSales.toLocaleString()} sales</span>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-green-600 text-white rounded text-xs font-medium">
                      {item.multiplier}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-medium text-green-700">
                        {item.revenueImpact}
                      </span>
                      <span className="text-gray-600">
                        lift: {item.liftPotential}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {item.confidence}% confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Strategic Recommendations */}
          <Card
            className="p-6 bg-white border border-gray-200 hover:shadow-md transition-all duration-200"
            style={{
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div
                className="p-1.5 text-yellow-600"
                style={{ background: "#FEF3C7" }}
              >
                <LightBulbIcon className="h-5 w-5" />
              </div>
              Strategic Recommendations
            </h3>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div
                        className="p-1.5 text-yellow-600"
                        style={{ background: "#FEF3C7" }}
                      >
                        <ArrowRightIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          {recommendation.action}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="font-medium">
                            Impact: {recommendation.impact}
                          </span>
                          <span>Effort: {recommendation.effort}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-medium">
                        {recommendation.expectedLift}
                      </span>
                      <span className="text-gray-600">
                        {recommendation.revenueEstimate}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {recommendation.timeframe}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Selected Cell Details */}
          {selectedCell && (
            <Card
              className="p-6 bg-white border border-blue-200 hover:shadow-md transition-all duration-200"
              style={{
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div
                  className="p-1.5 text-blue-600"
                  style={{ background: "#DBEAFE" }}
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                </div>
                Selection Details
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <p className="font-semibold text-blue-900 mb-2 text-base">
                    {selectedCell.product}
                  </p>
                  <p className="text-sm text-blue-700 mb-3">
                    × {selectedCell.category}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-gray-600 font-medium">Correlation</p>
                      <p className="font-bold text-blue-900">
                        {selectedCell.correlation.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-gray-600 font-medium">Multiplier</p>
                      <p className="font-bold text-purple-900">
                        {(selectedCell.correlation * 4.2).toFixed(1)}x
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
