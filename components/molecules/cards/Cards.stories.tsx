import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import StatCard from "./StatCard";
import TaskCard from "./TaskCard";
import CampaignCard from "./CampaignCard";
import {
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  EnvelopeIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

const meta: Meta<typeof StatCard> = {
  title: "Applications/Kigo Pro/Design System/Molecules/Cards",
  component: StatCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Card components for displaying various types of information.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StatCard>;

// Stat Card Stories
export const StatCardPositive: Story = {
  render: () => (
    <div className="w-[300px]">
      <StatCard
        title="Total Customers"
        value="2,843"
        change={12.5}
        icon={<UsersIcon className="w-6 h-6" />}
        iconBg="bg-blue-50"
        iconColor="text-primary"
      />
    </div>
  ),
};

export const StatCardNegative: Story = {
  render: () => (
    <div className="w-[300px]">
      <StatCard
        title="Revenue"
        value="$42,389"
        change={-3.2}
        icon={<CurrencyDollarIcon className="w-6 h-6" />}
        iconBg="bg-green-50"
        iconColor="text-green-600"
      />
    </div>
  ),
};

export const StatCardNoChange: Story = {
  render: () => (
    <div className="w-[300px]">
      <StatCard
        title="Orders"
        value="1,259"
        icon={<ShoppingBagIcon className="w-6 h-6" />}
        iconBg="bg-purple-50"
        iconColor="text-purple-600"
      />
    </div>
  ),
};

// Task Card Stories
export const TaskCardBasic: Story = {
  render: () => (
    <div className="w-[350px]">
      <TaskCard
        title="Review Campaign Performance"
        description="Analyze performance metrics for the Summer Sale campaign and prepare a report."
        icon={<ChartBarIcon className="w-5 h-5 text-blue-600" />}
        iconBg="bg-blue-50"
        link="#"
        date="Today"
      />
    </div>
  ),
};

export const TaskCardLongDescription: Story = {
  render: () => (
    <div className="w-[350px]">
      <TaskCard
        title="Email Notification Setup"
        description="Configure email notification settings for the new loyalty program launch. Ensure all templates are properly formatted and test sending capabilities before the release."
        icon={<EnvelopeIcon className="w-5 h-5 text-purple-600" />}
        iconBg="bg-purple-50"
        link="#"
        date="Tomorrow"
      />
    </div>
  ),
};

export const TaskCardNoDate: Story = {
  render: () => (
    <div className="w-[350px]">
      <TaskCard
        title="System Notifications"
        description="Review and update the system notification preferences for all admin users."
        icon={<BellIcon className="w-5 h-5 text-amber-600" />}
        iconBg="bg-amber-50"
        link="#"
      />
    </div>
  ),
};

// Campaign Card Stories
export const CampaignCardActive: Story = {
  render: () => (
    <div className="w-[400px]">
      <CampaignCard
        id="1"
        title="Summer Sale 2023"
        status="active"
        merchantName="Acme Corp"
        startDate="Jun 1, 2023"
        endDate="Aug 31, 2023"
        progress={65}
      />
    </div>
  ),
};

export const CampaignCardDraft: Story = {
  render: () => (
    <div className="w-[400px]">
      <CampaignCard
        id="2"
        title="Holiday Special Promotion"
        status="draft"
        merchantName="GlobalTech Inc."
        startDate="Nov 15, 2023"
        endDate="Dec 31, 2023"
      />
    </div>
  ),
};

export const CampaignCardScheduled: Story = {
  render: () => (
    <div className="w-[400px]">
      <CampaignCard
        id="3"
        title="Back to School Campaign"
        status="scheduled"
        merchantName="EduSupplies Ltd."
        startDate="Aug 1, 2023"
        endDate="Sep 15, 2023"
      />
    </div>
  ),
};

export const CampaignCardCompleted: Story = {
  render: () => (
    <div className="w-[400px]">
      <CampaignCard
        id="4"
        title="Spring Collection Launch"
        status="completed"
        merchantName="Fashion Forward"
        startDate="Mar 1, 2023"
        endDate="Apr 30, 2023"
      />
    </div>
  ),
};

export const CampaignCardPaused: Story = {
  render: () => (
    <div className="w-[400px]">
      <CampaignCard
        id="5"
        title="Premium Membership Drive"
        status="paused"
        merchantName="Fitness First"
        startDate="May 1, 2023"
        endDate="Jul 31, 2023"
        progress={42}
      />
    </div>
  ),
};
