
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Search } from 'lucide-react';

interface UserFilterProps {
  filter: {
    searchTerm: string;
    tierFilter: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  onFilterChange: (filter: any) => void;
  onRefresh: () => void;
}

export const UserFilter: React.FC<UserFilterProps> = ({ 
  filter, 
  onFilterChange, 
  onRefresh 
}) => {
  const [tiers, setTiers] = useState<{ id: string; name: string; }[]>([]);
  const [isLoadingTiers, setIsLoadingTiers] = useState(false);
  const [searchInput, setSearchInput] = useState(filter.searchTerm);

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    setIsLoadingTiers(true);
    try {
      const { data, error } = await supabase
        .from('reward_tiers')
        .select('id, name')
        .order('points_required', { ascending: true });
        
      if (error) throw error;
      
      setTiers(data || []);
    } catch (error) {
      console.error('Error fetching tiers:', error);
    } finally {
      setIsLoadingTiers(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filter, searchTerm: searchInput });
  };

  const handleTierChange = (value: string) => {
    onFilterChange({ ...filter, tierFilter: value });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    onFilterChange({ 
      ...filter, 
      sortBy, 
      sortOrder: sortOrder as 'asc' | 'desc' 
    });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button type="submit">Search</Button>
        <Button type="button" variant="outline" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <div className="w-full sm:w-auto flex-1">
          <Select
            value={filter.tierFilter}
            onValueChange={handleTierChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Tiers</SelectItem>
              {tiers.map(tier => (
                <SelectItem key={tier.id} value={tier.id}>
                  {tier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-auto flex-1">
          <Select 
            value={`${filter.sortBy}-${filter.sortOrder}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="points-desc">Points (High to Low)</SelectItem>
              <SelectItem value="points-asc">Points (Low to High)</SelectItem>
              <SelectItem value="lifetime_points-desc">Lifetime Points (High to Low)</SelectItem>
              <SelectItem value="lifetime_points-asc">Lifetime Points (Low to High)</SelectItem>
              <SelectItem value="updated_at-desc">Last Activity (Recent First)</SelectItem>
              <SelectItem value="updated_at-asc">Last Activity (Oldest First)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
