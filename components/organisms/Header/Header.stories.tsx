import type { Meta, StoryObj } from '@storybook/react';
import Header from './Header';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';

// We can't use jest.mock directly in Storybook, so we'll use the window property approach

// Create a wrapper for the Header component with Redux Provider
const HeaderStoryWrapper = (props: { pathname?: string }) => {
  // Update the mock pathname when the component renders or props change
  useEffect(() => {
    if (typeof window !== 'undefined' && props.pathname) {
      window.__NEXT_MOCK_PATHNAME = props.pathname;
    }
  }, [props.pathname]);
  
  return (
    <div className="header-story-wrapper">
      <Header />
    </div>
  );
};

// Declare global window properties for TypeScript
declare global {
  interface Window {
    __NEXT_MOCK_PATHNAME?: string;
  }
}

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

// Create a mock store
const createMockStore = (demoState: Record<string, unknown> = {}) => {
  return configureStore({
    reducer: {
      ui: (state = mockUiInitialState) => state,
      user: (state = mockUserInitialState) => state,
      demo: (state = demoState, action: { type: string; payload?: Record<string, unknown> }) => {
        if (action.type === 'SET_DEMO_STATE' && action.payload) {
          return { ...state, ...action.payload };
        }
        return state;
      }
    }
  });
};

const meta: Meta<typeof HeaderStoryWrapper> = {
  component: HeaderStoryWrapper,
  title: 'Kigo UI/Organisms/Header',
  parameters: {
    docs: {
      description: {
        component: 'Main application header component that shows navigation, search, notifications, and user menu. Adapts based on user role and context.'
      },
    },
    layout: 'fullscreen',
    mockData: true, // This will display the Redux notice
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider store={createMockStore({
        role: 'merchant',
        clientId: 'deacons',
        clientName: 'Deacon\'s Pizza',
        themeMode: 'light',
        version: 'v1.0'
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