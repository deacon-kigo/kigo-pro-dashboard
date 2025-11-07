import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Applications/Kigo Pro/Atoms/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A tabbed interface component for organizing and switching between content sections.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">Account</TabsTrigger>
        <TabsTrigger value="tab2">Password</TabsTrigger>
        <TabsTrigger value="tab3">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="p-4 border rounded-md mt-2">
        <h3 className="text-lg font-medium mb-2">Account Settings</h3>
        <p className="text-gray-600">
          Manage your account information and preferences.
        </p>
      </TabsContent>
      <TabsContent value="tab2" className="p-4 border rounded-md mt-2">
        <h3 className="text-lg font-medium mb-2">Password</h3>
        <p className="text-gray-600">
          Update your password and security settings.
        </p>
      </TabsContent>
      <TabsContent value="tab3" className="p-4 border rounded-md mt-2">
        <h3 className="text-lg font-medium mb-2">General Settings</h3>
        <p className="text-gray-600">
          Control application preferences and notifications.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

export const DisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">Active</TabsTrigger>
        <TabsTrigger value="tab2" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="tab3">Another Tab</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="p-4 border rounded-md mt-2">
        <p className="text-gray-600">This is the active tab content.</p>
      </TabsContent>
      <TabsContent value="tab2" className="p-4 border rounded-md mt-2">
        <p className="text-gray-600">
          This content is not accessible via the disabled tab.
        </p>
      </TabsContent>
      <TabsContent value="tab3" className="p-4 border rounded-md mt-2">
        <p className="text-gray-600">This is another tab content.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const VerticalTabs: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[500px]" orientation="vertical">
      <TabsList className="flex flex-col w-[150px] h-auto">
        <TabsTrigger value="tab1" className="justify-start">
          Dashboard
        </TabsTrigger>
        <TabsTrigger value="tab2" className="justify-start">
          Analytics
        </TabsTrigger>
        <TabsTrigger value="tab3" className="justify-start">
          Reports
        </TabsTrigger>
      </TabsList>
      <div className="flex-1 p-4 border rounded-md ml-4">
        <TabsContent value="tab1">
          <h3 className="text-lg font-medium mb-2">Dashboard</h3>
          <p className="text-gray-600">View your dashboard overview.</p>
        </TabsContent>
        <TabsContent value="tab2">
          <h3 className="text-lg font-medium mb-2">Analytics</h3>
          <p className="text-gray-600">Track your application performance.</p>
        </TabsContent>
        <TabsContent value="tab3">
          <h3 className="text-lg font-medium mb-2">Reports</h3>
          <p className="text-gray-600">Generate and download reports.</p>
        </TabsContent>
      </div>
    </Tabs>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList className="bg-blue-50 p-1 rounded-lg">
        <TabsTrigger
          value="tab1"
          className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md"
        >
          First
        </TabsTrigger>
        <TabsTrigger
          value="tab2"
          className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md"
        >
          Second
        </TabsTrigger>
        <TabsTrigger
          value="tab3"
          className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md"
        >
          Third
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="p-4 bg-blue-50 rounded-md mt-2">
        <p>Custom styled first tab content.</p>
      </TabsContent>
      <TabsContent value="tab2" className="p-4 bg-blue-50 rounded-md mt-2">
        <p>Custom styled second tab content.</p>
      </TabsContent>
      <TabsContent value="tab3" className="p-4 bg-blue-50 rounded-md mt-2">
        <p>Custom styled third tab content.</p>
      </TabsContent>
    </Tabs>
  ),
};
