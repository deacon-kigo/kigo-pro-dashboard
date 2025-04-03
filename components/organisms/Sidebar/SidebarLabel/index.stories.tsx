import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import SidebarLabel from './index';
import { HomeIcon } from '@heroicons/react/24/outline';

// Story metadata
const meta: Meta<typeof SidebarLabel> = {
  component: SidebarLabel,
  title: 'Kigo UI/Organisms/Sidebar/SidebarLabel',
  parameters: {
    docs: {
      description: {
        component: 'Reusable navigation item used in the sidebar.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    isActive: { control: 'boolean' },
    isCollapsed: { control: 'boolean' },
    isCVSContext: { control: 'boolean' },
    hasNotification: { control: 'boolean' },
    notificationCount: { control: 'number' }
  }
};

export default meta;
type Story = StoryObj<typeof SidebarLabel>;

// Base SidebarLabel story
export const Default: Story = {
  args: {
    href: '#',
    icon: HomeIcon,
    title: 'Dashboard',
    isActive: false,
    isCollapsed: false,
    isCVSContext: false,
    hasNotification: false,
    notificationCount: 0
  }
};

// Active state
export const Active: Story = {
  args: {
    ...Default.args,
    isActive: true
  }
};

// Collapsed state
export const Collapsed: Story = {
  args: {
    ...Default.args,
    isCollapsed: true
  }
};

// CVS Context
export const CVSContext: Story = {
  args: {
    ...Default.args,
    isCVSContext: true
  }
};

// With notification
export const WithNotification: Story = {
  args: {
    ...Default.args,
    hasNotification: true,
    notificationCount: 5
  }
}; 