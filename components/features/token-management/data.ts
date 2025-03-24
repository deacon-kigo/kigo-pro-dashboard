import { Token, Account } from './types';

/**
 * Sample token data for demonstration purposes
 */
export const sampleTokens: Token[] = [
  {
    id: 'TKN-1001',
    name: '$5 ExtraBucks Rewards',
    description: 'Get $5 ExtraBucks Rewards when you spend $20 on select products',
    imageUrl: '/images/extrabucks.png',
    state: 'Active',
    claimDate: '2023-06-10T10:30:00',
    expirationDate: '2023-07-10T23:59:59',
    merchantName: 'CVS Pharmacy',
  },
  {
    id: 'TKN-1002',
    name: '30% Off Vitamins',
    description: 'Save 30% on all vitamins and supplements',
    imageUrl: '/images/vitamins.png',
    state: 'Used',
    claimDate: '2023-05-15T08:15:00',
    useDate: '2023-05-18T14:30:00',
    expirationDate: '2023-06-15T23:59:59',
    merchantName: 'CVS Pharmacy',
    merchantLocation: 'Boston, MA',
  },
  {
    id: 'TKN-1003',
    name: 'BOGO 50% Off Cosmetics',
    description: 'Buy one get one 50% off all cosmetics',
    imageUrl: '/images/cosmetics.png',
    state: 'Shared',
    claimDate: '2023-06-01T15:45:00',
    shareDate: '2023-06-05T09:30:00',
    expirationDate: '2023-06-30T23:59:59',
    merchantName: 'CVS Pharmacy',
  },
  {
    id: 'TKN-1004',
    name: 'Free Greeting Card',
    description: 'Get one free greeting card with any purchase',
    imageUrl: '/images/greeting.png',
    state: 'Expired',
    claimDate: '2023-04-01T12:10:00',
    expirationDate: '2023-05-01T23:59:59',
    merchantName: 'CVS Pharmacy',
    merchantLocation: 'Chicago, IL',
  },
  {
    id: 'TKN-1005',
    name: '$10 Off $50 Purchase',
    description: 'Save $10 on any purchase of $50 or more',
    imageUrl: '/images/discount.png',
    state: 'Active',
    claimDate: '2023-06-12T10:30:00',
    expirationDate: '2023-07-12T23:59:59',
    merchantName: 'CVS Pharmacy',
  },
];

/**
 * Sample account data for demonstration purposes
 */
export const sampleAccounts: Account[] = [
  {
    id: 'A-1001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    mobileNumber: '(555) 123-4567',
    creationDate: '2022-01-15T10:30:00',
    tokens: [sampleTokens[0], sampleTokens[1], sampleTokens[4]],
  },
  {
    id: 'A-1002',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@example.com',
    mobileNumber: '(555) 987-6543',
    creationDate: '2021-11-20T08:15:00',
    tokens: [sampleTokens[2], sampleTokens[3]],
  },
  {
    id: 'A-1003',
    firstName: 'Robert',
    lastName: 'Chen',
    email: 'robert.chen@example.com',
    mobileNumber: '(555) 456-7890',
    creationDate: '2022-03-05T15:45:00',
    tokens: [sampleTokens[0], sampleTokens[2]],
  },
  {
    id: 'A-1004',
    firstName: 'Samantha',
    lastName: 'Lee',
    email: 'samantha.lee@example.com',
    mobileNumber: '(555) 789-0123',
    creationDate: '2021-08-12T12:10:00',
    tokens: [sampleTokens[1], sampleTokens[3], sampleTokens[4]],
  },
]; 