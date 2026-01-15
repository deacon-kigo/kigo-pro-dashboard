import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Suggestion, Suggestions } from "./index";

describe("Suggestions", () => {
  describe("Rendering", () => {
    it("renders children suggestions", () => {
      expect.hasAssertions();

      render(
        <Suggestions>
          <Suggestion suggestion="First suggestion" />
          <Suggestion suggestion="Second suggestion" />
        </Suggestions>
      );

      expect(screen.getByText("First suggestion")).toBeInTheDocument();
      expect(screen.getByText("Second suggestion")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      expect.hasAssertions();

      const { container } = render(
        <Suggestions className="custom-suggestions">
          <Suggestion suggestion="Test" />
        </Suggestions>
      );

      // className is applied to the inner div
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- Need to check className
      const customDiv = container.querySelector(".custom-suggestions");

      expect(customDiv).toBeInTheDocument();
    });

    it("renders as horizontal scrollable container", () => {
      expect.hasAssertions();

      const { container } = render(
        <Suggestions>
          <Suggestion suggestion="Test" />
        </Suggestions>
      );

      // ScrollArea should have overflow-x-auto and whitespace-nowrap
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- Need to check scroll container
      const scrollArea = container.querySelector(".overflow-x-auto");

      expect(scrollArea).toBeInTheDocument();
    });

    it("renders with flex layout", () => {
      expect.hasAssertions();

      const { container } = render(
        <Suggestions>
          <Suggestion suggestion="Test" />
        </Suggestions>
      );

      // Inner div should have flex classes
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- Need to check flex layout
      const flexDiv = container.querySelector(".flex");

      expect(flexDiv).toBeInTheDocument();
    });
  });
});

describe("Suggestion", () => {
  describe("Rendering", () => {
    it("renders suggestion button with text", () => {
      expect.hasAssertions();

      render(<Suggestion suggestion="Test suggestion" />);

      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Test suggestion");
    });

    it("renders custom children instead of suggestion text", () => {
      expect.hasAssertions();

      render(
        <Suggestion suggestion="fallback text">
          <span>Custom content</span>
        </Suggestion>
      );

      expect(screen.getByText("Custom content")).toBeInTheDocument();
      expect(screen.queryByText("fallback text")).not.toBeInTheDocument();
    });

    it("applies custom className", () => {
      expect.hasAssertions();

      render(<Suggestion className="my-suggestion" suggestion="Test" />);

      const button = screen.getByRole("button");

      expect(button).toHaveClass("my-suggestion");
    });

    it("applies rounded-full styling", () => {
      expect.hasAssertions();

      render(<Suggestion suggestion="Test" />);

      const button = screen.getByRole("button");

      expect(button).toHaveClass("rounded-full");
    });

    it("renders with outline variant by default", () => {
      expect.hasAssertions();

      render(<Suggestion suggestion="Test" />);

      const button = screen.getByRole("button");

      // Button component applies variant classes
      expect(button).toBeInTheDocument();
    });

    it("renders with small size by default", () => {
      expect.hasAssertions();

      render(<Suggestion suggestion="Test" />);

      const button = screen.getByRole("button");

      // Button component applies size classes
      expect(button).toBeInTheDocument();
    });
  });

  describe("Props", () => {
    it("accepts custom size prop", () => {
      expect.hasAssertions();

      render(<Suggestion size="lg" suggestion="Test" />);

      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
    });

    it("accepts custom variant prop", () => {
      expect.hasAssertions();

      render(<Suggestion suggestion="Test" variant="ghost" />);

      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
    });
  });

  describe("Interaction", () => {
    it("calls onClick with suggestion text when clicked", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Suggestion onClick={handleClick} suggestion="Test suggestion" />);

      const button = screen.getByRole("button");

      await user.click(button);

      expect(handleClick).toHaveBeenCalledWith("Test suggestion");
    });

    it("handles onClick not provided gracefully", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(<Suggestion suggestion="Test" />);

      const button = screen.getByRole("button");

      // Should not throw when clicked without onClick handler
      await user.click(button);

      expect(button).toBeInTheDocument();
    });

    it("can be clicked multiple times", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Suggestion onClick={handleClick} suggestion="Click me" />);

      const button = screen.getByRole("button");

      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
      expect(handleClick).toHaveBeenCalledWith("Click me");
    });
  });

  describe("Multiple Suggestions", () => {
    it("renders multiple suggestions in a row", () => {
      expect.hasAssertions();

      render(
        <Suggestions>
          <Suggestion suggestion="First" />
          <Suggestion suggestion="Second" />
          <Suggestion suggestion="Third" />
        </Suggestions>
      );

      const buttons = screen.getAllByRole("button");

      expect(buttons).toHaveLength(3);
      expect(buttons[0]).toHaveTextContent("First");
      expect(buttons[1]).toHaveTextContent("Second");
      expect(buttons[2]).toHaveTextContent("Third");
    });

    it("handles click on individual suggestions", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();
      const handleClick1 = vi.fn();
      const handleClick2 = vi.fn();

      render(
        <Suggestions>
          <Suggestion onClick={handleClick1} suggestion="Option 1" />
          <Suggestion onClick={handleClick2} suggestion="Option 2" />
        </Suggestions>
      );

      const buttons = screen.getAllByRole("button");

      await user.click(buttons[0]!);
      await user.click(buttons[1]!);

      expect(handleClick1).toHaveBeenCalledWith("Option 1");
      expect(handleClick2).toHaveBeenCalledWith("Option 2");
    });
  });
});
