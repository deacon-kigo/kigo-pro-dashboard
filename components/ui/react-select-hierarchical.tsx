"use client";

import React, { useState, useRef, useEffect } from "react";
import Select, {
  components,
  StylesConfig,
  MenuProps,
  ControlProps,
  MultiValueProps,
} from "react-select";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  description?: string;
  disabled?: boolean;
}

interface ReactSelectHierarchicalProps {
  data: TreeNode[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  className?: string;
  isDisabled?: boolean;
  maxDisplayValues?: number;
  helperText?: string;
}

// Custom Menu component with nested checkboxes
const CustomMenu = (props: MenuProps<any, true> & { treeData: TreeNode[] }) => {
  const { treeData, selectProps } = props;
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const isAllChildrenSelected = (node: TreeNode): boolean => {
    if (!node.children || node.children.length === 0) return false;
    return node.children.every(
      (child) =>
        selectProps.value?.some((v: any) => v.value === child.id) &&
        !child.disabled
    );
  };

  const isSomeChildrenSelected = (node: TreeNode): boolean => {
    if (!node.children || node.children.length === 0) return false;
    return node.children.some((child) =>
      selectProps.value?.some((v: any) => v.value === child.id)
    );
  };

  const handleCheckboxChange = (node: TreeNode, checked: boolean) => {
    const currentValues = selectProps.value || [];

    if (!node.children || node.children.length === 0) {
      // Leaf node - toggle single selection
      if (checked) {
        selectProps.onChange(
          [...currentValues, { label: node.name, value: node.id }],
          { action: "select-option" } as any
        );
      } else {
        selectProps.onChange(
          currentValues.filter((v: any) => v.value !== node.id),
          { action: "remove-value" } as any
        );
      }
    } else {
      // Parent node - toggle all children
      const childIds = node.children
        .filter((child) => !child.disabled)
        .map((child) => ({ label: child.name, value: child.id }));

      if (checked) {
        // Add all children
        const newValues = [...currentValues];
        childIds.forEach((child) => {
          if (!newValues.some((v: any) => v.value === child.value)) {
            newValues.push(child);
          }
        });
        selectProps.onChange(newValues, { action: "select-option" } as any);
      } else {
        // Remove all children
        const childIdValues = childIds.map((c) => c.value);
        selectProps.onChange(
          currentValues.filter((v: any) => !childIdValues.includes(v.value)),
          { action: "remove-value" } as any
        );
      }
    }
  };

  const renderNode = (node: TreeNode, level: number = 0): JSX.Element => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectProps.value?.some((v: any) => v.value === node.id);
    const allChildrenSelected = hasChildren && isAllChildrenSelected(node);
    const someChildrenSelected = hasChildren && isSomeChildrenSelected(node);

    return (
      <div key={node.id}>
        {/* Node Row */}
        <div
          className={cn(
            "flex items-center gap-2 py-2 px-3 hover:bg-gray-100 cursor-pointer",
            level > 0 && "ml-6"
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) {
              toggleExpand(node.id, e);
            }
          }}
        >
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => toggleExpand(node.id, e)}
              className="p-0.5 hover:bg-gray-200 rounded flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              )}
            </button>
          ) : (
            <div className="w-5 flex-shrink-0" />
          )}

          {/* Checkbox */}
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              id={`node-${node.id}`}
              checked={hasChildren ? allChildrenSelected : isSelected}
              disabled={node.disabled}
              onCheckedChange={(checked) =>
                handleCheckboxChange(node, !!checked)
              }
              className={
                someChildrenSelected && !allChildrenSelected
                  ? "bg-primary/40 data-[state=checked]:bg-primary"
                  : ""
              }
            />
          </div>

          {/* Label */}
          <label
            htmlFor={`node-${node.id}`}
            className={cn(
              "text-sm cursor-pointer flex-1",
              level === 0 ? "font-medium text-gray-900" : "text-gray-700",
              node.disabled && "opacity-50"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {node.name}
          </label>

          {/* Child count badge */}
          {hasChildren && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {node.children.length}
            </span>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="space-y-0">
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <components.Menu {...props}>
      <div style={{ maxHeight: "320px", overflowY: "auto" }}>
        <div className="py-2">
          {treeData.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-4">
              No categories available
            </div>
          ) : (
            treeData.map((node) => renderNode(node, 0))
          )}
        </div>
      </div>
    </components.Menu>
  );
};

// Custom control with proper styling
const Control = (props: ControlProps<any, true>) => {
  return <components.Control {...props} />;
};

// Custom MultiValue component with truncation and tooltip
const MultiValue = (props: MultiValueProps<any>) => {
  const { data, index, selectProps } = props;
  const allValues = selectProps.value || [];
  const maxDisplayValues = (selectProps as any).maxDisplayValues || 2;

  // Only show the first maxDisplayValues values
  if (index >= maxDisplayValues) {
    // For the last visible item, show a +X more indicator with tooltip
    if (index === maxDisplayValues) {
      const remaining = allValues.length - maxDisplayValues;
      const remainingItems = allValues.slice(maxDisplayValues);
      const tooltipContent = remainingItems
        .map((item: any) => item.label)
        .join(", ");

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-[#e6f0ff] text-[#0052CC] px-1 py-0.5 m-0.5 rounded text-xs flex items-center font-medium truncate max-w-[60px] cursor-help">
                +{remaining} more
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-sm">{tooltipContent}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return null; // Hide other items
  }

  // Regular display for items within the maxDisplayValues limit
  return <components.MultiValue {...props} />;
};

// Custom dropdown indicator
const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </components.DropdownIndicator>
  );
};

export function ReactSelectHierarchical({
  data,
  selectedIds,
  onChange,
  placeholder = "Select categories...",
  className,
  isDisabled = false,
  maxDisplayValues = 2,
  helperText,
}: ReactSelectHierarchicalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const valueContainerRef = useRef<HTMLDivElement>(null);
  const [effectiveMaxDisplayValues, setEffectiveMaxDisplayValues] =
    useState(maxDisplayValues);

  // Flatten tree to get all nodes for value conversion
  const flattenTree = (nodes: TreeNode[]): TreeNode[] => {
    const result: TreeNode[] = [];
    const traverse = (node: TreeNode) => {
      result.push(node);
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    nodes.forEach(traverse);
    return result;
  };

  const allNodes = flattenTree(data);

  // Convert selectedIds to react-select value format and sort alphabetically
  const selectedValues = selectedIds
    .map((id) => {
      const node = allNodes.find((n) => n.id === id);
      return node ? { label: node.name, value: node.id } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a!.label.localeCompare(b!.label)) as {
    label: string;
    value: string;
  }[];

  // Dynamically calculate how many badges can fit based on actual width
  useEffect(() => {
    if (!containerRef.current || selectedValues.length === 0) return;

    const calculateFittingValues = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      // Reserve space for dropdown indicator (40px) and padding (16px)
      const availableWidth = containerWidth - 56;

      // Average badge width estimation: 8px chars + 12px padding + 24px remove button + 4px margin
      // We'll use a more conservative estimate and calculate dynamically
      let estimatedBadgeWidth = 0;
      let fittingCount = 0;

      for (let i = 0; i < selectedValues.length; i++) {
        const labelLength = selectedValues[i].label.length;
        // Approximate: 7px per character + 40px (padding + remove button + margin)
        const badgeWidth = labelLength * 7 + 40;

        if (estimatedBadgeWidth + badgeWidth < availableWidth) {
          estimatedBadgeWidth += badgeWidth;
          fittingCount++;
        } else {
          // Reserve 70px for "+X more" badge
          if (estimatedBadgeWidth + 70 < availableWidth) {
            break;
          } else {
            // Need to show one less to fit "+X more"
            fittingCount = Math.max(1, fittingCount - 1);
            break;
          }
        }
      }

      // If all fit, show all
      if (fittingCount >= selectedValues.length) {
        setEffectiveMaxDisplayValues(selectedValues.length);
      } else {
        setEffectiveMaxDisplayValues(Math.max(1, fittingCount));
      }
    };

    // Initial calculation
    calculateFittingValues();

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(() => {
      calculateFittingValues();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [selectedValues]);

  // Custom styles for react-select
  const customStyles: StylesConfig<any, true> = {
    control: (base, state) => ({
      ...base,
      minHeight: "2.5rem",
      backgroundColor: "white",
      borderColor: state.isFocused ? "rgb(59, 130, 246)" : "rgb(229, 231, 235)",
      borderRadius: "0.375rem",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.3)" : "none",
      "&:hover": {
        borderColor: state.isFocused
          ? "rgb(59, 130, 246)"
          : "rgb(209, 213, 219)",
      },
      cursor: isDisabled ? "not-allowed" : "pointer",
      opacity: isDisabled ? 0.7 : 1,
      padding: "0",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 8px",
      fontSize: "0.875rem",
      flexWrap: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      maxWidth: "calc(100% - 28px)",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#e6f0ff",
      borderRadius: "0.25rem",
      maxWidth: "calc(100% - 8px)",
      margin: "1px 2px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#0052CC",
      padding: "0 6px",
      fontSize: "0.75rem",
      fontWeight: 500,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#0052CC",
      "&:hover": {
        backgroundColor: "#cce0ff",
        color: "#003D99",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0",
      borderRadius: "0.375rem",
      overflow: "hidden",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "320px",
      overflowY: "auto",
      padding: 0,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    placeholder: (base) => ({
      ...base,
      color: "rgb(107, 114, 128)",
      fontSize: "0.875rem",
      fontWeight: 400,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "0 8px",
      color: "#64748b",
      "&:hover": {
        color: "#334155",
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: "0 8px",
      color: "#64748b",
      "&:hover": {
        color: "#334155",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  const handleChange = (newValue: any) => {
    onChange(newValue.map((option: any) => option.value));
  };

  return (
    <div className={cn(className)} ref={containerRef}>
      <Select
        isMulti
        options={[]} // We don't use options, we use the custom menu
        value={selectedValues}
        onChange={handleChange}
        placeholder={placeholder}
        styles={customStyles}
        isDisabled={isDisabled}
        components={{
          Menu: (props) => <CustomMenu {...props} treeData={data} />,
          Control,
          MultiValue: (props) => (
            <MultiValue
              {...props}
              selectProps={{
                ...props.selectProps,
                maxDisplayValues: effectiveMaxDisplayValues,
              }}
            />
          ),
          DropdownIndicator,
        }}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        isClearable
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : undefined
        }
        menuPosition="fixed"
      />
      {helperText && (
        <p className="mt-2 text-muted-foreground text-sm">{helperText}</p>
      )}
    </div>
  );
}
