import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import PageHeader from "./PageHeader";
import { Button } from "@/components/atoms/Button";
import { PlusIcon } from "@heroicons/react/24/outline";

const meta: Meta<typeof PageHeader> = {
  title: "Applications/Kigo Pro/Molecules/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A versatile page header component with title, description, emoji and action buttons",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

// Mock action buttons for the stories
const ActionButtons = () => (
  <Button className="flex items-center gap-1">
    <PlusIcon className="h-4 w-4" />
    Create New
  </Button>
);

// Basic PageHeader with default gradient
export const Default: Story = {
  render: () => (
    <div className="w-[800px]">
      <PageHeader
        title="Dashboard Overview"
        description="Welcome to your personalized dashboard with key metrics and insights"
        emoji="📊"
      />
    </div>
  ),
};

// PageHeader with actions
export const WithActions: Story = {
  render: () => (
    <div className="w-[800px]">
      <PageHeader
        title="Campaign Manager"
        description="Create and manage marketing campaigns for your business"
        emoji="🚀"
        actions={<ActionButtons />}
      />
    </div>
  ),
};

// PageHeader with custom gradient colors
export const CustomGradient: Story = {
  render: () => (
    <div className="w-[800px]">
      <PageHeader
        title="Analytics Dashboard"
        description="View detailed performance metrics and trends"
        emoji="📈"
        gradientColors={{
          from: "rgba(219, 234, 254, 0.9)", // blue-100
          to: "rgba(224, 231, 255, 0.85)", // indigo-100
        }}
      />
    </div>
  ),
};

// PageHeader with aurora effect
export const AuroraVariant: Story = {
  render: () => (
    <div className="w-[800px]">
      <PageHeader
        title="Catalog Filters"
        description="Manage catalog filters to control offer display in the platform"
        emoji="🏷️"
        variant="aurora"
        actions={<ActionButtons />}
      />
    </div>
  ),
};

// PageHeader with only title and emoji
export const MinimalContent: Story = {
  render: () => (
    <div className="w-[800px]">
      <PageHeader title="User Management" emoji="👥" />
    </div>
  ),
};

// PageHeader with long content
export const LongContent: Story = {
  render: () => (
    <div className="w-[800px]">
      <PageHeader
        title="Integration Settings and Configuration Panel"
        description="Manage all your third-party integrations, API connections, and custom webhook configurations for seamless data synchronization across platforms"
        emoji="🔄"
        actions={<ActionButtons />}
      />
    </div>
  ),
};
