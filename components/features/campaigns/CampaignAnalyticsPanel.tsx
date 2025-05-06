"use client";

import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PieChart,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/Tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Sample data for charts
const performanceData = [
  { month: "Jan", impressions: 2500, clicks: 320, conversions: 45 },
  { month: "Feb", impressions: 3000, clicks: 380, conversions: 61 },
  { month: "Mar", impressions: 3200, clicks: 450, conversions: 78 },
  { month: "Apr", impressions: 4000, clicks: 520, conversions: 92 },
  { month: "May", impressions: 4800, clicks: 580, conversions: 105 },
  { month: "Jun", impressions: 5200, clicks: 620, conversions: 118 },
];

const audienceData = [
  { name: "18-24", value: 12 },
  { name: "25-34", value: 32 },
  { name: "35-44", value: 27 },
  { name: "45-54", value: 18 },
  { name: "55-64", value: 8 },
  { name: "65+", value: 3 },
];

const locationData = [
  { location: "New York", value: 35 },
  { location: "Los Angeles", value: 28 },
  { location: "Chicago", value: 18 },
  { location: "Houston", value: 12 },
  { location: "Boston", value: 7 },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
];

interface CampaignAnalyticsPanelProps {
  className?: string;
  campaignBudget?: number;
  estimatedReach?: number;
}

export function CampaignAnalyticsPanel({
  className,
  campaignBudget = 5000,
  estimatedReach = 100000,
}: CampaignAnalyticsPanelProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Campaign Analytics</CardTitle>
        <CardDescription>
          Estimated performance metrics for your campaign
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-muted p-3">
              <div className="text-xs font-medium">Budget</div>
              <div className="mt-1 text-xl font-bold">
                ${campaignBudget.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="text-xs font-medium">Est. Reach</div>
              <div className="mt-1 text-xl font-bold">
                {estimatedReach.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="text-xs font-medium">Est. CPA</div>
              <div className="mt-1 text-xl font-bold">
                ${(campaignBudget / (estimatedReach * 0.02)).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Chart Tabs */}
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-4">
              <div className="h-[200px] mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={performanceData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorImpressions"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorClicks"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#82ca9d"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#82ca9d"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="impressions"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorImpressions)"
                    />
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#colorClicks)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs font-medium">
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-[#8884d8]" />
                  <span>Impressions</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-[#82ca9d]" />
                  <span>Clicks</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-[#ffc658]" />
                  <span>Conversions</span>
                </div>
              </div>
            </TabsContent>

            {/* Audience Tab */}
            <TabsContent value="audience">
              <div className="h-[200px] mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={audienceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {audienceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Audience"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                {audienceData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center">
                    <div
                      className="mr-2 h-2 w-2 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>
                      {entry.name}: {entry.value}%
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Location Tab */}
            <TabsContent value="location">
              <div className="h-[200px] mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={locationData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal
                      opacity={0.15}
                    />
                    <XAxis type="number" domain={[0, "dataMax"]} />
                    <YAxis type="category" dataKey="location" />
                    <Tooltip formatter={(value) => [`${value}%`, "Audience"]} />
                    <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                      {locationData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          These metrics are estimated based on similar campaign performance and
          may vary
        </div>
      </CardContent>
    </Card>
  );
}
