import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/components/prod/button";

import { PageHeader } from ".";

const meta = {
  component: PageHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PageHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    description: "Manage your merchant configurations and settings.",
    title: "Merchants",
  },
};

export const WithActions: Story = {
  args: {
    actions: <Button>Create New</Button>,
    description: "View and manage all catalog filters.",
    title: "Catalog Filters",
  },
};

export const WithCustomEmoji: Story = {
  args: {
    description: "Track and manage your active offers.",
    emoji: "🎯",
    title: "Offers",
  },
};

export const WithCustomGradient: Story = {
  args: {
    description: "Monitor system performance and health.",
    emoji: "📊",
    gradientColors: {
      from: "rgba(99, 102, 241, 0.9)",
      to: "rgba(139, 92, 246, 0.7)",
    },
    title: "Analytics Dashboard",
  },
};

export const AuroraVariant: Story = {
  args: {
    description: "A page header with the aurora background effect.",
    emoji: "🌈",
    title: "Aurora Header",
    variant: "aurora",
  },
};

export const AllVariants: Story = {
  args: {
    title: "All Variants",
  },
  render: () => (
    <div className="space-y-4">
      <PageHeader
        description="Default gradient variant."
        title="Default Variant"
      />
      <PageHeader
        description="Aurora background variant."
        emoji="🌈"
        title="Aurora Variant"
        variant="aurora"
      />
      <PageHeader
        actions={<Button>Action</Button>}
        description="With custom gradient and actions."
        emoji="🚀"
        gradientColors={{
          from: "rgba(16, 185, 129, 0.9)",
          to: "rgba(59, 130, 246, 0.7)",
        }}
        title="Custom Gradient"
      />
    </div>
  ),
};
