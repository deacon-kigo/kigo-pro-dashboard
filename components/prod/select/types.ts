interface Option<TValue extends number | string = number | string> {
  readonly isDisabled?: boolean;
  readonly isFixed?: boolean;
  readonly label: string;
  readonly value: TValue;
}

interface OptionHeightProps {
  optionHeight?: number | undefined;
}

export type { Option, OptionHeightProps };
