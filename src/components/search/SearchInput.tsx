
import React, { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import SearchSuggestions from './SearchSuggestions';

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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.length > 1);
    
    if (newValue === '') {
      onSearch('');
    }
  };

  const handleSuggestionSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setShowSuggestions(false);
    onSearch(selectedValue);
  };

  const handleClearClick = () => {
    onClear();
    setShowSuggestions(false);
    inputRef.current?.focus();
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
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            )}
          />
          {value && (
            <button
              type="button"
              onClick={handleClearClick}
              className="absolute right-14 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>
      
      <SearchSuggestions 
        suggestions={suggestions} 
        isOpen={showSuggestions} 
        onSelect={handleSuggestionSelect} 
        onOpenChange={setShowSuggestions} 
        searchTerm={value} 
      />
    </div>
  );
};

export default SearchInput;
