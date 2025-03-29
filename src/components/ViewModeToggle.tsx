
import React from 'react';
import { Button } from '@/components/ui/button';
import { Map, List } from 'lucide-react';

export interface ViewModeToggleProps {
  viewMode: 'map' | 'list';
  onViewModeChange: (mode: 'map' | 'list') => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant={viewMode === 'map' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => onViewModeChange('map')}
      >
        <Map size={16} className="mr-2" />
        Map
      </Button>
      <Button 
        variant={viewMode === 'list' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => onViewModeChange('list')}
      >
        <List size={16} className="mr-2" />
        List
      </Button>
    </div>
  );
};

export default ViewModeToggle;
