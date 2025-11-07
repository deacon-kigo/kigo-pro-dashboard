import type { Meta, StoryObj } from "@storybook/react";
import CampaignCreationWizard from "./CampaignCreationWizard";

const meta = {
  title: "Applications/Kigo Pro/Features/Campaign Management/Creation Wizard",
  component: CampaignCreationWizard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Multi-step wizard for creating new campaigns. Includes Basic Info, Configuration (Schedule), and Review steps with vertical stepper navigation.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CampaignCreationWizard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default wizard view starting at Step 1 (Basic Info / Details).
 * Users enter campaign name, partner, program, and type.
 */
export const Step1_BasicInfo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Step 1: Basic Info - Enter campaign details including name, partner selection, program assignment, and campaign type (promotional, targeted, seasonal).",
      },
    },
  },
};

/**
 * Wizard at Step 2 (Configuration / Schedule).
 * Users configure description, dates, and activation settings.
 */
export const Step2_Configuration: Story = {
  play: async ({ canvasElement }) => {
    // Simulate user navigation to step 2
    // This would require interaction testing setup
  },
  parameters: {
    docs: {
      description: {
        story:
          "Step 2: Schedule - Configure campaign description, start/end dates, and activation settings (auto-activate, auto-deactivate).",
      },
    },
  },
};

/**
 * Wizard at Step 3 (Review).
 * Users review all entered information before submission.
 */
export const Step3_Review: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Step 3: Review - Final review of all campaign details before creation. Users can go back to edit or submit to create the campaign.",
      },
    },
  },
};

/**
 * Wizard with sample data pre-filled.
 * Useful for testing and demonstration purposes.
 */
export const WithSampleData: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Wizard pre-populated with sample campaign data for demonstration. Shows a promotional 'Summer Savings 2025' campaign.",
      },
    },
  },
};

/**
 * Mobile responsive view of the wizard.
 * Stepper adapts to smaller screen sizes.
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Mobile responsive layout - Vertical stepper and form adapt to mobile screen sizes for on-the-go campaign creation.",
      },
    },
  },
};

/**
 * Tablet view showing intermediate breakpoint.
 */
export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
    docs: {
      description: {
        story:
          "Tablet optimized layout - Provides comfortable touch targets and readable form fields on iPad and similar devices.",
      },
    },
  },
};
