
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Check } from 'lucide-react';
import Fuse from 'fuse.js';

// Common cocktail ingredients for suggestions
const COMMON_INGREDIENTS = [
  'Lemon Juice', 'Lime Juice', 'Orange Juice', 'Pineapple Juice',
  'Cranberry Juice', 'Tomato Juice', 'Grapefruit Juice',
  'Simple Syrup', 'Honey Syrup', 'Agave Syrup', 'Grenadine',
  'Soda Water', 'Tonic Water', 'Ginger Beer', 'Sprite', 'Cola',
  'Coconut Cream', 'Milk', 'Cream', 'Egg White',
  'Fresh Mint', 'Fresh Basil', 'Cucumber', 'Jalapeño',
  'Blue Curaçao Syrup', 'Vanilla Extract', 'Cinnamon', 'Nutmeg',
  'Salt', 'Sugar', 'Bitters', 'Angostura Bitters', 'Orange Bitters'
];

interface IngredientInputProps {
  value: string[];
  onChange: (ingredients: string[]) => void;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Create fuzzy search instance directly with Fuse
  const fuse = useRef<Fuse<string>>(
    new Fuse(COMMON_INGREDIENTS, {
      threshold: 0.4,
      includeScore: true,
    })
  );

  // Handle input change and filter suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    
    if (query.trim()) {
      const results = fuse.current.search(query);
      // Filter out already selected ingredients
      const filteredResults = results
        .map(result => result.item)
        .filter(item => !value.includes(item));
      setSuggestions(filteredResults);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Add a new ingredient
  const addIngredient = (ingredient: string) => {
    const trimmed = ingredient.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  // Remove an ingredient
  const removeIngredient = (ingredientToRemove: string) => {
    onChange(value.filter(ingredient => ingredient !== ingredientToRemove));
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If Enter is pressed and there's input
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        // Select the highlighted suggestion
        addIngredient(suggestions[selectedIndex]);
      } else if (inputValue.trim()) {
        // Add whatever is typed
        addIngredient(inputValue);
      }
    } 
    // If Tab is pressed and there's a selected suggestion
    else if (e.key === 'Tab' && selectedIndex >= 0 && selectedIndex < suggestions.length) {
      e.preventDefault();
      addIngredient(suggestions[selectedIndex]);
    }
    // If Backspace is pressed and input is empty
    else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeIngredient(value[value.length - 1]);
    }
    // Arrow down - navigate to next suggestion
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }
    // Arrow up - navigate to previous suggestion
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }
  };

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 p-1 bg-background border rounded-md min-h-10 items-center">
        {/* Ingredient tags */}
        {value.map(ingredient => (
          <Badge key={ingredient} variant="secondary" className="flex items-center gap-1">
            {ingredient}
            <button 
              type="button"
              onClick={() => removeIngredient(ingredient)}
              className="rounded-full hover:bg-muted p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        {/* Input field */}
        <div className="relative flex-1 min-w-[120px]">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue.trim() && setShowSuggestions(true)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto py-1"
            placeholder={value.length > 0 ? "Add more ingredients..." : "Type ingredient name..."}
          />
          
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute z-50 mt-1 w-full bg-popover border rounded-md shadow-md max-h-48 overflow-y-auto"
            >
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={suggestion}
                    className={`px-3 py-2 cursor-pointer flex items-center justify-between ${
                      index === selectedIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
                    }`}
                    onClick={() => addIngredient(suggestion)}
                  >
                    {suggestion}
                    {index === selectedIndex && <Check className="h-4 w-4" />}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Helper text */}
      <p className="text-xs text-muted-foreground mt-1">
        Press Enter to add. Use arrow keys to navigate suggestions.
      </p>
    </div>
  );
};

export default IngredientInput;
