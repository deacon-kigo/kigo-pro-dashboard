"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  SparklesIcon,
  PhotoIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export interface OfferConfigurationCardProps {
  offerType: string;
  initialValue?: string;
  programType: string;
  businessObjective: string;
  onComplete: (config: OfferConfiguration) => void;
  onCancel: () => void;
}

export interface OfferConfiguration {
  offerType: string;
  value: string;
  title: string;
  description: string;
  termsAndConditions: string;
  redemptionMethod: string;
  assets?: File[];
}

const COLORS = ["#059669", "#10B981", "#34D399", "#6EE7B7"];

/**
 * Offer configuration component with visualizations and performance predictions
 * Shows after user approves initial recommendation
 */
export function OfferConfigurationCard({
  offerType,
  initialValue = "15",
  programType,
  businessObjective,
  onComplete,
  onCancel,
}: OfferConfigurationCardProps) {
  const [value, setValue] = useState(initialValue);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [redemptionMethod, setRedemptionMethod] = useState("promo_code");
  const [assets, setAssets] = useState<File[]>([]);

  // Generate performance prediction data based on offer value
  const generatePerformancePrediction = () => {
    const numericValue = parseFloat(value) || 15;
    const baseRedemption = 100;
    const redemptionRate = Math.min(baseRedemption * (numericValue / 10), 350);

    return [
      { week: "Week 1", redemptions: Math.floor(redemptionRate * 0.4) },
      { week: "Week 2", redemptions: Math.floor(redemptionRate * 0.7) },
      { week: "Week 3", redemptions: Math.floor(redemptionRate * 0.9) },
      { week: "Week 4", redemptions: Math.floor(redemptionRate * 1.0) },
    ];
  };

  // Generate ROI comparison data
  const generateROIComparison = () => {
    const numericValue = parseFloat(value) || 15;
    return [
      {
        name: "Investment",
        value: numericValue * 1000,
      },
      {
        name: "Expected Revenue",
        value: numericValue * 2800,
      },
      {
        name: "Net Profit",
        value: numericValue * 1800,
      },
    ];
  };

  // Generate redemption method breakdown
  const generateRedemptionBreakdown = () => {
    return [
      { name: "In-Store", value: 45 },
      { name: "Online", value: 35 },
      { name: "Mobile App", value: 20 },
    ];
  };

  const performanceData = generatePerformancePrediction();
  const roiData = generateROIComparison();
  const redemptionBreakdown = generateRedemptionBreakdown();

  const handleSubmit = () => {
    onComplete({
      offerType,
      value,
      title,
      description,
      termsAndConditions,
      redemptionMethod,
      assets,
    });
  };

  const getOfferTypeIcon = () => {
    if (offerType.includes("Lightning")) return "⚡";
    if (offerType.includes("BOGO")) return "🎁";
    if (offerType.includes("Cashback")) return "💰";
    if (offerType.includes("Points")) return "⭐";
    if (offerType.includes("Percentage")) return "📊";
    return "🎯";
  };

  const getOfferTypeColor = () => {
    if (offerType.includes("Lightning")) return "#F59E0B";
    if (offerType.includes("BOGO")) return "#8B5CF6";
    if (offerType.includes("Cashback")) return "#059669";
    if (offerType.includes("Points")) return "#3B82F6";
    return "#EC4899";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-4 my-4"
    >
      {/* Header Card */}
      <Card
        className="p-4 border border-purple-200 shadow-sm"
        style={{ backgroundColor: "#FAF5FF" }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-lg shadow-md flex-shrink-0 text-2xl"
            style={{ backgroundColor: getOfferTypeColor() }}
          >
            {getOfferTypeIcon()}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Configure Your Offer
            </h3>
            <p className="text-xs text-gray-600">
              {offerType} •{" "}
              {programType === "closed_loop"
                ? "Closed Loop (Dealer Network)"
                : "Open Loop (Marketplace)"}
            </p>
          </div>
          <SparklesIcon className="w-5 h-5 text-purple-600" />
        </div>
      </Card>

      {/* Performance Predictions */}
      <Card className="p-4 border border-blue-200 shadow-sm bg-white">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <ChartBarIcon className="w-5 h-5 text-blue-600" />
            <h4 className="text-sm font-semibold text-gray-900">
              Performance Prediction
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Redemption Forecast */}
            <div>
              <p className="text-xs text-gray-600 mb-2">
                Expected Redemptions (4-week campaign)
              </p>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 10 }}
                    stroke="#9CA3AF"
                  />
                  <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="redemptions"
                    stroke="#059669"
                    strokeWidth={2}
                    dot={{ fill: "#059669", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* ROI Projection */}
            <div>
              <p className="text-xs text-gray-600 mb-2">ROI Projection</p>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={roiData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    stroke="#9CA3AF"
                  />
                  <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                    }}
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="p-2 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-gray-600">Expected ROI</p>
              <p className="text-lg font-bold text-green-600">2.8x</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-600">Redemption Rate</p>
              <p className="text-lg font-bold text-blue-600">
                {Math.min(Math.floor((parseFloat(value) || 15) * 1.5), 45)}%
              </p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs text-gray-600">Incremental Revenue</p>
              <p className="text-lg font-bold text-purple-600">
                ${((parseFloat(value) || 15) * 1.2 * 1000).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Configuration Form */}
      <Card className="p-4 border border-gray-200 shadow-sm bg-white">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          Offer Configuration
        </h4>
        <div className="space-y-4">
          {/* Offer Value */}
          <div>
            <Label htmlFor="value" className="text-xs text-gray-700">
              {offerType.includes("Percentage")
                ? "Discount Percentage (%)"
                : offerType.includes("Fixed")
                  ? "Discount Amount ($)"
                  : offerType.includes("Points")
                    ? "Points Value"
                    : "Offer Value"}
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="text-sm"
                placeholder="15"
              />
              {offerType.includes("Percentage") && (
                <span className="text-sm text-gray-600">%</span>
              )}
              {offerType.includes("Fixed") && (
                <span className="text-sm text-gray-600">$</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Adjust this value to see updated predictions above
            </p>
          </div>

          {/* Offer Title */}
          <div>
            <Label htmlFor="title" className="text-xs text-gray-700">
              Offer Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm mt-1"
              placeholder="e.g., Q4 Parts Sale - 15% Off"
            />
          </div>

          {/* Offer Description */}
          <div>
            <Label htmlFor="description" className="text-xs text-gray-700">
              Offer Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-sm mt-1"
              placeholder="Describe your offer in detail..."
              rows={3}
            />
          </div>

          {/* Terms & Conditions */}
          <div>
            <Label htmlFor="terms" className="text-xs text-gray-700">
              Terms & Conditions
            </Label>
            <Textarea
              id="terms"
              value={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e.target.value)}
              className="text-sm mt-1"
              placeholder="Enter terms and conditions..."
              rows={2}
            />
          </div>

          {/* Redemption Method */}
          <div>
            <Label htmlFor="redemption" className="text-xs text-gray-700">
              Redemption Method
            </Label>
            <select
              id="redemption"
              value={redemptionMethod}
              onChange={(e) => setRedemptionMethod(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="promo_code">Promo Code</option>
              <option value="show_and_save">Show & Save (QR Code)</option>
              <option value="barcode">Barcode Scan</option>
              <option value="online_link">Online Link</option>
            </select>
          </div>

          {/* Asset Upload */}
          <div>
            <Label htmlFor="assets" className="text-xs text-gray-700">
              Brand Assets (Optional)
            </Label>
            <div
              onClick={() => document.getElementById("assets")?.click()}
              className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer"
            >
              <PhotoIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-xs text-gray-600">
                Click to upload images or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, SVG up to 10MB
              </p>
            </div>
            <input
              id="assets"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  setAssets(Array.from(e.target.files));
                }
              }}
            />
            {assets.length > 0 && (
              <p className="text-xs text-green-600 mt-2">
                ✓ {assets.length} file(s) uploaded
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Redemption Channel Distribution */}
      <Card className="p-4 border border-indigo-200 shadow-sm bg-white">
        <div className="flex items-center gap-2 mb-3">
          <ArrowTrendingUpIcon className="w-5 h-5 text-indigo-600" />
          <h4 className="text-sm font-semibold text-gray-900">
            Expected Redemption Channels
          </h4>
        </div>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={redemptionBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {redemptionBreakdown.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button
          onClick={handleSubmit}
          className="flex-1 text-white shadow-sm"
          style={{
            background: "linear-gradient(to right, #2563EB, #4F46E5)",
          }}
        >
          <CheckCircleIcon className="w-4 h-4 mr-2" />
          Continue to Campaign Setup
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="px-6 border-gray-300 hover:bg-gray-50 text-gray-700"
        >
          Cancel
        </Button>
      </div>
    </motion.div>
  );
}
