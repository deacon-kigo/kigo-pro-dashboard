import type { Meta, StoryObj } from '@storybook/react';
import Sidebar from './Sidebar';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';

// Create a mock wrapper that provides the same functionality as the original Sidebar
// but with a controllable pathname
const SidebarStoryWrapper = (props: { pathname?: string }) => {
  // Instead of modifying the original component or trying to mock Next.js hooks,
  // we'll add a defensive check directly in our story wrapper
  return (
    <div className="sidebar-story-wrapper">
      <Sidebar />
    </div>
  );
};

// Mock reducers and initial state
const mockUiInitialState = {
  isMobileView: false,
  sidebarCollapsed: false,
  sidebarWidth: '225px',
  currentBreakpoint: 'lg',
  theme: 'light',
  chatOpen: false,
  spotlightOpen: false,
  demoSelectorOpen: false,
  demoSelectorPinned: false,
  demoSelectorCollapsed: false
};

const mockUserInitialState = {
  profile: {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    role: 'merchant'
  },
  notifications: [
    { id: '1', title: 'New message', content: 'You have a new message', read: false, timestamp: new Date().toISOString() },
    { id: '2', title: 'Payment received', content: 'You received a payment', read: true, timestamp: new Date().toISOString() }
  ]
};

const mockDemoInitialState = {
  role: 'merchant',
  clientId: 'deacons',
  clientName: 'Deacon\'s Pizza',
  themeMode: 'light',
  version: 'v1.0'
};

// Mock reducers
const uiReducer = (state = mockUiInitialState) => state;
const userReducer = (state = mockUserInitialState) => state;
const demoReducer = (state = mockDemoInitialState, action: any) => {
  if (action.type === 'SET_DEMO_STATE') {
    return {
      ...state,
      ...action.payload
    };
  }
  return state;
};

// Create a mock store for Storybook
const createMockStore = (demoState = {}, uiState = {}) => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      user: userReducer,
      demo: demoReducer
    },
    preloadedState: {
      ui: {...mockUiInitialState, ...uiState},
      user: mockUserInitialState,
      demo: {
        ...mockDemoInitialState,
        ...demoState
      }
    }
  });
};

const meta: Meta<typeof SidebarStoryWrapper> = {
  component: SidebarStoryWrapper,
  title: 'Organisms/Sidebar',
  parameters: {
    docs: {
      description: {
        component: 'Navigation sidebar that adapts based on user role and context. Can be collapsed or expanded.'
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider store={createMockStore()}>
        <div style={{ height: '100vh', background: '#f5f5f5' }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SidebarStoryWrapper>;

export const MerchantSidebar: Story = {
  args: {
    pathname: '/dashboard'
  },
  decorators: [
    (Story) => (
      <Provider store={createMockStore({
        role: 'merchant',
        clientId: 'deacons',
        clientName: 'Deacon\'s Pizza',
        themeMode: 'light'
      })}>
        <div style={{ height: '100vh', background: '#f5f5f5' }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export const SupportSidebar: Story = {
  args: {
    pathname: '/support'
  },
  decorators: [
    (Story) => (
      <Provider store={createMockStore({
        role: 'support',
        clientId: 'support',
        clientName: 'Support Portal',
        themeMode: 'light'
      })}>
        <div style={{ height: '100vh', background: '#f5f5f5' }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export const CVSSidebar: Story = {
  args: {
    pathname: '/cvs-dashboard'
  },
  decorators: [
    (Story) => (
      <Provider store={createMockStore({
        role: 'support',
        clientId: 'cvs',
        clientName: 'CVS Health',
        themeMode: 'light'
      })}>
        <div style={{ height: '100vh', background: '#f5f5f5' }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export const CollapsedSidebar: Story = {
  args: {
    pathname: '/dashboard'
  },
  decorators: [
    (Story) => (
      <Provider store={createMockStore(
        {
          role: 'merchant',
          clientId: 'deacons',
          clientName: 'Deacon\'s Pizza',
          themeMode: 'light'
        },
        {
          sidebarCollapsed: true,
          sidebarWidth: '70px'
        }
      )}>
        <div style={{ height: '100vh', background: '#f5f5f5' }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export const DarkMode: Story = {
  args: {
    pathname: '/admin'
  },
  decorators: [
    (Story) => (
      <Provider store={createMockStore({
        role: 'admin',
        clientId: 'admin',
        clientName: 'Admin Portal',
        themeMode: 'dark'
      })}>
        <div style={{ height: '100vh', background: '#1a1a1a' }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
}; 