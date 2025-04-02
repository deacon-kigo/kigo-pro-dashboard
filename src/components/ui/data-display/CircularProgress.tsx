import React from 'react';

export interface CircularProgressProps {
  /**
   * The percentage value to display (0-100)
   */
  value: number;
  /**
   * The size of the circular progress in pixels
   */
  size?: number;
  /**
   * The width of the progress stroke
   */
  strokeWidth?: number;
  /**
   * The color of the progress indicator
   */
  color?: string;
  /**
   * The color of the background track
   */
  trackColor?: string;
  /**
   * Optional label to display inside the progress circle
   */
  label?: React.ReactNode;
  /**
   * Optional text to display below the progress circle
   */
  description?: string;
  /**
   * Additional className for the container
   */
  className?: string;
}

/**
 * A circular progress component that displays a percentage value
 */
export default function CircularProgress({
  value,
  size = 128,
  strokeWidth = 10,
  color = 'currentColor',
  trackColor = '#E5E7EB',
  label,
  description,
  className
}: CircularProgressProps) {
  // Ensure value is between 0-100
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  
  // Calculate the radius and center point
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${circumference}`;
  const strokeDashoffset = circumference - (circumference * normalizedValue) / 100;

  return (
    <div className={`flex flex-col items-center ${className || ''}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          
          {/* Progress indicator */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        
        {/* Center label */}
        {label !== undefined && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            {typeof label === 'string' ? (
              <span className="text-xl font-bold">{label}</span>
            ) : (
              label
            )}
          </div>
        )}
      </div>
      
      {/* Description text */}
      {description && (
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          {description}
        </p>
      )}
    </div>
  );
} 