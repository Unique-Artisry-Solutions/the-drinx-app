
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
  const [isDragging, setIsDragging] = React.useState(false);
  
  const handleDragStart = () => {
    setIsDragging(true);
  };
  
  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };
  
  React.useEffect(() => {
    document.addEventListener('mouseup', handleDragEnd);
    return () => {
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  const handleApplyClick = () => {
    console.log('FilterPanel - Apply button clicked');
    onApplyFilters();
  };

  return (
    <div className={cn(
      "mt-2 p-4 rounded-lg shadow-lg border animate-in slide-in-from-top-2",
      isDarkTheme 
        ? "bg-gray-800 border-gray-700" 
        : "bg-white border-gray-200",
      className
    )}>
      <div className="mb-4">
        <label className={cn(
          "block mb-2 text-sm font-medium",
          isDarkTheme ? "text-gray-200" : "text-gray-700"
        )}>
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </label>
        <Slider 
          onMouseDown={handleDragStart}
          value={[priceRange[0], priceRange[1]]}
          min={0}
          max={50}
          step={1}
          onValueChange={(values) => {
            console.log('Price range changed:', values);
            onPriceRangeChange([values[0], values[1]]);
          }}
          className="my-4"
        />
      </div>
      
      <div className="mb-4">
        <label className={cn(
          "block mb-2 text-sm font-medium",
          isDarkTheme ? "text-gray-200" : "text-gray-700"
        )}>
          Distance: {distance} miles
        </label>
        <Slider 
          onMouseDown={handleDragStart}
          value={[distance]}
          min={1}
          max={20}
          step={1}
          onValueChange={(values) => {
            console.log('Distance changed:', values[0]);
            onDistanceChange(values[0]);
          }}
          className="my-4"
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleApplyClick}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;
