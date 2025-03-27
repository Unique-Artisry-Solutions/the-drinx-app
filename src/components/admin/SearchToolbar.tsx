
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchToolbar: React.FC<SearchToolbarProps> = ({ 
  searchTerm, 
  onSearchChange 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-medium">Manage Data</h2>
      <div className="flex space-x-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-material-on-surface-variant" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button onClick={() => navigate('/add')}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
    </div>
  );
};

export default SearchToolbar;
