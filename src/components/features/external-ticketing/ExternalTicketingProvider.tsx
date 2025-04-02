'use client';

import React, { ReactNode } from 'react';
import TicketContextBanner from './TicketContextBanner';
import { useExternalTicketing } from '@/lib/hooks/useExternalTicketing';

interface ExternalTicketingProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the application with external ticketing functionality
 * This component should be placed high in the component tree to provide ticket context
 * throughout the application
 */
export default function ExternalTicketingProvider({ children }: ExternalTicketingProviderProps) {
  const { hasActiveTicketContext } = useExternalTicketing();
  
  return (
    <>
      {hasActiveTicketContext && <TicketContextBanner />}
      {children}
    </>
  );
} 