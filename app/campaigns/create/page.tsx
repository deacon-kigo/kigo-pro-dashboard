import React from 'react';
import CampaignForm from '../../../components/campaigns/CampaignForm';

export default function CreateCampaignPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Create New Campaign</h2>
        <p className="text-text-muted">
          Fill in the details below to create a new promotional campaign.
        </p>
      </div>
      
      <CampaignForm />
    </div>
  );
} 