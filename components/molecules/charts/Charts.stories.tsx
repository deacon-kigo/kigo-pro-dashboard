import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { LineChart, BarChart, PieChart, DoughnutChart } from "./BaseChart";
import CampaignPerformanceChart from "./CampaignPerformanceChart";

// Mock data for charts
const lineChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Revenue",
      data: [65, 59, 80, 81, 56, 55, 72],
      fill: false,
      borderColor: "rgb(75, 85, 253)",
      tension: 0.1,
    },
    {
      label: "Expenses",
      data: [28, 48, 40, 19, 36, 27, 40],
      fill: false,
      borderColor: "rgb(255, 99, 132)",
      tension: 0.1,
    },
  ],
};

const barChartData = {
  labels: ["Q1", "Q2", "Q3", "Q4"],
  datasets: [
    {
      label: "Sales 2022",
      data: [45, 59, 63, 81],
      backgroundColor: "rgba(75, 85, 253, 0.2)",
      borderColor: "rgb(75, 85, 253)",
      borderWidth: 1,
    },
    {
      label: "Sales 2023",
      data: [53, 65, 82, 97],
      backgroundColor: "rgba(53, 162, 235, 0.2)",
      borderColor: "rgb(53, 162, 235)",
      borderWidth: 1,
    },
  ],
};

const pieChartData = {
  labels: ["Direct", "Social Media", "Email", "Affiliates", "Other"],
  datasets: [
    {
      data: [35, 25, 22, 15, 3],
      backgroundColor: [
        "rgba(75, 85, 253, 0.7)",
        "rgba(53, 162, 235, 0.7)",
        "rgba(255, 99, 132, 0.7)",
        "rgba(255, 206, 86, 0.7)",
        "rgba(75, 192, 192, 0.7)",
      ],
      borderColor: [
        "rgb(75, 85, 253)",
        "rgb(53, 162, 235)",
        "rgb(255, 99, 132)",
        "rgb(255, 206, 86)",
        "rgb(75, 192, 192)",
      ],
      borderWidth: 1,
    },
  ],
};

const doughnutChartData = {
  labels: ["Desktop", "Mobile", "Tablet"],
  datasets: [
    {
      data: [55, 35, 10],
      backgroundColor: [
        "rgba(75, 85, 253, 0.7)",
        "rgba(255, 99, 132, 0.7)",
        "rgba(255, 206, 86, 0.7)",
      ],
      borderColor: [
        "rgb(75, 85, 253)",
        "rgb(255, 99, 132)",
        "rgb(255, 206, 86)",
      ],
      borderWidth: 1,
    },
  ],
};

const meta: Meta<typeof LineChart> = {
  title: "Applications/Kigo Pro/Design System/Molecules/Charts",
  component: LineChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Data visualization components for displaying charts and graphs.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LineChart>;

// Line Chart Story
export const Line: Story = {
  render: () => (
    <div className="w-[700px] h-[400px]">
      <LineChart
        data={lineChartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Revenue vs Expenses",
              font: { size: 16 },
            },
            legend: {
              position: "top",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Amount ($K)",
              },
            },
          },
        }}
      />
    </div>
  ),
};

// Bar Chart Story
export const Bar: Story = {
  render: () => (
    <div className="w-[700px] h-[400px]">
      <BarChart
        data={barChartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Quarterly Sales Comparison",
              font: { size: 16 },
            },
            legend: {
              position: "top",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Sales ($K)",
              },
            },
          },
        }}
      />
    </div>
  ),
};

// Pie Chart Story
export const Pie: Story = {
  render: () => (
    <div className="w-[500px] h-[500px]">
      <PieChart
        data={pieChartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Traffic Sources",
              font: { size: 16 },
            },
            legend: {
              position: "bottom",
            },
          },
        }}
      />
    </div>
  ),
};

// Doughnut Chart Story
export const Doughnut: Story = {
  render: () => (
    <div className="w-[500px] h-[500px]">
      <DoughnutChart
        data={doughnutChartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Device Distribution",
              font: { size: 16 },
            },
            legend: {
              position: "bottom",
            },
          },
        }}
      />
    </div>
  ),
};

// Campaign Performance Chart Story
export const CampaignPerformance: Story = {
  render: () => (
    <div className="w-[800px]">
      <CampaignPerformanceChart />
    </div>
  ),
};
