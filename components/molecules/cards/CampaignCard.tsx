import React from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/molecules/badges/StatusBadge';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

interface CampaignCardProps {
  id: string;
  title: string;
  status: 'active' | 'draft' | 'scheduled' | 'completed' | 'paused';
  merchantName: string;
  startDate?: string;
  endDate?: string;
  progress?: number;
}

export default function CampaignCard({
  id,
  title,
  status,
  merchantName,
  startDate,
  endDate,
  progress = 0
}: CampaignCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border-light p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-text-dark line-clamp-1">{title}</h3>
        <StatusBadge status={status} />
      </div>
      
      <p className="text-sm text-text-muted mb-4">
        {merchantName}
      </p>
      
      {(startDate || endDate) && (
        <div className="flex text-xs text-text-muted mb-3">
          {startDate && <span>{startDate}</span>}
          {startDate && endDate && <span className="mx-1">→</span>}
          {endDate && <span>{endDate}</span>}
        </div>
      )}
      
      {status === 'active' && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium">{progress}% Complete</span>
            <span>{Math.round(progress * 0.25)} days left</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-primary rounded-full h-2" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end mt-3">
        <Link 
          href={`/campaigns/${id}`}
          className="text-primary hover:text-primary/80 text-sm font-medium flex items-center"
        >
          <PencilSquareIcon className="w-4 h-4 mr-1" />
          Edit Campaign
        </Link>
      </div>
    </div>
  );
} 