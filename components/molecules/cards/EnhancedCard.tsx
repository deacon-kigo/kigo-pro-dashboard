import React from 'react';

export interface EnhancedCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  variant?: 'default' | 'elevated' | 'gradient' | 'outline' | 'glass';
  gradientFrom?: string;
  gradientTo?: string;
  cardIcon?: React.ReactNode;
  headerContent?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Enhanced card component with multiple visual variants
 * 
 * @component
 * @example
 * // Default card
 * <EnhancedCard>Content</EnhancedCard>
 * 
 * // Elevated card with soft shadows
 * <EnhancedCard variant="elevated">Content</EnhancedCard>
 * 
 * // Gradient card
 * <EnhancedCard variant="gradient" gradientFrom="from-blue-500" gradientTo="to-indigo-600">Content</EnhancedCard>
 * 
 * // Glass effect card
 * <EnhancedCard variant="glass">Content</EnhancedCard>
 */
export default function EnhancedCard({ 
  children, 
  title, 
  className = '',
  variant = 'default',
  gradientFrom = 'from-primary',
  gradientTo = 'to-primary-dark',
  cardIcon,
  headerContent,
  footer
}: EnhancedCardProps) {
  // Base classes for all card variants
  let cardClasses = 'rounded-xl overflow-hidden ';
  
  // Add variant-specific classes
  switch (variant) {
    case 'elevated':
      cardClasses += 'bg-white border border-gray-100 shadow-lg shadow-gray-200/50 ';
      break;
    case 'gradient':
      cardClasses += `bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white `;
      break;
    case 'outline':
      cardClasses += 'bg-white border-2 border-gray-200 ';
      break;
    case 'glass':
      cardClasses += 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm ';
      break;
    default:
      cardClasses += 'bg-white border border-gray-200 shadow-sm ';
  }
  
  // Add any custom classes
  cardClasses += className;
  
  // Determine header content color based on variant
  const headerTextColor = variant === 'gradient' ? 'text-white' : 'text-gray-900';
  
  return (
    <div className={cardClasses}>
      {(title || headerContent || cardIcon) && (
        <div className={`px-5 py-4 ${variant === 'gradient' ? '' : 'border-b border-gray-200'} flex items-center justify-between`}>
          <div className="flex items-center">
            {cardIcon && (
              <div className="mr-3">
                {cardIcon}
              </div>
            )}
            
            {title && (
              <h3 className={`text-lg font-medium ${headerTextColor}`}>{title}</h3>
            )}
          </div>
          
          {headerContent && (
            <div className="ml-auto">
              {headerContent}
            </div>
          )}
        </div>
      )}
      
      <div className={`${title || headerContent || cardIcon ? 'p-5' : 'p-5'}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`px-5 py-3 ${variant === 'gradient' ? 'bg-black/10' : 'bg-gray-50 border-t border-gray-200'}`}>
          {footer}
        </div>
      )}
    </div>
  );
} 