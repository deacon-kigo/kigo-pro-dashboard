"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Building2,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle,
  Plus,
  Target,
  Zap,
} from "lucide-react";

interface Partner {
  id: string;
  name: string;
  category: string;
  logo: string;
  revenuePerCustomer: string;
  conversionRate: string;
  tier: "premium" | "standard" | "emerging";
  description: string;
  isRecommended?: boolean;
}

interface PartnerNetworkUIProps {
  selectedGift: string;
  giftAmount: number;
  onNetworkConfirm: (
    selectedPartners: string[],
    projectedRevenue: number
  ) => void;
  className?: string;
}

const PARTNER_NETWORK: Partner[] = [
  {
    id: "home-depot",
    name: "The Home Depot",
    category: "Home Improvement",
    logo: "🏠",
    revenuePerCustomer: "$32-58",
    conversionRate: "78%",
    tier: "premium",
    description: "Leading home improvement retailer with nationwide coverage",
    isRecommended: true,
  },
  {
    id: "lowes",
    name: "Lowe's",
    category: "Home Improvement",
    logo: "🔨",
    revenuePerCustomer: "$28-52",
    conversionRate: "72%",
    tier: "premium",
    description: "Major home improvement chain with strong DIY focus",
  },
  {
    id: "best-buy",
    name: "Best Buy",
    category: "Electronics",
    logo: "📱",
    revenuePerCustomer: "$45-89",
    conversionRate: "65%",
    tier: "premium",
    description: "Electronics retailer for home setup needs",
    isRecommended: true,
  },
  {
    id: "wayfair",
    name: "Wayfair",
    category: "Furniture & Decor",
    logo: "🛋️",
    revenuePerCustomer: "$38-72",
    conversionRate: "58%",
    tier: "standard",
    description: "Online furniture and home goods marketplace",
  },
  {
    id: "taskrabbit",
    name: "TaskRabbit",
    category: "Home Services",
    logo: "/logos/task-rabbit_logo.svg",
    revenuePerCustomer: "$25-45",
    conversionRate: "82%",
    tier: "standard",
    description: "On-demand home services and handyman platform",
    isRecommended: true,
  },
  {
    id: "yelp",
    name: "Yelp",
    category: "Local Discovery",
    logo: "⭐",
    revenuePerCustomer: "$15-28",
    conversionRate: "89%",
    tier: "emerging",
    description: "Local business discovery and reviews platform",
  },
];

const TIER_COLORS = {
  premium: "bg-purple-100 text-purple-700 border-purple-200",
  standard: "bg-blue-100 text-blue-700 border-blue-200",
  emerging: "bg-green-100 text-green-700 border-green-200",
};

export function PartnerNetworkUI({
  selectedGift,
  giftAmount,
  onNetworkConfirm,
  className = "",
}: PartnerNetworkUIProps) {
  const [selectedPartners, setSelectedPartners] = useState<string[]>(
    PARTNER_NETWORK.filter((p) => p.isRecommended).map((p) => p.id)
  );
  const [view, setView] = useState<"overview" | "selection">("overview");

  const togglePartner = (partnerId: string) => {
    setSelectedPartners((prev) =>
      prev.includes(partnerId)
        ? prev.filter((id) => id !== partnerId)
        : [...prev, partnerId]
    );
  };

  const calculateProjectedRevenue = () => {
    const selectedPartnerData = PARTNER_NETWORK.filter((p) =>
      selectedPartners.includes(p.id)
    );
    const avgRevenue = selectedPartnerData.reduce((sum, partner) => {
      const [min, max] = partner.revenuePerCustomer
        .replace("$", "")
        .split("-")
        .map(Number);
      return sum + (min + max) / 2;
    }, 0);
    return Math.round(avgRevenue);
  };

  const handleConfirm = () => {
    const projectedRevenue = calculateProjectedRevenue();
    onNetworkConfirm(selectedPartners, projectedRevenue);
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Partner Network Configuration
        </h3>
        <p className="text-gray-600 text-sm">
          Select partners to maximize revenue from your ${giftAmount} welcome
          campaign
        </p>
      </div>

      {/* Overview */}
      {view === "overview" && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Recommended Partner Network
            </h4>
            <p className="text-gray-600 text-sm">
              AI-selected partners optimized for new homeowner campaigns
            </p>
          </div>

          {/* Revenue Projection */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ${calculateProjectedRevenue()}
              </div>
              <p className="text-sm text-gray-600">
                Projected revenue per customer
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {selectedPartners.length}
                </div>
                <p className="text-xs text-gray-600">Active Partners</p>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">74%</div>
                <p className="text-xs text-gray-600">Avg Weekly Redemptions</p>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">+33%</div>
                <p className="text-xs text-gray-600">Expected ROI</p>
              </div>
            </div>
          </div>

          {/* Selected Partners Preview */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              Selected Partners ({selectedPartners.length})
            </h5>
            <div className="grid grid-cols-3 gap-3">
              {PARTNER_NETWORK.filter((partner) =>
                selectedPartners.includes(partner.id)
              ).map((partner) => (
                <div
                  key={partner.id}
                  className="text-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-2xl mb-1">{partner.logo}</div>
                  <p className="text-xs font-medium text-gray-700">
                    {partner.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {partner.revenuePerCustomer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setView("selection")}
              className="flex-1"
            >
              <Plus className="w-4 h-4 mr-2" />
              Customize Partners
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Launch Campaign →
            </Button>
          </div>
        </div>
      )}

      {/* Partner Selection */}
      {view === "selection" && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Select Partner Network
            </h4>
            <p className="text-gray-600 text-sm">
              Choose partners that align with your campaign goals
            </p>
          </div>

          {/* Partner Grid */}
          <div className="space-y-4">
            {PARTNER_NETWORK.map((partner) => {
              const isSelected = selectedPartners.includes(partner.id);

              return (
                <Card
                  key={partner.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? "ring-2 ring-green-500 bg-green-50 border-green-200"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => togglePartner(partner.id)}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <div className="text-3xl">{partner.logo}</div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-semibold text-gray-900">
                            {partner.name}
                          </h5>
                          {partner.isRecommended && (
                            <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                              <Zap className="w-3 h-3 mr-1" />
                              Recommended
                            </Badge>
                          )}
                          <Badge
                            className={`text-xs ${TIER_COLORS[partner.tier]}`}
                          >
                            {partner.tier}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {partner.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-green-600" />
                            <span className="text-gray-700">
                              {partner.revenuePerCustomer}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-blue-600" />
                            <span className="text-gray-700">
                              {partner.conversionRate}
                            </span>
                          </div>
                          <Badge className="bg-gray-100 text-gray-700 text-xs">
                            {partner.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Revenue Update */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  ${calculateProjectedRevenue()} per customer
                </div>
                <p className="text-sm text-gray-600">
                  Projected revenue with {selectedPartners.length} partners
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-700">
                {selectedPartners.length} selected
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setView("overview")}
              className="flex-1"
            >
              ← Back to Overview
            </Button>
            <Button
              onClick={() => setView("overview")}
              disabled={selectedPartners.length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Save Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
