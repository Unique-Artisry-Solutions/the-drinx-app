
import React from 'react';
import { CommandEmpty } from "@/components/ui/command";

interface EmptySuggestionProps {
  searchTerm: string;
  autoCorrect: string | null;
  onSelect: (value: string) => void;
}

const EmptySuggestion: React.FC<EmptySuggestionProps> = ({
  searchTerm,
  autoCorrect,
  onSelect
}) => {
  return (
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
  );
};

export default EmptySuggestion;
