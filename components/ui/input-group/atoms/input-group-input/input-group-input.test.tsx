import { render, screen } from "@testing-library/react";

import { InputGroupInput } from ".";

describe(InputGroupInput, () => {
  describe("rendering", () => {
    it("renders the input element", () => {
      expect.assertions(1);

      render(<InputGroupInput id="test-input" />);

      expect(screen.getByRole("textbox")).toBeVisible();
    });
  });

  describe("styling", () => {
    it("applies default classes", () => {
      expect.assertions(1);

      render(<InputGroupInput id="test-input" />);

      expect(screen.getByRole("textbox")).toHaveClass(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0"
      );
    });

    it("applies custom className", () => {
      expect.assertions(1);

      render(<InputGroupInput className="test-class" id="test-input" />);

      expect(screen.getByRole("textbox")).toHaveClass(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0",
        "test-class"
      );
    });
  });

  describe("attributes", () => {
    it("sets data-slot attribute to input-group-control", () => {
      expect.assertions(1);

      render(<InputGroupInput id="test-input" />);

      expect(screen.getByRole("textbox")).toHaveAttribute(
        "data-slot",
        "input-group-control"
      );
    });

    it("spreads additional props to the input element", () => {
      expect.assertions(1);

      render(<InputGroupInput data-testid="custom-input" id="test-input" />);

      expect(screen.getByTestId("custom-input")).toBeVisible();
    });
  });
});
