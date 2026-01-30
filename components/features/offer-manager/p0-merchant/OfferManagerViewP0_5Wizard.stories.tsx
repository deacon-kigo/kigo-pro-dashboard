import type { Meta, StoryObj } from "@storybook/react";
import { OfferManagerViewP0_5Wizard } from "./OfferManagerViewP0_5Wizard";

const meta = {
  title: "Applications/Kigo Pro/Features/Offer Manager/P0.5 Wizard/Full Wizard",
  component: OfferManagerViewP0_5Wizard,
  parameters: {
    layout: "fullscreen",
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
## P0.5 Offer Manager Wizard

Part of the **Intuitive Offer Creation** PRD - a streamlined 4-step wizard flow:

1. **Select Offer Type** - Choose from dollar off, percent off, BOGO, or fixed price
2. **Select Merchant** - Search existing merchants or create new ones
3. **Offer Content** - Details, image upload, dates, and redemption info
4. **Review & Publish** - Final review with polished preview card

### Key Features
- Vertical stepper navigation
- Live preview panel on the right
- Smart defaults for faster creation
- Smooth step transitions with dissolve effect
        `,
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/offer-manager",
        query: { version: "p0.5", create: "true" },
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OfferManagerViewP0_5Wizard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default wizard view starting at Step 1 (Offer Type selection).
 */
export const Default: Story = {};

/**
 * The full wizard experience with all steps accessible.
 */
export const FullWizard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The complete P0.5 wizard flow. Navigate through steps using the vertical stepper or Next/Back buttons.",
      },
    },
  },
};
