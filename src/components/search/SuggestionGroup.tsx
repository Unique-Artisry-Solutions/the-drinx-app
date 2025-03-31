
import React from 'react';
import { CommandGroup, CommandItem } from "@/components/ui/command";

interface SuggestionItem {
  value: string;
  label: string;
  type: 'cocktail' | 'establishment' | 'ingredient';
}

interface SuggestionGroupProps {
  heading: string;
  items: SuggestionItem[];
  onSelect: (value: string) => void;
}

const SuggestionGroup: React.FC<SuggestionGroupProps> = ({
  heading,
  items,
  onSelect
}) => {
  if (items.length === 0) return null;
  
  return (
    <CommandGroup heading={heading}>
      {items.map((item) => (
        <CommandItem
          key={`${item.type}-${item.value}`}
          value={item.value}
          onSelect={() => onSelect(item.value)}
        >
          {item.label}
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

export default SuggestionGroup;
