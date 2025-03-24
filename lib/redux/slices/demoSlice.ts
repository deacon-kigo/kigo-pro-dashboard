import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeColors } from '@/types/demo';

// Define version type
export type VersionType = 'current' | 'upcoming' | 'future' | 'experimental';

// Define DemoState
export interface DemoState {
  role: string;
  clientId: string;
  clientName?: string;
  scenario: string;
  themeMode: 'light' | 'dark';
  version: VersionType;
  theme: ThemeColors;
  history: {
    role: string;
    clientId: string;
    scenario: string;
    themeMode: 'light' | 'dark';
    version: VersionType;
  }[];
  instanceHistory: DemoState[];
  currentInstanceIndex: number;
}

// Default theme
const defaultTheme: ThemeColors = {
  primaryColor: '#3b82f6', // blue-500
  secondaryColor: '#10b981', // emerald-500
  accentColor: '#f97316', // orange-500
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
};

// Client-specific themes
const clientThemes: Record<string, { light: ThemeColors; dark: ThemeColors }> = {
  'deacons-pizza': {
    light: {
      primaryColor: '#ef4444', // red-500 (pizza theme)
      secondaryColor: '#84cc16', // lime-500 (for fresh ingredients)
      accentColor: '#f97316', // orange-500
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
    },
    dark: {
      primaryColor: '#f87171', // red-400 (pizza theme)
      secondaryColor: '#a3e635', // lime-400 (for fresh ingredients)
      accentColor: '#fb923c', // orange-400
      backgroundColor: '#f8fafc', // Very light gray instead of dark
      textColor: '#334155',
    }
  },
  'cvs': {
    light: {
      primaryColor: '#c42032', // CVS red
      secondaryColor: '#3268cc', // CVS blue
      accentColor: '#f97316', // orange-500
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
    },
    dark: {
      primaryColor: '#dc4251', // Lighter CVS red for dark mode
      secondaryColor: '#5b85d6', // Lighter CVS blue for dark mode
      accentColor: '#fb923c', // orange-400
      backgroundColor: '#f8fafc', // Very light gray instead of dark
      textColor: '#334155',
    }
  },
  // Default theme for any other client
  'default': {
    light: {
      ...defaultTheme
    },
    dark: {
      primaryColor: '#60a5fa', // blue-400
      secondaryColor: '#34d399', // emerald-400
      accentColor: '#fb923c', // orange-400
      backgroundColor: '#f8fafc', // Very light gray instead of dark
      textColor: '#334155',
    }
  }
};

// Default state
const defaultDemoState: DemoState = {
  role: 'merchant',
  clientId: 'deacons-pizza',
  clientName: 'Deacon\'s Pizza',
  scenario: 'dashboard',
  themeMode: 'light',
  version: 'current',
  theme: clientThemes['deacons-pizza'].light,
  history: [],
  instanceHistory: [],
  currentInstanceIndex: -1,
};

// Helper function to get theme based on client and mode
const getTheme = (clientId: string, themeMode: 'light' | 'dark'): ThemeColors => {
  return clientThemes[clientId]?.[themeMode] || clientThemes.default[themeMode];
};

// Create the demo slice
export const demoSlice = createSlice({
  name: 'demo',
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
      switch(action.payload) {
        case 'deacons-pizza':
          state.clientName = 'Deacon\'s Pizza';
          break;
        case 'cvs':
          state.clientName = 'CVS';
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
    setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
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
    updateDemoState: (state, action: PayloadAction<Partial<DemoState>>) => {
      const updates = action.payload;
      
      if (updates.role !== undefined) {
        state.role = updates.role;
      }
      
      if (updates.clientId !== undefined) {
        state.clientId = updates.clientId;
        // Update client name
        if (updates.clientName) {
          state.clientName = updates.clientName;
        } else {
          switch(updates.clientId) {
            case 'deacons-pizza':
              state.clientName = 'Deacon\'s Pizza';
              break;
            case 'cvs':
              state.clientName = 'CVS';
              break;
            default:
              state.clientName = updates.clientId;
          }
        }
      }
      
      if (updates.scenario !== undefined) {
        state.scenario = updates.scenario;
      }
      
      if (updates.themeMode !== undefined) {
        state.themeMode = updates.themeMode;
      }
      
      if (updates.version !== undefined) {
        state.version = updates.version;
      }
      
      // Update theme based on new state
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
    resetToDefault: (state) => {
      Object.assign(state, defaultDemoState);
    },
    saveCurrentInstance: (state) => {
      const newInstance = { ...state };
      
      // Check if this is a duplicate instance
      const isDuplicate = state.instanceHistory.some(
        instance => 
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
    }
  }
});

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
  goToInstance
} = demoSlice.actions;

// Export reducer
export default demoSlice.reducer; 