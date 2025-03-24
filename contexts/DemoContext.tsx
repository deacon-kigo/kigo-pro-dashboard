/**
 * DemoContext.tsx
 * 
 * This context provides a way to manage the demo state across the application.
 * It allows for switching between different personas, clients, scenarios, and versions.
 */
'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getUserForContext, MockUser, convertMockUserToUserProfile } from '@/lib/userProfileUtils';
import { UserProfile, ThemeColors } from '@/types/demo';

// Define DemoState with version included
export interface DemoState {
  role: string;
  clientId: string;
  scenario: string;
  themeMode: 'light' | 'dark';
  version: VersionType;
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

// Default client theme
clientThemes.default = {
  light: {
    ...defaultTheme,
  },
  dark: {
    primaryColor: '#60a5fa', // blue-400
    secondaryColor: '#34d399', // emerald-400
    accentColor: '#fb923c', // orange-400
    backgroundColor: '#f8fafc', // Very light gray instead of dark
    textColor: '#334155',
  }
};

// Available versions of the application
export type VersionType = 'current' | 'upcoming' | 'future' | 'experimental';

// Version metadata
export const versionInfo: Record<VersionType, { name: string, description: string }> = {
  'current': {
    name: 'Current Release',
    description: 'Features currently implemented in production'
  },
  'upcoming': {
    name: 'Next Release',
    description: 'Features planned for the next release cycle'
  },
  'future': {
    name: 'Future Roadmap',
    description: 'Features in the long-term development roadmap'
  },
  'experimental': {
    name: 'Experimental',
    description: 'Experimental concepts and designs for feedback'
  }
};

// Extended demo state
export interface ExtendedDemoState extends DemoState {
  id?: string;
  clientName?: string;
}

// Interface for the context
interface DemoContextType {
  role: string;
  clientId: string;
  clientName?: string;
  scenario: string;
  themeMode: 'light' | 'dark';
  version: VersionType;
  theme: ThemeColors;
  userProfile: MockUser;
  history: DemoState[];
  instanceHistory: ExtendedDemoState[];
  currentInstanceIndex: number;
  setRole: (role: string) => void;
  setClientId: (clientId: string) => void;
  setScenario: (scenario: string) => void;
  setThemeMode: (themeMode: 'light' | 'dark') => void;
  setVersion: (version: VersionType) => void;
  updateDemoState: (updates: Partial<ExtendedDemoState>) => void;
  resetToDefault: () => void;
  goToInstance: (index: number) => void;
  saveCurrentInstance: () => void;
}

// Default state
const defaultDemoState: ExtendedDemoState = {
  role: 'merchant',
  clientId: 'deacons-pizza',
  clientName: 'Deacon\'s Pizza',
  scenario: 'dashboard',
  themeMode: 'light',
  version: 'current',
};

// Create context with a default undefined value
const DemoContext = createContext<DemoContextType | undefined>(undefined);

// Provider component
export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [demoState, setDemoState] = useState<ExtendedDemoState>({
    ...defaultDemoState,
  });
  const [history, setHistory] = useState<DemoState[]>([]);
  const [instanceHistory, setInstanceHistory] = useState<ExtendedDemoState[]>([]);
  const [currentInstanceIndex, setCurrentInstanceIndex] = useState<number>(-1);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Refs to track URL updates
  const isUpdatingFromUrl = useRef(false);
  const lastUrlState = useRef<ExtendedDemoState | null>(null);
  
  // Get user profile based on current role and client
  const userProfile = getUserForContext(demoState.role, demoState.clientId);
  
  // Get theme based on client and theme mode
  const theme = clientThemes[demoState.clientId]?.[demoState.themeMode] || 
                clientThemes.default[demoState.themeMode];

  // Parse URL params
  useEffect(() => {
    if (!searchParams) return;
    
    const role = searchParams.get('role');
    const clientId = searchParams.get('client');
    const scenario = searchParams.get('scenario');
    const themeMode = searchParams.get('theme') as 'light' | 'dark';
    const version = searchParams.get('version') as VersionType;
    
    // Debug log to help us track URL parameter parsing
    console.log('URL Params:', { role, clientId, scenario, themeMode, version });
    
    const updates: Partial<ExtendedDemoState> = {};
    let hasUpdates = false;
    
    // Only update if the parameter exists and is different from current state
    if (role && role !== demoState.role) {
      updates.role = role;
      hasUpdates = true;
    }
    
    if (clientId && clientId !== demoState.clientId) {
      updates.clientId = clientId;
      hasUpdates = true;
    }
    
    if (scenario && scenario !== demoState.scenario) {
      updates.scenario = scenario;
      hasUpdates = true;
    }
    
    if (themeMode && (themeMode === 'light' || themeMode === 'dark') && themeMode !== demoState.themeMode) {
      updates.themeMode = themeMode;
      hasUpdates = true;
    }
    
    if (version && version !== demoState.version && ['current', 'upcoming', 'future', 'experimental'].includes(version)) {
      updates.version = version;
      hasUpdates = true;
    }
    
    if (hasUpdates) {
      console.log('Updating state with:', updates);
      isUpdatingFromUrl.current = true;
      setDemoState(prev => ({
        ...prev,
        ...updates,
      }));
      
      // Store this state to avoid circular updates
      lastUrlState.current = {
        ...demoState,
        ...updates,
      };
    }
  }, [searchParams]);
  
  // Update URL params when demo state changes
  useEffect(() => {
    // Skip if this state change was triggered by URL
    if (isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = false;
      return;
    }
    
    // Get current URL params to compare with state
    const currentRole = searchParams?.get('role');
    const currentClientId = searchParams?.get('client');
    const currentScenario = searchParams?.get('scenario');
    const currentThemeMode = searchParams?.get('theme');
    const currentVersion = searchParams?.get('version');
    
    // Check if URL actually needs updating by comparing with current params
    const needsUpdate = 
      currentRole !== demoState.role ||
      currentClientId !== demoState.clientId ||
      currentScenario !== demoState.scenario ||
      currentThemeMode !== demoState.themeMode ||
      currentVersion !== demoState.version;
    
    if (needsUpdate) {
      console.log('URL needs updating, current state:', demoState);
      
      // Create the new URL with updated params
      const params = new URLSearchParams();
      params.set('role', demoState.role);
      params.set('client', demoState.clientId);
      params.set('scenario', demoState.scenario);
      params.set('theme', demoState.themeMode);
      params.set('version', demoState.version);
      
      // Store current state to avoid circular updates
      lastUrlState.current = { ...demoState };
      
      // Update the URL without triggering another navigation
      router.replace(`${pathname}?${params.toString()}`);
      
      // Add to history if not a duplicate
      const isDuplicate = history.some(item => 
        item.role === demoState.role && 
        item.clientId === demoState.clientId && 
        item.scenario === demoState.scenario &&
        item.version === demoState.version
      );
      
      if (!isDuplicate) {
        setHistory(prev => [demoState, ...prev].slice(0, 5));
      }
    }
  }, [demoState.role, demoState.clientId, demoState.scenario, demoState.themeMode, demoState.version, pathname, router, history, searchParams]);
  
  // Update demo state
  const updateDemoState = (updates: Partial<ExtendedDemoState>) => {
    // Skip update if no actual changes
    const hasChanges = Object.entries(updates).some(([key, value]) => {
      return demoState[key as keyof ExtendedDemoState] !== value;
    });
    
    if (!hasChanges) {
      console.log('Skipping updateDemoState - no changes detected');
      return;
    }
    
    console.log('updateDemoState called with:', updates);
    setDemoState(prev => ({
      ...prev,
      ...updates,
    }));
  };
  
  // Go to a specific instance in history
  const goToInstance = (index: number) => {
    if (index >= 0 && index < instanceHistory.length) {
      setCurrentInstanceIndex(index);
      const instance = instanceHistory[index];
      updateDemoState({
        role: instance.role,
        clientId: instance.clientId,
        clientName: instance.clientName,
        scenario: instance.scenario,
        themeMode: instance.themeMode,
        version: instance.version,
      });
    }
  };
  
  // Save current instance to history
  const saveCurrentInstance = () => {
    const instanceId = `instance-${Date.now()}`;
    const newInstance: ExtendedDemoState = {
      ...demoState,
      id: instanceId,
    };
    
    // Check if this instance already exists to prevent duplicate entries
    const isDuplicate = instanceHistory.some(instance => 
      instance.role === demoState.role && 
      instance.clientId === demoState.clientId && 
      instance.scenario === demoState.scenario && 
      instance.themeMode === demoState.themeMode &&
      instance.version === demoState.version
    );
    
    // Only update if it's not a duplicate
    if (!isDuplicate) {
      setInstanceHistory(prev => {
        const newHistory = [...prev, newInstance];
        setCurrentInstanceIndex(newHistory.length - 1);
        return newHistory;
      });
    }
  };
  
  // Role setter
  const setRole = (role: string) => {
    updateDemoState({ role });
  };
  
  // Client setter
  const setClientId = (clientId: string) => {
    updateDemoState({ clientId });
  };
  
  // Scenario setter
  const setScenario = (scenario: string) => {
    updateDemoState({ scenario });
  };
  
  // Theme mode setter
  const setThemeMode = (themeMode: 'light' | 'dark') => {
    updateDemoState({ themeMode });
  };
  
  // Version setter
  const setVersion = (version: VersionType) => {
    updateDemoState({ version });
  };
  
  // Reset to default demo state
  const resetToDefault = () => {
    setDemoState(defaultDemoState);
  };
  
  // Provide context value
  const contextValue: DemoContextType = {
    ...demoState,
    theme,
    userProfile,
    history,
    instanceHistory,
    currentInstanceIndex,
    setRole,
    setClientId, 
    setScenario,
    setThemeMode,
    setVersion,
    updateDemoState,
    resetToDefault,
    goToInstance,
    saveCurrentInstance
  };
  
  return (
    <DemoContext.Provider value={contextValue}>
      {children}
    </DemoContext.Provider>
  );
};

// Hook to use the context
export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}; 