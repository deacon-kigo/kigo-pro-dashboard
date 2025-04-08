import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useDemoActions } from '@/lib/redux/hooks';
import { parseDemoUrl } from '@/lib/utils';
import { useAppSelector } from '@/lib/redux/hooks';

// Global sync management
const syncState = {
  isSyncing: false,
  lastSyncedPath: null as string | null,
  syncCount: 0
};

/**
 * Hook to synchronize Redux state FROM URL parameters (one-way)
 * This is the single source of truth for demo state
 */
export default function useSyncStateWithURL() {
  const pathname = usePathname();
  const { updateDemoState } = useDemoActions();
  const currentState = useAppSelector(state => state.demo);
  
  // Keep a component-local record of last path to detect duplicates
  const componentPathRef = useRef<string | null>(null);

  // Effect to run whenever pathname changes
  useEffect(() => {
    // Skip processing in these cases
    if (
      !pathname ||                                // No path available
      !pathname.includes('/demos/') ||            // Not a demo page
      syncState.isSyncing ||                      // Already syncing globally
      pathname === syncState.lastSyncedPath ||    // Already synced this exact path globally
      pathname === componentPathRef.current       // Already processed in this component instance
    ) {
      return;
    }

    console.log(`URL Sync [${++syncState.syncCount}]: Processing path ${pathname}`);
    
    // Update refs to track this path
    componentPathRef.current = pathname;
    syncState.lastSyncedPath = pathname;
    
    // Parse the URL to get demo parameters
    const demoParams = parseDemoUrl(pathname);
    
    if (!demoParams) {
      console.log('URL Sync: Invalid demo URL format, skipping sync');
      return;
    }
    
    // Check if we need to update state based on URL
    const needsUpdate = 
      demoParams.clientId !== currentState.clientId ||
      demoParams.scenario !== currentState.scenario ||
      (demoParams.version && demoParams.version !== currentState.version);
      
    // Only update if needed
    if (needsUpdate) {
      try {
        // Set syncing flag before update
        syncState.isSyncing = true;
        
        console.log('URL Sync: Updating state', {
          from: { 
            clientId: currentState.clientId, 
            scenario: currentState.scenario,
            version: currentState.version 
          },
          to: demoParams
        });
        
        // Update Redux state from URL
        updateDemoState({
          clientId: demoParams.clientId,
          scenario: demoParams.scenario,
          version: demoParams.version || 'current',
        });
      } catch (error) {
        console.error('URL Sync: Error updating state', error);
      } finally {
        // Release sync lock after a delay to ensure state settles
        setTimeout(() => {
          syncState.isSyncing = false;
          console.log('URL Sync: Released sync lock');
        }, 100);
      }
    } else {
      console.log('URL Sync: No state update needed, URL matches current state');
    }
  }, [pathname, updateDemoState, currentState]);

  // This hook is for side effects only
  return null;
} 