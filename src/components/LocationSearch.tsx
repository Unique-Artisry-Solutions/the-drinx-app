import React, { useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LocationSearchProps {
  onSearch: (query: string) => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSearch} className="relative mb-4">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-material-on-surface-variant" size={18} />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for locations..."
          className="w-full pl-10 pr-16 py-2"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 text-material-on-surface-variant hover:text-material-primary"
          >
            <X size={18} />
          </button>
        )}
        <Button 
          type="submit" 
          variant="ghost" 
          className="absolute right-0 top-0 h-full rounded-l-none"
        >
          <Search size={18} />
        </Button>
      </div>
    </form>
  );
};

// Keep default export for backward compatibility during transition
export default LocationSearch;
