import type { InputProps } from "@/components/prod/input";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/prod/input-group";
import { cn } from "@/components/prod/utils/cn";

interface SearchInputProps extends InputProps {}

const SearchInput = ({
  className,
  placeholder = "Search...",
  ref,
  ...props
}: SearchInputProps & { ref?: React.Ref<HTMLInputElement> }) => (
  <InputGroup className={cn("bg-white", className)}>
    <InputGroupAddon align="inline-start">
      <MagnifyingGlassIcon data-testid="search-icon" />
    </InputGroupAddon>
    <InputGroupInput
      placeholder={placeholder}
      ref={ref}
      type="search"
      {...props}
    />
  </InputGroup>
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
