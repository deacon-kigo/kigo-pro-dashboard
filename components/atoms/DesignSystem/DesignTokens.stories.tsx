import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

/**
 * Design Tokens documentation for the Kigo Design System
 */

// Dummy component for Storybook
const DesignTokens = () => <div></div>;

const meta: Meta<typeof DesignTokens> = {
  title: "Applications/Kigo Pro/Design System/Design Tokens",
  parameters: {
    docs: {
      description: {
        component:
          "Design tokens are the visual design atoms of the design system—specifically, they are named entities that store visual design attributes.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DesignTokens>;

// Helper component to display a token
interface TokenRowProps {
  name: string;
  value: string;
  variableName?: string;
  preview?: React.ReactNode;
  description?: string;
}

const TokenRow = ({
  name,
  value,
  variableName,
  preview,
  description,
}: TokenRowProps) => (
  <div className="flex items-center py-3 border-b border-gray-100 text-sm">
    <div className="w-1/4 font-medium text-text-dark">{name}</div>
    {preview && <div className="w-1/6">{preview}</div>}
    <div className="w-1/4 font-mono text-xs text-text-muted">{value}</div>
    {variableName && (
      <div className="w-1/4 font-mono text-xs text-text-muted">
        --{variableName}
      </div>
    )}
    {description && (
      <div className="w-1/4 text-xs text-text-muted">{description}</div>
    )}
  </div>
);

// Helper component for color tokens
interface ColorTokenProps {
  name: string;
  value: string;
  variableName: string;
  description?: string;
}

const ColorToken = ({
  name,
  value,
  variableName,
  description,
}: ColorTokenProps) => (
  <TokenRow
    name={name}
    value={value}
    variableName={variableName}
    preview={
      <div
        className="w-8 h-8 rounded-md"
        style={{ backgroundColor: value }}
      ></div>
    }
    description={description}
  />
);

// Helper component for spacing tokens
interface SpacingTokenProps {
  name: string;
  value: string;
  variableName: string;
  description?: string;
}

const SpacingToken = ({
  name,
  value,
  variableName,
  description,
}: SpacingTokenProps) => (
  <TokenRow
    name={name}
    value={value}
    variableName={variableName}
    preview={
      <div
        className="bg-gray-200"
        style={{ width: value, height: "8px" }}
      ></div>
    }
    description={description}
  />
);

// Helper component for font tokens
interface FontTokenProps {
  name: string;
  value: string;
  variableName: string;
  description?: string;
}

const FontToken = ({
  name,
  value,
  variableName,
  description,
}: FontTokenProps) => (
  <TokenRow
    name={name}
    value={value}
    variableName={variableName}
    preview={<div style={{ fontFamily: value }}>Aa</div>}
    description={description}
  />
);

// Helper component for radius tokens
interface RadiusTokenProps {
  name: string;
  value: string;
  variableName: string;
  description?: string;
}

const RadiusToken = ({
  name,
  value,
  variableName,
  description,
}: RadiusTokenProps) => (
  <TokenRow
    name={name}
    value={value}
    variableName={variableName}
    preview={
      <div
        className="w-10 h-10 bg-primary"
        style={{ borderRadius: value }}
      ></div>
    }
    description={description}
  />
);

export const DesignTokenGuidelines: Story = {
  render: () => (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-2">Design Tokens</h2>
      <p className="text-gray-600 mb-6">
        Design tokens are the visual design atoms of the design
        system—specifically, they are named entities that store visual design
        attributes. We use them in place of hardcoded values to ensure
        flexibility and maintain a consistent visual language across platforms
        and devices.
      </p>

      <div className="mb-12">
        <h3 className="text-lg font-bold mb-4">Overview</h3>

        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 mb-6">
          <h4 className="font-semibold mb-4">What are design tokens?</h4>
          <p className="text-sm mb-4">
            Design tokens are the single source of truth for the design language
            within our system. They represent the smallest visual attributes
            such as:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-2">
            <li>Colors</li>
            <li>Typography settings</li>
            <li>Spacing values</li>
            <li>Border radii</li>
            <li>Shadows</li>
            <li>Opacity levels</li>
            <li>Z-index values</li>
            <li>Animation properties</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
          <h4 className="font-semibold mb-4">Benefits of using tokens</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-sm mb-2">Consistency</h5>
              <p className="text-xs text-text-muted">
                Tokens ensure consistent visual language across different
                platforms and components.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-sm mb-2">Flexibility</h5>
              <p className="text-xs text-text-muted">
                Makes theme changes and style modifications more manageable.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-sm mb-2">Scalability</h5>
              <p className="text-xs text-text-muted">
                Changes to tokens propagate throughout the entire system,
                enabling themes and style changes at scale.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-sm mb-2">Maintenance</h5>
              <p className="text-xs text-text-muted">
                Centralized approach makes it easier to maintain and evolve the
                design system.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-lg font-bold mb-6">Color Tokens</h3>

        <div className="mb-6">
          <h4 className="text-md font-semibold mb-4 pb-2 border-b">
            Brand Colors
          </h4>
          <div>
            <ColorToken
              name="Brand / Primary"
              value="#0066FF"
              variableName="color-primary"
              description="Main brand color, used for primary actions"
            />
            <ColorToken
              name="Brand / Secondary"
              value="#6941C6"
              variableName="color-secondary"
              description="Secondary brand color, complementary to primary"
            />
            <ColorToken
              name="Brand / Tertiary"
              value="#00875A"
              variableName="color-tertiary"
              description="Third-level brand accent"
            />
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-md font-semibold mb-4 pb-2 border-b">
            Text Colors
          </h4>
          <div>
            <ColorToken
              name="Text / Dark"
              value="#101828"
              variableName="color-text-dark"
              description="Primary text color"
            />
            <ColorToken
              name="Text / Base"
              value="#475467"
              variableName="color-text-base"
              description="Standard body text"
            />
            <ColorToken
              name="Text / Muted"
              value="#667085"
              variableName="color-text-muted"
              description="Secondary or helper text"
            />
            <ColorToken
              name="Text / Light"
              value="#98A2B3"
              variableName="color-text-light"
              description="Less important text elements"
            />
            <ColorToken
              name="Text / Placeholder"
              value="#D0D5DD"
              variableName="color-text-placeholder"
              description="Placeholder text"
            />
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-md font-semibold mb-4 pb-2 border-b">
            Status Colors
          </h4>
          <div>
            <ColorToken
              name="Status / Success"
              value="#12B76A"
              variableName="color-success"
              description="Positive status, success messages"
            />
            <ColorToken
              name="Status / Warning"
              value="#F79009"
              variableName="color-warning"
              description="Alerts, warnings"
            />
            <ColorToken
              name="Status / Error"
              value="#F04438"
              variableName="color-error"
              description="Error states, destructive actions"
            />
            <ColorToken
              name="Status / Info"
              value="#0066FF"
              variableName="color-info"
              description="Informational elements"
            />
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-md font-semibold mb-4 pb-2 border-b">
            Background Colors
          </h4>
          <div>
            <ColorToken
              name="Background / White"
              value="#FFFFFF"
              variableName="color-background-white"
              description="Primary background"
            />
            <ColorToken
              name="Background / Light"
              value="#F9FAFB"
              variableName="color-background-light"
              description="Secondary background"
            />
            <ColorToken
              name="Background / Subtle"
              value="#F2F4F7"
              variableName="color-background-subtle"
              description="Background for card, containers"
            />
            <ColorToken
              name="Background / Muted"
              value="#EAECF0"
              variableName="color-background-muted"
              description="Muted background elements"
            />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-lg font-bold mb-6">Spacing Tokens</h3>

        <div className="mb-6">
          <p className="text-sm text-text-muted mb-4">
            Our spacing system is built on 4px increments, providing a
            consistent rhythm across interfaces.
          </p>

          <div>
            <SpacingToken
              name="Space 2"
              value="2px"
              variableName="spacing-2"
              description="Micro spacing for tight arrangements"
            />
            <SpacingToken
              name="Space 4"
              value="4px"
              variableName="spacing-4"
              description="Extra small elements separation"
            />
            <SpacingToken
              name="Space 8"
              value="8px"
              variableName="spacing-8"
              description="Small spacing, compact layouts"
            />
            <SpacingToken
              name="Space 12"
              value="12px"
              variableName="spacing-12"
              description="Between related elements"
            />
            <SpacingToken
              name="Space 16"
              value="16px"
              variableName="spacing-16"
              description="Standard spacing (Base unit)"
            />
            <SpacingToken
              name="Space 20"
              value="20px"
              variableName="spacing-20"
              description="Medium spacing"
            />
            <SpacingToken
              name="Space 24"
              value="24px"
              variableName="spacing-24"
              description="Large spacing for section separation"
            />
            <SpacingToken
              name="Space 32"
              value="32px"
              variableName="spacing-32"
              description="Extra large spacing between sections"
            />
            <SpacingToken
              name="Space 40"
              value="40px"
              variableName="spacing-40"
              description="For major section divisions"
            />
            <SpacingToken
              name="Space 48"
              value="48px"
              variableName="spacing-48"
              description="Large blocks separation"
            />
            <SpacingToken
              name="Space 64"
              value="64px"
              variableName="spacing-64"
              description="Page section divisions"
            />
            <SpacingToken
              name="Space 80"
              value="80px"
              variableName="spacing-80"
              description="Major page divisions"
            />
            <SpacingToken
              name="Space 96"
              value="96px"
              variableName="spacing-96"
              description="Extra large layout spacing"
            />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-lg font-bold mb-6">Border Radius Tokens</h3>

        <p className="text-sm text-text-muted mb-4">
          Border radius tokens define the roundness of UI elements, providing a
          consistent look and feel.
        </p>

        <div>
          <RadiusToken
            name="Radius None"
            value="0px"
            variableName="radius-none"
            description="No radius, square corners"
          />
          <RadiusToken
            name="Radius XS"
            value="2px"
            variableName="radius-xs"
            description="Very slight rounding"
          />
          <RadiusToken
            name="Radius SM"
            value="4px"
            variableName="radius-sm"
            description="Subtle rounding"
          />
          <RadiusToken
            name="Radius MD"
            value="8px"
            variableName="radius-md"
            description="Standard rounding for elements"
          />
          <RadiusToken
            name="Radius LG"
            value="12px"
            variableName="radius-lg"
            description="High rounding, cards, dialogs"
          />
          <RadiusToken
            name="Radius XL"
            value="16px"
            variableName="radius-xl"
            description="Very rounded elements"
          />
          <RadiusToken
            name="Radius Full"
            value="9999px"
            variableName="radius-full"
            description="Complete radius, for pills, circles"
          />
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-lg font-bold mb-6">Typography Tokens</h3>

        <p className="text-sm text-text-muted mb-4">
          Typography tokens establish a consistent type scale and font settings
          across the UI.
        </p>

        <div className="mb-6">
          <h4 className="text-md font-semibold mb-4 pb-2 border-b">
            Font Family
          </h4>
          <div>
            <FontToken
              name="Font Primary"
              value="'Inter', sans-serif"
              variableName="font-family-primary"
              description="Primary font for all UI text"
            />
            <FontToken
              name="Font Mono"
              value="'IBM Plex Mono', monospace"
              variableName="font-family-mono"
              description="For code, technical data"
            />
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-md font-semibold mb-4 pb-2 border-b">
            Font Weights
          </h4>
          <div>
            <TokenRow
              name="Font Regular"
              value="400"
              variableName="font-weight-regular"
              description="Standard body text"
            />
            <TokenRow
              name="Font Medium"
              value="500"
              variableName="font-weight-medium"
              description="Slightly emphasized text"
            />
            <TokenRow
              name="Font Semibold"
              value="600"
              variableName="font-weight-semibold"
              description="Subtitles, field labels"
            />
            <TokenRow
              name="Font Bold"
              value="700"
              variableName="font-weight-bold"
              description="Headlines, strong emphasis"
            />
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-md font-semibold mb-4 pb-2 border-b">
            Font Sizes
          </h4>
          <div>
            <TokenRow
              name="Font XS"
              value="12px"
              variableName="font-size-xs"
              description="Small supporting text"
            />
            <TokenRow
              name="Font SM"
              value="14px"
              variableName="font-size-sm"
              description="Secondary text, labels"
            />
            <TokenRow
              name="Font MD"
              value="16px"
              variableName="font-size-md"
              description="Base font size, body text"
            />
            <TokenRow
              name="Font LG"
              value="18px"
              variableName="font-size-lg"
              description="Larger body text, subtitles"
            />
            <TokenRow
              name="Font XL"
              value="20px"
              variableName="font-size-xl"
              description="Small headings, important text"
            />
            <TokenRow
              name="Font 2XL"
              value="24px"
              variableName="font-size-2xl"
              description="H3, section headings"
            />
            <TokenRow
              name="Font 3XL"
              value="30px"
              variableName="font-size-3xl"
              description="H2, page titles"
            />
            <TokenRow
              name="Font 4XL"
              value="36px"
              variableName="font-size-4xl"
              description="H1, major headings"
            />
            <TokenRow
              name="Font 5XL"
              value="48px"
              variableName="font-size-5xl"
              description="Display headings"
            />
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-md font-semibold mb-4 pb-2 border-b">
            Line Heights
          </h4>
          <div>
            <TokenRow
              name="Leading None"
              value="1"
              variableName="line-height-none"
              description="No leading, single line elements"
            />
            <TokenRow
              name="Leading Tight"
              value="1.25"
              variableName="line-height-tight"
              description="For headings"
            />
            <TokenRow
              name="Leading Snug"
              value="1.375"
              variableName="line-height-snug"
              description="Snug body text"
            />
            <TokenRow
              name="Leading Normal"
              value="1.5"
              variableName="line-height-normal"
              description="Standard body text"
            />
            <TokenRow
              name="Leading Relaxed"
              value="1.625"
              variableName="line-height-relaxed"
              description="Relaxed body text"
            />
            <TokenRow
              name="Leading Loose"
              value="2"
              variableName="line-height-loose"
              description="Very spaced out text"
            />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-lg font-bold mb-6">Shadow Tokens</h3>

        <p className="text-sm text-text-muted mb-4">
          Shadow tokens define elevation and depth within the UI, creating a
          sense of hierarchy and focus.
        </p>

        <div>
          <div className="py-4 flex items-center border-b border-gray-100">
            <div className="w-1/4 font-medium text-sm text-text-dark">
              Shadow / None
            </div>
            <div className="w-1/4 flex justify-center">
              <div className="w-16 h-16 bg-white"></div>
            </div>
            <div className="w-1/2 font-mono text-xs text-text-muted">
              box-shadow: none;
              <br />
              --shadow-none
            </div>
          </div>

          <div className="py-4 flex items-center border-b border-gray-100">
            <div className="w-1/4 font-medium text-sm text-text-dark">
              Shadow / XS
            </div>
            <div className="w-1/4 flex justify-center">
              <div className="w-16 h-16 bg-white shadow-sm"></div>
            </div>
            <div className="w-1/2 font-mono text-xs text-text-muted">
              box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
              <br />
              --shadow-xs
            </div>
          </div>

          <div className="py-4 flex items-center border-b border-gray-100">
            <div className="w-1/4 font-medium text-sm text-text-dark">
              Shadow / SM
            </div>
            <div className="w-1/4 flex justify-center">
              <div className="w-16 h-16 bg-white shadow"></div>
            </div>
            <div className="w-1/2 font-mono text-xs text-text-muted">
              box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px
              rgba(16, 24, 40, 0.06);
              <br />
              --shadow-sm
            </div>
          </div>

          <div className="py-4 flex items-center border-b border-gray-100">
            <div className="w-1/4 font-medium text-sm text-text-dark">
              Shadow / MD
            </div>
            <div className="w-1/4 flex justify-center">
              <div className="w-16 h-16 bg-white shadow-md"></div>
            </div>
            <div className="w-1/2 font-mono text-xs text-text-muted">
              box-shadow: 0px 4px 6px -1px rgba(16, 24, 40, 0.1), 0px 2px 4px
              -2px rgba(16, 24, 40, 0.06);
              <br />
              --shadow-md
            </div>
          </div>

          <div className="py-4 flex items-center border-b border-gray-100">
            <div className="w-1/4 font-medium text-sm text-text-dark">
              Shadow / LG
            </div>
            <div className="w-1/4 flex justify-center">
              <div className="w-16 h-16 bg-white shadow-lg"></div>
            </div>
            <div className="w-1/2 font-mono text-xs text-text-muted">
              box-shadow: 0px 10px 15px -3px rgba(16, 24, 40, 0.1), 0px 4px 6px
              -4px rgba(16, 24, 40, 0.05);
              <br />
              --shadow-lg
            </div>
          </div>

          <div className="py-4 flex items-center border-b border-gray-100">
            <div className="w-1/4 font-medium text-sm text-text-dark">
              Shadow / XL
            </div>
            <div className="w-1/4 flex justify-center">
              <div className="w-16 h-16 bg-white shadow-xl"></div>
            </div>
            <div className="w-1/2 font-mono text-xs text-text-muted">
              box-shadow: 0px 20px 25px -5px rgba(16, 24, 40, 0.1), 0px 8px 10px
              -6px rgba(16, 24, 40, 0.05);
              <br />
              --shadow-xl
            </div>
          </div>

          <div className="py-4 flex items-center border-b border-gray-100">
            <div className="w-1/4 font-medium text-sm text-text-dark">
              Shadow / 2XL
            </div>
            <div className="w-1/4 flex justify-center">
              <div className="w-16 h-16 bg-white shadow-2xl"></div>
            </div>
            <div className="w-1/2 font-mono text-xs text-text-muted">
              box-shadow: 0px 25px 50px -12px rgba(16, 24, 40, 0.25);
              <br />
              --shadow-2xl
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-lg font-bold mb-6">Using Design Tokens</h3>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-100 p-5">
            <h4 className="font-semibold mb-4">CSS Variables</h4>
            <p className="text-sm mb-4">
              Our design tokens are implemented as CSS custom properties
              (variables) for use in stylesheets:
            </p>
            <div className="bg-gray-50 p-3 rounded-md">
              <pre className="text-xs font-mono">
                /* In CSS */ .button-primary &#123; background-color:
                var(--color-primary); padding: var(--spacing-8)
                var(--spacing-16); border-radius: var(--radius-md); font-weight:
                var(--font-weight-medium); box-shadow: var(--shadow-sm); &#125;
              </pre>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-5">
            <h4 className="font-semibold mb-4">Tailwind CSS</h4>
            <p className="text-sm mb-4">
              When using Tailwind CSS, our tokens are mapped to the theme
              configuration:
            </p>
            <div className="bg-gray-50 p-3 rounded-md">
              <pre className="text-xs font-mono">
                /* In JSX with Tailwind classes */ &lt;button
                className="bg-primary px-4 py-2 rounded-md font-medium
                shadow-sm"&gt; Button Text &lt;/button&gt;
              </pre>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-5">
            <h4 className="font-semibold mb-4">JavaScript/TypeScript</h4>
            <p className="text-sm mb-4">
              For dynamic styling or theme manipulation, tokens are also
              available in JavaScript:
            </p>
            <div className="bg-gray-50 p-3 rounded-md">
              <pre className="text-xs font-mono">
                // In JavaScript/TypeScript import &#123; tokens &#125; from
                '@kigo/design-tokens'; const styles = &#123; backgroundColor:
                tokens.colors.primary, padding:
                `$&#123;tokens.spacing[8]&#125;px
                $&#123;tokens.spacing[16]&#125;px`, borderRadius:
                `$&#123;tokens.radius.md&#125;px`, &#125;;
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-lg font-bold mb-4">Governance and Maintenance</h3>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold mb-2">Versioning</h4>
            <p className="text-sm">
              Design tokens follow semantic versioning. Major changes that might
              break existing implementations will be released with a major
              version bump.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold mb-2">Adding New Tokens</h4>
            <p className="text-sm">
              New tokens should be proposed and reviewed by both design and
              development teams before being added to the system. Always
              consider backward compatibility and the potential impact on
              existing components.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold mb-2">Deprecation Process</h4>
            <p className="text-sm">
              Tokens being deprecated will be marked as such for at least one
              full release cycle before being removed, giving teams time to
              update their implementations.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};
