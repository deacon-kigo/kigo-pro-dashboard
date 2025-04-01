'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { loadUserProfileFromContext } from './slices/userSlice';
import { setIsMobileView, setSidebarCollapsed } from './slices/uiSlice';

/**
 * AppStateProvider initializes application state and handles
 * synchronization between Redux and the DOM/localStorage
 */
export default function AppStateProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { role, clientId } = useAppSelector(state => state.demo);
  
  // Initialize user profile from demo context
  useEffect(() => {
    // Set the user profile based on the current role and client
    dispatch(loadUserProfileFromContext({ role, clientId }));
  }, [dispatch, role, clientId]);
  
  // Initialize UI state from localStorage
  useEffect(() => {
    // Check if we should initialize sidebar state from localStorage
    const storedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (storedSidebarState) {
      dispatch(setSidebarCollapsed(storedSidebarState === 'true'));
    }
    
    // Setup responsive behavior
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      dispatch(setIsMobileView(isMobile));
    };
    
    // Initial check
    handleResize();
    
    // Listen for window resize
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch]);
  
  return <>{children}</>;
} 