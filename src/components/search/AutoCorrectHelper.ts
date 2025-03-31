
export const getAutoCorrectSuggestion = (searchTerm: string): string | null => {
  if (!searchTerm || searchTerm.length < 3) return null;
  
  // More comprehensive auto-correct for common typos and misspellings
  const corrections: Record<string, string> = {
    // Cocktail-related typos
    'moktail': 'mocktail',
    'coctail': 'cocktail',
    'cocktaile': 'cocktail',
    'coctel': 'cocktail',
    'koktail': 'cocktail',
    
    // Popular mocktail names
    'mochito': 'mojito',
    'margerita': 'margarita',
    'margaryta': 'margarita',
    'daikiri': 'daiquiri',
    'dayquiri': 'daiquiri',
    'shirly': 'shirley',
    'pina': 'piña colada',
    'virgin morry': 'virgin mary',
    'cinderela': 'cinderella',
    
    // Ingredient-related typos
    'syrop': 'syrup',
    'juce': 'juice',
    'limon': 'lemon',
    'lime juce': 'lime juice',
    'pinaple': 'pineapple',
    'mintt': 'mint',
    'cinamon': 'cinnamon',
    'gingger': 'ginger',
    'berrys': 'berries'
  };
  
  // Check for exact matches in our corrections dictionary
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  // First try for an exact match
  if (corrections[lowerSearchTerm]) {
    return corrections[lowerSearchTerm];
  }
  
  // Then try for partial matches within the search term
  for (const [typo, correction] of Object.entries(corrections)) {
    if (lowerSearchTerm.includes(typo)) {
      const corrected = lowerSearchTerm.replace(typo, correction);
      return corrected;
    }
  }
  
  // Check for simple plural forms or common suffix variations
  if (lowerSearchTerm.endsWith('s') && corrections[lowerSearchTerm.slice(0, -1)]) {
    return corrections[lowerSearchTerm.slice(0, -1)];
  }
  
  // No correction found
  return null;
};

// Function to get common completions based on partial input
export const getSuggestionCompletions = (partialTerm: string): string[] => {
  if (!partialTerm || partialTerm.length < 2) return [];
  
  const commonTerms = [
    'mocktail', 'cocktail', 'virgin', 'alcohol-free', 'non-alcoholic',
    'mojito', 'margarita', 'daiquiri', 'colada', 'sour', 'cooler',
    'juice', 'syrup', 'mint', 'lime', 'lemon', 'berries', 'ginger',
    'tonic', 'soda', 'cinnamon', 'vanilla', 'coconut', 'tropical'
  ];
  
  const lowerPartial = partialTerm.toLowerCase();
  
  return commonTerms
    .filter(term => term.startsWith(lowerPartial) && term !== lowerPartial)
    .slice(0, 5); // Limit to 5 suggestions
};
