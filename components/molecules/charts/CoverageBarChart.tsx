"use client";

import * as React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  ChartContainer as Chart,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface CoverageBarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  showTooltip?: boolean;
  className?: string;
  height?: number;
}

export function CoverageBarChart({
  data,
  showTooltip = true,
  className,
  height = 200,
  ...props
}: CoverageBarChartProps) {
  const chartConfig = {
    region: {
      // Blue with transparency
      theme: {
        light: "hsla(216, 85%, 60%, 0.9)",
        dark: "hsla(216, 85%, 60%, 0.9)",
      },
      label: "Offers per Region",
    },
  };

  return (
    <div
      className={cn("w-full overflow-hidden rounded-lg", className)}
      style={{ height: height }}
      {...props}
    >
      <Chart config={chartConfig}>
        <RechartsBarChart data={data} layout="vertical" barCategoryGap={8}>
          <CartesianGrid horizontal stroke="#f0f0f0" strokeDasharray="3 3" />
          <XAxis
            type="number"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              // Format large numbers with K suffix
              return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value;
            }}
          />
          <YAxis
            type="category"
            dataKey="name"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            width={60}
          />
          {showTooltip && (
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    `${Number(value).toLocaleString()} offers`,
                    name,
                  ]}
                />
              }
            />
          )}
          <Bar
            dataKey="count"
            radius={[0, 4, 4, 0]}
            className="fill-[--color-region]"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} className="fill-[--color-region]" />
            ))}
          </Bar>
        </RechartsBarChart>
      </Chart>
    </div>
  );
}
