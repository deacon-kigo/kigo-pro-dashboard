import type { Meta, StoryObj } from '@storybook/react';
import CircularProgress from './CircularProgress';
import { CheckIcon } from '@heroicons/react/24/outline';

const meta: Meta<typeof CircularProgress> = {
  component: CircularProgress,
  title: 'UI/Data Display/CircularProgress',
  parameters: {
    docs: {
      description: {
        component: 'A circular progress component that displays a percentage visually.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: { type: 'range', min: 50, max: 300, step: 10 } },
    strokeWidth: { control: { type: 'range', min: 2, max: 20, step: 1 } },
    color: { control: 'color' },
    trackColor: { control: 'color' },
    label: { control: 'text' },
    description: { control: 'text' },
  }
};

export default meta;
type Story = StoryObj<typeof CircularProgress>;

export const Default: Story = {
  args: {
    value: 65,
    label: '65%',
    description: 'Task completion rate',
  },
};

export const WithoutLabel: Story = {
  args: {
    value: 42,
    size: 100,
  },
};

export const CustomColors: Story = {
  args: {
    value: 80,
    label: '80%',
    color: '#3B82F6',
    trackColor: '#EFF6FF',
    strokeWidth: 8,
  },
};

export const LargeSize: Story = {
  args: {
    value: 90,
    size: 200,
    strokeWidth: 15,
    label: '90%',
    color: '#10B981',
    description: 'Excellent progress!',
  },
};

export const CustomLabel: Story = {
  args: {
    value: 100,
    size: 150,
    color: '#22C55E',
    trackColor: '#DCFCE7',
    label: <div className="flex flex-col items-center">
      <CheckIcon className="w-8 h-8 text-green-500 mb-1" />
      <span className="text-sm font-medium">Complete</span>
    </div>,
    description: 'All tasks completed successfully',
  },
};

export const ProgressGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-6 flex flex-col items-center">
        <CircularProgress 
          value={25} 
          color="#F43F5E"
          trackColor="#FEE2E2"
          label="25%" 
          size={100}
          description="Sales Goal"
        />
      </div>
      
      <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-6 flex flex-col items-center">
        <CircularProgress 
          value={50} 
          color="#8B5CF6"
          trackColor="#EDE9FE"
          label="50%" 
          size={100}
          description="Quarter Progress"
        />
      </div>
      
      <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-6 flex flex-col items-center">
        <CircularProgress 
          value={75} 
          color="#3B82F6"
          trackColor="#DBEAFE"
          label="75%" 
          size={100}
          description="Project Status"
        />
      </div>
      
      <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-6 flex flex-col items-center">
        <CircularProgress 
          value={100} 
          color="#10B981"
          trackColor="#D1FAE5"
          label={<CheckIcon className="w-6 h-6 text-green-500" />}
          size={100}
          description="Deployment Complete"
        />
      </div>
    </div>
  ),
}; 