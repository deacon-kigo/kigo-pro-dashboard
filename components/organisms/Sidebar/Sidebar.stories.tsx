import type { Meta, StoryObj } from '@storybook/react';
import React, { ComponentType, ReactElement } from 'react';
// Use absolute imports to ensure proper resolution
import Sidebar from '@/components/organisms/Sidebar/Sidebar';
// Add SidebarLabel for potential mocking
import SidebarLabel from '@/components/organisms/Sidebar/SidebarLabel';

// Debug imports
console.log('Sidebar component imported:', Sidebar);
console.log('SidebarLabel component imported:', SidebarLabel);

// Add type declaration for window augmentation
declare global {
  interface Window {
    SidebarLabel?: ComponentType<any>;
  }
}

// Custom decorator to address potential resolution issues
const withSidebarResolutionFix = (Story: ComponentType): ReactElement => {
  // Ensure SidebarLabel is properly resolved
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // Make SidebarLabel globally available as a fallback
    window.SidebarLabel = SidebarLabel;
  }
  
  return <Story />;
};

// Story metadata
const meta: Meta<typeof Sidebar> = {
  component: Sidebar,
  title: 'Kigo UI/Organisms/Sidebar',
  parameters: {
    docs: {
      description: {
        component: 'Navigation sidebar that adapts based on user role and context.'
      }
    },
    layout: 'fullscreen'
  },
  tags: ['autodocs'],
  decorators: [
    withSidebarResolutionFix,
    (Story) => (
      <div style={{ height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const MerchantSidebar: Story = {
  parameters: {
    nextRouter: {
      path: '/'
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

export const SupportSidebar: Story = {
  parameters: {
    nextRouter: {
      path: '/tickets'
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

export const CVSSidebar: Story = {
  parameters: {
    nextRouter: {
      path: '/cvs/dashboard'
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

export const CollapsedSidebar: Story = {
  parameters: {
    nextRouter: {
      path: '/'
    },
    redux: {
      state: {
        ui: {
          sidebarCollapsed: true,
          sidebarWidth: '70px'
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

export const AdminSidebar: Story = {
  parameters: {
    nextRouter: {
      path: '/settings'
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
          themeMode: 'light'
        }
      }
    }
  }
}; 