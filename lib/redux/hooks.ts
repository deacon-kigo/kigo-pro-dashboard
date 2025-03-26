import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
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
  selectUserProfile,
  VersionType
} from './slices/demoSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Hook to access demo state from Redux
 * This replaces the useDemo() hook from the previous context-based implementation
 */
export const useDemoState = () => {
  const demoState = useAppSelector(state => state.demo);
  const userProfile = useAppSelector(selectUserProfile);
  
  return {
    ...demoState,
    userProfile
  };
};

/**
 * Hook to access demo actions from Redux
 * This provides the action functions previously available in the useDemo() hook
 */
export const useDemoActions = () => {
  const dispatch = useAppDispatch();
  
  return {
    setRole: (role: string) => dispatch(setRole(role)),
    setClientId: (clientId: string) => dispatch(setClientId(clientId)),
    setScenario: (scenario: string) => dispatch(setScenario(scenario)),
    setThemeMode: (themeMode: 'light' | 'dark') => dispatch(setThemeMode(themeMode)),
    setVersion: (version: VersionType) => dispatch(setVersion(version)),
    updateDemoState: (updates: any) => dispatch(updateDemoState(updates)),
    resetToDefault: () => dispatch(resetToDefault()),
    saveCurrentInstance: () => dispatch(saveCurrentInstance()),
    goToInstance: (index: number) => dispatch(goToInstance(index)),
  };
}; 