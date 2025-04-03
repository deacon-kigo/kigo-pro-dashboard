'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchCallVolumeData } from '@/lib/redux/slices/analyticsSlice';
import { LineChart } from '@/components/molecules/Chart';
import { cn } from '@/lib/utils';
import { Chart as ChartJS } from 'chart.js';

type CallVolumeChartProps = {
  height?: number;
  className?: string;
};

const CallVolumeChart: React.FC<CallVolumeChartProps> = ({ 
  height = 300,
  className
}) => {
  const dispatch = useAppDispatch();
  const { callVolumeData, isLoading, error } = useAppSelector(state => state.analytics);
  
  useEffect(() => {
    if (callVolumeData.length === 0) {
      dispatch(fetchCallVolumeData());
    }
  }, [dispatch, callVolumeData.length]);
  
  if (isLoading) {
    return (
      <div className={cn("p-4 border rounded-md", className)}>
        <div className="h-[300px] bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={cn("p-4 border border-red-200 rounded-md", className)}>
        <h3 className="text-lg font-medium text-red-600">Error Loading Data</h3>
        <p className="text-red-500 mb-2">{error}</p>
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          Unable to load chart data. Please try again later.
        </div>
      </div>
    );
  }
  
  // Format data for Shadcn chart
  const chartData = {
    labels: callVolumeData.map(item => item.date),
    datasets: [
      {
        label: 'Total Calls',
        data: callVolumeData.map(item => item.calls),
        borderColor: '#3268cc', // Kigo blue
        backgroundColor: 'rgba(50, 104, 204, 0.2)',
        borderWidth: 3,
        tension: 0.3, // Add curve to the line
      },
      {
        label: 'Token Issues',
        data: callVolumeData.map(item => item.tokenIssues),
        borderColor: '#10b981', // Green
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: 'Coupon Issues',
        data: callVolumeData.map(item => item.couponIssues),
        borderColor: '#cc0000', // CVS red
        backgroundColor: 'rgba(204, 0, 0, 0.2)',
        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: 'Account Issues',
        data: callVolumeData.map(item => item.accountIssues),
        borderColor: '#f59e0b', // Amber
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.3,
      },
    ],
  };
  
  const anomalies = callVolumeData.filter(item => item.isAnomaly);
  
  // Create annotation plugin config for highlighting anomalies
  const annotationPlugin = {
    id: 'customAnnotation',
    afterDraw: (chart: ChartJS) => {
      const ctx = chart.ctx;
      const xAxis = chart.scales.x;
      const yAxis = chart.scales.y;
      
      anomalies.forEach(anomaly => {
        const index = chartData.labels.indexOf(anomaly.date);
        if (index !== -1) {
          const x = xAxis.getPixelForValue(index);
          // Calculate width based on the distance between tick marks
          const tickWidth = xAxis.width / (chartData.labels.length - 1);
          
          ctx.save();
          ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
          ctx.fillRect(
            x - tickWidth / 2, 
            yAxis.top, 
            tickWidth,
            yAxis.bottom - yAxis.top
          );
          ctx.restore();
        }
      });
    }
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000, // Longer animation for a more playful feel
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true, // Use circle points instead of rectangles
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value} calls`;
          }
        }
      },
      customAnnotation: annotationPlugin
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          padding: 8,
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          padding: 8,
        }
      }
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 6,
      }
    }
  };
  
  return (
    <div className={className}>
      <div className="mb-2">
        <LineChart 
          data={chartData} 
          options={chartOptions} 
          size={height >= 350 ? "lg" : height <= 250 ? "sm" : "default"}
        />
      </div>
      
      {/* Anomaly indicators */}
      {anomalies.length > 0 && (
        <div className="mt-2 bg-red-50 p-3 rounded-md">
          <h4 className="text-sm font-medium text-red-800">Detected System Issues:</h4>
          <ul className="mt-1 space-y-1">
            {anomalies.map((anomaly, index) => (
              <li key={index} className="flex items-center text-sm">
                <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                <span className="text-red-700 font-medium">{anomaly.date}:</span>
                <span className="ml-2 text-red-600">{anomaly.anomalyReason}</span>
                <span className="ml-2 text-gray-500">({anomaly.calls} calls)</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CallVolumeChart; 