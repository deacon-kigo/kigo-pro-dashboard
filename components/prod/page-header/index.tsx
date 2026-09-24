import { cn } from "@/components/prod/utils/cn";

const DEFAULT_GRADIENT_COLORS = {
  from: "rgba(1, 32, 105, 0.9)",
  to: "rgba(1, 32, 105, 0.7)",
};

interface PageHeaderProps {
  actions?: React.ReactNode;
  description?: React.ReactNode;
  descriptionClassName?: string;
  emoji?: string;
  gradientColors?: {
    from: string;
    to: string;
  };
  headerClassName?: string;
  title: string;
  variant?: "aurora" | "default";
}

const PageHeader = ({
  actions,
  description,
  descriptionClassName,
  emoji = "✨",
  gradientColors = DEFAULT_GRADIENT_COLORS,
  headerClassName,
  title,
  variant = "default",
}: PageHeaderProps) => (
  <div
    className={cn(
      "relative mb-4 overflow-hidden rounded-lg shadow-sm",
      variant === "aurora" &&
        "border-aurora-blue/50 shadow-page-header-aurora border bg-white/90"
    )}
    data-testid="page-header"
    style={
      variant === "default"
        ? {
            background: `linear-gradient(135deg, ${gradientColors.from}, ${gradientColors.to})`,
          }
        : undefined
    }
  >
    {variant === "aurora" && (
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            'after:animate-aurora pointer-events-none absolute -inset-[10px] [background-image:var(--white-gradient),var(--aurora)] [mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-50 blur-[10px] invert filter will-change-transform [--aurora:repeating-linear-gradient(100deg,hsl(var(--blue-300))_10%,var(--indigo-300)_15%,hsl(var(--blue-100))_20%,var(--violet-200)_25%,hsl(var(--blue-200))_30%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-difference after:content-[""]'
          )}
        />
      </div>
    )}
    <div className="relative z-10 flex flex-col p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center">
        <span className="mr-3 text-4xl">{emoji}</span>
        <div>
          <h1
            className={cn(
              "text-2xl font-bold",
              variant === "default" ? "text-white" : "",
              headerClassName
            )}
          >
            {title}
          </h1>
          {description && (
            <p
              className={cn(
                "mt-1 text-base",
                variant === "default" ? "text-white/80" : "",
                descriptionClassName
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="mt-4 sm:mt-0">{actions}</div>}
    </div>
  </div>
);

export { PageHeader };
