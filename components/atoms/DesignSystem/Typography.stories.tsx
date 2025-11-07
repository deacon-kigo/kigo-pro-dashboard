import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

/**
 * Typography documentation for the Kigo Design System
 */

// Component to display a typography specimen
interface TypographySpecimenProps {
  name: string;
  sizeClass: string;
  weightClass: string;
  lineHeightClass?: string;
  description?: string;
  fontClass?: string;
}

const TypographySpecimen: React.FC<TypographySpecimenProps> = ({
  name,
  sizeClass,
  weightClass,
  lineHeightClass = "",
  description = "",
  fontClass = "font-sans",
}) => (
  <div className="mb-8 pb-8 border-b border-gray-200">
    <div className="flex flex-wrap items-start mb-4">
      <div className="w-full md:w-1/4 mb-2 md:mb-0">
        <h4 className="font-semibold text-sm">{name}</h4>
        <p className="text-xs text-text-muted mt-1">{description}</p>
        <div className="mt-4 space-y-1">
          <p className="text-xs font-mono text-text-muted">
            Size: <span className="text-text-dark">{sizeClass}</span>
          </p>
          <p className="text-xs font-mono text-text-muted">
            Weight: <span className="text-text-dark">{weightClass}</span>
          </p>
          {lineHeightClass && (
            <p className="text-xs font-mono text-text-muted">
              Line Height:{" "}
              <span className="text-text-dark">{lineHeightClass}</span>
            </p>
          )}
          <p className="text-xs font-mono text-text-muted">
            Font: <span className="text-text-dark">{fontClass}</span>
          </p>
        </div>
      </div>
      <div className="w-full md:w-3/4">
        <div
          className={`${sizeClass} ${weightClass} ${lineHeightClass} ${fontClass}`}
        >
          The quick brown fox jumps over the lazy dog
        </div>
      </div>
    </div>
  </div>
);

// Dummy component for Storybook
const TypographySystem = () => <div></div>;

const meta: Meta<typeof TypographySystem> = {
  title: "Applications/Kigo Pro/Design System/Typography",
  parameters: {
    docs: {
      description: {
        component: "Typography system for the Kigo design system.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TypographySystem>;

export const FontFamily: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Font Families</h2>

      <div className="mb-8 pb-8 border-b border-gray-200">
        <div className="mb-4">
          <h3 className="text-lg font-bold">Inter</h3>
          <p className="text-sm text-text-muted">
            Primary font family for all UI elements
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-lg p-6 mb-6">
          <div className="font-sans text-3xl mb-6">Inter</div>
          <div className="font-sans">
            <p className="mb-4">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ
              <br />
              abcdefghijklmnopqrstuvwxyz
              <br />
              0123456789
            </p>
            <p className="text-sm text-text-muted">
              <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                font-sans
              </code>{" "}
              - Default sans-serif font for all UI elements
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Type Scale</h2>

      <TypographySpecimen
        name="Title XL"
        sizeClass="text-3xl"
        weightClass="font-bold"
        lineHeightClass="leading-loose"
        description="Used for main page titles and hero sections"
      />

      <TypographySpecimen
        name="Title LG"
        sizeClass="text-2xl"
        weightClass="font-bold"
        lineHeightClass="leading-loose"
        description="Section titles and modal headers"
      />

      <TypographySpecimen
        name="Title MD"
        sizeClass="text-xl"
        weightClass="font-semibold"
        lineHeightClass="leading-relaxed"
        description="Card titles and subsection headers"
      />

      <TypographySpecimen
        name="Title SM"
        sizeClass="text-lg"
        weightClass="font-semibold"
        lineHeightClass="leading-normal"
        description="Minor headings and emphasised content"
      />

      <TypographySpecimen
        name="Body MD"
        sizeClass="text-base"
        weightClass="font-normal"
        lineHeightClass="leading-snug"
        description="Primary body text"
      />

      <TypographySpecimen
        name="Body SM"
        sizeClass="text-sm"
        weightClass="font-normal"
        lineHeightClass="leading-tight"
        description="Secondary body text, labels, captions"
      />

      <TypographySpecimen
        name="Body XS"
        sizeClass="text-xs"
        weightClass="font-normal"
        lineHeightClass="leading-tight"
        description="Microcopy, footnotes, metadata"
      />

      <h2 className="text-2xl font-bold mb-6 mt-10">Font Weights</h2>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-1/4 mb-2 md:mb-0">
            <p className="text-sm font-semibold">Normal (400)</p>
            <p className="text-xs text-text-muted mt-1">
              <code className="bg-gray-100 px-1 py-0.5 rounded">
                font-normal
              </code>
            </p>
          </div>
          <div className="w-full md:w-3/4 text-lg font-normal">
            The quick brown fox jumps over the lazy dog
          </div>
        </div>

        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-1/4 mb-2 md:mb-0">
            <p className="text-sm font-semibold">Medium (500)</p>
            <p className="text-xs text-text-muted mt-1">
              <code className="bg-gray-100 px-1 py-0.5 rounded">
                font-medium
              </code>
            </p>
          </div>
          <div className="w-full md:w-3/4 text-lg font-medium">
            The quick brown fox jumps over the lazy dog
          </div>
        </div>

        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-1/4 mb-2 md:mb-0">
            <p className="text-sm font-semibold">Semibold (600)</p>
            <p className="text-xs text-text-muted mt-1">
              <code className="bg-gray-100 px-1 py-0.5 rounded">
                font-semibold
              </code>
            </p>
          </div>
          <div className="w-full md:w-3/4 text-lg font-semibold">
            The quick brown fox jumps over the lazy dog
          </div>
        </div>

        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-1/4 mb-2 md:mb-0">
            <p className="text-sm font-semibold">Bold (700)</p>
            <p className="text-xs text-text-muted mt-1">
              <code className="bg-gray-100 px-1 py-0.5 rounded">font-bold</code>
            </p>
          </div>
          <div className="w-full md:w-3/4 text-lg font-bold">
            The quick brown fox jumps over the lazy dog
          </div>
        </div>

        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-1/4 mb-2 md:mb-0">
            <p className="text-sm font-semibold">Extrabold (800)</p>
            <p className="text-xs text-text-muted mt-1">
              <code className="bg-gray-100 px-1 py-0.5 rounded">
                font-extrabold
              </code>
            </p>
          </div>
          <div className="w-full md:w-3/4 text-lg font-extrabold">
            The quick brown fox jumps over the lazy dog
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 mt-10">Line Heights</h2>

      <div className="space-y-8">
        <div className="mb-4">
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/4 mb-2 md:mb-0">
              <p className="text-sm font-semibold">Tight (16px)</p>
              <p className="text-xs text-text-muted mt-1">
                <code className="bg-gray-100 px-1 py-0.5 rounded">
                  leading-tight
                </code>
              </p>
            </div>
            <div className="w-full md:w-3/4">
              <p className="leading-tight bg-pastel-blue bg-opacity-30 p-4 rounded">
                This text has tight line height (16px).
                <br />
                The quick brown fox jumps over the lazy dog. The five boxing
                wizards jump quickly. How vexingly quick daft zebras jump!
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/4 mb-2 md:mb-0">
              <p className="text-sm font-semibold">Snug (20px)</p>
              <p className="text-xs text-text-muted mt-1">
                <code className="bg-gray-100 px-1 py-0.5 rounded">
                  leading-snug
                </code>
              </p>
            </div>
            <div className="w-full md:w-3/4">
              <p className="leading-snug bg-pastel-green bg-opacity-30 p-4 rounded">
                This text has snug line height (20px).
                <br />
                The quick brown fox jumps over the lazy dog. The five boxing
                wizards jump quickly. How vexingly quick daft zebras jump!
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/4 mb-2 md:mb-0">
              <p className="text-sm font-semibold">Normal (24px)</p>
              <p className="text-xs text-text-muted mt-1">
                <code className="bg-gray-100 px-1 py-0.5 rounded">
                  leading-normal
                </code>
              </p>
            </div>
            <div className="w-full md:w-3/4">
              <p className="leading-normal bg-pastel-yellow bg-opacity-30 p-4 rounded">
                This text has normal line height (24px).
                <br />
                The quick brown fox jumps over the lazy dog. The five boxing
                wizards jump quickly. How vexingly quick daft zebras jump!
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/4 mb-2 md:mb-0">
              <p className="text-sm font-semibold">Relaxed (28px)</p>
              <p className="text-xs text-text-muted mt-1">
                <code className="bg-gray-100 px-1 py-0.5 rounded">
                  leading-relaxed
                </code>
              </p>
            </div>
            <div className="w-full md:w-3/4">
              <p className="leading-relaxed bg-pastel-orange bg-opacity-30 p-4 rounded">
                This text has relaxed line height (28px).
                <br />
                The quick brown fox jumps over the lazy dog. The five boxing
                wizards jump quickly. How vexingly quick daft zebras jump!
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/4 mb-2 md:mb-0">
              <p className="text-sm font-semibold">Loose (40px)</p>
              <p className="text-xs text-text-muted mt-1">
                <code className="bg-gray-100 px-1 py-0.5 rounded">
                  leading-loose
                </code>
              </p>
            </div>
            <div className="w-full md:w-3/4">
              <p className="leading-loose bg-pastel-purple bg-opacity-30 p-4 rounded">
                This text has loose line height (40px).
                <br />
                The quick brown fox jumps over the lazy dog. The five boxing
                wizards jump quickly. How vexingly quick daft zebras jump!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
