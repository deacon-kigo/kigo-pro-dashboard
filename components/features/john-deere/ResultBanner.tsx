import { CircleCheck, CircleX, Info, type LucideIcon } from "lucide-react";

import { cn } from "@/components/prod/utils/cn";

import { TONE, type Tone } from "./tone";

const TONE_ICON: Record<Tone, LucideIcon> = {
  destructive: CircleX,
  info: Info,
  neutral: Info,
  success: CircleCheck,
  warning: Info,
};

interface ResultBannerProps {
  className?: string;
  detail?: string;
  icon?: LucideIcon;
  title: string;
  tone: Tone;
}

const ResultBanner = ({
  className,
  detail,
  icon,
  title,
  tone,
}: ResultBannerProps) => {
  const Icon = icon ?? TONE_ICON[tone];
  return (
    <div
      className={cn(
        "relative rounded-md border px-4 py-3 pl-12",
        TONE[tone].bg,
        TONE[tone].border,
        TONE[tone].text,
        className
      )}
    >
      <Icon aria-hidden className="absolute top-3.5 left-4 size-5" />
      <p className="text-base font-medium">{title}</p>
      {detail && <p className="mt-1 text-sm">{detail}</p>}
    </div>
  );
};

export { ResultBanner };
