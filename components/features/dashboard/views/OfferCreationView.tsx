"use client";

import React, { useState } from "react";
import { Button } from "@/components/atoms";
import Card from "@/components/atoms/Card/Card";
import { useDemoState } from "@/lib/redux/hooks";
import { PageHeader } from "@/components/molecules/PageHeader";

// Sample offer templates data
const offerTemplates = [
  {
    id: "template-1",
    name: "Percentage Discount",
    description: "Offer a percentage off the purchase price",
    parameters: ["discountPercent", "minimumPurchase", "maxDiscount"],
    icon: "🏷️",
  },
  {
    id: "template-2",
    name: "Buy One Get One",
    description: "Buy one item, get another free or at a discount",
    parameters: ["itemCategory", "discountPercent", "limit"],
    icon: "🎁",
  },
  {
    id: "template-3",
    name: "Dollar Amount Off",
    description: "Offer a fixed dollar amount off the purchase price",
    parameters: ["discountAmount", "minimumPurchase"],
    icon: "💵",
  },
  {
    id: "template-4",
    name: "Free Shipping",
    description: "Offer free shipping on qualifying purchases",
    parameters: ["minimumPurchase", "restrictions"],
    icon: "🚚",
  },
  {
    id: "template-5",
    name: "Tiered Discount",
    description: "Offer increasing discounts based on purchase amount",
    parameters: ["tierLevels", "discountPercents"],
    icon: "📊",
  },
];

// Lowes brand colors and styling
const lowesStyles = {
  primary: "#012168", // Lowes blue
  secondary: "#509e33", // Lowes green
  cardShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  gradient: {
    blue: "linear-gradient(135deg, #012168 0%, #1e3a7b 100%)",
    green: "linear-gradient(135deg, #509e33 0%, #3c8223 100%)",
    diagonal: "linear-gradient(135deg, #012168 0%, #509e33 100%)",
  },
};

// Component props interface
interface OfferCreationViewProps {
  onSave?: (offerData: any) => void;
  onCancel?: () => void;
}

export default function OfferCreationView({
  onSave = () => console.log("Offer saved"),
  onCancel = () => console.log("Creation cancelled"),
}: OfferCreationViewProps) {
  // State hooks
  const { userProfile } = useDemoState();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  return (
    <>
      <PageHeader
        title="Create New Offer"
        description="Create customized offers for your customers"
        variant="default"
        logo={
          <div className="h-14 w-24 relative">
            <img
              src="/logos/lowes-logo.png"
              alt="Lowes Logo"
              className="w-full h-full object-contain"
            />
          </div>
        }
        actions={
          <div className="flex space-x-2">
            <Button onClick={onCancel} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        }
      />

      <Card className="bg-white rounded-lg shadow-md mt-6">
        <div className="p-6">
          {!selectedTemplate ? (
            <>
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Select Offer Template
                </h2>
              </div>

              <div className="mb-6">
                <p className="text-gray-600">
                  Choose a template to quickly create a standardized offer for
                  your customers. Each template comes with predefined parameters
                  that you can customize.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offerTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all"
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{template.icon}</span>
                      <h4 className="font-medium">{template.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {template.description}
                    </p>
                    <div className="text-xs text-gray-500">
                      <span className="font-semibold">Parameters: </span>
                      {template.parameters.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {
                      offerTemplates.find((t) => t.id === selectedTemplate)
                        ?.name
                    }{" "}
                    Configuration
                  </h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Back to Templates
                </Button>
              </div>

              {selectedTemplate === "template-1" && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Percentage Discount Offer
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create a percentage-based discount that can be applied to
                      specific products or categories.
                    </p>

                    {/* Lowes Brand Styling Preview */}
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h4 className="font-medium mb-2 flex items-center">
                        <span className="text-blue-600 mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        <span>Offer Preview with Lowes Branding</span>
                      </h4>
                      <div
                        className="border border-dashed border-gray-300 p-4 rounded-lg relative overflow-hidden"
                        style={{ backgroundColor: "#FFF" }}
                      >
                        <div
                          className="absolute top-0 left-0 right-0 h-1.5"
                          style={{ backgroundColor: lowesStyles.primary }}
                        ></div>
                        <div className="flex">
                          <div className="h-16 w-20 relative mr-3 flex-shrink-0">
                            <img
                              src="/logos/lowes-logo.svg"
                              alt="Lowes Logo"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <div
                              style={{ color: lowesStyles.primary }}
                              className="font-bold text-lg"
                            >
                              20% OFF YOUR PURCHASE
                            </div>
                            <p className="text-gray-800 text-sm">
                              Valid on select home improvement items
                            </p>
                            <div className="mt-2 text-xs text-gray-500">
                              Valid until: Dec 31, 2023
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 border-t border-gray-200 pt-2 text-xs text-gray-500">
                          Use promo code:{" "}
                          <span className="font-mono font-bold">HOME20</span>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        <span className="font-semibold">Note:</span> The offer
                        appearance will follow Lowes brand guidelines
                        automatically.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left column - Customizable parameters */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                          <span className="inline-block p-1 bg-blue-100 rounded-full text-blue-500 mr-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </span>
                          Customizable Parameters
                        </h4>

                        <div className="space-y-4">
                          {/* Discount Percentage */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Discount Percentage
                            </label>
                            <div className="flex items-center">
                              <input
                                type="range"
                                min="5"
                                max="50"
                                step="5"
                                defaultValue="20"
                                className="flex-1 mr-3"
                              />
                              <div className="relative">
                                <input
                                  type="text"
                                  className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-right pr-6"
                                  defaultValue="20"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                  <span className="text-gray-500">%</span>
                                </div>
                              </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              Recommended range: 10-30% for highest engagement
                            </p>
                          </div>

                          {/* Promo Code */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Promo Code
                            </label>
                            <div className="flex">
                              <input
                                type="text"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                defaultValue="HOME20"
                              />
                              <button className="ml-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600 text-sm hover:bg-gray-200">
                                Generate
                              </button>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              Create a memorable code for your customers to use
                            </p>
                          </div>

                          {/* Validity Period */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                              </label>
                              <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                defaultValue="2023-10-01"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                              </label>
                              <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                defaultValue="2023-12-31"
                              />
                            </div>
                          </div>

                          {/* Minimum Purchase */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Minimum Purchase Amount
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="text-gray-500">$</span>
                              </div>
                              <input
                                type="number"
                                className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                defaultValue="50"
                                min="0"
                                step="5"
                              />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              Leave at $0 for no minimum purchase requirement
                            </p>
                          </div>

                          {/* Maximum Discount */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Maximum Discount
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="text-gray-500">$</span>
                              </div>
                              <input
                                type="number"
                                className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                defaultValue="100"
                                min="0"
                                step="10"
                              />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              Sets a cap on the maximum discount amount
                              (optional)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right column - Product controlled attributes */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                          <span className="inline-block p-1 bg-purple-100 rounded-full text-purple-500 mr-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                              />
                            </svg>
                          </span>
                          Product-Controlled Attributes
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Determines Redemption Options
                          </span>
                        </h4>

                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="text-sm text-gray-500 mb-2">
                            These product attributes determine where and how the
                            offer can be redeemed. They ensure consistent
                            application of promotions across channels.
                          </div>

                          {/* Product Categories */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Applicable Product Categories
                            </label>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              multiple
                              size={3}
                            >
                              <option value="all">All Products</option>
                              <option value="tools">Tools & Hardware</option>
                              <option value="electrical" selected>
                                Electrical
                              </option>
                              <option value="plumbing" selected>
                                Plumbing
                              </option>
                              <option value="paint">Paint</option>
                              <option value="flooring">Flooring</option>
                              <option value="appliances">Appliances</option>
                              <option value="garden">Garden Center</option>
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                              <span className="text-purple-600 font-semibold">
                                System controlled:
                              </span>{" "}
                              Hold Ctrl/Cmd to select multiple
                            </p>
                          </div>

                          {/* Redemption Channels */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Redemption Channels
                            </label>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="channel-online"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  defaultChecked
                                />
                                <label
                                  htmlFor="channel-online"
                                  className="ml-2 text-sm text-gray-700"
                                >
                                  Online (Lowes.com)
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="channel-mobile"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  defaultChecked
                                />
                                <label
                                  htmlFor="channel-mobile"
                                  className="ml-2 text-sm text-gray-700"
                                >
                                  Mobile App
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="channel-instore"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  defaultChecked
                                />
                                <label
                                  htmlFor="channel-instore"
                                  className="ml-2 text-sm text-gray-700"
                                >
                                  In-store
                                </label>
                              </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              <span className="text-purple-600 font-semibold">
                                System controlled:
                              </span>{" "}
                              Determines where offer can be redeemed
                            </p>
                          </div>

                          {/* Customer Segments */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Eligible Customer Segments
                            </label>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="segment-all"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label
                                  htmlFor="segment-all"
                                  className="ml-2 text-sm text-gray-700"
                                >
                                  All Customers
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="segment-pro"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  defaultChecked
                                />
                                <label
                                  htmlFor="segment-pro"
                                  className="ml-2 text-sm text-gray-700"
                                >
                                  Pro Contractors
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="segment-loyalty"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  defaultChecked
                                />
                                <label
                                  htmlFor="segment-loyalty"
                                  className="ml-2 text-sm text-gray-700"
                                >
                                  MyLowes Members
                                </label>
                              </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              <span className="text-purple-600 font-semibold">
                                System controlled:
                              </span>{" "}
                              Restricts offer to specific customer types
                            </p>
                          </div>

                          {/* Usage Limits */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Usage Limits
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  Per Customer
                                </label>
                                <input
                                  type="number"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  defaultValue="1"
                                  min="1"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  Total Redemptions
                                </label>
                                <input
                                  type="number"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  defaultValue="5000"
                                  min="1"
                                />
                              </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              <span className="text-purple-600 font-semibold">
                                System controlled:
                              </span>{" "}
                              Enforces offer redemption limits
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate !== "template-1" && (
                <div className="text-center p-8">
                  <div className="text-blue-500 mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Template Configuration
                  </h3>
                  <p className="text-gray-600 mb-4">
                    This template is still in development. Please select the
                    Percentage Discount template.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTemplate("template-1")}
                  >
                    Go to Percentage Discount
                  </Button>
                </div>
              )}

              {selectedTemplate === "template-1" && (
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onSave({ template: selectedTemplate })}
                  >
                    Continue
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </>
  );
}
