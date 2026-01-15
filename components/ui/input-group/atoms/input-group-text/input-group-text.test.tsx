import { render, screen } from "@testing-library/react";

import { InputGroupText } from ".";

describe(InputGroupText, () => {
  describe("rendering", () => {
    it("renders children correctly", () => {
      expect.assertions(1);

      render(<InputGroupText>Test</InputGroupText>);

      expect(screen.getByText("Test")).toBeVisible();
    });
  });

  describe("styling", () => {
    it("applies default classes", () => {
      expect.assertions(1);

      render(<InputGroupText>Text</InputGroupText>);

      expect(screen.getByText("Text")).toHaveClass(
        "text-muted-foreground flex items-center gap-2 text-sm",
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
      );
    });

    it("applies custom className", () => {
      expect.assertions(1);

      render(<InputGroupText className="test-class">Text</InputGroupText>);

      expect(screen.getByText("Text")).toHaveClass(
        "text-muted-foreground flex items-center gap-2 text-sm",
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        "test-class"
      );
    });
  });

  describe("attributes", () => {
    it("spreads additional props to the span element", () => {
      expect.assertions(1);

      render(<InputGroupText data-testid="test-text">Text</InputGroupText>);

      expect(screen.getByTestId("test-text")).toHaveAttribute(
        "data-testid",
        "test-text"
      );
    });
  });
});
