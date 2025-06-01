
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SearchToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  title?: string;
  addButtonLink?: string;
  addButtonText?: string;
  suggestions?: string[];
  onClear?: () => void;
}

const SearchToolbar: React.FC<SearchToolbarProps> = ({ 
  searchTerm, 
  onSearchChange,
  title = "Manage Data",
  addButtonLink = "/add",
  addButtonText = "Add New",
  suggestions = [],
  onClear
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(searchTerm);
  
  useEffect(() => {
    setValue(searchTerm);
  }, [searchTerm]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearchChange(newValue);
  };

  const handleClear = () => {
    setValue('');
    onSearchChange('');
    if (onClear) onClear();
    toast({
      title: "Search cleared",
      description: "The search filter has been reset."
    });
  };

  const handleSelectSuggestion = (selected: string) => {
    setValue(selected);
    onSearchChange(selected);
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-medium">{title}</h2>
      <div className="flex space-x-2">
        <div className="relative">
          {suggestions.length > 0 ? (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-material-on-surface-variant" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-8 pr-8"
                    value={value}
                    onChange={handleSearchInput}
                    onClick={() => value && setOpen(true)}
                  />
                  {value && (
                    <button 
                      onClick={handleClear}
                      className="absolute right-2.5 top-2.5 h-4 w-4 text-material-on-surface-variant"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="end">
                <Command>
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {suggestions
                        .filter(item => 
                          item.toLowerCase().includes(value.toLowerCase())
                        )
                        .map((item) => (
                          <CommandItem
                            key={item}
                            onSelect={() => handleSelectSuggestion(item)}
                          >
                            {item}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-material-on-surface-variant" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 pr-8"
                value={value}
                onChange={handleSearchInput}
              />
              {value && (
                <button 
                  onClick={handleClear}
                  className="absolute right-2.5 top-2.5 h-4 w-4 text-material-on-surface-variant"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}
        </div>
        <Button onClick={() => navigate(addButtonLink)}>
          <Plus className="mr-2 h-4 w-4" /> {addButtonText}
        </Button>
      </div>
    </div>
  );
};

export default SearchToolbar;
