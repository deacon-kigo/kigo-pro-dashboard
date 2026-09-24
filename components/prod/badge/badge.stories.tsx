import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Badge } from ".";

const meta = {
  argTypes: {
    color: {
      control: "select",
      description: "The color scheme of the badge",
      options: [
        "primary",
        "secondary",
        "destructive",
        "success",
        "warning",
        "info",
        "neutral",
      ],
    },
    roundness: {
      control: "select",
      description: "The border radius of the badge",
      options: ["default", "md", "sm", "none"],
    },
    size: {
      control: "select",
      description: "The size of the badge",
      options: ["default", "sm", "xs"],
    },
    variant: {
      control: "select",
      description: "The visual style of the badge",
      options: ["solid", "outline"],
    },
  },
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Primary: Story = {
  args: {
    children: "Primary",
    color: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    color: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    children: "Destructive",
    color: "destructive",
  },
};

export const Success: Story = {
  args: {
    children: "Success",
    color: "success",
  },
};

export const Warning: Story = {
  args: {
    children: "Warning",
    color: "warning",
  },
};

export const Info: Story = {
  args: {
    children: "Info",
    color: "info",
  },
};

export const Neutral: Story = {
  args: {
    children: "Neutral",
    color: "neutral",
  },
};

export const SizeDefault: Story = {
  args: {
    children: "Default",
    size: "default",
  },
};

export const SizeSmall: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const SizeExtraSmall: Story = {
  args: {
    children: "Extra Small",
    size: "xs",
  },
};

export const RoundnessDefault: Story = {
  args: {
    children: "Full",
    roundness: "default",
  },
};

export const RoundnessMedium: Story = {
  args: {
    children: "Medium",
    roundness: "md",
  },
};

export const RoundnessSmall: Story = {
  args: {
    children: "Small",
    roundness: "sm",
  },
};

export const RoundnessNone: Story = {
  args: {
    children: "None",
    roundness: "none",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const OutlineDestructive: Story = {
  args: {
    children: "Destructive",
    color: "destructive",
    variant: "outline",
  },
};

export const OutlineSuccess: Story = {
  args: {
    children: "Success",
    color: "success",
    variant: "outline",
  },
};

const COLORS = [
  "primary",
  "secondary",
  "destructive",
  "success",
  "warning",
  "info",
  "neutral",
] as const;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {COLORS.map((color) => (
          <Badge color={color} key={color}>
            {color}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {COLORS.map((color) => (
          <Badge color={color} key={color} variant="outline">
            {color}
          </Badge>
        ))}
      </div>
    </div>
  ),
};
