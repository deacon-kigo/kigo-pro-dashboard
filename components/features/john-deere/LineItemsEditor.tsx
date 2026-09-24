import { Plus, X } from "lucide-react";

import { Button } from "@/components/prod/button";
import { cn } from "@/components/prod/utils/cn";

import { ROW_INPUT } from "./ChecklistRow";
import { money } from "./data";

interface Line {
  code: string;
  name: string;
  qty: string;
  amount: string;
}

interface LineItemsEditorProps {
  lines: Line[];
  onChange: (lines: Line[]) => void;
}

const LineField = ({
  className,
  label,
  onChange,
  value,
}: {
  className?: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) => (
  <label
    className={cn("flex min-w-0 flex-col text-sm text-gray-500", className)}
  >
    {label}
    <input
      className={cn("mt-1 min-w-0", ROW_INPUT)}
      onChange={(event) => onChange(event.target.value)}
      value={value}
    />
  </label>
);

const LineItemsEditor = ({ lines, onChange }: LineItemsEditorProps) => {
  const replace = (index: number, patch: Partial<Line>) =>
    onChange(
      lines.map((line, i) => (i === index ? { ...line, ...patch } : line))
    );

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      {lines.map((line, index) => (
        <div
          className="border-b border-gray-100 px-3 py-2"
          key={`${line.code}-${index}`}
        >
          <div className="flex items-end gap-2">
            <LineField
              className="flex-1"
              label="Part number"
              onChange={(code) => replace(index, { code })}
              value={line.code}
            />
            <LineField
              className="w-14"
              label="Qty"
              onChange={(qty) => replace(index, { qty })}
              value={line.qty}
            />
            <LineField
              className="w-28"
              label="Amount"
              onChange={(amount) => replace(index, { amount })}
              value={line.amount}
            />
            <Button
              aria-label={`Remove ${line.name || "line item"}`}
              className="w-9 shrink-0 px-0"
              color="destructive"
              onClick={() => onChange(lines.filter((_, i) => i !== index))}
              size="sm"
              variant="ghost"
            >
              <X />
            </Button>
          </div>
          <LineField
            className="mt-2"
            label="Description"
            onChange={(name) => replace(index, { name })}
            value={line.name}
          />
        </div>
      ))}
      <div className="flex items-center gap-3 bg-gray-50 px-3 py-2">
        <Button
          color="secondary"
          icon={<Plus className="size-4" />}
          onClick={() =>
            onChange([...lines, { amount: "", code: "", name: "", qty: "" }])
          }
          size="sm"
          variant="outline"
        >
          Add line item
        </Button>
        <span className="ml-auto text-base text-gray-700">
          Eligible total
          <span className="ml-2 font-mono font-semibold text-gray-900">
            {money(lines)}
          </span>
        </span>
      </div>
    </div>
  );
};

export { LineItemsEditor, type Line };
