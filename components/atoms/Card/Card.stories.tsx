import type { Meta, StoryObj } from "@storybook/react";
import Card from "./Card";

/**
 * Card component for displaying content in a visually distinct container.
 * Optionally includes a title section.
 */

const meta: Meta<typeof Card> = {
  component: Card,
  title: "Applications/Kigo Pro/Atoms/Card",
  parameters: {
    docs: {
      description: {
        component:
          "Card component for displaying content in a contained box with optional title.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      description: "Optional card title displayed in the header",
      control: "text",
    },
    className: {
      description: "Additional CSS classes to apply",
      control: "text",
    },
    children: {
      description: "Card content",
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: <div className="p-5">Card content goes here</div>,
  },
};

export const WithTitle: Story = {
  args: {
    title: "Card Title",
    children: <div className="p-5">Card content with a title</div>,
  },
};

export const CustomStyles: Story = {
  args: {
    title: "Custom Card",
    className: "bg-pastel-blue border-blue",
    children: <div className="p-5">Card with custom styling</div>,
  },
};

export const ComplexContent: Story = {
  render: () => (
    <Card title="User Profile">
      <div className="p-5">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-pastel-purple rounded-full flex items-center justify-center text-indigo-500 font-semibold text-lg">
            JD
          </div>
          <div>
            <h4 className="font-semibold">John Doe</h4>
            <p className="text-sm text-text-muted">john.doe@example.com</p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm">Member since: January 2023</p>
        </div>
      </div>
    </Card>
  ),
};

export const NestedCards: Story = {
  render: () => (
    <Card title="Dashboard Overview">
      <div className="p-5 space-y-4">
        <Card className="shadow-none border border-gray-100">
          <div className="p-4">
            <h4 className="font-semibold mb-2">Statistics</h4>
            <div className="flex gap-4">
              <div className="bg-pastel-green p-3 rounded-md text-center">
                <div className="font-bold">120</div>
                <div className="text-xs text-text-muted">New Users</div>
              </div>
              <div className="bg-pastel-blue p-3 rounded-md text-center">
                <div className="font-bold">$5,240</div>
                <div className="text-xs text-text-muted">Revenue</div>
              </div>
            </div>
          </div>
        </Card>
        <Card className="shadow-none border border-gray-100">
          <div className="p-4">
            <h4 className="font-semibold mb-2">Recent Activity</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>New sale</span>
                <span className="text-green">+$240</span>
              </li>
              <li className="flex justify-between">
                <span>New customer</span>
                <span>Jane Smith</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </Card>
  ),
};
