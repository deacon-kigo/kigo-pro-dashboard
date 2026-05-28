"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import Progress from "@/components/atoms/Progress/Progress";

const performanceData = [
  { month: "Jan", impressions: 45, clicks: 22 },
  { month: "Feb", impressions: 62, clicks: 35 },
  { month: "Mar", impressions: 80, clicks: 48 },
  { month: "Apr", impressions: 55, clicks: 30 },
];

const campaignMix = [
  { name: "Airdrop", count: 3, color: "#328FE5", percent: 38 },
  { name: "Marketplace Placement", count: 3, color: "#7c3aed", percent: 38 },
  { name: "Email", count: 2, color: "#0891b2", percent: 25 },
];

export default function V2CampaignCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {/* Campaign Performance Bar Chart */}
      <Card className="lg:col-span-2">
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Campaign Performance
            </h3>
            <select className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={performanceData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend
                iconSize={10}
                wrapperStyle={{ fontSize: 12, color: "#6b7280" }}
              />
              <Bar
                dataKey="impressions"
                name="Impressions"
                fill="#328FE5"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="clicks"
                name="Clicks"
                fill="#dbeafe"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Campaign Mix */}
      <Card>
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Campaign Mix
          </h3>
          <div className="flex flex-col gap-4">
            {campaignMix.map((item, idx) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
                <Progress
                  value={item.percent}
                  size="sm"
                  color={idx === 0 ? "primary" : idx === 1 ? "info" : "info"}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
