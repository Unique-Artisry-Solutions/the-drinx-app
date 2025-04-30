
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, RefreshCw, Filter } from 'lucide-react';

interface UserFilterProps {
  filter: {
    searchTerm: string;
    tierFilter: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    segment?: string;
  };
  onFilterChange: (filter: any) => void;
  onRefresh: () => void;
}

export const UserFilter = ({ filter, onFilterChange, onRefresh }: UserFilterProps) => {
  const [tiers, setTiers] = useState<{ id: string; name: string }[]>([]);
  const [segments, setSegments] = useState<{ id: string; name: string }[]>([
    { id: 'active', name: 'Active Users' },
    { id: 'new', name: 'New Users' },
    { id: 'dormant', name: 'Dormant Users' },
    { id: 'high_value', name: 'High Value Users' }
  ]);
  
  useEffect(() => {
    // Fetch available tiers for filtering
    const fetchTiers = async () => {
      try {
        const { data, error } = await supabase
          .from('reward_tiers')
          .select('id, name')
          .order('points_required', { ascending: true });
          
        if (error) throw error;
        setTiers(data || []);
      } catch (error) {
        console.error('Error fetching tiers:', error);
      }
    };
    
    fetchTiers();
  }, []);

  const handleChange = (key: string, value: any) => {
    onFilterChange({
      ...filter,
      [key]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-9"
          value={filter.searchTerm}
          onChange={(e) => handleChange('searchTerm', e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tier</Label>
          <Select 
            value={filter.tierFilter}
            onValueChange={(value) => handleChange('tierFilter', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All tiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All tiers</SelectItem>
              {tiers.map(tier => (
                <SelectItem key={tier.id} value={tier.id}>
                  {tier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>User Segment</Label>
          <Select 
            value={filter.segment || ''}
            onValueChange={(value) => handleChange('segment', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All users</SelectItem>
              {segments.map(segment => (
                <SelectItem key={segment.id} value={segment.id}>
                  {segment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sort by</Label>
          <Select 
            value={filter.sortBy}
            onValueChange={(value) => handleChange('sortBy', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="points">Current Points</SelectItem>
              <SelectItem value="lifetime_points">Lifetime Points</SelectItem>
              <SelectItem value="updated_at">Last Activity</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Direction</Label>
          <Select 
            value={filter.sortOrder}
            onValueChange={(value) => handleChange('sortOrder', value as 'asc' | 'desc')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Highest first</SelectItem>
              <SelectItem value="asc">Lowest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onFilterChange({
            searchTerm: '',
            tierFilter: '',
            segment: '',
            sortBy: 'points',
            sortOrder: 'desc'
          })}
        >
          Reset filters
        </Button>
        
        <Button 
          variant="default" 
          size="sm" 
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>
    </div>
  );
};
