"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";

export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  description?: string;
  disabled?: boolean;
}

interface HierarchicalTreeSelectorProps {
  data: TreeNode[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  maxHeight?: string;
  showSelectedBadge?: boolean;
}

export function HierarchicalTreeSelector({
  data,
  selectedIds,
  onChange,
  placeholder = "Select items...",
  maxHeight = "max-h-80",
  showSelectedBadge = true,
}: HierarchicalTreeSelectorProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const toggleSelection = (id: string) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    onChange(newIds);
  };

  const isAllChildrenSelected = (node: TreeNode): boolean => {
    if (!node.children || node.children.length === 0) return false;
    return node.children.every(
      (child) => selectedIds.includes(child.id) && !child.disabled
    );
  };

  const isSomeChildrenSelected = (node: TreeNode): boolean => {
    if (!node.children || node.children.length === 0) return false;
    return node.children.some((child) => selectedIds.includes(child.id));
  };

  const handleParentSelection = (node: TreeNode, checked: boolean) => {
    if (!node.children || node.children.length === 0) {
      toggleSelection(node.id);
      return;
    }

    const childIds = node.children
      .filter((child) => !child.disabled)
      .map((child) => child.id);

    if (checked) {
      // Add all children
      const newIds = Array.from(new Set([...selectedIds, ...childIds]));
      onChange(newIds);
    } else {
      // Remove all children
      const newIds = selectedIds.filter((id) => !childIds.includes(id));
      onChange(newIds);
    }
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedIds.includes(node.id);
    const allChildrenSelected = hasChildren && isAllChildrenSelected(node);
    const someChildrenSelected = hasChildren && isSomeChildrenSelected(node);

    return (
      <div key={node.id}>
        {/* Node Row */}
        <div
          className={`flex items-center gap-2 py-2 hover:bg-gray-100 rounded px-2 ${
            level > 0 ? "ml-6" : ""
          }`}
        >
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggleExpand(node.id)}
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
          <Checkbox
            id={`node-${node.id}`}
            checked={hasChildren ? allChildrenSelected : isSelected}
            disabled={node.disabled}
            onCheckedChange={(checked) => {
              if (hasChildren) {
                handleParentSelection(node, !!checked);
              } else {
                toggleSelection(node.id);
              }
            }}
            className={
              someChildrenSelected && !allChildrenSelected
                ? "bg-primary/40 data-[state=checked]:bg-primary"
                : ""
            }
          />

          {/* Label */}
          <label
            htmlFor={`node-${node.id}`}
            className={`text-sm cursor-pointer flex-1 ${
              level === 0 ? "font-medium text-gray-900" : "text-gray-700"
            } ${node.disabled ? "opacity-50" : ""}`}
          >
            {node.name}
          </label>

          {/* Badge for child count */}
          {hasChildren && (
            <Badge variant="outline" className="text-xs">
              {node.children.length}
            </Badge>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="space-y-1 mt-1">
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const getSelectedNodes = () => {
    const selected: TreeNode[] = [];
    const findNodes = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        if (selectedIds.includes(node.id)) {
          selected.push(node);
        }
        if (node.children) {
          findNodes(node.children);
        }
      });
    };
    findNodes(data);
    return selected;
  };

  return (
    <div className="space-y-3">
      <div
        className={`border border-gray-200 rounded-lg p-4 bg-gray-50 ${maxHeight} overflow-y-auto`}
      >
        <div className="space-y-1">
          {data.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-4">
              {placeholder}
            </div>
          ) : (
            data.map((node) => renderNode(node, 0))
          )}
        </div>
      </div>

      {/* Selected Items Badge Display */}
      {showSelectedBadge && selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm font-medium text-blue-900">Selected:</span>
          {getSelectedNodes().map((node) => (
            <span
              key={node.id}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium"
            >
              {node.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
