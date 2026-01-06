"use client";

import React from "react";
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import Card from "@/components/atoms/Card/Card";
import {
  Card as ShadcnCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { MemberWithPoints } from "./types";
import { formatPoints, formatUsdCents } from "./utils";

interface PointsAnalyticsPanelProps {
  member: MemberWithPoints;
}

/**
 * PointsAnalyticsPanel - Right panel showing member analytics and charts
 * @classification organism
 */
export default function PointsAnalyticsPanel({
  member,
}: PointsAnalyticsPanelProps) {
  const primaryBalance = member.pointsBalance;
  const hasTransactions = member.transactions && member.transactions.length > 0;

  // Prepare transaction history data for charts
  const transactionData = hasTransactions
    ? member.transactions
        .slice(0, 10)
        .reverse()
        .map((txn) => ({
          date: new Date(txn.transactionDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          points: Math.abs(txn.pointsAmount),
          type: txn.transactionType,
          balanceAfter: txn.balanceAfterPoints,
        }))
    : [];

  // Points breakdown by type
  const earnedTotal = hasTransactions
    ? member.transactions
        .filter((t) => t.transactionType === "earn")
        .reduce((sum, t) => sum + t.pointsAmount, 0)
    : 0;

  const redeemedTotal = hasTransactions
    ? Math.abs(
        member.transactions
          .filter((t) => t.transactionType === "redeem")
          .reduce((sum, t) => sum + t.pointsAmount, 0)
      )
    : 0;

  const adjustedTotal = hasTransactions
    ? member.transactions
        .filter((t) => t.transactionType === "adjust")
        .reduce((sum, t) => sum + t.pointsAmount, 0)
    : 0;

  // Calculate total for normalization
  const totalPoints =
    earnedTotal + redeemedTotal + (primaryBalance?.currentPoints || 0);

  // Points breakdown data with hex colors
  const pointsBreakdown = [
    {
      name: "current",
      label: "Current Balance",
      current: primaryBalance?.currentPoints || 0,
      fill: "#93c5fd",
      darkColor: "#3b82f6",
    },
    ...(earnedTotal > 0
      ? [
          {
            name: "earned",
            label: "Earned",
            earned: earnedTotal,
            fill: "#86efac",
            darkColor: "#22c55e",
          },
        ]
      : []),
    ...(redeemedTotal > 0
      ? [
          {
            name: "redeemed",
            label: "Redeemed",
            redeemed: redeemedTotal,
            fill: "#fdba74",
            darkColor: "#f97316",
          },
        ]
      : []),
  ];

  // Chart config for shadcn charts
  const chartConfig: ChartConfig = {
    earned: {
      label: "Earned",
      color: "#86efac",
    },
    redeemed: {
      label: "Redeemed",
      color: "#fdba74",
    },
    current: {
      label: "Current Balance",
      color: "#93c5fd",
    },
  };

  // Activity by source type
  const activityBySource = hasTransactions
    ? member.transactions.reduce(
        (acc, txn) => {
          const source = txn.sourceType;
          if (!acc[source]) {
            acc[source] = { count: 0, total: 0 };
          }
          acc[source].count += 1;
          acc[source].total += Math.abs(txn.pointsAmount);
          return acc;
        },
        {} as Record<string, { count: number; total: number }>
      )
    : {};

  const activityData = Object.entries(activityBySource).map(
    ([source, data]) => ({
      source: source.charAt(0).toUpperCase() + source.slice(1),
      transactions: data.count,
      points: data.total,
    })
  );

  return (
    <Card className="h-full p-0 flex flex-col overflow-hidden shadow-md">
      {/* Header */}
      <div className="h-[61px] flex-shrink-0 border-b bg-gray-50 flex items-center px-4 py-2">
        <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
        <div>
          <h3 className="font-medium text-gray-900">Member Analytics</h3>
          <p className="text-xs text-gray-500">Points trends</p>
        </div>
      </div>

      {/* Scrollable Content - More compact */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Summary Stats - Stock card style */}
        <div className="grid grid-cols-1 gap-2">
          {/* Total Earned Card */}
          <ShadcnCard className="overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-600 mb-1">
                    Total Earned
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatPoints(member.totalPointsEarned)}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-semibold text-green-600">
                      +{earnedTotal > 0 ? formatPoints(earnedTotal) : "0"}
                    </span>
                    <span className="text-xs text-gray-500">(+6.3%)</span>
                  </div>
                </div>
              </div>
              {/* Mini trend chart */}
              <div className="mt-2 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={transactionData
                      .filter((t) => t.type === "earn")
                      .slice(-7)}
                  >
                    <defs>
                      <linearGradient
                        id="earnGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#22c55e"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#22c55e"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="points"
                      stroke="#22c55e"
                      strokeWidth={1.5}
                      fill="url(#earnGradient)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </ShadcnCard>

          {/* Total Redeemed Card */}
          <ShadcnCard className="overflow-hidden bg-gradient-to-br from-red-50 to-rose-50">
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-600 mb-1">
                    Total Redeemed
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatPoints(member.totalPointsRedeemed)}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-semibold text-red-600">
                      -{redeemedTotal > 0 ? formatPoints(redeemedTotal) : "0"}
                    </span>
                    <span className="text-xs text-gray-500">(-7.1%)</span>
                  </div>
                </div>
              </div>
              {/* Mini trend chart */}
              <div className="mt-2 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={transactionData
                      .filter((t) => t.type === "redeem")
                      .slice(-7)}
                  >
                    <defs>
                      <linearGradient
                        id="redeemGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#ef4444"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ef4444"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="points"
                      stroke="#ef4444"
                      strokeWidth={1.5}
                      fill="url(#redeemGradient)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </ShadcnCard>

          {/* Current Balance Card */}
          <ShadcnCard className="overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-600 mb-1">
                    Current Balance
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatPoints(primaryBalance?.currentPoints || 0)}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-semibold text-blue-600">
                      {formatUsdCents(primaryBalance?.currentUsdCents || 0)}
                    </span>
                    <span className="text-xs text-gray-500">(+10.4%)</span>
                  </div>
                </div>
              </div>
              {/* Mini trend chart for balance over time */}
              <div className="mt-2 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={transactionData.slice(-7)}>
                    <defs>
                      <linearGradient
                        id="balanceGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="balanceAfter"
                      stroke="#3b82f6"
                      strokeWidth={1.5}
                      fill="url(#balanceGradient)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </ShadcnCard>
        </div>

        {/* Points Distribution - Radial Chart */}
        <div
          className="border border-gray-200 rounded-lg p-3"
          style={{ backgroundColor: "#ffffff" }}
        >
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Points Distribution
          </h4>
          <ChartContainer config={chartConfig} className="h-[180px] w-full">
            <RadialBarChart
              data={pointsBreakdown}
              innerRadius="30%"
              outerRadius="100%"
              startAngle={90}
              endAngle={450}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, totalPoints]}
                tick={false}
              />
              <RadialBar dataKey="current" cornerRadius={5} fill="#93c5fd" />
              {earnedTotal > 0 && (
                <RadialBar dataKey="earned" cornerRadius={5} fill="#86efac" />
              )}
              {redeemedTotal > 0 && (
                <RadialBar dataKey="redeemed" cornerRadius={5} fill="#fdba74" />
              )}
            </RadialBarChart>
          </ChartContainer>

          {/* Legend */}
          <div className="space-y-1 mt-2">
            {pointsBreakdown.map((item, index) => {
              const itemValue =
                item.current || item.earned || item.redeemed || 0;
              const percentage =
                totalPoints > 0 ? (itemValue / totalPoints) * 100 : 0;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between px-2 py-1 rounded"
                  style={{ backgroundColor: "#fafafa" }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: item.darkColor }}
                    ></div>
                    <span className="text-xs font-medium text-gray-700">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">
                      {formatPoints(itemValue)}
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: item.darkColor }}
                    >
                      ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transaction Balance History - Compact chassis */}
        <div
          className="border border-gray-200 rounded-lg p-3"
          style={{ backgroundColor: "#ffffff" }}
        >
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Recent History
          </h4>
          {transactionData.length > 0 ? (
            <div className="space-y-1">
              {transactionData.slice(0, 5).map((txn, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1.5 px-2 rounded"
                  style={{
                    backgroundColor: index % 2 === 0 ? "#fafafa" : "#ffffff",
                  }}
                >
                  <div>
                    <div className="text-xs font-semibold text-gray-900">
                      {formatPoints(txn.balanceAfter)}
                    </div>
                    <div className="text-xs text-gray-500">{txn.date}</div>
                  </div>
                  <div
                    className="text-xs font-bold"
                    style={{
                      color:
                        txn.type === "earn"
                          ? "#22c55e"
                          : txn.type === "redeem"
                            ? "#ef4444"
                            : "#eab308",
                    }}
                  >
                    {txn.type === "earn" ? "+" : ""}
                    {formatPoints(txn.points)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <ClockIcon className="h-8 w-8 mx-auto mb-1 text-gray-300" />
              <p className="text-xs text-gray-400">No history</p>
            </div>
          )}
        </div>

        {/* Activity by Source - Compact chart */}
        <div
          className="border border-gray-200 rounded-lg p-3"
          style={{ backgroundColor: "#ffffff" }}
        >
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Activity by Source
          </h4>
          {activityData.length > 0 ? (
            <div className="space-y-2">
              {activityData.map((item, index) => {
                const maxPoints = Math.max(
                  ...activityData.map((d) => d.points)
                );
                const barWidth =
                  maxPoints > 0 ? (item.points / maxPoints) * 100 : 0;

                return (
                  <div
                    key={index}
                    className="rounded-md p-2"
                    style={{ backgroundColor: "#fafafa" }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700 capitalize">
                        {item.source}
                      </span>
                      <div className="text-xs font-semibold text-gray-900">
                        {formatPoints(item.points)}
                      </div>
                    </div>
                    <div
                      className="w-full rounded-full h-2"
                      style={{ backgroundColor: "#e5e7eb" }}
                    >
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: "#93c5fd",
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.transactions} transactions
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-6 text-center">
              <ChartBarIcon className="h-8 w-8 mx-auto mb-1 text-gray-300" />
              <p className="text-xs text-gray-400">No activity</p>
            </div>
          )}
        </div>

        {/* Program Details */}
        {primaryBalance && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Active Program
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Program:</span>
                <span className="font-medium text-blue-900">
                  {primaryBalance.programName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Current Balance:</span>
                <span className="font-medium text-blue-900">
                  {formatPoints(primaryBalance.currentPoints)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">USD Value:</span>
                <span className="font-medium text-blue-900">
                  {formatUsdCents(primaryBalance.currentUsdCents)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Conversion Rate:</span>
                <span className="font-medium text-blue-900">
                  {primaryBalance.conversionRate} pts = $1
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
