'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Line, LineChart 
} from 'recharts';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import { useDemo } from '../../../contexts/DemoContext';
import { BusinessData } from '../DynamicCanvas';
import Card from '../../shared/Card';

interface BusinessIntelligenceViewProps {
  data: BusinessData;
}

const BusinessIntelligenceView: React.FC<BusinessIntelligenceViewProps> = ({ data }) => {
  const { clientId, themeMode } = useDemo();
  
  // Format sales data for visualization
  const formatSalesData = (salesData: { [key: string]: number }) => {
    return Object.entries(salesData).map(([day, value]) => ({
      day,
      value
    }));
  };
  
  // Get colors based on client
  const getClientColors = () => {
    switch(clientId) {
      case 'deacons-pizza':
        return {
          primary: '#2563EB', // Changed to blue
          secondary: '#16A34A',
          tertiary: '#F7B32B',
          quaternary: '#6366F1',
          background: '#EFF6FF' // Light blue background
        };
      case 'cvs':
        return {
          primary: '#CC0000',
          secondary: '#0077C8',
          tertiary: '#FFC220',
          quaternary: '#005A9C',
          background: '#FFFFFF'
        };
      default:
        return {
          primary: '#4460F0',
          secondary: '#34D399',
          tertiary: '#F7B32B',
          quaternary: '#6366F1',
          background: '#F9FAFB'
        };
    }
  };
  
  const colors = getClientColors();
  const salesByDayData = formatSalesData(data.salesByDay);
  
  // Format currency for charts
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };
  
  // Note: We're now using the data passed in from props instead of defining mockBusinessData
  // The component receives the already formatted data with concise insights
  
  return (
    <div className="h-full flex flex-col overflow-y-auto p-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales by Day */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sales by Day of Week</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesByDayData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748B' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748B' }}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`$${value}`, 'Sales']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill={colors.primary} 
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex">
                <LightBulbIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Key Insight:</span> {data.insights.salesByDay}
                </p>
              </div>
            </div>
          </Card>
          
          {/* Performance Trends */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.performanceTrend}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.primary} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.secondary} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={colors.secondary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748B' }}
                  />
                  <YAxis 
                    yAxisId="left" 
                    orientation="left" 
                    tickFormatter={(value) => `$${value}`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748B' }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748B' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'sales' ? formatCurrency(value as number) : value,
                      name === 'sales' ? 'Revenue' : 'Orders'
                    ]}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    yAxisId="left"
                    stroke={colors.primary} 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="orders" 
                    yAxisId="right"
                    stroke={colors.secondary} 
                    fillOpacity={1} 
                    fill="url(#colorOrders)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex">
                <LightBulbIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Key Insight:</span> {data.insights.performanceTrend}
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Competitor Activity */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Competitor Activity</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.competitorActivity}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748B' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748B' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="ourPromos" 
                    name="Our Promotions" 
                    stroke={colors.primary} 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="competitorPromos" 
                    name="Competitor Promotions" 
                    stroke={colors.quaternary} 
                    strokeWidth={2} 
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex">
                <LightBulbIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Key Insight:</span> {data.insights.competitorActivity}
                </p>
              </div>
            </div>
          </Card>
          
          {/* Customer Segments */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Customer Segments</h3>
            </div>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.customerSegments}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="segment"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.customerSegments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={[colors.primary, colors.secondary, colors.tertiary, colors.quaternary][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [`${value}%`, props.payload.segment]}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex">
                <LightBulbIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Key Insight:</span> {data.insights.customerSegments}
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Campaign Opportunities */}
        <Card>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <LightBulbIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Marketing Opportunities</h3>
          </div>
          <div className="space-y-3">
            {data.marketingOpportunities.map((opportunity, index) => (
              <div 
                key={index} 
                className="p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-lg"
              >
                <h5 className="text-base font-medium mb-1">{opportunity.title}</h5>
                <p className="text-sm text-gray-600">{opportunity.description}</p>
                
                <div className="mt-2 flex space-x-2">
                  <span className={`text-xs font-medium text-white px-2 py-1 rounded ${
                    opportunity.impact === 'High' ? 'bg-green-500' :
                    opportunity.impact === 'Medium' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`}>
                    Impact: {opportunity.impact}
                  </span>
                  <span className={`text-xs font-medium text-white px-2 py-1 rounded ${
                    opportunity.difficulty === 'Low' ? 'bg-green-500' :
                    opportunity.difficulty === 'Medium' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}>
                    Difficulty: {opportunity.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BusinessIntelligenceView; 