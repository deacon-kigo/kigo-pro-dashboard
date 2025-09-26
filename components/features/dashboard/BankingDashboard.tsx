"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Brain,
  Zap,
  MessageCircle,
  Gift,
  Award,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ABCFIRewardsDashboardProps {
  activeMembers?: string;
  engagementRate?: string;
  offersRedeemed?: string;
  partnerFundedValue?: string;
}

export function BankingDashboard({
  activeMembers = "1.2M",
  engagementRate = "34%",
  offersRedeemed = "89,543",
  partnerFundedValue = "$215,780",
}: ABCFIRewardsDashboardProps) {
  const [engagementData, setEngagementData] = useState<number[]>([]);

  // Generate sample 90-day engagement trend data
  useEffect(() => {
    const generateEngagementData = () => {
      const data = [];
      for (let i = 0; i < 90; i++) {
        // Generate trending upward data with some variance
        const baseValue = 25 + i * 0.1; // Gradual increase
        const variance = Math.random() * 8 - 4; // ±4% variance
        data.push(Math.max(20, Math.min(40, baseValue + variance)));
      }
      return data;
    };
    setEngagementData(generateEngagementData());
  }, []);

  // Simple SVG line chart component
  const EngagementChart = ({ data }: { data: number[] }) => {
    if (data.length === 0)
      return <div className="h-32 bg-gray-100 rounded animate-pulse" />;

    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;

    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 300;
        const y = 100 - ((value - minValue) / range) * 80;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div className="h-32 w-full">
        <svg viewBox="0 0 300 100" className="w-full h-full">
          <defs>
            <linearGradient
              id="engagementGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2"
            points={points}
          />
          <polyline
            fill="url(#engagementGradient)"
            stroke="none"
            points={`0,100 ${points} 300,100`}
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header - ABC FI Rewards Program */}
      <div className="relative overflow-hidden rounded-lg border border-gray-200 p-6 bg-white shadow-sm">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-50 border border-blue-200">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                ABC FI Rewards Program
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Customer engagement and loyalty dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-50 border border-green-200 text-green-700 px-3 py-1 text-sm font-medium">
              <Zap className="w-4 h-4 mr-2" />
              Live Data
            </Badge>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-4 py-2 text-sm font-medium shadow-sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              AI Assistant
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Active Members
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {activeMembers}
                </p>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-2 bg-green-500" />
                  <p className="text-sm font-medium text-green-600">
                    +8% vs last month
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 border border-blue-200">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Monthly Engagement Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {engagementRate}
                </p>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-2 bg-green-500" />
                  <p className="text-sm font-medium text-green-600">
                    +5% vs last month
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-50 border border-purple-200">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Offers Redeemed (MTD)
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {offersRedeemed}
                </p>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-2 bg-green-500" />
                  <p className="text-sm font-medium text-green-600">
                    +12% vs last month
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-50 border border-orange-200">
                <Gift className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Partner-Funded Value (MTD)
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {partnerFundedValue}
                </p>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-2 bg-green-500" />
                  <p className="text-sm font-medium text-green-600">
                    +18% vs last month
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-50 border border-green-200">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Over Time Chart */}
      <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Engagement Over Time
              </h3>
              <p className="text-sm text-gray-600">
                90-day engagement trend showing steady growth
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-sm text-gray-600">Engagement Rate</span>
            </div>
          </div>
          <EngagementChart data={engagementData} />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        </CardContent>
      </Card>

      {/* Floating Action Button for AI Chat */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
