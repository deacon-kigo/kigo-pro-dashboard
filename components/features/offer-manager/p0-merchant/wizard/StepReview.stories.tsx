import type { Meta, StoryObj } from "@storybook/react";
import StepReview from "./StepReview";

const meta = {
  title: "Applications/Kigo Pro/Features/Offer Manager/Wizard/Step 4 - Review",
  component: StepReview,
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
## Step 4: Review & Publish

A polished review card for the final step of the offer creation wizard. Features:

- **Soft mesh gradient background** - Sky blue (#ccfffe) + pastel lavender blend
- **3D tilt effect** - Subtle 1.5° max rotation responding to cursor position
- **Animated border glow** - Gentle hover effect for playful interaction
- **Semantic groupings** - Availability, redemption details, usage rules
- **Accessible typography** - Proper contrast ratios (WCAG AA compliant)
- **Offer type illustrations** - Visual representation of the selected offer type

### Brand Colors
- Sky Blue: \`#ccfffe\`
- Pastel Lavender: \`#c7d2fe\`
- Brand Blue: \`#2563eb\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    formData: {
      description: "Form data from previous wizard steps",
      control: "object",
    },
  },
} satisfies Meta<typeof StepReview>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data for stories
const completeFormData = {
  offerType: "dollar_off" as const,
  discountValue: "15",
  merchantData: {
    id: "merchant-123",
    dbaName: "Joe's Coffee Shop",
    corpName: "Joe's Coffee LLC",
    logoUrl: "",
    source: "existing" as const,
  },
  offerName: "Save $15 on Your Next Coffee Order",
  description: "Enjoy $15 off when you spend $30 or more at Joe's Coffee Shop.",
  startDate: "2025-02-01",
  endDate: "2025-04-30",
  externalUrl: "https://joescoffee.com/redeem",
  promoCode: "SAVE15NOW",
  termsConditions:
    "Valid at participating locations. Cannot be combined with other offers.",
  usageLimitPerCustomer: "1",
  redemptionRollingPeriod: "single",
};

const incompleteFormData = {
  offerType: "percent_off" as const,
  discountValue: "20",
  merchantData: {
    id: "merchant-456",
    dbaName: "Fresh Mart Grocery",
    corpName: "Fresh Mart Inc",
    logoUrl: "",
    source: "existing" as const,
  },
  offerName: "20% Off Fresh Produce",
  description: "",
  startDate: "2025-02-15",
  endDate: "",
  externalUrl: "",
  promoCode: "",
  termsConditions: "",
  usageLimitPerCustomer: "unlimited",
  redemptionRollingPeriod: "monthly",
};

const bogoFormData = {
  offerType: "bogo" as const,
  discountValue: "1",
  merchantData: {
    id: "merchant-789",
    dbaName: "Pizza Palace",
    corpName: "Pizza Palace LLC",
    logoUrl: "",
    source: "existing" as const,
  },
  offerName: "Buy One Pizza, Get One Free",
  description: "Order any large pizza and get a second one absolutely free!",
  startDate: "2025-03-01",
  endDate: "2025-03-31",
  externalUrl: "https://pizzapalace.com/bogo",
  promoCode: "BOGOPIZZA",
  termsConditions: "Valid for large pizzas only. Dine-in or takeout.",
  usageLimitPerCustomer: "2",
  redemptionRollingPeriod: "single",
};

const fixedPriceFormData = {
  offerType: "fixed_price" as const,
  discountValue: "9.99",
  merchantData: {
    id: "merchant-101",
    dbaName: "Burger Barn",
    corpName: "Burger Barn Holdings",
    logoUrl: "",
    source: "existing" as const,
  },
  offerName: "Combo Meal for $9.99",
  description: "Get a burger, fries, and drink for just $9.99!",
  startDate: "2025-02-01",
  endDate: "2025-12-31",
  externalUrl: "https://burgerbarn.com/deal",
  promoCode: "COMBO999",
  termsConditions: "Cannot be combined with other offers. Tax not included.",
  usageLimitPerCustomer: "unlimited",
  redemptionRollingPeriod: "never",
};

/**
 * Complete offer ready for publishing.
 * All required fields are filled - shows the "Ready to Publish" state.
 */
export const Complete: Story = {
  args: {
    formData: completeFormData,
    onUpdate: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "A fully completed offer with all required fields. Shows the 'Ready to Publish' badge with pulsing indicator and celebratory footer.",
      },
    },
  },
};

/**
 * Incomplete offer with missing required fields.
 * Shows the progress indicator and missing field guidance.
 */
export const Incomplete: Story = {
  args: {
    formData: incompleteFormData,
    onUpdate: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "An incomplete offer missing redemption URL and promo code. Shows completion progress (5 of 7) and 'Almost there' state.",
      },
    },
  },
};

/**
 * BOGO (Buy One Get One) offer type.
 * Demonstrates the BOGO illustration and badge formatting.
 */
export const BOGOOffer: Story = {
  args: {
    formData: bogoFormData,
    onUpdate: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "A Buy One Get One Free offer showing the BOGO illustration and 'BUY 1 GET 1' discount badge.",
      },
    },
  },
};

/**
 * Fixed Price offer type.
 * Shows the fixed price illustration and $X.XX badge format.
 */
export const FixedPriceOffer: Story = {
  args: {
    formData: fixedPriceFormData,
    onUpdate: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "A fixed price combo deal showing the fixed price illustration and '$9.99' badge format.",
      },
    },
  },
};

/**
 * Percent Off offer type.
 */
export const PercentOffOffer: Story = {
  args: {
    formData: {
      ...completeFormData,
      offerType: "percent_off" as const,
      discountValue: "25",
      offerName: "25% Off Your Entire Purchase",
    },
    onUpdate: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "A percentage discount offer showing the percent off illustration and '25% OFF' badge.",
      },
    },
  },
};

/**
 * Empty state with minimal data.
 * Shows placeholder states for all fields.
 */
export const EmptyState: Story = {
  args: {
    formData: {
      offerType: "dollar_off" as const,
      discountValue: "",
      merchantData: null,
      offerName: "",
      description: "",
      startDate: "",
      endDate: "",
      externalUrl: "",
      promoCode: "",
      termsConditions: "",
      usageLimitPerCustomer: "1",
      redemptionRollingPeriod: "single",
    },
    onUpdate: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Empty state showing all placeholder text and the incomplete status. Useful for understanding the visual hierarchy without data.",
      },
    },
  },
};

/**
 * With unlimited usage.
 * Shows the unlimited redemptions rule pill.
 */
export const UnlimitedUsage: Story = {
  args: {
    formData: {
      ...completeFormData,
      usageLimitPerCustomer: "unlimited",
      redemptionRollingPeriod: "monthly",
    },
    onUpdate: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Offer with unlimited redemptions that reset monthly. Shows 'Unlimited' in the usage limit pill.",
      },
    },
  },
};

/**
 * Without end date (ongoing offer).
 * Shows 'No end date (ongoing)' in the availability section.
 */
export const OngoingOffer: Story = {
  args: {
    formData: {
      ...completeFormData,
      endDate: "",
    },
    onUpdate: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "An offer without an end date, showing 'No end date (ongoing)' in the availability section.",
      },
    },
  },
};
