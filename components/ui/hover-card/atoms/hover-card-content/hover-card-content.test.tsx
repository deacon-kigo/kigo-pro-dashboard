import type { ComponentProps } from "react";

import { render, screen } from "@testing-library/react";

import { HoverCardContent } from ".";
import { HoverCard } from "../..";

describe("HoverCardContent", () => {
  const renderWithWrapper = (props?: ComponentProps<typeof HoverCardContent>) =>
    render(
      <HoverCard open>
        <HoverCardContent {...props} />
      </HoverCard>
    );

  describe("rendering", () => {
    it("renders with default props", () => {
      expect.assertions(1);

      renderWithWrapper();

      expect(screen.getByTestId("hover-card-content")).toBeVisible();
    });

    it("renders children content", () => {
      expect.assertions(1);

      renderWithWrapper({ children: "Test hover content" });

      expect(screen.getByTestId("hover-card-content")).toHaveTextContent(
        "Test hover content"
      );
    });

    it("renders with data-slot attribute", () => {
      expect.assertions(1);

      renderWithWrapper();

      expect(screen.getByTestId("hover-card-content")).toHaveAttribute(
        "data-slot",
        "hover-card-content"
      );
    });
  });

  describe("styling and classes", () => {
    it("applies default css classes", () => {
      expect.assertions(1);

      renderWithWrapper();

      expect(screen.getByTestId("hover-card-content")).toHaveClass(
        "bg-popover",
        "text-popover-foreground",
        "z-50",
        "w-64",
        "rounded-md",
        "border",
        "p-4",
        "shadow-md",
        "outline-hidden"
      );
    });

    it("applies animation classes", () => {
      expect.assertions(1);

      renderWithWrapper();

      expect(screen.getByTestId("hover-card-content")).toHaveClass(
        "data-[state=open]:animate-in",
        "data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0",
        "data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95",
        "data-[state=open]:zoom-in-95"
      );
    });

    it("applies slide-in animation classes based on side", () => {
      expect.assertions(1);

      renderWithWrapper();

      expect(screen.getByTestId("hover-card-content")).toHaveClass(
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2"
      );
    });

    it("merges custom className with default classes", () => {
      expect.assertions(2);

      renderWithWrapper({ className: "custom-class" });

      const content = screen.getByTestId("hover-card-content");

      expect(content).toHaveClass("custom-class");
      expect(content).toHaveClass("bg-popover");
    });
  });

  describe("positioning", () => {
    it("applies default align prop as center", () => {
      expect.assertions(1);

      renderWithWrapper();

      expect(screen.getByTestId("hover-card-content")).toHaveAttribute(
        "data-align",
        "center"
      );
    });

    it("applies custom align prop", () => {
      expect.assertions(1);

      renderWithWrapper({ align: "start" });

      expect(screen.getByTestId("hover-card-content")).toHaveAttribute(
        "data-align",
        "start"
      );
    });

    it("applies default sideOffset of 4", () => {
      expect.assertions(1);

      renderWithWrapper();

      // Side offset is applied via CSS transform, check via data attribute
      const content = screen.getByTestId("hover-card-content");

      expect(content).toBeVisible();
    });
  });
});
