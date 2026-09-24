import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SearchBar } from ".";

const meta = {
  component: SearchBar,
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/merchants",
        searchParams: new URLSearchParams(),
      },
    },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "search",
  },
};

export const CustomPlaceholder: Story = {
  args: {
    id: "search-custom",
    placeholder: "Search merchants...",
  },
};

export const WithExistingQuery: Story = {
  args: {
    id: "search-existing",
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/merchants",
        searchParams: new URLSearchParams({ searchQuery: "acme" }),
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    id: "search-disabled",
  },
};
