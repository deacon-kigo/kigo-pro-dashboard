import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Input } from "@/components/ui/input";

import { InputGroupAddon } from ".";
import { InputGroup } from "../input-group";

describe(InputGroupAddon, () => {
  describe("rendering", () => {
    it("renders children correctly", () => {
      expect.assertions(1);

      render(
        <InputGroupAddon>
          <div>Test</div>
        </InputGroupAddon>
      );

      expect(screen.getByText("Test")).toBeVisible();
    });
  });

  describe("styling", () => {
    it("applies default classes", () => {
      expect.assertions(1);

      render(<InputGroupAddon />);

      expect(screen.getByRole("group")).toHaveClass(
        "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm select-none",
        "[&>svg:not([class*='size-'])]:size-4 [&>kbd]:rounded-[calc(var(--radius)-5px)]",
        "group-data-[disabled=true]/input-group:opacity-50"
      );
    });

    it("applies custom className", () => {
      expect.assertions(1);

      render(<InputGroupAddon className="test-class" />);

      expect(screen.getByRole("group")).toHaveClass(
        "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm select-none",
        "[&>svg:not([class*='size-'])]:size-4 [&>kbd]:rounded-[calc(var(--radius)-5px)]",
        "group-data-[disabled=true]/input-group:opacity-50",
        "test-class"
      );
    });
  });

  describe("align variants", () => {
    it("renders with inline-start alignment by default", () => {
      expect.assertions(1);

      render(<InputGroupAddon align="inline-start" />);

      expect(screen.getByRole("group")).toHaveClass(
        "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]"
      );
    });

    it("renders with inline-start alignment when specified", () => {
      expect.assertions(1);

      render(<InputGroupAddon align="inline-start" />);

      expect(screen.getByRole("group")).toHaveClass(
        "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]"
      );
    });

    it("renders with inline-end alignment when specified", () => {
      expect.assertions(1);

      render(<InputGroupAddon align="inline-end" />);

      expect(screen.getByRole("group")).toHaveClass(
        "order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]"
      );
    });

    it("renders with block-start alignment when specified", () => {
      expect.assertions(1);

      render(<InputGroupAddon align="block-start" />);

      expect(screen.getByRole("group")).toHaveClass(
        "order-first w-full justify-start px-3 pt-3 [.border-b]:pb-3 group-has-[>input]/input-group:pt-2.5"
      );
    });

    it("renders with block-end alignment when specified", () => {
      expect.assertions(1);

      render(<InputGroupAddon align="block-end" />);

      expect(screen.getByRole("group")).toHaveClass(
        "order-last w-full justify-start px-3 pb-3 [.border-t]:pt-3 group-has-[>input]/input-group:pb-2.5"
      );
    });
  });

  describe("attributes", () => {
    it("has role group", () => {
      expect.assertions(1);

      render(<InputGroupAddon />);

      expect(screen.getByRole("group")).toBeVisible();
    });

    it("sets data-slot attribute to input-group-addon", () => {
      expect.assertions(1);

      render(<InputGroupAddon />);

      expect(screen.getByRole("group")).toHaveAttribute(
        "data-slot",
        "input-group-addon"
      );
    });

    it("sets data-align attribute to match align prop", () => {
      expect.assertions(1);

      render(<InputGroupAddon />);

      expect(screen.getByRole("group")).toHaveAttribute(
        "data-align",
        "inline-start"
      );
    });

    it("spreads additional props to the div element", () => {
      expect.assertions(1);

      render(<InputGroupAddon data-testid="input-group-addon" />);

      expect(screen.getByTestId("input-group-addon")).toBeVisible();
    });
  });

  describe("click behavior", () => {
    it("focuses the input element when clicked", async () => {
      expect.assertions(1);

      const user = userEvent.setup();

      render(
        <InputGroup>
          <InputGroupAddon>
            <span data-testid="input-group-addon"> Content </span>
          </InputGroupAddon>
          <Input data-testid="input" id="input" type="text" />
        </InputGroup>
      );

      await act(async () => {
        await user.click(screen.getByTestId("input-group-addon"));
      });

      expect(screen.getByTestId("input")).toHaveFocus();
    });

    it("does not focus input when clicking on a button inside", async () => {
      expect.assertions(1);

      const user = userEvent.setup();

      render(
        <InputGroup>
          <InputGroupAddon>
            <button data-testid="input-group-addon" type="button">
              {" "}
              Content{" "}
            </button>
          </InputGroupAddon>
          <Input data-testid="input" id="input" type="text" />
        </InputGroup>
      );

      await act(async () => {
        await user.click(screen.getByTestId("input-group-addon"));
      });

      expect(screen.getByTestId("input")).not.toHaveFocus();
    });
  });
});
