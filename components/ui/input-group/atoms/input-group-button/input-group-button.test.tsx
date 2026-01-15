import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { InputGroupButton } from "../input-group-button";

describe("InputGroupButton", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      expect.assertions(3);

      render(<InputGroupButton>Click me</InputGroupButton>);

      const button = screen.getByRole("button");

      expect(button).toBeVisible();
      expect(button).toHaveAttribute("data-size", "xs");
      expect(button).toHaveClass(
        "flex",
        "items-center",
        "text-sm",
        "shadow-none"
      );
    });

    it("renders with custom className", () => {
      expect.assertions(1);

      render(
        <InputGroupButton className="custom-class">Button</InputGroupButton>
      );

      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });

    it("renders with children", () => {
      expect.assertions(1);

      render(<InputGroupButton>Button Text</InputGroupButton>);

      expect(screen.getByText("Button Text")).toBeVisible();
    });

    it("applies default type as button", () => {
      expect.assertions(1);

      render(<InputGroupButton>Button</InputGroupButton>);

      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    it("applies default variant as ghost", () => {
      expect.assertions(1);

      render(<InputGroupButton>Button</InputGroupButton>);

      expect(screen.getByRole("button")).toHaveClass(
        "enabled:hover:bg-accent",
        "enabled:hover:text-accent-foreground"
      );
    });
  });

  describe("size variants", () => {
    it("applies xs size styles by default", () => {
      expect.assertions(1);

      render(<InputGroupButton>Button</InputGroupButton>);

      expect(screen.getByRole("button")).toHaveClass(
        "h-6",
        "gap-1",
        "rounded-[calc(var(--radius)-5px)]",
        "px-2"
      );
    });

    it("applies icon-xs size styles", () => {
      expect.assertions(2);

      render(<InputGroupButton size="icon-xs">+</InputGroupButton>);

      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("data-size", "icon-xs");
      expect(button).toHaveClass(
        "size-6",
        "rounded-[calc(var(--radius)-5px)]",
        "p-0"
      );
    });

    it("applies icon-sm size styles", () => {
      expect.assertions(2);

      render(<InputGroupButton size="icon-sm">+</InputGroupButton>);

      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("data-size", "icon-sm");
      expect(button).toHaveClass("size-8", "p-0");
    });

    it("applies sm size styles", () => {
      expect.assertions(2);

      render(<InputGroupButton size="sm">Button</InputGroupButton>);

      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("data-size", "sm");
      expect(button).toHaveClass("h-8", "gap-1.5", "rounded-md", "px-2.5");
    });
  });

  describe("variant styles", () => {
    it("applies ghost variant by default", () => {
      expect.assertions(1);

      render(<InputGroupButton>Button</InputGroupButton>);

      expect(screen.getByRole("button")).toHaveClass(
        "enabled:hover:bg-accent",
        "enabled:hover:text-accent-foreground"
      );
    });

    it("applies custom variant", () => {
      expect.assertions(1);

      render(<InputGroupButton variant="outline">Button</InputGroupButton>);

      expect(screen.getByRole("button")).toHaveClass("border", "bg-background");
    });
  });

  describe("icon handling", () => {
    it("renders with icon", () => {
      expect.assertions(1);

      render(
        <InputGroupButton>
          <ArrowRightIcon aria-label="arrow-icon" />
        </InputGroupButton>
      );

      expect(screen.getByLabelText("arrow-icon")).toBeVisible();
    });

    it("applies svg sizing styles for xs size", () => {
      expect.assertions(1);

      render(<InputGroupButton size="xs">Button</InputGroupButton>);

      expect(screen.getByRole("button")).toHaveClass(
        "[&>svg:not([class*='size-'])]:size-3.5"
      );
    });

    it("applies has-svg padding styles", () => {
      expect.assertions(1);

      render(<InputGroupButton size="xs">Button</InputGroupButton>);

      expect(screen.getByRole("button")).toHaveClass("has-[>svg]:px-2");
    });
  });

  describe("interaction", () => {
    it("handles click events", async () => {
      expect.assertions(1);

      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<InputGroupButton onClick={handleClick}>Button</InputGroupButton>);

      await user.click(screen.getByRole("button"));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("accepts custom type prop", () => {
      expect.assertions(1);

      render(<InputGroupButton type="submit">Submit</InputGroupButton>);

      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });
  });

  describe("accessibility", () => {
    it("has button role", () => {
      expect.assertions(1);

      render(<InputGroupButton>Button</InputGroupButton>);

      expect(screen.getByRole("button")).toBeVisible();
    });

    it("accepts aria-label", () => {
      expect.assertions(1);

      render(
        <InputGroupButton aria-label="Custom label">
          <ArrowRightIcon />
        </InputGroupButton>
      );

      expect(screen.getByLabelText("Custom label")).toBeVisible();
    });
  });
});
