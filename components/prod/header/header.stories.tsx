import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Header } from ".";

const meta = {
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Admin: Story = {
  args: {
    userRole: "admin",
  },
};
