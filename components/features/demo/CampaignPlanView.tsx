"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  Mail,
  TrendingUp,
  Home,
  Wrench,
  UtensilsCrossed,
  Sparkles,
  Users,
  DollarSign,
  Clock,
} from "lucide-react";

interface CampaignPlanViewProps {
  isVisible: boolean;
  campaignData?: {
    title: string;
    type: string;
    segment?: string;
  };
}

export function CampaignPlanView({
  isVisible,
  campaignData,
}: CampaignPlanViewProps) {
  if (!isVisible) return null;

  const offerOptions = [
    {
      id: "home-depot",
      title: "$100 Home Depot Gift Card",
      insight:
        "78% of new homeowners visit a home improvement store within 30 days of moving.",
      icon: Home,
      color: "bg-orange-500",
      image: "🏠",
    },
    {
      id: "cleaning",
      title: "Professional Home Cleaning Service",
      insight:
        "65% of relocating families hire a cleaning service within their first month.",
      icon: Sparkles,
      color: "bg-blue-500",
      image: "✨",
    },
    {
      id: "dining",
      title: "$100 Williams Sonoma",
      insight:
        "84% of new residents explore local dining options within the first two weeks.",
      icon: UtensilsCrossed,
      color: "bg-green-500",
      image: "🍽️",
    },
  ];

  const customerJourney = [
    {
      icon: Gift,
      title: "Gift Selection",
      description:
        "Customer receives an in-app notification to select their gift.",
      color: "bg-purple-500",
    },
    {
      icon: Mail,
      title: "Gift Delivery",
      description:
        "The digital gift card or voucher is delivered instantly to their Kigo Hub.",
      color: "bg-blue-500",
    },
    {
      icon: TrendingUp,
      title: "Follow-Up",
      description:
        "After 30 days, Kigo automatically presents relevant offers for home services and furnishings.",
      color: "bg-green-500",
    },
  ];

  const partnerLogos = [
    { name: "The Home Depot", logo: "🏠" },
    { name: "Lowe's", logo: "🔨" },
    { name: "Best Buy", logo: "📱" },
    { name: "Wayfair", logo: "🛋️" },
    { name: "Staybridge Suites", logo: "🏨" },
    { name: "Yelp", logo: "⭐" },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 p-8 overflow-y-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          New Homeowner Welcome Campaign
        </h1>
        <p className="text-gray-600">
          AI-powered campaign strategy for mortgage team revenue growth
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <Badge className="bg-green-100 text-green-700">Ready to Launch</Badge>
          <Badge className="bg-blue-100 text-blue-700">
            High ROI Potential
          </Badge>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section 1: The Offer */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-6 h-6 text-purple-600" />
              Section 1: The Offer - A $100 Congratulatory Gift
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offerOptions.map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <div
                    key={option.id}
                    className="group cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    <Card className="h-full border-2 hover:border-indigo-300 hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        {/* Image/Icon */}
                        <div className="text-6xl mb-4">{option.image}</div>

                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 mb-3">
                          {option.title}
                        </h3>

                        {/* Insight */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Insight:</span>{" "}
                            {option.insight}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Customer Experience */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Section 2: The Customer Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {customerJourney.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="flex-1 text-center">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Arrow (except for last item) */}
                    {index < customerJourney.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-8">
                        <div className="w-full h-0.5 bg-gray-300 relative">
                          <div className="absolute right-0 top-0 w-0 h-0 border-l-4 border-l-gray-300 border-t-2 border-b-2 border-t-transparent border-b-transparent transform -translate-y-1/2"></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Brand Partnership Network */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-6 h-6 text-green-600" />
              Section 3: Our Brand Partnership Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {partnerLogos.map((partner, index) => (
                <div
                  key={index}
                  className="group cursor-pointer transition-all duration-300 hover:scale-110"
                >
                  <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center">
                    <div className="text-3xl mb-2">{partner.logo}</div>
                    <p className="text-xs font-medium text-gray-700">
                      {partner.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campaign Metrics */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              Expected Campaign Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  $2.4M
                </div>
                <p className="text-sm text-gray-600">Projected Revenue</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">67%</div>
                <p className="text-sm text-gray-600">Expected Engagement</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  4.2x
                </div>
                <p className="text-sm text-gray-600">ROI Multiplier</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  30
                </div>
                <p className="text-sm text-gray-600">Days to Launch</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
