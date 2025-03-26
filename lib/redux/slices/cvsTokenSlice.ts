import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Tier level for token support
export type SupportTier = 'Tier1' | 'Tier2';

// Ticket status options
export type TicketStatus = 'Open' | 'In Progress' | 'Escalated' | 'Resolved' | 'Closed';

// Ticket priority levels
export type TicketPriority = 'Low' | 'Medium' | 'High';

// Ticket integration with CVS support system
export interface TicketInfo {
  id: string;
  customerId: string;
  tokenId?: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdDate: string;
  updatedDate: string;
  assignedTo?: string;
  tier: SupportTier;
  notes?: string[];
  resolutionSummary?: string;
}

// Types for the token management interface
export interface TokenInfo {
  id: string;
  name: string;
  description: string;
  type: 'Coupon' | 'Reward' | 'ExtraBucks' | 'Lightning';
  state: 'Active' | 'Shared' | 'Used' | 'Expired';
  claimDate: string;
  useDate?: string;
  shareDate?: string;
  expirationDate: string;
  merchantName?: string;
  merchantLocation?: string;
  value: string;
  externalUrl?: string;
  // New fields for support agent actions
  supportActions?: {
    isReissued?: boolean;
    reissuedDate?: string;
    reissuedBy?: string;
    reissuedReason?: string;
    originalTokenId?: string;
    comments?: string;
    // New fields for tiered support
    tier?: SupportTier;
    escalationReason?: string;
    escalationDate?: string;
    ticketId?: string;
  };
  // Track if this token was disputed
  disputed?: boolean;
  disputeReason?: string;
  disputeDate?: string;
  // Flag to indicate if store didn't honor the token
  notHonored?: boolean;
}

export interface CustomerInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  extraCareId: string;
  accountCreated: string;
  address: {
    street: string;
    aptUnit?: string;
    city: string;
    state: string;
    zip: string;
  };
  tokens: TokenInfo[];
}

export interface TokenFilters {
  status: string[];
  dateRange: {
    start: string;
    end: string;
  };
  types: string[];
  merchant: string;
  searchQuery: string;
}

// Add sorting interfaces
export interface SortOptions {
  field: 'name' | 'type' | 'state' | 'value' | 'expirationDate' | 'claimDate';
  direction: 'asc' | 'desc';
}

export interface CVSTokenState {
  customers: CustomerInfo[];
  searchQuery: string;
  customerResults: CustomerInfo[];
  selectedCustomer: CustomerInfo | null;
  selectedToken: TokenInfo | null;
  showTokenCatalog: boolean;
  actionMessage: {
    text: string;
    type: 'success' | 'error' | 'info';
  } | null;
  caseNotes: string;
  viewState: 'main' | 'detail';
  hasSearched: boolean;
  tokenCatalog: TokenInfo[];
  tokenFilters: TokenFilters;
  // Sorting options
  tokenSort: SortOptions;
  // Pagination state
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
  };
  // Ticket management integration
  tickets: TicketInfo[];
  selectedTicket: TicketInfo | null;
  // Flag to show the create/update ticket modal
  showTicketModal: boolean;
}

// Modify the generateRandomTokens function to create more tokens
const generateRandomTokens = (count: number = 0, moreVariety: boolean = false): TokenInfo[] => {
  if (count === 0) return [];
  
  // Make token types, states, names, and descriptions more varied if needed
  const tokenTypes: ('Coupon' | 'Reward' | 'ExtraBucks' | 'Lightning')[] = ['Coupon', 'Reward', 'ExtraBucks', 'Lightning'];
  const tokenStates: ('Active' | 'Shared' | 'Used' | 'Expired')[] = ['Active', 'Shared', 'Used', 'Expired'];
  
  const couponNames = [
    '$5 ExtraBucks Rewards', '$10 ExtraBucks Rewards', '20% Off Vitamins',
    '30% Off Contact Lenses', '40% Off Sunscreen', 'Buy 1 Get 1 Free',
    'Free Toothbrush', '$3 Off Shampoo', '50% Off Seasonal Items',
    '25% Off Cosmetics', '$7 ExtraBucks Rewards', 'FREE Hand Sanitizer',
    '$15 Off Prescription', '15% Off Health Products', 'FREE Greeting Card',
    'BOGO 50% Vitamins', '30% Off Hair Care', '$5 Off $25 Purchase',
    'FREE Gift Wrap', '$3 Off Allergy Medicine', '40% Off Photo Products',
    '25% Off Beauty Products', 'FREE Delivery', '$2 Off Pain Relief',
    'FREE Health Screening', '$10 Off Skin Care', '20% Off Home Health'
  ];
  
  const couponDescriptions = [
    'Earn ExtraBucks when you spend $20 on beauty products',
    'Off your purchase of vitamins and supplements',
    'Off any contact lens purchase',
    'Off all sunscreen products',
    'On select items',
    'With any purchase of $10 or more',
    'Limited time offer - Today only!',
    'When you spend $40 or more',
    'For ExtraCare members',
    'Off cosmetics purchase',
    'One free photo print',
    'Off first aid supplies',
    'On qualifying refills',
    'For all health and wellness items',
    'With any $5 card purchase',
    'Mix and match vitamins and supplements',
    'Shampoo, conditioner and styling products',
    'Minimum purchase required',
    'Holiday purchases only',
    'On select allergy medications',
    'Prints, cards, and photo gifts',
    'Includes makeup and skin care',
    'On orders over $15',
    'On any pain relief medication',
    'Schedule in-store for ExtraCare members',
    'On select premium skin care products',
    'Home health devices and supplies'
  ];
  
  const merchants = ['CVS Pharmacy', 'CVS MinuteClinic', 'CVS HealthHUB', 'CVS y más', 'CVS Photo', 'CVS Specialty', 'Target CVS'];
  const locations = ['Downtown', 'Westside Mall', 'North Avenue', 'Eastside Plaza', 'South Center', 'University Plaza', 
                    'Riverfront', 'City Center', 'Medical District', 'Galleria Mall', 'Harbor View', 'Technology Park',
                    'Central Plaza', 'Suburb Towne', 'Parkway Junction', 'Grand Boulevard', 'Airport Terminal'];
  
  const tokens: TokenInfo[] = [];
  
  // Weight to make "Active" status more common (50%)
  const stateWeights = {
    'Active': 0.5,
    'Expired': 0.2,
    'Used': 0.2,
    'Shared': 0.1
  };
  
  // Generate at least 15 disputed tokens for the demo
  const disputedTokens = Math.min(15, Math.floor(count * 0.3)); // 30% or at least 15
  
  // Generate a few support action tokens for the demo (15%)
  const supportActionTokens = Math.min(10, Math.floor(count * 0.15)); // 15% or at least 10
  
  for (let i = 0; i < count; i++) {
    const tokenType = tokenTypes[Math.floor(Math.random() * tokenTypes.length)];
    
    // Use weighted random for states to ensure a good balance
    let tokenState: 'Active' | 'Shared' | 'Used' | 'Expired';
    const rand = Math.random();
    if (rand < stateWeights['Active']) {
      tokenState = 'Active';
    } else if (rand < stateWeights['Active'] + stateWeights['Expired']) {
      tokenState = 'Expired';
    } else if (rand < stateWeights['Active'] + stateWeights['Expired'] + stateWeights['Used']) {
      tokenState = 'Used';
    } else {
      tokenState = 'Shared';
    }
    
    const name = couponNames[Math.floor(Math.random() * couponNames.length)];
    const description = couponDescriptions[Math.floor(Math.random() * couponDescriptions.length)];
    const merchantName = merchants[Math.floor(Math.random() * merchants.length)];
    const merchantLocation = locations[Math.floor(Math.random() * locations.length)];
    
    // Generate dates
    const now = new Date();
    
    // Generate a claim date in the past (better distribution)
    const claimDate = new Date();
    const daysAgo = Math.floor(Math.random() * 180); // Up to 6 months ago
    claimDate.setDate(now.getDate() - daysAgo);
    
    // Generate expiration date relative to claim date
    const expirationDate = new Date(claimDate);
    const expirationDays = Math.floor(Math.random() * 90) + 30; // 30-120 days validity
    expirationDate.setDate(claimDate.getDate() + expirationDays);
    
    // If token is already expired, make sure expiration date is in the past
    if (tokenState === 'Expired') {
      expirationDate.setDate(now.getDate() - Math.floor(Math.random() * 30) - 1); // 1-30 days expired
    } else if (tokenState === 'Active') {
      // For active tokens, ensure expiration date is in the future
      expirationDate.setDate(now.getDate() + Math.floor(Math.random() * 60) + 1); // 1-60 days until expiration
    }
    
    let useDate, shareDate;
    if (tokenState === 'Used') {
      const usedDate = new Date(claimDate);
      const daysToUse = Math.floor(Math.random() * (expirationDate.getTime() - claimDate.getTime()) / (1000 * 60 * 60 * 24));
      usedDate.setDate(claimDate.getDate() + daysToUse);
      useDate = usedDate.toISOString().split('T')[0];
    }
    if (tokenState === 'Shared') {
      const sharedDate = new Date(claimDate);
      const daysToShare = Math.floor(Math.random() * (expirationDate.getTime() - claimDate.getTime()) / (1000 * 60 * 60 * 24));
      sharedDate.setDate(claimDate.getDate() + daysToShare);
      shareDate = sharedDate.toISOString().split('T')[0];
    }
    
    // Generate random value
    let value;
    if (tokenType === 'ExtraBucks' || tokenType === 'Lightning') {
      value = `$${Math.floor(Math.random() * 20) + 1}.00`;
    } else if (tokenType === 'Coupon') {
      value = `${(Math.floor(Math.random() * 4) + 1) * 10}%`;
    } else {
      value = 'FREE';
    }
    
    const token: TokenInfo = {
      id: `tok${3000 + i}`,
      name,
      description,
      type: tokenType,
      state: tokenState,
      claimDate: claimDate.toISOString().split('T')[0],
      useDate,
      shareDate,
      expirationDate: expirationDate.toISOString().split('T')[0],
      merchantName,
      merchantLocation,
      value,
      externalUrl: `https://www.cvs.com/extracare/token/view?id=tok${3000 + i}`
    };
    
    // Add disputed flags to some tokens
    if (i < disputedTokens) {
      token.disputed = true;
      token.disputeReason = Math.random() > 0.5 ? 'Store didn\'t honor' : 'Token not working';
      token.disputeDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      token.notHonored = Math.random() > 0.3; // 70% chance of not being honored
    }
    
    // Add support actions to some tokens
    if (i >= disputedTokens && i < disputedTokens + supportActionTokens) {
      token.supportActions = {
        isReissued: true,
        reissuedDate: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reissuedBy: "Support Agent",
        reissuedReason: Math.random() > 0.5 ? 'Store didn\'t honor' : 'Customer satisfaction',
        originalTokenId: `tok${2000 + i}`,
        comments: `Customer reported issue on ${new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000).toLocaleDateString()}`
      }
    }
    
    tokens.push(token);
  }
  
  return tokens;
};

// Helper function to generate random customers with more tokens
const generateMockCustomers = (count: number): CustomerInfo[] => {
  const firstNames = ['Emily', 'Michael', 'Sophia', 'John', 'Alice', 'Robert', 'Maria', 'David', 
                    'Lisa', 'James', 'Jennifer', 'Matthew', 'Sarah', 'Daniel', 'Jessica', 'Andrew', 
                    'Elizabeth', 'Richard', 'Patricia', 'Christopher', 'Nancy', 'Kevin', 'Susan', 'Mark',
                    'Linda', 'Paul', 'Karen', 'Thomas', 'Laura', 'Steven'];
  const lastNames = ['Johnson', 'Williams', 'Martinez', 'Doe', 'Smith', 'Thompson', 'Garcia', 'Brown', 
                   'Wilson', 'Davis', 'Miller', 'Jones', 'Lee', 'Taylor', 'Anderson', 'Jackson', 
                   'White', 'Harris', 'Martin', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young',
                   'Allen', 'King', 'Wright', 'Scott', 'Green', 'Baker'];
  const cities = ['Boston', 'Cambridge', 'Somerville', 'Brookline', 'Newton', 'Quincy', 'Medford', 'Waltham'];
  const states = ['MA', 'NH', 'CT', 'RI', 'NY', 'ME', 'VT'];
  const streets = ['Market Street', 'Commonwealth Avenue', 'Boylston Street', 'Beacon Street', 'Tremont Street', 
                 'Newbury Street', 'Washington Street', 'State Street', 'Summer Street', 'Winter Street'];
  const aptUnits = ['Apt 1A', 'Unit 2B', 'Suite 300', 'Apt 4B', 'Unit 15', 'Apt 7C', '#12', 'PH1', 'STE 205', 'Unit 503'];
  
  const customers: CustomerInfo[] = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@example.com`;
    
    // Generate random phone number
    const phone = `(${Math.floor(Math.random() * 800) + 200}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    
    // Generate random ExtraCare ID
    const extraCareId = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
    
    // Generate random account created date (between 1-5 years ago)
    const now = new Date();
    const accountCreatedDate = new Date();
    accountCreatedDate.setFullYear(now.getFullYear() - (Math.floor(Math.random() * 5) + 1));
    accountCreatedDate.setMonth(Math.floor(Math.random() * 12));
    accountCreatedDate.setDate(Math.floor(Math.random() * 28) + 1);
    const accountCreated = accountCreatedDate.toISOString().split('T')[0];
    
    // Generate random address
    const street = `${Math.floor(Math.random() * 999) + 1} ${streets[Math.floor(Math.random() * streets.length)]}`;
    const aptUnit = Math.random() > 0.3 ? aptUnits[Math.floor(Math.random() * aptUnits.length)] : undefined;
    const city = cities[Math.floor(Math.random() * cities.length)];
    const state = states[Math.floor(Math.random() * states.length)];
    const zip = `${Math.floor(Math.random() * 90000) + 10000}`;
    
    // Generate more tokens per customer - weighted distribution
    // Some customers have many tokens, some have few
    const weightedRandom = Math.random();
    let tokenCount;
    
    if (weightedRandom < 0.1) {
      tokenCount = 0; // 10% of customers have no tokens
    } else if (weightedRandom < 0.4) {
      tokenCount = Math.floor(Math.random() * 3) + 1; // 30% have 1-3 tokens
    } else if (weightedRandom < 0.7) {
      tokenCount = Math.floor(Math.random() * 5) + 4; // 30% have 4-8 tokens
    } else if (weightedRandom < 0.9) {
      tokenCount = Math.floor(Math.random() * 7) + 9; // 20% have 9-15 tokens
    } else {
      tokenCount = Math.floor(Math.random() * 35) + 16; // 10% have 16-50 tokens (power users)
    }
    
    customers.push({
      id: `cust${1000 + i}`,
      firstName,
      lastName,
      email,
      phone,
      extraCareId,
      accountCreated,
      address: {
        street,
        aptUnit,
        city,
        state,
        zip
      },
      tokens: generateRandomTokens(tokenCount, true)
    });
  }
  
  // Make sure a few accounts have exactly zero tokens for demonstration purposes
  const emptyAccountIndices = [3, 10, 17, 24, 35];
  emptyAccountIndices.forEach(index => {
    if (index < customers.length) {
      customers[index].tokens = [];
    }
  });
  
  // Add our original 6 specific customers at the beginning
  customers.unshift(...mockCustomers, ...additionalSampleCustomers);
  
  return customers;
};

// Mock customer data - Keep the original 3 customers for continuity
const mockCustomers: CustomerInfo[] = [
  {
    id: 'cust001',
    firstName: 'Emily',
    lastName: 'Johnson',
    email: 'emily.johnson@example.com',
    phone: '(555) 123-4567',
    extraCareId: '4872913650',
    accountCreated: '2021-06-15',
    address: {
      street: '123 Market Street',
      aptUnit: 'Apt 4B',
      city: 'Boston',
      state: 'MA',
      zip: '02108'
    },
    tokens: [
      {
        id: 'tok001',
        name: '$5 ExtraBucks Rewards',
        description: 'Earn $5 ExtraBucks Rewards when you spend $20 on beauty products',
        type: 'ExtraBucks',
        state: 'Active',
        claimDate: '2023-05-10',
        expirationDate: '2023-06-10',
        merchantName: 'CVS Pharmacy',
        merchantLocation: 'Downtown',
        value: '$5.00',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok001'
      },
      {
        id: 'tok002',
        name: '20% Off Vitamins',
        description: '20% off your purchase of vitamins and supplements',
        type: 'Coupon',
        state: 'Expired',
        claimDate: '2023-04-01',
        expirationDate: '2023-05-01',
        merchantName: 'CVS Pharmacy',
        merchantLocation: 'Westside Mall',
        value: '20%',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok002'
      }
    ]
  },
  {
    id: 'cust002',
    firstName: 'Michael',
    lastName: 'Williams',
    email: 'michael.williams@example.com',
    phone: '(555) 987-6543',
    extraCareId: '7391265480',
    accountCreated: '2020-11-22',
    address: {
      street: '456 Commonwealth Avenue',
      city: 'Boston',
      state: 'MA',
      zip: '02215'
    },
    tokens: [
      {
        id: 'tok003',
        name: '30% Off Contact Lenses',
        description: '30% off any contact lens purchase',
        type: 'Coupon',
        state: 'Used',
        claimDate: '2023-05-15',
        useDate: '2023-05-20',
        expirationDate: '2023-06-15',
        merchantName: 'CVS Pharmacy',
        merchantLocation: 'North Avenue',
        value: '30%',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok003'
      }
    ]
  },
  {
    id: 'cust003',
    firstName: 'Sophia',
    lastName: 'Martinez',
    email: 'sophia.martinez@example.com',
    phone: '(555) 234-5678',
    extraCareId: '6129385740',
    accountCreated: '2022-01-07',
    address: {
      street: '789 Boylston Street',
      aptUnit: 'Suite 300',
      city: 'Boston',
      state: 'MA',
      zip: '02199'
    },
    tokens: []
  }
];

// Additional sample customers - Keep the original 3 additional customers for continuity
const additionalSampleCustomers: CustomerInfo[] = [
  {
    id: 'cust004',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 432-1098',
    extraCareId: '5134982760',
    accountCreated: '2022-01-12',
    address: {
      street: '101 Beacon Street',
      aptUnit: 'Unit 15',
      city: 'Boston',
      state: 'MA',
      zip: '02116'
    },
    tokens: [
      {
        id: 'tok004',
        name: '$7 ExtraBucks Rewards',
        description: '$7 ExtraBucks Rewards for beauty purchases',
        type: 'ExtraBucks',
        state: 'Active',
        claimDate: '2023-05-20',
        expirationDate: '2023-06-20',
        merchantName: 'CVS Pharmacy',
        merchantLocation: 'Eastside Plaza',
        value: '$7.00',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok004'
      },
      {
        id: 'tok005',
        name: '25% Off Cosmetics',
        description: '25% off cosmetics purchase',
        type: 'Coupon',
        state: 'Active',
        claimDate: '2023-05-01',
        expirationDate: '2023-06-01',
        merchantName: 'CVS Pharmacy',
        merchantLocation: 'Eastside Plaza',
        value: '25%',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok005'
      },
      {
        id: 'tok006',
        name: 'BOGO Vitamins',
        description: 'Buy one get one free on select vitamins',
        type: 'Coupon',
        state: 'Used',
        claimDate: '2023-04-01',
        useDate: '2023-04-15',
        expirationDate: '2023-05-01',
        merchantName: 'CVS Pharmacy',
        value: 'BOGO',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok006'
      }
    ]
  },
  {
    id: 'cust005',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@example.com',
    phone: '(555) 789-6543',
    extraCareId: '7892136540',
    accountCreated: '2023-03-23',
    address: {
      street: '222 Tremont Street',
      aptUnit: 'Apt 7C',
      city: 'Boston',
      state: 'MA',
      zip: '02116'
    },
    tokens: [
      {
        id: 'tok010',
        name: 'Flash Sale: $5 ExtraBucks',
        description: 'Limited time $5 offer - Today only!',
        type: 'Lightning',
        state: 'Active',
        claimDate: '2023-05-25',
        expirationDate: '2023-05-26',
        merchantName: 'CVS Pharmacy',
        value: '$5.00',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok010'
      }
    ]
  },
  {
    id: 'cust006',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.j@example.com',
    phone: '(555) 321-7890',
    extraCareId: '3698521470',
    accountCreated: '2021-11-05',
    address: {
      street: '333 Newbury Street',
      city: 'Boston',
      state: 'MA',
      zip: '02115'
    },
    tokens: [
      {
        id: 'tok011',
        name: '40% Off Sunscreen',
        description: '40% off all sunscreen products',
        type: 'Coupon',
        state: 'Expired',
        claimDate: '2023-03-01',
        expirationDate: '2023-04-01',
        merchantName: 'CVS Pharmacy',
        value: '40%',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok011'
      },
      {
        id: 'tok012',
        name: '$10 Off $40 Purchase',
        description: '$10 off when you spend $40 or more',
        type: 'Coupon',
        state: 'Expired',
        claimDate: '2023-02-01',
        expirationDate: '2023-03-01',
        merchantName: 'CVS Pharmacy',
        value: '$10.00',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok012'
      }
    ]
  }
];

// Generate 44 more customers to get a total of 50
const generatedCustomers = generateMockCustomers(44);

// Mock token catalog for adding to customers
const tokenCatalog: TokenInfo[] = [
  {
    id: 'cat001',
    name: '$10 ExtraBucks Rewards',
    description: '$10 ExtraBucks Rewards for ExtraCare members',
    type: 'ExtraBucks',
    state: 'Active',
    claimDate: new Date().toISOString().split('T')[0],
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    merchantName: 'CVS Pharmacy',
    value: '$10.00',
    externalUrl: 'https://www.cvs.com/extracare/token/view?id=cat001'
  },
  {
    id: 'cat002',
    name: '40% Off Photo',
    description: '40% off photo prints and gifts',
    type: 'Coupon',
    state: 'Active',
    claimDate: new Date().toISOString().split('T')[0],
    expirationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    merchantName: 'CVS Pharmacy',
    value: '40%',
    externalUrl: 'https://www.cvs.com/extracare/token/view?id=cat002'
  }
];

// Mock ticket data for demo purposes
const mockTickets: TicketInfo[] = [
  {
    id: 'TK-3829',
    customerId: 'cust001', // Emily Johnson
    tokenId: 'tok001',
    subject: 'Unable to redeem ExtraBucks',
    description: 'Customer reports ExtraBucks reward is showing in their account but cannot be redeemed at checkout.',
    status: 'Open',
    priority: 'High',
    createdDate: '2023-07-15T10:30:00Z',
    updatedDate: '2023-07-15T10:30:00Z',
    tier: 'Tier1',
    notes: [
      'Initial contact: Customer called about difficulty redeeming their ExtraBucks reward.',
      'Verified account details and confirmed reward is active in system.'
    ]
  },
  {
    id: 'TK-3828',
    customerId: 'cust002', // Michael Williams
    tokenId: 'tok003',
    subject: 'Coupon showing expired but should not be',
    description: 'Customer indicates that 30% Off Contact Lenses coupon is showing as expired in app, but expiration date should be next week.',
    status: 'Escalated',
    priority: 'Medium',
    createdDate: '2023-07-14T15:45:00Z',
    updatedDate: '2023-07-15T09:20:00Z',
    assignedTo: 'Sarah Johnson',
    tier: 'Tier2',
    notes: [
      'Initial review: Confirmed coupon should be valid until 2023-06-15.',
      'Attempted to refresh token status in system without success.',
      'Escalated to Tier 2 for technical review of token records.'
    ]
  },
  {
    id: 'TK-3825',
    customerId: 'cust004', // John Doe
    subject: 'Missing tokens after app update',
    description: 'Customer updated app and now cannot see previously claimed tokens.',
    status: 'In Progress',
    priority: 'Medium',
    createdDate: '2023-07-13T11:15:00Z',
    updatedDate: '2023-07-14T13:40:00Z',
    assignedTo: 'Alex Chen',
    tier: 'Tier1',
    notes: [
      'Initial troubleshooting performed, advised customer to clear app cache.',
      'Customer reports issue persists after clearing cache.',
      'Looking at token database to verify status.'
    ]
  }
];

const initialState: CVSTokenState = {
  customers: generatedCustomers,
  searchQuery: '',
  customerResults: [],
  selectedCustomer: null,
  selectedToken: null,
  showTokenCatalog: false,
  actionMessage: null,
  caseNotes: '',
  viewState: 'main',
  hasSearched: false,
  tokenCatalog,
  tokenFilters: {
    status: [],
    dateRange: {
      start: '',
      end: ''
    },
    types: [],
    merchant: '',
    searchQuery: ''
  },
  tokenSort: {
    field: 'name',
    direction: 'asc'
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: Math.ceil(generatedCustomers.length / 10)
  },
  // Add sample ticket data to initialState
  tickets: mockTickets,
  selectedTicket: null,
  showTicketModal: false
};

export const cvsTokenSlice = createSlice({
  name: 'cvsToken',
  initialState,
  reducers: {
    // Initialize state with mock data - helps with SSR & hydration
    initializeState: (state) => {
      // Only initialize if not already set
      if (state.customers.length === 0) {
        state.customers = generateMockCustomers(10);
        
        // Generate token catalog if empty
        if (state.tokenCatalog.length === 0) {
          state.tokenCatalog = generateRandomTokens(5);
        }
        
        // Update pagination total pages
        state.pagination.totalPages = Math.ceil(state.customers.length / state.pagination.itemsPerPage);
      }
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      
      if (!action.payload.trim()) {
        state.customerResults = [];
        state.hasSearched = false;
        return;
      }
      
      state.hasSearched = true;
      
      const query = action.payload.toLowerCase();
      
      state.customerResults = state.customers.filter(customer => 
        customer.email.toLowerCase().includes(query) ||
        customer.firstName.toLowerCase().includes(query) ||
        customer.lastName.toLowerCase().includes(query) ||
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(query) ||
        customer.phone.includes(query) ||
        customer.extraCareId.includes(query)
      );
    },
    
    selectCustomer: (state, action: PayloadAction<string>) => {
      const customer = state.customers.find(c => c.id === action.payload);
      if (customer) {
        state.selectedCustomer = customer;
        state.customerResults = [];
        state.searchQuery = '';
        state.viewState = 'detail';
      }
    },
    
    setViewState: (state, action: PayloadAction<'main' | 'detail'>) => {
      state.viewState = action.payload;
    },
    
    toggleTokenCatalog: (state) => {
      state.showTokenCatalog = !state.showTokenCatalog;
    },
    
    addTokenToCustomer: (state, action: PayloadAction<string>) => {
      if (!state.selectedCustomer) return;
      
      const token = state.tokenCatalog.find(t => t.id === action.payload);
      if (!token) return;
      
      const newToken = {
        ...token,
        id: `tok${Date.now()}`, // Generate unique ID
        claimDate: new Date().toISOString().split('T')[0],
        externalUrl: `https://www.cvs.com/extracare/token/view?id=tok${Date.now()}`
      };
      
      // Update customers state
      const customerIndex = state.customers.findIndex(c => c.id === state.selectedCustomer?.id);
      if (customerIndex !== -1) {
        state.customers[customerIndex].tokens.push(newToken);
        state.selectedCustomer = state.customers[customerIndex];
      }
      
      state.showTokenCatalog = false;
      state.actionMessage = {
        text: `Successfully added ${token.name} to ${state.selectedCustomer.firstName}'s account`,
        type: 'success'
      };
    },
    
    removeTokenFromCustomer: (state, action: PayloadAction<string>) => {
      if (!state.selectedCustomer) return;
      
      // Update customers state
      const customerIndex = state.customers.findIndex(c => c.id === state.selectedCustomer?.id);
      if (customerIndex !== -1) {
        state.customers[customerIndex].tokens = state.customers[customerIndex].tokens.filter(t => t.id !== action.payload);
        state.selectedCustomer = state.customers[customerIndex];
      }
      
      state.actionMessage = {
        text: `Successfully removed token from ${state.selectedCustomer.firstName}'s account`,
        type: 'success'
      };
    },
    
    reissueToken: (state, action: PayloadAction<{ tokenId: string; reason: string; comments: string }>) => {
      if (!state.selectedCustomer) return;
      
      const token = state.selectedCustomer.tokens.find(t => t.id === action.payload.tokenId);
      if (!token) return;
      
      // First remove the old token
      const customerIndex = state.customers.findIndex(c => c.id === state.selectedCustomer?.id);
      if (customerIndex === -1) return;
      
      // Create a new active token
      const newToken = {
        ...token,
        id: `tok${Date.now()}`, // Generate unique ID
        state: 'Active' as const,
        claimDate: new Date().toISOString().split('T')[0],
        expirationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        useDate: undefined,
        shareDate: undefined,
        externalUrl: `https://www.cvs.com/extracare/token/view?id=tok${Date.now()}`,
        // Add support action information
        supportActions: {
          isReissued: true,
          reissuedDate: new Date().toISOString().split('T')[0],
          reissuedBy: "Support Agent", // In a real app, this would come from the user context
          reissuedReason: action.payload.reason,
          originalTokenId: token.id,
          comments: action.payload.comments
        },
        // If the token was disputed or not honored, mark the new token
        disputed: token.disputed,
        disputeReason: token.disputeReason,
        notHonored: token.notHonored
      };
      
      // Add new token
      state.customers[customerIndex].tokens.push(newToken);
      state.selectedCustomer = state.customers[customerIndex];
      
      state.actionMessage = {
        text: `Successfully reissued ${token.name} to ${state.selectedCustomer.firstName}'s account`,
        type: 'success'
      };
    },
    
    saveCaseNotes: (state, action: PayloadAction<string>) => {
      state.caseNotes = action.payload;
      state.actionMessage = {
        text: 'Case notes saved successfully',
        type: 'success'
      };
    },
    
    clearActionMessage: (state) => {
      state.actionMessage = null;
    },
    
    selectToken: (state, action: PayloadAction<string | null>) => {
      if (action.payload === null) {
        state.selectedToken = null;
        return;
      }
      
      if (!state.selectedCustomer) return;
      
      const token = state.selectedCustomer.tokens.find(t => t.id === action.payload);
      if (token) {
        state.selectedToken = token;
      }
    },
    
    updateTokenFilters: (state, action: PayloadAction<{ filterType: string; value: any }>) => {
      const { filterType, value } = action.payload;
      
      switch (filterType) {
        case 'status':
          // Toggle status filter
          if (state.tokenFilters.status.includes(value)) {
            state.tokenFilters.status = state.tokenFilters.status.filter(s => s !== value);
          } else {
            state.tokenFilters.status.push(value);
          }
          break;
        case 'dateStart':
          state.tokenFilters.dateRange.start = value;
          break;
        case 'dateEnd':
          state.tokenFilters.dateRange.end = value;
          break;
        case 'type':
          // Toggle type filter
          if (state.tokenFilters.types.includes(value)) {
            state.tokenFilters.types = state.tokenFilters.types.filter(t => t !== value);
          } else {
            state.tokenFilters.types.push(value);
          }
          break;
        case 'merchant':
          state.tokenFilters.merchant = value;
          break;
        case 'searchQuery':
          state.tokenFilters.searchQuery = value;
          break;
        case 'clearAll':
          state.tokenFilters = {
            status: [],
            dateRange: {
              start: '',
              end: ''
            },
            types: [],
            merchant: '',
            searchQuery: ''
          };
          break;
      }
    },
    
    applyPresetFilter: (state, action: PayloadAction<string>) => {
      switch (action.payload) {
        case 'activeTokens':
          state.tokenFilters.status = ['Active'];
          state.tokenFilters.types = [];
          break;
        case 'expiringSoon':
          // Set date range to next 7 days
          const today = new Date();
          const nextWeek = new Date();
          nextWeek.setDate(today.getDate() + 7);
          
          state.tokenFilters.status = ['Active'];
          state.tokenFilters.dateRange = {
            start: '',
            end: nextWeek.toISOString().split('T')[0]
          };
          break;
        case 'recentlyUsed':
          // Set date range to last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          state.tokenFilters.status = ['Used'];
          state.tokenFilters.dateRange = {
            start: thirtyDaysAgo.toISOString().split('T')[0],
            end: ''
          };
          break;
        case 'highValue':
          state.tokenFilters.status = ['Active'];
          state.tokenFilters.searchQuery = '$';
          break;
      }
    },
    
    // New pagination actions
    setCurrentPage: (state, action: PayloadAction<number>) => {
      if (action.payload > 0 && action.payload <= state.pagination.totalPages) {
        state.pagination.currentPage = action.payload;
      }
    },
    
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.totalPages = Math.ceil(state.customers.length / action.payload);
      
      // Adjust current page if necessary
      if (state.pagination.currentPage > state.pagination.totalPages) {
        state.pagination.currentPage = state.pagination.totalPages > 0 ? state.pagination.totalPages : 1;
      }
    },
    
    // Add a new reducer for marking a token as disputed or not honored
    markTokenDisputed: (state, action: PayloadAction<{ tokenId: string; reason: string; notHonored: boolean }>) => {
      if (!state.selectedCustomer) return;
      
      const customerIndex = state.customers.findIndex(c => c.id === state.selectedCustomer?.id);
      if (customerIndex === -1) return;
      
      const tokenIndex = state.customers[customerIndex].tokens.findIndex(t => t.id === action.payload.tokenId);
      if (tokenIndex === -1) return;
      
      // Update the token
      state.customers[customerIndex].tokens[tokenIndex] = {
        ...state.customers[customerIndex].tokens[tokenIndex],
        disputed: true,
        disputeReason: action.payload.reason,
        disputeDate: new Date().toISOString().split('T')[0],
        notHonored: action.payload.notHonored
      };
      
      // Update selected customer and token if necessary
      state.selectedCustomer = state.customers[customerIndex];
      if (state.selectedToken && state.selectedToken.id === action.payload.tokenId) {
        state.selectedToken = state.customers[customerIndex].tokens[tokenIndex];
      }
      
      state.actionMessage = {
        text: `Token marked as disputed${action.payload.notHonored ? ' and not honored by store' : ''}`,
        type: 'info'
      };
    },
    
    // Add the new sorting reducer
    setTokenSort: (state, action: PayloadAction<{ field: SortOptions['field']; direction?: SortOptions['direction'] }>) => {
      const { field, direction } = action.payload;
      
      // If sorting by the same field, toggle direction
      if (field === state.tokenSort.field && !direction) {
        state.tokenSort.direction = state.tokenSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        state.tokenSort.field = field;
        state.tokenSort.direction = direction || 'asc';
      }
    },
    
    // New reducers for ticket management
    createTicket: (state, action: PayloadAction<Omit<TicketInfo, 'id' | 'createdDate' | 'updatedDate'>>) => {
      const newTicket: TicketInfo = {
        ...action.payload,
        id: `TK-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      };
      
      state.tickets.push(newTicket);
      state.selectedTicket = newTicket;
      
      // If this is related to a token, update the token as well
      if (newTicket.tokenId && state.selectedCustomer) {
        const tokenIndex = state.selectedCustomer.tokens.findIndex(t => t.id === newTicket.tokenId);
        if (tokenIndex >= 0) {
          if (!state.selectedCustomer.tokens[tokenIndex].supportActions) {
            state.selectedCustomer.tokens[tokenIndex].supportActions = {};
          }
          
          state.selectedCustomer.tokens[tokenIndex].supportActions!.ticketId = newTicket.id;
          state.selectedCustomer.tokens[tokenIndex].supportActions!.tier = newTicket.tier;
          
          // Update selected token if relevant
          if (state.selectedToken?.id === newTicket.tokenId) {
            state.selectedToken = { ...state.selectedCustomer.tokens[tokenIndex] };
          }
        }
      }
      
      state.actionMessage = {
        text: `Support ticket ${newTicket.id} created successfully`,
        type: 'success'
      };
    },
    
    updateTicket: (state, action: PayloadAction<Partial<TicketInfo> & { id: string }>) => {
      const ticketIndex = state.tickets.findIndex(t => t.id === action.payload.id);
      if (ticketIndex >= 0) {
        state.tickets[ticketIndex] = {
          ...state.tickets[ticketIndex],
          ...action.payload,
          updatedDate: new Date().toISOString()
        };
        
        state.selectedTicket = state.tickets[ticketIndex];
        
        // If ticket status changed to Escalated, update tier as well
        if (action.payload.status === 'Escalated') {
          state.tickets[ticketIndex].tier = 'Tier2';
          
          // If this is related to a token, update the token as well
          if (state.tickets[ticketIndex].tokenId && state.selectedCustomer) {
            const tokenIndex = state.selectedCustomer.tokens.findIndex(t => t.id === state.tickets[ticketIndex].tokenId);
            if (tokenIndex >= 0) {
              if (!state.selectedCustomer.tokens[tokenIndex].supportActions) {
                state.selectedCustomer.tokens[tokenIndex].supportActions = {};
              }
              
              state.selectedCustomer.tokens[tokenIndex].supportActions!.tier = 'Tier2';
              state.selectedCustomer.tokens[tokenIndex].supportActions!.escalationDate = new Date().toISOString();
              
              // Update selected token if relevant
              if (state.selectedToken?.id === state.tickets[ticketIndex].tokenId) {
                state.selectedToken = { ...state.selectedCustomer.tokens[tokenIndex] };
              }
            }
          }
        }
        
        state.actionMessage = {
          text: `Support ticket ${action.payload.id} updated successfully`,
          type: 'success'
        };
      }
    },
    
    selectTicket: (state, action: PayloadAction<string>) => {
      const ticket = state.tickets.find(t => t.id === action.payload);
      state.selectedTicket = ticket || null;
      
      // If the ticket is associated with a customer, select that customer
      if (ticket?.customerId) {
        const customer = state.customers.find(c => c.id === ticket.customerId);
        if (customer) {
          state.selectedCustomer = customer;
          state.customerResults = [customer];
          state.hasSearched = true;
          
          // If the ticket is associated with a token, select that token
          if (ticket.tokenId) {
            const token = customer.tokens.find(t => t.id === ticket.tokenId);
            if (token) {
              state.selectedToken = token;
              state.viewState = 'detail';
            }
          }
        }
      }
    },
    
    closeTicket: (state, action: PayloadAction<{ id: string, resolution: string }>) => {
      const ticketIndex = state.tickets.findIndex(t => t.id === action.payload.id);
      if (ticketIndex >= 0) {
        state.tickets[ticketIndex].status = 'Closed';
        state.tickets[ticketIndex].resolutionSummary = action.payload.resolution;
        state.tickets[ticketIndex].updatedDate = new Date().toISOString();
        
        state.selectedTicket = state.tickets[ticketIndex];
        
        state.actionMessage = {
          text: `Ticket ${action.payload.id} has been closed`,
          type: 'success'
        };
      }
    },
    
    escalateToTier2: (state, action: PayloadAction<{ ticketId: string, reason: string }>) => {
      const ticketIndex = state.tickets.findIndex(t => t.id === action.payload.ticketId);
      if (ticketIndex >= 0) {
        state.tickets[ticketIndex].status = 'Escalated';
        state.tickets[ticketIndex].tier = 'Tier2';
        state.tickets[ticketIndex].updatedDate = new Date().toISOString();
        state.tickets[ticketIndex].notes = [
          ...(state.tickets[ticketIndex].notes || []),
          `Escalated to Tier 2: ${action.payload.reason}`
        ];
        
        state.selectedTicket = state.tickets[ticketIndex];
        
        // If this is related to a token, update the token as well
        if (state.tickets[ticketIndex].tokenId && state.selectedCustomer) {
          const tokenIndex = state.selectedCustomer.tokens.findIndex(t => t.id === state.tickets[ticketIndex].tokenId);
          if (tokenIndex >= 0) {
            if (!state.selectedCustomer.tokens[tokenIndex].supportActions) {
              state.selectedCustomer.tokens[tokenIndex].supportActions = {};
            }
            
            state.selectedCustomer.tokens[tokenIndex].supportActions!.tier = 'Tier2';
            state.selectedCustomer.tokens[tokenIndex].supportActions!.escalationDate = new Date().toISOString();
            state.selectedCustomer.tokens[tokenIndex].supportActions!.escalationReason = action.payload.reason;
            
            // Update selected token if relevant
            if (state.selectedToken?.id === state.tickets[ticketIndex].tokenId) {
              state.selectedToken = { ...state.selectedCustomer.tokens[tokenIndex] };
            }
          }
        }
        
        state.actionMessage = {
          text: `Ticket ${action.payload.ticketId} has been escalated to Tier 2 support`,
          type: 'success'
        };
      }
    },
    
    addTicketNote: (state, action: PayloadAction<{ ticketId: string, note: string }>) => {
      const ticketIndex = state.tickets.findIndex(t => t.id === action.payload.ticketId);
      if (ticketIndex >= 0) {
        if (!state.tickets[ticketIndex].notes) {
          state.tickets[ticketIndex].notes = [];
        }
        
        state.tickets[ticketIndex].notes!.push(action.payload.note);
        state.tickets[ticketIndex].updatedDate = new Date().toISOString();
        
        state.selectedTicket = state.tickets[ticketIndex];
      }
    },
    
    toggleTicketModal: (state) => {
      state.showTicketModal = !state.showTicketModal;
    }
  }
});

export const {
  initializeState,
  setSearchQuery,
  selectCustomer,
  setViewState,
  toggleTokenCatalog,
  addTokenToCustomer,
  removeTokenFromCustomer,
  reissueToken,
  saveCaseNotes,
  clearActionMessage,
  selectToken,
  updateTokenFilters,
  applyPresetFilter,
  setCurrentPage,
  setItemsPerPage,
  markTokenDisputed,
  setTokenSort,
  createTicket,
  updateTicket,
  selectTicket,
  closeTicket,
  escalateToTier2,
  addTicketNote,
  toggleTicketModal
} = cvsTokenSlice.actions;

export default cvsTokenSlice.reducer; 