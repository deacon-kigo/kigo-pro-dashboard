'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { useDemoState } from '@/lib/redux/hooks';
import { CampaignOption } from '../DynamicCanvas';

interface CampaignSelectionGalleryProps {
  options: CampaignOption[];
  onSelect: (campaign: CampaignOption) => void;
}

const CampaignSelectionGallery: React.FC<CampaignSelectionGalleryProps> = ({ 
  options,
  onSelect
}) => {
  const { clientId } = useDemoState();
  const galleryRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Check scroll possibilities
  const checkScroll = () => {
    if (!galleryRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = galleryRef.current;
    
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10); // 10px buffer
  };
  
  // Handle scroll buttons
  const handleScroll = (direction: 'left' | 'right') => {
    if (!galleryRef.current) return;
    
    const scrollAmount = 320; // Approximately the width of a card + margin
    const currentScroll = galleryRef.current.scrollLeft;
    
    galleryRef.current.scrollTo({
      left: direction === 'right' ? currentScroll + scrollAmount : currentScroll - scrollAmount,
      behavior: 'smooth'
    });
  };
  
  // Add scroll event listener to update button states
  useEffect(() => {
    const gallery = galleryRef.current;
    if (gallery) {
      gallery.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      
      return () => gallery.removeEventListener('scroll', checkScroll);
    }
  }, []);
  
  // Also check scroll on window resize
  useEffect(() => {
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);
  
  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex-shrink-0"
      >
        <h3 className="text-xl font-semibold mb-2">Campaign Options</h3>
        <p className="text-gray-600">
          {clientId === 'deacons-pizza' 
            ? "I've analyzed Deacon's Pizza data and created these campaign options tailored to boost your weekday sales."
            : "I've analyzed your business data and created these campaign options tailored to your specific needs."}
        </p>
      </motion.div>
      
      {/* Campaign Gallery with embedded navigation buttons */}
      <div className="relative flex-shrink-0 mb-4">
        {/* Left navigation button */}
        <button 
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center ${
            canScrollLeft 
              ? 'bg-white text-gray-700 shadow-md hover:bg-gray-100' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          style={{ transform: 'translateY(-50%)', marginLeft: '-5px' }}
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        
        {/* Right navigation button */}
        <button 
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center ${
            canScrollRight 
              ? 'bg-white text-gray-700 shadow-md hover:bg-gray-100' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          style={{ transform: 'translateY(-50%)', marginRight: '-5px' }}
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
        
        {/* Campaign cards row */}
        <div 
          ref={galleryRef}
          className="flex overflow-x-auto pb-4 gap-6 hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {options.map((campaign) => (
            <CampaignCard 
              key={campaign.id}
              campaign={campaign}
              onSelect={() => onSelect(campaign)}
            />
          ))}
        </div>
      </div>
      
      {/* Description Section */}
      <div className="mt-auto pt-6 border-t border-gray-200 flex-shrink-0">
        <h4 className="text-base font-medium mb-3">Recommended Approach</h4>
        <p className="text-gray-600 mb-4">
          {clientId === 'deacons-pizza' 
            ? "Based on your business data, focusing on weekday dinner promotions targeting families would provide the most immediate impact. The 'Family Weekday Special' is designed to drive traffic during your slower periods and appeal to your largest customer segment."
            : "Based on your business data, we've tailored these campaigns to address your specific challenges and opportunities. Each option is designed to maximize engagement while staying aligned with your brand identity."}
        </p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <SparklesIcon className="w-5 h-5 text-blue-500 mt-0.5" />
            </div>
            <div className="ml-3">
              <h5 className="text-sm font-medium text-blue-700 mb-1">AI Strategy Insight</h5>
              <p className="text-sm text-blue-600">
                The most effective local campaigns combine specific audience targeting, compelling offers with clear value propositions, and consistent timing. Select a campaign that addresses your current business challenges while providing room for optimization over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Campaign Card Component
const CampaignCard: React.FC<{
  campaign: CampaignOption;
  onSelect: () => void;
}> = ({ campaign, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="flex-shrink-0 w-[300px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Image */}
      <div className="h-40 bg-gray-100 relative">
        {campaign.primaryImage && !imageError ? (
          <img 
            src={campaign.primaryImage} 
            alt={campaign.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            {campaign.name}
          </div>
        )}
        
        {campaign.recommended && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
            Recommended
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold mb-2 text-gray-900">{campaign.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
          <div>
            <p className="mb-1">Estimated Reach</p>
            <p className="font-medium text-gray-700">
              {campaign.estimatedReach.min.toLocaleString()}-{campaign.estimatedReach.max.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="mb-1">Conversion Rate</p>
            <p className="font-medium text-gray-700">
              {campaign.conversionRate.min}%-{campaign.conversionRate.max}%
            </p>
          </div>
        </div>
        
        <button
          onClick={onSelect}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Select Campaign
        </button>
      </div>
    </motion.div>
  );
};

export default CampaignSelectionGallery; 