
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  priceRange: [number, number];
  distance: number;
  onPriceRangeChange: (value: [number, number]) => void;
  onDistanceChange: (value: number) => void;
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
  // Track when user is currently sliding to prevent firing queries too frequently
  const [isDragging, setIsDragging] = React.useState(false);
  
  // Handle slider mousedown - start of drag
  const handleDragStart = () => {
    setIsDragging(true);
  };
  
  // Handle slider mouseup - end of drag
  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      // Fire query when user lifts mouse button after sliding
      onApplyFilters();
    }
  };
  
  // Add mouseup event listener to document to catch all mouseup events
  React.useEffect(() => {
    document.addEventListener('mouseup', handleDragEnd);
    return () => {
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  return (
    <div className={cn("mt-2 p-4 bg-white border rounded-lg shadow-sm", className)}>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </label>
        <Slider 
          onMouseDown={handleDragStart}
          value={[priceRange[0], priceRange[1]]}
          min={0}
          max={50}
          step={1}
          onValueChange={(values) => {
            onPriceRangeChange([values[0], values[1]]);
          }}
          className="my-4"
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">
          Distance: {distance} miles
        </label>
        <Slider 
          onMouseDown={handleDragStart}
          value={[distance]}
          min={1}
          max={20}
          step={1}
          onValueChange={(values) => {
            onDistanceChange(values[0]);
          }}
          className="my-4"
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onApplyFilters}
          size="sm"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;
