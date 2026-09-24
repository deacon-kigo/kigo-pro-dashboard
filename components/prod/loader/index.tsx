import { cn } from "@/components/prod/utils/cn";

interface LoaderProps extends Partial<HTMLDivElement> {}

const Loader = ({ className }: LoaderProps) => (
  <svg
    aria-label="Loading"
    className={cn("text-primary size-4 animate-spin", className)}
    data-testid="loader"
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export { Loader };
