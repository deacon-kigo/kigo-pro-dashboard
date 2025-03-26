import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useDemoActions } from '@/lib/redux/hooks';
import { parseDemoUrl } from '@/lib/utils';

/**
 * Hook to synchronize Redux state FROM URL parameters (one-way)
 * This is the single source of truth for demo state
 */
export default function useSyncStateWithURL() {
  const pathname = usePathname();
  const { updateDemoState } = useDemoActions();

  // Effect to run whenever pathname changes
  useEffect(() => {
    // Skip for non-demo pages
    if (!pathname.includes('/demos/')) {
      return;
    }

    console.log('URL → State: Updating state from URL', pathname);
    
    // Parse the URL to get demo parameters
    const demoParams = parseDemoUrl(pathname);
    
    if (demoParams) {
      console.log('URL → State: Parameters extracted', demoParams);
      
      // Always update state based on URL - URL is the source of truth
      updateDemoState({
        clientId: demoParams.clientId,
        scenario: demoParams.scenario,
        version: demoParams.version || 'current',
      });
    }
  }, [pathname, updateDemoState]); // Run whenever pathname changes

  // Return nothing as this is a side-effect hook
  return null;
} 