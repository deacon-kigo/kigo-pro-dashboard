import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";

import { Button } from ".";

const meta = {
  argTypes: {
    color: {
      control: "select",
      description: "The color scheme of the button",
      options: ["primary", "secondary", "destructive"],
    },
    size: {
      control: "select",
      description: "The size of the button",
      options: ["default", "xs", "sm", "lg", "xl", "icon"],
    },
    variant: {
      control: "select",
      description: "The visual style of the button",
      options: ["default", "ghost", "link", "outline"],
    },
  },
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
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

export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
  },
};

export const Link: Story = {
  args: {
    children: "Link",
    variant: "link",
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
    children: "Delete",
    color: "destructive",
    variant: "outline",
  },
};

export const GhostDestructive: Story = {
  args: {
    children: "Delete",
    color: "destructive",
    variant: "ghost",
  },
};

export const LinkDestructive: Story = {
  args: {
    children: "Delete",
    color: "destructive",
    variant: "link",
  },
};

export const WithIcon: Story = {
  args: {
    children: "Download",
    icon: <ArrowDownCircleIcon />,
  },
};

export const IconOnly: Story = {
  args: {
    icon: <ArrowDownCircleIcon />,
    size: "icon",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const SizeExtraSmall: Story = {
  args: {
    children: "Extra Small",
    size: "xs",
  },
};

export const SizeSmall: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const SizeLarge: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

export const SizeExtraLarge: Story = {
  args: {
    children: "Extra Large",
    size: "xl",
  },
};

const COLORS = ["primary", "secondary", "destructive"] as const;
const VARIANTS = ["default", "ghost", "link", "outline"] as const;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {VARIANTS.map((variant) => (
        <div className="flex flex-col gap-2" key={variant}>
          <span className="text-muted-foreground text-sm font-medium">
            {variant}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {COLORS.map((color) => (
              <Button color={color} key={color} variant={variant}>
                {color}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
