import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Loader } from ".";

const meta = {
  component: Loader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Loader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  args: {
    className: "size-8",
  },
};

export const ExtraLarge: Story = {
  args: {
    className: "size-12",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Loader className="size-4" />
      <Loader className="size-6" />
      <Loader className="size-8" />
      <Loader className="size-12" />
    </div>
  ),
};
