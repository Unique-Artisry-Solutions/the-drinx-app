
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import SearchSuggestions from './SearchSuggestions';
import { getSuggestionCompletions } from './AutoCorrectHelper';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  onClear: () => void;
  suggestions: Array<{
    value: string;
    label: string;
    type: 'cocktail' | 'establishment' | 'ingredient';
  }>;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearch,
  onClear,
  suggestions,
  className
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [autoCompleteSuggestions, setAutoCompleteSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const completions = getSuggestionCompletions(value);
      setAutoCompleteSuggestions(completions);
    } else {
      setAutoCompleteSuggestions([]);
    }
  }, [value]);

  const enhancedSuggestions = [
    ...autoCompleteSuggestions.map(term => ({
      value: term,
      label: term,
      type: 'autocomplete' as 'cocktail' | 'establishment' | 'ingredient'
    })), 
    ...suggestions
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    console.log('SearchInput - form submitted with value:', value);
    onSearch(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (newValue.length > 1) {
      setShowSuggestions(true);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        console.log(`SearchInput - debounced search for: "${newValue}"`);
        onSearch(newValue);
      }, 300);
    } else {
      setShowSuggestions(false);
      if (newValue === '') {
        onSearch('');
      }
    }
  };

  const handleSuggestionSelect = (selectedValue: string) => {
    console.log('SearchInput - suggestion selected:', selectedValue);
    onChange(selectedValue);
    setShowSuggestions(false);
    onSearch(selectedValue);
  };

  const handleClearClick = () => {
    console.log('SearchInput - clear button clicked');
    onClear();
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => value.length > 1 && setShowSuggestions(true)}
            placeholder="Search cocktails or establishments..."
            className={cn(
              "w-full pl-10 pr-14 py-3 rounded-full border border-input",
              "bg-background text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "transition-colors"
            )}
          />
          {value && (
            <button
              type="button"
              onClick={handleClearClick}
              className="absolute right-14 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>
      
      <SearchSuggestions 
        suggestions={enhancedSuggestions} 
        isOpen={showSuggestions} 
        onSelect={handleSuggestionSelect} 
        onOpenChange={setShowSuggestions} 
        searchTerm={value} 
      />
    </div>
  );
};

export default SearchInput;
