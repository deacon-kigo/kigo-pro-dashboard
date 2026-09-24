import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Card } from ".";

const meta = {
  argTypes: {
    elevation: {
      control: "select",
      description: "The shadow depth of the card",
      options: [1, 2, 3, 4],
    },
    roundness: {
      control: "select",
      description: "The border radius of the card",
      options: ["lg", "xl"],
    },
  },
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold">Card Title</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          This is a basic card with default settings.
        </p>
      </div>
    ),
  },
};

export const Elevation2: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold">Elevation 2</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Medium shadow depth.
        </p>
      </div>
    ),
    elevation: 2,
  },
};

export const Elevation3: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold">Elevation 3</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Large shadow depth.
        </p>
      </div>
    ),
    elevation: 3,
  },
};

export const Elevation4: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold">Elevation 4</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Extra large shadow depth.
        </p>
      </div>
    ),
    elevation: 4,
  },
};

export const RoundnessLarge: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold">Rounded LG</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Card with large border radius.
        </p>
      </div>
    ),
    roundness: "lg",
  },
};

export const AllElevations: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {([1, 2, 3, 4] as const).map((elevation) => (
        <Card elevation={elevation} key={elevation}>
          <div className="p-6">
            <h3 className="text-lg font-semibold">Elevation {elevation}</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              shadow level {elevation}
            </p>
          </div>
        </Card>
      ))}
    </div>
  ),
};
