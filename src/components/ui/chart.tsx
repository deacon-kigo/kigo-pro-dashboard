'use client'

import { cn } from "@/lib/utils"
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  Chart,
} from 'chart.js'
import { cva, type VariantProps } from "class-variance-authority"
import { HTMLAttributes, forwardRef } from "react"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

// Create chart container variant styles
const chartVariants = cva(
  "w-full h-full flex items-center justify-center rounded-md border border-border bg-card p-2 text-card-foreground",
  {
    variants: {
      size: {
        default: "min-h-[300px]",
        sm: "min-h-[200px]",
        lg: "min-h-[400px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface ChartProps 
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chartVariants> {
  data: ChartData<any>;
  options?: ChartOptions<any>;
}

// Chart container component
const ChartContainer = forwardRef<HTMLDivElement, ChartProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(chartVariants({ size }), className)}
        {...props}
      />
    )
  }
)
ChartContainer.displayName = "ChartContainer"

// Line chart component
export const LineChart = forwardRef<HTMLDivElement, ChartProps>(
  ({ data, options, className, size, ...props }, ref) => {
    return (
      <ChartContainer ref={ref} className={className} size={size} {...props}>
        <Line 
          data={data} 
          options={{
            responsive: true,
            maintainAspectRatio: true,
            ...options
          }} 
        />
      </ChartContainer>
    )
  }
)
LineChart.displayName = "LineChart"

// Bar chart component
export const BarChart = forwardRef<HTMLDivElement, ChartProps>(
  ({ data, options, className, size, ...props }, ref) => {
    return (
      <ChartContainer ref={ref} className={className} size={size} {...props}>
        <Bar 
          data={data} 
          options={{
            responsive: true,
            maintainAspectRatio: true,
            ...options
          }} 
        />
      </ChartContainer>
    )
  }
)
BarChart.displayName = "BarChart"

// Pie chart component
export const PieChart = forwardRef<HTMLDivElement, ChartProps>(
  ({ data, options, className, size, ...props }, ref) => {
    return (
      <ChartContainer ref={ref} className={className} size={size} {...props}>
        <Pie 
          data={data} 
          options={{
            responsive: true,
            maintainAspectRatio: true,
            ...options
          }} 
        />
      </ChartContainer>
    )
  }
)
PieChart.displayName = "PieChart"

// Doughnut chart component
export const DoughnutChart = forwardRef<HTMLDivElement, ChartProps>(
  ({ data, options, className, size, ...props }, ref) => {
    return (
      <ChartContainer ref={ref} className={className} size={size} {...props}>
        <Doughnut 
          data={data} 
          options={{
            responsive: true,
            maintainAspectRatio: true,
            ...options
          }} 
        />
      </ChartContainer>
    )
  }
)
DoughnutChart.displayName = "DoughnutChart" 