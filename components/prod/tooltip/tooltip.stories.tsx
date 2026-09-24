import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Tooltip } from ".";
import { Button } from "../button";

const meta = {
  argTypes: {
    align: {
      control: "select",
      description: "Horizontal alignment of the tooltip",
      options: ["start", "center", "end"],
    },
    side: {
      control: "select",
      description: "Which side of the trigger to show the tooltip",
      options: ["top", "right", "bottom", "left"],
    },
  },
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <Button variant="outline">Hover me</Button>,
    content: "This is a tooltip",
  },
};

export const Top: Story = {
  args: {
    children: <Button variant="outline">Top</Button>,
    content: "Tooltip on top",
    side: "top",
  },
};

export const Right: Story = {
  args: {
    children: <Button variant="outline">Right</Button>,
    content: "Tooltip on right",
    side: "right",
  },
};

export const Bottom: Story = {
  args: {
    children: <Button variant="outline">Bottom</Button>,
    content: "Tooltip on bottom",
    side: "bottom",
  },
};

export const Left: Story = {
  args: {
    children: <Button variant="outline">Left</Button>,
    content: "Tooltip on left",
    side: "left",
  },
};

export const WithRichContent: Story = {
  args: {
    children: <Button variant="outline">Rich Tooltip</Button>,
    content: (
      <div className="space-y-1">
        <p className="font-medium">Keyboard Shortcut</p>
        <p className="text-xs opacity-80">Press Ctrl+S to save</p>
      </div>
    ),
  },
};

export const AllSides: Story = {
  args: {
    children: <Button variant="outline">All Sides</Button>,
    content: "Tooltip",
  },
  render: () => (
    <div className="flex gap-4">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip content={`Tooltip on ${side}`} key={side} side={side}>
          <Button variant="outline">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};
