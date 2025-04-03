import type { Meta, StoryObj } from '@storybook/react';
import React, { ReactNode } from 'react';
import { AppLayout } from './AppLayout';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import {
  HomeIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  TicketIcon
} from '@heroicons/react/24/outline';

// Create a simple mock store factory
const createMockStore = ({
  role = 'merchant',
  clientId = 'deacons',
  clientName = 'Deacon\'s Pizza',
  isCollapsed = false,
  pathname = '/'
}) => {
  // Create UI slice with appropriate state
  const uiSlice = createSlice({
    name: 'ui',
    initialState: {
      sidebarCollapsed: isCollapsed,
      sidebarWidth: isCollapsed ? '70px' : '250px',
      isMobileView: false,
      currentBreakpoint: 'lg',
      theme: 'light',
      chatOpen: false,
      spotlightOpen: false,
      demoSelectorOpen: false
    },
    reducers: {
      toggleSidebar: state => {
        state.sidebarCollapsed = !state.sidebarCollapsed;
      }
    }
  });

  // Create demo slice with role, client info
  const demoSlice = createSlice({
    name: 'demo',
    initialState: {
      role,
      clientId,
      clientName,
      themeMode: 'light',
      scenario: 'default',
      version: 'v1.0'
    },
    reducers: {}
  });

  // Create user slice
  const userSlice = createSlice({
    name: 'user',
    initialState: {
      profile: {
        name: 'Demo User',
        email: 'demo@kigo.com'
      },
      notifications: []
    },
    reducers: {}
  });

  return configureStore({
    reducer: {
      ui: uiSlice.reducer,
      demo: demoSlice.reducer,
      user: userSlice.reducer
    }
  });
};

// Create a wrapper component that provides the Redux store
const StoreWrapper = (props: {
  children: ReactNode;
  role?: 'merchant' | 'support' | 'admin';
  clientId?: string;
  clientName?: string;
  isCollapsed?: boolean;
  pathname?: string;
}) => {
  const { children, ...storeProps } = props;
  
  // We need to mock the pathname for Next.js navigation
  React.useEffect(() => {
    if (storeProps.pathname) {
      window.__NEXT_MOCK_PATHNAME = storeProps.pathname;
      window.usePathname = () => window.__NEXT_MOCK_PATHNAME || '/';
    }
  }, [storeProps.pathname]);

  const store = createMockStore(storeProps);
  return <Provider store={store}>{children}</Provider>;
};

// TypeScript declaration for the Next.js navigation mock
declare global {
  interface Window {
    __NEXT_MOCK_PATHNAME?: string;
    usePathname?: () => string;
  }
}

// Demo content for all stories
const DemoContent = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Dashboard Overview</h2>
      <p className="text-text-muted">This is a demo content area showing how the AppLayout presents content.</p>
      <div className="mt-4 p-4 bg-primary-light text-primary rounded">
        <p>Main content area with padding and responsive design.</p>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Key Metrics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-pastel-blue rounded">
          <p className="text-sm text-text-muted">Revenue</p>
          <p className="text-xl font-bold">$24,500</p>
        </div>
        <div className="p-3 bg-pastel-green rounded">
          <p className="text-sm text-text-muted">Customers</p>
          <p className="text-xl font-bold">1,245</p>
        </div>
        <div className="p-3 bg-pastel-purple rounded">
          <p className="text-sm text-text-muted">Campaigns</p>
          <p className="text-xl font-bold">12</p>
        </div>
        <div className="p-3 bg-pastel-yellow rounded">
          <p className="text-sm text-text-muted">Engagement</p>
          <p className="text-xl font-bold">87%</p>
        </div>
      </div>
    </div>
  </div>
);

// Add this new demo content for responsive testing
const ResponsiveTestContent = () => (
  <div className="flex flex-col space-y-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Responsive Layout Test</h2>
      <p className="text-text-muted">This content demonstrates that the padding aligns with the header elements.</p>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-primary-light text-primary rounded">Content Area 1</div>
        <div className="p-4 bg-primary-light text-primary rounded">Content Area 2</div>
        <div className="p-4 bg-primary-light text-primary rounded">Content Area 3</div>
      </div>
    </div>
    
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Content Boundary</h2>
      <div className="border border-dashed border-red-400 p-4 rounded">
        <p className="text-sm text-text-muted">This box shows the content boundaries that should align with header elements.</p>
      </div>
    </div>
    
    <div className="flex flex-wrap gap-4">
      <div className="bg-white p-6 rounded-lg shadow flex-grow">
        <h2 className="text-lg font-semibold mb-4">Header Alignment</h2>
        <p className="text-text-muted">The left edge of this card aligns with the search bar in the header.</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow flex-grow">
        <h2 className="text-lg font-semibold mb-4">Right Alignment</h2>
        <p className="text-text-muted">The right edge aligns with the notification icons in the header.</p>
      </div>
    </div>
  </div>
);

const meta: Meta<typeof AppLayout> = {
  component: AppLayout,
  title: 'Kigo UI/Templates/AppLayout',
  parameters: {
    docs: {
      description: {
        component: 'Main application layout that includes Header, Sidebar, and content area.',
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

export const Default: Story = {
  args: {
    children: <DemoContent />
  },
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

export const CollapsedSidebar: Story = {
  args: {
    children: <DemoContent />
  },
  parameters: {
    nextRouter: {
      path: '/dashboard'
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

// Add this new story after the existing ones
export const ResponsiveLayout: Story = {
  args: {
    children: <ResponsiveTestContent />
  },
  parameters: {
    nextRouter: {
      path: '/dashboard'
    },
    redux: {
      state: {
        ui: {
          sidebarCollapsed: false,
          sidebarWidth: '225px'
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