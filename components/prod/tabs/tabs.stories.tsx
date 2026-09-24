import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Tabs, TabsContent, TabsList, TabsTrigger } from ".";

const meta = {
  component: Tabs,
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <p className="p-4 text-sm">Content for tab 1</p>
        </TabsContent>
        <TabsContent value="tab2">
          <p className="p-4 text-sm">Content for tab 2</p>
        </TabsContent>
        <TabsContent value="tab3">
          <p className="p-4 text-sm">Content for tab 3</p>
        </TabsContent>
      </>
    ),
    defaultValue: "tab1",
  },
};

export const TwoTabs: Story = {
  args: {
    children: (
      <>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <p className="p-4 text-sm">Overview content</p>
        </TabsContent>
        <TabsContent value="details">
          <p className="p-4 text-sm">Details content</p>
        </TabsContent>
      </>
    ),
    defaultValue: "overview",
  },
};

export const WithDisabledTab: Story = {
  args: {
    children: (
      <>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger disabled value="disabled">
            Disabled
          </TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <p className="p-4 text-sm">Active tab content</p>
        </TabsContent>
        <TabsContent value="other">
          <p className="p-4 text-sm">Other tab content</p>
        </TabsContent>
      </>
    ),
    defaultValue: "active",
  },
};
