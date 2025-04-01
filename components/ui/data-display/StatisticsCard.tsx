import React from 'react';

export interface StatisticsCardProps {
  /**
   * Title of the card
   */
  title: string;
  /**
   * Main value to display
   */
  value: string | number;
  /**
   * Change percentage (positive or negative)
   */
  change?: number;
  /**
   * Small description text
   */
  subtitle?: string;
  /**
   * Icon for the card
   */
  icon?: React.ReactNode;
  /**
   * Color theme for the card (affects icon background and chart)
   */
  color?: 'blue' | 'green' | 'red' | 'purple' | 'amber' | 'indigo' | 'cyan';
  /**
   * Data points for the sparkline chart
   */
  data?: number[];
  /**
   * Additional className for the card
   */
  className?: string;
}

const colorClasses = {
  blue: {
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    chartColor: '#3B82F6',
    chartBg: '#DBEAFE',
  },
  green: {
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    chartColor: '#10B981',
    chartBg: '#D1FAE5',
  },
  red: {
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    chartColor: '#EF4444',
    chartBg: '#FEE2E2',
  },
  purple: {
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    chartColor: '#8B5CF6',
    chartBg: '#EDE9FE',
  },
  amber: {
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    chartColor: '#F59E0B',
    chartBg: '#FEF3C7',
  },
  indigo: {
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    chartColor: '#6366F1',
    chartBg: '#E0E7FF',
  },
  cyan: {
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
    chartColor: '#0891B2',
    chartBg: '#CFFAFE',
  },
};

/**
 * A statistics card component with mini-chart for dashboards
 */
export default function StatisticsCard({
  title,
  value,
  change,
  subtitle,
  icon,
  color = 'blue',
  data = [10, 25, 15, 30, 20, 35, 40, 25, 45, 30],
  className = '',
}: StatisticsCardProps) {
  const { iconBg, iconColor, chartColor, chartBg } = colorClasses[color];
  
  // Find min and max values for scaling
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue;
  
  // Calculate sparkline points
  const sparklinePoints = data.map((value, index) => {
    // Scale to 0-40 range for the SVG height
    const scaledValue = range !== 0 
      ? 40 - ((value - minValue) / range) * 40 
      : 20; // If all values are the same, center it
    
    // Distribute points evenly along the x-axis
    const x = (index / (data.length - 1)) * 100;
    return `${x},${scaledValue}`;
  }).join(' ');

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      <div className="p-5">
        <div className="flex justify-between mb-4">
          {/* Icon in colored background */}
          {icon && (
            <div className={`p-2 rounded-lg ${iconBg}`}>
              <div className={iconColor}>
                {icon}
              </div>
            </div>
          )}
          
          {/* Mini sparkline chart */}
          <div className="w-24 h-10">
            <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
              {/* Optional area fill */}
              <defs>
                <linearGradient id={`sparkline-gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={chartColor} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={chartColor} stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Area below the line */}
              <path
                d={`M0,40 L0,${sparklinePoints.split(' ')[0].split(',')[1]} ${sparklinePoints} L100,40 Z`}
                fill={`url(#sparkline-gradient-${color})`}
              />
              
              {/* The line itself */}
              <polyline
                fill="none"
                stroke={chartColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sparklinePoints}
              />
              
              {/* Dot for the last value */}
              <circle
                cx="100"
                cy={sparklinePoints.split(' ').pop()?.split(',')[1]}
                r="2"
                fill="white"
                stroke={chartColor}
                strokeWidth="1"
              />
            </svg>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        
        {/* Value and change */}
        <div className="mt-2 flex items-baseline">
          <div className="text-2xl font-semibold">{value}</div>
          
          {change !== undefined && (
            <div 
              className={`ml-2 text-xs font-medium px-2 py-0.5 rounded ${
                change >= 0 
                  ? 'text-green-700 bg-green-100' 
                  : 'text-red-700 bg-red-100'
              }`}
            >
              {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
            </div>
          )}
        </div>
        
        {/* Subtitle or period */}
        {subtitle && (
          <div className="mt-1 text-gray-400 text-xs">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
} 