"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Home,
  GraduationCap,
  Hammer,
  Plane,
  Heart,
  TrendingUp,
  Users,
  DollarSign,
  ArrowRight,
  BarChart3,
  Activity,
} from "lucide-react";

interface JourneyCard {
  id: string;
  title: string;
  customerVolume: string;
  revenuePotential: string;
  icon: React.ElementType;
  color: string;
  trendData?: number[];
  growthRate?: string;
  confidence?: number;
}

interface JourneyOpportunityCardsProps {
  cards: JourneyCard[];
  onCardSelect?: (cardId: string) => void;
  isVisible: boolean;
}

// Mini trend chart component
const MiniTrendChart = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  return (
    <div className="flex items-end gap-0.5 h-8 w-16">
      {data.map((value, index) => {
        const height = range === 0 ? 50 : ((value - min) / range) * 100;
        return (
          <div
            key={index}
            className={`${color} rounded-sm opacity-70 transition-all duration-300 group-hover:opacity-100`}
            style={{
              height: `${Math.max(height, 10)}%`,
              width: `${100 / data.length}%`,
            }}
          />
        );
      })}
    </div>
  );
};

export function JourneyOpportunityCards({
  cards,
  onCardSelect,
  isVisible,
}: JourneyOpportunityCardsProps) {
  console.log("🎯 JourneyOpportunityCards render:", {
    cards,
    isVisible,
    cardsLength: cards?.length,
  });

  if (!isVisible) {
    console.log("🎯 JourneyOpportunityCards not visible, returning null");
    return null;
  }

  if (!cards || cards.length === 0) {
    console.log("🎯 JourneyOpportunityCards no cards data");
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-red-200">
        <h2 className="text-2xl font-bold text-red-900">
          NO CARDS DATA - Debug Mode
        </h2>
        <p>Cards: {JSON.stringify(cards)}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          High-Value Customer Journeys
        </h2>
        <p className="text-gray-600">
          AI-discovered opportunities from the last 90 days
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl w-full">
        {cards.map((card, index) => {
          const IconComponent = card.icon;

          return (
            <Card
              key={card.id}
              className={`group cursor-pointer transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-1 border-2 hover:border-blue-300 animate-fade-in opacity-0`}
              style={{
                animationDelay: `${index * 300}ms`,
                animationDuration: "800ms",
                animationFillMode: "forwards",
              }}
              onClick={() => onCardSelect?.(card.id)}
            >
              <CardContent className="p-6">
                {/* Header with Icon and Trend */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  {/* Mini Trend Chart */}
                  {card.trendData && (
                    <div className="flex flex-col items-end">
                      <MiniTrendChart
                        data={card.trendData}
                        color={card.color
                          .replace("bg-", "bg-")
                          .replace("-500", "-400")}
                      />
                      {card.growthRate && (
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">
                            {card.growthRate}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 mb-4 text-sm leading-tight">
                  {card.title}
                </h3>

                {/* Metrics Grid */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Volume</p>
                      <p className="text-sm font-medium text-gray-900">
                        {card.customerVolume}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Revenue Potential</p>
                      <p className="text-sm font-medium text-gray-900">
                        {card.revenuePotential}
                      </p>
                    </div>
                  </div>

                  {/* Confidence Score */}
                  {card.confidence && (
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">AI Confidence</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${card.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-900">
                            {card.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Indicator */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-100 text-blue-700 text-xs">
                      High Confidence
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Click on any journey to explore campaign opportunities
        </p>
      </div>
    </div>
  );
}
