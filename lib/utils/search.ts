/**
 * Generic search utility functions for the application
 */

/**
 * Performs a fuzzy search on an array of objects based on specified fields
 * 
 * @param items Array of objects to search through
 * @param searchTerm String to search for
 * @param fields Array of field names to search within
 * @returns Filtered array of objects that match the search
 */
export function searchObjects<T>(
  items: T[],
  searchTerm: string,
  fields: (keyof T)[]
): T[] {
  if (!searchTerm.trim()) {
    return items;
  }

  const terms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
  
  return items.filter(item => {
    return terms.every(term => {
      return fields.some(field => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        
        // Handle nested objects
        if (typeof value === 'object') {
          return Object.values(value).some(
            v => v !== null && 
                 v !== undefined && 
                 String(v).toLowerCase().includes(term)
          );
        }
        
        return String(value).toLowerCase().includes(term);
      });
    });
  });
}

/**
 * Sorts an array of objects by a specified field
 * 
 * @param items Array of objects to sort
 * @param field Field to sort by
 * @param direction Sort direction ('asc' or 'desc')
 * @returns Sorted array
 */
export function sortObjects<T>(
  items: T[],
  field: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    
    // Handle date strings
    if (typeof aValue === 'string' && typeof bValue === 'string' && 
        /^\d{4}-\d{2}-\d{2}/.test(aValue) && /^\d{4}-\d{2}-\d{2}/.test(bValue)) {
      const dateA = new Date(aValue);
      const dateB = new Date(bValue);
      
      return direction === 'asc' 
        ? dateA.getTime() - dateB.getTime() 
        : dateB.getTime() - dateA.getTime();
    }
    
    // Handle numeric values in strings (like $10.00 or 20%)
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const numA = parseFloat(String(aValue).replace(/[^0-9.-]+/g, ''));
      const numB = parseFloat(String(bValue).replace(/[^0-9.-]+/g, ''));
      
      if (!isNaN(numA) && !isNaN(numB)) {
        return direction === 'asc' ? numA - numB : numB - numA;
      }
    }
    
    // Standard string comparison
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Highlights search terms within a text string
 * 
 * @param text Text to highlight within
 * @param searchTerm Term to highlight
 * @returns Object with parts array for rendering highlighted text
 */
export function highlightSearchTerms(text: string, searchTerm: string): { parts: { text: string, highlight: boolean }[] } {
  if (!searchTerm.trim()) {
    return { parts: [{ text, highlight: false }] };
  }
  
  const parts: { text: string; highlight: boolean }[] = [];
  const lowerText = text.toLowerCase();
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  let lastIndex = 0;
  let index = lowerText.indexOf(lowerSearchTerm);
  
  while (index !== -1) {
    // Add non-highlighted text before match
    if (index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, index),
        highlight: false
      });
    }
    
    // Add highlighted text
    parts.push({
      text: text.substring(index, index + searchTerm.length),
      highlight: true
    });
    
    lastIndex = index + searchTerm.length;
    index = lowerText.indexOf(lowerSearchTerm, lastIndex);
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      highlight: false
    });
  }
  
  return { parts };
} 