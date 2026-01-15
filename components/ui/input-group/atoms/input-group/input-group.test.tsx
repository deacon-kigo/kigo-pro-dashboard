import { render, screen } from "@testing-library/react";

import { InputGroup } from ".";

describe(InputGroup, () => {
  describe("rendering", () => {
    it("renders children correctly", () => {
      expect.assertions(1);

      render(
        <InputGroup>
          <div>Test</div>
        </InputGroup>
      );

      expect(screen.getByText("Test")).toBeVisible();
    });
  });

  describe("styling", () => {
    it("applies default classes", () => {
      expect.assertions(1);

      render(<InputGroup />);

      expect(screen.getByRole("group")).toHaveClass(
        "group/input-group border-input relative flex w-full items-center rounded-md border transition-[color] outline-none",
        "h-10 min-w-0 has-[>textarea]:h-auto",

        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",

        "has-[[data-slot=input-group-control]:focus-visible]:ring-offset-background has-[[data-slot=input-group-control]:focus-visible]:ring-ring",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-1",

        "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive"
      );
    });

    it("merges custom className with default classes", () => {
      expect.assertions(1);

      render(<InputGroup className="test-class" />);

      expect(screen.getByRole("group")).toHaveClass(
        "group/input-group border-input relative flex w-full items-center rounded-md border transition-[color] outline-none",
        "h-10 min-w-0 has-[>textarea]:h-auto",

        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",

        "has-[[data-slot=input-group-control]:focus-visible]:ring-offset-background has-[[data-slot=input-group-control]:focus-visible]:ring-ring",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-1",

        "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive",

        "test-class"
      );
    });
  });

  describe("attributes", () => {
    it("sets data-slot attribute to input-group", () => {
      expect.assertions(1);

      render(<InputGroup />);

      expect(screen.getByRole("group")).toHaveAttribute(
        "data-slot",
        "input-group"
      );
    });

    it("sets role attribute to group", () => {
      expect.assertions(1);

      render(<InputGroup />);

      expect(screen.getByRole("group")).toBeVisible();
    });

    it("spreads additional props to the div element", () => {
      expect.assertions(1);

      render(<InputGroup data-testid="input-group" />);

      expect(screen.getByTestId("input-group")).toBeVisible();
    });
  });
});
