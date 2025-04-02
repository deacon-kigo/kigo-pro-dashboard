import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleAction?: React.ReactNode;
}

export default function Card({ title, children, className = '', titleAction }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-shadow duration-200 p-5 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-dark">{title}</h3>
          {titleAction && <div className="ml-auto">{titleAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
} 