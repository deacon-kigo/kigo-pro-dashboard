import {
  ArrowUpIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const FEEDBACK_TYPES = [
  {
    icon: ChatBubbleLeftRightIcon,
    label: "General Feedback",
    subtitle: "Share your thoughts",
  },
  {
    icon: ExclamationTriangleIcon,
    label: "Bug Report",
    subtitle: "Report a problem or issue",
  },
  {
    icon: SparklesIcon,
    label: "Feature Request",
    subtitle: "Suggest a new feature",
  },
  {
    icon: ArrowUpIcon,
    label: "Improvement",
    subtitle: "Suggest an enhancement",
  },
] as const;

export { FEEDBACK_TYPES };
