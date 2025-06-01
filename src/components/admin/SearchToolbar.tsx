
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Search, Filter } from 'lucide-react';

interface SearchToolbarProps {
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
  placeholder?: string;
}

const SearchToolbar: React.FC<SearchToolbarProps> = ({
  onSearch,
  onFilter,
  placeholder = "Search..."
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterClick = () => {
    // Placeholder filter functionality
    onFilter({
      status: 'active',
      category: 'all'
    });
  };

  // Mock suggestions for demonstration
  const suggestions = [
    'Recent searches',
    'Popular items',
    'Trending topics'
  ];

  return (
    <div className="flex items-center space-x-2 p-4 border-b">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="pl-8"
        />
        
        {isOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 bg-white border rounded-md shadow-lg mt-1">
            <Command>
              <CommandList>
                <CommandEmpty>No suggestions found.</CommandEmpty>
                <CommandGroup>
                  {suggestions.map((suggestion, index) => (
                    <CommandItem 
                      key={index}
                      onSelect={() => {
                        handleSearch(suggestion);
                        setIsOpen(false);
                      }}
                    >
                      {suggestion}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}
      </div>
      
      <Button variant="outline" onClick={handleFilterClick}>
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </Button>
    </div>
  );
};

export default SearchToolbar;
