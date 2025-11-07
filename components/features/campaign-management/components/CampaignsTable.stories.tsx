import type { Meta, StoryObj } from "@storybook/react";
import { CampaignsTable } from "./CampaignsTable";

// Mock campaign data
const mockCampaigns = [
  {
    id: "1",
    name: "Summer Savings 2025",
    partner_name: "Acme Corp",
    program_name: "Rewards Plus",
    type: "promotional" as const,
    description: "Limited time summer promotion",
    start_date: "2025-06-01",
    end_date: "2025-08-31",
    active: true,
    has_products: false,
    status: "active" as const,
    created_at: "2025-05-01",
  },
  {
    id: "2",
    name: "Holiday Campaign 2025",
    partner_name: "Beta Inc",
    program_name: "Loyalty Program",
    type: "seasonal" as const,
    description: "End of year holiday promotions",
    start_date: "2025-12-01",
    end_date: "2025-12-31",
    active: false,
    has_products: true,
    status: "scheduled" as const,
    created_at: "2025-05-15",
  },
  {
    id: "3",
    name: "Spring Flash Sale",
    partner_name: "Gamma LLC",
    program_name: "Premium Members",
    type: "promotional" as const,
    description: "48-hour flash sale event",
    start_date: "2025-04-15",
    end_date: "2025-04-17",
    active: false,
    has_products: true,
    status: "ended" as const,
    created_at: "2025-04-01",
  },
  {
    id: "4",
    name: "Customer Appreciation Week",
    partner_name: "Acme Corp",
    program_name: "Standard Program",
    type: "targeted" as const,
    description: "Special offers for loyal customers",
    start_date: "2025-06-15",
    end_date: "2025-06-22",
    active: true,
    has_products: true,
    status: "active" as const,
    created_at: "2025-05-20",
  },
  {
    id: "5",
    name: "Back to School",
    partner_name: "Delta Co",
    program_name: "Education Plus",
    type: "seasonal" as const,
    description: "Student and teacher discounts",
    start_date: "2025-08-01",
    end_date: "2025-09-30",
    active: false,
    has_products: false,
    status: "scheduled" as const,
    created_at: "2025-05-25",
  },
  {
    id: "6",
    name: "Black Friday Mega Sale",
    partner_name: "Beta Inc",
    program_name: "Loyalty Program",
    type: "promotional" as const,
    description: "Biggest sale of the year",
    start_date: "2025-11-24",
    end_date: "2025-11-26",
    active: false,
    has_products: true,
    status: "scheduled" as const,
    created_at: "2025-05-28",
  },
];

const meta = {
  title: "Applications/Kigo Pro/Features/Campaign Management/Campaigns Table",
  component: CampaignsTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Data table displaying campaigns with sortable columns, status badges, and product assignment warnings. Supports search and filtering.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    campaigns: {
      description: "Array of campaign objects to display",
    },
    searchQuery: {
      description: "Optional search query to highlight matching text",
    },
  },
} satisfies Meta<typeof CampaignsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default table view with 6 sample campaigns.
 * Shows various statuses: active, scheduled, ended.
 */
export const Default: Story = {
  args: {
    campaigns: mockCampaigns,
  },
};

/**
 * Table with active campaigns only.
 * Filtered to show running campaigns.
 */
export const ActiveCampaigns: Story = {
  args: {
    campaigns: mockCampaigns.filter((c) => c.status === "active"),
  },
};

/**
 * Table with scheduled campaigns only.
 * Shows upcoming campaigns not yet started.
 */
export const ScheduledCampaigns: Story = {
  args: {
    campaigns: mockCampaigns.filter((c) => c.status === "scheduled"),
  },
};

/**
 * Table with ended campaigns only.
 * Historical view of completed campaigns.
 */
export const EndedCampaigns: Story = {
  args: {
    campaigns: mockCampaigns.filter((c) => c.status === "ended"),
  },
};

/**
 * Empty state when no campaigns exist.
 */
export const EmptyState: Story = {
  args: {
    campaigns: [],
  },
};

/**
 * Table with search query applied.
 * Highlights text matching "Summer".
 */
export const WithSearchQuery: Story = {
  args: {
    campaigns: mockCampaigns,
    searchQuery: "Summer",
  },
};

/**
 * Table showing promotional campaigns only.
 */
export const PromotionalCampaigns: Story = {
  args: {
    campaigns: mockCampaigns.filter((c) => c.type === "promotional"),
  },
};

/**
 * Table showing seasonal campaigns only.
 */
export const SeasonalCampaigns: Story = {
  args: {
    campaigns: mockCampaigns.filter((c) => c.type === "seasonal"),
  },
};

/**
 * Table showing targeted campaigns only.
 */
export const TargetedCampaigns: Story = {
  args: {
    campaigns: mockCampaigns.filter((c) => c.type === "targeted"),
  },
};

/**
 * Table with campaigns missing product assignments.
 * Shows warning indicators for campaigns without products.
 */
export const WithProductWarnings: Story = {
  args: {
    campaigns: mockCampaigns.filter((c) => !c.has_products),
  },
};

/**
 * Large dataset showing pagination behavior.
 */
export const LargeDataset: Story = {
  args: {
    campaigns: Array.from({ length: 25 }, (_, i) => ({
      ...mockCampaigns[i % mockCampaigns.length],
      id: `campaign-${i + 1}`,
      name: `Campaign ${i + 1}`,
    })),
  },
};

/**
 * Mobile responsive view of the table.
 */
export const MobileView: Story = {
  args: {
    campaigns: mockCampaigns,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
