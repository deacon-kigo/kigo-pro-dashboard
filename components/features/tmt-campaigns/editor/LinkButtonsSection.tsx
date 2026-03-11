"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { LandingPageConfig, LinkButton } from "@/types/tmt-campaign";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

interface LinkButtonsSectionProps {
  config: LandingPageConfig;
  onUpdate: (field: string, value: any) => void;
}

export default function LinkButtonsSection({
  config,
  onUpdate,
}: LinkButtonsSectionProps) {
  const buttons = config.linkButtons || [];

  const handleButtonUpdate = (
    index: number,
    key: keyof LinkButton,
    value: any
  ) => {
    const updated = buttons.map((b, i) =>
      i === index ? { ...b, [key]: value } : b
    );
    onUpdate("linkButtons", updated);
  };

  const handleAddButton = () => {
    const newButton: LinkButton = {
      id: String(Date.now()),
      text: "",
      url: "",
      style: "outline",
      backgroundColor: "#000000",
      textColor: "#ffffff",
      borderRadius: 6,
      maxWidth: 300,
    };
    onUpdate("linkButtons", [...buttons, newButton]);
  };

  const handleRemoveButton = (index: number) => {
    onUpdate(
      "linkButtons",
      buttons.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-4">
      {buttons.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No link buttons configured. Add one below.
        </p>
      )}

      {buttons.map((button, index) => (
        <div
          key={button.id}
          className="border rounded-md p-3 space-y-3 bg-muted/10"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Button {index + 1}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveButton(index)}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Text */}
          <div className="space-y-1.5">
            <Label>Button Text</Label>
            <Input
              value={button.text}
              onChange={(e) =>
                handleButtonUpdate(index, "text", e.target.value)
              }
              placeholder="e.g. Find a Store"
            />
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <Label>URL</Label>
            <Input
              value={button.url}
              onChange={(e) => handleButtonUpdate(index, "url", e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          {/* Style */}
          <div className="space-y-1.5">
            <Label>Style</Label>
            <Select
              value={button.style}
              onValueChange={(value) =>
                handleButtonUpdate(index, "style", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contained">Contained</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Background Color */}
          <div className="space-y-1.5">
            <Label>Background Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={button.backgroundColor}
                onChange={(e) =>
                  handleButtonUpdate(index, "backgroundColor", e.target.value)
                }
                className="h-9 w-12 rounded border cursor-pointer"
              />
              <Input
                value={button.backgroundColor}
                onChange={(e) =>
                  handleButtonUpdate(index, "backgroundColor", e.target.value)
                }
                className="flex-1"
              />
            </div>
          </div>

          {/* Text Color */}
          <div className="space-y-1.5">
            <Label>Text Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={button.textColor}
                onChange={(e) =>
                  handleButtonUpdate(index, "textColor", e.target.value)
                }
                className="h-9 w-12 rounded border cursor-pointer"
              />
              <Input
                value={button.textColor}
                onChange={(e) =>
                  handleButtonUpdate(index, "textColor", e.target.value)
                }
                className="flex-1"
              />
            </div>
          </div>

          {/* Border Radius */}
          <div className="space-y-1.5">
            <Label>Border Radius (px)</Label>
            <Input
              type="number"
              value={button.borderRadius}
              onChange={(e) =>
                handleButtonUpdate(
                  index,
                  "borderRadius",
                  parseInt(e.target.value) || 0
                )
              }
              placeholder="6"
            />
          </div>

          {/* Max Width */}
          <div className="space-y-1.5">
            <Label>Max Width (px)</Label>
            <Input
              type="number"
              value={button.maxWidth}
              onChange={(e) =>
                handleButtonUpdate(
                  index,
                  "maxWidth",
                  parseInt(e.target.value) || 300
                )
              }
              placeholder="300"
            />
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={handleAddButton}
        className="w-full"
      >
        <PlusIcon className="h-4 w-4 mr-1" />
        Add Link Button
      </Button>
    </div>
  );
}
