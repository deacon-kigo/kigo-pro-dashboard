export type Tone = "neutral" | "info" | "warning" | "success" | "destructive";

interface ToneClasses {
  text: string;
  bg: string;
  border: string;
  dot: string;
  pill: string;
}

/* Every class here is emitted into public/pro/prod.css; adding a new shade needs that file rebuilt. */
const TONE: Record<Tone, ToneClasses> = {
  destructive: {
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-600",
    pill: "bg-red-50 text-red-900",
    text: "text-red-800",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-600",
    pill: "bg-blue-50 text-blue-800",
    text: "text-blue-800",
  },
  neutral: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    dot: "bg-gray-400",
    pill: "bg-gray-100 text-gray-800",
    text: "text-gray-700",
  },
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    dot: "bg-green-600",
    pill: "bg-green-50 text-green-900",
    text: "text-green-800",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
    pill: "bg-amber-50 text-amber-900",
    text: "text-amber-800",
  },
};

export { TONE, type ToneClasses };
