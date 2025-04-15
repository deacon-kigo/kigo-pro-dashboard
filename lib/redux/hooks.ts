import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
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
  VersionType,
  setCampaignCreationStep,
  CampaignCreationStepType,
} from "./slices/demoSlice";
import {
  recordUserActivity,
  showWarning,
  hideWarning,
  updateCountdown,
  expireSession,
  resetExpiredState,
  configureTimeouts,
  selectSessionState,
  selectLastActivity,
  selectShowTimeoutWarning,
  selectRemainingSeconds,
  selectIsSessionExpired,
  selectSessionTimeoutMinutes,
  selectWarningTimeoutMinutes,
} from "./slices/sessionSlice";
import { logout } from "./slices/userSlice";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Hook to access demo state from Redux
 * This replaces the useDemo() hook from the previous context-based implementation
 */
export const useDemoState = () => {
  const demoState = useAppSelector((state) => state.demo);
  const userProfile = useAppSelector(selectUserProfile);

  return {
    ...demoState,
    userProfile,
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
    setThemeMode: (themeMode: "light" | "dark") =>
      dispatch(setThemeMode(themeMode)),
    setVersion: (version: VersionType) => dispatch(setVersion(version)),
    setCampaignCreationStep: (step: CampaignCreationStepType) =>
      dispatch(setCampaignCreationStep(step)),
    updateDemoState: (updates: any) => dispatch(updateDemoState(updates)),
    resetToDefault: () => dispatch(resetToDefault()),
    saveCurrentInstance: () => dispatch(saveCurrentInstance()),
    goToInstance: (index: number) => dispatch(goToInstance(index)),
  };
};

/**
 * Hook to access session state for inactivity tracking
 */
export const useSessionState = () => {
  return useAppSelector(selectSessionState);
};

/**
 * Hook to access session actions for inactivity tracking
 */
export const useSessionActions = () => {
  const dispatch = useAppDispatch();

  return {
    recordActivity: () => dispatch(recordUserActivity()),
    showTimeoutWarning: () => dispatch(showWarning()),
    hideTimeoutWarning: () => dispatch(hideWarning()),
    updateRemainingTime: (seconds: number) =>
      dispatch(updateCountdown(seconds)),
    expireUserSession: () => {
      dispatch(expireSession());
      dispatch(logout());
    },
    resetExpiredSession: () => dispatch(resetExpiredState()),
    configureSessionTimeouts: (config: {
      sessionTimeoutMinutes?: number;
      warningTimeoutMinutes?: number;
    }) => dispatch(configureTimeouts(config)),
  };
};
