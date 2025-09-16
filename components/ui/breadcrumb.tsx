"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  className?: string;
  children: React.ReactNode;
}

interface BreadcrumbListProps {
  children: React.ReactNode;
}

interface BreadcrumbItemProps {
  children: React.ReactNode;
}

interface BreadcrumbLinkProps {
  href: string;
  children: React.ReactNode;
}

interface BreadcrumbPageProps {
  children: React.ReactNode;
}

interface BreadcrumbSeparatorProps {
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  className = "",
  children,
}) => {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      {children}
    </nav>
  );
};

export const BreadcrumbList: React.FC<BreadcrumbListProps> = ({ children }) => {
  return (
    <ol className="flex items-center space-x-1 md:space-x-3">{children}</ol>
  );
};

export const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ children }) => {
  return <li className="flex items-center">{children}</li>;
};

export const BreadcrumbLink: React.FC<BreadcrumbLinkProps> = ({
  href,
  children,
}) => {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
    >
      {children}
    </Link>
  );
};

export const BreadcrumbPage: React.FC<BreadcrumbPageProps> = ({ children }) => {
  return <span className="text-sm font-medium text-gray-900">{children}</span>;
};

export const BreadcrumbSeparator: React.FC<BreadcrumbSeparatorProps> = ({
  className = "",
}) => {
  return <ChevronRight className={`w-4 h-4 text-gray-400 ${className}`} />;
};
