import React from 'react';

export interface GradientCardProps {
  /**
   * Title of the card
   */
  title: string;
  /**
   * Value to display prominently
   */
  value: string | number;
  /**
   * Brief description text
   */
  description?: string;
  /**
   * Change percentage to display (positive or negative)
   */
  change?: number;
  /**
   * Icon to display in the card
   */
  icon?: React.ReactNode;
  /**
   * Primary gradient color (CSS gradient string or color)
   */
  gradient?: string;
  /**
   * Additional classes for the card
   */
  className?: string;
  /**
   * Whether to show a decorative pattern in the background
   */
  pattern?: boolean;
}

/**
 * A card component with gradient background for displaying statistics or data
 */
export default function GradientCard({
  title,
  value,
  description,
  change,
  icon,
  gradient = 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
  className = '',
  pattern = true,
}: GradientCardProps) {
  return (
    <div 
      className={`relative overflow-hidden rounded-xl text-white p-6 ${className}`}
      style={{ background: gradient }}
    >
      {/* Decorative pattern */}
      {pattern && (
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="smallGrid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
          </svg>
        </div>
      )}

      {/* Card content */}
      <div className="relative z-10">
        {/* Icon at the top right */}
        {icon && (
          <div className="absolute top-0 right-0 bg-white bg-opacity-20 p-2 rounded-lg">
            {icon}
          </div>
        )}

        {/* Title */}
        <h3 className="text-white text-sm font-medium opacity-80 mb-1">{title}</h3>
        
        {/* Value */}
        <div className="text-3xl font-bold mb-1">{value}</div>
        
        {/* Description */}
        {description && (
          <div className="text-sm opacity-80 mb-2">{description}</div>
        )}
        
        {/* Change indicator */}
        {change !== undefined && (
          <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center 
            ${change >= 0 ? 'bg-green-500 bg-opacity-20' : 'bg-red-500 bg-opacity-20'}`}
          >
            {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
} 