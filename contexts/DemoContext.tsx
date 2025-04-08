/**
 * DemoContext.tsx
 * 
 * This context provides a way to manage the demo state across the application.
 * It allows for switching between different personas, clients, scenarios, and versions.
 */
'use client';

import React, { createContext, useContext, useEffect, useMemo, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { 
  setRole, 
  setClientId, 
  setScenario, 
  setThemeMode, 
  setVersion, 
  updateDemoState, 
  resetToDefault,
  saveCurrentInstance,
  goToInstance,
  VersionType
} from '@/lib/redux/slices/demoSlice';
import { MockUser, getUserForContext } from '@/lib/userProfileUtils';
import { updateTicketingFeatures } from '@/lib/redux/slices/featureConfigSlice';

// Create a more specific type for the DemoContext
interface DemoContextType {
  role: string;
  clientId: string;
  clientName?: string;
  scenario: string;
  themeMode: 'light' | 'dark';
  version: VersionType;
  theme: any; // Replace with proper theme type
  userProfile: any; // Replace with proper user profile type
  setRole: (role: string) => void;
  setClientId: (clientId: string) => void; 
  setScenario: (scenario: string) => void;
  setThemeMode: (themeMode: 'light' | 'dark') => void;
  setVersion: (version: VersionType) => void;
  updateDemoState: (updates: any) => void;
  resetToDefault: () => void;
  goToInstance: (index: number) => void;
  saveCurrentInstance: () => void;
}

// Create a context with a proper type
const DemoContext = createContext<DemoContextType | undefined>(undefined);

// Compatibility provider that uses Redux under the hood
export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const demoState = useAppSelector(state => state.demo);
  const dispatch = useAppDispatch();
  
  // Get user profile based on current role and client
  const userProfile = getUserForContext(demoState.role, demoState.clientId);
  
  // Memoize action handlers to prevent unnecessary rerenders
  const setRoleHandler = useCallback((role: string) => {
    console.log('DemoContext: Setting role to', role);
    dispatch(setRole(role));
  }, [dispatch]);
  
  const setClientIdHandler = useCallback((clientId: string) => {
    console.log('DemoContext: Setting clientId to', clientId);
    dispatch(setClientId(clientId));
  }, [dispatch]);
  
  const setScenarioHandler = useCallback((scenario: string) => {
    console.log('DemoContext: Setting scenario to', scenario);
    dispatch(setScenario(scenario));
  }, [dispatch]);
  
  const setThemeModeHandler = useCallback((themeMode: 'light' | 'dark') => {
    console.log('DemoContext: Setting themeMode to', themeMode);
    dispatch(setThemeMode(themeMode));
  }, [dispatch]);
  
  const setVersionHandler = useCallback((version: VersionType) => {
    console.log('DemoContext: Setting version to', version);
    dispatch(setVersion(version));
  }, [dispatch]);
  
  const updateDemoStateHandler = useCallback((updates: any) => {
    console.log('DemoContext: Updating demo state with', updates);
    dispatch(updateDemoState(updates));
  }, [dispatch]);
  
  const resetToDefaultHandler = useCallback(() => {
    console.log('DemoContext: Resetting to default state');
    dispatch(resetToDefault());
  }, [dispatch]);
  
  const goToInstanceHandler = useCallback((index: number) => {
    console.log('DemoContext: Going to instance', index);
    dispatch(goToInstance(index));
  }, [dispatch]);
  
  const saveCurrentInstanceHandler = useCallback(() => {
    console.log('DemoContext: Saving current instance');
    dispatch(saveCurrentInstance());
  }, [dispatch]);
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    ...demoState,
    userProfile,
    setRole: setRoleHandler,
    setClientId: setClientIdHandler,
    setScenario: setScenarioHandler,
    setThemeMode: setThemeModeHandler,
    setVersion: setVersionHandler,
    updateDemoState: updateDemoStateHandler,
    resetToDefault: resetToDefaultHandler,
    goToInstance: goToInstanceHandler,
    saveCurrentInstance: saveCurrentInstanceHandler
  }), [
    demoState, 
    userProfile, 
    setRoleHandler,
    setClientIdHandler,
    setScenarioHandler,
    setThemeModeHandler,
    setVersionHandler,
    updateDemoStateHandler,
    resetToDefaultHandler,
    goToInstanceHandler,
    saveCurrentInstanceHandler
  ]);
  
  // Update ticketing features when clientId changes
  useEffect(() => {
    if (demoState.clientId) {
      const systemName = demoState.clientId === 'cvs' ? 'ServiceNow' : 'Zendesk';
      console.log(`DemoContext: Updating ticketing system to ${systemName} for client ${demoState.clientId}`);
      
      dispatch(updateTicketingFeatures({ 
        externalSystemName: systemName
      }));
    }
  }, [demoState.clientId, dispatch]);
  
  return (
    <DemoContext.Provider value={contextValue}>
      {children}
    </DemoContext.Provider>
  );
};

// Hook to use the context (compatibility hook)
export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    console.error('useDemo must be used within a DemoProvider - fallback to direct Redux access');
    
    // If used outside the provider, fallback to direct Redux access
    const demoState = useAppSelector(state => state.demo);
    const dispatch = useAppDispatch();
    const userProfile = getUserForContext(demoState.role, demoState.clientId);
    
    // Create fallback context value
    return {
      ...demoState,
      userProfile,
      setRole: (role: string) => dispatch(setRole(role)),
      setClientId: (clientId: string) => dispatch(setClientId(clientId)),
      setScenario: (scenario: string) => dispatch(setScenario(scenario)),
      setThemeMode: (themeMode: 'light' | 'dark') => dispatch(setThemeMode(themeMode)),
      setVersion: (version: VersionType) => dispatch(setVersion(version)),
      updateDemoState: (updates: any) => dispatch(updateDemoState(updates)),
      resetToDefault: () => dispatch(resetToDefault()),
      goToInstance: (index: number) => dispatch(goToInstance(index)),
      saveCurrentInstance: () => dispatch(saveCurrentInstance())
    };
  }
  return context;
}; 