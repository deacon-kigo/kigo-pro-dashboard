import type { Meta, StoryObj } from '@storybook/react';
import Header from './Header';
import React from 'react';

// We can't use jest.mock directly in Storybook, so we'll use the window property approach

const meta: Meta<typeof Header> = {
  component: Header,
  title: 'Kigo UI/Organisms/Header',
  parameters: {
    docs: {
      description: {
        component: 'Main application header component that shows navigation, search, notifications, and user menu. Adapts based on user role and context.'
      },
    },
    layout: 'fullscreen'
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ 
        height: '100vh', 
        padding: '0',
        background: '#f5f5f5'
      }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const MerchantHeader: Story = {
  parameters: {
    nextRouter: {
      path: '/dashboard'
    },
    redux: {
      state: {
        ui: {
          sidebarCollapsed: false,
          sidebarWidth: '250px'
        },
        demo: {
          role: 'merchant',
          clientId: 'deacons',
          clientName: 'Deacon\'s Pizza',
          themeMode: 'light'
        }
      }
    }
  }
};

export const SupportHeader: Story = {
  parameters: {
    nextRouter: {
      path: '/support'
    },
    redux: {
      state: {
        ui: {
          sidebarCollapsed: false,
          sidebarWidth: '250px'
        },
        demo: {
          role: 'support',
          clientId: 'support',
          clientName: 'Support Portal',
          themeMode: 'light'
        }
      }
    }
  }
};

export const CVSHeader: Story = {
  parameters: {
    nextRouter: {
      path: '/cvs-dashboard'
    },
    redux: {
      state: {
        ui: {
          sidebarCollapsed: false,
          sidebarWidth: '250px'
        },
        demo: {
          role: 'support',
          clientId: 'cvs',
          clientName: 'CVS Health',
          themeMode: 'light'
        }
      }
    }
  }
};

export const DarkModeHeader: Story = {
  parameters: {
    nextRouter: {
      path: '/admin'
    },
    redux: {
      state: {
        ui: {
          sidebarCollapsed: false,
          sidebarWidth: '250px'
        },
        demo: {
          role: 'admin',
          clientId: 'admin',
          clientName: 'Admin Portal',
          themeMode: 'dark'
        }
      }
    }
  }
}; 