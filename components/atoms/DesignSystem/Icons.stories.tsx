import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  HomeIcon,
  UserIcon,
  DocumentTextIcon,
  BellIcon,
  CalendarIcon,
  ChartBarIcon,
  CogIcon,
  ShoppingBagIcon,
  PlusIcon,
  CheckIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  PaperAirplaneIcon,
  StarIcon,
  HeartIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

/**
 * Icon system documentation for the Kigo Design System
 */

// Dummy component for Storybook
const IconSystem = () => <div></div>;

const meta: Meta<typeof IconSystem> = {
  title: "Applications/Kigo Pro/Design System/Icons",
  parameters: {
    docs: {
      description: {
        component:
          "Icon system and usage guidelines for the Kigo design system.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconSystem>;

// Helper component to display an icon
interface IconExampleProps {
  name: string;
  icon: React.ReactNode;
  category: string;
}

const IconDisplay = ({ name, icon, category }: IconExampleProps) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center mb-2">
      <div className="w-6 h-6 text-text-dark">{icon}</div>
    </div>
    <span className="text-xs font-medium text-text-dark">{name}</span>
    <span className="text-xs text-text-muted">{category}</span>
  </div>
);

// Organize icons by category
const navigationIcons = [
  { name: "Home", icon: <HomeIcon />, category: "Navigation" },
  { name: "User", icon: <UserIcon />, category: "Navigation" },
  { name: "Document", icon: <DocumentTextIcon />, category: "Navigation" },
  { name: "Calendar", icon: <CalendarIcon />, category: "Navigation" },
  { name: "Chart", icon: <ChartBarIcon />, category: "Navigation" },
  { name: "Settings", icon: <CogIcon />, category: "Navigation" },
  { name: "Shopping", icon: <ShoppingBagIcon />, category: "Navigation" },
  { name: "Bell", icon: <BellIcon />, category: "Navigation" },
];

const actionIcons = [
  { name: "Plus", icon: <PlusIcon />, category: "Action" },
  { name: "Check", icon: <CheckIcon />, category: "Action" },
  { name: "X Mark", icon: <XMarkIcon />, category: "Action" },
  { name: "Search", icon: <MagnifyingGlassIcon />, category: "Action" },
  { name: "Pencil", icon: <PencilIcon />, category: "Action" },
  { name: "Trash", icon: <TrashIcon />, category: "Action" },
  { name: "Send", icon: <PaperAirplaneIcon />, category: "Action" },
  { name: "Star", icon: <StarIcon />, category: "Action" },
  { name: "Heart", icon: <HeartIcon />, category: "Action" },
  { name: "Eye", icon: <EyeIcon />, category: "Action" },
];

const directionIcons = [
  { name: "Chevron Right", icon: <ChevronRightIcon />, category: "Direction" },
  { name: "Chevron Down", icon: <ChevronDownIcon />, category: "Direction" },
  { name: "Arrow Right", icon: <ArrowRightIcon />, category: "Direction" },
  { name: "Arrow Left", icon: <ArrowLeftIcon />, category: "Direction" },
  { name: "Arrow Up", icon: <ArrowUpIcon />, category: "Direction" },
  { name: "Arrow Down", icon: <ArrowDownIcon />, category: "Direction" },
];

const statusIcons = [
  { name: "Error", icon: <ExclamationCircleIcon />, category: "Status" },
  { name: "Info", icon: <InformationCircleIcon />, category: "Status" },
  { name: "Question", icon: <QuestionMarkCircleIcon />, category: "Status" },
  { name: "Success", icon: <CheckCircleIcon />, category: "Status" },
];

export const IconGuidelines: Story = {
  render: () => (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-2">Icon System</h2>
      <p className="text-gray-600 mb-6">
        Kigo uses Heroicons as its primary icon library. Icons provide visual
        cues to help users navigate and interact with our interfaces. They
        should be used consistently and purposefully throughout the product.
      </p>

      <div className="mb-10">
        <h3 className="text-lg font-bold mb-4">Principles</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-lg border border-gray-100">
            <h4 className="font-semibold mb-2 text-primary">Clarity</h4>
            <p className="text-sm">
              Icons should clearly convey their meaning and function, with
              recognizable and universally understood symbols.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-100">
            <h4 className="font-semibold mb-2 text-primary">Consistency</h4>
            <p className="text-sm">
              Use icons consistently across products to establish a familiar
              visual language for users.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-100">
            <h4 className="font-semibold mb-2 text-primary">Simplicity</h4>
            <p className="text-sm">
              Icons should be simple and focused on core ideas, avoiding
              unnecessary details or complexity.
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-lg font-bold mb-6">Icon Library</h3>

          <div className="mb-8">
            <h4 className="text-md font-semibold mb-4 text-text-dark border-b pb-2">
              Navigation Icons
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-6">
              {navigationIcons.map((icon, index) => (
                <IconDisplay
                  key={index}
                  name={icon.name}
                  icon={icon.icon}
                  category={icon.category}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-md font-semibold mb-4 text-text-dark border-b pb-2">
              Action Icons
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-6">
              {actionIcons.map((icon, index) => (
                <IconDisplay
                  key={index}
                  name={icon.name}
                  icon={icon.icon}
                  category={icon.category}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-md font-semibold mb-4 text-text-dark border-b pb-2">
              Direction Icons
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-6">
              {directionIcons.map((icon, index) => (
                <IconDisplay
                  key={index}
                  name={icon.name}
                  icon={icon.icon}
                  category={icon.category}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-md font-semibold mb-4 text-text-dark border-b pb-2">
              Status Icons
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-6">
              {statusIcons.map((icon, index) => (
                <IconDisplay
                  key={index}
                  name={icon.name}
                  icon={icon.icon}
                  category={icon.category}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-lg font-bold mb-4">Sizes and Usage</h3>
          <p className="text-sm text-text-muted mb-6">
            Icons come in different sizes for different contexts. Choose the
            appropriate size for your use case.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-2">
                <UserIcon className="w-4 h-4 text-text-dark" />
              </div>
              <span className="text-xs font-medium text-text-dark">
                XS (16px)
              </span>
              <span className="text-xs text-text-muted">w-4 h-4</span>
              <p className="text-xs text-text-muted text-center mt-2">
                Badges, tight spaces
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-2">
                <UserIcon className="w-5 h-5 text-text-dark" />
              </div>
              <span className="text-xs font-medium text-text-dark">
                SM (20px)
              </span>
              <span className="text-xs text-text-muted">w-5 h-5</span>
              <p className="text-xs text-text-muted text-center mt-2">
                Buttons, form elements
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-2">
                <UserIcon className="w-6 h-6 text-text-dark" />
              </div>
              <span className="text-xs font-medium text-text-dark">
                MD (24px)
              </span>
              <span className="text-xs text-text-muted">w-6 h-6</span>
              <p className="text-xs text-text-muted text-center mt-2">
                General UI, navigation
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-2">
                <UserIcon className="w-8 h-8 text-text-dark" />
              </div>
              <span className="text-xs font-medium text-text-dark">
                LG (32px)
              </span>
              <span className="text-xs text-text-muted">w-8 h-8</span>
              <p className="text-xs text-text-muted text-center mt-2">
                Feature highlights, headers
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-lg font-bold mb-4">Icon + Text</h3>
          <p className="text-sm text-text-muted mb-6">
            Icons are most effective when paired with text to reinforce meaning
            and enhance comprehension.
          </p>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <h4 className="font-medium mb-4">Button Examples</h4>
              <div className="flex flex-wrap gap-4">
                <button className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg">
                  <PlusIcon className="w-5 h-5 mr-2" />
                  <span>Add Item</span>
                </button>

                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-text-dark rounded-lg">
                  <TrashIcon className="w-5 h-5 mr-2 text-red" />
                  <span>Delete</span>
                </button>

                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-text-dark rounded-lg">
                  <ArrowLeftIcon className="w-5 h-5 mr-2" />
                  <span>Back</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <h4 className="font-medium mb-4">Navigation Examples</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="flex items-center py-2 px-3 bg-blue-50 text-primary rounded-lg"
                >
                  <HomeIcon className="w-5 h-5 mr-3" />
                  <span>Dashboard</span>
                </a>

                <a
                  href="#"
                  className="flex items-center py-2 px-3 text-text-dark hover:bg-gray-50 rounded-lg"
                >
                  <UserIcon className="w-5 h-5 mr-3" />
                  <span>Profile</span>
                </a>

                <a
                  href="#"
                  className="flex items-center py-2 px-3 text-text-dark hover:bg-gray-50 rounded-lg"
                >
                  <CogIcon className="w-5 h-5 mr-3" />
                  <span>Settings</span>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <h4 className="font-medium mb-4">Status Examples</h4>
              <div className="space-y-2">
                <div className="flex items-center text-green-600">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  <span>Payment successful</span>
                </div>

                <div className="flex items-center text-red-600">
                  <ExclamationCircleIcon className="w-5 h-5 mr-2" />
                  <span>Error processing request</span>
                </div>

                <div className="flex items-center text-amber-600">
                  <InformationCircleIcon className="w-5 h-5 mr-2" />
                  <span>Your account needs verification</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-bold mb-4">
            Accessibility Considerations
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">Text Labels</h4>
              <p className="text-sm">
                Always include text alongside icons to ensure users understand
                their meaning. For icon-only buttons, include aria-label
                attributes for screen readers.
              </p>
              <div className="mt-4 bg-gray-100 p-3 rounded-md">
                <pre className="text-xs font-mono">
                  &lt;button aria-label="Delete item"&gt;
                  <br />
                  &nbsp;&nbsp;&lt;TrashIcon className="w-5 h-5" /&gt;
                  <br />
                  &lt;/button&gt;
                </pre>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">Color Contrast</h4>
              <p className="text-sm">
                Ensure icons have sufficient color contrast against their
                background. Don't rely on color alone to convey information.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">Size</h4>
              <p className="text-sm">
                Keep icons at a reasonable size, especially for touch targets.
                For interactive icons, maintain a minimum touch target size of
                44×44 pixels.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-bold mb-4">Implementation Guidelines</h3>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold mb-4">Importing Icons</h4>
            <p className="text-sm mb-4">
              Kigo uses Heroicons. Import icons from the appropriate package
              based on your needs:
            </p>
            <div className="bg-gray-100 p-3 rounded-md">
              <pre className="text-xs font-mono">
                // For outline style (preferred)
                <br />
                import &#123; UserIcon &#125; from
                '@heroicons/react/24/outline';
                <br />
                <br />
                // For solid style
                <br />
                import &#123; UserIcon &#125; from '@heroicons/react/24/solid';
                <br />
                <br />
                // For mini style
                <br />
                import &#123; UserIcon &#125; from '@heroicons/react/20/solid';
              </pre>
            </div>

            <h4 className="font-semibold mt-6 mb-4">Using Icons</h4>
            <div className="bg-gray-100 p-3 rounded-md">
              <pre className="text-xs font-mono">
                // Standard usage with size classes
                <br />
                &lt;UserIcon className="w-6 h-6" /&gt;
                <br />
                <br />
                // With colors
                <br />
                &lt;UserIcon className="w-6 h-6 text-primary" /&gt;
                <br />
                <br />
                // In a button with text
                <br />
                &lt;button className="flex items-center"&gt;
                <br />
                &nbsp;&nbsp;&lt;UserIcon className="w-5 h-5 mr-2" /&gt;
                <br />
                &nbsp;&nbsp;Profile
                <br />
                &lt;/button&gt;
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
