
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilters {
  query: string;
  status: string;
  complexity: string;
  userImpact: string;
  category: string;
}

interface AdvancedSearchPanelProps {
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
  totalResults: number;
  totalFeatures: number;
}

const AdvancedSearchPanel: React.FC<AdvancedSearchPanelProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  activeFilterCount,
  totalResults,
  totalFeatures
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search & Filters
          </div>
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {totalResults} of {totalFeatures} features
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClearFilters}
                className="h-8"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters ({activeFilterCount})
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search Query */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-2">Search Features</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, description, or ID..."
                value={filters.query}
                onChange={(e) => onFilterChange('query', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="all">All Statuses</option>
              <option value="implemented">Implemented</option>
              <option value="in_progress">In Progress</option>
              <option value="planned">Planned</option>
            </select>
          </div>

          {/* Complexity Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Complexity</label>
            <select
              value={filters.complexity}
              onChange={(e) => onFilterChange('complexity', e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="all">All Complexity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* User Impact Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">User Impact</label>
            <select
              value={filters.userImpact}
              onChange={(e) => onFilterChange('userImpact', e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="all">All Impact</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium">Active Filters:</span>
              {filters.query && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Search: "{filters.query}"
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onFilterChange('query', '')}
                  />
                </Badge>
              )}
              {filters.status !== 'all' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Status: {filters.status}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onFilterChange('status', 'all')}
                  />
                </Badge>
              )}
              {filters.complexity !== 'all' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Complexity: {filters.complexity}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onFilterChange('complexity', 'all')}
                  />
                </Badge>
              )}
              {filters.userImpact !== 'all' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Impact: {filters.userImpact}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onFilterChange('userImpact', 'all')}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedSearchPanel;
