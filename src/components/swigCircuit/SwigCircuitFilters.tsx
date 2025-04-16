
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SwigCircuitFiltersProps {
  searchTerm: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SwigCircuitFilters: React.FC<SwigCircuitFiltersProps> = ({
  searchTerm,
  handleSearch
}) => {
  return (
    <div className="bg-gradient-to-r from-spiritless-pink/20 to-spiritless-green/20 p-5 rounded-lg border border-spiritless-pink/30 mb-8 shadow-md">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search circuits by name or theme..." 
            className="pl-10 bg-white/80 backdrop-blur-sm border-transparent focus:border-spiritless-pink/50 focus-visible:ring-offset-1" 
            value={searchTerm} 
            onChange={handleSearch}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2 bg-white/80 backdrop-blur-sm">
          <Filter size={16} />
          Filters
        </Button>
      </div>
    </div>
  );
};

export default SwigCircuitFilters;
