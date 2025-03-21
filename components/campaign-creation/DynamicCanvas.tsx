'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemo } from '../../contexts/DemoContext';

// Importing views statically to fix module not found errors
import BusinessIntelligenceView from './views/BusinessIntelligenceView';
import CampaignSelectionGallery from './views/CampaignSelectionGallery';
import AssetCreationWorkshop from './views/AssetCreationWorkshop';
import PerformancePredictionDashboard from './views/PerformancePredictionDashboard';
import LaunchControlCenter from './views/LaunchControlCenter';

// Type Definitions
export interface BusinessData {
  salesByDay: { [key: string]: number };
  performanceTrend: Array<{
    week: string;
    sales: number;
    orders: number;
  }>;
  competitorActivity: Array<{
    month: string;
    ourPromos: number;
    competitorPromos: number;
  }>;
  customerSegments: Array<{
    segment: string;
    value: number;
  }>;
  insights: {
    salesByDay: string;
    performanceTrend: string;
    competitorActivity: string;
    customerSegments: string;
  };
  marketingOpportunities: Array<{
    title: string;
    description: string;
    impact: string;
    difficulty: string;
  }>;
}

export interface CampaignOption {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  primaryImage: string;
  estimatedReach: {
    min: number;
    max: number;
  };
  conversionRate: {
    min: number;
    max: number;
  };
  recommended: boolean;
}

export interface CampaignAsset {
  id: string;
  type: 'primary' | 'social' | 'promotional';
  format: string;
  url: string;
  dimensions?: string;
  placeholder?: string;
}

export interface OfferDetails {
  title: string;
  description: string;
  discount: number;
  items: string[];
  terms: string;
  code: string;
}

export interface PerformancePredictions {
  views: {
    min: number;
    max: number;
  };
  viewsTrend: number;
  redemptions: {
    min: number;
    max: number;
  };
  redemptionsTrend: number;
  revenue: {
    min: number;
    max: number;
  };
  revenueTrend: number;
  costPerAcquisition: {
    min: number;
    max: number;
  };
  costTrend: number;
  revenueTimeline: Array<{
    date: string;
    withCampaign: number;
    withoutCampaign: number;
  }>;
  customerFlow: Array<{
    stage: string;
    count: number;
  }>;
  competitiveComparison: Array<{
    metric: string;
    value: number;
    benchmark: number;
  }>;
  suggestions: Array<{
    id: string;
    title: string;
    description: string;
    impact: number;
  }>;
}

type ViewType = 
  'business-intelligence' | 
  'campaign-selection' | 
  'asset-creation' | 
  'performance-prediction' | 
  'launch-control';

interface DynamicCanvasProps {
  initialView?: ViewType;
}

const DynamicCanvas: React.FC<DynamicCanvasProps> = ({ initialView = 'business-intelligence' }) => {
  const { clientId } = useDemo();
  const [currentView, setCurrentView] = useState<ViewType>(initialView);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignOption | null>(null);
  const [campaignAssets, setCampaignAssets] = useState<CampaignAsset[]>([]);
  const [offerDetails, setOfferDetails] = useState<OfferDetails>({
    title: '',
    description: '',
    discount: 0,
    items: [],
    terms: '',
    code: ''
  });
  const [campaignParams, setCampaignParams] = useState({
    targeting: {
      audience: 'Families within 5 miles',
      radius: 5,
      days: ['monday', 'tuesday', 'wednesday', 'thursday'],
      timeRange: '4pm-8pm'
    },
    schedule: {
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
      endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000), // One month after start
      duration: 30
    },
    offerDetails: {
      name: 'Family Dinner Special',
      price: 29.99,
      items: ['Large Pizza', 'Breadsticks', '2-Liter Soda'],
      discountPercentage: 20
    }
  });
  
  // Step numbers for visual reference
  const viewSteps: { [key in ViewType]: number } = {
    'business-intelligence': 1,
    'campaign-selection': 2,
    'asset-creation': 3,
    'performance-prediction': 4,
    'launch-control': 5
  };
  
  // Mock business data for Deacon's Pizza
  const mockBusinessData: BusinessData = {
    salesByDay: {
      'Monday': 1200,
      'Tuesday': 1350,
      'Wednesday': 1500,
      'Thursday': 1800,
      'Friday': 3200,
      'Saturday': 3800,
      'Sunday': 2500
    },
    performanceTrend: [
      { week: 'Week 1', sales: 12000, orders: 450 },
      { week: 'Week 2', sales: 13500, orders: 470 },
      { week: 'Week 3', sales: 11000, orders: 410 },
      { week: 'Week 4', sales: 14500, orders: 510 },
      { week: 'Week 5', sales: 15200, orders: 550 }
    ],
    competitorActivity: [
      { month: 'Jan', ourPromos: 2, competitorPromos: 3 },
      { month: 'Feb', ourPromos: 1, competitorPromos: 4 },
      { month: 'Mar', ourPromos: 3, competitorPromos: 2 },
      { month: 'Apr', ourPromos: 2, competitorPromos: 5 },
      { month: 'May', ourPromos: 1, competitorPromos: 6 }
    ],
    customerSegments: [
      { segment: 'Families', value: 45 },
      { segment: 'Singles', value: 25 },
      { segment: 'Students', value: 15 },
      { segment: 'Seniors', value: 15 }
    ],
    insights: {
      salesByDay: "Your weekday dinner sales (Mon-Thu) are significantly lower than weekend sales. This presents an opportunity for a targeted promotion.",
      performanceTrend: "There's a noticeable dip in the middle of each month. A targeted promotion during this period could help smooth revenue.",
      competitorActivity: "Competitors are increasing promotional activity, especially chain restaurants. A unique offer could help differentiate your business.",
      customerSegments: "Families represent your largest customer segment but could be targeted more effectively during weekdays."
    },
    marketingOpportunities: [
      {
        title: "Weekday Family Dinner Special",
        description: "Create a special family meal deal valid Monday-Thursday to drive traffic during slower weekdays",
        impact: "High",
        difficulty: "Low"
      },
      {
        title: "Student Discount Program",
        description: "Partner with local colleges to offer exclusive discounts to students during non-peak hours",
        impact: "Medium",
        difficulty: "Medium"
      },
      {
        title: "Loyalty Program Enhancement",
        description: "Add special bonuses for customers who visit during traditionally slower periods",
        impact: "High",
        difficulty: "Medium"
      }
    ]
  };
  
  // Mock campaign options
  const mockCampaignOptions: CampaignOption[] = [
    {
      id: 'family-weekday-deal',
      name: 'Family Weekday Special',
      description: 'Boost your weekday dinner sales with this family-focused promotion, offering a complete meal at a special price.',
      targetAudience: 'Families within 5 miles',
      primaryImage: '/campaigns/family-special.jpg',
      estimatedReach: { min: 3500, max: 5000 },
      conversionRate: { min: 2.5, max: 4.2 },
      recommended: true
    },
    {
      id: 'two-for-tuesday',
      name: 'Two-for-Tuesday Deal',
      description: 'Drive traffic on your slowest day with a buy-one-get-one pizza offer that\'s hard to resist.',
      targetAudience: 'Value-seeking customers',
      primaryImage: '/campaigns/two-for-tuesday.jpg',
      estimatedReach: { min: 2800, max: 4200 },
      conversionRate: { min: 3.0, max: 5.5 },
      recommended: false
    },
    {
      id: 'lunch-rush-special',
      name: 'Lunch Rush Special',
      description: 'Capture the lunch crowd with a quick-service personal pizza and drink combo at a competitive price.',
      targetAudience: 'Office workers, students',
      primaryImage: '/campaigns/lunch-special.jpg',
      estimatedReach: { min: 4000, max: 6500 },
      conversionRate: { min: 1.8, max: 3.2 },
      recommended: false
    }
  ];
  
  // Mock campaign assets
  const mockCampaignAssets: CampaignAsset[] = [
    {
      id: 'primary-banner',
      type: 'primary',
      format: 'banner',
      url: '/assets/family-banner.jpg',
      dimensions: '1200x600'
    },
    {
      id: 'primary-square',
      type: 'primary',
      format: 'square',
      url: '/assets/family-square.jpg',
      dimensions: '800x800'
    },
    {
      id: 'social-facebook',
      type: 'social',
      format: 'facebook',
      url: '/assets/family-facebook.jpg',
      dimensions: '1200x630'
    },
    {
      id: 'social-instagram',
      type: 'social',
      format: 'instagram',
      url: '/assets/family-instagram.jpg',
      dimensions: '1080x1080'
    },
    {
      id: 'promotional-email',
      type: 'promotional',
      format: 'email',
      url: '/assets/family-email.jpg',
      dimensions: '600x300'
    }
  ];
  
  // Mock offer details
  const mockOfferDetails: OfferDetails = {
    title: 'Family Weekday Special',
    description: 'Get a large 2-topping pizza, breadsticks, and a 2-liter soda for just $24.99',
    discount: 20,
    items: ['Large 2-topping pizza', 'Order of breadsticks', '2-liter soda'],
    terms: 'Valid Monday-Thursday from 4pm-8pm. Not valid with other offers.',
    code: 'FAMILY24'
  };
  
  // Mock performance predictions
  const mockPerformancePredictions: PerformancePredictions = {
    views: { min: 3500, max: 5000 },
    viewsTrend: 15,
    redemptions: { min: 175, max: 250 },
    redemptionsTrend: 22,
    revenue: { min: 4375, max: 6250 },
    revenueTrend: 18,
    costPerAcquisition: { min: 3.50, max: 5.00 },
    costTrend: -12,
    revenueTimeline: [
      { date: 'Week 1', withCampaign: 1500, withoutCampaign: 1200 },
      { date: 'Week 2', withCampaign: 1650, withoutCampaign: 1250 },
      { date: 'Week 3', withCampaign: 1700, withoutCampaign: 1200 },
      { date: 'Week 4', withCampaign: 1800, withoutCampaign: 1300 }
    ],
    customerFlow: [
      { stage: 'Views', count: 4000 },
      { stage: 'Clicks', count: 800 },
      { stage: 'Redemptions', count: 200 },
      { stage: 'Repeat Customers', count: 60 }
    ],
    competitiveComparison: [
      { metric: 'Click Rate', value: 20, benchmark: 15 },
      { metric: 'Conversion', value: 25, benchmark: 18 },
      { metric: 'ROI', value: 320, benchmark: 250 }
    ],
    suggestions: [
      {
        id: 'add-friday',
        title: 'Include Friday Evening',
        description: 'Expand your promotion to include Friday 4-6pm (before peak dinner)',
        impact: 15
      },
      {
        id: 'increase-radius',
        title: 'Expand Geographic Targeting',
        description: 'Increase radius from 5 to 7 miles to capture more potential customers',
        impact: 22
      }
    ]
  };
  
  // Mock launch details
  const mockLaunchDetails = {
    name: 'Family Weekday Special',
    targetAudience: 'Families within 5 miles',
    geographicReach: '5 mile radius from store',
    schedule: {
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000),
      activeDays: ['monday', 'tuesday', 'wednesday', 'thursday']
    },
    budget: {
      total: 750,
      dailyAverage: 25
    },
    assets: [
      { type: 'Banner Ad', url: '/assets/family-banner.jpg', status: 'ready' as 'ready' | 'pending' | 'failed' },
      { type: 'Facebook Post', url: '/assets/family-facebook.jpg', status: 'ready' as 'ready' | 'pending' | 'failed' },
      { type: 'Instagram Post', url: '/assets/family-instagram.jpg', status: 'ready' as 'ready' | 'pending' | 'failed' },
      { type: 'Email Template', url: '/assets/family-email.jpg', status: 'ready' as 'ready' | 'pending' | 'failed' },
      { type: 'SMS Message', url: '', status: 'pending' as 'ready' | 'pending' | 'failed' }
    ],
    metrics: {
      estimatedReach: { min: 3500, max: 5000 },
      predictedEngagement: { min: 700, max: 1000 },
      estimatedRedemptions: { min: 175, max: 250 }
    }
  };
  
  // Handle campaign selection
  const handleCampaignSelect = (campaign: CampaignOption) => {
    setSelectedCampaign(campaign);
    setCampaignAssets(mockCampaignAssets);
    setOfferDetails(mockOfferDetails);
    setCurrentView('asset-creation');
  };
  
  // Handle parameter updates for performance prediction
  const handleParamUpdate = (key: string, value: any) => {
    const keyParts = key.split('.');
    
    if (keyParts.length === 2) {
      const [category, param] = keyParts;
      setCampaignParams(prev => ({
        ...prev,
        [category]: {
          ...prev[category as keyof typeof prev],
          [param]: value
        }
      }));
    }
  };
  
  // Handle campaign launch
  const handleLaunch = () => {
    console.log('Campaign launched!');
    // In a real app, this would submit the campaign for processing
  };
  
  // Function to get view title
  const getViewTitle = (view: ViewType): string => {
    switch(view) {
      case 'business-intelligence':
        return 'Business Intelligence';
      case 'campaign-selection':
        return 'Campaign Options';
      case 'asset-creation':
        return 'Creative Assets';
      case 'performance-prediction':
        return 'Performance Predictions';
      case 'launch-control':
        return 'Launch Control';
    }
  };
  
  // Animation variants
  const viewVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };
  
  return (
    <div className="h-full flex flex-col">
      <CanvasHeader 
        title={getViewTitle(currentView)} 
        currentStep={viewSteps[currentView]} 
        totalSteps={5}
      />
      
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={viewVariants}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {currentView === 'business-intelligence' && (
              <BusinessIntelligenceView 
                data={mockBusinessData}
              />
            )}
            
            {currentView === 'campaign-selection' && (
              <CampaignSelectionGallery 
                options={mockCampaignOptions}
                onSelect={handleCampaignSelect}
              />
            )}
            
            {currentView === 'asset-creation' && selectedCampaign && (
              <AssetCreationWorkshop 
                assets={campaignAssets}
                offerDetails={offerDetails}
                onUpdateDetails={(updatedDetails: OfferDetails) => setOfferDetails(updatedDetails)}
                onRegenerate={(assetId: string) => console.log('Regenerate asset', assetId)}
              />
            )}
            
            {currentView === 'performance-prediction' && (
              <PerformancePredictionDashboard 
                predictions={mockPerformancePredictions}
                campaignParams={campaignParams}
                onUpdateParams={handleParamUpdate}
              />
            )}
            
            {currentView === 'launch-control' && (
              <LaunchControlCenter 
                campaignDetails={mockLaunchDetails}
                onLaunch={handleLaunch}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="p-4 flex justify-between border-t border-gray-200">
        <button
          onClick={() => {
            const views: ViewType[] = ['business-intelligence', 'campaign-selection', 'asset-creation', 'performance-prediction', 'launch-control'];
            const currentIndex = views.indexOf(currentView);
            
            if (currentIndex > 0) {
              setCurrentView(views[currentIndex - 1]);
            }
          }}
          disabled={currentView === 'business-intelligence'}
          className={`px-4 py-2 rounded-lg ${
            currentView === 'business-intelligence'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Previous Step
        </button>
        
        <button
          onClick={() => {
            const views: ViewType[] = ['business-intelligence', 'campaign-selection', 'asset-creation', 'performance-prediction', 'launch-control'];
            const currentIndex = views.indexOf(currentView);
            
            if (currentIndex < views.length - 1) {
              setCurrentView(views[currentIndex + 1]);
            }
          }}
          disabled={currentView === 'launch-control'}
          className={`px-4 py-2 rounded-lg ${
            currentView === 'launch-control'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

// Header component for the canvas
const CanvasHeader: React.FC<{
  title: string;
  currentStep: number;
  totalSteps: number;
}> = ({ title, currentStep, totalSteps }) => {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
      </div>
      
      <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default DynamicCanvas; 