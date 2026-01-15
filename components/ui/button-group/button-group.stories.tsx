import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import { ButtonGroup, ButtonGroupText } from ".";
import { Button } from "../button";

const meta = {
  component: ButtonGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ButtonGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button size="sm" variant="outline">
        Button 1
      </Button>
      <Button size="sm" variant="outline">
        Button 2
      </Button>
      <Button size="sm" variant="outline">
        Button 3
      </Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button size="sm" variant="outline">
        Button 1
      </Button>
      <Button size="sm" variant="outline">
        Button 2
      </Button>
      <Button size="sm" variant="outline">
        Button 3
      </Button>
    </ButtonGroup>
  ),
};

export const WithIcons: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button icon={<ChevronLeftIcon />} size="sm" variant="outline" />
      <ButtonGroupText>1 / 3</ButtonGroupText>
      <Button icon={<ChevronRightIcon />} size="sm" variant="outline" />
    </ButtonGroup>
  ),
};

export const BranchNavigation: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args) => (
    <ButtonGroup
      {...args}
      className="[&>*:not(:first-child)]:rounded-l-md [&>*:not(:last-child)]:rounded-r-md"
    >
      <Button icon={<ChevronLeftIcon />} size="sm" variant="ghost" />
      <ButtonGroupText className="text-muted-foreground border-none bg-transparent shadow-none">
        Branch 1 of 3
      </ButtonGroupText>
      <Button icon={<ChevronRightIcon />} size="sm" variant="ghost" />
    </ButtonGroup>
  ),
};

export const Primary: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button size="sm" variant="primary">
        Save
      </Button>
      <Button size="sm" variant="primary">
        Save & Close
      </Button>
      <Button size="sm" variant="primary">
        Save & New
      </Button>
    </ButtonGroup>
  ),
};

export const Mixed: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button size="sm" variant="outline">
        Cancel
      </Button>
      <Button size="sm" variant="primary">
        Confirm
      </Button>
    </ButtonGroup>
  ),
};
