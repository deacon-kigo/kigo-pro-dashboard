import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./Dialog";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";

const meta: Meta<typeof Dialog> = {
  title: "Applications/Kigo Pro/Molecules/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A modal dialog component that interrupts the user with important content.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

// Basic Dialog
export const Basic: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Basic Dialog</DialogTitle>
          <DialogDescription>
            This is a basic dialog example that demonstrates the standard
            layout.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>
            Dialog content goes here. This could be any content you want to
            display.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Dialog with Form
export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile information. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="John Smith" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              defaultValue="john.smith@example.com"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="mr-2">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Confirmation Dialog
export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this item? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline" className="mr-2">
              Cancel
            </Button>
          </DialogClose>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Large Dialog
export const Large: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Large Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Please read our terms of service agreement below.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          <h3 className="text-lg font-medium mb-2">1. Introduction</h3>
          <p className="mb-4">
            Welcome to Kigo Pro. By using our service, you agree to these terms,
            our Privacy Policy, and our Community Guidelines.
          </p>

          <h3 className="text-lg font-medium mb-2">2. Using our Service</h3>
          <p className="mb-4">
            You must follow any policies made available to you within the
            Services. You may use our Services only as permitted by law. We may
            suspend or stop providing our Services to you if you do not comply
            with our terms or policies or if we are investigating suspected
            misconduct.
          </p>

          <h3 className="text-lg font-medium mb-2">
            3. Privacy and Copyright Protection
          </h3>
          <p className="mb-4">
            Our privacy policies explain how we treat your personal data and
            protect your privacy when you use our Services. By using our
            Services, you agree that we can use such data in accordance with our
            privacy policies.
          </p>

          <h3 className="text-lg font-medium mb-2">
            4. Your Content in our Services
          </h3>
          <p className="mb-4">
            Some of our Services allow you to upload, submit, store, send or
            receive content. When you upload, submit, store, send or receive
            content to or through our Services, you give us a worldwide license
            to use, host, store, reproduce, modify, create derivative works,
            communicate, publish, publicly perform, publicly display and
            distribute such content.
          </p>

          <h3 className="text-lg font-medium mb-2">
            5. Software in our Services
          </h3>
          <p className="mb-4">
            When a Service requires or includes downloadable software, this
            software may update automatically on your device once a new version
            or feature is available. Some Services may let you adjust your
            automatic update settings.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>I Agree</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Custom Styling
export const CustomStyling: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Custom Dialog</Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 sm:max-w-[500px]">
        <DialogHeader className="border-b border-blue-100 pb-3">
          <DialogTitle className="text-blue-700 text-xl">
            Custom Styled Dialog
          </DialogTitle>
          <DialogDescription className="text-blue-600">
            This dialog uses custom styling to match your brand.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 px-2">
          <p className="text-gray-700 mb-4">
            You can customize the appearance of dialogs to match your
            application's design language.
          </p>
          <div className="bg-white bg-opacity-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              This is a custom section with its own styling inside the dialog.
            </p>
          </div>
        </div>
        <DialogFooter className="border-t border-blue-100 pt-3">
          <DialogClose asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
