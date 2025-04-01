import type { Meta, StoryObj } from '@storybook/react';
import StandardDashboard from './StandardDashboard';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { ReactNode } from 'react';

// Define the props type manually
type StandardDashboardProps = {
  children: ReactNode;
  greeting?: string;
  headerContent?: ReactNode;
  statsSection?: ReactNode;
  sidebarContent?: ReactNode;
};

// Create a mock context for DemoContext
const DemoContext = React.createContext({
  role: 'merchant',
  clientId: 'deacons',
  clientName: 'Deacon\'s Pizza',
  userProfile: {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    title: 'Store Manager',
    email: 'john@example.com',
  },
  themeMode: 'light',
  version: 'current',
});

// Create a mock wrapper for StandardDashboard
const StandardDashboardWrapper = (props: StandardDashboardProps) => {
  // Pass all props through to the actual component
  return <StandardDashboard {...props} />;
};

// Create mock for useDemo - inject it into the story wrapper's context
// @ts-ignore - Importing this way to override hooks for Storybook
import * as DemoContextModule from '@/contexts/DemoContext';
// @ts-ignore - Assume this is working in Storybook
DemoContextModule.useDemo = () => React.useContext(DemoContext);

// Simple mock for avatar util
const mockAvatarUrl = 'https://i.pravatar.cc/150?img=3';
// @ts-ignore - Importing this way to override utilities for Storybook
import * as AvatarUtils from '@/lib/avatarUtils';
// @ts-ignore - Assume this is working in Storybook
AvatarUtils.getMockAvatarUrl = () => mockAvatarUrl;

const meta: Meta<typeof StandardDashboardWrapper> = {
  component: StandardDashboardWrapper,
  title: 'Templates/StandardDashboard',
  parameters: {
    docs: {
      description: {
        component: 'A standard dashboard layout template that provides a consistent framework for dashboard views including header, stats section, main content, and sidebar.'
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <DemoContext.Provider value={{
        role: 'merchant',
        clientId: 'deacons',
        clientName: 'Deacon\'s Pizza',
        userProfile: {
          id: '123',
          firstName: 'John',
          lastName: 'Doe',
          title: 'Store Manager',
          email: 'john@example.com',
        },
        themeMode: 'light',
        version: 'current',
      }}>
        <div style={{ padding: '30px', backgroundColor: '#f5f8fa', minHeight: '100vh' }}>
          <Story />
        </div>
      </DemoContext.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StandardDashboardWrapper>;

export const Default: Story = {
  args: {
    children: (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Dashboard Content</h2>
        <p className="text-gray-600 mb-4">
          This is the main content area of the dashboard. It can contain any components or content needed for the specific dashboard view.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium">Recent Orders</h3>
            <p className="text-sm text-gray-600">View and manage your recent orders</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium">Performance</h3>
            <p className="text-sm text-gray-600">Track your store performance metrics</p>
          </div>
        </div>
      </div>
    ),
  },
};

export const WithCustomStats: Story = {
  args: {
    children: (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Dashboard Content</h2>
        <p className="text-gray-600">Main dashboard content goes here</p>
      </div>
    ),
    statsSection: (
      <>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-md mr-3">
              <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-lg font-semibold">$24,780</p>
              <p className="text-xs text-green-600">↑ 12% from last month</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-md mr-3">
              <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Orders</p>
              <p className="text-lg font-semibold">578</p>
              <p className="text-xs text-green-600">↑ 8% from last month</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-md mr-3">
              <svg className="h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customers</p>
              <p className="text-lg font-semibold">1,429</p>
              <p className="text-xs text-green-600">↑ 5% from last month</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-md mr-3">
              <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rating</p>
              <p className="text-lg font-semibold">4.8/5.0</p>
              <p className="text-xs text-green-600">↑ 0.2 from last month</p>
            </div>
          </div>
        </div>
      </>
    ),
  },
};

export const WithCustomHeader: Story = {
  args: {
    children: (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Dashboard Content</h2>
        <p className="text-gray-600">Main dashboard content goes here</p>
      </div>
    ),
    headerContent: (
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">Deacon's Pizza Dashboard</h1>
          <p className="text-gray-600">Welcome to your personalized dashboard</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            New Order
          </button>
          <button className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            View Reports
          </button>
        </div>
      </div>
    ),
  },
}; 