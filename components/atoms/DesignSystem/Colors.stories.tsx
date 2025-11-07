import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

/**
 * Color Palette documentation for the Kigo Design System
 */

// Component to display a single color
interface ColorSwatchProps {
  colorName: string;
  colorClass: string;
  hexValue: string;
  textColorClass?: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({
  colorName,
  colorClass,
  hexValue,
  textColorClass = "text-white",
}) => (
  <div className="flex flex-col">
    <div className={`${colorClass} h-20 rounded-md mb-2 flex items-end p-2`}>
      <span className={`text-xs font-mono ${textColorClass}`}>{hexValue}</span>
    </div>
    <div className="text-sm font-medium">{colorName}</div>
  </div>
);

// Component to display a color section
interface ColorSectionProps {
  title: string;
  children: React.ReactNode;
}

const ColorSection: React.FC<ColorSectionProps> = ({ title, children }) => (
  <div className="mb-10">
    <h3 className="text-lg font-bold mb-4">{title}</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {children}
    </div>
  </div>
);

// Dummy component for Storybook
const ColorPalette = () => <div></div>;

const meta: Meta<typeof ColorPalette> = {
  title: "Applications/Kigo Pro/Design System/Foundation/Colors",
  parameters: {
    docs: {
      description: {
        component: "Color palette for the Kigo design system.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPalette>;

export const Palette: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Kigo Color System</h2>

      {/* Brand Colors */}
      <ColorSection title="Brand Colors">
        <ColorSwatch
          colorName="Primary"
          colorClass="bg-primary"
          hexValue="#4B55FD"
        />
        <ColorSwatch
          colorName="Secondary"
          colorClass="bg-secondary"
          hexValue="#CCFFFE"
          textColorClass="text-gray-900"
        />
        <ColorSwatch
          colorName="Primary Light"
          colorClass="bg-primary-light"
          hexValue="#E6E7FF"
          textColorClass="text-primary"
        />
      </ColorSection>

      {/* Neutrals */}
      <ColorSection title="Neutrals">
        <ColorSwatch
          colorName="White"
          colorClass="bg-white border border-gray-200"
          hexValue="#FFFFFF"
          textColorClass="text-gray-900"
        />
        <ColorSwatch
          colorName="Stone"
          colorClass="bg-stone"
          hexValue="#f6f5f1"
          textColorClass="text-gray-900"
        />
        <ColorSwatch
          colorName="Charcoal"
          colorClass="bg-charcoal"
          hexValue="#5A5858"
        />
        <ColorSwatch
          colorName="Black"
          colorClass="bg-black"
          hexValue="#231F20"
        />
        <ColorSwatch
          colorName="Black Grey"
          colorClass="bg-black-grey"
          hexValue="#E9E9E9"
          textColorClass="text-gray-900"
        />
        <ColorSwatch
          colorName="Gray 100"
          colorClass="bg-gray-100"
          hexValue="#E4E5E7"
          textColorClass="text-gray-900"
        />
        <ColorSwatch
          colorName="Gray 200"
          colorClass="bg-gray-200"
          hexValue="#E5E7EB"
          textColorClass="text-gray-900"
        />
        <ColorSwatch
          colorName="Gray 500"
          colorClass="bg-gray-500"
          hexValue="#717585"
        />
        <ColorSwatch
          colorName="Gray 900"
          colorClass="bg-gray-900"
          hexValue="#111827"
        />
      </ColorSection>

      {/* Semantic Colors */}
      <ColorSection title="Semantic Colors">
        <ColorSwatch
          colorName="Text Dark"
          colorClass="bg-text-dark"
          hexValue="#231F20"
        />
        <ColorSwatch
          colorName="Text Muted"
          colorClass="bg-text-muted"
          hexValue="#5A5858"
        />
        <ColorSwatch
          colorName="BG Light"
          colorClass="bg-bg-light"
          hexValue="#f6f5f1"
          textColorClass="text-gray-900"
        />
        <ColorSwatch
          colorName="Border Light"
          colorClass="bg-border-light"
          hexValue="#E4E5E7"
          textColorClass="text-gray-900"
        />
      </ColorSection>

      {/* Reds */}
      <ColorSection title="Reds">
        <ColorSwatch
          colorName="Red Light 50"
          colorClass="bg-red-light-50"
          hexValue="#FEECED"
          textColorClass="text-red"
        />
        <ColorSwatch
          colorName="Red Light 10"
          colorClass="bg-red-light-10"
          hexValue="#C63469"
        />
        <ColorSwatch colorName="Red" colorClass="bg-red" hexValue="#DC1021" />
        <ColorSwatch
          colorName="Red Dark 10"
          colorClass="bg-red-dark-10"
          hexValue="#AB0C1A"
        />
        <ColorSwatch
          colorName="Red Dark 20"
          colorClass="bg-red-dark-20"
          hexValue="#8E0916"
        />
        <ColorSwatch
          colorName="Coral"
          colorClass="bg-coral"
          hexValue="#FF4F5E"
        />
      </ColorSection>

      {/* Blues & Other Colors */}
      <ColorSection title="Blues & Other Colors">
        <ColorSwatch
          colorName="Orange"
          colorClass="bg-orange"
          hexValue="#FF8717"
        />
        <ColorSwatch colorName="Blue" colorClass="bg-blue" hexValue="#328FE5" />
        <ColorSwatch
          colorName="Blue Light 35"
          colorClass="bg-blue-light-35"
          hexValue="#E6E7FF"
          textColorClass="text-blue"
        />
        <ColorSwatch
          colorName="Sky Blue"
          colorClass="bg-sky-blue"
          hexValue="#CCFFFE"
          textColorClass="text-gray-900"
        />
        <ColorSwatch
          colorName="Dark Sky Blue"
          colorClass="bg-dark-sky-blue"
          hexValue="#25BDFE"
        />
        <ColorSwatch
          colorName="Green"
          colorClass="bg-green"
          hexValue="#77D898"
          textColorClass="text-gray-900"
        />
        <ColorSwatch
          colorName="Green 100"
          colorClass="bg-green-100"
          hexValue="#6ADFA0"
          textColorClass="text-gray-900"
        />
        <ColorSwatch
          colorName="Light Green"
          colorClass="bg-light-green"
          hexValue="#D1F7DF"
          textColorClass="text-gray-900"
        />
        <ColorSwatch
          colorName="Purple"
          colorClass="bg-purple"
          hexValue="#8941EB"
        />
        <ColorSwatch
          colorName="Light Purple"
          colorClass="bg-light-purple"
          hexValue="#E5D7FA"
          textColorClass="text-purple"
        />
      </ColorSection>

      {/* CVS Colors */}
      <ColorSection title="CVS Brand Colors">
        <ColorSwatch
          colorName="CVS Blue"
          colorClass="bg-cvs-blue"
          hexValue="#2563EB"
        />
        <ColorSwatch
          colorName="CVS Red"
          colorClass="bg-cvs-red"
          hexValue="#CC0000"
        />
      </ColorSection>

      {/* Pastel Colors */}
      <ColorSection title="Pastel Colors">
        <ColorSwatch
          colorName="Pastel Blue"
          colorClass="bg-pastel-blue"
          hexValue="#E1F0FF"
          textColorClass="text-blue"
        />
        <ColorSwatch
          colorName="Pastel Purple"
          colorClass="bg-pastel-purple"
          hexValue="#F3E8FF"
          textColorClass="text-purple"
        />
        <ColorSwatch
          colorName="Pastel Green"
          colorClass="bg-pastel-green"
          hexValue="#DCFCE7"
          textColorClass="text-green"
        />
        <ColorSwatch
          colorName="Pastel Yellow"
          colorClass="bg-pastel-yellow"
          hexValue="#FEF9C3"
          textColorClass="text-yellow-800"
        />
        <ColorSwatch
          colorName="Pastel Orange"
          colorClass="bg-pastel-orange"
          hexValue="#FFEDD5"
          textColorClass="text-orange"
        />
        <ColorSwatch
          colorName="Pastel Red"
          colorClass="bg-pastel-red"
          hexValue="#FEE2E2"
          textColorClass="text-red"
        />
        <ColorSwatch
          colorName="Pastel Pink"
          colorClass="bg-pastel-pink"
          hexValue="#FCE7F3"
          textColorClass="text-pink-700"
        />
      </ColorSection>
    </div>
  ),
};
