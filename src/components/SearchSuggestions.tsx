
import React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchSuggestion {
  value: string;
  label: string;
  type: 'cocktail' | 'establishment' | 'ingredient';
}

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  isOpen: boolean;
  onSelect: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  searchTerm: string;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  isOpen,
  onSelect,
  onOpenChange,
  searchTerm
}) => {
  // Group suggestions by type
  const cocktails = suggestions.filter(item => item.type === 'cocktail');
  const establishments = suggestions.filter(item => item.type === 'establishment');
  const ingredients = suggestions.filter(item => item.type === 'ingredient');

  // Handle empty state with auto-correct suggestion if needed
  const getAutoCorrectSuggestion = () => {
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

  const autoCorrect = getAutoCorrectSuggestion();

  return (
    <div className={cn(
      "absolute z-50 w-full mt-1 rounded-xl bg-white border shadow-md",
      !isOpen && "hidden"
    )}>
      <Command>
        <CommandList>
          <CommandEmpty>
            {autoCorrect ? (
              <div className="px-2 py-3 text-sm">
                <p>No results found for "{searchTerm}"</p>
                <button 
                  onClick={() => onSelect(autoCorrect)} 
                  className="mt-1 text-material-primary hover:underline"
                >
                  Did you mean "{autoCorrect}"?
                </button>
              </div>
            ) : (
              <p className="px-2 py-3 text-sm">No results found</p>
            )}
          </CommandEmpty>

          {cocktails.length > 0 && (
            <CommandGroup heading="Cocktails">
              {cocktails.map((item) => (
                <CommandItem
                  key={`${item.type}-${item.value}`}
                  value={item.value}
                  onSelect={() => onSelect(item.value)}
                >
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {establishments.length > 0 && (
            <CommandGroup heading="Establishments">
              {establishments.map((item) => (
                <CommandItem
                  key={`${item.type}-${item.value}`}
                  value={item.value}
                  onSelect={() => onSelect(item.value)}
                >
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {ingredients.length > 0 && (
            <CommandGroup heading="Ingredients">
              {ingredients.map((item) => (
                <CommandItem
                  key={`${item.type}-${item.value}`}
                  value={item.value}
                  onSelect={() => onSelect(item.value)}
                >
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
};

export default SearchSuggestions;
