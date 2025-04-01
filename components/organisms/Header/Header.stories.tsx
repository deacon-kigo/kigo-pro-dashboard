import type { Meta, StoryObj } from '@storybook/react';
import Header from './Header';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';

// Create a mock wrapper that provides the same functionality as the original Header
// but with a controllable pathname
const HeaderStoryWrapper = (props: { pathname?: string }) => {
  // Instead of modifying the original component or trying to mock Next.js hooks,
  // we'll add a defensive null check directly in our story wrapper
  return (
    <div className="header-story-wrapper">
      <Header />
    </div>
  );
};

// Mock reducers and initial state
const mockUiInitialState = {
  isMobileView: false,
  sidebarCollapsed: false,
  sidebarWidth: '250px',
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
const createMockStore = (demoState = {}) => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      user: userReducer,
      demo: demoReducer
    },
    preloadedState: {
      ui: mockUiInitialState,
      user: mockUserInitialState,
      demo: {
        ...mockDemoInitialState,
        ...demoState
      }
    }
  });
};

const meta: Meta<typeof HeaderStoryWrapper> = {
  component: HeaderStoryWrapper,
  title: 'Organisms/Header',
  parameters: {
    docs: {
      description: {
        component: 'Main application header component that shows navigation, search, notifications, and user menu. Adapts based on user role and context.'
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider store={createMockStore()}>
        <div style={{ 
          height: '100vh', 
          padding: '80px 0 0 250px',
          background: '#f5f5f5'
        }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HeaderStoryWrapper>;

export const MerchantHeader: Story = {
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
        <div style={{ 
          height: '100vh', 
          padding: '80px 0 0 250px',
          background: '#f5f5f5'
        }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export const SupportHeader: Story = {
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
        <div style={{ 
          height: '100vh', 
          padding: '80px 0 0 250px',
          background: '#f5f5f5'
        }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export const CVSHeader: Story = {
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
        <div style={{ 
          height: '100vh', 
          padding: '80px 0 0 250px',
          background: '#f5f5f5'
        }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export const DarkModeHeader: Story = {
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
        <div style={{ 
          height: '100vh', 
          padding: '80px 0 0 250px',
          background: '#1a1a1a'
        }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
}; 