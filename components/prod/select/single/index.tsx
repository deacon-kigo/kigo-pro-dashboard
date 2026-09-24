"use client";

import type { Option, OptionHeightProps } from "../types";

import { useId } from "react";
import type { ComponentProps, ReactElement } from "react";
import type { GroupBase, Options } from "react-select";
import Select from "react-select";

import { cn } from "@/components/prod/utils/cn";

import { ClearIndicator } from "../components/clear-indicator";
import { DropdownIndicator } from "../components/dropdown-indicator";
import { MenuList } from "../components/menu-list";
import { Option as OptionComponent } from "../components/option";
import { OPTION_HEIGHT } from "../constants";
import { useMenuPortalTarget } from "../use-menu-portal-target";
import { getClassNames } from "../utils";

const TypedSelect = Select as unknown as <TOption extends Option>(
  props: ComponentProps<typeof Select<TOption, false, GroupBase<TOption>>> &
    OptionHeightProps
) => ReactElement;

interface SingleSelectProps<TOption extends Option> extends Omit<
  ComponentProps<typeof Select<TOption, false, GroupBase<TOption>>>,
  "inputId" | "isMulti"
> {
  optionHeight?: number;
  options: Options<TOption>;
}

const SingleSelect = <TOption extends Option>({
  className,
  components: componentOverrides,
  id: providedId,
  isSearchable = false,
  menuPortalTarget: providedMenuPortalTarget,
  optionHeight = OPTION_HEIGHT,
  options,
  placeholder = "Select an option",
  ...props
}: SingleSelectProps<TOption>) => {
  const instanceId = useId();
  const generatedId = useId();
  const inputId = providedId ?? generatedId;
  const menuPortalTarget = useMenuPortalTarget(providedMenuPortalTarget);

  return (
    <TypedSelect<TOption>
      className={cn(className)}
      classNames={getClassNames<TOption, false>()}
      closeMenuOnSelect={true}
      components={{
        ClearIndicator,
        DropdownIndicator,
        MenuList,
        Option: OptionComponent,
        ...componentOverrides,
      }}
      inputId={inputId}
      instanceId={instanceId}
      isMulti={false}
      isSearchable={isSearchable}
      menuPlacement="auto"
      menuPortalTarget={menuPortalTarget}
      menuShouldScrollIntoView={false}
      noOptionsMessage={() => "There are no options available"}
      optionHeight={optionHeight}
      options={options}
      placeholder={placeholder}
      {...props}
    />
  );
};

export { SingleSelect };
