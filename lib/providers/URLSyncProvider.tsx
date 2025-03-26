'use client';

import { ReactNode } from 'react';
import useSyncStateWithURL from '@/lib/hooks/useSyncStateWithURL';

interface URLSyncProviderProps {
  children: ReactNode;
}

/**
 * Provider component that synchronizes Redux state from URLs
 * This implements a one-way (URL → State) data flow
 */
export default function URLSyncProvider({ children }: URLSyncProviderProps) {
  // Sync state from URL - this is our single source of truth
  useSyncStateWithURL();

  // Simply render children - the hook handles all the sync logic
  return <>{children}</>;
} 