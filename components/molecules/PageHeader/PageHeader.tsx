"use client";

import React, { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  emoji?: string;
  actions?: ReactNode;
  gradientColors?: {
    from: string;
    to: string;
  };
}

/**
 * PageHeader component with a gradient background and optional actions
 * Inspired by the GreetingHeader in CampaignManagerView
 */
export default function PageHeader({
  title,
  description,
  emoji = "✨",
  actions,
  gradientColors = {
    from: "rgba(226, 240, 253, 0.9)",
    to: "rgba(226, 232, 255, 0.85)",
  },
}: PageHeaderProps) {
  return (
    <div
      className="relative overflow-hidden rounded-lg mb-4"
      style={{
        background: `linear-gradient(135deg, ${gradientColors.from}, ${gradientColors.to})`,
        overflow: "hidden",
        borderRadius: "0.75rem",
        marginBottom: "1rem",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.03)",
      }}
    >
      <div className="absolute inset-0 opacity-8">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: "120px 120px",
          }}
        />
      </div>
      <div className="relative p-5 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <span className="text-4xl mr-3">{emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-blue-600">{title}</h1>
              {description && (
                <p className="text-sm text-blue-500 mt-1">{description}</p>
              )}
            </div>
          </div>
          {actions && <div className="mt-4 sm:mt-0">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
