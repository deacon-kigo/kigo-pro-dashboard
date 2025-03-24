'use client';

import React from 'react';
import Card from '@/components/ui/Card';

/**
 * Sidebar content component for the token management view
 */
export default function SidebarContent() {
  return (
    <>
      <div className="bg-red-50 rounded-lg p-5 shadow-sm mb-6">
        <div className="flex items-center">
          <div className="bg-red-100 rounded-full p-3 mr-4 text-[#cc0000]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">ExtraCare Support Tools</h3>
            <p className="text-sm text-gray-600">Manage customer tokens easily</p>
          </div>
        </div>
        <div className="mt-4">
          <ul className="space-y-2">
            <li className="flex items-center bg-white p-3 rounded-lg shadow-sm">
              <div className="text-[#cc0000] mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Token Management</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="flex items-center bg-white p-3 rounded-lg shadow-sm">
              <div className="text-[#cc0000] mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm font-medium">View token usage reports</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
          </ul>
        </div>
      </div>
      
      <Card title="Support Guidelines">
        <div className="p-4 space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800">Looking up accounts</h4>
            <p className="text-sm text-gray-600 mt-1">
              Always verify customer identity using at least two identifiers before making changes.
            </p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <h4 className="font-medium text-green-800">Adding tokens</h4>
            <p className="text-sm text-gray-600 mt-1">
              Only add tokens that customers were eligible for but did not receive due to system issues.
            </p>
          </div>
          
          <div className="p-3 bg-red-50 rounded-lg border border-red-100">
            <h4 className="font-medium text-red-800">Removing tokens</h4>
            <p className="text-sm text-gray-600 mt-1">
              Token removal should only be done in cases of fraud or system error. Document all removals.
            </p>
          </div>
        </div>
      </Card>
      
      <Card title="Recent System Updates" className="mt-6">
        <div className="p-4 space-y-3">
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <h4 className="font-medium text-yellow-800">System Update</h4>
            <p className="text-sm text-gray-600 mt-1">
              Token management system will be updated tonight at 2 AM EST. Expect 15 minutes of downtime.
            </p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800">New Token Types</h4>
            <p className="text-sm text-gray-600 mt-1">
              Extra Care Birthday Rewards are now available. See knowledge base for details.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
} 