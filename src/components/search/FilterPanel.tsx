
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  priceRange: [number, number];
  distance: number;
  onPriceRangeChange: (range: [number, number]) => void;
  onDistanceChange: (distance: number) => void;
  onApplyFilters: () => void;
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  priceRange,
  distance,
  onPriceRangeChange,
  onDistanceChange,
  onApplyFilters,
  className
}) => {
  return (
    <div className={cn("mt-3 p-4 bg-white rounded-xl elevation-2 animate-slide-down shadow-md z-10", className)}>
      <h4 className="text-sm font-medium text-material-on-surface mb-3">Filters</h4>
      
      <div className="mb-4">
        <label className="text-xs text-material-on-surface-variant block mb-2">
          Maximum Price Range: ${priceRange[1]}
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={priceRange[1]}
          onChange={(e) => {
            const newValue = parseInt(e.target.value);
            onPriceRangeChange([priceRange[0], newValue]);
          }}
          className="w-full h-2 bg-material-surface-variant rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div className="mb-4">
        <label className="text-xs text-material-on-surface-variant block mb-2">
          Maximum Distance: {distance} miles
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={distance}
          onChange={(e) => {
            onDistanceChange(parseInt(e.target.value));
          }}
          className="w-full h-2 bg-material-surface-variant rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <Button
        type="button"
        onClick={onApplyFilters}
        className="w-full bg-material-primary text-material-on-primary rounded-full py-2 text-sm font-medium"
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default FilterPanel;
