import type { Category } from "./taxonomy";

// Flattened tree row used by the react-select multi picker. Mirrors the
// shape produced by kigo-admin-tools'
// `src/app/(protected)/components/category-select/utils/build-category-tree-options/`.
export interface CategoryOption {
  label: string;
  value: number;
  depth: number;
  parentValue: null | number;
}

// DFS from null-parent roots, producing options in render order. `depth` is
// the visual indentation level; `parentValue` lets the option render its
// connector line back to the parent row.
export function buildCategoryTreeOptions(
  categories: Category[]
): CategoryOption[] {
  const childrenMap = new Map<null | number, Category[]>();
  for (const category of categories) {
    const parentId = category.parentCategoryId;
    const list = childrenMap.get(parentId) ?? [];
    list.push(category);
    childrenMap.set(parentId, list);
  }

  const out: CategoryOption[] = [];
  const visit = (parentId: null | number, depth: number) => {
    const children = childrenMap.get(parentId) ?? [];
    for (const child of children) {
      out.push({
        depth,
        label: child.categoryName,
        parentValue: child.parentCategoryId,
        value: child.categoryId,
      });
      visit(child.categoryId, depth + 1);
    }
  };
  visit(null, 0);
  return out;
}
