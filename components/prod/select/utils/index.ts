import type { Option } from "../types";

import type { ClassNamesConfig, GroupBase } from "react-select";

import { cn } from "@/components/prod/utils/cn";

const getClassNames = <TOption extends Option, TIsMulti extends boolean>({
  controlOverride,
  multiValueRemove,
}: {
  controlOverride?: string;
  multiValueRemove?: string;
} = {}): ClassNamesConfig<TOption, TIsMulti, GroupBase<TOption>> => ({
  clearIndicator: () => "!px-1 !py-0 !cursor-pointer",
  control: ({ isDisabled, selectProps }) =>
    cn(
      `!cursor-pointer !min-h-full !text-sm !px-3 !rounded-md !border !border-border !shadow-sm !bg-background
        focus-within:outline-none focus-within:ring-1 focus-within:ring-ring`,
      controlOverride,
      isDisabled ? "!cursor-not-allowed !opacity-50" : "",
      selectProps.isSearchable && "!cursor-text",
      /*
       * react-select renders its control as a div, so the aria-invalid we pass
       * through to the inner input cannot style it. Read it back off
       * selectProps so every select variant picks up the error border.
       */
      selectProps["aria-invalid"] && "!border-destructive"
    ),
  dropdownIndicator: ({ selectProps: { menuIsOpen } }) =>
    cn(
      "!pl-2 !pr-0 !py-0 !transition-transform !duration-200",
      menuIsOpen ? "!rotate-180" : ""
    ),
  indicatorSeparator: () => "!hidden",
  menu: () =>
    "!border !rounded-md !shadow-md overflow-hidden !mt-1 !min-w-full !w-auto",
  menuList: () => "!text-popover-foreground !p-1 !bg-popover",
  menuPortal: () => "!z-[1000]",
  multiValue: () => "!bg-transparent first:!ml-0 last:!mr-0 !max-w-23",
  multiValueLabel: () =>
    "bg-primary/20 !text-primary !px-1 !py-0.5 !rounded-l !rounded-r-none text-xs font-medium !truncate",
  multiValueRemove: () =>
    cn(
      "bg-primary/20 !text-primary !pr-1 !py-0.5 !rounded-r !rounded-l-none hover:!bg-primary/40",
      multiValueRemove
    ),
  noOptionsMessage: () => "!text-foreground !truncate !mx-0 !text-sm",
  /*
   * `isFocused` is the keyboard-highlighted option. It has to be styled here
   * rather than left to react-select's own focus style or a `:focus` variant:
   * DOM focus stays on the input, so the option element never matches
   * `:focus`, and the `!important` background below outranks react-select's
   * emotion rule -- without this the highlight is invisible and arrow keys
   * look inert. The background is one conditional class, never
   * `!bg-popover !bg-accent` stacked: both are `!important` at equal
   * specificity, so stylesheet order (not class order) picks the winner, and
   * popover wins that race and blanks the highlight.
   */
  option: ({ isDisabled, isFocused, isSelected }) =>
    `!h-8 !text-sm !truncate relative flex w-full cursor-default select-none items-center !rounded-sm !py-1.5 !pl-2 !pr-8 outline-none
        hover:!bg-accent hover:!text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:!opacity-50
        ${isFocused || isSelected ? "!bg-accent !text-accent-foreground" : "!bg-popover"}
        ${isDisabled ? "!opacity-50 !pointer-events-none" : "!cursor-pointer"}`,
  placeholder: () => "!text-foreground/50 !truncate !mx-0 !pl-0.5 !text-sm",
  valueContainer: () => "!flex-nowrap !text-sm !pl-0 !pr-1 !truncate",
});

export { getClassNames };
