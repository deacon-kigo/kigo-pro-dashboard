import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Sidebar from "./Sidebar";
import SidebarLabel from "./SidebarLabel";
import { Provider } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";

// Debug imports
console.log("Sidebar component imported:", Sidebar);
console.log("SidebarLabel component imported:", SidebarLabel);

// Add TypeScript interface for window to make TypeScript happy
declare global {
  interface Window {
    SidebarLabel?: typeof SidebarLabel;
    __NEXT_MOCK_PATHNAME?: string;
    useRouter?: () => {
      push: (url: string) => void;
      replace: (url: string) => void;
    };
  }
}

// Define our user profile type
interface UserProfile {
  name: string;
  email: string;
}

// Create a custom mock store for testing
const createMockStore = ({
  role = "merchant",
  clientId = "deacons",
  clientName = "Deacon's Pizza",
  isCollapsed = false,
}) => {
  // Create UI slice with appropriate state
  const uiSlice = createSlice({
    name: "ui",
    initialState: {
      sidebarCollapsed: isCollapsed,
      sidebarWidth: isCollapsed ? "70px" : "225px",
      isMobileView: false,
      currentBreakpoint: "lg",
      theme: "light",
      chatOpen: false,
      spotlightOpen: false,
      demoSelectorOpen: false,
    },
    reducers: {
      toggleSidebar: (state) => {
        state.sidebarCollapsed = !state.sidebarCollapsed;
        state.sidebarWidth = state.sidebarCollapsed ? "70px" : "225px";
      },
      setSidebarCollapsed: (state, action) => {
        state.sidebarCollapsed = action.payload;
        state.sidebarWidth = action.payload ? "70px" : "225px";
      },
    },
  });

  // Create demo slice with role, client info
  const demoSlice = createSlice({
    name: "demo",
    initialState: {
      role,
      clientId,
      clientName,
      themeMode: "light",
      scenario: "default",
      version: "v1.0",
    },
    reducers: {},
  });

  // Create user slice
  const userSlice = createSlice({
    name: "user",
    initialState: {
      profile: {
        name: "Demo User",
        email: "demo@kigo.com",
      } as UserProfile,
      isAuthenticated: true,
      notifications: [],
      unreadCount: 0,
    },
    reducers: {
      logout: (state) => {
        state.isAuthenticated = false;
        state.profile = null as unknown as UserProfile;
      },
    },
  });

  return configureStore({
    reducer: {
      ui: uiSlice.reducer,
      demo: demoSlice.reducer,
      user: userSlice.reducer,
    },
  });
};

// Create a wrapper component that provides the Redux store
const StoreWrapper = (props: {
  children: React.ReactNode;
  role?: "merchant" | "support" | "admin";
  clientId?: string;
  clientName?: string;
  isCollapsed?: boolean;
}) => {
  const { children, ...storeProps } = props;

  // Create the Redux store for this specific component
  const store = createMockStore(storeProps);
  return <Provider store={store}>{children}</Provider>;
};

const meta: Meta<typeof Sidebar> = {
  title: "Kigo UI/Organisms/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Main navigation sidebar with user controls and sign-out functionality.",
      },
    },
    // Provide default Next.js path for all stories
    nextRouter: {
      path: "/dashboard",
    },
  },
  decorators: [
    (Story, context) => (
      <div className="min-h-screen bg-gray-100">
        <StoreWrapper
          role={context.args.role || "merchant"}
          isCollapsed={false}
          clientId={context.args.isCVSContext ? "cvs" : "default"}
        >
          <Story />
        </StoreWrapper>
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    role: "merchant",
    isCVSContext: false,
  },
};

export const Collapsed: Story = {
  args: {
    role: "merchant",
    isCVSContext: false,
  },
  parameters: {
    redux: {
      state: {
        ui: {
          sidebarCollapsed: true,
          sidebarWidth: "70px",
        },
      },
    },
  },
};

export const CVSBranded: Story = {
  args: {
    role: "merchant",
    isCVSContext: true,
  },
};

export const SupportRole: Story = {
  args: {
    role: "support",
  },
};

export const AdminRole: Story = {
  args: {
    role: "admin",
  },
};
