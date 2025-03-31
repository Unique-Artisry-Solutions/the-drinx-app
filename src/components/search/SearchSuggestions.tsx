
import React from 'react';
import { Command, CommandList } from "@/components/ui/command";
import { cn } from '@/lib/utils';
import SuggestionGroup from './SuggestionGroup';
import EmptySuggestion from './EmptySuggestion';
import { getAutoCorrectSuggestion } from './AutoCorrectHelper';

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

  // Get auto-correct suggestion if needed
  const autoCorrect = getAutoCorrectSuggestion(searchTerm);

  return (
    <div className={cn(
      "absolute z-50 w-full mt-1 rounded-xl bg-white border shadow-md",
      !isOpen && "hidden"
    )}>
      <Command>
        <CommandList>
          <EmptySuggestion 
            searchTerm={searchTerm} 
            autoCorrect={autoCorrect} 
            onSelect={onSelect} 
          />

          <SuggestionGroup 
            heading="Cocktails" 
            items={cocktails} 
            onSelect={onSelect} 
          />

          <SuggestionGroup 
            heading="Establishments" 
            items={establishments} 
            onSelect={onSelect} 
          />

          <SuggestionGroup 
            heading="Ingredients" 
            items={ingredients} 
            onSelect={onSelect} 
          />
        </CommandList>
      </Command>
    </div>
  );
};

export default SearchSuggestions;
