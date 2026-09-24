import { components } from "react-select";

import { ChevronDownIcon } from "@heroicons/react/24/outline";

const DropdownIndicator = (props: any) => (
  <components.DropdownIndicator {...props}>
    <ChevronDownIcon
      className="text-foreground size-4 opacity-50"
      data-testid="dropdown-indicator"
    />
  </components.DropdownIndicator>
);

export { DropdownIndicator };
