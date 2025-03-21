/**
 * DemoContext.tsx
 * 
 * This context provides a way to manage the demo state across the application.
 * It allows for switching between different personas, clients, and scenarios.
 */
'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getUserForContext } from '@/lib/userProfileUtils';
import { UserProfile, DemoState, ThemeColors } from '@/types/demo';

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
      backgroundColor: '#1f2937',
      textColor: '#f9fafb',
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
      backgroundColor: '#1f2937',
      textColor: '#f9fafb',
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
      backgroundColor: '#1f2937',
      textColor: '#f9fafb',
    }
  }
};

// Interface for the context
interface DemoContextType {
  role: string;
  clientId: string;
  scenario: string;
  themeMode: 'light' | 'dark';
  theme: ThemeColors;
  userProfile: UserProfile;
  history: DemoState[];
  setRole: (role: string) => void;
  setClientId: (clientId: string) => void;
  setScenario: (scenario: string) => void;
  setThemeMode: (themeMode: 'light' | 'dark') => void;
  updateDemoState: (updates: Partial<DemoState>) => void;
  resetToDefault: () => void;
}

// Default state
const defaultDemoState: DemoState = {
  role: 'merchant',
  clientId: 'deacons-pizza',
  scenario: 'dashboard',
  themeMode: 'light',
};

// Create context with a default undefined value
const DemoContext = createContext<DemoContextType | undefined>(undefined);

// Provider component
export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [demoState, setDemoState] = useState<DemoState>({
    ...defaultDemoState,
  });
  const [history, setHistory] = useState<DemoState[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Refs to track URL updates
  const isUpdatingFromUrl = useRef(false);
  const lastUrlState = useRef<DemoState | null>(null);
  
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
    
    const updates: Partial<DemoState> = {};
    let hasUpdates = false;
    
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
    
    if (hasUpdates) {
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
    
    // Check if the URL needs updating (compare with last URL state)
    const needsUpdate = !lastUrlState.current || 
      lastUrlState.current.role !== demoState.role ||
      lastUrlState.current.clientId !== demoState.clientId ||
      lastUrlState.current.scenario !== demoState.scenario ||
      lastUrlState.current.themeMode !== demoState.themeMode;
    
    if (needsUpdate) {
      // Create the new URL with updated params
      const params = new URLSearchParams();
      params.set('role', demoState.role);
      params.set('client', demoState.clientId);
      params.set('scenario', demoState.scenario);
      params.set('theme', demoState.themeMode);
      
      // Store current state to avoid circular updates
      lastUrlState.current = { ...demoState };
      
      // Update the URL
      router.replace(`${pathname}?${params.toString()}`);
      
      // Add to history if not a duplicate
      const isDuplicate = history.some(item => 
        item.role === demoState.role && 
        item.clientId === demoState.clientId && 
        item.scenario === demoState.scenario
      );
      
      if (!isDuplicate) {
        setHistory(prev => [demoState, ...prev].slice(0, 5));
      }
    }
  }, [demoState, pathname, router]);
  
  // Update demo state
  const updateDemoState = (updates: Partial<DemoState>) => {
    setDemoState(prev => ({
      ...prev,
      ...updates,
    }));
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
    setRole,
    setClientId, 
    setScenario,
    setThemeMode,
    updateDemoState,
    resetToDefault,
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