import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Default values for sidebar
const COLLAPSED_WIDTH = "70px";
const EXPANDED_WIDTH = "225px";

// These must match the server-side defaults to prevent hydration errors
const DEFAULT_SIDEBAR_COLLAPSED = true;

export interface UIState {
  // Sidebar state
  sidebarCollapsed: boolean;
  sidebarWidth: string;

  // Chat state
  chatOpen: boolean;

  // Spotlight state
  spotlightOpen: boolean;

  // Mobile responsiveness
  isMobileView: boolean;

  // Additional UI flags
  demoSelectorOpen: boolean;
  demoSelectorPinned: boolean;
  demoSelectorCollapsed: boolean;

  // Track whether client-side hydration has occurred
  isHydrated: boolean;

  // Product filter dropdown states
  openDropdowns: Record<string, boolean>;

  // Agent navigation and UI control
  currentPage: string;
  visibleComponents: string[];
  highlightedComponents: string[];
  notifications: Array<{
    id: string;
    message: string;
    type: "success" | "error" | "info" | "warning";
    timestamp: number;
  }>;
  activeModal: {
    type: string;
    data?: any;
  } | null;
  isLoading: boolean;
  loadingMessage: string;
}

const initialState: UIState = {
  sidebarCollapsed: DEFAULT_SIDEBAR_COLLAPSED,
  sidebarWidth: DEFAULT_SIDEBAR_COLLAPSED ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
  chatOpen: false,
  spotlightOpen: false,
  isMobileView: false,
  demoSelectorOpen: true,
  demoSelectorPinned: false,
  demoSelectorCollapsed: false,
  isHydrated: false,
  openDropdowns: {},
  // Agent control properties
  currentPage: "/",
  visibleComponents: [],
  highlightedComponents: [],
  notifications: [],
  activeModal: null,
  isLoading: false,
  loadingMessage: "",
};

// Theme definitions - composable and extensible
export const themeConfigs = {
  default: {
    sidebar: {
      item: {
        active: "bg-pastel-blue text-gray-800",
        inactive: "text-gray-500",
        hover: "hover:bg-pastel-blue hover:text-gray-800",
        icon: {
          active: "text-primary",
          inactive: "text-gray-500",
        },
        text: {
          active: "font-medium",
          inactive: "",
        },
      },
    },
  },
  cvs: {
    sidebar: {
      item: {
        active: "bg-gradient-to-r from-pastel-blue to-pastel-red text-gray-800",
        inactive: "text-gray-500",
        hover:
          "hover:bg-gradient-to-r hover:from-pastel-blue hover:to-pastel-red hover:text-gray-800",
        icon: {
          active: "text-gray-800", // Dark text for better contrast on gradient
          inactive: "text-gray-500",
        },
        text: {
          active: "font-semibold", // Slightly bolder for CVS
          inactive: "",
        },
      },
    },
  },
  // Additional themes can be added here
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setHydrated: (state, action: PayloadAction<boolean>) => {
      state.isHydrated = action.payload;
      // No CSS variable manipulation - rely entirely on Redux state
    },

    loadSavedState: (state, action: PayloadAction<Partial<UIState>>) => {
      // Only update state after hydration to prevent mismatches
      if (state.isHydrated) {
        // Only restore specifically allowed properties
        if (action.payload.sidebarCollapsed !== undefined) {
          state.sidebarCollapsed = action.payload.sidebarCollapsed;
          state.sidebarWidth = action.payload.sidebarCollapsed
            ? COLLAPSED_WIDTH
            : EXPANDED_WIDTH;
        }
      }
    },

    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
      state.sidebarWidth = action.payload ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
      // No CSS variable manipulation - rely entirely on Redux state
    },

    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      state.sidebarWidth = state.sidebarCollapsed
        ? COLLAPSED_WIDTH
        : EXPANDED_WIDTH;
      // No CSS variable manipulation - rely entirely on Redux state
    },

    setChatOpen: (state, action: PayloadAction<boolean>) => {
      state.chatOpen = action.payload;
    },

    toggleChat: (state) => {
      state.chatOpen = !state.chatOpen;
    },

    setSpotlightOpen: (state, action: PayloadAction<boolean>) => {
      state.spotlightOpen = action.payload;
    },

    toggleSpotlight: (state) => {
      state.spotlightOpen = !state.spotlightOpen;
    },

    setIsMobileView: (state, action: PayloadAction<boolean>) => {
      state.isMobileView = action.payload;

      // Auto-collapse sidebar on mobile
      if (action.payload && !state.sidebarCollapsed) {
        state.sidebarCollapsed = true;
        state.sidebarWidth = COLLAPSED_WIDTH;
        // No CSS variable manipulation - rely entirely on Redux state
      }
    },

    // Demo selector actions
    setDemoSelectorOpen: (state, action: PayloadAction<boolean>) => {
      state.demoSelectorOpen = action.payload;
    },

    toggleDemoSelector: (state) => {
      if (!state.demoSelectorPinned) {
        state.demoSelectorOpen = !state.demoSelectorOpen;
      }
    },

    setDemoSelectorPinned: (state, action: PayloadAction<boolean>) => {
      state.demoSelectorPinned = action.payload;
    },

    setDemoSelectorCollapsed: (state, action: PayloadAction<boolean>) => {
      state.demoSelectorCollapsed = action.payload;
    },

    // Product filter dropdown actions
    setDropdownOpen: (
      state,
      action: PayloadAction<{ id: string; isOpen: boolean }>
    ) => {
      const { id, isOpen } = action.payload;
      state.openDropdowns[id] = isOpen;
    },

    clearAllDropdowns: (state) => {
      state.openDropdowns = {};
    },

    // Agent control actions
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },

    setVisibleComponents: (state, action: PayloadAction<string[]>) => {
      state.visibleComponents = action.payload;
    },

    addVisibleComponent: (state, action: PayloadAction<string>) => {
      if (!state.visibleComponents.includes(action.payload)) {
        state.visibleComponents.push(action.payload);
      }
    },

    removeVisibleComponent: (state, action: PayloadAction<string>) => {
      state.visibleComponents = state.visibleComponents.filter(
        (id) => id !== action.payload
      );
    },

    highlightComponent: (state, action: PayloadAction<string>) => {
      if (!state.highlightedComponents.includes(action.payload)) {
        state.highlightedComponents.push(action.payload);
      }
    },

    unhighlightComponent: (state, action: PayloadAction<string>) => {
      state.highlightedComponents = state.highlightedComponents.filter(
        (id) => id !== action.payload
      );
    },

    clearHighlights: (state) => {
      state.highlightedComponents = [];
    },

    addNotification: (
      state,
      action: PayloadAction<{
        message: string;
        type: "success" | "error" | "info" | "warning";
      }>
    ) => {
      const notification = {
        id: `notification_${Date.now()}`,
        message: action.payload.message,
        type: action.payload.type,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notif) => notif.id !== action.payload
      );
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },

    setActiveModal: (
      state,
      action: PayloadAction<{
        type: string;
        data?: any;
      } | null>
    ) => {
      state.activeModal = action.payload;
    },

    closeModal: (state) => {
      state.activeModal = null;
    },

    setLoading: (
      state,
      action: PayloadAction<{ isLoading: boolean; message?: string }>
    ) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || "";
    },
  },
});

// Removed CSS variable manipulation functions
// Layout is now handled entirely through Redux state and inline styles

export const {
  setHydrated,
  loadSavedState,
  setSidebarCollapsed,
  toggleSidebar,
  setChatOpen,
  toggleChat,
  setSpotlightOpen,
  toggleSpotlight,
  setIsMobileView,
  setDemoSelectorOpen,
  toggleDemoSelector,
  setDemoSelectorPinned,
  setDemoSelectorCollapsed,
  setDropdownOpen,
  clearAllDropdowns,
  // Agent control actions
  setCurrentPage,
  setVisibleComponents,
  addVisibleComponent,
  removeVisibleComponent,
  highlightComponent,
  unhighlightComponent,
  clearHighlights,
  addNotification,
  removeNotification,
  clearNotifications,
  setActiveModal,
  closeModal,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
