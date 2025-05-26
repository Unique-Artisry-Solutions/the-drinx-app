
import React from 'react';
import { Command, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
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

  return (
    <div className={cn(
      "absolute z-50 w-full mt-1 rounded-xl bg-white border shadow-md",
      !isOpen && "hidden"
    )}>
      <Command>
        <CommandList>
          <CommandEmpty>
            <p className="px-2 py-3 text-sm">No results found</p>
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
