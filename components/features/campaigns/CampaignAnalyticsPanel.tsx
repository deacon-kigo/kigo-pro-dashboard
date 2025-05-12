"use client";

import React from "react";
import { CampaignCompletionChecklist } from "./CampaignCompletionChecklist";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Interface definitions for data
export interface CampaignPerformanceData {
  name: string;
  impressions: number;
  engagement: number;
  conversion: number;
}

export interface DemographicData {
  name: string;
  value: number;
}

export interface ChannelData {
  name: string;
  value: number;
}

interface CampaignAnalyticsPanelProps {
  className?: string;
  campaignBudget?: number;
  estimatedReach?: number;
  performanceData?: CampaignPerformanceData[];
  demographicData?: DemographicData[];
  channelData?: ChannelData[];
  isLoading?: boolean;
}

// Sample data for campaign performance chart
const DEFAULT_PERFORMANCE_DATA = [
  { name: "Day 1", impressions: 10000, engagement: 2200, conversion: 180 },
  { name: "Day 2", impressions: 12000, engagement: 2800, conversion: 220 },
  { name: "Day 3", impressions: 18000, engagement: 4000, conversion: 380 },
  { name: "Day 4", impressions: 24000, engagement: 5200, conversion: 480 },
  { name: "Day 5", impressions: 28000, engagement: 6100, conversion: 520 },
  { name: "Day 6", impressions: 32000, engagement: 7000, conversion: 620 },
  { name: "Day 7", impressions: 38000, engagement: 8500, conversion: 780 },
];

// Sample data for demographic breakdown
const DEFAULT_DEMOGRAPHIC_DATA = [
  { name: "18-24", value: 15 },
  { name: "25-34", value: 35 },
  { name: "35-44", value: 25 },
  { name: "45-54", value: 15 },
  { name: "55+", value: 10 },
];

// Colors for the pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

// Sample data for channel distribution
const DEFAULT_CHANNEL_DATA = [
  { name: "Email", value: 35 },
  { name: "Social", value: 25 },
  { name: "Display", value: 20 },
  { name: "Search", value: 15 },
  { name: "In-App", value: 5 },
];

// Performance chart component
const PerformanceChart = ({ data }: { data: CampaignPerformanceData[] }) => {
  return (
    <div className="h-52">
      <ChartContainer
        config={{
          impressions: { color: "rgba(59, 130, 246, 0.5)" },
          engagement: { color: "rgba(16, 185, 129, 0.5)" },
          conversion: { color: "rgba(249, 115, 22, 0.6)" },
        }}
      >
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <ChartTooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-2 border rounded-md shadow-sm">
                    <p className="font-medium text-xs">{label}</p>
                    <div className="text-xs mt-1">
                      <p className="text-blue-600">
                        Impressions: {payload[0].value?.toLocaleString()}
                      </p>
                      <p className="text-green-600">
                        Engagement: {payload[1].value?.toLocaleString()}
                      </p>
                      <p className="text-orange-600">
                        Conversions: {payload[2].value?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="impressions"
            stroke="#3B82F6"
            fill="url(#colorImpressions)"
            stackId="1"
          />
          <Area
            type="monotone"
            dataKey="engagement"
            stroke="#10B981"
            fill="url(#colorEngagement)"
            stackId="2"
          />
          <Area
            type="monotone"
            dataKey="conversion"
            stroke="#F97316"
            fill="url(#colorConversion)"
            stackId="3"
          />
          <ChartLegend
            content={(props) => (
              <div className="flex justify-center gap-4 text-xs mt-1">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-blue-500 opacity-50 mr-1"></div>
                  <span>Impressions</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 opacity-50 mr-1"></div>
                  <span>Engagement</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-orange-500 opacity-60 mr-1"></div>
                  <span>Conversions</span>
                </div>
              </div>
            )}
          />
          <defs>
            <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorConversion" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#F97316" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

// Demographics chart component
const DemographicsChart = ({ data }: { data: DemographicData[] }) => {
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={55}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Audience Share']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Channel distribution chart component
const ChannelChart = ({ data }: { data: ChannelData[] }) => {
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis type="number" domain={[0, 'dataMax + 10']} />
          <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(value) => [`${value}%`, 'Distribution']} />
          <Bar dataKey="value" fill="#8884d8">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export function CampaignAnalyticsPanel({
  className,
  campaignBudget = 5000,
  estimatedReach = 100000,
  performanceData = DEFAULT_PERFORMANCE_DATA,
  demographicData = DEFAULT_DEMOGRAPHIC_DATA,
  channelData = DEFAULT_CHANNEL_DATA,
  isLoading = false,
}: CampaignAnalyticsPanelProps) {
  return (
    <div className={`flex flex-col w-full h-full ${className}`}>
      {/* Header - Fixed at exactly 61px to match AI Assistant header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 mr-2 text-primary"
          >
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6" y2="6"></line>
            <line x1="6" y1="18" x2="6" y2="18"></line>
          </svg>
          <div>
            <h3 className="font-medium">Campaign Summary</h3>
            <p className="text-xs text-muted-foreground">
              Projected metrics based on your campaign setup
            </p>
          </div>
        </div>
      </div>

      {/* Content - Scrollable area with better overflow handling */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Moved to the top as requested */}
        <div className="mb-4">
          <CampaignCompletionChecklist />
        </div>

        <div className="space-y-4">
          {/* Key Metrics at top - More visible */}
          <div className="grid grid-cols-3 gap-3 mb-2">
            <div className="rounded-lg bg-gray-100 p-3">
              <div className="text-xs font-medium text-gray-600">Budget</div>
              <div className="mt-1 text-lg font-bold">
                ${campaignBudget.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-gray-100 p-3">
              <div className="text-xs font-medium text-gray-600">
                Est. Reach
              </div>
              <div className="mt-1 text-lg font-bold">
                {estimatedReach.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-gray-100 p-3">
              <div className="text-xs font-medium text-gray-600">
                Est. CPA
              </div>
              <div className="mt-1 text-lg font-bold">
                ${(campaignBudget / (estimatedReach * 0.02)).toFixed(2)}
              </div>
            </div>
          </div>

          {/* More modular chart system with tabs */}
          <div className="border rounded-lg p-3">
            <Tabs defaultValue="performance" className="w-full">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium">Campaign Analytics</h4>
                <TabsList className="h-8">
                  <TabsTrigger value="performance" className="text-xs h-7">Performance</TabsTrigger>
                  <TabsTrigger value="audience" className="text-xs h-7">Audience</TabsTrigger>
                  <TabsTrigger value="distribution" className="text-xs h-7">Distribution</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="performance" className="mt-0">
                <PerformanceChart data={performanceData} />
              </TabsContent>
              
              <TabsContent value="audience" className="mt-0">
                <div className="text-xs font-medium mb-2">Audience Demographics</div>
                <DemographicsChart data={demographicData} />
              </TabsContent>
              
              <TabsContent value="distribution" className="mt-0">
                <div className="text-xs font-medium mb-2">Distribution Channels</div>
                <ChannelChart data={channelData} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Grid layout for quick access to all visualization types */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="border rounded-md p-3">
              <h5 className="text-xs font-medium mb-2">Performance Snapshot</h5>
              <div className="flex items-center justify-center h-28">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{performanceData[performanceData.length - 1].impressions.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Latest Impressions</div>
                  <div className="text-xl font-bold text-green-600 mt-1">{performanceData[performanceData.length - 1].engagement.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Latest Engagement</div>
                </div>
              </div>
            </div>

            <div className="border rounded-md p-3">
              <h5 className="text-xs font-medium mb-2">Audience Brief</h5>
              <div className="flex flex-col h-28 justify-center">
                {demographicData.slice(0, 2).map((item, index) => (
                  <div key={index} className="flex justify-between items-center mb-1">
                    <div className="text-xs">{item.name}</div>
                    <div className="flex items-center">
                      <div 
                        className="h-2 rounded-full mr-1" 
                        style={{ 
                          width: `${item.value}px`, 
                          backgroundColor: COLORS[index % COLORS.length] 
                        }}
                      ></div>
                      <div className="text-xs font-medium">{item.value}%</div>
                    </div>
                  </div>
                ))}
                <div className="text-xs text-center mt-2 text-muted-foreground">
                  Top 2 demographics shown
                </div>
              </div>
            </div>

            <div className="border rounded-md p-3">
              <h5 className="text-xs font-medium mb-2">Distribution Brief</h5>
              <div className="flex flex-col h-28 justify-center">
                {channelData.slice(0, 2).map((item, index) => (
                  <div key={index} className="flex justify-between items-center mb-1">
                    <div className="text-xs">{item.name}</div>
                    <div className="flex items-center">
                      <div 
                        className="h-2 rounded-full mr-1" 
                        style={{ 
                          width: `${item.value}px`, 
                          backgroundColor: COLORS[index % COLORS.length] 
                        }}
                      ></div>
                      <div className="text-xs font-medium">{item.value}%</div>
                    </div>
                  </div>
                ))}
                <div className="text-xs text-center mt-2 text-muted-foreground">
                  Top 2 channels shown
                </div>
              </div>
            </div>
          </div>

          {/* Targeting Recommendations - Compacted */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-3">
            <h4 className="text-sm font-medium mb-2 text-blue-800">
              Targeting Recommendations
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 rounded-full bg-blue-200 flex-shrink-0 mt-0.5 flex items-center justify-center">
                  <svg
                    className="h-2.5 w-2.5 text-blue-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs text-blue-800">
                  Add geographic targeting for up to 40% better relevance
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 rounded-full bg-blue-200 flex-shrink-0 mt-0.5 flex items-center justify-center">
                  <svg
                    className="h-2.5 w-2.5 text-blue-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs text-blue-800">
                  Target 25-34 age group for maximum engagement
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 rounded-full bg-blue-200 flex-shrink-0 mt-0.5 flex items-center justify-center">
                  <svg
                    className="h-2.5 w-2.5 text-blue-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs text-blue-800">
                  Combine geo + demographic targeting to reduce CPA
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 text-center text-xs text-muted-foreground">
          Metrics estimated based on similar campaigns and may vary
        </div>
      </div>
    </div>
  );
}
