"use client";

import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  ChartContainer as Chart,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface CoverageDonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
  percentage: number;
  showTooltip?: boolean;
  className?: string;
  height?: number;
}

export function CoverageDonutChart({
  percentage,
  showTooltip = true,
  className,
  height = 180,
  ...props
}: CoverageDonutChartProps) {
  // Calculate the remaining portion to make a complete circle
  const remaining = 100 - percentage;

  // Create data array for the pie chart
  const data = [
    { name: "Coverage", value: percentage },
    { name: "Uncovered", value: remaining },
  ];

  // Determine color based on coverage percentage
  const getCoverageColor = () => {
    if (percentage >= 50) return "hsl(142, 76%, 36%)"; // Green
    if (percentage >= 20) return "hsl(43, 96%, 58%)"; // Yellow
    return "hsl(0, 84%, 60%)"; // Red
  };

  const chartConfig = {
    covered: {
      color: getCoverageColor(),
      label: "Coverage",
    },
    uncovered: {
      color: "hsl(220, 14%, 96%)",
      label: "Uncovered",
    },
  };

  return (
    <div
      className={cn(
        "w-full overflow-visible flex justify-center items-center",
        className
      )}
      style={{ height }}
      {...props}
    >
      <Chart config={chartConfig} className="!aspect-square">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Pie
              data={data}
              innerRadius="65%"
              outerRadius="85%"
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              <Cell key="cell-0" fill={getCoverageColor()} />
              <Cell key="cell-1" fill="hsl(220, 14%, 96%)" />
            </Pie>
            {showTooltip && (
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [`${value}%`, name]}
                  />
                }
              />
            )}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground font-medium text-xl"
            >
              {percentage}%
            </text>
          </PieChart>
        </ResponsiveContainer>
      </Chart>
    </div>
  );
}
