import type { Meta, StoryObj } from "@storybook/react";
import { StepOfferType } from "./StepOfferType";

const meta = {
  title:
    "Applications/Kigo Pro/Features/Offer Manager/P0.5 Wizard/Step 1 - Offer Type",
  component: StepOfferType,
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "light gray",
      values: [
        { name: "light gray", value: "#f8fafc" },
        { name: "white", value: "#ffffff" },
      ],
    },
    docs: {
      description: {
        component: `
## Step 1: Select Offer Type

The first step in the P0.5 wizard where users choose their offer type:

- **Dollar Off** - Fixed dollar amount discount (e.g., $10 OFF)
- **Percent Off** - Percentage discount (e.g., 20% OFF)
- **Buy One Get One** - BOGO deals
- **Fixed Price** - Special price offers (e.g., $9.99)

Each card displays:
- Offer type illustration
- Label and description
- "Best for" use cases
- Example offer text
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    selectedType: {
      control: "select",
      options: [null, "dollar_off", "percent_off", "bogo", "fixed_price"],
      description: "Currently selected offer type",
    },
    onSelect: { action: "selected" },
  },
} satisfies Meta<typeof StepOfferType>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Initial state with no selection.
 */
export const Default: Story = {
  args: {
    selectedType: null,
    onSelect: () => {},
  },
};

/**
 * Dollar Off selected.
 */
export const DollarOffSelected: Story = {
  args: {
    selectedType: "dollar_off",
    onSelect: () => {},
  },
};

/**
 * Percent Off selected.
 */
export const PercentOffSelected: Story = {
  args: {
    selectedType: "percent_off",
    onSelect: () => {},
  },
};

/**
 * BOGO selected.
 */
export const BOGOSelected: Story = {
  args: {
    selectedType: "bogo",
    onSelect: () => {},
  },
};

/**
 * Fixed Price selected.
 */
export const FixedPriceSelected: Story = {
  args: {
    selectedType: "fixed_price",
    onSelect: () => {},
  },
};
