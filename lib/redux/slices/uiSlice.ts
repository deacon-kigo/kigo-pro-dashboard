import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
}

const initialState: UIState = {
  sidebarCollapsed: true,
  sidebarWidth: "70px",
  chatOpen: false,
  spotlightOpen: false,
  isMobileView: false,
  demoSelectorOpen: true,
  demoSelectorPinned: false,
  demoSelectorCollapsed: false,
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
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
      state.sidebarWidth = action.payload ? "70px" : "225px";

      // Update CSS variable
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty(
          "--sidebar-width",
          state.sidebarWidth
        );
      }
    },

    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      state.sidebarWidth = state.sidebarCollapsed ? "70px" : "225px";

      // Update CSS variable
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty(
          "--sidebar-width",
          state.sidebarWidth
        );

        // Persist to localStorage directly
        try {
          localStorage.setItem(
            "sidebarCollapsed",
            state.sidebarCollapsed.toString()
          );
        } catch (error) {
          console.warn("Unable to access localStorage:", error);
        }
      }
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
        state.sidebarWidth = "70px";

        if (typeof document !== "undefined") {
          document.documentElement.style.setProperty(
            "--sidebar-width",
            state.sidebarWidth
          );
        }
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
  },
});

export const {
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
} = uiSlice.actions;

export default uiSlice.reducer;
