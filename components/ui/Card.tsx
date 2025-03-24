'use client';

import React from 'react';

type CardProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
};

/**
 * A reusable card component for displaying content in a contained box
 */
export default function Card({ children, title, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {title && (
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
} 