"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { LandingPageConfig, FormField } from "@/types/tmt-campaign";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

interface FormFieldsSectionProps {
  config: LandingPageConfig;
  onUpdate: (field: string, value: any) => void;
}

const ZIPCODE_PARAM_OPTIONS = [
  { value: "zip_code", label: "zip_code" },
  { value: "zipCode", label: "zipCode" },
  { value: "zipcode", label: "zipcode" },
  { value: "postal_code", label: "postal_code" },
  { value: "postalcode", label: "postalcode" },
  { value: "postalCode", label: "postalCode" },
] as const;

export default function FormFieldsSection({
  config,
  onUpdate,
}: FormFieldsSectionProps) {
  const fields = config.formFields || [];

  const handleFieldUpdate = (
    index: number,
    key: keyof FormField,
    value: any
  ) => {
    const updated = fields.map((f, i) =>
      i === index ? { ...f, [key]: value } : f
    );
    onUpdate("formFields", updated);
  };

  const handleAddField = () => {
    const newField: FormField = {
      id: String(Date.now()),
      type: "email",
      label: "",
      placeholder: "",
      required: false,
      maxWidth: 400,
      borderRadius: 8,
    };
    onUpdate("formFields", [...fields, newField]);
  };

  const handleRemoveField = (index: number) => {
    onUpdate(
      "formFields",
      fields.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-4">
      {/* Show Form Toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="showForm">Show Form</Label>
        <Switch
          checked={config.showForm}
          onCheckedChange={(checked) => onUpdate("showForm", checked)}
        />
      </div>

      {config.showForm && (
        <>
          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No form fields configured. Add one below.
            </p>
          )}

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border rounded-md p-3 space-y-3 bg-muted/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Field {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveField(index)}
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>

              {/* Field Type */}
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select
                  value={field.type}
                  onValueChange={(value) =>
                    handleFieldUpdate(
                      index,
                      "type",
                      value as "email" | "zipcode"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="zipcode">Zip Code</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Label */}
              <div className="space-y-1.5">
                <Label>Label</Label>
                <Input
                  value={field.label}
                  onChange={(e) =>
                    handleFieldUpdate(index, "label", e.target.value)
                  }
                  placeholder="e.g. Email Address"
                />
              </div>

              {/* Placeholder */}
              <div className="space-y-1.5">
                <Label>Placeholder</Label>
                <Input
                  value={field.placeholder}
                  onChange={(e) =>
                    handleFieldUpdate(index, "placeholder", e.target.value)
                  }
                  placeholder="e.g. Enter your email"
                />
              </div>

              {/* Required Toggle */}
              <div className="flex items-center justify-between">
                <Label>Required</Label>
                <Switch
                  checked={field.required}
                  onCheckedChange={(checked) =>
                    handleFieldUpdate(index, "required", checked)
                  }
                />
              </div>

              {/* Max Width */}
              <div className="space-y-1.5">
                <Label>Max Width (px)</Label>
                <Input
                  type="number"
                  value={field.maxWidth ?? 400}
                  onChange={(e) =>
                    handleFieldUpdate(
                      index,
                      "maxWidth",
                      parseInt(e.target.value) || 400
                    )
                  }
                  placeholder="400"
                />
              </div>

              {/* Border Radius */}
              <div className="space-y-1.5">
                <Label>Border Radius (px)</Label>
                <Input
                  type="number"
                  value={field.borderRadius ?? 8}
                  onChange={(e) =>
                    handleFieldUpdate(
                      index,
                      "borderRadius",
                      parseInt(e.target.value) || 8
                    )
                  }
                  placeholder="8"
                />
              </div>

              {/* URL Param Key (zipcode only) */}
              {field.type === "zipcode" && (
                <div className="space-y-1.5">
                  <Label>URL Parameter Key</Label>
                  <Select
                    value={field.urlParamKey || "zip_code"}
                    onValueChange={(value) =>
                      handleFieldUpdate(index, "urlParamKey", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ZIPCODE_PARAM_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    The query parameter name appended to the redirect URL.
                  </p>
                </div>
              )}
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={handleAddField}
            className="w-full"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Form Field
          </Button>
        </>
      )}
    </div>
  );
}
