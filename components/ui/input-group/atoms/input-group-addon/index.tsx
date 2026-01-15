import type { VariantProps } from "class-variance-authority";

import type { ComponentProps } from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputGroupAddonVariants = cva(
  [
    "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm select-none",
    "[&>svg:not([class*='size-'])]:size-4 [&>kbd]:rounded-[calc(var(--radius)-5px)]",
    "group-data-[disabled=true]/input-group:opacity-50",
  ],
  {
    defaultVariants: {
      align: "inline-start",
    },
    variants: {
      align: {
        "block-end":
          "order-last w-full justify-start px-3 pb-3 [.border-t]:pt-3 group-has-[>input]/input-group:pb-2.5",
        "block-start":
          "order-first w-full justify-start px-3 pt-3 [.border-b]:pb-3 group-has-[>input]/input-group:pt-2.5",
        "inline-end":
          "order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]",
        "inline-start":
          "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
      },
    },
  }
);

function InputGroupAddon({
  align = "inline-start",
  className,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  const handleOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) {
      return;
    }
    event.currentTarget.parentElement?.querySelector("input")?.focus();
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      className={cn(inputGroupAddonVariants({ align }), className)}
      data-align={align}
      data-slot="input-group-addon"
      onClick={handleOnClick}
      role="group"
      {...props}
    />
  );
}

export { InputGroupAddon };
