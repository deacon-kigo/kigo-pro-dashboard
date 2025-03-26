'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { SparklesIcon, HomeIcon, ShoppingCartIcon, CurrencyDollarIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { buildDemoUrl } from '@/lib/utils';

export default function DemosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Kigo Pro Dashboard Demos</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Explore interactive demonstrations of our personalized dashboard platform with AI-powered marketing tools and real-time analytics</p>
          
          <div className="flex justify-center space-x-3 mt-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <SparklesIcon className="h-4 w-4 mr-1" />
              AI Marketing
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <ChartBarIcon className="h-4 w-4 mr-1" />
              Analytics
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              <UserGroupIcon className="h-4 w-4 mr-1" />
              Personalization
            </span>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Deacon's Pizza Demo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-red-100 rounded-full overflow-hidden flex items-center justify-center mr-4">
                  <img 
                    src="/logos/deacons-pizza.png" 
                    alt="Deacon's Pizza" 
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Deacon's Pizza Dashboard</h2>
              </div>
              
              <p className="text-gray-600 mb-6 h-20">
                Explore a personalized dashboard for Deacon's Pizza with sales analytics, campaign management, and AI-powered marketing recommendations.
              </p>
              
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  <span className="text-xs text-gray-600">Sales Analytics</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <ChartBarIcon className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                  <span className="text-xs text-gray-600">Campaign Data</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <SparklesIcon className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                  <span className="text-xs text-gray-600">AI Marketing</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-x-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Restaurant
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Marketing
                  </span>
                </div>
                
                <Link 
                  href={buildDemoUrl('deacons', 'pizza')} 
                  className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  View Demo
                  <ArrowRightIcon className="ml-1.5 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* AI Campaign Creation Demo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-blue-100 rounded-full overflow-hidden flex items-center justify-center mr-4">
                  <SparklesIcon className="h-7 w-7 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">AI Campaign Creation</h2>
              </div>
              
              <p className="text-gray-600 mb-6 h-20">
                Experience our interactive AI-powered campaign creation tool that analyzes business data and generates targeted marketing campaigns with custom assets.
              </p>
              
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <svg className="h-5 w-5 text-purple-500 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span className="text-xs text-gray-600">Smart Analysis</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <svg className="h-5 w-5 text-indigo-500 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  <span className="text-xs text-gray-600">Custom Assets</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <svg className="h-5 w-5 text-green-500 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-xs text-gray-600">Performance</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-x-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    AI
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Marketing
                  </span>
                </div>
                
                <Link 
                  href="/demos/ai-campaign-creation" 
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  View Demo
                  <ArrowRightIcon className="ml-1.5 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* CVS Demo (Coming Soon) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-red-100 rounded-full overflow-hidden flex items-center justify-center mr-4">
                  <img 
                    src="/logos/cvs-logo.svg" 
                    alt="CVS" 
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">CVS Token Management</h2>
              </div>
              
              <p className="text-gray-600 mb-6 h-20">
                Experience a comprehensive support portal for CVS ExtraCare with integrated ticketing and token management. Navigate from the agent dashboard to customer token management to resolve rewards and coupon issues.
              </p>
              
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <svg className="h-5 w-5 text-red-500 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span className="text-xs text-gray-600">Token Management</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <UserGroupIcon className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                  <span className="text-xs text-gray-600">Customer Support</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <SparklesIcon className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                  <span className="text-xs text-gray-600">Reward Management</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-x-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Pharmacy
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Customer Support
                  </span>
                </div>
                
                <Link 
                  href="/demos/cvs-dashboard" 
                  className="inline-flex items-center px-3 py-1.5 bg-[#CC0000] hover:bg-[#AA0000] text-white text-sm font-medium rounded-lg transition-colors"
                >
                  View Demo
                  <ArrowRightIcon className="ml-1.5 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">About These Demos</h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            These interactive demos showcase the flexibility and capabilities of the Kigo Pro dashboard system. Each demo represents a different industry or use case, highlighting how our platform can be customized to meet specific business needs.
          </p>
          
          <p className="text-gray-600">
            The dashboards feature real-time data visualization, AI-powered insights, and personalized recommendations to help businesses make data-driven decisions. Explore the demos to see how Kigo Pro can transform your business.
          </p>
        </div>
      </div>
    </div>
  );
} 