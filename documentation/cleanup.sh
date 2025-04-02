#!/bin/bash

# Script to cleanup redundant documentation files
# This script removes documentation files that have been consolidated into kigo-pro-dashboard-docs.md

echo "Removing redundant documentation files..."

# Files to remove
FILES_TO_REMOVE=(
  "component-reference.md"
  "development-changelog.md"
  "design-patterns.md"
  "storybook-progress.md"
  "migration.md"
  "project-structure.md"
  "coding_standards.md"
)

# Check if files exist and remove them
for file in "${FILES_TO_REMOVE[@]}"; do
  if [ -f "$file" ]; then
    echo "Removing $file"
    rm "$file"
  else
    echo "File $file not found, skipping"
  fi
done

echo "Clean up complete!"
echo "The following files have been consolidated into kigo-pro-dashboard-docs.md:"
printf -- "- %s\n" "${FILES_TO_REMOVE[@]}"
echo ""
echo "The llm-context.md file has been preserved for AI assistant context initialization."
echo "Documentation README.md has been updated to reflect the new structure." # Script executed on Wed Apr  2 11:12:42 PDT 2025
