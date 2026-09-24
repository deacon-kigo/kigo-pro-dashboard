import { components } from "react-select";

import { XMarkIcon } from "@heroicons/react/24/outline";

const ClearIndicator = (props: any) => (
  <components.ClearIndicator {...props}>
    <XMarkIcon
      className="text-foreground hover:text-destructive size-4"
      data-testid="clear-indicator"
    />
  </components.ClearIndicator>
);

export { ClearIndicator };
