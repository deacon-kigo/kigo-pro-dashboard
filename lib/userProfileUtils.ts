/**
 * User Profile Utilities
 * 
 * This file contains utilities for managing mock user profiles and generating
 * personalized content based on the current demo context.
 */

// Mock user profiles based on docs/demo/mock-users.md
export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  title: string;
  company: string;
  avatar: string;
  techProficiency: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Expert';
  painPoints: string[];
  goals: string[];
}

// Define mock users for each role and client combination
const mockUsers: Record<string, MockUser> = {
  // Merchant users
  'merchant-deacons-pizza': {
    id: 'marco-deacon',
    firstName: 'Marco',
    lastName: 'Deacon',
    role: 'Owner',
    title: 'Owner',
    company: 'Deacon\'s Pizza',
    avatar: '/avatars/marco-deacon.jpg',
    techProficiency: 'Moderate',
    painPoints: [
      'Limited time for marketing',
      'Competing with bigger chains',
      'Slow weekday dinner business'
    ],
    goals: [
      'Increase weekday sales',
      'Build customer loyalty',
      'Target local families'
    ]
  },
  'merchant-cvs': {
    id: 'jennifer-williams',
    firstName: 'Jennifer',
    lastName: 'Williams',
    role: 'Regional Marketing Director',
    title: 'Regional Marketing Director',
    company: 'CVS',
    avatar: '/avatars/jennifer-williams.jpg',
    techProficiency: 'High',
    painPoints: [
      'Coordinating campaigns across locations',
      'Maintaining brand consistency',
      'Tracking cross-channel ROI'
    ],
    goals: [
      'Increase prescription refills',
      'Drive health service traffic',
      'Improve customer retention'
    ]
  },
  'merchant-generic': {
    id: 'taylor-wong',
    firstName: 'Taylor',
    lastName: 'Wong',
    role: 'Marketing Manager',
    title: 'Marketing Manager',
    company: 'Generic Business',
    avatar: '/avatars/taylor-wong.jpg',
    techProficiency: 'Moderate',
    painPoints: [
      'Limited marketing budget',
      'Inconsistent customer data',
      'Competition in local market'
    ],
    goals: [
      'Generate new leads',
      'Increase customer value',
      'Optimize marketing spend'
    ]
  },
  
  // Support users
  'support-generic': {
    id: 'alex-chen',
    firstName: 'Alex',
    lastName: 'Chen',
    role: 'Customer Support Agent',
    title: 'Support Agent',
    company: 'Kigo',
    avatar: '/avatars/alex-chen.jpg',
    techProficiency: 'High',
    painPoints: [
      'Switching between systems',
      'Limited visibility into customer journey',
      'Manual token management'
    ],
    goals: [
      'Resolve issues quickly',
      'Improve customer satisfaction',
      'Reduce manual work'
    ]
  },
  'support-tier2': {
    id: 'sarah-johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'Senior Support Specialist',
    title: 'Senior Support Specialist',
    company: 'Kigo',
    avatar: '/avatars/sarah-johnson.jpg',
    techProficiency: 'Very High',
    painPoints: [
      'Limited technical logs',
      'Complex multi-party issues',
      'Limited admin capabilities'
    ],
    goals: [
      'Resolve complex issues',
      'Create support documentation',
      'Improve technical systems'
    ]
  },
  
  // Admin users
  'admin-generic': {
    id: 'david-garcia',
    firstName: 'David',
    lastName: 'Garcia',
    role: 'Platform Operations Manager',
    title: 'Platform Operations Manager',
    company: 'Kigo',
    avatar: '/avatars/david-garcia.jpg',
    techProficiency: 'Expert',
    painPoints: [
      'Lack of proactive monitoring',
      'Manual verification processes',
      'Limited bulk operations'
    ],
    goals: [
      'Ensure platform health',
      'Streamline merchant management',
      'Automate routine tasks'
    ]
  },
  'admin-analytics': {
    id: 'jane-foster',
    firstName: 'Jane',
    lastName: 'Foster',
    role: 'Marketing Analytics Director',
    title: 'Analytics Director',
    company: 'Kigo',
    avatar: '/avatars/jane-foster.jpg',
    techProficiency: 'Expert',
    painPoints: [
      'Data inconsistency across sources',
      'Limited reporting customization',
      'Tracking customer journeys'
    ],
    goals: [
      'Analyze platform metrics',
      'Identify growth opportunities',
      'Create executive reports'
    ]
  }
};

/**
 * Get the mock user based on role and client
 */
export function getUserForContext(role: string, clientId: string): MockUser {
  // Special case for admin analytics scenario
  if (role === 'admin' && clientId === 'generic' && Math.random() > 0.5) {
    return mockUsers['admin-analytics'];
  }
  
  // Try to find an exact match
  const key = `${role}-${clientId}`;
  if (mockUsers[key]) {
    return mockUsers[key];
  }
  
  // Fall back to generic user for the role
  const genericKey = `${role}-generic`;
  if (mockUsers[genericKey]) {
    return mockUsers[genericKey];
  }
  
  // Ultimate fallback
  return mockUsers['merchant-generic'];
}

/**
 * Get a greeting based on the time of day
 */
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

/**
 * Get personalized content suggestions based on user profile
 */
export function getPersonalizedSuggestions(user: MockUser): string[] {
  const suggestions: string[] = [];
  
  // Based on technical proficiency
  if (user.techProficiency === 'Low' || user.techProficiency === 'Moderate') {
    suggestions.push('Try our guided campaign setup for a simpler experience.');
  } else if (user.techProficiency === 'High' || user.techProficiency === 'Expert') {
    suggestions.push('Use our advanced segmentation tools for targeted campaigns.');
  }
  
  // Based on role
  if (user.role.includes('Owner') || user.role.includes('Manager')) {
    suggestions.push('Check the ROI dashboard for your recent campaigns.');
  } else if (user.role.includes('Support')) {
    suggestions.push('Review recent customer tickets requiring attention.');
  } else if (user.role.includes('Analytics')) {
    suggestions.push('Export the latest customer segmentation data for your report.');
  }
  
  // Generic fallbacks
  suggestions.push('View your performance metrics for this week.');
  suggestions.push('Try our new AI-powered campaign recommendation tool.');
  
  return suggestions;
}

/**
 * Get a welcome back message based on user history and time
 */
export function getWelcomeBackMessage(user: MockUser): string {
  const hour = new Date().getHours();
  const dayOfWeek = new Date().getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  if (isWeekend) {
    return `Working on the weekend, ${user.firstName}? Your dedication is impressive!`;
  } else if (hour < 9) {
    return `You're an early bird today, ${user.firstName}! Ready to get ahead?`;
  } else if (hour > 18) {
    return `Putting in some extra hours tonight, ${user.firstName}?`;
  } else {
    return `Welcome back, ${user.firstName}! Hope you're having a productive day.`;
  }
} 