import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from ".";

const meta = {
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "default",
    placeholder: "Enter text...",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "Hello, World!",
    id: "with-value",
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: "Disabled input",
    disabled: true,
    id: "disabled",
  },
};

export const WithLabel: Story = {
  args: {
    id: "labeled",
  },
  render: () => (
    <div className="w-72">
      <label className="mb-1 block text-sm font-medium" htmlFor="labeled">
        Email Address
      </label>
      <Input id="labeled" placeholder="you@example.com" type="email" />
    </div>
  ),
};

export const Password: Story = {
  args: {
    id: "password",
    placeholder: "Enter password",
    type: "password",
  },
};

export const File: Story = {
  args: {
    id: "file",
    type: "file",
  },
};
