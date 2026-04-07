
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface DistanceFilterProps {
  maxDistance: number;
  onDistanceChange: (value: number) => void;
}

const DistanceFilter: React.FC<DistanceFilterProps> = ({ maxDistance, onDistanceChange }) => {
  const getDistanceDescription = (distance: number): string => {
    if (distance <= 5) return "Nearby establishments within walking distance";
    if (distance <= 10) return "Short drive or transit ride away";
    if (distance <= 15) return "Medium distance, accessible by car";
    return "Wider area, longer travel times";
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-lg font-medium mb-1">Distance Filter</Label>
        <p className="text-sm text-muted-foreground">Select venues within this distance from your location</p>
      </div>
      
      <div className="pt-4 pb-2">
        <Slider 
          defaultValue={[maxDistance]} 
          min={1}
          max={20} 
          step={1} 
          onValueChange={(value) => onDistanceChange(value[0])}
          className="my-4"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 mile</span>
          <span>10 miles</span>
          <span>20 miles</span>
        </div>
      </div>
      
      <div className="bg-muted/30 p-3 rounded-lg border">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
          <Badge variant="outline" className="mr-2 bg-background">
            {maxDistance} {maxDistance === 1 ? 'mile' : 'miles'}
          </Badge>
          <span className="font-medium">Search Radius</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {getDistanceDescription(maxDistance)}
        </p>
      </div>
    </div>
  );
};

export default DistanceFilter;
