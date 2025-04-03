/**
 * @view AnalyticsView
 * @classification view
 * @pattern data-display
 * @usage both
 * @description A domain-agnostic view for displaying analytics data and visualization
 */
'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchCallVolumeData, refreshAnalyticsData } from '@/lib/redux/slices/analyticsSlice';
import { ArrowUpIcon, ArrowPathIcon, PhoneIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

// Reusing the existing CallVolumeChart component temporarily during migration
// This will be imported from the core components once it's migrated
import CallVolumeChart from '@/components/features/analytics/CallVolumeChart';

type AnalyticsViewProps = {
  isExpanded?: boolean;
  title?: string;
  icon?: React.ReactNode;
};

/**
 * Analytics View component
 * 
 * This is a domain-agnostic view that displays analytics data
 * It can be used with different data sources through prop composition
 */
const AnalyticsView: React.FC<AnalyticsViewProps> = ({ 
  isExpanded = false,
  title = "Support Call Analytics",
  icon = <PhoneIcon className="h-5 w-5 mr-2 text-blue-500" />
}) => {
  const dispatch = useAppDispatch();
  const { 
    currentCallVolume, 
    averageCallVolume, 
    issueMetrics, 
    lastUpdated,
    isLoading
  } = useAppSelector(state => state.analytics);
  
  const { features } = useAppSelector(state => state.featureConfig);
  
  useEffect(() => {
    if (features?.analytics?.enableCallVolumeTracking) {
      dispatch(fetchCallVolumeData());
    }
  }, [dispatch, features?.analytics?.enableCallVolumeTracking]);
  
  const percentIncrease = Math.round((currentCallVolume - averageCallVolume) / averageCallVolume * 100);
  
  const handleRefresh = () => {
    dispatch(refreshAnalyticsData());
  };
  
  if (!features?.analytics?.enableCallVolumeTracking) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 flex items-center">
          {icon}
          {title}
        </h2>
        <div className="flex items-center">
          {percentIncrease > 10 && (
            <div className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-md text-sm flex items-center mr-3">
              <ExclamationCircleIcon className="h-4 w-4 mr-1" />
              <span>Abnormal call volume</span>
            </div>
          )}
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 rounded-full hover:bg-gray-100"
          >
            <ArrowPathIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Current Call Volume</div>
            <div className="text-2xl font-bold">{currentCallVolume}</div>
            <div className="flex items-center text-sm mt-1">
              <ArrowUpIcon className="h-3 w-3 text-red-500 mr-1" />
              <span className="text-red-600">{percentIncrease}% above average</span>
            </div>
          </div>
          
          {issueMetrics.map((metric, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">{metric.name}</div>
              <div className="text-2xl font-bold">{metric.count}</div>
              <div className="mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${metric.percentOfTotal}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{metric.percentOfTotal}% of total</div>
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Call Volume Trend (Last 7 Days)</h3>
            {lastUpdated && (
              <div className="text-xs text-gray-500">
                Last updated: {new Date(lastUpdated).toLocaleTimeString()}
              </div>
            )}
          </div>
          <CallVolumeChart height={isExpanded ? 400 : 250} />
          
          {!isExpanded && (
            <div className="text-center mt-4">
              <button className="text-blue-600 text-sm hover:text-blue-800">
                View detailed analytics
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView; 