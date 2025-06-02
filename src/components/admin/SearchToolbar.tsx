
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

interface SearchToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  title?: string;
  addButtonText?: string;
  onAddClick?: () => void;
}

const SearchToolbar: React.FC<SearchToolbarProps> = ({ 
  searchTerm, 
  onSearchChange,
  title = "Search",
  addButtonText = "Add New",
  onAddClick
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-medium">{title}</h2>
      <div className="flex space-x-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {onAddClick && (
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" /> {addButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchToolbar;
