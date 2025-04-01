'use client';

import React from 'react';
import { ExternalTicketingProvider } from '@/components/features/external-ticketing';

export default function CVSTokenManagement() {
  return (
    <ExternalTicketingProvider>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">CVS Token Management</h1>
        <p>Test page to verify ExternalTicketingProvider works correctly.</p>
      </div>
    </ExternalTicketingProvider>
  );
} 