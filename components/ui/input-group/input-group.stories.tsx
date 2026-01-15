import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { useState } from "react";

import {
  AtSymbolIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  LinkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from ".";
import { CharacterCounter } from "../character-counter";

const meta = {
  component: InputGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InputGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <MagnifyingGlassIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput id="search" placeholder="Search..." />
      </InputGroup>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="w-96">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <EnvelopeIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput id="email" placeholder="Email address" type="email" />
      </InputGroup>
    </div>
  ),
};

export const WithTextAddon: Story = {
  render: () => (
    <div className="w-96">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput id="example" placeholder="example.com" />
      </InputGroup>
    </div>
  ),
};

export const WithCurrency: Story = {
  render: () => (
    <div className="w-96">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <CurrencyDollarIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput id="amount" placeholder="0.00" type="number" />
      </InputGroup>
    </div>
  ),
};

export const WithTrailingAddon: Story = {
  render: () => (
    <div className="w-96">
      <InputGroup>
        <InputGroupInput id="username" placeholder="Username" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>@example.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const WithBothAddons: Story = {
  render: () => (
    <div className="w-96">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <AtSymbolIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput id="username" placeholder="username" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const WithBlockStartAddon: Story = {
  render: () => (
    <div className="w-96">
      <InputGroup>
        <InputGroupAddon align="block-start">
          <InputGroupText>Email address</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          id="email"
          placeholder="you@example.com"
          type="email"
        />
      </InputGroup>
    </div>
  ),
};

export const WithBlockEndAddon: Story = {
  render: () => (
    <div className="w-96">
      <InputGroup>
        <InputGroupInput
          id="url"
          placeholder="https://example.com"
          type="url"
        />
        <InputGroupAddon align="block-end">
          <InputGroupText>Website URL</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const WithTextarea: Story = {
  render: () => (
    <div className="w-96">
      <InputGroup>
        <InputGroupAddon align="block-start">
          <InputGroupText>Description</InputGroupText>
        </InputGroupAddon>
        <InputGroupTextarea
          placeholder="Enter your description here..."
          rows={4}
        />
      </InputGroup>
    </div>
  ),
};

export const TextareaWithCounter: Story = {
  render: () => {
    const [value, setValue] = useState("");

    const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;

      setValue(newValue);
    };

    return (
      <div className="w-96">
        <InputGroup>
          <InputGroupTextarea
            maxLength={500}
            onChange={handleOnChange}
            placeholder="Write your message..."
            rows={5}
            value={value}
          />
          <InputGroupAddon align="block-end">
            <InputGroupText>
              <CharacterCounter maxLength={500} value={value} />
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
    );
  },
};

export const ErrorState: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <EnvelopeIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          aria-invalid="true"
          defaultValue="invalid-email"
          id="email"
          placeholder="Email address"
          type="email"
        />
      </InputGroup>
    </div>
  ),
};

export const DisabledState: Story = {
  render: () => (
    <div className="w-96">
      <InputGroup data-disabled="true">
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <MagnifyingGlassIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput disabled id="search" placeholder="Search..." />
      </InputGroup>
    </div>
  ),
};

export const MultipleVariations: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <MagnifyingGlassIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput id="search" placeholder="Search..." />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <CurrencyDollarIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput id="amount" placeholder="Amount" type="number" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup>
        <InputGroupAddon align="block-start">
          <InputGroupText>
            <LinkIcon /> Website
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput id="url" placeholder="https://" type="url" />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon align="block-start">
          <InputGroupText>Notes</InputGroupText>
        </InputGroupAddon>
        <InputGroupTextarea
          id="notes"
          placeholder="Add your notes..."
          rows={3}
        />
        <InputGroupAddon align="block-end">
          <InputGroupText>Max 500 characters</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};
