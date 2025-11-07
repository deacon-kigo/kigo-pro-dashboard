import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./AlertDialog";
import { Button } from "@/components/atoms/Button";

const meta: Meta<typeof AlertDialog> = {
  title: "Applications/Kigo Pro/Design System/Molecules/AlertDialog",
  component: AlertDialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A modal dialog component that interrupts the user with a critical action that requires confirmation.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

// Basic Alert Dialog
export const Basic: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Item</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the item
            and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// Confirmation with Details
export const WithDetails: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your account? All of your data will
            be permanently removed. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <div className="bg-red-50 p-4 rounded-md border border-red-100">
            <h4 className="text-sm font-semibold text-red-700 mb-1">
              You will lose:
            </h4>
            <ul className="text-sm text-red-600 list-disc pl-5">
              <li>All your campaign data and history</li>
              <li>Analytics and reporting information</li>
              <li>Saved templates and designs</li>
              <li>Account settings and preferences</li>
            </ul>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>No, keep my account</AlertDialogCancel>
          <Button variant="destructive">Yes, delete my account</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// Custom Styled Dialog
export const CustomStyled: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Publish Campaign</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-blue-700">
            Publish Campaign
          </AlertDialogTitle>
          <AlertDialogDescription className="text-blue-600">
            You're about to publish your campaign to all customers. Ready to go
            live?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <div className="bg-white bg-opacity-70 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800 mb-2 font-medium">
              Campaign Summary:
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Target audience: Loyalty members</li>
              <li>• Promotion value: 15% discount</li>
              <li>• Duration: 7 days</li>
              <li>• Potential reach: 5,000+ customers</li>
            </ul>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-blue-200">
            Review again
          </AlertDialogCancel>
          <AlertDialogAction className="bg-blue-600 hover:bg-blue-700">
            Publish now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
