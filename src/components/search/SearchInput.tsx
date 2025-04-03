import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import SearchSuggestions from './SearchSuggestions';
import { getSuggestionCompletions, getAutoCorrectSuggestion } from './AutoCorrectHelper';
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
  const [isDragging, setIsDragging] = useState(false);
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
  const enhancedSuggestions = [...autoCompleteSuggestions.map(term => ({
    value: term,
    label: term,
    type: 'autocomplete' as 'cocktail' | 'establishment' | 'ingredient'
  })), ...suggestions];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(value);
    console.log(`Search submitted: "${value}"`);
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
        console.log(`Debounced search for: "${newValue}"`);
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
    onChange(selectedValue);
    setShowSuggestions(false);
    onSearch(selectedValue);
  };
  const handleMouseDown = () => {
    setIsDragging(true);
  };
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onSearch(value);
    }
  };
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, value]);
  return <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-material-outline" size={20} />
          <input ref={inputRef} type="text" value={value} onChange={handleInputChange} onMouseDown={handleMouseDown} onFocus={() => value.length > 1 && setShowSuggestions(true)} placeholder="Search cocktails or establishments..." className="w-full pl-10 pr-14 py-3 rounded-full border border-material-outline focus:outline-none focus:ring-2 focus:ring-material-primary bg-indigo-950" />
          {value && <button type="button" onClick={onClear} className="absolute right-14 top-1/2 transform -translate-y-1/2 text-material-outline hover:text-material-on-surface">
              <X size={16} />
            </button>}
        </div>
      </form>
      
      <SearchSuggestions suggestions={enhancedSuggestions} isOpen={showSuggestions} onSelect={handleSuggestionSelect} onOpenChange={setShowSuggestions} searchTerm={value} />
    </div>;
};
export default SearchInput;