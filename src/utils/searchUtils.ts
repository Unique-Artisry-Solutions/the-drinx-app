
import Fuse from 'fuse.js';

// Simplified search item interface
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

// Simplified fuse options
const fuseOptions = {
  keys: ['name', 'description', 'ingredients', 'establishment.name'],
  threshold: 0.3,
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
 * Performs fuzzy search and returns results
 */
export function performAdvancedSearch(
  items: SearchableItem[],
  query: string,
  fuse: Fuse<SearchableItem>
): SearchableItem[] {
  if (!query.trim()) return items;
  
  const results = fuse.search(query);
  return results.map(result => result.item);
}

/**
 * Extract basic search suggestions from data
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
    
    // Add unique ingredients
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
