'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemo } from '../../contexts/DemoContext';
import { useRouter } from 'next/navigation';
import ReactConfetti from 'react-confetti';

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
  budget?: {
    total: number;
    dailyAverage?: number;
  };
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
  const router = useRouter();
  const [currentView, setCurrentView] = useState<ViewType>(initialView);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignOption | null>(null);
  const [campaignAssets, setCampaignAssets] = useState<CampaignAsset[]>([]);
  const [offerDetails, setOfferDetails] = useState<OfferDetails>({
    title: '',
    description: '',
    discount: 0,
    items: [],
    terms: '',
    code: '',
    budget: {
      total: 750,
      dailyAverage: 25
    }
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
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
      salesByDay: "Weekday dinner sales (Mon-Thu) are 55% lower than weekends. Perfect opportunity for targeted promotion.",
      performanceTrend: "Monthly dip noted. Timely promotion could smooth revenue curve.",
      competitorActivity: "Competitor promos increasing. Unique offer needed to stand out.",
      customerSegments: "Families: 45% of weekend customers, only 22% of weekdays. Major opportunity."
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
      primaryImage: '/images/pizza 1.png',
      estimatedReach: { min: 3500, max: 5000 },
      conversionRate: { min: 2.5, max: 4.2 },
      recommended: true
    },
    {
      id: 'two-for-tuesday',
      name: 'Two-for-Tuesday Deal',
      description: 'Drive traffic on your slowest day with a buy-one-get-one pizza offer that\'s hard to resist.',
      targetAudience: 'Value-seeking customers',
      primaryImage: '/images/pizza 2.png',
      estimatedReach: { min: 2800, max: 4200 },
      conversionRate: { min: 3.0, max: 5.5 },
      recommended: false
    },
    {
      id: 'lunch-rush-special',
      name: 'Lunch Rush Special',
      description: 'Capture the lunch crowd with a quick-service personal pizza and drink combo at a competitive price.',
      targetAudience: 'Office workers, students',
      primaryImage: '/images/pizza 3.png',
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
      url: '/images/pizza 1.png',
      dimensions: '1200x600'
    },
    {
      id: 'primary-square',
      type: 'primary',
      format: 'square',
      url: '/images/pizza 2.png',
      dimensions: '800x800'
    },
    {
      id: 'social-facebook',
      type: 'social',
      format: 'facebook',
      url: '/images/pizza promo 1.png',
      dimensions: '1200x630',
      placeholder: 'Family dinner time just got better! 20% OFF our Family Weekday Special. Use code FAMILY24 at checkout.'
    },
    {
      id: 'social-instagram',
      type: 'social',
      format: 'instagram',
      url: '/images/pizza promo 2.png',
      dimensions: '1080x1080',
      placeholder: 'Make weeknights special with our Family Dinner Deal! 🍕 Limited time offer - 20% OFF! #DeaconsPizza #FamilyDinner'
    },
    {
      id: 'promotional-email',
      type: 'promotional',
      format: 'email',
      url: '/images/pizza 3.png',
      dimensions: '600x300',
      placeholder: `Subject: Weeknight Family Dinner Made Easy - 20% OFF Special Deal!

Dear Valued Customer,

Weeknights just got more delicious! Introducing our Family Weekday Special - the perfect dinner solution for busy families.

🍕 Large 2-topping pizza
🥖 Fresh-baked breadsticks
🥤 2-liter soda

All for just $24.99 (20% savings!)
Use code: FAMILY24 at checkout

Valid Monday-Thursday from 4pm-8pm. 
Order online or call us at (555) 123-4567.

Enjoy!
Deacon's Pizza Team`
    }
  ];
  
  // Mock offer details
  const mockOfferDetails: OfferDetails = {
    title: 'Family Weekday Special',
    description: 'Get a large 2-topping pizza, breadsticks, and a 2-liter soda for just $24.99',
    discount: 20,
    items: ['Large 2-topping pizza', 'Order of breadsticks', '2-liter soda'],
    terms: 'Valid Monday-Thursday from 4pm-8pm. Not valid with other offers.',
    code: 'FAMILY24',
    budget: {
      total: 750,
      dailyAverage: 25
    }
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
      { type: 'Banner Ad', url: '/images/pizza 1.png', status: 'ready' as 'ready' | 'pending' | 'failed' },
      { type: 'Facebook Post', url: '/images/pizza promo 1.png', status: 'ready' as 'ready' | 'pending' | 'failed' },
      { type: 'Instagram Post', url: '/images/pizza promo 2.png', status: 'ready' as 'ready' | 'pending' | 'failed' },
      { type: 'Email Template', url: '/images/pizza 3.png', status: 'ready' as 'ready' | 'pending' | 'failed' },
      { type: 'SMS Message', url: '', status: 'pending' as 'ready' | 'pending' | 'failed' }
    ],
    metrics: {
      estimatedReach: { min: 3500, max: 5000 },
      predictedEngagement: { min: 700, max: 1000 },
      estimatedRedemptions: { min: 175, max: 250 }
    }
  };
  
  // Get window size for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);
  
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
    
    // Show confetti
    setShowConfetti(true);
    
    // Wait a bit then redirect to dashboard with new campaign added
    setTimeout(() => {
      router.push('/demos/deacons-pizza?from=campaign-launch');
    }, 3000);
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
        return 'Performance Analysis';
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
    <div className="h-full flex flex-col overflow-hidden">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
        />
      )}
      
      <CanvasHeader 
        title={getViewTitle(currentView)} 
        currentStep={viewSteps[currentView]} 
        totalSteps={5}
        className="flex-shrink-0"
      />
      
      <div className="flex-1 overflow-y-auto">
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
      
      <div className="p-4 flex justify-between border-t border-gray-200 flex-shrink-0">
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
  className?: string;
}> = ({ title, currentStep, totalSteps, className }) => {
  return (
    <div className={`px-6 py-3 border-b border-gray-200 ${className || ''}`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm">Step {currentStep} of {totalSteps}</span>
      </div>
      
      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-300 ease-in-out"
          style={{ 
            width: `${(currentStep / totalSteps) * 100}%`,
            background: 'linear-gradient(to right, #4460F0, #9F7AEA)'
          }}
        ></div>
      </div>
    </div>
  );
};

export default DynamicCanvas; 