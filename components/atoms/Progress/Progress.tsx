import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  showValue?: boolean;
  label?: string;
}

const colorClasses = {
  primary: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  info: 'bg-cyan-500'
};

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4'
};

/**
 * Progress component for displaying linear progress bars
 *
 * @component
 * @example
 * // Basic progress bar
 * <Progress value={75} />
 *
 * // Progress bar with label and percentage
 * <Progress value={75} max={100} label="Weekly Progress" showValue />
 *
 * // Progress bar with custom color and size
 * <Progress value={75} color="success" size="lg" />
 */
export default function Progress({
  value,
  max = 100,
  className = '',
  barClassName = '',
  size = 'md',
  color = 'primary',
  showValue = false,
  label
}: ProgressProps) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);
  
  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-medium text-gray-700">{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} rounded-full ${sizeClasses[size]} ${barClassName}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
} 