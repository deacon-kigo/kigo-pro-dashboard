import type { Meta, StoryObj } from '@storybook/react';
import Sidebar from './Sidebar';
import SidebarLabel from './SidebarLabel';
import { DecoratorFunction } from '@storybook/types';
import { ReactRenderer } from '@storybook/react';

// Debug imports
console.log('Sidebar component imported:', Sidebar);
console.log('SidebarLabel component imported:', SidebarLabel);

// Add TypeScript interface for window to make TypeScript happy
declare global {
  interface Window {
    SidebarLabel?: typeof SidebarLabel;
  }
}

const meta = {
  title: 'Kigo UI/Organisms/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => {
      // Make SidebarLabel globally available for development
      console.log('SidebarLabel:', SidebarLabel);
      console.log('Sidebar:', Sidebar);
      if (typeof window !== 'undefined') {
        window.SidebarLabel = SidebarLabel;
      }
      return <Story />;
    }
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MerchantSidebar: Story = {
  args: {
    role: 'merchant',
    isCVSContext: false
  },
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
  args: {
    role: 'support',
    isCVSContext: false
  },
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
  args: {
    role: 'support',
    isCVSContext: true
  },
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
  args: {
    role: 'merchant',
    isCVSContext: false
  },
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
  args: {
    role: 'admin',
    isCVSContext: false
  },
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