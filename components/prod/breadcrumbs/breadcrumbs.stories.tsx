import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Breadcrumbs } from ".";

const meta = {
  component: Breadcrumbs,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
};

export const SingleLevel: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/merchants",
      },
    },
  },
};

export const TwoLevels: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/catalog-filters/create",
      },
    },
  },
};

export const ThreeLevels: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/offer-manager/merchants/offers",
      },
    },
  },
};

/**
 * Wrapper segments that have no page of their own (here `edit-offer`, which
 * only exists as the parent of `/offer-manager/edit-offer/[offerId]`) render
 * as non-navigable text rather than a link, so they never 404.
 */
export const WithNonNavigableWrapper: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/offer-manager/edit-offer/60078177",
        segments: [["offerId", "60078177"]],
      },
    },
  },
};
