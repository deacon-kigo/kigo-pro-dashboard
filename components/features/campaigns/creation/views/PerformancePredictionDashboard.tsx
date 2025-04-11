'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon, SparklesIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { PerformancePredictions } from '../DynamicCanvas';
import { useDemoState } from '@/lib/redux/hooks';

interface PerformancePredictionDashboardProps {
  predictions: PerformancePredictions;
  campaignParams: {
    targeting: {
      audience: string;
      radius: number;
      days: string[];
      timeRange: string;
    };
    schedule: {
      startDate: Date | null;
      endDate: Date | null;
      duration: number;
    };
    offerDetails: {
      name: string;
      price: number;
      items: string[];
      discountPercentage: number;
    };
  };
  onUpdateParams: (key: string, value: any) => void;
}

const PerformancePredictionDashboard: React.FC<PerformancePredictionDashboardProps> = ({
  predictions,
  campaignParams,
  onUpdateParams
}) => {
  const { clientId, themeMode } = useDemoState();
  const [includeFriday, setIncludeFriday] = useState(false);
  const [increasedRadius, setIncreasedRadius] = useState(false);
  
  // Function to calculate predicted change
  const calculateUpdatePrediction = (key: string, percentage: number) => {
    if (!predictions) return {};
    
    // Calculate updated values based on percentage increase
    const updatedPredictions = { ...predictions };
    
    switch (key) {
      case 'views':
        updatedPredictions.views = {
          min: Math.round(predictions.views.min * (1 + percentage / 100)),
          max: Math.round(predictions.views.max * (1 + percentage / 100))
        };
        updatedPredictions.redemptions = {
          min: Math.round(predictions.redemptions.min * (1 + percentage / 100 * 0.8)),
          max: Math.round(predictions.redemptions.max * (1 + percentage / 100 * 0.8))
        };
        updatedPredictions.revenue = {
          min: Math.round(predictions.revenue.min * (1 + percentage / 100 * 0.8)),
          max: Math.round(predictions.revenue.max * (1 + percentage / 100 * 0.8))
        };
        break;
      case 'radius':
        updatedPredictions.views = {
          min: Math.round(predictions.views.min * (1 + percentage / 100)),
          max: Math.round(predictions.views.max * (1 + percentage / 100))
        };
        updatedPredictions.redemptions = {
          min: Math.round(predictions.redemptions.min * (1 + percentage / 100 * 0.7)),
          max: Math.round(predictions.redemptions.max * (1 + percentage / 100 * 0.7))
        };
        updatedPredictions.revenue = {
          min: Math.round(predictions.revenue.min * (1 + percentage / 100 * 0.7)),
          max: Math.round(predictions.revenue.max * (1 + percentage / 100 * 0.7))
        };
        break;
    }
    
    return updatedPredictions;
  };
  
  // Handle scenario toggle
  const handleScenarioToggle = (key: string, enabled: boolean) => {
    if (key === 'includeFriday') {
      setIncludeFriday(enabled);
      
      if (enabled) {
        // Add Friday to days array if not already included
        if (!campaignParams.targeting.days.includes('friday')) {
          onUpdateParams('targeting.days', [...campaignParams.targeting.days, 'friday']);
        }
      } else {
        // Remove Friday from days array
        onUpdateParams('targeting.days', campaignParams.targeting.days.filter(day => day !== 'friday'));
      }
    } else if (key === 'increasedRadius') {
      setIncreasedRadius(enabled);
      
      if (enabled) {
        // Increase radius by 2 miles
        onUpdateParams('targeting.radius', campaignParams.targeting.radius + 2);
      } else {
        // Decrease radius by 2 miles
        onUpdateParams('targeting.radius', Math.max(1, campaignParams.targeting.radius - 2));
      }
    }
  };
  
  // Custom colors based on client
  const getClientColors = () => {
    switch(clientId) {
      case 'deacons-pizza':
        return {
          primary: '#E63946',
          secondary: '#43AA8B',
          neutral: '#FFFAEE',
          accent: '#F7B32B'
        };
      case 'cvs':
        return {
          primary: '#CC0000',
          secondary: '#0077C8',
          neutral: '#FFFFFF',
          accent: '#FFC220'
        };
      default:
        return {
          primary: '#4460F0',
          secondary: '#34D399',
          neutral: '#F9FAFB',
          accent: '#F7B32B'
        };
    }
  };
  
  const colors = getClientColors();
  
  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <h3 className="text-xl font-semibold mb-1">Performance Analysis</h3>
          <p className="text-gray-600 text-sm">
            Based on your campaign parameters, here's what you can expect.
            Try different scenarios to optimize your results.
          </p>
        </motion.div>
        
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <MetricCard
            label="Estimated Views"
            value={`${predictions.views.min.toLocaleString()}-${predictions.views.max.toLocaleString()}`}
            trend={predictions.viewsTrend}
            icon="views"
            color={colors.primary}
          />
          <MetricCard
            label="Expected Redemptions"
            value={`${predictions.redemptions.min.toLocaleString()}-${predictions.redemptions.max.toLocaleString()}`}
            trend={predictions.redemptionsTrend}
            icon="redemptions"
            color={colors.accent}
          />
          <MetricCard
            label="Projected Revenue"
            value={`$${predictions.revenue.min.toLocaleString()}-$${predictions.revenue.max.toLocaleString()}`}
            trend={predictions.revenueTrend}
            icon="revenue"
            color={colors.secondary}
          />
          <MetricCard
            label="Acquisition Cost"
            value={`$${predictions.costPerAcquisition.min.toFixed(2)}-$${predictions.costPerAcquisition.max.toFixed(2)}`}
            trend={predictions.costTrend * -1} // Invert trend for cost (lower is better)
            icon="cost"
            color="#6B7280"
            invertTrend={true}
          />
        </div>
        
        {/* Revenue Timeline - Full width first row */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
          <h4 className="text-base font-medium mb-3">Revenue Impact</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={predictions.revenueTimeline}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorWithCampaign" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.secondary} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={colors.secondary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorWithoutCampaign" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  formatter={(value) => [`$${value}`, '']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="withCampaign" 
                  name="With Campaign"
                  stroke={colors.secondary} 
                  fillOpacity={1} 
                  fill="url(#colorWithCampaign)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="withoutCampaign" 
                  name="Without Campaign"
                  stroke={colors.primary} 
                  fillOpacity={1} 
                  fill="url(#colorWithoutCampaign)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Key Insight:</span> This campaign is predicted to increase your monthly revenue by up to {Math.round((predictions.revenue.max / predictions.revenue.min - 1) * 100)}%.
            </p>
          </div>
        </div>
        
        {/* Customer Journey and Industry Benchmarks side by side in second row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Customer Flow */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <h4 className="text-base font-medium mb-3">Customer Journey</h4>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={predictions.customerFlow}
                  layout="vertical"
                  margin={{ top: 5, right: 10, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="stage" 
                    type="category" 
                    width={60}
                    tick={{ fontSize: 11 }} 
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} customers`, '']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" fill={colors.accent} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Key Insight:</span> About {Math.round((predictions.customerFlow[2].count / predictions.customerFlow[0].count) * 100)}% of users who view your offer are expected to redeem it.
              </p>
            </div>
          </div>
          
          {/* Competitive Comparison */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <h4 className="text-base font-medium mb-3">Industry Benchmarks</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={predictions.competitiveComparison}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, '']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                  />
                  <Bar name="Your Campaign" dataKey="value" fill={colors.primary} radius={[4, 4, 0, 0]} />
                  <Bar name="Industry Average" dataKey="benchmark" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Key Insight:</span> Your campaign is expected to outperform industry averages in conversion rate by {Math.round(predictions.competitiveComparison[1].value - predictions.competitiveComparison[1].benchmark)}%.
              </p>
            </div>
          </div>
        </div>
        
        {/* Optimization Suggestions on its own row at the bottom */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h4 className="text-base font-medium mb-4">
            Optimization Suggestions
            <span className="text-xs font-normal text-gray-500 ml-2">Try these scenarios</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.suggestions.map(suggestion => (
              <OptimizationCard 
                key={suggestion.id}
                suggestion={suggestion}
                onApply={() => {
                  // Apply the suggestion logic
                  if (suggestion.id === 'add-friday') {
                    handleScenarioToggle('includeFriday', !includeFriday);
                  } else if (suggestion.id === 'increase-radius') {
                    handleScenarioToggle('increasedRadius', !increasedRadius);
                  }
                }}
                isActive={
                  (suggestion.id === 'add-friday' && includeFriday) || 
                  (suggestion.id === 'increase-radius' && increasedRadius)
                }
              />
            ))}
          </div>
          
          <div className="mt-4 flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center text-primary text-sm cursor-pointer"
            >
              <SparklesIcon className="w-4 h-4 mr-1" />
              View More Optimization Ideas
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard: React.FC<{
  label: string;
  value: string;
  trend: number;
  icon: string;
  color: string;
  invertTrend?: boolean;
}> = ({ label, value, trend, icon, color, invertTrend = false }) => {
  // Calculate if trend is positive (good) based on whether it should be inverted
  const isPositive = invertTrend ? trend < 0 : trend > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 h-full"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 mr-3">
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <h3 className="text-base font-semibold break-words" style={{ wordBreak: 'break-word' }}>{value}</h3>
        </div>
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}10` }}
        >
          <svg className="w-5 h-5" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {icon === 'views' && (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            )}
            {icon === 'redemptions' && (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
            {icon === 'revenue' && (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
            {icon === 'cost' && (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
        </div>
      </div>
      
      <div className="mt-3 flex items-center">
        <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? (
            <ArrowUpIcon className="w-4 h-4 mr-1 flex-shrink-0" />
          ) : (
            <ArrowDownIcon className="w-4 h-4 mr-1 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{Math.abs(trend)}%</span>
        </div>
        <span className="text-xs text-gray-500 ml-2">vs. Average</span>
      </div>
    </motion.div>
  );
};

// Optimization Card Component
const OptimizationCard: React.FC<{
  suggestion: {
    id: string;
    title: string;
    description: string;
    impact: number;
  };
  onApply: () => void;
  isActive: boolean;
}> = ({ suggestion, onApply, isActive }) => {
  return (
    <div className={`rounded-lg border p-3 ${isActive ? 'border-green-500 bg-green-50' : 'border-gray-100'}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0 mr-3">
          <h5 className="text-sm font-medium mb-1">{suggestion.title}</h5>
          <p className="text-xs text-gray-600">{suggestion.description}</p>
        </div>
        <div className="flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded flex-shrink-0 whitespace-nowrap">
          <ArrowUpIcon className="w-3 h-3 mr-1" />
          <span className="text-xs font-medium">{suggestion.impact}%</span>
        </div>
      </div>
      
      <div className="mt-3 flex justify-end">
        <button
          onClick={onApply}
          className={`px-3 py-1 text-xs font-medium rounded-lg ${
            isActive 
              ? 'bg-green-500 text-white' 
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {isActive ? 'Applied' : 'Apply'}
        </button>
      </div>
    </div>
  );
};

export default PerformancePredictionDashboard; 