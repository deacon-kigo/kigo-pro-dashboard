'use client';

import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import Card from '../../shared/Card';

// Define data types to avoid TypeScript errors
interface MonthlyDataPoint {
  name: string;
  revenue: number;
  expenses: number;
  profit: number;
  lastYear: number;
}

interface WeeklyDataPoint {
  name: string;
  revenue: number;
  expenses: number;
  profit: number;
  lastWeek: number;
}

type DataPoint = MonthlyDataPoint | WeeklyDataPoint;

// Mock data with more details
const monthlyData: MonthlyDataPoint[] = [
  { name: 'Jan', revenue: 4000, expenses: 2100, profit: 1900, lastYear: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1700, profit: 1300, lastYear: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 1200, profit: 800, lastYear: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 1400, profit: 1380, lastYear: 3908 },
  { name: 'May', revenue: 1890, expenses: 980, profit: 910, lastYear: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 1300, profit: 1090, lastYear: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 1800, profit: 1690, lastYear: 4300 },
  { name: 'Aug', revenue: 4000, expenses: 2200, profit: 1800, lastYear: 2400 },
  { name: 'Sep', revenue: 3000, expenses: 1600, profit: 1400, lastYear: 1398 },
  { name: 'Oct', revenue: 2000, expenses: 1100, profit: 900, lastYear: 9800 },
  { name: 'Nov', revenue: 2780, expenses: 1500, profit: 1280, lastYear: 3908 },
  { name: 'Dec', revenue: 3890, expenses: 2000, profit: 1890, lastYear: 4800 },
];

const weeklyData: WeeklyDataPoint[] = [
  { name: 'Week 1', revenue: 10220, expenses: 3450, profit: 6770, lastWeek: 9800 },
  { name: 'Week 2', revenue: 11870, expenses: 4120, profit: 7750, lastWeek: 10500 },
  { name: 'Week 3', revenue: 9150, expenses: 3250, profit: 5900, lastWeek: 8900 },
  { name: 'Week 4', revenue: 11349, expenses: 3975, profit: 7374, lastWeek: 9200 },
];

const dailyData = (() => {
  // Generate the last 14 days of data
  const data = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = date.getDate();
    const formattedDate = `${dayName} ${dayNumber}`;
    
    const revenue = Math.floor(1000 + Math.random() * 1000);
    const expenses = Math.floor(revenue * 0.35);
    const profit = revenue - expenses;
    
    data.push({
      name: formattedDate,
      revenue,
      expenses,
      profit,
      lastYear: Math.floor(800 + Math.random() * 800)
    });
  }
  return data;
})();

const quarterlyData = [
  { name: 'Q1', revenue: 125450, expenses: 42650, profit: 82800, lastYear: 110200 },
  { name: 'Q2', revenue: 143280, expenses: 49750, profit: 93530, lastYear: 128900 },
  { name: 'Q3', revenue: 127959, expenses: 43637, profit: 84322, lastYear: 115800 },
  { name: 'Q4', revenue: 152367, expenses: 51803, profit: 100564, lastYear: 134750 },
];

interface TimeRange {
  label: string;
  value: '1m' | '3m' | '6m' | '1y' | 'all';
}

interface ChartProps {
  timeRangeTab?: string;
  chartType?: 'area' | 'line' | 'bar';
}

export default function RevenueChart({ timeRangeTab = 'monthly', chartType = 'area' }: ChartProps) {
  const timeRanges: TimeRange[] = [
    { label: '1M', value: '1m' },
    { label: '3M', value: '3m' },
    { label: '6M', value: '6m' },
    { label: '1Y', value: '1y' },
    { label: 'All', value: 'all' },
  ];
  
  const [selectedRange, setSelectedRange] = useState<TimeRange['value']>('1y');
  const [selectedChartType, setSelectedChartType] = useState<'area' | 'line' | 'bar'>('area');
  
  useEffect(() => {
    // Set the chart type based on tab
    if (timeRangeTab === 'daily') {
      setSelectedChartType('bar');
    } else if (timeRangeTab === 'weekly') {
      setSelectedChartType('bar');
    } else if (timeRangeTab === 'quarterly') {
      setSelectedChartType('line');
    } else {
      setSelectedChartType('area');
    }
  }, [timeRangeTab]);

  // Get the appropriate data based on the selected tab
  const getChartData = () => {
    switch(timeRangeTab) {
      case 'daily':
        return dailyData;
      case 'weekly':
        return weeklyData;
      case 'quarterly':
        return quarterlyData;
      default:
        return monthlyData;
    }
  };

  // Function to filter data based on selected range
  const getFilteredData = () => {
    const data = getChartData();
    
    // Apply time range filtering only for monthly data
    if (timeRangeTab === 'monthly') {
      switch (selectedRange) {
        case '1m':
          return data.slice(-1);
        case '3m':
          return data.slice(-3);
        case '6m':
          return data.slice(-6);
        case '1y':
        default:
          return data;
      }
    }
    
    return data;
  };

  const filteredData = getFilteredData();
  
  // Calculate totals
  const currentTotal = filteredData.reduce((sum, item) => sum + item.revenue, 0);
  const previousTotal = timeRangeTab === 'weekly' 
    ? filteredData.reduce((sum, item) => sum + ('lastWeek' in item ? item.lastWeek : 0), 0)
    : filteredData.reduce((sum, item) => sum + ('lastYear' in item ? item.lastYear : 0), 0);
    
  const percentChange = previousTotal > 0 
    ? ((currentTotal - previousTotal) / previousTotal) * 100 
    : 0;
  
  // Currency formatter for different scales
  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return `$${(value / 1000).toFixed(0)}k`;
    } else if (value >= 10000) {
      return `$${(value / 1000).toFixed(1)}k`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}k`;
    }
    return `$${value}`;
  };

  // Render the chart based on the selected type
  const renderChart = () => {
    switch(selectedChartType) {
      case 'bar':
        return (
          <BarChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748B' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748B' }} 
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
                border: 'none'
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              formatter={(value: any) => formatCurrency(value)}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar 
              dataKey="revenue" 
              name="Revenue" 
              fill="#EFF6FF" 
              stroke="#2563EB"
              strokeWidth={1}
              barSize={12}
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="expenses" 
              name="Expenses" 
              fill="#DCFCE7" 
              stroke="#16A34A"
              strokeWidth={1}
              barSize={12}
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="profit" 
              name="Profit" 
              fill="#F3E8FF" 
              stroke="#9333EA"
              strokeWidth={1}
              barSize={12}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
      
      case 'line':
        return (
          <LineChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748B' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748B' }} 
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
                border: 'none'
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              formatter={(value: any) => formatCurrency(value)}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              name="Revenue"
              stroke="#2563EB" 
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              name="Expenses"
              stroke="#16A34A" 
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="profit" 
              name="Profit"
              stroke="#9333EA" 
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey={timeRangeTab === 'weekly' ? "lastWeek" : "lastYear"} 
              name="Last Period"
              stroke="#94A3B8" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        );
        
      case 'area':
      default:
        return (
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333EA" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#9333EA" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLastYear" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748B' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748B' }} 
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
                border: 'none'
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              formatter={(value: any) => formatCurrency(value)}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Area 
              type="monotone" 
              dataKey={timeRangeTab === 'weekly' ? "lastWeek" : "lastYear"} 
              name="Last Period" 
              stroke="#94A3B8" 
              strokeWidth={2}
              fill="url(#colorLastYear)" 
              dot={false}
              strokeDasharray="5 5"
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              name="Expenses" 
              stroke="#16A34A" 
              strokeWidth={2}
              fill="url(#colorExpenses)" 
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Area 
              type="monotone" 
              dataKey="profit" 
              name="Profit" 
              stroke="#9333EA" 
              strokeWidth={2}
              fill="url(#colorProfit)" 
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              name="Revenue" 
              stroke="#2563EB" 
              strokeWidth={2}
              fill="url(#colorRevenue)" 
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        );
    }
  };

  return (
    <Card className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-dark">Revenue Overview</h3>
          <div className="flex items-baseline mt-1">
            <span className="text-2xl font-bold text-text-dark">{formatCurrency(currentTotal)}</span>
            <span className={`ml-2 text-sm font-medium ${percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {percentChange >= 0 ? '↑' : '↓'} {Math.abs(percentChange).toFixed(1)}%
            </span>
            <span className="ml-1 text-xs text-text-muted">vs previous period</span>
          </div>
        </div>
        
        {timeRangeTab === 'monthly' && (
          <div className="flex space-x-1 mt-4 md:mt-0 bg-gray-50 rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedRange === range.value
                    ? 'bg-white text-text-dark shadow-sm'
                    : 'text-text-muted hover:text-text-dark'
                }`}
                onClick={() => setSelectedRange(range.value)}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex space-x-1 mt-4 md:mt-0 bg-gray-50 rounded-lg p-1">
          <button
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedChartType === 'area'
                ? 'bg-white text-text-dark shadow-sm'
                : 'text-text-muted hover:text-text-dark'
            }`}
            onClick={() => setSelectedChartType('area')}
          >
            Area
          </button>
          <button
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedChartType === 'line'
                ? 'bg-white text-text-dark shadow-sm'
                : 'text-text-muted hover:text-text-dark'
            }`}
            onClick={() => setSelectedChartType('line')}
          >
            Line
          </button>
          <button
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedChartType === 'bar'
                ? 'bg-white text-text-dark shadow-sm'
                : 'text-text-muted hover:text-text-dark'
            }`}
            onClick={() => setSelectedChartType('bar')}
          >
            Bar
          </button>
        </div>
      </div>
      
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 