import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

/**
 * Spacing documentation for the Kigo Design System
 */

// Dummy component for Storybook
const SpacingSystem = () => <div></div>;

const meta: Meta<typeof SpacingSystem> = {
  title: "Applications/Kigo Pro/Design System/Spacing",
  parameters: {
    docs: {
      description: {
        component:
          "Spacing system and layout guidelines for the Kigo design system.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SpacingSystem>;

// Helper component to display spacing
interface SpacingExampleProps {
  name: string;
  value: string;
  className?: string;
}

const SpacingExample = ({
  name,
  value,
  className = "",
}: SpacingExampleProps) => (
  <div className="mb-6">
    <div className="flex items-center mb-2">
      <div className="text-sm font-medium w-24">{name}</div>
      <div className="text-xs text-text-muted font-mono">{value}</div>
    </div>
    <div className={`bg-pastel-blue h-16 ${className}`}>
      <div className="bg-primary h-full"></div>
    </div>
  </div>
);

// Helper component to display grid examples
const GridExample = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-10">
    <h3 className="text-lg font-bold mb-3">{title}</h3>
    <div className="border border-gray-200 rounded-lg p-6">{children}</div>
  </div>
);

const GridItem = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-pastel-blue p-4 rounded text-center font-medium">
    {children}
  </div>
);

export const SpacingGuidelines: Story = {
  render: () => (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Spacing System</h2>

      <div className="mb-10">
        <p className="mb-4">
          The Kigo design system uses a consistent spacing scale based on 4px
          increments. This spacing scale is used for margins, paddings, and
          layout gaps to ensure consistent rhythm throughout the interface.
        </p>

        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Spacing Scale</h3>

          <SpacingExample name="0 - None" value="0px" className="w-0" />
          <SpacingExample name="px - Pixel" value="1px" className="w-px" />
          <SpacingExample name="0.5 - 2XS" value="2px" className="w-0.5" />
          <SpacingExample name="1 - XS" value="4px" className="w-1" />
          <SpacingExample name="2 - SM" value="8px" className="w-2" />
          <SpacingExample name="3 - MD" value="12px" className="w-3" />
          <SpacingExample name="4 - LG" value="16px" className="w-4" />
          <SpacingExample name="5 - XL" value="20px" className="w-5" />
          <SpacingExample name="6 - 2XL" value="24px" className="w-6" />
          <SpacingExample name="8 - 3XL" value="32px" className="w-8" />
          <SpacingExample name="10 - 4XL" value="40px" className="w-10" />
          <SpacingExample name="12 - 5XL" value="48px" className="w-12" />
          <SpacingExample name="16 - 6XL" value="64px" className="w-16" />
          <SpacingExample name="20 - 7XL" value="80px" className="w-20" />
          <SpacingExample name="24 - 8XL" value="96px" className="w-24" />
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Spacing Usage Guidelines</h2>

        <div className="space-y-4 mb-8">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold mb-2">Component Internal Spacing</h4>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>
                <strong>xs (4px)</strong>: For minimal spacing within compact
                components
              </li>
              <li>
                <strong>sm (8px)</strong>: Default padding for buttons, input
                fields
              </li>
              <li>
                <strong>md (12px)</strong>: Standard padding for cards, modals
              </li>
              <li>
                <strong>lg (16px)</strong>: Generous padding for containers and
                sections
              </li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold mb-2">Layout Spacing</h4>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>
                <strong>md-2xl (12-24px)</strong>: For spacing between related
                elements
              </li>
              <li>
                <strong>3xl-4xl (32-40px)</strong>: For spacing between content
                sections
              </li>
              <li>
                <strong>5xl+ (48px+)</strong>: For major page sections and
                vertical rhythm
              </li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold mb-2">Form Elements</h4>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>
                <strong>sm (8px)</strong>: Default padding inside form elements
              </li>
              <li>
                <strong>md-lg (12-16px)</strong>: Spacing between form fields
              </li>
              <li>
                <strong>xl-2xl (20-24px)</strong>: Spacing between form sections
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Grid System</h2>
        <p className="mb-4">
          Kigo uses a flexible 12-column grid system for layouts. The grid
          system helps create consistent, responsive layouts across different
          viewport sizes.
        </p>

        <GridExample title="12-Column Grid">
          <div className="grid grid-cols-12 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="col-span-1">
                <GridItem>{index + 1}</GridItem>
              </div>
            ))}
          </div>
        </GridExample>

        <GridExample title="Common Layout Patterns">
          <div className="space-y-8">
            <div>
              <p className="text-sm mb-2 font-medium">
                Two equal columns (6/6)
              </p>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <GridItem>6 columns</GridItem>
                </div>
                <div className="col-span-6">
                  <GridItem>6 columns</GridItem>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm mb-2 font-medium">
                Three equal columns (4/4/4)
              </p>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                  <GridItem>4 columns</GridItem>
                </div>
                <div className="col-span-4">
                  <GridItem>4 columns</GridItem>
                </div>
                <div className="col-span-4">
                  <GridItem>4 columns</GridItem>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm mb-2 font-medium">Sidebar layout (3/9)</p>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3">
                  <GridItem>Sidebar: 3 columns</GridItem>
                </div>
                <div className="col-span-9">
                  <GridItem>Main content: 9 columns</GridItem>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm mb-2 font-medium">
                Content with sidebars (3/6/3)
              </p>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3">
                  <GridItem>Left: 3 columns</GridItem>
                </div>
                <div className="col-span-6">
                  <GridItem>Main: 6 columns</GridItem>
                </div>
                <div className="col-span-3">
                  <GridItem>Right: 3 columns</GridItem>
                </div>
              </div>
            </div>
          </div>
        </GridExample>

        <GridExample title="Responsive Behavior">
          <div className="space-y-8">
            <div>
              <p className="text-sm mb-2 font-medium">
                Stack on mobile, side-by-side on desktop
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GridItem>Full width on mobile, 1/2 on desktop</GridItem>
                <GridItem>Full width on mobile, 1/2 on desktop</GridItem>
              </div>
            </div>

            <div>
              <p className="text-sm mb-2 font-medium">
                One column on mobile, three on desktop
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GridItem>1/1 on mobile, 1/3 on desktop</GridItem>
                <GridItem>1/1 on mobile, 1/3 on desktop</GridItem>
                <GridItem>1/1 on mobile, 1/3 on desktop</GridItem>
              </div>
            </div>
          </div>
        </GridExample>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Container Sizes</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Small Container (640px)
            </h3>
            <div className="mx-auto max-w-sm border-2 border-dashed border-primary p-4 rounded">
              <div className="text-center text-sm">
                For dialogs, modals, and narrow content
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Medium Container (768px)
            </h3>
            <div className="mx-auto max-w-md border-2 border-dashed border-primary p-4 rounded">
              <div className="text-center text-sm">
                For forms, sign-up flows, and focused content
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Large Container (1024px)
            </h3>
            <div className="mx-auto max-w-lg border-2 border-dashed border-primary p-4 rounded">
              <div className="text-center text-sm">
                For standard content pages
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Extra Large Container (1280px)
            </h3>
            <div className="mx-auto max-w-xl border-2 border-dashed border-primary p-4 rounded">
              <div className="text-center text-sm">
                For dashboards and data-rich pages
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
