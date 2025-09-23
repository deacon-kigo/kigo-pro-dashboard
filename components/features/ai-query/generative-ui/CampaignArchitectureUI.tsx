/**
 * Campaign Architecture UI Component
 *
 * Step 3 of Tucker Williams' campaign creation workflow
 * Shows phase-based campaign structure with partner networks and revenue per customer
 */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Truck,
  Plane,
  Home,
  MapPin,
  DollarSign,
  Users,
  ArrowRight,
  Building2,
  Percent,
  Calendar,
  Network,
} from "lucide-react";

interface CampaignPhase {
  id: string;
  name: string;
  timeline: string;
  icon: React.ReactNode;
  color: string;
  adFunded: Array<{ partner: string; revenue: string }>;
  merchant: Array<{ category: string; commission: string }>;
  totalRevenue: string;
  description: string;
}

interface CampaignArchitectureUIProps {
  onActivateNetwork?: () => void;
}

export default function CampaignArchitectureUI({
  onActivateNetwork,
}: CampaignArchitectureUIProps) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const campaignPhases: CampaignPhase[] = [
    {
      id: "phase-1",
      name: "Moving Logistics",
      timeline: "Weeks 3-4",
      icon: <Truck className="w-5 h-5" />,
      color: "bg-blue-500",
      adFunded: [
        { partner: "U-Haul", revenue: "$25" },
        { partner: "Two Men and a Truck", revenue: "$18" },
      ],
      merchant: [
        { category: "Local movers", commission: "12%" },
        { category: "Storage", commission: "15%" },
      ],
      totalRevenue: "$32-58",
      description:
        "Target customers during the moving logistics phase with moving services and storage solutions",
    },
    {
      id: "phase-2",
      name: "Travel + Transition",
      timeline: "Weeks 5-6",
      icon: <Plane className="w-5 h-5" />,
      color: "bg-green-500",
      adFunded: [
        { partner: "Southwest", revenue: "$25" },
        { partner: "Hilton", revenue: "$20" },
        { partner: "National", revenue: "$12" },
      ],
      merchant: [
        { category: "Local hotels", commission: "8%" },
        { category: "Restaurants", commission: "10%" },
      ],
      totalRevenue: "$28-52",
      description:
        "Engage customers during travel and transition with accommodation and dining offers",
    },
    {
      id: "phase-3",
      name: "Home Setup",
      timeline: "Weeks 7-8",
      icon: <Home className="w-5 h-5" />,
      color: "bg-purple-500",
      adFunded: [
        { partner: "Home Depot", revenue: "$22" },
        { partner: "Best Buy", revenue: "$18" },
        { partner: "West Elm", revenue: "$15" },
      ],
      merchant: [
        { category: "Local furniture", commission: "12%" },
        { category: "Appliances", commission: "8%" },
      ],
      totalRevenue: "$35-68",
      description:
        "Support home setup phase with furniture, appliances, and home improvement offers",
    },
    {
      id: "phase-4",
      name: "Local Integration",
      timeline: "Weeks 9-12",
      icon: <MapPin className="w-5 h-5" />,
      color: "bg-orange-500",
      adFunded: [
        { partner: "Tourism boards", revenue: "$10" },
        { partner: "Entertainment sponsors", revenue: "$8" },
      ],
      merchant: [
        { category: "12,000+ local businesses", commission: "10-15%" },
      ],
      totalRevenue: "$32-67",
      description:
        "Help customers discover and integrate into their new local community",
    },
  ];

  const networkStats = {
    nationalPartners: 15,
    localMerchants: 12000,
    totalReach: "15 national + 12,000+ local merchants",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-orange-100 flex items-center justify-center">
          <Network className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Campaign Architecture & Partners
          </h3>
          <p className="text-sm text-gray-600">
            Phase-based campaign structure with partner network integration
          </p>
        </div>
      </div>

      {/* Network Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                Partner Network Scale
              </h4>
              <p className="text-sm text-gray-600">{networkStats.totalReach}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {networkStats.nationalPartners}
                </p>
                <p className="text-xs text-gray-600">National Partners</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {networkStats.localMerchants.toLocaleString()}+
                </p>
                <p className="text-xs text-gray-600">Local Merchants</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Phases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaignPhases.map((phase) => {
          const isSelected = selectedPhase === phase.id;

          return (
            <Card
              key={phase.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                isSelected
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300"
              }`}
              onClick={() => setSelectedPhase(isSelected ? null : phase.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${phase.color} flex items-center justify-center text-white`}
                  >
                    {phase.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      {phase.name}
                      <Badge variant="outline" className="text-xs">
                        {phase.timeline}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {phase.description}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Revenue Summary */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Revenue per Customer
                      </span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {phase.totalRevenue}
                    </span>
                  </div>

                  {/* Ad-Funded Partners */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      Ad-Funded Partners
                    </h5>
                    <div className="space-y-1">
                      {phase.adFunded.map((partner, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-600">
                            {partner.partner}
                          </span>
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            {partner.revenue}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Merchant Partnerships */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                      <Percent className="w-4 h-4" />
                      Merchant Partnerships
                    </h5>
                    <div className="space-y-1">
                      {phase.merchant.map((merchant, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-600">
                            {merchant.category}
                          </span>
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            {merchant.commission}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="pt-3 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Configure phase:", phase.id);
                        }}
                      >
                        Configure Phase Details
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Timeline Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Campaign Timeline Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-300"></div>

            <div className="space-y-6">
              {campaignPhases.map((phase, index) => (
                <div key={phase.id} className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full ${phase.color} flex items-center justify-center text-white z-10 relative`}
                  >
                    {phase.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {phase.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {phase.timeline}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {phase.totalRevenue}
                        </p>
                        <p className="text-xs text-gray-500">per customer</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Campaign Projection */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Total Revenue Range
              </h4>
              <p className="text-3xl font-bold text-green-600">$127-245</p>
              <p className="text-xs text-gray-500">
                per customer across all phases
              </p>
            </div>
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Target Customers
              </h4>
              <p className="text-3xl font-bold text-blue-600">567</p>
              <p className="text-xs text-gray-500">
                customers/month nationwide
              </p>
            </div>
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Monthly Potential
              </h4>
              <p className="text-3xl font-bold text-purple-600">$72K-139K</p>
              <p className="text-xs text-gray-500">
                immediate revenue opportunity
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button
          onClick={onActivateNetwork}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
          size="lg"
        >
          Activate Full Partner Network
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
