import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface AIAction {
  icon: React.ReactNode;
  title: string;
  href: string;
}

interface AIAssistantCardProps {
  title: string;
  subtitle: string;
  actions?: AIAction[];
  className?: string;
  icon?: React.ReactNode;
}

/**
 * AI Assistant Card component used for displaying AI capabilities and suggestions
 * 
 * @component
 * @example
 * <AIAssistantCard
 *   title="Hey Jane, I'm your AI Assistant"
 *   subtitle="Personalized insights for your campaigns"
 *   actions={[
 *     { 
 *       icon: <ChartBarIcon className="w-5 h-5" />, 
 *       title: "Analyze campaign performance", 
 *       href: "/analytics" 
 *     }
 *   ]}
 * />
 */
export default function AIAssistantCard({
  title,
  subtitle,
  actions = [],
  className = '',
  icon
}: AIAssistantCardProps) {
  return (
    <div className={`bg-blue-50/70 rounded-xl border border-blue-100 p-5 ${className}`}>
      <div className="flex">
        {icon && <div className="mr-3">{icon}</div>}
        <div>
          <h3 className="font-semibold text-blue-800">{title}</h3>
          <p className="text-sm text-blue-700/80 mt-1">{subtitle}</p>
        </div>
      </div>

      {actions.length > 0 && (
        <div className="mt-4 space-y-3">
          {actions.map((action, index) => (
            <Link 
              key={index}
              href={action.href}
              className="flex items-center p-3 bg-white hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors group"
            >
              <div className="text-blue-600 mr-3">
                {action.icon}
              </div>
              <span className="text-sm text-gray-700 font-medium flex-grow">
                {action.title}
              </span>
              <ChevronRightIcon className="w-4 h-4 text-blue-400 group-hover:text-blue-600 transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 