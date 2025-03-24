import TokenManagementView from '@/components/features/token-management/TokenManagementView';

export const metadata = {
  title: 'CVS ExtraCare Token Management',
  description: 'Manage customer offer tokens for CVS ExtraCare program',
};

/**
 * Token Management page using Next.js app router
 */
export default function TokenManagementPage() {
  return <TokenManagementView />;
} 