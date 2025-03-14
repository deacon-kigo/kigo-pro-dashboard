import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

interface TaskCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  link: string;
  date?: string;
}

export default function TaskCard({ title, description, icon, iconBg, link, date }: TaskCardProps) {
  return (
    <Link href={link} className="group block">
      <div className="bg-white rounded-xl shadow-sm border border-border-light p-5 hover:shadow-md transition duration-200 group-hover:border-primary/20">
        <div className="flex items-start">
          <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center mr-4 shrink-0`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-text-dark group-hover:text-primary">{title}</h3>
              {date && (
                <span className="text-xs text-text-muted whitespace-nowrap ml-2">{date}</span>
              )}
            </div>
            <p className="text-sm text-text-muted mt-1 line-clamp-2">{description}</p>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-text-muted ml-2 group-hover:text-primary shrink-0" />
        </div>
      </div>
    </Link>
  );
} 