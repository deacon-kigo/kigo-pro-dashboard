import type { Option } from "../../types";

import type { GroupBase, OptionProps } from "react-select";
import { components } from "react-select";

import { CheckIcon } from "@heroicons/react/24/outline";

import { Highlighted } from "@/components/prod/highlighted";

const Option = <TOption extends Option, TIsMulti extends boolean>({
  children,
  ...props
}: OptionProps<TOption, TIsMulti, GroupBase<TOption>>) => (
  /*
   * react-select's default Option drops top-level JSX props and only spreads
   * `innerProps` onto the rendered div, so the data-testid has to ride along
   * inside innerProps to actually land in the DOM. See
   * https://github.com/JedWatson/react-select/blob/v5.10.2/packages/react-select/src/components/Option.tsx
   */
  <components.Option
    {...props}
    innerProps={
      {
        ...props.innerProps,
        "data-testid": "option",
      } as typeof props.innerProps
    }
  >
    <span title={children as string}>
      <Highlighted highlight={props.selectProps.inputValue}>
        {children as string}
      </Highlighted>
    </span>
    {props.isSelected && (
      <CheckIcon
        className="absolute top-1/2 right-3 size-4 translate-x-1 -translate-y-1/2"
        data-testid="check-icon"
      />
    )}
  </components.Option>
);

export { Option };
