"use client";

import React from 'react';
import AppLayout from '@/components/templates/AppLayout/AppLayout';
import CampaignManagerView from '@/components/features/dashboard/views/CampaignManagerView';

export default function CampaignManagerPage() {
  return (
    <AppLayout>
      <CampaignManagerView />
    </AppLayout>
  );
} 