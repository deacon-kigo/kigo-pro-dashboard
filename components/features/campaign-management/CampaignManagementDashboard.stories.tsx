import type { Meta, StoryObj } from "@storybook/react";
import { CampaignManagementDashboard } from "./CampaignManagementDashboard";

const meta = {
  title: "Applications/Kigo Pro/Features/Campaign Management/Dashboard",
  component: CampaignManagementDashboard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Campaign Management Dashboard - Main view for managing promotional campaigns, including creation, filtering, and status monitoring.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onCreateCampaign: { action: "create campaign clicked" },
  },
} satisfies Meta<typeof CampaignManagementDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default dashboard view showing all campaigns with search and filtering capabilities.
 * Displays 8 mock campaigns across different statuses (active, scheduled, ended, paused, draft).
 */
export const Default: Story = {
  args: {
    onCreateCampaign: () => console.log("Navigate to create campaign"),
  },
};

/**
 * Dashboard view with active campaigns filter applied via URL search params.
 * Shows only campaigns with "active" status.
 */
export const WithActiveFilter: Story = {
  args: {
    onCreateCampaign: () => console.log("Navigate to create campaign"),
  },
  parameters: {
    nextjs: {
      navigation: {
        query: { status: "active" },
      },
    },
  },
};

/**
 * Dashboard view filtered by campaign type.
 * Shows only promotional campaigns.
 */
export const WithTypeFilter: Story = {
  args: {
    onCreateCampaign: () => console.log("Navigate to create campaign"),
  },
  parameters: {
    nextjs: {
      navigation: {
        query: { type: "promotional" },
      },
    },
  },
};

/**
 * Dashboard view with search query applied.
 * Filters campaigns by name containing "Summer".
 */
export const WithSearchQuery: Story = {
  args: {
    onCreateCampaign: () => console.log("Navigate to create campaign"),
  },
  parameters: {
    nextjs: {
      navigation: {
        query: { search: "Summer" },
      },
    },
  },
};

/**
 * Dashboard view showing seasonal campaigns.
 * Useful for planning holiday and seasonal promotions.
 */
export const SeasonalCampaigns: Story = {
  args: {
    onCreateCampaign: () => console.log("Navigate to create campaign"),
  },
  parameters: {
    nextjs: {
      navigation: {
        query: { type: "seasonal" },
      },
    },
  },
};

/**
 * Dashboard view showing targeted campaigns.
 * Displays campaigns focused on specific customer segments.
 */
export const TargetedCampaigns: Story = {
  args: {
    onCreateCampaign: () => console.log("Navigate to create campaign"),
  },
  parameters: {
    nextjs: {
      navigation: {
        query: { type: "targeted" },
      },
    },
  },
};
