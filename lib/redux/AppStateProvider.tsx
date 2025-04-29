"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { loadUserProfileFromContext } from "./slices/userSlice";
import {
  setHydrated,
  loadSavedState,
  setIsMobileView,
  setSidebarCollapsed,
} from "./slices/uiSlice";
import { usePathname } from "next/navigation";

/**
 * AppStateProvider initializes application state and handles
 * synchronization between Redux and the DOM/localStorage
 */
export default function AppStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { role, clientId } = useAppSelector((state) => state.demo);
  const { sidebarCollapsed, isHydrated } = useAppSelector((state) => state.ui);
  const pathname = usePathname();

  // Initialize user profile from demo context
  useEffect(() => {
    // Set the user profile based on the current role and client
    dispatch(loadUserProfileFromContext({ role, clientId }));
  }, [dispatch, role, clientId]);

  // Handle initial hydration
  useEffect(() => {
    // Mark the app as hydrated
    dispatch(setHydrated(true));

    // After hydration is complete, we can safely load state from localStorage
    try {
      const storedSidebarState = localStorage.getItem("sidebarCollapsed");
      if (storedSidebarState) {
        // Load state into Redux (which will apply CSS variables)
        dispatch(
          loadSavedState({
            sidebarCollapsed: storedSidebarState === "true",
          })
        );
      }
    } catch (error) {
      console.warn("Error loading state from localStorage:", error);
    }

    // Setup responsive behavior
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      dispatch(setIsMobileView(isMobile));
    };

    // Initial check
    handleResize();

    // Listen for window resize
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  // Save state changes to localStorage
  useEffect(() => {
    // Only save after hydration is complete to avoid overwriting with default values
    if (isHydrated) {
      try {
        localStorage.setItem("sidebarCollapsed", sidebarCollapsed.toString());
      } catch (error) {
        console.warn("Error saving state to localStorage:", error);
      }
    }
  }, [sidebarCollapsed, isHydrated]);

  return <>{children}</>;
}
