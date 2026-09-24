import { CopyButton } from "@/components/prod/copy-button";

interface CopyCellProps {
  /** Tooltip hover text for the copy button, e.g. "Copy Offer ID". */
  label: string;
  /** Value shown in the cell and written to the clipboard when copied. */
  value: string;
}

/*
 * Table cell that displays a monospaced value alongside a copy-to-clipboard
 * button.
 */
const CopyCell = ({ label, value }: CopyCellProps) => (
  <div className="flex items-center gap-2">
    <span className="max-w-32 truncate font-mono text-xs">{value}</span>
    <CopyButton
      size="xs"
      textToCopy={value}
      tooltip={{ copiedText: "Copied!", hoverText: label }}
    />
  </div>
);

CopyCell.displayName = "CopyCell";

export { CopyCell };
