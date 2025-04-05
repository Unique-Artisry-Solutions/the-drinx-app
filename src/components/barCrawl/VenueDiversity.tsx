
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface VenueDiversityProps {
  diversityPreference: number;
  onDiversityChange: (value: number) => void;
}

const VenueDiversity: React.FC<VenueDiversityProps> = ({ diversityPreference, onDiversityChange }) => {
  const venueTypes = [
    { min: 0, max: 20, label: "Similar venues", description: "Focus on one type of establishment" },
    { min: 21, max: 60, label: "Balanced mix", description: "Good variety with some consistency" },
    { min: 61, max: 100, label: "Maximum variety", description: "Wide range from upscale bars to cozy cafes" }
  ];
  
  const getCurrentPreferenceLabel = () => {
    const current = venueTypes.find(
      type => diversityPreference >= type.min && diversityPreference <= type.max
    );
    return current || venueTypes[0];
  };
  
  const currentPreference = getCurrentPreferenceLabel();
  
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-lg font-medium mb-1">Venue Diversity</Label>
        <p className="text-sm text-muted-foreground">Control how diverse the establishments in your Swig Circuit will be</p>
      </div>
      
      <div className="pt-4 pb-2">
        <Slider 
          defaultValue={[diversityPreference]} 
          max={100} 
          step={1} 
          onValueChange={(value) => onDiversityChange(value[0])}
          className="my-4"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Similar venues</span>
          <span>Balanced mix</span>
          <span>Maximum variety</span>
        </div>
      </div>
      
      <div className="bg-muted/30 p-3 rounded-lg border">
        <div className="flex items-center">
          <Badge variant="outline" className="mr-2 bg-background">
            {diversityPreference}%
          </Badge>
          <span className="font-medium">{currentPreference.label}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {currentPreference.description}
        </p>
      </div>
    </div>
  );
};

export default VenueDiversity;
