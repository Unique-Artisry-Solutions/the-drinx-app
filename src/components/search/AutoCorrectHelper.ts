
export const getAutoCorrectSuggestion = (searchTerm: string): string | null => {
  if (!searchTerm || searchTerm.length < 3) return null;
  
  // Simple auto-correct for common typos (can be expanded)
  const corrections: Record<string, string> = {
    'moktail': 'mocktail',
    'coctail': 'cocktail',
    'mochito': 'mojito',
    'margerita': 'margarita',
    'daikiri': 'daiquiri'
  };
  
  for (const [typo, correction] of Object.entries(corrections)) {
    if (searchTerm.toLowerCase().includes(typo)) {
      const corrected = searchTerm.toLowerCase().replace(typo, correction);
      return corrected;
    }
  }
  
  return null;
};
