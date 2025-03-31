
import Fuse from 'fuse.js';

// Type for search items
export interface SearchableItem {
  id: string;
  name: string;
  description?: string;
  ingredients?: string[];
  establishment?: {
    name: string;
  };
  [key: string]: any;
}

// Configure Fuse.js for fuzzy searching
const fuseOptions = {
  keys: ['name', 'description', 'ingredients', 'establishment.name'],
  threshold: 0.4, // Lower threshold = stricter matching
  ignoreLocation: true,
  includeScore: true,
};

/**
 * Creates a fuzzy search instance
 */
export function createFuzzySearch(items: SearchableItem[]) {
  return new Fuse(items, fuseOptions);
}

/**
 * Performs fuzzy search on items
 */
export function fuzzySearch(fuse: Fuse<SearchableItem>, query: string): SearchableItem[] {
  if (!query.trim()) return [];
  
  const results = fuse.search(query);
  return results.map(result => result.item);
}

/**
 * Extract search suggestions from cocktails and establishments
 */
export function extractSearchSuggestions(
  cocktails: any[],
  establishments: any[]
): Array<{ value: string; label: string; type: 'cocktail' | 'establishment' | 'ingredient' }> {
  const suggestions: Array<{ value: string; label: string; type: 'cocktail' | 'establishment' | 'ingredient' }> = [];
  
  // Add cocktail names
  cocktails.forEach(cocktail => {
    suggestions.push({
      value: cocktail.name,
      label: cocktail.name,
      type: 'cocktail'
    });
    
    // Add unique ingredients from cocktails
    if (cocktail.ingredients && Array.isArray(cocktail.ingredients)) {
      cocktail.ingredients.forEach((ingredient: string) => {
        if (!suggestions.some(s => s.type === 'ingredient' && s.value === ingredient)) {
          suggestions.push({
            value: ingredient,
            label: ingredient,
            type: 'ingredient'
          });
        }
      });
    }
  });
  
  // Add establishment names
  establishments.forEach(establishment => {
    suggestions.push({
      value: establishment.name,
      label: establishment.name,
      type: 'establishment'
    });
  });
  
  return suggestions;
}

/**
 * Performs regex-based search
 */
export function regexSearch(items: SearchableItem[], pattern: string): SearchableItem[] {
  if (!pattern.trim()) return [];
  
  try {
    // Escape special regex characters if not explicitly using regex
    const isExplicitRegex = pattern.startsWith('/') && pattern.endsWith('/');
    const regexPattern = isExplicitRegex 
      ? new RegExp(pattern.slice(1, -1), 'i') 
      : new RegExp(pattern.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
    
    return items.filter(item => {
      // Search in name
      if (regexPattern.test(item.name)) return true;
      
      // Search in description
      if (item.description && regexPattern.test(item.description)) return true;
      
      // Search in ingredients
      if (item.ingredients && Array.isArray(item.ingredients)) {
        if (item.ingredients.some(ingredient => regexPattern.test(ingredient))) return true;
      }
      
      // Search in establishment name
      if (item.establishment && regexPattern.test(item.establishment.name)) return true;
      
      return false;
    });
  } catch (error) {
    console.error("Invalid regex pattern:", error);
    return [];
  }
}

/**
 * Detects if the search query is a regex pattern
 */
export function isRegexSearch(query: string): boolean {
  return query.startsWith('/') && query.endsWith('/') && query.length > 2;
}

/**
 * Performs a search using both fuzzy and regex methods
 */
export function performAdvancedSearch(
  items: SearchableItem[],
  query: string,
  fuse: Fuse<SearchableItem>
): SearchableItem[] {
  if (!query.trim()) return items;
  
  // Check if it's a regex search
  if (isRegexSearch(query)) {
    return regexSearch(items, query);
  }
  
  // Split the query into individual keywords for multi-term search
  const keywords = query.toLowerCase().split(/\s+/).filter(Boolean);
  
  // If it's a single keyword, just do a simple fuzzy search
  if (keywords.length === 1) {
    return fuzzySearch(fuse, query);
  }
  
  // For multiple keywords, combine results from each keyword
  const resultSets = keywords.map(keyword => 
    new Set(fuzzySearch(fuse, keyword).map(item => item.id))
  );
  
  // Find items that match all keywords
  return items.filter(item => 
    resultSets.every(set => set.has(item.id))
  );
}
