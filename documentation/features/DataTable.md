# DataTable Component Architecture

## Overview

The DataTable component follows a pattern where a generic, reusable component is consumed by feature-specific table implementations. This architecture enables consistent table behavior across the application while allowing for domain-specific customization.

## Component Structure

The DataTable architecture consists of three key parts:

1. **Generic DataTable Component** (`components/organisms/DataTable/DataTable.tsx`)

   - Provides core table functionality (sorting, pagination)
   - Manages table state
   - Renders the table structure using TanStack Table (React Table)

2. **Domain-Specific Column Definitions** (e.g., `components/features/campaigns/product-filters/productFilterColumns.tsx`)

   - Defines column structure specific to a domain entity
   - Contains header, cell renderers, and sorting logic
   - Encapsulates domain-specific display logic

3. **Feature-Specific Table Components** (e.g., `components/features/campaigns/product-filters/ProductFilterTable.tsx`)
   - Connects domain-specific columns to the generic DataTable
   - Passes data to the DataTable
   - Can add additional feature-specific functionality (e.g., search and filtering)

## Implementation Details

### Generic DataTable Component

The generic DataTable component handles core table functionality:

```tsx
// components/organisms/DataTable/DataTable.tsx
export const DataTable = memo(function DataTable<TData, TValue>({
  columns,
  data,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  });

  // Render table UI
  return (
    // Table rendering code
  );
});
```

### Domain-Specific Column Definitions

Column definitions encapsulate how a specific domain entity should be displayed:

```tsx
// components/features/campaigns/product-filters/productFilterColumns.tsx
export const productFilterColumns: ColumnDef<ProductFilter>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Filter Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium text-left">{row.getValue("name")}</div>
    ),
  },
  // Other columns...
];
```

### Feature-Specific Table Components

Feature table components connect domain columns to the generic DataTable and can add additional functionality:

```tsx
// components/features/campaigns/product-filters/ProductFilterTable.tsx
export const ProductFilterTable = memo(function ProductFilterTable({
  data,
  className,
}: ProductFilterTableProps) {
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState<SearchField>("name");

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }

    const query = searchQuery.toLowerCase();
    return data.filter((filter) => {
      switch (searchField) {
        case "name":
          return filter.name.toLowerCase().includes(query);
        // Other fields...
      }
    });
  }, [data, searchQuery, searchField]);

  // Highlight search results
  const highlightedColumns = useMemo(() => {
    // Implementation of search highlighting in columns
  }, [productFilterColumns, searchQuery, searchField]);

  const columns = highlightedColumns as unknown as ColumnDef<
    unknown,
    unknown
  >[];

  return (
    <div className="space-y-4">
      <ProductFilterSearchBar onSearch={handleSearch} />
      <DataTable
        columns={columns}
        data={filteredData as unknown[]}
        className={className}
      />
    </div>
  );
});
```

## Adding Search Functionality

The DataTable architecture supports implementing search in feature-specific components:

1. **Create a Search Bar Component** (e.g., `ProductFilterSearchBar.tsx`)

   - Define searchable fields
   - Implement live search callbacks
   - Create a user-friendly interface with field selection

2. **Implement Filtering Logic in the Table Component**

   - Use `useMemo` to filter data based on search query and field
   - Update when search parameters change

3. **Implement Search Result Highlighting**
   - Dynamically modify column cell renderers to highlight matched text
   - Wrap matched text in styled spans

Example of live search implementation:

```tsx
// Search bar component
export function ProductFilterSearchBar({ onSearch }: ProductFilterSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState<SearchField>('name');

  // Auto-search on input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value, searchField);
  };

  return (
    // Search UI implementation
  );
}

// Table component filtering
const filteredData = useMemo(() => {
  if (!searchQuery.trim()) return data;

  const query = searchQuery.toLowerCase();
  return data.filter((item) => {
    // Filtering logic
  });
}, [data, searchQuery, searchField]);
```

## Best Practices

### Column Header Implementation

For sortable columns, use a consistent pattern:

```tsx
header: ({ column }) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
  >
    Column Title
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
),
```

For non-sortable columns:

```tsx
header: () => <div className="text-left font-medium">Column Title</div>,
```

### Cell Alignment

Maintain consistent alignment in cells:

```tsx
cell: ({ row }) => (
  <div className="text-left">{row.getValue("columnName")}</div>
),
```

### Consistent Styling

- Use consistent font weights across all column headers
- Align all content (headers and cells) to the left
- Use proper spacing in cells with complex content

### Search Implementation

- Implement live search for immediate feedback
- Use tab-style field selectors for better UX
- Include visual highlighting of matched text
- Filter on every input change rather than requiring form submission

## Common Pitfalls to Avoid

1. **Introducing Unnecessary Complexity**

   - Keep column definitions simple and focused
   - Avoid nesting complex components in cells

2. **Inconsistent Sorting Implementation**

   - Always use the `column.toggleSorting(column.getIsSorted() === "asc")` pattern
   - Ensure sorting state is properly managed by the DataTable component

3. **Mismatched Table Headers and Cells**

   - Ensure header and cell alignment is consistent
   - Use consistent styling (font weights, padding) across headers

4. **Type Issues with Generic Tables**

   - Use proper type assertions when connecting domain-specific columns to the generic DataTable
   - Document any required type assertions to maintain type safety

5. **Search Performance Issues**
   - Use `useMemo` to avoid unnecessary re-filtering
   - Consider debouncing for very large datasets
   - Cache filtered results appropriately

## Example Implementation

To implement a new table for a domain entity:

1. Define the entity type
2. Create column definitions
3. Create a feature-specific table component
4. Add search functionality if needed
5. Use the table in your views

See the ProductFilterTable implementation for a complete example.

## Future Enhancements

Potential enhancements to consider:

- Add row selection capabilities
- Implement column visibility toggling
- Support for expandable rows
- Advanced filtering capabilities
- Export to CSV/Excel functionality
