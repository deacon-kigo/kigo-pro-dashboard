import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

export default function StatCard({ title, value, change, icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border-light p-5">
      <div className="flex items-start">
        <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center mr-4`}>
          <div className={`${iconColor}`}>
            {icon}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-text-muted">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {change !== undefined && (
            <div className="flex items-center mt-1">
              {change >= 0 ? (
                <div className="flex items-center text-green-600 text-xs font-medium">
                  <ArrowUpIcon className="w-3 h-3 mr-1" />
                  <span>{change.toFixed(1)}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 text-xs font-medium">
                  <ArrowDownIcon className="w-3 h-3 mr-1" />
                  <span>{Math.abs(change).toFixed(1)}%</span>
                </div>
              )}
              <span className="text-xs text-text-muted ml-1">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 