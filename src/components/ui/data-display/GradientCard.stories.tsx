import type { Meta, StoryObj } from '@storybook/react';
import GradientCard from './GradientCard';
import { 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  ShoppingCartIcon,
  ChartBarIcon,
  BoltIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const meta: Meta<typeof GradientCard> = {
  component: GradientCard,
  title: 'UI/Data Display/GradientCard',
  parameters: {
    docs: {
      description: {
        component: 'A beautiful card component with gradient background for displaying stats and metrics.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    value: { control: 'text' },
    description: { control: 'text' },
    change: { control: 'number' },
    gradient: { control: 'text' },
    pattern: { control: 'boolean' },
  }
};

export default meta;
type Story = StoryObj<typeof GradientCard>;

export const Purple: Story = {
  args: {
    title: 'Total Revenue',
    value: '$48,352',
    description: 'Monthly revenue',
    change: 12.5,
    gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    icon: <CurrencyDollarIcon className="w-6 h-6 text-white" />,
  },
};

export const Blue: Story = {
  args: {
    title: 'New Customers',
    value: '1,482',
    description: 'Growth this month',
    change: 8.2,
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2DD4BF 100%)',
    icon: <UserGroupIcon className="w-6 h-6 text-white" />,
  },
};

export const Red: Story = {
  args: {
    title: 'Bounce Rate',
    value: '24.8%',
    description: 'Visitors who leave',
    change: -3.6,
    gradient: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
    icon: <ChartBarIcon className="w-6 h-6 text-white" />,
  },
};

export const Green: Story = {
  args: {
    title: 'Conversion Rate',
    value: '18.4%',
    description: 'From visits to sales',
    change: 4.3,
    gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    icon: <BoltIcon className="w-6 h-6 text-white" />,
  },
};

export const NoPattern: Story = {
  args: {
    title: 'Orders',
    value: '835',
    description: 'New orders this week',
    change: 6.1,
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    icon: <ShoppingCartIcon className="w-6 h-6 text-white" />,
    pattern: false,
  },
};

export const NoChange: Story = {
  args: {
    title: 'Active Campaigns',
    value: '12',
    description: 'Marketing campaigns',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
    icon: <RocketLaunchIcon className="w-6 h-6 text-white" />,
  },
};

export const GradientCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      <GradientCard
        title="Total Revenue"
        value="$48,352"
        description="Monthly revenue"
        change={12.5}
        gradient="linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"
        icon={<CurrencyDollarIcon className="w-6 h-6 text-white" />}
      />
      
      <GradientCard
        title="New Customers"
        value="1,482"
        description="Growth this month"
        change={8.2}
        gradient="linear-gradient(135deg, #3B82F6 0%, #2DD4BF 100%)"
        icon={<UserGroupIcon className="w-6 h-6 text-white" />}
      />
      
      <GradientCard
        title="Conversion Rate"
        value="18.4%"
        description="From visits to sales"
        change={4.3}
        gradient="linear-gradient(135deg, #10B981 0%, #34D399 100%)"
        icon={<BoltIcon className="w-6 h-6 text-white" />}
      />
      
      <GradientCard
        title="Bounce Rate"
        value="24.8%"
        description="Visitors who leave"
        change={-3.6}
        gradient="linear-gradient(135deg, #EF4444 0%, #F97316 100%)"
        icon={<ChartBarIcon className="w-6 h-6 text-white" />}
      />
      
      <GradientCard
        title="Orders"
        value="835"
        description="New orders this week"
        change={6.1}
        gradient="linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)"
        icon={<ShoppingCartIcon className="w-6 h-6 text-white" />}
      />
      
      <GradientCard
        title="Active Campaigns"
        value="12"
        description="Marketing campaigns"
        gradient="linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)"
        icon={<RocketLaunchIcon className="w-6 h-6 text-white" />}
      />
    </div>
  ),
}; 