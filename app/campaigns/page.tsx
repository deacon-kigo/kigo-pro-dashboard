import React from 'react';
import Link from 'next/link';
import Card from '@/components/atoms/Card/Card';
import { Button } from '@/components/atoms/Button';
import { StatusBadge } from '@/components/molecules/badges';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

// Mock data for campaigns
const campaigns = [
  {
    id: '1',
    title: 'Summer Sale Promotion',
    status: 'active',
    merchantName: 'Acme Corporation',
    startDate: 'Jun 1, 2024',
    endDate: 'Aug 31, 2024',
    budget: '$5,000',
    performance: '65% complete'
  },
  {
    id: '2',
    title: 'Back to School Special',
    status: 'scheduled',
    merchantName: 'Widget Co',
    startDate: 'Aug 15, 2024',
    endDate: 'Sep 15, 2024',
    budget: '$3,500',
    performance: 'Starts in 2 months'
  },
  {
    id: '3',
    title: 'New Customer Welcome',
    status: 'draft',
    merchantName: 'Example LLC',
    budget: '$2,000',
    performance: 'Not started'
  },
  {
    id: '4',
    title: 'Holiday Season Flash Sale',
    status: 'scheduled',
    merchantName: 'Best Store',
    startDate: 'Nov 25, 2024',
    endDate: 'Dec 26, 2024',
    budget: '$10,000',
    performance: 'Starts in 5 months'
  },
  {
    id: '5',
    title: 'Spring Collection Launch',
    status: 'completed',
    merchantName: 'Fashion Outlet',
    startDate: 'Mar 1, 2024',
    endDate: 'Apr 15, 2024',
    budget: '$7,500',
    performance: '125% ROI'
  },
  {
    id: '6',
    title: 'Loyalty Program Rewards',
    status: 'active',
    merchantName: 'Premium Brands',
    startDate: 'Jan 1, 2024',
    endDate: 'Dec 31, 2024',
    budget: '$15,000',
    performance: '42% complete'
  },
  {
    id: '7',
    title: 'Weekend Flash Sale',
    status: 'paused',
    merchantName: 'Discount Depot',
    startDate: 'May 15, 2024',
    endDate: 'Jun 30, 2024',
    budget: '$2,500',
    performance: 'On hold'
  }
];

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold">Campaigns</h2>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search campaigns..."
              className="pl-9 pr-3 py-2 w-full border border-border-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            icon={<FunnelIcon className="w-4 h-4" />}
          >
            Filter
          </Button>
          
          <Button 
            variant="primary"
            size="sm"
            href="/campaigns/create"
            icon={<PlusIcon className="w-4 h-4" />}
          >
            New Campaign
          </Button>
        </div>
      </div>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left font-medium text-text-muted px-4 py-3">Campaign</th>
                <th className="text-left font-medium text-text-muted px-4 py-3">Status</th>
                <th className="text-left font-medium text-text-muted px-4 py-3">Merchant</th>
                <th className="text-left font-medium text-text-muted px-4 py-3">Timeline</th>
                <th className="text-left font-medium text-text-muted px-4 py-3">Budget</th>
                <th className="text-left font-medium text-text-muted px-4 py-3">Performance</th>
                <th className="text-right font-medium text-text-muted px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr 
                  key={campaign.id} 
                  className="border-b border-border-light hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/campaigns/${campaign.id}`} className="hover:text-primary">
                      {campaign.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={campaign.status} />
                  </td>
                  <td className="px-4 py-3 text-text-muted">{campaign.merchantName}</td>
                  <td className="px-4 py-3 text-text-muted">
                    {campaign.startDate && campaign.endDate ? (
                      <span>{campaign.startDate} - {campaign.endDate}</span>
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-muted">{campaign.budget}</td>
                  <td className="px-4 py-3 text-text-muted">{campaign.performance}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      href={`/campaigns/${campaign.id}`}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-light">
          <div className="text-sm text-text-muted">
            Showing <span className="font-medium">1-7</span> of <span className="font-medium">7</span> campaigns
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 