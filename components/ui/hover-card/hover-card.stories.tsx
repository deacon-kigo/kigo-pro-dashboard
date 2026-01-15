import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CalendarIcon } from "@heroicons/react/24/outline";

import { HoverCard, HoverCardContent, HoverCardTrigger } from ".";
import { Button } from "../button";

const meta = {
  component: HoverCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HoverCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">Hover me</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">@nextjs</h4>
          <p className="text-sm">
            The React Framework – created and maintained by @vercel.
          </p>
          <div className="flex items-center pt-2">
            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-muted-foreground text-xs">
              Joined December 2021
            </span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const WithCustomWidth: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="outline">Product Details</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-semibold">Premium Package</h4>
          <p className="text-sm">
            Get access to all premium features including advanced analytics,
            priority support, and custom integrations.
          </p>
          <div className="text-muted-foreground mt-4 flex justify-between border-t pt-2 text-sm">
            <span>Price:</span>
            <span className="font-semibold">$99/month</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const WithImage: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost">View Profile</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2">
          <div className="flex items-start space-x-4">
            <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
              <span className="text-lg font-semibold">JD</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">John Doe</h4>
              <p className="text-muted-foreground text-xs">Product Manager</p>
            </div>
          </div>
          <p className="text-sm">
            Building amazing products with a focus on user experience and
            innovation.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const MinimalInfo: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button size="sm" variant="link">
          Learn more
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto p-2">
        <p className="text-sm">Additional information appears here on hover</p>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const WithList: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="outline">Features</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Key Features</h4>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Advanced Analytics
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Real-time Updates
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Team Collaboration
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              24/7 Support
            </li>
          </ul>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
