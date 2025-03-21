'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowPathIcon, PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDemo } from '../../../contexts/DemoContext';
import { CampaignAsset, OfferDetails } from '../DynamicCanvas';

interface AssetCreationWorkshopProps {
  assets: CampaignAsset[];
  offerDetails: OfferDetails;
  onUpdateDetails: (details: OfferDetails) => void;
  onRegenerate?: (assetId: string) => void;
}

const AssetCreationWorkshop: React.FC<AssetCreationWorkshopProps> = ({
  assets,
  offerDetails,
  onUpdateDetails,
  onRegenerate
}) => {
  const { clientId } = useDemo();
  const [selectedAsset, setSelectedAsset] = useState<CampaignAsset | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [editedDetails, setEditedDetails] = useState<OfferDetails>(offerDetails);
  
  // Group assets by type
  const assetsByType = assets.reduce((acc, asset) => {
    if (!acc[asset.type]) {
      acc[asset.type] = [];
    }
    acc[asset.type].push(asset);
    return acc;
  }, {} as Record<string, CampaignAsset[]>);
  
  // Get display name for asset type
  const getDisplayName = (type: string): string => {
    switch(type) {
      case 'primary':
        return 'Primary Assets';
      case 'social':
        return 'Social Media';
      case 'promotional':
        return 'Promotional Materials';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  // Handle regenerate
  const handleRegenerate = () => {
    if (selectedAsset && onRegenerate) {
      onRegenerate(selectedAsset.id);
    }
  };
  
  // Handle save customization
  const handleSaveCustomization = () => {
    onUpdateDetails(editedDetails);
    setIsCustomizing(false);
  };
  
  // Handle cancel customization
  const handleCancelCustomization = () => {
    setEditedDetails(offerDetails);
    setIsCustomizing(false);
  };
  
  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h3 className="text-xl font-semibold mb-2">Campaign Assets</h3>
        <p className="text-gray-600">
          Review and customize your campaign's creative assets before launching.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Gallery */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h4 className="text-base font-medium mb-4">Assets Gallery</h4>
            
            {/* Asset Types Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px space-x-8">
                {Object.keys(assetsByType).map(type => (
                  <button
                    key={type}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      (!selectedAsset && type === Object.keys(assetsByType)[0]) || 
                      (selectedAsset && selectedAsset.type === type)
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      // Select the first asset of this type if none selected
                      if (!selectedAsset || selectedAsset.type !== type) {
                        setSelectedAsset(assetsByType[type][0]);
                      }
                    }}
                  >
                    {getDisplayName(type)}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Asset Grid */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {selectedAsset && assetsByType[selectedAsset.type].map(asset => (
                <motion.div
                  key={asset.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                    asset.id === selectedAsset.id 
                      ? 'border-blue-500' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedAsset(asset)}
                >
                  <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                    {asset.url ? (
                      <img 
                        src={asset.url} 
                        alt={`${asset.format} asset`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-center p-4">
                        <p>Asset Preview</p>
                        <p className="text-xs">{asset.dimensions}</p>
                      </div>
                    )}
                    
                    <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs">
                      {asset.format}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Selected Asset Preview */}
          {selectedAsset && (
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-base font-medium">
                  {selectedAsset.format.charAt(0).toUpperCase() + selectedAsset.format.slice(1)} Preview
                </h4>
                <div className="flex space-x-2">
                  <button 
                    className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50"
                    onClick={handleRegenerate}
                  >
                    <ArrowPathIcon className="w-5 h-5" />
                  </button>
                  <button 
                    className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50"
                    onClick={() => {
                      setIsCustomizing(true);
                    }}
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 flex justify-center">
                <div className="max-w-full max-h-96 overflow-hidden rounded">
                  {selectedAsset.url ? (
                    <img 
                      src={selectedAsset.url} 
                      alt={`${selectedAsset.format} preview`}
                      className="max-w-full max-h-80 object-contain"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gray-200 flex items-center justify-center text-gray-400">
                      Asset Preview Placeholder
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p className="mb-1">
                  <span className="font-medium text-gray-700">Format:</span> {selectedAsset.format}
                </p>
                {selectedAsset.dimensions && (
                  <p className="mb-1">
                    <span className="font-medium text-gray-700">Dimensions:</span> {selectedAsset.dimensions}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Offer Details Panel */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 h-fit">
          <h4 className="text-base font-medium mb-4">Campaign Details</h4>
          
          {!isCustomizing ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Offer Title</p>
                <p className="font-medium">{offerDetails.title}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p>{offerDetails.description}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Discount</p>
                <p className="font-medium">{offerDetails.discount}% OFF</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Included Items</p>
                <ul className="list-disc pl-5">
                  {offerDetails.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Terms & Conditions</p>
                <p className="text-sm">{offerDetails.terms}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Promo Code</p>
                <div className="inline-block px-3 py-1 bg-gray-100 rounded font-mono">
                  {offerDetails.code}
                </div>
              </div>
              
              <button
                onClick={() => setIsCustomizing(true)}
                className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium flex items-center justify-center"
              >
                <PencilSquareIcon className="w-5 h-5 mr-2" />
                Customize Offer
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Offer Title</label>
                <input
                  type="text"
                  value={editedDetails.title}
                  onChange={(e) => setEditedDetails({...editedDetails, title: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">Description</label>
                <textarea
                  value={editedDetails.description}
                  onChange={(e) => setEditedDetails({...editedDetails, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">Discount (%)</label>
                <input
                  type="number"
                  value={editedDetails.discount}
                  onChange={(e) => setEditedDetails({...editedDetails, discount: Number(e.target.value)})}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">Included Items</label>
                <div className="space-y-2">
                  {editedDetails.items.map((item, index) => (
                    <div key={index} className="flex">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newItems = [...editedDetails.items];
                          newItems[index] = e.target.value;
                          setEditedDetails({...editedDetails, items: newItems});
                        }}
                        className="flex-1 p-2 border border-gray-300 rounded-l"
                      />
                      <button
                        onClick={() => {
                          const newItems = editedDetails.items.filter((_, i) => i !== index);
                          setEditedDetails({...editedDetails, items: newItems});
                        }}
                        className="px-3 py-2 bg-red-50 text-red-500 border border-gray-300 border-l-0 rounded-r"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setEditedDetails({...editedDetails, items: [...editedDetails.items, '']});
                    }}
                    className="w-full px-4 py-2 border border-dashed border-gray-300 rounded text-gray-500 hover:bg-gray-50"
                  >
                    + Add Item
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">Terms & Conditions</label>
                <textarea
                  value={editedDetails.terms}
                  onChange={(e) => setEditedDetails({...editedDetails, terms: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">Promo Code</label>
                <input
                  type="text"
                  value={editedDetails.code}
                  onChange={(e) => setEditedDetails({...editedDetails, code: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded font-mono"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveCustomization}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center justify-center"
                >
                  <CheckIcon className="w-5 h-5 mr-2" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancelCustomization}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center justify-center"
                >
                  <XMarkIcon className="w-5 h-5 mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetCreationWorkshop; 