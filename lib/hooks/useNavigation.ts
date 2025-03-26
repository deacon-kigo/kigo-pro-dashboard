import { useRouter } from 'next/navigation';
import { buildDemoUrl } from '@/lib/utils';

/**
 * Hook for standardized navigation in the application
 * All navigation should go through this to ensure consistency
 */
export function useNavigation() {
  const router = useRouter();

  // Navigate to a demo page with the given parameters
  const navigateToDemo = (clientId: string, scenario: string, version: string = 'current') => {
    const url = buildDemoUrl(clientId, scenario, version);
    console.log(`Navigation: Going to ${url}`);
    router.push(url);
  };

  // Direct navigation that bypasses Next.js router
  // Use for cases where router.push() has issues
  const directNavigateToDemo = (clientId: string, scenario: string, version: string = 'current') => {
    const url = buildDemoUrl(clientId, scenario, version);
    console.log(`Navigation: Direct navigation to ${url}`);
    window.location.href = url;
  };

  return {
    navigateToDemo,
    directNavigateToDemo
  };
} 