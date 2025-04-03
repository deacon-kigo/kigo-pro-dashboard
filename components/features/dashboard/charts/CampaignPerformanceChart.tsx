'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '@/components/atoms/Card/Card';

// Mock data for campaign performance
const data = [
  { name: 'Summer Sale', engagement: 65, conversion: 42, roi: 3.2 },
  { name: 'Back to School', engagement: 48, conversion: 37, roi: 2.8 },
  { name: 'New Customer', engagement: 72, conversion: 51, roi: 4.1 },
  { name: 'Holiday Season', engagement: 82, conversion: 63, roi: 5.7 },
  { name: 'Loyalty Rewards', engagement: 39, conversion: 25, roi: 1.9 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
        <p className="font-medium text-sm mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`tooltip-${index}`} className="flex items-center text-xs mb-1">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-text-muted">{entry.name}: </span>
            <span className="ml-1 font-medium">
              {entry.name === 'ROI' ? `${entry.value}x` : `${entry.value}%`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function CampaignPerformanceChart() {
  return (
    <Card className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-dark">Campaign Performance</h3>
          <p className="text-sm text-text-muted">Engagement, conversion rates and ROI</p>
        </div>
      </div>
      
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748B' }}
              tickMargin={10}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748B' }}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748B' }}
              tickFormatter={(value) => `${value}x`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingBottom: '15px' }}
            />
            <Bar 
              yAxisId="left" 
              dataKey="engagement" 
              name="Engagement" 
              fill="#EFF6FF" 
              stroke="#2563EB" 
              strokeWidth={1} 
              radius={[4, 4, 0, 0]} 
              barSize={25}
            />
            <Bar 
              yAxisId="left" 
              dataKey="conversion" 
              name="Conversion" 
              fill="#F3E8FF" 
              stroke="#9333EA" 
              strokeWidth={1} 
              radius={[4, 4, 0, 0]} 
              barSize={25}
            />
            <Bar 
              yAxisId="right" 
              dataKey="roi" 
              name="ROI" 
              fill="#DCFCE7" 
              stroke="#16A34A" 
              strokeWidth={1} 
              radius={[4, 4, 0, 0]} 
              barSize={25}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 