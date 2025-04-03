/**
 * Redux Mock Provider for Storybook
 * 
 * This file provides utilities for mocking Redux state in Storybook stories.
 * It includes types for common state objects and a factory function for creating mock stores.
 */
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define common types for mock state
export interface MockUIState {
  sidebarCollapsed: boolean;
  sidebarWidth: string;
  isMobileView: boolean;
  chatOpen: boolean;
  spotlightOpen: boolean;
  demoSelectorOpen: boolean;
  demoSelectorPinned: boolean;
  demoSelectorCollapsed: boolean;
  [key: string]: any; // Allow for additional properties
}

export interface MockDemoState {
  role: string;
  clientId: string;
  clientName: string;
  themeMode: string;
  scenario: string;
  version: string;
  instances: any[];
  currentInstanceIndex: number;
  [key: string]: any; // Allow for additional properties
}

export interface MockUserState {
  notifications: any[];
  profile: any;
  [key: string]: any; // Allow for additional properties
}

export interface MockState {
  ui: MockUIState;
  demo: MockDemoState;
  user?: MockUserState;
  [key: string]: any; // Allow for additional slices
}

/**
 * Creates a mock Redux store with the specified initial state
 */
export const createMockStore = (initialState: MockState) => {
  // Create UI slice with initial state
  const uiSlice = createSlice({
    name: 'ui',
    initialState: initialState.ui,
    reducers: {
      toggleSidebar: (state) => {
        state.sidebarCollapsed = !state.sidebarCollapsed;
        state.sidebarWidth = state.sidebarCollapsed ? '70px' : '225px';
      },
      setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
        state.sidebarCollapsed = action.payload;
        state.sidebarWidth = action.payload ? '70px' : '225px';
      }
    }
  });

  // Create demo slice with initial state
  const demoSlice = createSlice({
    name: 'demo',
    initialState: initialState.demo,
    reducers: {}
  });

  // Create reducers object with required slices
  const reducers: Record<string, any> = {
    ui: uiSlice.reducer,
    demo: demoSlice.reducer,
  };

  // Add user slice if provided
  if (initialState.user) {
    const userSlice = createSlice({
      name: 'user',
      initialState: initialState.user,
      reducers: {}
    });
    reducers.user = userSlice.reducer;
  }

  // Add any additional slices
  Object.keys(initialState).forEach(key => {
    if (!['ui', 'demo', 'user'].includes(key) && initialState[key] !== undefined) {
      const slice = createSlice({
        name: key,
        initialState: initialState[key],
        reducers: {}
      });
      reducers[key] = slice.reducer;
    }
  });

  // Create and return the mock store
  return configureStore({
    reducer: reducers
  });
};

/**
 * Common mock states for stories
 */
export const DEFAULT_MOCK_STATE: MockState = {
  ui: {
    sidebarCollapsed: false,
    sidebarWidth: '225px',
    isMobileView: false,
    chatOpen: false,
    spotlightOpen: false,
    demoSelectorOpen: false,
    demoSelectorPinned: false,
    demoSelectorCollapsed: false
  },
  demo: {
    role: 'merchant',
    clientId: 'deacons',
    clientName: 'Deacon\'s Pizza',
    themeMode: 'light',
    scenario: 'default',
    version: 'current',
    instances: [],
    currentInstanceIndex: -1
  },
  user: {
    notifications: [],
    profile: {
      name: 'Demo User',
      email: 'demo@kigo.com',
      avatar: null
    }
  }
};

/**
 * Redux Provider wrapper for Storybook stories
 */
export const MockReduxProvider: React.FC<{
  children: React.ReactNode;
  mockState: MockState;
}> = ({ children, mockState }) => {
  const store = createMockStore(mockState);
  
  // Set CSS variable for sidebar width if it exists in the mockState
  if (typeof document !== 'undefined' && mockState.ui) {
    document.documentElement.style.setProperty(
      '--sidebar-width', 
      mockState.ui.sidebarCollapsed ? '70px' : '225px'
    );
  }
  
  return <Provider store={store}>{children}</Provider>;
};

export default MockReduxProvider; 