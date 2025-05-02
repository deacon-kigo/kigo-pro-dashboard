"use client";

import * as React from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
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
  // Fixed color palette for categories
  const COLORS = [
    "hsl(215, 100%, 65%)", // Blue
    "hsl(280, 100%, 65%)", // Purple
    "hsl(335, 100%, 65%)", // Pink
    "hsl(10, 100%, 65%)", // Red
    "hsl(40, 100%, 65%)", // Orange
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
      className={cn("w-full overflow-hidden rounded-lg", className)}
      style={{ height }}
      {...props}
    >
      <Chart config={chartConfig}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey="percentage"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                className={`fill-[--color-category-${index}]`}
              />
            ))}
          </Pie>
          {showTooltip && (
            <ChartTooltip
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
              wrapperStyle={{ fontSize: 12 }}
            />
          )}
        </PieChart>
      </Chart>
    </div>
  );
}
