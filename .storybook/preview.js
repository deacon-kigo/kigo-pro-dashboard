import "../app/globals.css";
import React from "react";
import { Provider } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { setupNextNavigationMocks } from "./mockNextNavigation";
import { setupNextHooksMocks } from "./mockNextHooks";
import { themes } from "@storybook/theming";

// Initialize Next.js navigation mocks
setupNextNavigationMocks();

// Initialize Next.js hooks mocks
setupNextHooksMocks();

// Mock the next/navigation module
// This needs to be at the top level, before any component imports
if (typeof window !== "undefined") {
  // Direct module replacement for usePathname
  window.usePathname = () => "/dashboard"; // Default fallback
}

// TypeScript declarations for Next.js router
/**
 * @typedef {Object} NextRouter
 * @property {string} pathname - The current path
 * @property {string} asPath - The as path
 * @property {Object} query - The query object
 * @property {Function} push - Navigate to a new URL
 * @property {Function} replace - Replace the current URL
 * @property {Function} back - Go back in history
 */

/**
 * Global window augmentation
 * @typedef {Object} WindowWithNextRouter
 * @property {string} __NEXT_ROUTER_BASEPATH - Next.js base path
 * @property {string} __NEXT_MOCK_PATHNAME - Mocked pathname for Storybook
 * @property {NextRouter} mockNextRouter - Mock router object
 */

// Create default mock state
const DEFAULT_MOCK_STATE = {
  ui: {
    sidebarCollapsed: false,
    sidebarWidth: "250px",
    isMobileView: false,
    currentBreakpoint: "lg",
    theme: "light",
    chatOpen: false,
    spotlightOpen: false,
    demoSelectorOpen: false,
  },
  demo: {
    role: "merchant",
    clientId: "deacons",
    clientName: "Deacon's Pizza",
    themeMode: "light",
    scenario: "default",
    version: "v1.0",
  },
  user: {
    profile: {
      name: "Demo User",
      email: "demo@kigo.com",
    },
    notifications: [],
  },
};

// Create a redux store factory
const createStore = (state = DEFAULT_MOCK_STATE) => {
  // Create UI slice
  const uiSlice = createSlice({
    name: "ui",
    initialState: state.ui,
    reducers: {
      toggleSidebar: (state) => {
        state.sidebarCollapsed = !state.sidebarCollapsed;
        state.sidebarWidth = state.sidebarCollapsed ? "70px" : "250px";
      },
    },
  });

  // Create demo slice
  const demoSlice = createSlice({
    name: "demo",
    initialState: state.demo,
    reducers: {},
  });

  // Create user slice
  const userSlice = createSlice({
    name: "user",
    initialState: state.user,
    reducers: {},
  });

  // Configure the store
  return configureStore({
    reducer: {
      ui: uiSlice.reducer,
      demo: demoSlice.reducer,
      user: userSlice.reducer,
    },
  });
};

// Global decorator for Redux
const withRedux = (Story, context) => {
  // Get parameters from the story or use defaults
  const { redux } = context.parameters;
  const store = createStore(redux?.state);

  // Debug component imports
  console.log("Story component:", context.component?.name);

  return (
    <Provider store={store}>
      <Story />
    </Provider>
  );
};

// Mock Next.js router for all stories
const withNextRouter = (Story, context) => {
  // We need to mock next/router for Storybook
  // This sets up a global mock that any component can access
  if (typeof window !== "undefined") {
    // Get pathname from story parameters or context
    const storyPath = context.parameters.nextRouter?.path || "/dashboard";

    // Create a global mock router object
    window.__NEXT_ROUTER_BASEPATH = "";
    window.__NEXT_MOCK_PATHNAME = storyPath;

    // Mock for any component that directly imports next/router
    window.mockNextRouter = {
      pathname: storyPath,
      asPath: storyPath,
      query: {},
      push: () => Promise.resolve(true),
      replace: () => Promise.resolve(true),
      back: () => {},
    };

    // For components that check basePath
    window.__NEXT_ROUTER_BASEPATH = "";

    // Make sure usePathname always returns the current path string
    window.usePathname = () => storyPath;

    // Ensure our mocks are properly loaded before component initialization
    // This helps ensure the mocks are available during component rendering
    Object.defineProperty(window, "usePathname", {
      value: () => storyPath,
      writable: true,
    });
  }

  return <Story />;
};

// Make sure search params mock is available in the global scope
if (typeof window !== "undefined") {
  window.useSearchParams = () => ({
    get: () => null,
    getAll: () => [],
    has: () => false,
    forEach: () => {},
    entries: () => [],
    keys: () => [],
    values: () => [],
    toString: () => "",
    size: 0,
    [Symbol.iterator]: function () {
      let done = false;
      return {
        next: () => {
          if (!done) {
            done = true;
            return { done: false, value: ["", ""] };
          }
          return { done: true, value: undefined };
        },
      };
    },
  });
}

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      story: {
        inline: true,
      },
      canvas: {
        sourceState: "shown",
      },
      source: {
        excludeDecorators: true,
        type: "code",
      },
      description: {
        component: "Description for the component",
      },
      argTypes: {
        excludeStories: ["default", "Primary", "Secondary", "Large", "Small"],
      },
      theme: themes.light,
    },
    nextRouter: {
      path: "/dashboard", // default path
    },
    // Default Redux state - can be overridden in individual stories
    redux: {
      state: DEFAULT_MOCK_STATE,
    },
  },
  // Apply the mock context decorator to all stories
  decorators: [
    withNextRouter,
    withRedux,
    (Story) => (
      <div className="font-sans antialiased text-text bg-white">
        <Story />
      </div>
    ),
  ],
};

export default preview;
