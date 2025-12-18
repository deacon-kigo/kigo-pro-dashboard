"use client";

import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  ChartContainer as Chart,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface CategoryPieChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  showTooltip?: boolean;
  showLegend?: boolean;
  className?: string;
  height?: number;
}

export function CategoryPieChart({
  data,
  showTooltip = true,
  showLegend = false,
  className,
  height = 180,
  ...props
}: CategoryPieChartProps) {
  // Enhanced color palette for categories
  const COLORS = [
    "#3b82f6", // Blue
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#f43f5e", // Red
    "#f97316", // Orange
    "#10b981", // Green
    "#06b6d4", // Cyan
    "#84cc16", // Lime
  ];

  // Create a config object for the chart
  const chartConfig = data.reduce((config, item, index) => {
    const colorIndex = index % COLORS.length;
    return {
      ...config,
      [`category-${index}`]: {
        color: COLORS[colorIndex],
        label: item.name,
      },
    };
  }, {});

  return (
    <div
      className={cn("w-full overflow-visible", className)}
      style={{ height }}
      {...props}
    >
      <Chart config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={showLegend ? 60 : 75}
              dataKey="percentage"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            {showTooltip && (
              <Tooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      `${value}% (${data.find((d) => d.name === name)?.count.toLocaleString() || 0} offers)`,
                      name,
                    ]}
                  />
                }
              />
            )}
            {showLegend && (
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ fontSize: 12, paddingLeft: 20 }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </Chart>
    </div>
  );
}
