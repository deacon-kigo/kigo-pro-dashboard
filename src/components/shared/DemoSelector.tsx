import React from 'react';
import { useDemo } from '../../contexts/DemoContext';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import demoConfigs from '../../config/demoConfigs';

export default function DemoSelector() {
  const { role, scenario, clientId } = useDemo();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Create a new URLSearchParams instance
    const params = new URLSearchParams(searchParams.toString());
    
    // Update the parameter
    params.set(name, value);
    
    // Navigate to the new URL
    router.push(`${pathname}?${params.toString()}`);
  };
  
  return (
    <div className="demo-selector fixed bottom-4 right-4 bg-white shadow-lg p-4 rounded-lg z-50 border border-gray-200 w-64">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Demo Configuration</h3>
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Demo Mode</span>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Role:</label>
          <select 
            name="role" 
            value={role} 
            onChange={handleChange}
            className="w-full text-sm border border-gray-300 rounded-md p-1.5"
          >
            <option value="merchant">Merchant</option>
            <option value="support">Support Agent</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs text-gray-500 mb-1">Scenario:</label>
          <select 
            name="scenario" 
            value={scenario} 
            onChange={handleChange}
            className="w-full text-sm border border-gray-300 rounded-md p-1.5"
          >
            {Object.entries(demoConfigs.scenarios).map(([key, config]) => (
              <option key={key} value={key}>{config.title}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs text-gray-500 mb-1">Client:</label>
          <select 
            name="client" 
            value={clientId} 
            onChange={handleChange}
            className="w-full text-sm border border-gray-300 rounded-md p-1.5"
          >
            {Object.entries(demoConfigs.clients).map(([key, client]) => (
              <option key={key} value={key}>{client.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
        <strong>Current Demo:</strong> {demoConfigs.scenarios[scenario]?.title} - {demoConfigs.clients[clientId]?.name}
      </div>
    </div>
  );
} 