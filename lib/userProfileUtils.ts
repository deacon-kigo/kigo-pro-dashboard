/**
 * User Profile Utilities
 * 
 * This file contains utilities for managing mock user profiles and generating
 * personalized content based on the current demo context.
 */

import { UserProfile } from '@/types/demo';

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
 * Get a specific user profile based on role and client
 */
export function getUserForContext(role: string, clientId: string): UserProfile {
  interface UserProfiles {
    [role: string]: {
      [client: string]: UserProfile;
    };
  }

  const users: UserProfiles = {
    merchant: {
      'deacons-pizza': {
        name: 'Marco Deacon',
        role: 'Owner',
        businessName: 'Deacon\'s Pizza',
        avatar: '/images/avatars/marco-deacon.jpg',
        technicalProficiency: 'moderate',
        goals: ['Increase customer loyalty', 'Streamline operations', 'Expand to new locations'],
        painPoints: ['Limited time for marketing', 'Competition from national chains', 'Staff turnover']
      },
      'cvs': {
        name: 'Jennifer Williams',
        role: 'Regional Marketing Director',
        businessName: 'CVS Pharmacy',
        avatar: '/images/avatars/jennifer-williams.jpg',
        technicalProficiency: 'high',
        goals: ['Improve customer retention', 'Coordinate multi-location campaigns', 'Increase prescriptions filled'],
        painPoints: ['Complex approval processes', 'Inconsistent results across locations', 'Compliance requirements']
      },
      'default': {
        name: 'Sam Merchant',
        role: 'Owner',
        businessName: 'Local Business',
        avatar: '/images/avatars/default-merchant.jpg',
        technicalProficiency: 'moderate',
        goals: ['Grow customer base', 'Increase revenue', 'Improve efficiency'],
        painPoints: ['Limited marketing budget', 'Competition', 'Time constraints']
      }
    },
    support: {
      'default': {
        name: 'Alex Chen',
        role: 'Customer Support Agent',
        businessName: 'Kigo',
        avatar: '/images/avatars/alex-chen.jpg',
        technicalProficiency: 'high',
        goals: ['Resolve issues quickly', 'Improve customer satisfaction', 'Reduce ticket volume'],
        painPoints: ['Complex customer issues', 'Limited documentation', 'System limitations']
      },
      'tier2': {
        name: 'Sarah Johnson',
        role: 'Senior Support Specialist',
        businessName: 'Kigo',
        avatar: '/images/avatars/sarah-johnson.jpg',
        technicalProficiency: 'very high',
        goals: ['Solve complex technical issues', 'Support tier 1 agents', 'Improve system reliability'],
        painPoints: ['Escalating bugs', 'Client-specific customizations', 'Time-sensitive requests']
      }
    },
    admin: {
      'default': {
        name: 'David Garcia',
        role: 'Platform Operations Manager',
        businessName: 'Kigo',
        avatar: '/images/avatars/david-garcia.jpg',
        technicalProficiency: 'expert',
        goals: ['Ensure system stability', 'Improve merchant onboarding', 'Reduce support tickets'],
        painPoints: ['System scaling challenges', 'Security concerns', 'Performance optimization']
      },
      'analytics': {
        name: 'Jane Foster',
        role: 'Marketing Analytics Director',
        businessName: 'Kigo',
        avatar: '/images/avatars/jane-foster.jpg',
        technicalProficiency: 'expert',
        goals: ['Improve campaign performance', 'Identify growth opportunities', 'Optimize customer engagement'],
        painPoints: ['Data inconsistencies', 'Complex reporting needs', 'Integration challenges']
      }
    }
  };

  // Get the specified user or default for that role
  const roleUsers = users[role] || users.merchant;
  return (roleUsers[clientId] || roleUsers.default);
}

/**
 * Get a greeting based on the time of day
 */
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

/**
 * Get personalized content suggestions based on user profile
 */
export function getPersonalizedSuggestions(userProfile?: UserProfile): string[] {
  if (!userProfile) {
    return [
      "Create your first campaign",
      "Set up your account preferences",
      "Explore the analytics dashboard"
    ];
  }

  // Base suggestions on role
  const roleSuggestions: Record<string, string[]> = {
    'Owner': [
      "Create a new loyalty campaign",
      "Review your weekly performance report",
      "Set up automatic customer targeting"
    ],
    'Regional Marketing Director': [
      "Compare performance across locations",
      "Create a regional marketing campaign",
      "Review compliance settings for all stores"
    ],
    'Customer Support Agent': [
      "View open support tickets",
      "Check knowledge base updates",
      "Review merchant onboarding status"
    ],
    'Senior Support Specialist': [
      "Check system health dashboard",
      "Review escalated technical issues",
      "Audit recent merchant configurations"
    ],
    'Platform Operations Manager': [
      "Review system performance metrics",
      "Check new merchant applications",
      "View security alert dashboard"
    ],
    'Marketing Analytics Director': [
      "Review campaign performance metrics",
      "Analyze customer engagement trends",
      "Generate executive summary report"
    ]
  };

  // Get role-specific suggestions or defaults
  const suggestions = roleSuggestions[userProfile.role] || [
    "Review your dashboard",
    "Update your account settings",
    "Explore new features"
  ];

  // Add goal-related suggestions
  if (userProfile.goals && userProfile.goals.length > 0) {
    const randomGoal = userProfile.goals[Math.floor(Math.random() * userProfile.goals.length)];
    suggestions.push(`Goal: ${randomGoal}`);
  }

  // Add tech-level appropriate suggestions
  if (userProfile.technicalProficiency === 'high' || userProfile.technicalProficiency === 'expert') {
    suggestions.push("Configure API integration settings");
  } else if (userProfile.technicalProficiency === 'moderate') {
    suggestions.push("Try our guided campaign creator");
  } else {
    suggestions.push("View beginner-friendly tutorials");
  }

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

// Generate personalized greeting
export function getPersonalizedGreeting(userProfile?: UserProfile): string {
  if (!userProfile) {
    return "Welcome";
  }
  
  const timeGreeting = getTimeBasedGreeting();
  return `${timeGreeting}, ${userProfile.name.split(' ')[0]}`;
} 