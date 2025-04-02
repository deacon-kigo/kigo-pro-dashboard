'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export default function CampaignForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    merchant: '',
    type: '',
    startDate: '',
    endDate: '',
    budget: '',
    description: '',
    targetAudience: '',
    discountType: 'percentage',
    discountValue: '',
  });

  const merchants = [
    { id: '1', name: 'Acme Corporation' },
    { id: '2', name: 'Widget Co' },
    { id: '3', name: 'Example LLC' },
    { id: '4', name: 'Best Store' },
    { id: '5', name: 'Premium Brands' },
  ];

  const campaignTypes = [
    'Discount',
    'Loyalty Reward',
    'Flash Sale',
    'Seasonal Promotion',
    'New Customer'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Campaign data:', formData);
    // In a real app, we would send this data to an API
    router.push('/campaigns');
  };

  const handleSaveDraft = () => {
    // Save as draft logic
    console.log('Saving as draft', formData);
    router.push('/campaigns');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter campaign title"
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">
                  Merchant
                </label>
                <div className="relative">
                  <select
                    name="merchant"
                    value={formData.merchant}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
                    required
                  >
                    <option value="" disabled>Select a merchant</option>
                    {merchants.map((merchant) => (
                      <option key={merchant.id} value={merchant.id}>
                        {merchant.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">
                  Campaign Type
                </label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
                    required
                  >
                    <option value="" disabled>Select campaign type</option>
                    {campaignTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">
                  Budget
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full pl-8 pr-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">
                  Campaign Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your campaign..."
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary h-32"
                  required
                ></textarea>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card title="Campaign Settings">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  placeholder="e.g., New customers, Returning users"
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">
                  Discount Type
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="discountType"
                      value="percentage"
                      checked={formData.discountType === 'percentage'}
                      onChange={handleChange}
                      className="text-primary"
                    />
                    <span className="ml-2 text-sm">Percentage</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="discountType"
                      value="fixed"
                      checked={formData.discountType === 'fixed'}
                      onChange={handleChange}
                      className="text-primary"
                    />
                    <span className="ml-2 text-sm">Fixed Amount</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">
                  {formData.discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {formData.discountType === 'percentage' ? '%' : '$'}
                  </span>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full pl-8 pr-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    min="0"
                    step={formData.discountType === 'percentage' ? '1' : '0.01'}
                    max={formData.discountType === 'percentage' ? '100' : undefined}
                  />
                </div>
              </div>
            </div>
          </Card>
          
          <div className="flex items-center justify-between space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/campaigns')}
            >
              Cancel
            </Button>
            <div className="space-x-3">
              <Button
                variant="secondary"
                type="button"
                onClick={handleSaveDraft}
              >
                Save Draft
              </Button>
              <Button
                variant="primary"
                type="submit"
              >
                Create Campaign
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
} 