import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThemeColors } from "@/types/demo";
import { getUserForContext } from "@/lib/userProfileUtils";
import { RootState } from "../store";

// Define version type
export type VersionType = "current" | "upcoming" | "future" | "experimental";

// Define campaign creation steps type
export type CampaignCreationStepType =
  | "business-intelligence"
  | "campaign-selection"
  | "asset-creation"
  | "performance-prediction"
  | "launch-control";

// Define DemoState
export interface DemoState {
  role: string;
  clientId: string;
  clientName?: string;
  scenario: string;
  themeMode: "light" | "dark";
  version: VersionType;
  theme: ThemeColors;
  campaignCreationStep: CampaignCreationStepType;
  history: {
    role: string;
    clientId: string;
    scenario: string;
    themeMode: "light" | "dark";
    version: VersionType;
  }[];
  instanceHistory: DemoState[];
  currentInstanceIndex: number;
}

// Default theme
const defaultTheme: ThemeColors = {
  primaryColor: "#3b82f6", // blue-500
  secondaryColor: "#10b981", // emerald-500
  accentColor: "#f97316", // orange-500
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
};

// Client-specific themes
const clientThemes: Record<string, { light: ThemeColors; dark: ThemeColors }> =
  {
    deacons: {
      light: {
        primaryColor: "#ef4444", // red-500 (pizza theme)
        secondaryColor: "#84cc16", // lime-500 (for fresh ingredients)
        accentColor: "#f97316", // orange-500
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
      },
      dark: {
        primaryColor: "#f87171", // red-400 (pizza theme)
        secondaryColor: "#a3e635", // lime-400 (for fresh ingredients)
        accentColor: "#fb923c", // orange-400
        backgroundColor: "#f8fafc", // Very light gray instead of dark
        textColor: "#334155",
      },
    },
    cvs: {
      light: {
        primaryColor: "#c42032", // CVS red
        secondaryColor: "#3268cc", // CVS blue
        accentColor: "#f97316", // orange-500
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
      },
      dark: {
        primaryColor: "#dc4251", // Lighter CVS red for dark mode
        secondaryColor: "#5b85d6", // Lighter CVS blue for dark mode
        accentColor: "#fb923c", // orange-400
        backgroundColor: "#f8fafc", // Very light gray instead of dark
        textColor: "#334155",
      },
    },
    "seven-eleven": {
      light: {
        primaryColor: "#e30613", // 7-Eleven red
        secondaryColor: "#008651", // 7-Eleven green
        accentColor: "#f97316", // orange-500
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
      },
      dark: {
        primaryColor: "#f03a46", // Lighter 7-Eleven red for dark mode
        secondaryColor: "#33a67e", // Lighter 7-Eleven green for dark mode
        accentColor: "#fb923c", // orange-400
        backgroundColor: "#f8fafc", // Very light gray instead of dark
        textColor: "#334155",
      },
    },
    schwab: {
      light: {
        primaryColor: "#009DDB", // Schwab blue
        secondaryColor: "#1B53B1", // Darker blue
        accentColor: "#00A86B", // Green accent
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
      },
      dark: {
        primaryColor: "#1E90FF", // Lighter blue for dark mode
        secondaryColor: "#4169E1", // Steel blue
        accentColor: "#32CD32", // Lighter green
        backgroundColor: "#f8fafc", // Very light gray instead of dark
        textColor: "#334155",
      },
    },
    // Default theme for any other client
    default: {
      light: {
        ...defaultTheme,
      },
      dark: {
        primaryColor: "#60a5fa", // blue-400
        secondaryColor: "#34d399", // emerald-400
        accentColor: "#fb923c", // orange-400
        backgroundColor: "#f8fafc", // Very light gray instead of dark
        textColor: "#334155",
      },
    },
  };

// Default state
const defaultDemoState: DemoState = {
  role: "merchant",
  clientId: "deacons",
  clientName: "Deacon's Pizza",
  scenario: "pizza",
  themeMode: "light",
  version: "current",
  theme: clientThemes["deacons"].light,
  campaignCreationStep: "business-intelligence",
  history: [],
  instanceHistory: [],
  currentInstanceIndex: -1,
};

// Helper function to get theme based on client and mode
const getTheme = (
  clientId: string,
  themeMode: "light" | "dark"
): ThemeColors => {
  return clientThemes[clientId]?.[themeMode] || clientThemes.default[themeMode];
};

// Create the demo slice
export const demoSlice = createSlice({
  name: "demo",
  initialState: defaultDemoState,
  reducers: {
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
      state.theme = getTheme(state.clientId, state.themeMode);

      // Add to history
      state.history.push({
        role: state.role,
        clientId: state.clientId,
        scenario: state.scenario,
        themeMode: state.themeMode,
        version: state.version,
      });
    },
    setClientId: (state, action: PayloadAction<string>) => {
      state.clientId = action.payload;
      // Update client name based on client ID
      switch (action.payload) {
        case "deacons":
          state.clientName = "Deacon's Pizza";
          break;
        case "cvs":
          state.clientName = "CVS";
          break;
        case "seven-eleven":
          state.clientName = "7-Eleven";
          break;
        case "schwab":
          state.clientName = "Charles Schwab";
          break;
        default:
          state.clientName = action.payload;
      }
      state.theme = getTheme(state.clientId, state.themeMode);

      // Add to history
      state.history.push({
        role: state.role,
        clientId: state.clientId,
        scenario: state.scenario,
        themeMode: state.themeMode,
        version: state.version,
      });
    },
    setScenario: (state, action: PayloadAction<string>) => {
      state.scenario = action.payload;

      // Add to history
      state.history.push({
        role: state.role,
        clientId: state.clientId,
        scenario: state.scenario,
        themeMode: state.themeMode,
        version: state.version,
      });
    },
    setThemeMode: (state, action: PayloadAction<"light" | "dark">) => {
      state.themeMode = action.payload;
      state.theme = getTheme(state.clientId, state.themeMode);

      // Add to history
      state.history.push({
        role: state.role,
        clientId: state.clientId,
        scenario: state.scenario,
        themeMode: state.themeMode,
        version: state.version,
      });
    },
    setVersion: (state, action: PayloadAction<VersionType>) => {
      state.version = action.payload;

      // Add to history
      state.history.push({
        role: state.role,
        clientId: state.clientId,
        scenario: state.scenario,
        themeMode: state.themeMode,
        version: state.version,
      });
    },
    setCampaignCreationStep: (
      state,
      action: PayloadAction<CampaignCreationStepType>
    ) => {
      state.campaignCreationStep = action.payload;

      // Add to history (following existing pattern)
      state.history.push({
        role: state.role,
        clientId: state.clientId,
        scenario: state.scenario,
        themeMode: state.themeMode,
        version: state.version,
      });
    },
    updateDemoState: (state, action: PayloadAction<Partial<DemoState>>) => {
      const updates = action.payload;
      let stateChanged = false;

      if (updates.role !== undefined && updates.role !== state.role) {
        state.role = updates.role;
        stateChanged = true;
      }

      if (
        updates.clientId !== undefined &&
        updates.clientId !== state.clientId
      ) {
        state.clientId = updates.clientId;
        stateChanged = true;

        // Update client name
        if (updates.clientName) {
          state.clientName = updates.clientName;
        } else {
          switch (updates.clientId) {
            case "deacons":
              state.clientName = "Deacon's Pizza";
              break;
            case "cvs":
              state.clientName = "CVS";
              break;
            case "seven-eleven":
              state.clientName = "7-Eleven";
              break;
            case "schwab":
              state.clientName = "Charles Schwab";
              break;
            default:
              state.clientName = updates.clientId;
          }
        }
      }

      if (
        updates.scenario !== undefined &&
        updates.scenario !== state.scenario
      ) {
        state.scenario = updates.scenario;
        stateChanged = true;
      }

      if (
        updates.themeMode !== undefined &&
        updates.themeMode !== state.themeMode
      ) {
        state.themeMode = updates.themeMode;
        stateChanged = true;
      }

      if (updates.version !== undefined && updates.version !== state.version) {
        state.version = updates.version;
        stateChanged = true;
      }

      // Update theme based on new state
      if (stateChanged) {
        state.theme = getTheme(state.clientId, state.themeMode);

        // Add to history only if state actually changed
        state.history.push({
          role: state.role,
          clientId: state.clientId,
          scenario: state.scenario,
          themeMode: state.themeMode,
          version: state.version,
        });
      }
    },
    resetToDefault: (state) => {
      Object.assign(state, defaultDemoState);
    },
    saveCurrentInstance: (state) => {
      const newInstance = { ...state };

      // Check if this is a duplicate instance
      const isDuplicate = state.instanceHistory.some(
        (instance) =>
          instance.role === state.role &&
          instance.clientId === state.clientId &&
          instance.scenario === state.scenario &&
          instance.themeMode === state.themeMode &&
          instance.version === state.version
      );

      if (!isDuplicate) {
        state.instanceHistory.push(newInstance);
        state.currentInstanceIndex = state.instanceHistory.length - 1;
      }
    },
    goToInstance: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.instanceHistory.length) {
        const instance = state.instanceHistory[index];
        Object.assign(state, instance);
        state.currentInstanceIndex = index;
      }
    },
  },
});

// Selector for user profile
export const selectUserProfile = (state: RootState) => {
  return getUserForContext(state.demo.role, state.demo.clientId);
};

// Export actions
export const {
  setRole,
  setClientId,
  setScenario,
  setThemeMode,
  setVersion,
  updateDemoState,
  resetToDefault,
  saveCurrentInstance,
  goToInstance,
  setCampaignCreationStep,
} = demoSlice.actions;

// Export reducer
export default demoSlice.reducer;
