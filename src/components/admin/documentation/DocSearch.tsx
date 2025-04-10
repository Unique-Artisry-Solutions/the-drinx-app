
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DocSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DocSearch: React.FC<DocSearchProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative max-w-md mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="search"
        placeholder="Search documentation..."
        className="pl-10 pr-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default DocSearch;
