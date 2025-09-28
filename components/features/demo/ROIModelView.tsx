"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  Calculator,
  Target,
  Users,
  Percent,
} from "lucide-react";

interface ROIModelViewProps {
  isVisible: boolean;
  campaignData?: {
    title: string;
    type: string;
    segment?: string;
  };
}

export function ROIModelView({ isVisible, campaignData }: ROIModelViewProps) {
  if (!isVisible) return null;

  // ROI Model Data as specified in abc-fi.md Scene 4
  const roiData = {
    inputs: {
      monthlyMortgageClosings: 567,
      costPerGift: 100.0,
      advertiserCoopFunding: 40, // 40%
    },
    outputs: {
      totalMonthlyCost: 56700, // 567 * $100
      netCostToBank: 34020, // $56,700 * (1 - 0.40)
      estimatedIncrementalRevenue: 45360, // 20% of customers take follow-up offer generating ~$400 in value
      projectedMonthlyROI: 33, // (($45,360 - $34,020) / $34,020) * 100
    },
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 p-8 overflow-y-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Projected Monthly ROI: New Homeowner Campaign
        </h1>
        <p className="text-gray-600">
          Financial model for mortgage team incremental revenue
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <Badge className="bg-green-100 text-green-700">+33% ROI</Badge>
          <Badge className="bg-blue-100 text-blue-700">Partner Co-Funded</Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* ROI Calculator Card */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calculator className="w-6 h-6 text-green-600" />
              Campaign ROI Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Column 1: Inputs */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Inputs
                </h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Monthly Mortgage Closings
                        </span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        {roiData.inputs.monthlyMortgageClosings}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Cost Per Gift
                        </span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        ${roiData.inputs.costPerGift.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Advertiser Co-op Funding
                        </span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        {roiData.inputs.advertiserCoopFunding}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Outputs (Calculated) */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Outputs (Calculated)
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Total Monthly Program Cost
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ${roiData.outputs.totalMonthlyCost.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Calculation: {roiData.inputs.monthlyMortgageClosings} × $
                      {roiData.inputs.costPerGift}
                    </p>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Net Cost to Bank
                      </span>
                      <span className="text-lg font-bold text-orange-600">
                        ${roiData.outputs.netCostToBank.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Calculation: $
                      {roiData.outputs.totalMonthlyCost.toLocaleString()} × (1 -
                      0.{roiData.inputs.advertiserCoopFunding})
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Est. Incremental Revenue
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        $
                        {roiData.outputs.estimatedIncrementalRevenue.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Assumption: 20% of customers take follow-up offer
                      generating ~$400 in value
                    </p>
                  </div>

                  {/* ROI Highlight */}
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Projected Monthly ROI
                      </span>
                      <span className="text-2xl font-bold">
                        +{roiData.outputs.projectedMonthlyROI}%
                      </span>
                    </div>
                    <p className="text-xs opacity-90 mt-1">
                      Calculation: (($45,360 - $34,020) / $34,020) × 100
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Insights */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Key Financial Benefits
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    $11,340
                  </div>
                  <p className="text-sm text-gray-600">Monthly Net Profit</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    $136K
                  </div>
                  <p className="text-sm text-gray-600">Annual Revenue Impact</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    3 mins
                  </div>
                  <p className="text-sm text-gray-600">Setup Time vs Weeks</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
