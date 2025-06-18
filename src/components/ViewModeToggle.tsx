
import React from 'react';
import { Button } from '@/components/ui/button';
import { Map, List, Grid3X3 } from 'lucide-react';
import { ViewMode } from '@/types/ExploreTypes';

export interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex gap-2 bg-muted rounded-lg p-1">
      <Button 
        variant={viewMode === 'map' ? 'default' : 'ghost'} 
        size="sm"
        onClick={() => onViewModeChange('map')}
        className="gap-2"
      >
        <Map size={16} />
        Map
      </Button>
      <Button 
        variant={viewMode === 'list' ? 'default' : 'ghost'} 
        size="sm"
        onClick={() => onViewModeChange('list')}
        className="gap-2"
      >
        <List size={16} />
        List
      </Button>
      <Button 
        variant={viewMode === 'grid' ? 'default' : 'ghost'} 
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className="gap-2"
      >
        <Grid3X3 size={16} />
        Grid
      </Button>
    </div>
  );
};

export default ViewModeToggle;
