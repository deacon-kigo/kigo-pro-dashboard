import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Direct selectors
export const selectSidebarCollapsed = (state: RootState) =>
  state.ui.sidebarCollapsed;
export const selectSidebarWidth = (state: RootState) => state.ui.sidebarWidth;
export const selectChatOpen = (state: RootState) => state.ui.chatOpen;
export const selectSpotlightOpen = (state: RootState) => state.ui.spotlightOpen;
export const selectIsMobileView = (state: RootState) => state.ui.isMobileView;
export const selectIsHydrated = (state: RootState) => state.ui.isHydrated;
export const selectDemoSelectorOpen = (state: RootState) =>
  state.ui.demoSelectorOpen;
export const selectDemoSelectorPinned = (state: RootState) =>
  state.ui.demoSelectorPinned;
export const selectDemoSelectorCollapsed = (state: RootState) =>
  state.ui.demoSelectorCollapsed;
export const selectOpenDropdowns = (state: RootState) => state.ui.openDropdowns;

// Memoized selectors for dropdown states
export const selectDropdownOpen = createSelector(
  [selectOpenDropdowns, (_, id: string) => id],
  (openDropdowns, id) => openDropdowns[id] || false
);
