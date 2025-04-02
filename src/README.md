# Kigo Pro Dashboard Source Code

This directory contains the source code for the Kigo Pro Dashboard. The codebase follows a domain-driven design approach with atomic components.

## Directory Structure

- **/core**: Domain-agnostic core infrastructure
  - **/components**: UI components following atomic design
    - **/atoms**: Basic building blocks (buttons, inputs, icons)
    - **/molecules**: Simple combinations of atoms (search bars, status badges)
    - **/organisms**: Complex combinations of molecules (lists, tables)
  - **/hooks**: Shared hooks for common functionality
  - **/utils**: Shared utility functions
  - **/contexts**: Global context providers

- **/domains**: Domain-specific code organized by business domain
  - **/campaigns**: Campaign management domain
  - **/tokens**: Token management domain
  Each domain contains:
    - **/components**: Domain-specific components
    - **/hooks**: Domain-specific hooks
    - **/services**: Domain-specific services
    - **/views**: Domain-specific views

- **/layouts**: Page layout components
  - **/dashboard**: Dashboard layouts
    - **/variants**: Role-specific dashboard variants
  - **/auth**: Authentication layouts

- **/demo**: Demo configurations and sample data
  - **/merchants**: Merchant-specific demo data
    - **/deacons-pizza**: Deacon's Pizza sample data
  - **/support**: Support-specific demo data

- **/pages**: Next.js pages (thin composition layer)

## Architecture Principles

1. **Domain Separation**: Clear boundaries between business domains
2. **Reusable Core**: Domain-agnostic components following atomic design
3. **Prop-Based Components**: Components accept all data via props for testability and flexibility
4. **Role-Specific Customization**: Layout variants for different user roles
5. **Clean Demo Separation**: Demo data and configurations are kept separate from production code

## Adding New Components

### Core Components
```jsx
// src/core/components/atoms/Button/Button.tsx
export function Button({ children, onClick, variant = 'primary' }) {
  return (
    <button 
      className={`btn btn-${variant}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// src/core/components/atoms/Button/index.ts
export * from './Button';
```

### Domain-Specific Components
```jsx
// src/domains/campaigns/components/CampaignCard.tsx
import { Card } from '@/core/components/atoms';

export function CampaignCard({ campaign, onEdit }) {
  return (
    <Card>
      <h3>{campaign.name}</h3>
      <p>{campaign.description}</p>
      <button onClick={() => onEdit(campaign.id)}>Edit</button>
    </Card>
  );
}

// src/domains/campaigns/components/index.ts
export * from './CampaignCard';
```

## Creating Views

Views compose components from both core and domain-specific sources:

```jsx
// src/domains/campaigns/views/CampaignDashboard.tsx
import { useEffect, useState } from 'react';
import { Card } from '@/core/components/atoms';
import { CampaignCard } from '../components';
import { useCampaigns } from '../hooks';

export function CampaignDashboard({ initialCampaigns = [] }) {
  const { campaigns = initialCampaigns, createCampaign, editCampaign } = useCampaigns();
  
  return (
    <div>
      <h1>Campaigns</h1>
      <button onClick={createCampaign}>Create Campaign</button>
      <div className="grid">
        {campaigns.map(campaign => (
          <CampaignCard 
            key={campaign.id}
            campaign={campaign}
            onEdit={editCampaign}
          />
        ))}
      </div>
    </div>
  );
}
```

## Using Layouts

Layouts provide consistent page structure:

```jsx
// src/pages/campaigns.tsx
import { DashboardLayout } from '@/layouts/dashboard';
import { CampaignDashboard } from '@/domains/campaigns/views';

export default function CampaignsPage() {
  return (
    <DashboardLayout>
      <CampaignDashboard />
    </DashboardLayout>
  );
}
```

## Demo Implementation

Demo implementations pass data as props:

```jsx
// src/pages/demo/merchants/deacons-pizza/campaigns.tsx
import { MerchantDashboard } from '@/layouts/dashboard/variants';
import { CampaignDashboard } from '@/domains/campaigns/views';
import { campaigns } from '@/demo/merchants/deacons-pizza/campaigns';

export default function DeaconsPizzaCampaignsDemo() {
  return (
    <MerchantDashboard clientName="Deacon's Pizza">
      <CampaignDashboard initialCampaigns={campaigns} />
    </MerchantDashboard>
  );
}
```

## Migration Status

The codebase is currently undergoing migration to this new architecture. You may encounter components in both the original location and the new structure. Please refer to the project documentation for the current migration status. 